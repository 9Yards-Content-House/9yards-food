import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Heart, Menu, X, Search, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import SearchModal from "./SearchModal";
import ComboBuilder from "@/components/menu/ComboBuilder";

// Simplified navigation - removed Order Guide and Delivery Areas (they remain in footer only)
const navLinks = [
  { href: "/menu", label: "Our Menu" },
  { href: "/deals", label: "Deals" },
  { href: "/delivery-zones", label: "Delivery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const location = useLocation();
  const { cartCount, state } = useCart();

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  // Determine if we should use transparent/white styling (only on home page before scroll)
  const useTransparentStyle = isHomePage && !isScrolled;

  // On non-home pages, always show as "scrolled" style (white background with colored logo)
  const showStickyStyle = isScrolled || !isHomePage;


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Global Search Shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dynamic icon color based on scroll state and page
  const iconColorClass = useTransparentStyle
    ? "text-white"
    : "text-foreground/70";

  // Dynamic nav link color based on scroll state and page
  const getNavLinkClass = (isActive: boolean) => {
    if (isActive) return "text-secondary";
    return useTransparentStyle
      ? "text-white hover:text-secondary"
      : "text-foreground/80 hover:text-secondary";
  };

  return (
    <>
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#212282] focus:text-white focus:rounded-lg focus:font-medium focus:text-sm focus:outline-none focus:ring-2 focus:ring-[#E6411C] focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <header
        className={`fixed left-0 right-0 z-50 h-16 sm:h-[4.5rem] md:h-20 transition-[background-color,box-shadow] duration-300 ${
          showStickyStyle
            ? "bg-white/[0.98] backdrop-blur-xl shadow-sm border-b border-white/20"
            : "bg-transparent"
        }`}
        style={{ top: 0 }}
      >
        <div className="container-custom h-full">
          <div className="flex items-center justify-between h-full px-4">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                src={
                  useTransparentStyle
                    ? "/images/logo/9Yards-Food-White-Logo.png"
                    : "/images/logo/9Yards-Food-White-Logo-colored.png"
                }
                alt="9Yards Food"
                fetchPriority="high"
                className="h-10 sm:h-12 md:h-14 lg:h-[3.8rem] w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${getNavLinkClass(
                    location.pathname === link.href
                  )}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 sm:p-2.5 rounded-full hover:bg-muted/20 transition-colors"
                aria-label="Search menu"
                title="Search Menu (Ctrl+K)"
              >
                <Search
                  className={`w-5 h-5 ${iconColorClass} transition-colors`}
                />
              </button>

              {/* Favorites */}
              <Link
                to="/favorites"
                className="p-2 sm:p-2.5 rounded-full hover:bg-muted/20 transition-colors relative"
                aria-label={`Favorites${state.favorites.length > 0 ? ` (${state.favorites.length} items)` : ""}`}
                title={`Favorites${state.favorites.length > 0 ? ` (${state.favorites.length})` : ""}`}
              >
                <Heart className={`w-5 h-5 ${iconColorClass} transition-colors`} />
                {state.favorites.length > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] px-1 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {state.favorites.length > 99 ? '99+' : state.favorites.length}
                  </span>
                )}
              </Link>

              {/* Order History */}
              <Link
                to="/order-history"
                className="p-2 sm:p-2.5 rounded-full hover:bg-muted/20 transition-colors hidden sm:flex"
                aria-label="Order History"
                title="Order History"
              >
                <Clock className={`w-5 h-5 ${iconColorClass} transition-colors`} />
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="hidden lg:flex p-2 sm:p-2.5 rounded-full hover:bg-muted/20 transition-colors relative"
                aria-label={`Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
                title={`Shopping Cart${cartCount > 0 ? ` (${cartCount} items)` : ""}`}
              >
                <ShoppingCart className={`w-5 h-5 ${iconColorClass} transition-colors`} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-1 min-w-[18px] h-[18px] px-1 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* CTA Button - Desktop */}
              <button
                onClick={() => setIsComboBuilderOpen(true)}
                className="hidden md:flex btn-secondary text-sm py-2.5 px-5 ml-2 lg:ml-4"
                title="Create your perfect meal combo"
              >
                Build Your Combo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Combo Builder Modal */}
      <ComboBuilder
        isOpen={isComboBuilderOpen}
        onClose={() => setIsComboBuilderOpen(false)}
      />
    </>
  );
}
