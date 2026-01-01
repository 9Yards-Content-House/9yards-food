import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Menu, X, Search, MapPin, ClipboardList } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/delivery-zones', label: 'Delivery Zones' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartCount, state, orderHistory } = useCart();

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Determine if we should use transparent/white styling (only on home page before scroll)
  const useTransparentStyle = isHomePage && !isScrolled;
  
  // On non-home pages, always show as "scrolled" style (white background with colored logo)
  const showStickyStyle = isScrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Dynamic icon color based on scroll state and page
  const iconColorClass = useTransparentStyle ? 'text-white' : 'text-foreground/70';
  
  // Dynamic nav link color based on scroll state and page
  const getNavLinkClass = (isActive: boolean) => {
    if (isActive) return 'text-secondary';
    return useTransparentStyle ? 'text-white hover:text-secondary' : 'text-foreground/80 hover:text-secondary';
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          showStickyStyle
            ? 'bg-white shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20 px-4">
            {/* Logo - switches based on page and scroll state */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={useTransparentStyle 
                  ? "/images/logo/9Yards-Food-White-Logo.png" 
                  : "/images/logo/9Yards-Food-White-Logo-colored.png"
                }
                alt="9Yards Food"
                className="h-14 md:h-[3.8rem] w-auto object-contain transition-opacity duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${getNavLinkClass(location.pathname === link.href)}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                className="p-2 rounded-full hover:bg-muted/20 transition-colors hidden md:flex"
                aria-label="Search menu"
              >
                <Search className={`w-5 h-5 ${iconColorClass} transition-colors`} />
              </button>

              {/* Order History - show only if there are orders */}
              {orderHistory.length > 0 && (
                <Link
                  to="/order-history"
                  className="p-2 rounded-full hover:bg-muted/20 transition-colors relative hidden md:flex"
                  aria-label={`Order history (${orderHistory.length} orders)`}
                >
                  <ClipboardList className={`w-5 h-5 ${iconColorClass} transition-colors`} />
                </Link>
              )}

              <Link
                to="/favorites"
                className="p-2 rounded-full hover:bg-muted/20 transition-colors relative"
                aria-label={`Favorites${state.favorites.length > 0 ? ` (${state.favorites.length} items)` : ''}`}
              >
                <Heart className={`w-5 h-5 ${iconColorClass} transition-colors`} />
                {state.favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {state.favorites.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="p-2 rounded-full hover:bg-muted/20 transition-colors relative"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              >
                <ShoppingCart className={`w-5 h-5 ${iconColorClass} transition-colors`} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              <Link
                to="/menu"
                className="hidden md:flex btn-secondary text-sm py-2.5 px-5"
              >
                Order Now
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full hover:bg-muted/20 transition-colors lg:hidden"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className={`w-6 h-6 ${iconColorClass} transition-colors`} />
                ) : (
                  <Menu className={`w-6 h-6 ${iconColorClass} transition-colors`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-elevated p-6 pt-24"
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-lg font-medium py-3 px-4 rounded-lg transition-colors ${
                      location.pathname === link.href
                        ? 'bg-secondary/10 text-secondary'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    to="/menu"
                    className="btn-secondary w-full text-center block"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
