import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Phone, Mail, MapPin, ArrowRight, Instagram, Youtube } from 'lucide-react';
import { WHATSAPP_NUMBER, PHONE_NUMBER_FORMATTED, EMAIL, SOCIAL_LINKS } from '@/lib/constants';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 448 512" fill="currentColor">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

// Navigation links
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

  const whatsappOrderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to place an order from 9Yards Food.")}`;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-300 animate-in fade-in"
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
              className="h-[2.8rem] w-auto object-contain"
            />
            <p className="text-white/80 text-[0.8rem]">Authentic Ugandan Cuisine</p>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Navigation Links */}
          <div className="px-5 py-6">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center h-12 px-4 -mx-1 text-[16px] font-medium rounded-xl transition-all duration-200 ${
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

          {/* Divider */}
          <div className="mx-5 border-t border-gray-200" />

          {/* WhatsApp CTA - Primary */}
          <div className="px-5 py-6">
            <a
              href={whatsappOrderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-12 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-[15px] rounded-xl transition-colors active:scale-[0.98]"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Order via WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-gray-200" />

          {/* Contact Section */}
          <div className="px-5 py-6">
            <h3 className="text-sm font-bold text-[#212282] mb-4">Get In Touch</h3>
            <div className="space-y-5">
              {/* Phone */}
              <a
                href={`tel:${PHONE_NUMBER_FORMATTED.replace(/\s/g, '')}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-full bg-[#E6411C]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#E6411C]" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-medium text-gray-800 group-hover:text-[#E6411C] transition-colors">
                    0708 899 597
                  </p>
                  <p className="text-xs text-gray-500">Tap to call</p>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-full bg-[#E6411C]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#E6411C]" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-medium text-gray-800 group-hover:text-[#E6411C] transition-colors">
                    {EMAIL}
                  </p>
                  <p className="text-xs text-gray-500">Send us a message</p>
                </div>
              </a>

              {/* Location */}
              <Link
                to="/delivery-zones"
                className="flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-full bg-[#E6411C]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#E6411C]" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[15px] font-medium text-gray-800 group-hover:text-[#E6411C] transition-colors">
                    Kampala, Uganda
                  </p>
                  <p className="text-xs text-gray-500">Check delivery areas</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-gray-200" />

          {/* Social Media Section */}
          <div className="px-5 py-6">
            <h3 className="text-sm font-bold text-[#212282] mb-4">Follow Our Journey</h3>
            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              {/* TikTok */}
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white transition-transform hover:scale-110"
                aria-label="Follow us on TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>

              {/* YouTube - Only show if link exists */}
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white transition-transform hover:scale-110"
                  aria-label="Subscribe on YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Bottom spacing for CTA */}
          <div className="h-28" />
        </div>

        {/* Bottom CTA Button - Sticky */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-white/95">
          <Link
            to="/menu?combo=true"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full h-12 bg-[#E6411C] hover:bg-[#d63815] text-white font-semibold text-[15px] rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Build Your Combo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>
    </div>
  );
}
