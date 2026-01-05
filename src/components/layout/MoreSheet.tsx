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
        className="rounded-t-[32px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 border-none shadow-2xl safe-area-bottom bg-gray-50/95 backdrop-blur-xl"
      >
        {/* User Header Section */}
        <div className="bg-white px-6 pt-8 pb-6 border-b border-gray-100 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-blue-500 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <img 
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                        alt="User" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold text-primary">Welcome, Guest</h2>
                <p className="text-sm text-gray-500">Discover flavors today!</p>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Quick Actions Group */}
          <div className="space-y-3">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Support & Order</h3>
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <a
                    href={`tel:${PHONE_NUMBER_FORMATTED.replace(/\s/g, '')}`}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Call Us</p>
                      <p className="text-xs text-gray-500">{PHONE_NUMBER_FORMATTED}</p>
                    </div>
                  </a>

                  <a
                    href={defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <WhatsAppIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Order via WhatsApp</p>
                      <p className="text-xs text-gray-500">Chat with us directly</p>
                    </div>
                  </a>
             </div>
          </div>

          {/* Info Group */}
          <div className="space-y-3">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Information</h3>
             <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">Opening Hours</p>
                        <p className="text-xs text-gray-500">Daily: 10:00 AM - 10:00 PM</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
              >
                <TikTokIcon className="w-6 h-6" />
              </a>
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
                >
                  <Youtube className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 pb-20 text-center">
            <p className="text-xs text-gray-400 mb-2">Part of</p>
            <a
              href="https://9yards.co.ug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              9yards.co.ug
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <p className="text-[10px] text-gray-300 mt-4">
              v1.0.2 • © {new Date().getFullYear()} 9Yards Food
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
