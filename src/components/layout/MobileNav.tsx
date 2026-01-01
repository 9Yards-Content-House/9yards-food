import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
];

export default function MobileNav() {
  const location = useLocation();
  const { cartCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-xl transition-colors relative ${
                isActive ? 'text-secondary' : 'text-muted-foreground'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute inset-0 bg-secondary/10 rounded-xl"
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                />
              )}
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.href === '/cart' && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
