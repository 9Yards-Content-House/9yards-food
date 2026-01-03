import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, Heart, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { PHONE_NUMBER } from '@/lib/constants';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart', showBadge: true },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
];

export default function MobileNav() {
  const location = useLocation();
  const { cartCount, favoritesCount } = useCart();

  const handleCallClick = () => {
    window.location.href = `tel:${PHONE_NUMBER}`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-[72px] px-1 pt-2 pb-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          const badgeCount = item.href === '/cart' ? cartCount : item.href === '/favorites' ? favoritesCount : 0;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1.5 px-2 rounded-xl transition-colors relative ${
                isActive ? 'text-secondary' : 'text-muted-foreground'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <div
                  className="absolute inset-0 bg-secondary/10 rounded-xl"
                />
              )}
              <div className="relative z-10">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {badgeCount > 0 && (
                  <span 
                    className="absolute -top-1.5 -right-2 w-4 h-4 bg-secondary text-secondary-foreground text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm"
                  >
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Click-to-Call Button */}
        <button
          onClick={handleCallClick}
          className="flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1.5 px-2 rounded-xl text-muted-foreground hover:text-green-600 transition-colors"
          aria-label="Call 9Yards Food"
        >
          <div className="relative">
            <Phone className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <span className="text-[11px] font-medium">Call</span>
        </button>
      </div>
    </nav>
  );
}
