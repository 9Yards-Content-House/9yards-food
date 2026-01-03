import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_NUMBER } from '@/lib/constants';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Navigation links - flat list, no categories
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/delivery-zones', label: 'Delivery Areas' },
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Handle escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      
      // Focus trap
      if (e.key === 'Tab' && sidebarRef.current) {
        const focusableElements = sidebarRef.current.querySelectorAll(
          'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first element when opened
    setTimeout(() => firstFocusableRef.current?.focus(), 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar - Slides from RIGHT */}
      <nav
        ref={sidebarRef}
        role="navigation"
        aria-label="Mobile menu"
        className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[360px] bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.15)] flex flex-col transition-transform duration-300 ease-out animate-in slide-in-from-right"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#212282] to-[#2d2fa0] px-5 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <img 
              src="/images/logo/9Yards-Food-White-Logo.png" 
              alt="9Yards Food"
              className="h-9 w-auto object-contain"
            />
            <p className="text-white/70 text-[11px]">Authentic Ugandan Cuisine</p>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin">
          {/* Navigation Links */}
          <div className="px-5 pt-5 pb-6">
            <div className="space-y-0">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block py-3 px-3 -mx-3 text-[15px] font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-[#E6411C] font-semibold'
                        : 'text-gray-700 hover:text-[#E6411C] hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Social Media Section - No label, smaller icons */}
          <div className="px-5 py-5">
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com/9yardsfood"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
                style={{ background: 'linear-gradient(45deg, #E1306C, #C13584)' }}
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@9yardsfood"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center text-white transition-all duration-200 hover:scale-105 hover:opacity-90"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-gray-200" />

          {/* Contact Info - With icons and clickable links */}
          <div className="px-5 py-5 space-y-3">
            {/* Phone */}
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#E6411C] transition-colors"
            >
              <Phone className="w-4 h-4 text-gray-400" />
              <span>0708 899 597</span>
            </a>
            
            {/* Email */}
            <a
              href="mailto:deliveries@9yards.co.ug"
              className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#E6411C] transition-colors"
            >
              <Mail className="w-4 h-4 text-gray-400" />
              <span>deliveries@9yards.co.ug</span>
            </a>
            
            {/* Location */}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Kampala, Uganda</span>
            </div>
          </div>

          {/* Bottom spacing for CTA */}
          <div className="h-24" />
        </div>

        {/* Bottom CTA Button - Sticky */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-white/90">
          <Link
            to="/menu?combo=true"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#E6411C] hover:bg-[#d63815] text-white font-bold text-[15px] rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Build Your Combo
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
