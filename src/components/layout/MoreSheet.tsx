import { 
  Phone, 
  Instagram, 
  Youtube,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { SOCIAL_LINKS, getWhatsAppUrl, WHATSAPP_MESSAGES, PHONE_NUMBER_FORMATTED } from '@/lib/constants';
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="bottom" 
        className="rounded-t-[32px] max-h-[85vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl safe-area-bottom bg-white [&>button]:hidden"
      >
        {/* Grab Handle */}
        <div className="w-full h-10 flex items-center justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-gray-200" />
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-8">
          
          {/* Main Actions Group */}
          <div className="grid gap-3">
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <WhatsAppIcon className="w-6 h-6 text-gray-800" />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-gray-900 text-lg tracking-tight">Order on WhatsApp</p>
                  <p className="text-sm text-gray-500">Fast & easy ordering</p>
                </div>
              </a>

              <a
                href={`tel:${PHONE_NUMBER_FORMATTED.replace(/\s/g, '')}`}
                className="flex items-center gap-4 p-5 rounded-3xl bg-gray-50 active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-100">
                  <Phone className="w-6 h-6 text-gray-800" />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-gray-900 text-lg tracking-tight">Call for Support</p>
                  <p className="text-sm text-gray-500">Available daily 10am-10pm</p>
                </div>
              </a>
          </div>

          {/* Settings & Info */}
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Information</h3>
                <Clock className="w-4 h-4 text-gray-300" />
             </div>
             
             <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Kitchen Hours</p>
                        <p className="text-xs text-gray-500">Cooking fresh from 10:00 AM</p>
                    </div>
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-green-100">
                        Open Now
                    </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                    <a
                        href={SOCIAL_LINKS.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-2.5 py-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
                    >
                        <Instagram className="w-6 h-6 text-gray-700" />
                        <span className="text-[11px] font-bold text-gray-700">Instagram</span>
                    </a>
                    <a
                        href={SOCIAL_LINKS.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-2.5 py-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
                    >
                        <TikTokIcon className="w-6 h-6 text-gray-700" />
                        <span className="text-[11px] font-bold text-gray-700">TikTok</span>
                    </a>
                    {SOCIAL_LINKS.youtube && (
                        <a
                            href={SOCIAL_LINKS.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center justify-center gap-2.5 py-4 rounded-2xl bg-white shadow-sm border border-gray-100 active:scale-95 transition-transform"
                        >
                            <Youtube className="w-6 h-6 text-gray-700" />
                            <span className="text-[11px] font-bold text-gray-700">YouTube</span>
                        </a>
                    )}
                </div>
             </div>
          </div>

          {/* Footer & Close */}
          <div className="pt-4 flex flex-col items-center gap-6">
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-4 rounded-full bg-gray-900 text-white font-bold text-sm shadow-xl active:scale-[0.98] transition-all"
            >
              Close Menu
            </button>

            <a
              href="https://9yards.co.ug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
            >
              Part of 9yards.co.ug
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
