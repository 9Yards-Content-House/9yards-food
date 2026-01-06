import { X, ArrowLeft, Phone, MoreVertical, Check } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { useCart } from '@/context/CartContext';
import { deliveryZones } from '@/data/menu';

// Constants
const HIDDEN_PAGES = ['/order-confirmation'];
const CHAT_STORAGE_KEY = '9yards_chat_history';
const USER_PREFS_KEY = '9yards_chat_prefs';
const CHAT_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Types
type FlowStep = 'start' | 'placeOrder' | 'deliveryInfo' | 'trackOrder' | 'faqs' | 'faq1' | 'faq2' | 'faq3' | 'faq4' | 'getName' | 'rating';

interface Message {
  id: string;
  type: 'received' | 'sent';
  content: string;
  time: string;
  options?: { key: string; label: string; action: FlowStep | 'navigate' | 'whatsapp' | 'call' | 'rate'; data?: string }[];
}

interface ChatState {
  messages: Message[];
  currentFlow: FlowStep;
  timestamp: number;
}

interface UserPrefs {
  name: string;
  visitCount: number;
  lastRating: number;
}

// Natural language variations
const greetingVariations = [
  "Hey there! 👋",
  "Hi! 👋",
  "Hello! 👋",
  "Welcome! 👋"
];

const helpPhrases = [
  "How can I help you today?",
  "What can I do for you?",
  "How may I assist you?",
  "What would you like to do?"
];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFlow, setCurrentFlow] = useState<FlowStep>('start');
  const [userPrefs, setUserPrefs] = useState<UserPrefs>({ name: '', visitCount: 0, lastRating: 0 });
  const [showRating, setShowRating] = useState(false);
  const [proactiveShown, setProactiveShown] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const proactiveTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { state, cartTotal } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

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
    if (length < 50) return 600 + Math.random() * 300;
    if (length < 150) return 900 + Math.random() * 500;
    return 1400 + Math.random() * 600;
  }, []);

  // Load user preferences
  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_PREFS_KEY);
      if (stored) {
        const prefs = JSON.parse(stored);
        setUserPrefs(prefs);
      }
    } catch (e) {
      console.log('Could not load user prefs');
    }
  }, []);

  // Save user preferences
  const saveUserPrefs = useCallback((prefs: Partial<UserPrefs>) => {
    const updated = { ...userPrefs, ...prefs };
    setUserPrefs(updated);
    try {
      localStorage.setItem(USER_PREFS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log('Could not save user prefs');
    }
  }, [userPrefs]);

  // Load chat history from localStorage
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      try {
        const stored = localStorage.getItem(CHAT_STORAGE_KEY);
        if (stored) {
          const chatState: ChatState = JSON.parse(stored);
          const age = Date.now() - chatState.timestamp;
          
          if (age < CHAT_EXPIRY_MS && chatState.messages.length > 0) {
            // Resume existing conversation
            setMessages(chatState.messages);
            setCurrentFlow(chatState.currentFlow);
            
            // Add welcome back message
            setTimeout(() => {
              const userName = userPrefs.name ? `, ${userPrefs.name}` : '';
              addBotMessage({
                type: 'received',
                content: `Welcome back${userName}! 🙌\n\nI'm still here to help. Where were we?`,
                options: getContextOptions()
              }, 800);
            }, 500);
            return;
          } else {
            // Clear expired chat
            localStorage.removeItem(CHAT_STORAGE_KEY);
          }
        }
      } catch (e) {
        console.log('Could not load chat history');
      }
      
      // Start new conversation
      startNewConversation();
    }
  }, [isOpen]);

  // Save chat history on message change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        const chatState: ChatState = {
          messages,
          currentFlow,
          timestamp: Date.now()
        };
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatState));
      } catch (e) {
        console.log('Could not save chat history');
      }
    }
  }, [messages, currentFlow]);

  // Increment visit count
  useEffect(() => {
    if (isOpen && userPrefs.visitCount >= 0) {
      saveUserPrefs({ visitCount: userPrefs.visitCount + 1 });
    }
  }, [isOpen]);

  // Proactive message timer
  useEffect(() => {
    if (isOpen && !proactiveShown && messages.length > 0) {
      proactiveTimerRef.current = setTimeout(() => {
        showProactiveMessage();
        setProactiveShown(true);
      }, 45000); // 45 seconds
    }
    
    return () => {
      if (proactiveTimerRef.current) {
        clearTimeout(proactiveTimerRef.current);
      }
    };
  }, [isOpen, messages, proactiveShown]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Hide widget on certain pages
  if (HIDDEN_PAGES.includes(location.pathname)) {
    return null;
  }

  // Start new conversation
  const startNewConversation = () => {
    setIsTyping(true);
    const delay = userPrefs.name ? 800 : 1200;
    
    setTimeout(() => {
      setIsTyping(false);
      
      const personalGreeting = userPrefs.name 
        ? `${getGreeting()}, ${userPrefs.name}! 👋`
        : `${getGreeting()}! ${getRandomItem(greetingVariations.map(g => g.replace('👋', '')))}`;
      
      const helpText = getRandomItem(helpPhrases);
      
      addBotMessage({
        type: 'received',
        content: `${personalGreeting}\nWelcome to 9Yards Food!\n\n${helpText}\n\n💡 Tap an option below or type a number (1-5):`,
        options: getMainMenuOptions()
      });
      
      // If first time, ask for name
      if (!userPrefs.name && userPrefs.visitCount <= 1) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addBotMessage({
              type: 'received',
              content: `By the way, what's your name? 😊\n\n(Just type your name, or skip to continue)`,
              options: [{ key: 'skip', label: 'Skip for now', action: 'start' }]
            });
            setCurrentFlow('getName');
          }, 1000);
        }, 2000);
      }
    }, delay);
  };

  // Get context-aware options based on current page
  const getContextOptions = (): Message['options'] => {
    const baseOptions = getMainMenuOptions();
    
    if (location.pathname === '/menu') {
      return [
        { key: '1', label: '🍗 Add popular item', action: 'navigate', data: '/menu' },
        ...baseOptions.slice(0, 4)
      ];
    }
    
    if (location.pathname === '/cart') {
      return [
        { key: '1', label: '✅ Continue to checkout', action: 'navigate', data: '/cart' },
        { key: '2', label: '🎁 Apply promo code', action: 'whatsapp', data: `${getGreeting()}! I have a promo code.` },
        ...baseOptions.slice(2, 5)
      ];
    }
    
    return baseOptions;
  };

  // Get main menu options
  const getMainMenuOptions = (): Message['options'] => [
    { key: '1', label: `1️⃣ Place an Order ${cartItemCount > 0 ? `(${cartItemCount} in cart)` : ''}`, action: 'placeOrder' },
    { key: '2', label: '2️⃣ Delivery Info & Fees', action: 'deliveryInfo' },
    { key: '3', label: '3️⃣ Track My Order', action: 'trackOrder' },
    { key: '4', label: '4️⃣ FAQs', action: 'faqs' },
    { key: '5', label: '5️⃣ Speak to Support', action: 'whatsapp' },
  ];

  // Show proactive message based on context
  const showProactiveMessage = () => {
    if (cartItemCount > 0) {
      addBotMessage({
        type: 'received',
        content: `Just checking in! 👀\n\nYou have ${cartItemCount} item${cartItemCount > 1 ? 's' : ''} waiting in your cart.\n\nReady to order? 🛒`,
        options: [
          { key: '1', label: '✅ Yes, checkout now', action: 'navigate', data: '/cart' },
          { key: '2', label: '➕ Add more items', action: 'navigate', data: '/menu' },
          { key: '0', label: 'Not yet, thanks', action: 'start' },
        ]
      }, 0);
    } else if (location.pathname === '/menu') {
      addBotMessage({
        type: 'received',
        content: `Need help choosing? 🤔\n\nOur Chicken Stew combo is a customer favorite! Would you like me to tell you about our popular dishes?`,
        options: [
          { key: '1', label: '👍 Yes, show me!', action: 'navigate', data: '/' },
          { key: '0', label: 'I\'m good, thanks', action: 'start' },
        ]
      }, 0);
    }
  };

  // Message generation functions
  const getPlaceOrderMessage = (): Omit<Message, 'id' | 'time'> => {
    if (cartItemCount > 0) {
      return {
        type: 'received',
        content: `Great choice! 🎉\n\n🛒 Your cart: ${cartItemCount} item${cartItemCount > 1 ? 's' : ''}\n💰 Total: ${formatPrice(cartTotal)}\n\nWhat would you like to do?`,
        options: [
          { key: '1', label: '1️⃣ Checkout Now ✅', action: 'navigate', data: '/cart' },
          { key: '2', label: '2️⃣ Add More Items', action: 'navigate', data: '/menu' },
          { key: '3', label: '3️⃣ View Cart Details', action: 'navigate', data: '/cart' },
          { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
        ]
      };
    }
    return {
      type: 'received',
      content: `Ready to order? 🍽️\n\nYour cart is empty right now.\nLet's find you something delicious!`,
      options: [
        { key: '1', label: '1️⃣ Browse Menu', action: 'navigate', data: '/menu' },
        { key: '2', label: '2️⃣ See Popular Dishes', action: 'navigate', data: '/' },
        { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
      ]
    };
  };

  const getDeliveryInfoMessage = (): Omit<Message, 'id' | 'time'> => {
    const topZones = deliveryZones.slice(0, 5);
    const zonesText = topZones.map(z => `• ${z.name}: ${formatPrice(z.fee)}`).join('\n');
    
    return {
      type: 'received',
      content: `🚚 Delivery Info\n\nWe deliver across Kampala!\n\n📍 Popular areas:\n${zonesText}\n\n🎉 FREE delivery on orders 50K+ UGX!\n⏱️ Delivery: 30-55 mins`,
      options: [
        { key: '1', label: '1️⃣ All Delivery Zones', action: 'navigate', data: '/delivery-zones' },
        { key: '2', label: '2️⃣ Ask About My Area', action: 'whatsapp', data: `${getGreeting()}! Do you deliver to my area?` },
        { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
      ]
    };
  };

  const getTrackOrderMessage = (): Omit<Message, 'id' | 'time'> => {
    const lastOrderId = localStorage.getItem('lastOrderId');
    return {
      type: 'received',
      content: lastOrderId 
        ? `📦 Track Order\n\nYour last order: #${lastOrderId}\n\nFor real-time updates, let's chat on WhatsApp!`
        : `📦 Track Order\n\nHave your order number ready?\n\nI'll connect you with our team for live tracking!`,
      options: [
        { key: '1', label: '1️⃣ Track on WhatsApp', action: 'whatsapp', data: lastOrderId ? `${getGreeting()}! I'd like to track order #${lastOrderId}` : `${getGreeting()}! I'd like to track my order` },
        { key: '2', label: '2️⃣ Order History', action: 'navigate', data: '/order-history' },
        { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
      ]
    };
  };

  const getFAQsMessage = (): Omit<Message, 'id' | 'time'> => ({
    type: 'received',
    content: `❓ Frequently Asked Questions\n\nPick a question:`,
    options: [
      { key: '1', label: '1️⃣ How do I order?', action: 'faq1' },
      { key: '2', label: '2️⃣ Payment methods?', action: 'faq2' },
      { key: '3', label: '3️⃣ Delivery time?', action: 'faq3' },
      { key: '4', label: '4️⃣ Cancel order?', action: 'faq4' },
      { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
    ]
  });

  const getFAQAnswer = (faqId: string): Omit<Message, 'id' | 'time'> => {
    const answers: Record<string, string> = {
      faq1: `📱 How to Order:\n\n1. Browse our menu\n2. Add items to cart\n3. Go to checkout\n4. Enter delivery details\n5. Pay via Mobile Money or Cash\n6. Enjoy your meal! 🍽️`,
      faq2: `💳 Payment Methods:\n\n• Mobile Money (MTN, Airtel)\n• Cash on Delivery\n• Card (Visa, Mastercard)\n\nAll payments are secure! 🔒`,
      faq3: `⏱️ Delivery Time:\n\n• Kampala Central: 30-45 mins\n• Outer areas: 45-60 mins\n\nWe'll notify you when it's on the way! 🚚`,
      faq4: `❌ Cancellation:\n\nCancel within 5 minutes of ordering.\n\nAfter that, please contact us on WhatsApp.\n\nRefunds processed within 24 hours.`,
    };
    
    return {
      type: 'received',
      content: answers[faqId] || 'Information not available.',
      options: [
        { key: '1', label: '1️⃣ More FAQs', action: 'faqs' },
        { key: '2', label: '2️⃣ Talk to Support', action: 'whatsapp' },
        { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
      ]
    };
  };

  // Add bot message with human-like delay
  const addBotMessage = (messageData: Omit<Message, 'id' | 'time'>, customDelay?: number) => {
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
  const handleOptionSelect = (option: Message['options'][0]) => {
    addUserMessage(option.label);
    
    switch (option.action) {
      case 'navigate':
        if (option.data) {
          setTimeout(() => {
            navigate(option.data);
            setIsOpen(false);
          }, 300);
        }
        break;
      case 'whatsapp':
        const message = option.data || `${getGreeting()}! I need assistance.`;
        setTimeout(() => {
          window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        }, 300);
        // Show rating after WhatsApp redirect
        setTimeout(() => {
          if (!showRating) {
            setShowRating(true);
            addBotMessage({
              type: 'received',
              content: `Thanks for chatting with us! 🙏\n\nHow was your experience today?`,
              options: [
                { key: '1', label: '⭐ Great!', action: 'rate', data: '5' },
                { key: '2', label: '👍 Good', action: 'rate', data: '4' },
                { key: '3', label: '😐 Okay', action: 'rate', data: '3' },
              ]
            }, 2000);
          }
        }, 1000);
        break;
      case 'call':
        window.location.href = `tel:${PHONE_NUMBER}`;
        break;
      case 'rate':
        const rating = parseInt(option.data || '5');
        saveUserPrefs({ lastRating: rating });
        addBotMessage({
          type: 'received',
          content: rating >= 4 
            ? `Thank you so much! 💚\n\nWe're glad we could help. See you next time!`
            : `Thanks for the feedback! 🙏\n\nWe'll work on improving. Feel free to reach out anytime!`,
        }, 800);
        break;
      case 'start':
        setCurrentFlow('start');
        addBotMessage({
          type: 'received',
          content: `Alright! ${getRandomItem(helpPhrases)}\n\n💡 Tap an option or type 1-5:`,
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
      case 'faqs':
        setCurrentFlow('faqs');
        addBotMessage(getFAQsMessage());
        break;
      case 'faq1':
      case 'faq2':
      case 'faq3':
      case 'faq4':
        setCurrentFlow(option.action);
        addBotMessage(getFAQAnswer(option.action));
        break;
    }
  };

  // Handle text input
  const handleTextInput = (input: string) => {
    const trimmed = input.trim();
    const lower = trimmed.toLowerCase();
    
    // Check if setting name
    if (currentFlow === 'getName' && trimmed.length > 0 && trimmed.length < 30) {
      addUserMessage(trimmed);
      const firstName = trimmed.split(' ')[0];
      saveUserPrefs({ name: firstName });
      
      addBotMessage({
        type: 'received',
        content: `Nice to meet you, ${firstName}! 😊\n\nI'll remember you next time. Now, how can I help?`,
        options: getMainMenuOptions()
      });
      setCurrentFlow('start');
      return;
    }
    
    // Find matching option
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
    
    // Handle keywords
    if (['menu', 'main', 'home', 'start', 'back', '0', 'hi', 'hello'].includes(lower)) {
      addUserMessage(input);
      setCurrentFlow('start');
      addBotMessage({
        type: 'received',
        content: `${getRandomItem(helpPhrases)}\n\n💡 Tap an option or type 1-5:`,
        options: getMainMenuOptions()
      });
      return;
    }
    
    if (['help', 'support', 'agent', 'human', 'person'].includes(lower)) {
      addUserMessage(input);
      addBotMessage({
        type: 'received',
        content: `I'll connect you with our team right away! 🙌`,
        options: [
          { key: '1', label: '💬 Chat on WhatsApp', action: 'whatsapp', data: `${getGreeting()}! I need help: ${input}` },
          { key: '2', label: '📞 Call Us', action: 'call' },
        ]
      });
      return;
    }
    
    // Default: escalate with empathy
    addUserMessage(input);
    addBotMessage({
      type: 'received',
      content: `I'd love to help with that! 💬\n\nLet me connect you with our team who can assist better:`,
      options: [
        { key: '1', label: '💬 Chat on WhatsApp', action: 'whatsapp', data: `${getGreeting()}! ${input}` },
        { key: '0', label: '0️⃣ Back to Menu', action: 'start' },
      ]
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 sm:w-16 sm:h-16 sm:bottom-32 lg:bottom-8 lg:right-6 bg-[#25D366] hover:bg-[#20ba5a] rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat with us"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        ) : (
          <>
            <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 sm:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div 
            ref={mainContainerRef}
            className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-48 sm:left-auto sm:right-4 lg:right-6 lg:bottom-28 w-full sm:w-[380px] lg:w-[400px] bg-[#ECE5DD] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] sm:max-h-[600px] flex flex-col"
          >
            
            {/* Header */}
            <div className="bg-[#075E54] px-4 py-2.5 sm:py-3 flex items-center gap-3 shrink-0">
              <button onClick={() => setIsOpen(false)} className="sm:hidden w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white overflow-hidden shrink-0 ring-2 ring-white/20">
                <img src="/images/logo/9Yards-Food-White-Logo-colored.png" alt="9Yards Food" className="w-full h-full object-contain p-0.5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-medium text-[15px] sm:text-base leading-tight">9Yards Food</h3>
                  <img src="/images/logo/whatsapp-verified-badge.png" alt="Verified" className="w-[14px] h-[14px] sm:w-4 sm:h-4 shrink-0" />
                </div>
                <p className="text-white/90 text-[11px] sm:text-xs leading-tight">
                  {isTyping ? 'typing...' : 'online'}
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                <button onClick={handleCall} className="text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Call us">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button onClick={() => setIsOpen(false)} className="hidden sm:block text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-2 sm:px-3 py-2 space-y-1 custom-scrollbar"
              style={{ backgroundImage: `url('/images/backgrounds/new-real-whatsapp-wallpaper.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="flex justify-center py-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-1 shadow-sm">
                  <span className="text-[11px] sm:text-xs text-gray-700 font-medium">TODAY</span>
                </div>
              </div>

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div className={`relative rounded-lg shadow-sm px-2.5 py-2 max-w-[88%] sm:max-w-[82%] ${message.type === 'sent' ? 'bg-[#d9fdd3]' : 'bg-white'}`}>
                    <p className="text-[#303030] text-[13.5px] sm:text-[14.2px] leading-[1.45] whitespace-pre-wrap">{message.content}</p>
                    
                    {message.options && message.options.length > 0 && (
                      <div className="flex flex-col gap-1.5 mt-2.5">
                        {message.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(option)}
                            className="text-left px-2.5 py-2 bg-[#f0f2f5] hover:bg-[#e4e6eb] rounded-lg text-[12.5px] sm:text-[13px] text-[#075E54] font-medium transition-colors active:scale-[0.98]"
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
              
              {isTyping && (
                <div className="flex justify-start mb-1">
                  <div className="bg-white rounded-lg shadow-sm px-3 py-2.5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-2"></div>
            </div>

            {/* Input */}
            <div className="bg-[#F0F0F0] px-2 py-1.5 sm:py-2 flex items-center gap-2 shrink-0">
              <button className="text-[#54656f] hover:text-[#3b4a54] transition-colors p-1.5">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </button>
              
              <div className="flex-1 bg-white rounded-[21px] pl-3 sm:pl-4 pr-1 py-1.5 flex items-center gap-2 h-[40px] sm:h-[42px] shadow-sm">
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
                  placeholder="Type a message"
                  className="flex-1 bg-transparent outline-none text-[14px] sm:text-[15px] text-[#3B4A54] placeholder:text-[#8696A0]"
                />
                
                {typingMessage.trim() && (
                  <button 
                    onClick={() => { handleTextInput(typingMessage); setTypingMessage(''); }}
                    className="bg-[#1daa61] text-white rounded-full p-2 hover:bg-[#1a9952] active:scale-95 transition-all shrink-0"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/></svg>
                  </button>
                )}
              </div>
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
