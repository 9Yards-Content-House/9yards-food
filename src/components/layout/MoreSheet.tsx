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
        className="rounded-t-3xl max-h-[85vh] overflow-y-auto safe-area-bottom"
      >
        <SheetHeader className="pb-4 border-b border-border">
          <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-2" />
          <SheetTitle className="text-center">More Options</SheetTitle>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Quick Contact */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Contact Us
            </h3>
            <div className="space-y-2">
              <a
                href={`tel:${PHONE_NUMBER_FORMATTED.replace(/\s/g, '')}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Call Us</p>
                  <p className="text-xs text-muted-foreground">{PHONE_NUMBER_FORMATTED}</p>
                </div>
              </a>
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-green-700">Order via WhatsApp</p>
                  <p className="text-xs text-green-600">Chat with us directly</p>
                </div>
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Hours
            </h3>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-sm">Open Daily</p>
                <p className="text-xs text-muted-foreground">10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Follow Us
            </h3>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* 9Yards Branding */}
          <div className="pt-4 border-t border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">Part of</p>
            <a
              href="https://9yards.co.ug"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-secondary hover:underline"
            >
              9yards.co.ug
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-xs text-muted-foreground mt-3">
              © {new Date().getFullYear()} 9Yards Food. All rights reserved.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
