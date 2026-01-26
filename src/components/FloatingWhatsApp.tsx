import { X, ArrowLeft, Phone, Check, Clock } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_NUMBER, PHONE_NUMBER, BUSINESS_HOURS, FREE_DELIVERY_THRESHOLD, MAX_DELIVERY_DISTANCE_KM } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { useCart } from '@/context/CartContext';
import { useGuest } from '@/context/GuestContext';
import { menuData, promoCodes } from '@/data/menu';

// Constants
const HIDDEN_PAGES = ['/order-confirmation'];
const CHAT_STORAGE_KEY = '9yards_chat_history';
const USER_PREFS_KEY = '9yards_chat_prefs';
const CHAT_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Types - Extended action types for cleaner handling
type ActionType = 
  | 'start' | 'placeOrder' | 'deliveryInfo' | 'trackOrder' | 'faqs' | 'promoCodes' | 'deals'
  | 'faq1' | 'faq2' | 'faq3' | 'faq4' | 'faq5' | 'getName'
  | 'navigate' | 'whatsapp' | 'call' 
  | 'rate' | 'surprise' | 'reorder';

type FlowStep = 'start' | 'placeOrder' | 'deliveryInfo' | 'trackOrder' | 'faqs' | 'promoCodes' | 'getName' | 'rating';

interface MessageOption {
  key: string;
  label: string;
  action: ActionType;
  data?: string;
}

interface Message {
  id: string;
  type: 'received' | 'sent';
  content: string;
  time: string;
  options?: MessageOption[];
}

interface ChatState {
  messages: Message[];
  currentFlow: FlowStep;
  timestamp: number;
  lastContext?: string;
}

interface UserPrefs {
  name: string;
  visitCount: number;
  lastRating: number;
  lastOrderZone?: string;
}

// Helper: Check if currently peak hours
function isPeakHours(): boolean {
  const hour = new Date().getHours();
  return (hour >= 12 && hour < 14) || (hour >= 18 && hour < 20);
}

// Helper: Check if business is open
function isBusinessOpen(): boolean {
  const hour = new Date().getHours();
  return hour >= 10 && hour < 22;
}

// Helper: Format price
function formatPriceStatic(price: number): string {
  return 'UGX ' + new Intl.NumberFormat('en-UG').format(price);
}

// Helper: Get available promo codes for display
function getAvailablePromoCodes(): { code: string; description: string }[] {
  const codes: { code: string; description: string }[] = [];
  
  Object.entries(promoCodes).forEach(([code, details]) => {
    if (code === 'FREESHIP') {
      codes.push({ code, description: 'Free delivery on any order' });
    } else if (details.type === 'percentage') {
      const minText = details.minOrder ? ` (min ${formatPriceStatic(details.minOrder)})` : '';
      codes.push({ code, description: `${details.discount}% off${minText}` });
    } else {
      const minText = details.minOrder ? ` (min ${formatPriceStatic(details.minOrder)})` : '';
      codes.push({ code, description: `${formatPriceStatic(details.discount)} off${minText}` });
    }
  });
  
  return codes;
}

export interface FloatingWhatsAppProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FloatingWhatsApp({ 
  isOpen: controlledIsOpen, 
  onOpenChange 
}: FloatingWhatsAppProps = {}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  
  const setIsOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (isControlled && onOpenChange) {
      const newValue = typeof value === 'function' ? value(isOpen!) : value;
      onOpenChange(newValue);
    } else {
      setInternalIsOpen(value);
    }
  }, [isControlled, onOpenChange, isOpen]);

  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFlow, setCurrentFlow] = useState<FlowStep>('start');
  const [userPrefs, setUserPrefs] = useState<UserPrefs>({ name: '', visitCount: 0, lastRating: 0 });
  const [proactiveShown, setProactiveShown] = useState(false);
  const [lastContext, setLastContext] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const proactiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { state, cartTotal, orderHistory, reorderFromHistory } = useCart();
  const { userName, setUserName } = useGuest();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const hasMainDishOnly = state.items.length > 0 && 
    state.items.every(item => item.type === 'single') && 
    !state.items.some(item => item.mainDishes.some(d => d.toLowerCase().includes('juice')));

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        mainContainerRef.current &&
        !mainContainerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  // Utility functions
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const getCurrentTime = useCallback(() => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }, []);

  const formatPrice = useCallback((price: number) => {
    return 'UGX ' + new Intl.NumberFormat('en-UG').format(price);
  }, []);

  const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  const getTypingDelay = useCallback((content: string): number => {
    const length = content.length;
    if (length < 50) return 500 + Math.random() * 200;
    if (length < 150) return 700 + Math.random() * 400;
    return 1000 + Math.random() * 500;
  }, []);

  // Load user preferences
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_PREFS_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        setUserPrefs(prefs);
      }
    } catch {
      // Silent fail for localStorage
    }
  }, []);

  // Save user preferences
  const saveUserPrefs = useCallback((prefs: Partial<UserPrefs>) => {
    const updated = { ...userPrefs, ...prefs };
    setUserPrefs(updated);
    try {
      localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
    } catch {
      // Silent fail for localStorage
    }
  }, [userPrefs]);

  // Add bot message with typing animation
  const addBotMessage = useCallback((messageData: Omit<Message, 'id' | 'time'>, customDelay?: number) => {
    const delay = customDelay ?? getTypingDelay(messageData.content);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage: Message = {
        ...messageData,
        id: Date.now().toString(),
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, newMessage]);
    }, delay);
  }, [getTypingDelay, getCurrentTime]);

  // Get main menu options
  const getMainMenuOptions = useCallback((): MessageOption[] => {
    const cartLabel = cartItemCount > 0 ? ` (${cartItemCount} in cart)` : '';
    return [
      { key: '1', label: `1️⃣ Place an Order${cartLabel}`, action: 'placeOrder' },
      { key: '2', label: '2️⃣ Delivery Info', action: 'deliveryInfo' },
      { key: '3', label: '3️⃣ Track My Order', action: 'trackOrder' },
      { key: '4', label: '4️⃣ Promo Codes 🎁', action: 'promoCodes' },
      { key: '5', label: '5️⃣ FAQs', action: 'faqs' },
      { key: '6', label: '📞 Speak to Support', action: 'whatsapp' }
    ];
  }, [cartItemCount]);

  // Get context-aware options
  const getContextOptions = useCallback((): MessageOption[] => {
    if (cartItemCount > 0) {
      return [
        { key: '1', label: `Checkout (${cartItemCount} items)`, action: 'navigate', data: '/cart' },
        { key: '2', label: 'Apply Promo Code', action: 'promoCodes' },
        { key: '3', label: 'Add More Items', action: 'navigate', data: '/menu' },
        { key: '0', label: 'Main Menu', action: 'start' }
      ];
    }
    
    if (location.pathname === '/menu') {
      return [
        { key: '1', label: 'Popular Dishes', action: 'navigate', data: '/' },
        { key: '2', label: 'View Deals', action: 'deals' },
        { key: '3', label: '🎲 Surprise Me', action: 'surprise' },
        { key: '0', label: 'Main Menu', action: 'start' }
      ];
    }
    
    return getMainMenuOptions();
  }, [cartItemCount, location.pathname, getMainMenuOptions]);

  // Start new conversation with smart context
  const startNewConversation = useCallback(() => {
    setIsTyping(true);
    const delay = userName ? 600 : 900;
    
    setTimeout(() => {
      setIsTyping(false);
      
      const personalGreeting = userName 
        ? `${getGreeting()}, ${userName}! 👋`
        : `${getGreeting()}! Welcome to 9Yards Food 👋`;
      
      // Check business hours first
      if (!isBusinessOpen()) {
        addBotMessage({
          type: 'received',
          content: `${personalGreeting}\n\nWe're currently closed 🌙\n\nOur hours: ${BUSINESS_HOURS.open} - ${BUSINESS_HOURS.close}\n\nYou can still browse our menu and place an order for tomorrow!`,
          options: [
            { key: '1', label: 'Browse Menu', action: 'navigate', data: '/menu' },
            { key: '2', label: 'View Deals', action: 'deals' },
            { key: '3', label: 'Leave a Message', action: 'whatsapp', data: `Hello, I know you're closed, but I wanted to ask...` }
          ]
        });
        return;
      }
      
      // Peak hours warning
      const peakWarning = isPeakHours() 
        ? "\n\n⏰ *Heads up: We're in peak hours. Delivery may take 15-20 mins longer.*" 
        : "";
      
      // If items in cart, prioritize checkout
      if (cartItemCount > 0) {
        const freeDeliveryMsg = cartTotal >= FREE_DELIVERY_THRESHOLD 
          ? "🎉 You qualify for FREE delivery!" 
          : `Add ${formatPrice(FREE_DELIVERY_THRESHOLD - cartTotal)} more for free delivery`;
        
        addBotMessage({
          type: 'received',
          content: `${personalGreeting}\n\nYou have **${cartItemCount} item${cartItemCount > 1 ? 's' : ''}** in your cart.\n💰 Total: ${formatPrice(cartTotal)}\n${freeDeliveryMsg}${peakWarning}`,
          options: [
            { key: '1', label: 'Checkout Now ✅', action: 'navigate', data: '/cart' },
            { key: '2', label: 'Add More Items', action: 'navigate', data: '/menu' },
            { key: '3', label: 'Apply Promo Code', action: 'promoCodes' },
            { key: '0', label: 'Main Menu', action: 'start' }
          ]
        });
        return;
      }

      // Returning user with order history - quick reorder
      if (orderHistory.length > 0) {
        const lastOrder = orderHistory[0];
        const itemNames = lastOrder.items.slice(0, 2).map(i => i.mainDishes[0]).join(' + ');
        const moreCount = lastOrder.items.length > 2 ? ` +${lastOrder.items.length - 2} more` : '';
        
        addBotMessage({
          type: 'received',
          content: `${personalGreeting}\n\nWelcome back! Hungry for your usual?\n\n🍽️ **${itemNames}${moreCount}**${peakWarning}`,
          options: [
            { key: '1', label: '🔄 Reorder Now', action: 'reorder' },
            { key: '2', label: 'Browse Menu', action: 'navigate', data: '/menu' },
            { key: '3', label: 'View Deals', action: 'deals' },
            { key: '0', label: 'Other Options', action: 'start' }
          ]
        });
        return;
      }

      // Default welcome for new users
      addBotMessage({
        type: 'received',
        content: `${personalGreeting}\n\nAuthentic Ugandan cuisine delivered fresh to your door! 🍗${peakWarning}\n\nHow can I help you today?`,
        options: getMainMenuOptions()
      });
      
      // Ask for name if we don't have it (once per month)
      if (!userName) {
        const LAST_PROMPT_KEY = '9yards_last_name_prompt';
        const lastPrompt = parseInt(localStorage.getItem(LAST_PROMPT_KEY) || '0');
        const now = Date.now();
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        
        if (lastPrompt === 0 || (now - lastPrompt > oneMonth)) {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              addBotMessage({
                type: 'received',
                content: `By the way, what's your name? 😊\n\n(Just type it, or skip)`,
                options: [{ key: 'skip', label: 'Skip for now', action: 'start' }]
              });
              setCurrentFlow('getName');
              localStorage.setItem(LAST_PROMPT_KEY, now.toString());
            }, 800);
          }, 1500);
        }
      }
    }, delay);
  }, [userName, getGreeting, addBotMessage, cartItemCount, cartTotal, formatPrice, orderHistory, getMainMenuOptions]);

  // Load chat history from localStorage
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      try {
        const stored = localStorage.getItem(CHAT_STORAGE_KEY);
        if (stored) {
          const chatState: ChatState = JSON.parse(stored);
          const age = Date.now() - chatState.timestamp;
          
          if (age < CHAT_EXPIRY_MS && chatState.messages.length > 0) {
            setMessages(chatState.messages);
            setCurrentFlow(chatState.currentFlow);
            if (chatState.lastContext) setLastContext(chatState.lastContext);
            
            // Better welcome back with context
            setTimeout(() => {
              const name = userPrefs.name ? `, ${userPrefs.name}` : '';
              let contextMessage = "Where were we?";
              
              if (chatState.lastContext === 'cart') {
                contextMessage = `You were checking out your cart (${cartItemCount} items).`;
              } else if (chatState.lastContext === 'menu') {
                contextMessage = "You were browsing our menu.";
              } else if (chatState.lastContext === 'delivery') {
                contextMessage = "You were asking about delivery.";
              }
              
              addBotMessage({
                type: 'received',
                content: `Welcome back${name}! 👋\n\n${contextMessage}\n\nHow can I help?`,
                options: getContextOptions()
              }, 600);
            }, 400);
            return;
          } else {
            localStorage.removeItem(CHAT_STORAGE_KEY);
          }
        }
      } catch {
        // Silent fail for localStorage
      }
      
      startNewConversation();
    }
  }, [isOpen, messages.length, userPrefs.name, cartItemCount, addBotMessage, getContextOptions, startNewConversation]);

  // Save chat history
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const chatState: ChatState = {
          messages,
          currentFlow,
          timestamp: Date.now(),
          lastContext
        };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatState));
      } catch {
        // Silent fail for localStorage
      }
    }
  }, [messages, currentFlow, lastContext]);

  // Track context based on location
  useEffect(() => {
    if (location.pathname === '/cart') {
      setLastContext('cart');
    } else if (location.pathname === '/menu') {
      setLastContext('menu');
    } else if (location.pathname.includes('delivery')) {
      setLastContext('delivery');
    }
  }, [location.pathname]);

  // Proactive message timer with smarter triggers
  useEffect(() => {
    if (isOpen && !proactiveShown && messages.length > 0) {
      proactiveTimerRef.current = setTimeout(() => {
        showProactiveMessage();
        setProactiveShown(true);
      }, 30000);
    }
    
    return () => {
      if (proactiveTimerRef.current) {
        clearTimeout(proactiveTimerRef.current);
      }
    };
  }, [isOpen, messages.length, proactiveShown]);

  // Smart upsell for incomplete orders
  useEffect(() => {
    if (!isOpen) return;
    
    let upsellTimer: NodeJS.Timeout;
    
    if (location.pathname === '/cart' && hasMainDishOnly && cartItemCount > 0) {
      upsellTimer = setTimeout(() => {
        const randomJuice = getRandomItem(menuData.juices);
        addBotMessage({
          type: 'received',
          content: `💡 **Complete Your Meal!**\n\nI noticed you don't have a drink yet.\n\nHow about adding a fresh **${randomJuice.name}** for just ${formatPrice(randomJuice.price)}?`,
          options: [
            { key: '1', label: `Add ${randomJuice.name}`, action: 'navigate', data: '/menu' },
            { key: '2', label: 'View All Juices', action: 'navigate', data: '/menu' },
            { key: '0', label: 'No thanks', action: 'start' }
          ]
        });
      }, 20000);
    }

    return () => clearTimeout(upsellTimer);
  }, [isOpen, location.pathname, hasMainDishOnly, cartItemCount, addBotMessage, formatPrice]);

  // Scroll handling
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 0);
    }
  }, [isOpen]);

  // Proactive message based on context
  const showProactiveMessage = () => {
    if (cartItemCount > 0 && location.pathname !== '/cart') {
      addBotMessage({
        type: 'received',
        content: `Just checking in! 👀\n\nYou have ${cartItemCount} item${cartItemCount > 1 ? 's' : ''} (${formatPrice(cartTotal)}) waiting.\n\nReady to order?`,
        options: [
          { key: '1', label: 'Checkout Now ✅', action: 'navigate', data: '/cart' },
          { key: '2', label: 'Add More', action: 'navigate', data: '/menu' },
          { key: '0', label: 'Not yet', action: 'start' }
        ]
      }, 0);
    } else if (location.pathname === '/menu') {
      addBotMessage({
        type: 'received',
        content: `Need help choosing? 🤔\n\nOur **Chicken Stew** combo is a customer favorite!\n\nWant me to suggest something?`,
        options: [
          { key: '1', label: '🎲 Surprise Me', action: 'surprise' },
          { key: '2', label: 'See Popular Dishes', action: 'navigate', data: '/' },
          { key: '0', label: "I'm good", action: 'start' }
        ]
      }, 0);
    } else if (location.pathname === '/' && orderHistory.length === 0) {
      addBotMessage({
        type: 'received',
        content: `First time here? 🌟\n\nUse code **FIRST10** for 10% off your first order!`,
        options: [
          { key: '1', label: 'Start Order', action: 'navigate', data: '/menu' },
          { key: '2', label: 'More Deals', action: 'promoCodes' }
        ]
      }, 0);
    }
  };

  // Hide widget on certain pages
  if (HIDDEN_PAGES.includes(location.pathname)) {
    return null;
  }

  // Message generators
  const getPlaceOrderMessage = (): Omit<Message, 'id' | 'time'> => {
    if (cartItemCount > 0) {
      const itemsList = state.items.slice(0, 3).map(i => `• ${i.mainDishes[0]}`).join('\n');
      const moreText = state.items.length > 3 ? `\n• +${state.items.length - 3} more...` : '';
      
      return {
        type: 'received',
        content: `🛒 **Your Cart:**\n${itemsList}${moreText}\n\n💰 **Total:** ${formatPrice(cartTotal)}\n\nWhat would you like to do?`,
        options: [
          { key: '1', label: 'Checkout Now ✅', action: 'navigate', data: '/cart' },
          { key: '2', label: 'Add More Items', action: 'navigate', data: '/menu' },
          { key: '3', label: 'Apply Promo', action: 'promoCodes' },
          { key: '0', label: 'Back', action: 'start' }
        ]
      };
    }
    return {
      type: 'received',
      content: `Let's get you some food! 🍽️\n\nYour cart is empty. Browse our menu to find something delicious.`,
      options: [
        { key: '1', label: 'Browse Full Menu', action: 'navigate', data: '/menu' },
        { key: '2', label: 'Popular Dishes', action: 'navigate', data: '/' },
        { key: '3', label: '🎲 Surprise Me', action: 'surprise' },
        { key: '0', label: 'Back', action: 'start' }
      ]
    };
  };

  const getDeliveryInfoMessage = (): Omit<Message, 'id' | 'time'> => {
    const deliveryInfo = [
      `• Within 5km: FREE`,
      `• 5-10km: ${formatPrice(5000)}`,
      `• 10-15km: ${formatPrice(7000)}`,
      `• 15-20km: ${formatPrice(10000)}`,
      `• 20-30km: ${formatPrice(12000)}-${formatPrice(15000)}`,
    ].join('\n');
    const peakNote = isPeakHours() ? '\n\n⏰ *Peak hours: Add 15-20 mins to estimates*' : '';
    
    return {
      type: 'received',
      content: `🚚 **Delivery Info**\n\nWe deliver within ${MAX_DELIVERY_DISTANCE_KM}km of Kigo!\n\n📍 **Delivery Fees (by distance):**\n${deliveryInfo}\n\n🎉 **FREE delivery** on orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)}!\n\n⏱️ Est. time: 15-50 mins${peakNote}`,
      options: [
        { key: '1', label: 'Check My Area', action: 'whatsapp', data: `Hello, do you deliver to my area?` },
        { key: '0', label: 'Back', action: 'start' }
      ]
    };
  };

  const getTrackOrderMessage = (): Omit<Message, 'id' | 'time'> => {
    const lastOrderId = localStorage.getItem('lastOrderId');
    const hasRecentOrder = orderHistory.length > 0 && orderHistory[0].status;
    
    if (hasRecentOrder) {
      const recentOrder = orderHistory[0];
      return {
        type: 'received',
        content: `📦 **Track Order**\n\nYour most recent order:\n**#${recentOrder.orderId}**\nStatus: ${recentOrder.status || 'Processing'}\n\nFor live updates, chat with our team:`,
        options: [
          { key: '1', label: 'Track on WhatsApp', action: 'whatsapp', data: `Hello, I would like to track order #${recentOrder.orderId}` },
          { key: '2', label: 'Order History', action: 'navigate', data: '/order-history' },
          { key: '0', label: 'Back', action: 'start' }
        ]
      };
    }
    
    return {
      type: 'received',
      content: lastOrderId 
        ? `📦 **Track Order**\n\nYour last order: **#${lastOrderId}**\n\nFor real-time updates, let's chat on WhatsApp!`
        : `📦 **Track Order**\n\nHave your order number ready?\n\nI'll connect you with our team for live tracking!`,
      options: [
        { key: '1', label: 'Track on WhatsApp', action: 'whatsapp', data: lastOrderId ? `Hello, I would like to track order #${lastOrderId}` : `Hello, I would like to track my order` },
        { key: '2', label: 'Order History', action: 'navigate', data: '/order-history' },
        { key: '0', label: 'Back', action: 'start' }
      ]
    };
  };

  const getPromoCodesMessage = (): Omit<Message, 'id' | 'time'> => {
    const codes = getAvailablePromoCodes();
    const codesText = codes.map(c => `🏷️ **${c.code}**\n   ${c.description}`).join('\n\n');
    
    return {
      type: 'received',
      content: `🎁 **Available Promo Codes:**\n\n${codesText}\n\n💡 Apply at checkout to save!`,
      options: [
        { key: '1', label: 'Start Order', action: 'navigate', data: '/menu' },
        { key: '2', label: 'Go to Cart', action: 'navigate', data: '/cart' },
        { key: '3', label: 'View All Deals', action: 'navigate', data: '/deals' },
        { key: '0', label: 'Back', action: 'start' }
      ]
    };
  };

  const getFAQsMessage = (): Omit<Message, 'id' | 'time'> => ({
    type: 'received',
    content: `❓ **Frequently Asked Questions**\n\nTap a question:`,
    options: [
      { key: '1', label: 'How do I order?', action: 'faq1' },
      { key: '2', label: 'Payment methods?', action: 'faq2' },
      { key: '3', label: 'Delivery time?', action: 'faq3' },
      { key: '4', label: 'Cancel/refund?', action: 'faq4' },
      { key: '5', label: 'Minimum order?', action: 'faq5' },
      { key: '0', label: 'Back', action: 'start' }
    ]
  });

  const getFAQAnswer = (faqId: string): Omit<Message, 'id' | 'time'> => {
    const answers: Record<string, string> = {
      faq1: `📱 **How to Order:**\n\n1. Browse our menu\n2. Add items to cart\n3. Go to checkout\n4. Enter delivery details\n5. Pay via Mobile Money or Cash\n6. Enjoy your meal!`,
      faq2: `💳 **Payment Methods:**\n\n• Mobile Money (MTN, Airtel)\n• Cash on Delivery\n• Card (Visa, Mastercard)\n\nAll payments are secure! 🔒`,
      faq3: `⏱️ **Delivery Time:**\n\n• Kampala Central: 30-45 mins\n• Outer areas: 45-60 mins${isPeakHours() ? '\n\n*Currently peak hours - add 15-20 mins*' : ''}\n\nWe'll notify you when it's on the way!`,
      faq4: `❌ **Cancellation & Refunds:**\n\nCancel within 5 minutes of ordering.\n\nAfter that, contact us on WhatsApp.\n\nRefunds processed within 24 hours.`,
      faq5: `📦 **Minimum Order:**\n\nNo minimum order required!\n\nHowever, orders over ${formatPrice(FREE_DELIVERY_THRESHOLD)} get FREE delivery 🎉`,
    };
    
    return {
      type: 'received',
      content: answers[faqId] || 'Information not available.',
      options: [
        { key: '1', label: 'More FAQs', action: 'faqs' },
        { key: '2', label: 'Talk to Support', action: 'whatsapp' },
        { key: '0', label: 'Back', action: 'start' }
      ]
    };
  };

  // Add user message
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'sent',
      content,
      time: getCurrentTime(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  // Handle option selection
  const handleOptionSelect = (option: MessageOption) => {
    addUserMessage(option.label);
    
    switch (option.action) {
      case 'navigate':
        if (option.data) {
          setTimeout(() => {
            navigate(option.data!);
            setIsOpen(false);
          }, 300);
        }
        break;
        
      case 'whatsapp': {
        const message = option.data || `${getGreeting()}, I need assistance.`;
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        }, 300);
        break;
      }
        
      case 'call':
        handleCall();
        break;
        
      case 'surprise': {
        const allItems = [...menuData.mainDishes, ...menuData.lusaniya, ...menuData.sauces];
        const randomItem = getRandomItem(allItems);
        addBotMessage({
          type: 'received',
          content: `🎲 **Chef's Pick!**\n\n**${randomItem.name}**\n${randomItem.description || 'A delicious choice!'}\n\nLooks good?`,
          options: [
            { key: '1', label: 'Order This', action: 'navigate', data: '/menu' },
            { key: '2', label: '🎲 Spin Again', action: 'surprise' },
            { key: '0', label: 'Back', action: 'start' }
          ]
        }, 500);
        break;
      }
        
      case 'reorder':
        if (orderHistory.length > 0) {
          reorderFromHistory(orderHistory[0]);
          addBotMessage({
            type: 'received',
            content: `Done! 🎉\n\nYour previous order has been added to the cart.\n\nReady to checkout?`,
            options: [
              { key: '1', label: 'Checkout Now', action: 'navigate', data: '/cart' },
              { key: '2', label: 'Add More Items', action: 'navigate', data: '/menu' }
            ]
          }, 600);
        }
        break;
        
      case 'deals':
        addBotMessage({
          type: 'received',
          content: `🎁 **Current Deals:**\n\n• FREE delivery on orders 50K+\n• 10% off first orders (FIRST10)\n• Combo meals save you more!\n\nCheck our Deals page for flash sales!`,
          options: [
            { key: '1', label: 'View All Deals', action: 'navigate', data: '/deals' },
            { key: '2', label: 'Promo Codes', action: 'promoCodes' },
            { key: '0', label: 'Back', action: 'start' }
          ]
        });
        break;
        
      case 'rate': {
        const rating = parseInt(option.data || '5');
        saveUserPrefs({ lastRating: rating });
        addBotMessage({
          type: 'received',
          content: rating >= 4 
            ? `Thank you so much! 💚\n\nWe're glad we could help. See you next time!`
            : `Thanks for the feedback! 🙏\n\nWe'll work on improving. Feel free to reach out anytime!`,
        }, 600);
        break;
      }
        
      case 'start':
        setCurrentFlow('start');
        addBotMessage({
          type: 'received',
          content: `How else can I help?\n\nTap an option or type 1-6:`,
          options: getMainMenuOptions()
        });
        break;
        
      case 'placeOrder':
        setCurrentFlow('placeOrder');
        addBotMessage(getPlaceOrderMessage());
        break;
        
      case 'deliveryInfo':
        setCurrentFlow('deliveryInfo');
        addBotMessage(getDeliveryInfoMessage());
        break;
        
      case 'trackOrder':
        setCurrentFlow('trackOrder');
        addBotMessage(getTrackOrderMessage());
        break;
        
      case 'promoCodes':
        setCurrentFlow('promoCodes');
        addBotMessage(getPromoCodesMessage());
        break;
        
      case 'faqs':
        setCurrentFlow('faqs');
        addBotMessage(getFAQsMessage());
        break;
        
      case 'faq1':
      case 'faq2':
      case 'faq3':
      case 'faq4':
      case 'faq5':
        addBotMessage(getFAQAnswer(option.action));
        break;
    }
  };

  // Handle text input with smart parsing
  const handleTextInput = (input: string) => {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();
    
    // Setting name flow
    if (currentFlow === 'getName' && trimmed.length > 0 && trimmed.length < 30) {
      if (lower === 'skip') {
        addUserMessage(input);
        setCurrentFlow('start');
        addBotMessage({
          type: 'received',
          content: `No problem! How can I help you today?`,
          options: getMainMenuOptions()
        });
        return;
      }
      
      addUserMessage(trimmed);
      const firstName = trimmed.split(' ')[0];
      setUserName(firstName);
      saveUserPrefs({ name: firstName });
      
      addBotMessage({
        type: 'received',
        content: `Nice to meet you, ${firstName}! 😊\n\nI'll remember you next time. How can I help?`,
        options: getMainMenuOptions()
      });
      setCurrentFlow('start');
      return;
    }
    
    // Match numbered input or option label
    const lastBotMessage = [...messages].reverse().find(m => m.type === 'received');
    if (lastBotMessage?.options) {
      const matchedOption = lastBotMessage.options.find(
        opt => opt.key === lower || opt.label.toLowerCase().includes(lower)
      );
      if (matchedOption) {
        handleOptionSelect(matchedOption);
        return;
      }
    }
    
    // Keywords: navigation
    if (['menu', 'main', 'home', 'start', 'back', '0', 'hi', 'hello'].includes(lower)) {
      addUserMessage(input);
      setCurrentFlow('start');
      addBotMessage({
        type: 'received',
        content: `How can I help?\n\nTap an option or type 1-6:`,
        options: getMainMenuOptions()
      });
      return;
    }
    
    // Keywords: help/support
    if (['help', 'support', 'agent', 'human', 'person', 'speak'].includes(lower)) {
      addUserMessage(input);
      addBotMessage({
        type: 'received',
        content: `I'll connect you with our team right away!`,
        options: [
          { key: '1', label: 'Chat on WhatsApp', action: 'whatsapp', data: `Hello, I need help: ${input}` },
          { key: '2', label: 'Call Us', action: 'call' }
        ]
      });
      return;
    }
    
    // Keywords: promo/discount/code
    if (['promo', 'code', 'discount', 'coupon', 'deal'].some(k => lower.includes(k))) {
      addUserMessage(input);
      addBotMessage(getPromoCodesMessage());
      return;
    }
    
    // Keywords: cart/checkout
    if (['cart', 'checkout', 'order', 'buy'].includes(lower)) {
      addUserMessage(input);
      addBotMessage(getPlaceOrderMessage());
      return;
    }
    
    // Keywords: delivery/track
    if (['delivery', 'deliver', 'shipping', 'track', 'where'].some(k => lower.includes(k))) {
      addUserMessage(input);
      if (lower.includes('track') || lower.includes('where')) {
        addBotMessage(getTrackOrderMessage());
      } else {
        addBotMessage(getDeliveryInfoMessage());
      }
      return;
    }
    
    // Sentiment: negative feedback
    const negativeKeywords = ['angry', 'late', 'bad', 'waiting', 'slow', 'wrong', 'cold', 'terrible', 'awful', 'complaint'];
    if (negativeKeywords.some(k => lower.includes(k))) {
      addUserMessage(input);
      addBotMessage({
        type: 'received',
        content: `I'm so sorry to hear that 😟\n\nThis doesn't sound right. Let me connect you to our team immediately.`,
        options: [
          { key: '1', label: '🚨 Priority Support', action: 'whatsapp', data: `URGENT: I am unhappy about: ${input}` },
          { key: '2', label: 'Call Manager', action: 'call' }
        ]
      }, 400);
      return;
    }
    
    // Dietary keywords
    if (['vegan', 'vegetarian', 'veggie'].some(k => lower.includes(k))) {
      addUserMessage(input);
      addBotMessage({
        type: 'received',
        content: `🌱 **Plant-Based Options:**\n\nWe have fresh salads, vegetable sides, and 100% natural fruit juices!\n\nCheck our menu for all options.`,
        options: [
          { key: '1', label: 'View Menu', action: 'navigate', data: '/menu' },
          { key: '2', label: 'Ask About Options', action: 'whatsapp', data: 'Hello, what vegetarian options do you have?' }
        ]
      });
      return;
    }
    
    // Delivery area detection - now distance-based, so direct to WhatsApp for specific area checks
    const deliveryKeywords = ['deliver', 'delivery', 'area', 'location', 'zone', 'come to', 'reach'];
    if (deliveryKeywords.some(kw => lower.includes(kw))) {
      addUserMessage(input);
      addBotMessage({
        type: 'received',
        content: `📍 **Delivery Check**\n\nWe deliver within ${MAX_DELIVERY_DISTANCE_KM}km of our kitchen in Kigo!\n\n💰 Fees vary by distance (starting from FREE within 5km)\n⏱️ Est. time: 15-50 mins\n\nWant to confirm if we deliver to your specific location?`,
        options: [
          { key: '1', label: 'Check on WhatsApp', action: 'whatsapp', data: `Hello, do you deliver to ${input}?` },
          { key: '2', label: 'View Delivery Info', action: 'deliveryInfo' },
          { key: '0', label: 'Back', action: 'start' }
        ]
      });
      return;
    }
    
    // Menu item search
    const allMenuItems = [...menuData.mainDishes, ...menuData.sauces, ...menuData.lusaniya, ...menuData.juices];
    const searchResults = allMenuItems.filter(item => 
      item.name.toLowerCase().includes(lower) || 
      (item.description && item.description.toLowerCase().includes(lower))
    );
    
    if (searchResults.length > 0) {
      addUserMessage(input);
      const topResult = searchResults[0];
      // Get price based on item type - Sauces have basePrice, others have price
      const itemPrice = 'price' in topResult ? (topResult as { price: number }).price : 
        ('basePrice' in topResult ? (topResult as { basePrice: number }).basePrice : null);
      const priceText = itemPrice ? formatPrice(itemPrice) : 'see menu for pricing';
      
      addBotMessage({
        type: 'received',
        content: `🔍 **Found: ${topResult.name}**\n\n${topResult.description || 'Delicious choice!'}\n💰 ${priceText}\n\nWant to add it to your order?`,
        options: [
          { key: '1', label: `Order ${topResult.name}`, action: 'navigate', data: '/menu' },
          { key: '2', label: 'See Full Menu', action: 'navigate', data: '/menu' },
          { key: '0', label: 'Back', action: 'start' }
        ]
      });
      return;
    }
    
    // Default: escalate to human
    addUserMessage(input);
    addBotMessage({
      type: 'received',
      content: `I'd love to help with that!\n\nLet me connect you with our team who can assist better:`,
      options: [
        { key: '1', label: 'Chat on WhatsApp', action: 'whatsapp', data: `Hello, ${input}` },
        { key: '2', label: 'Call Us', action: 'call' },
        { key: '0', label: 'Back to Menu', action: 'start' }
      ]
    });
  };

  return (
    <>
      {/* Floating Button - Desktop only */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:flex fixed bottom-8 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] rounded-full items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat with us"
        title={isOpen ? "Close chat" : "Chat with us"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <WhatsAppIcon className="w-7 h-7 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-secondary text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/30 z-40 sm:hidden backdrop-blur-sm" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div 
            ref={mainContainerRef}
            className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-48 sm:left-auto sm:right-4 lg:right-6 lg:bottom-28 w-full sm:w-[380px] lg:w-[400px] bg-[#ECE5DD] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] sm:max-h-[600px] flex flex-col safe-area-bottom"
          >
            
            {/* Header */}
            <div className="bg-[#008069] px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm">
              <button 
                onClick={() => setIsOpen(false)} 
                className="sm:hidden w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white overflow-hidden shrink-0 ring-2 ring-white/20">
                <img 
                  src="/images/logo/9Yards-Food-White-Logo-colored.png" 
                  alt="9Yards Food" 
                  className="w-full h-full object-contain p-0.5" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold text-[17px] leading-tight">9Yards Food</h3>
                  {isPeakHours() && (
                    <span className="text-[10px] bg-amber-400 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                      BUSY
                    </span>
                  )}
                </div>
                <p className="text-white/90 text-[13px] leading-tight font-medium">
                  {isTyping ? 'typing...' : isBusinessOpen() ? 'online' : 'away'}
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleCall} 
                  className="text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" 
                  aria-label="Call us"
                  title="Call Us"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hidden sm:block text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" 
                  title="Close Chat"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Peak Hours Banner */}
            {isPeakHours() && (
              <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-700">
                  <span className="font-medium">Peak hours</span> — Delivery may take 15-20 mins longer
                </p>
              </div>
            )}

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-2 sm:px-3 py-2 space-y-1 custom-scrollbar"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              style={{ 
                backgroundImage: `url('/images/backgrounds/new-real-whatsapp-wallpaper.png')`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            >
              <div className="flex justify-center py-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-1 shadow-sm">
                  <span className="text-[11px] sm:text-xs text-gray-700 font-medium">TODAY</span>
                </div>
              </div>

              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-1`}
                >
                  <div 
                    className={`relative rounded-xl shadow-sm px-3 py-2.5 max-w-[88%] sm:max-w-[85%] ${
                      message.type === 'sent' ? 'bg-[#d9fdd3]' : 'bg-white'
                    }`}
                  >
                    <p className="text-[#111b21] text-[15px] leading-[1.5] whitespace-pre-wrap">
                      {message.content}
                    </p>
                    
                    {message.options && message.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {message.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className="text-center px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 hover:border-[#008069]/40 rounded-full text-[13.5px] font-medium text-[#008069] transition-all active:scale-[0.98]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10.5px] text-[#667781]">{message.time}</span>
                      {message.type === 'sent' && (
                        <div className="flex">
                          <Check className="w-3.5 h-3.5 text-[#53BDEB] -mr-2" strokeWidth={2.5} />
                          <Check className="w-3.5 h-3.5 text-[#53BDEB]" strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-1">
                  <div className="bg-white rounded-lg shadow-sm px-3 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area - Clean and polished */}
            <div className="bg-[#F0F0F0] px-3 py-2.5 flex items-center gap-3 shrink-0">
              <div className="flex-1 bg-white rounded-full px-4 py-2.5 flex items-center shadow-sm min-w-0 border border-gray-200">
                <input
                  type="text"
                  value={typingMessage}
                  onChange={(e) => setTypingMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && typingMessage.trim()) {
                      handleTextInput(typingMessage);
                      setTypingMessage('');
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent outline-none text-[15px] text-[#3B4A54] placeholder:text-[#8696A0] min-w-0"
                />
              </div>
              
              {/* Send button - always visible */}
              <button 
                onClick={() => { 
                  if (typingMessage.trim()) {
                    handleTextInput(typingMessage); 
                    setTypingMessage(''); 
                  }
                }}
                disabled={!typingMessage.trim()}
                className={`rounded-full w-11 h-11 flex items-center justify-center transition-all shrink-0 shadow-md bg-[#008069] ${
                  typingMessage.trim() 
                    ? 'hover:bg-[#006e5a] active:scale-95' 
                    : ''
                }`}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
                </svg>
              </button>
            </div>
          </div>

          <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.25); }
          `}</style>
        </>
      )}
    </>
  );
}
