import { Link, useLocation } from 'react-router-dom';
import { 
  Phone, 
  Instagram, 
  Youtube,
  Clock,
  ExternalLink,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { SOCIAL_LINKS, getWhatsAppUrl, WHATSAPP_MESSAGES, PHONE_NUMBER_FORMATTED, EMAIL, BUSINESS_HOURS } from '@/lib/constants';
import { vibrate } from '@/lib/utils/ui';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

// TikTok icon manual definition to ensure it matches Lucide style
const TikTokIconComponent = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const location = useLocation();
  const defaultWhatsAppUrl = getWhatsAppUrl(WHATSAPP_MESSAGES.default);

  // Navigation links
  const navLinks = [
    { href: '/menu', label: 'Menu' },
    { href: '/deals', label: 'Deals & Offers' },
    { href: '/delivery-zones', label: 'Delivery Zones' },
    { href: '/order-history', label: 'Order History' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  // Dynamic Kitchen Hours logic
  const getKitchenStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTimeMinutes = hours * 60 + minutes;
    
    const openTime = 10 * 60; // 10:00 AM
    const closeTime = 22 * 60; // 10:00 PM
    const warningTime = closeTime - 30; // 09:30 PM

    if (currentTimeMinutes >= openTime && currentTimeMinutes < warningTime) {
      return { 
        label: 'OPEN NOW', 
        class: 'bg-green-50 text-green-700 border-green-100' 
      };
    } else if (currentTimeMinutes >= warningTime && currentTimeMinutes < closeTime) {
      return { 
        label: 'CLOSING SOON', 
        class: 'bg-orange-50 text-orange-700 border-orange-100' 
      };
    } else {
      return { 
        label: 'CLOSED', 
        class: 'bg-red-50 text-red-700 border-red-100' 
      };
    }
  };

  const status = getKitchenStatus();

  const handleNavClick = () => {
    vibrate(20);
    onOpenChange(false);
  };

  const handleContactClick = () => {
    vibrate(25);
  };

  const handleSocialClick = () => {
    vibrate(15);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl safe-area-bottom bg-white [&>button]:hidden sm:max-w-md sm:mx-auto sm:rounded-2xl sm:bottom-6 sm:left-4 sm:right-4 sm:max-h-[82vh]"
      >
        {/* Screen reader only title and description for accessibility */}
        <SheetTitle className="sr-only">More Options Menu</SheetTitle>
        <SheetDescription className="sr-only">
          Navigation links, contact options, and social media links
        </SheetDescription>
        
        {/* Brand Header Section - Extremely Compact */}
        <div className="bg-primary px-6 py-5 sm:py-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" aria-hidden="true" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-10 h-1 rounded-full bg-white/20 mb-3 shrink-0" aria-hidden="true" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">We're Here to Help</h2>
            <p className="text-white/70 text-[9px] mt-1 whitespace-nowrap tracking-widest uppercase">
              Support Available Daily {BUSINESS_HOURS.open} - {BUSINESS_HOURS.close}
            </p>
          </div>
        </div>

        {/* Content Container - Scrollable */}
        <div className="flex-1 px-5 pt-3 pb-6 flex flex-col gap-6 overflow-y-auto overscroll-contain">

          {/* Navigation Links */}
          <nav aria-label="More options navigation">
            <ul className="space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                
                return (
                  <li key={link.href}>
                    <Link
                      onClick={handleNavClick}
                      to={link.href}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        isActive
                          ? 'bg-primary/5 text-primary font-bold'
                          : 'hover:bg-gray-50 text-gray-700 font-medium'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span className="text-base">{link.label}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Contact Methods */}
          <div role="group" aria-label="Contact options" className="space-y-0.5">
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleContactClick}
                className="flex items-center gap-4 py-3 px-2 rounded-xl active:scale-[0.98] active:bg-gray-50 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                aria-label="Order on WhatsApp - Fastest way to order"
              >
                <WhatsAppIcon className="w-6 h-6 text-[#25D366] shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm tracking-tight">Order on WhatsApp</p>
                  <p className="text-[10px] text-gray-500 font-medium">Fastest way to order</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 group-active:translate-x-1 transition-transform" aria-hidden="true" />
              </a>

              <a
                href={`tel:${PHONE_NUMBER_FORMATTED.replace(/\s/g, '')}`}
                onClick={handleContactClick}
                className="flex items-center gap-4 py-3 px-2 rounded-xl active:scale-[0.98] active:bg-gray-50 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Call Support - Instant assistance"
              >
                <Phone className="w-5 h-5 ml-0.5 text-primary shrink-0" aria-hidden="true" />
                <div className="flex-1 ml-0.5">
                  <p className="font-bold text-gray-900 text-sm tracking-tight">Call Support</p>
                  <p className="text-[10px] text-gray-500 font-medium">Instant assistance</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 group-active:translate-x-1 transition-transform" aria-hidden="true" />
              </a>

              <a
                href={`mailto:${EMAIL}`}
                onClick={handleContactClick}
                className="flex items-center gap-4 py-3 px-2 rounded-xl active:scale-[0.98] active:bg-gray-50 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Email Support at ${EMAIL}`}
              >
                <Mail className="w-5 h-5 ml-0.5 text-gray-600 shrink-0" aria-hidden="true" />
                <div className="flex-1 ml-0.5">
                  <p className="font-bold text-gray-900 text-sm tracking-tight">Email Support</p>
                  <p className="text-[10px] text-gray-500 font-medium">{EMAIL}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 group-active:translate-x-1 transition-transform" aria-hidden="true" />
              </a>
          </div>

          <div className="space-y-4">
            {/* Business Status Card - Highly Compact */}
            <div className="bg-gray-50/50 rounded-xl p-3.5 border border-gray-100">
                <div className="flex items-center justify-between mb-3 px-1">
                    <div>
                        <p className="text-[10px] font-bold text-gray-900">Kitchen Status</p>
                        <p className="text-[9px] text-gray-500 font-medium uppercase tracking-tight">
                          Daily {BUSINESS_HOURS.open} - {BUSINESS_HOURS.close}
                        </p>
                    </div>
                    <div 
                      className={`px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest border shadow-sm ${status.class}`}
                      role="status"
                      aria-live="polite"
                    >
                        {status.label}
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Social media links">
                    <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleSocialClick}
                        className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Follow us on Instagram"
                    >
                        <Instagram className="w-4 h-4 text-gray-900" aria-hidden="true" />
                        <span className="text-[8px] font-bold text-gray-900 uppercase">Insta</span>
                    </a>
                    <a
                        href={SOCIAL_LINKS.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleSocialClick}
                        className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Follow us on TikTok"
                    >
                        <TikTokIconComponent className="w-4 h-4 text-gray-900" />
                        <span className="text-[8px] font-bold text-gray-900 uppercase">TikTok</span>
                    </a>
                    {SOCIAL_LINKS.youtube && (
                        <a
                            href={SOCIAL_LINKS.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleSocialClick}
                            className="flex flex-col items-center justify-center gap-1 py-2 rounded-lg bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            aria-label="Subscribe on YouTube"
                        >
                            <Youtube className="w-4 h-4 text-gray-900" aria-hidden="true" />
                            <span className="text-[8px] font-bold text-gray-900 uppercase">YouTube</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  vibrate(30);
                  onOpenChange(false);
                }}
                className="w-full py-4 rounded-xl bg-primary text-white font-bold text-sm active:scale-[0.98] transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Close Menu
              </button>

              <a
                href="https://9yards.co.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:rounded"
                aria-label="Visit 9yards.co.ug main website"
              >
                Part of 9yards.co.ug
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
