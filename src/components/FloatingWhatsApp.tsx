import { X, Send, Smile, ArrowLeft, Phone, MoreVertical, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { useCart } from '@/context/CartContext';

// Pages where the widget should NOT appear
const HIDDEN_PAGES = ['/cart', '/order-confirmation'];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { state } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const userLocation = state.userPreferences.location || localStorage.getItem('deliveryZone') || '';
  
  // Simulation of typing when chat opens
  useEffect(() => {
    if (isOpen) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Hide widget on certain pages
  if (HIDDEN_PAGES.includes(location.pathname)) {
    return null;
  }
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleQuickReply = (message: string) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOpen(false);
  };

  const handleCall = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  // Quick reply options
  const quickReplies = [
    { text: "📋 View Menu", message: `${getGreeting()}! Can you send me today's menu and prices?` },
    { text: "🛒 Place Order", message: cartItemCount > 0 ? `${getGreeting()}! I have ${cartItemCount} items in my cart. I'd like to complete my order.` : `${getGreeting()}! I'd like to place an order.` },
    { text: "🚚 Delivery Info", message: userLocation ? `${getGreeting()}! Do you deliver to ${userLocation}?` : `${getGreeting()}! What are your delivery areas?` },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 w-14 h-14 sm:w-16 sm:h-16 sm:bottom-32 lg:bottom-8 lg:right-6 bg-[#25D366] hover:bg-[#20ba5a] rounded-full flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        ) : (
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
        )}
      </button>

      {/* WhatsApp Chat Window */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/30 z-40 sm:hidden backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-48 sm:left-auto sm:right-4 lg:right-6 lg:bottom-28 w-full sm:w-[380px] lg:w-[400px] bg-[#ECE5DD] sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] sm:max-h-[600px] flex flex-col">
            
            {/* WhatsApp Header */}
            <div className="bg-[#075E54] px-4 py-2.5 sm:py-3 flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setIsOpen(false)}
                className="sm:hidden w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors -ml-2"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              
              {/* Profile Picture with Colored Logo */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white overflow-hidden shrink-0 ring-2 ring-white/20">
                <img 
                  src="/images/logo/9Yards-Food-White-Logo-colored.png" 
                  alt="9Yards Food"
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-medium text-[15px] sm:text-base leading-tight">9Yards Food</h3>
                  {/* Verified Badge */}
                  <img 
                    src="/images/logo/whatsapp-verified-badge.png"
                    alt="Verified"
                    className="w-[14px] h-[14px] sm:w-4 sm:h-4 shrink-0"
                  />
                </div>
                <p className="text-white/90 text-[11px] sm:text-xs leading-tight">
                  {isTyping ? 'typing...' : 'online'}
                </p>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={handleCall}
                  className="text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                  aria-label="Call us"
                >
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="hidden sm:block text-white/90 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Chat Background with Image */}
            <div 
              className="flex-1 overflow-y-auto px-2 sm:px-3 py-2 space-y-1 custom-scrollbar"
              style={{
                backgroundImage: `url('/images/backgrounds/new-real-whatsapp-wallpaper.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Date Divider */}
              <div className="flex justify-center py-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-md px-3 py-1 shadow-sm">
                  <span className="text-[11px] sm:text-xs text-gray-700 font-medium">TODAY</span>
                </div>
              </div>

              {/* Welcome Message (Received - White Bubble) */}
              <div className="flex justify-start mb-1">
                <div className="relative bg-white rounded-lg shadow-sm px-2 py-1.5 max-w-[85%] sm:max-w-[80%]">
                  <p className="text-[#303030] text-[13.5px] sm:text-[14.2px] leading-[1.4] whitespace-pre-wrap">
                    {getGreeting()}! 👋{'\n'}Welcome to 9Yards Food!
                  </p>
                  <p className="text-[#303030] text-[13.5px] sm:text-[14.2px] leading-[1.4] mt-1">
                    How can we serve you today? 😊
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span className="text-[11px] text-[#667781]">{getCurrentTime()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Reply Suggestions (Sent - Green Bubbles) */}
              <div className="flex flex-col gap-1 py-1">
                {quickReplies.map((reply, index) => (
                  <div key={index} className="flex justify-end">
                    <button
                      onClick={() => handleQuickReply(reply.message)}
                      className="relative bg-[#d9fdd3] rounded-lg shadow-sm px-2 py-1.5 max-w-[85%] sm:max-w-[80%] text-left hover:bg-[#d1f8ca] active:scale-[0.98] transition-all"
                    >
                      <p className="text-[#303030] text-[13.5px] sm:text-[14.2px] leading-[1.4]">
                        {reply.text}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[11px] text-[#667781]">{getCurrentTime()}</span>
                        {/* Double check mark */}
                        <div className="flex">
                          <Check className="w-3.5 h-3.5 text-[#53BDEB] -mr-2" strokeWidth={2.5} />
                          <Check className="w-3.5 h-3.5 text-[#53BDEB]" strokeWidth={2.5} />
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Info Message (if items in cart) - Received */}
              {cartItemCount > 0 && (
                <div className="flex justify-start mb-1 mt-2">
                  <div className="relative bg-white rounded-lg shadow-sm px-2 py-1.5 max-w-[85%] sm:max-w-[80%]">
                    <p className="text-[#303030] text-[13.5px] sm:text-[14.2px] leading-[1.4]">
                      I see you have <span className="font-semibold text-[#25D366]">{cartItemCount} item{cartItemCount > 1 ? 's' : ''}</span> in your cart! 🛒
                    </p>
                    <div className="flex items-center justify-end gap-1 mt-0.5">
                      <span className="text-[11px] text-[#667781]">{getCurrentTime()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Operating Hours Info - Received */}
              <div className="flex justify-start mb-1 mt-2">
                <div className="relative bg-white rounded-lg shadow-sm px-2 py-1.5 max-w-[85%] sm:max-w-[80%]">
                  <p className="text-[#303030] text-[13.5px] sm:text-[14.2px] leading-[1.4] font-medium">
                    📍 We deliver across Kampala!
                  </p>
                  <div className="bg-[#F7F8FA] rounded-md p-2 mt-1.5 border-l-[3px] border-[#25D366]">
                    <p className="text-[#303030] text-[12px] font-medium mb-0.5">⏰ Opening Hours</p>
                    <p className="text-[#667781] text-[11.5px] leading-[1.3]">
                      Mon-Sat: 10:00 AM - 9:00 PM{'\n'}
                      Sunday: 11:00 AM - 7:00 PM
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[11px] text-[#667781]">{getCurrentTime()}</span>
                  </div>
                </div>
              </div>

              {/* Spacer at bottom */}
              <div className="h-2"></div>
            </div>

            {/* Message Input (WhatsApp Style) */}
            <div className="bg-[#F0F0F0] px-2 py-1.5 sm:py-2 flex items-center gap-2 shrink-0">
              {/* Plus Icon Button */}
              <button className="text-[#54656f] hover:text-[#3b4a54] transition-colors p-1.5">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </button>
              
              <div className="flex-1 bg-white rounded-[21px] pl-3 sm:pl-4 pr-1 py-1.5 flex items-center gap-2 h-[40px] sm:h-[42px] shadow-sm">
                <input
                  type="text"
                  value={typingMessage}
                  onChange={(e) => setTypingMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && typingMessage.trim()) {
                      handleQuickReply(typingMessage);
                      setTypingMessage('');
                    }
                  }}
                  placeholder="Type a message"
                  className="flex-1 bg-transparent outline-none text-[14px] sm:text-[15px] text-[#3B4A54] placeholder:text-[#8696A0]"
                />
                
                {/* Send button - only shows when typing */}
                {typingMessage.trim() && (
                  <button 
                    onClick={() => {
                      handleQuickReply(typingMessage);
                      setTypingMessage('');
                    }}
                    className="bg-[#1daa61] text-white rounded-full p-2 hover:bg-[#1a9952] active:scale-95 transition-all shrink-0"
                  >
                    <svg 
                      viewBox="0 0 24 24" 
                      width="20" 
                      height="20" 
                      fill="white"
                      className="rotate-0"
                    >
                      <path d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Custom scrollbar styles */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.15);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.25);
            }
          `}</style>
        </>
      )}
    </>
  );
}
