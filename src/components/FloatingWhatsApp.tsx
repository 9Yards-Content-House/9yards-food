import { X, ShoppingCart, UtensilsCrossed, Truck, Package, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { useCart } from '@/context/CartContext';

// Pages where the widget should NOT appear
const HIDDEN_PAGES = ['/cart', '/order-confirmation'];

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const { state } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const cartItemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const userLocation = state.userPreferences.location || localStorage.getItem('deliveryZone') || '';
  
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

  const handleAction = (action: string) => {
    let message = '';

    switch (action) {
      case 'order':
        if (cartItemCount > 0) {
          navigate('/cart');
          setIsOpen(false);
          return;
        } else {
          message = `${getGreeting()}! I'd like to place an order. What's available today?`;
        }
        break;

      case 'menu':
        message = `${getGreeting()}! Can you send me today's menu and prices?`;
        break;

      case 'delivery':
        message = userLocation 
          ? `${getGreeting()}! Do you deliver to ${userLocation}? What's the delivery fee and time?`
          : `${getGreeting()}! I'd like to know your delivery areas and fees.`;
        break;

      case 'track':
        const lastOrderId = localStorage.getItem('lastOrderId');
        message = lastOrderId 
          ? `${getGreeting()}! I'd like to track my order #${lastOrderId}. What's the status?`
          : `${getGreeting()}! I placed an order recently. Can you help me track it?`;
        break;

      case 'chat':
        message = `${getGreeting()}! I have a question about 9Yards Food.`;
        break;

      default:
        message = `${getGreeting()}! I'd like to know more about 9Yards Food.`;
    }

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button - Mobile first positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-4 z-50 w-12 h-12 sm:w-14 sm:h-14 sm:bottom-32 lg:bottom-8 lg:right-6 bg-[#25D366] hover:bg-[#22c55e] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white/20"
        aria-label="Chat on WhatsApp"
      >
        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        ) : (
          <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
        )}
      </button>

      {/* Chat Widget - Mobile first responsive */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed z-50 bottom-0 left-0 right-0 sm:bottom-48 sm:left-auto sm:right-4 lg:right-6 lg:bottom-28 w-full sm:w-[340px] lg:w-[360px] bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden border-0 sm:border border-gray-200 animate-in slide-in-from-bottom-5 duration-200 max-h-[85vh] sm:max-h-[480px]">
            {/* Header - Compact */}
            <div className="bg-[#212282] px-4 py-3 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* White Logo */}
                  <div className="h-9 w-auto flex items-center">
                    <img 
                      src="/images/logo/9Yards-Food-White-Logo.png" 
                      alt="9Yards Food"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                    <span>Online</span>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body - Compact */}
            <div className="p-3 bg-gray-50 overflow-y-auto max-h-[calc(85vh-120px)] sm:max-h-none">
              {/* Welcome Message - Compact */}
              <div className="bg-white rounded-lg p-2.5 shadow-sm mb-3 border border-gray-100">
                <p className="text-sm text-[#212282] font-medium">
                  {getGreeting()}! How can we help?
                </p>
                <span className="text-[10px] text-gray-400 mt-0.5 block">Just now</span>
              </div>

              {/* Quick Actions - Compact with subtitles */}
              <div className="space-y-1.5">
                {/* Place Order */}
                <button
                  onClick={() => handleAction('order')}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all text-left group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[#212282] block">Place an Order</span>
                    <span className="text-[11px] text-gray-500 block truncate">
                      {cartItemCount > 0 
                        ? <span className="text-[#E6411C] font-medium">{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart</span>
                        : 'Start a new order'
                      }
                    </span>
                  </div>
                  {cartItemCount > 0 && (
                    <span className="w-5 h-5 bg-[#E6411C] text-white rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </button>

                {/* Check Menu */}
                <button
                  onClick={() => handleAction('menu')}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all text-left group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#212282]/10 flex items-center justify-center group-hover:bg-[#212282]/20 transition-colors flex-shrink-0">
                    <UtensilsCrossed className="w-4 h-4 text-[#212282]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[#212282] block">Check Today's Menu</span>
                    <span className="text-[11px] text-gray-500 block">See all available dishes</span>
                  </div>
                </button>

                {/* Delivery Areas */}
                <button
                  onClick={() => handleAction('delivery')}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all text-left group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#E6411C]/10 flex items-center justify-center group-hover:bg-[#E6411C]/20 transition-colors flex-shrink-0">
                    <Truck className="w-4 h-4 text-[#E6411C]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[#212282] block">Delivery Areas & Fees</span>
                    <span className="text-[11px] text-gray-500 block">Check if we deliver to you</span>
                  </div>
                </button>

                {/* Track Order */}
                <button
                  onClick={() => handleAction('track')}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all text-left group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors flex-shrink-0">
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[#212282] block">Track My Order</span>
                    <span className="text-[11px] text-gray-500 block">Where's my food?</span>
                  </div>
                </button>

                {/* Chat */}
                <button
                  onClick={() => handleAction('chat')}
                  className="w-full flex items-center gap-2.5 p-2.5 bg-white rounded-lg border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all text-left group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-[#212282] block">Chat with Us</span>
                    <span className="text-[11px] text-gray-500 block">Ask us anything</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Footer - Compact with call option */}
            <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <WhatsAppIcon className="w-3 h-3" />
                Powered by WhatsApp
              </p>
              <a 
                href="tel:+256708899597" 
                className="text-[11px] text-[#E6411C] hover:underline flex items-center gap-1 font-medium"
              >
                <Phone className="w-3 h-3" />
                Call us
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
