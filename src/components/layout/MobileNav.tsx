import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, MoreHorizontal } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import MoreSheet from './MoreSheet';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', showBadge: true },
];

export interface MobileNavProps {
  onChatClick?: () => void;
}

export default function MobileNav({ onChatClick }: MobileNavProps) {
  const location = useLocation();
  const { cartCount } = useCart();
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  const handleWhatsAppClick = () => {
    if (onChatClick) {
      onChatClick();
    } else {
      const hour = new Date().getHours();
      const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
      const message = `${greeting}! I'd like to place an order from 9Yards Food.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t sm:border border-white/20 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] safe-area-bottom lg:hidden sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-full sm:max-w-md sm:bottom-6 sm:rounded-2xl sm:shadow-2xl">
        <div className="flex items-center justify-around h-[72px] px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            const badgeCount = item.href === '/cart' ? cartCount : 0;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors relative ${
                  isActive ? 'text-secondary' : 'text-gray-400'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  {badgeCount > 0 && (
                    <span 
                      className="absolute -top-1.5 -right-2 w-4 h-4 bg-secondary text-secondary-foreground text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                    >
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* WhatsApp Order Button */}
          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center justify-center gap-1 min-w-[64px] h-full text-gray-400 hover:text-green-600 transition-colors relative"
            aria-label="Order via WhatsApp"
          >
            <div className="relative">
              <WhatsAppIcon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">WhatsApp</span>
          </button>

          {/* More Button */}
          <button
            onClick={() => setMoreSheetOpen(true)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[64px] h-full transition-colors relative ${
              moreSheetOpen ? 'text-secondary' : 'text-gray-400'
            }`}
            aria-label="More options"
          >
            <div className="relative">
              <MoreHorizontal className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-tight">More</span>
          </button>
        </div>
      </nav>

      {/* More Sheet */}
      <MoreSheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen} />
    </>
  );
}
