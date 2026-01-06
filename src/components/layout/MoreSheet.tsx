import { 
  Phone, 
  Instagram, 
  Youtube,
  Clock,
  ExternalLink,
  Mail,
  ArrowRight
} from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { SOCIAL_LINKS, getWhatsAppUrl, WHATSAPP_MESSAGES, PHONE_NUMBER_FORMATTED, EMAIL, BUSINESS_HOURS } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

// TikTok icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface MoreSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MoreSheet({ open, onOpenChange }: MoreSheetProps) {
  const defaultWhatsAppUrl = getWhatsAppUrl(WHATSAPP_MESSAGES.default);

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
        label: 'Open Now', 
        class: 'bg-green-50 text-green-700 border-green-100' 
      };
    } else if (currentTimeMinutes >= warningTime && currentTimeMinutes < closeTime) {
      return { 
        label: 'Closing Soon', 
        class: 'bg-orange-50 text-orange-700 border-orange-100' 
      };
    } else {
      return { 
        label: 'Closed', 
        class: 'bg-red-50 text-red-700 border-red-100' 
      };
    }
  };

  const status = getKitchenStatus();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-2xl max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl safe-area-bottom bg-white [&>button]:hidden sm:max-w-md sm:mx-auto sm:rounded-2xl sm:bottom-6 sm:left-4 sm:right-4 sm:max-h-[70vh]"
      >
        {/* Brand Header Section - Simplified & Branded */}
        <div className="bg-primary px-6 py-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-10 h-1 rounded-full bg-white/20 mb-4 shrink-0" />
            <h2 className="text-xl font-bold text-white tracking-tight">We're Here to Help</h2>
            <p className="text-white/70 text-[11px] mt-1 max-w-[200px]">
              Support available daily {BUSINESS_HOURS.open} - {BUSINESS_HOURS.close}
            </p>
          </div>
        </div>

        {/* Scrollable Content - Tighter padding */}
        <div className="overflow-y-auto flex-1 px-5 pt-5 pb-6 space-y-5">
          
          {/* Contact Hub - Reduced padding & radius */}
          <div className="grid gap-2">
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 active:scale-[0.98] transition-all border border-gray-100"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <WhatsAppIcon className="w-4.5 h-4.5 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-[13px] tracking-tight">Order on WhatsApp</p>
                  <p className="text-[10px] text-gray-500 font-medium leading-none">Fastest way to order</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
              </a>

              <a
                href={`tel:${PHONE_NUMBER_FORMATTED.replace(/\s/g, '')}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 active:scale-[0.98] transition-all border border-gray-100"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <Phone className="w-4.5 h-4.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-[13px] tracking-tight">Call Support</p>
                  <p className="text-[10px] text-gray-500 font-medium leading-none">Instant assistance</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
              </a>

              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50 active:scale-[0.98] transition-all border border-gray-100"
              >
                <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <Mail className="w-4.5 h-4.5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-[13px] tracking-tight">Email Support</p>
                  <p className="text-[10px] text-gray-500 font-medium leading-none">{EMAIL}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
              </a>
          </div>

          {/* Status & Socials - Combined for compactness */}
          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <p className="text-[11px] font-bold text-gray-900">Kitchen Status</p>
                </div>
                <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border shadow-sm ${status.class}`}>
                    {status.label}
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-2">
                <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
                >
                    <Instagram className="w-4 h-4 text-gray-900" />
                    <span className="text-[9px] font-bold text-gray-900 uppercase">Instagram</span>
                </a>
                <a
                    href={SOCIAL_LINKS.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-lg bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
                >
                    <TikTokIcon className="w-4 h-4 text-gray-900" />
                    <span className="text-[9px] font-bold text-gray-900 uppercase">TikTok</span>
                </a>
             </div>
          </div>

          {/* Primary Action Button - Branded & Top-focused */}
          <div className="flex flex-col items-center gap-5">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-[13px] active:scale-[0.98] transition-all shadow-lg"
            >
              Close Menu
            </button>

            <a
              href="https://9yards.co.ug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[9px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
            >
              Part of 9yards.co.ug
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
