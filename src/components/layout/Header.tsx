import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, Menu, X, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';

// Simplified navigation - removed Order Guide and Delivery Areas (they remain in footer only)
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

// Mobile navigation includes all pages
const mobileNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/how-it-works', label: 'Order Guide' },
  { href: '/delivery-zones', label: 'Delivery Areas' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { cartCount, state } = useCart();

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
        className={`fixed left-0 right-0 z-50 h-16 sm:h-[4.5rem] md:h-20 transition-all duration-300 ${
          showStickyStyle
            ? 'bg-white shadow-soft'
            : 'bg-transparent'
        }`}
        style={{ top: 0 }}
      >
        <div className="container-custom h-full">
          <div className="flex items-center justify-between h-full px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center h-full py-2">
              <img 
                src={useTransparentStyle 
                  ? "/images/logo/9Yards-Food-White-Logo.png" 
                  : "/images/logo/9Yards-Food-White-Logo-colored.png"
                }
                alt="9Yards Food"
                className="h-full max-h-10 sm:max-h-12 md:max-h-14 lg:max-h-[3.8rem] w-auto object-contain transition-opacity duration-300"
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
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors"
                aria-label="Search menu"
              >
                <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-colors`} />
              </button>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors relative"
                aria-label={`Favorites${state.favorites.length > 0 ? ` (${state.favorites.length} items)` : ''}`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-colors`} />
                {state.favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                    {state.favorites.length}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors relative"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              >
                <ShoppingCart className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColorClass} transition-colors`} />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* CTA Button - Desktop */}
              <Link
                to="/menu?combo=true"
                className="hidden md:flex btn-secondary text-sm py-2.5 px-5"
              >
                Build Your Combo
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors lg:hidden ml-0.5"
                aria-expanded={isMobileMenuOpen}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass} transition-colors`} />
                ) : (
                  <Menu className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColorClass} transition-colors`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
        >
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav
            className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card shadow-elevated p-6 pt-24 overflow-y-auto transition-transform"
          >
            <div className="flex flex-col gap-2">
              {mobileNavLinks.map((link) => (
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
                  Build Your Combo
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
