import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { WHATSAPP_NUMBER, SOCIAL_LINKS, getWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/constants';

// TikTok icon (Lucide doesn't have TikTok)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Default WhatsApp message for footer
const defaultWhatsAppUrl = getWhatsAppUrl(WHATSAPP_MESSAGES.default);

export default function Footer() {
  return (
    // Hidden on mobile - users access footer content via MoreSheet in bottom nav
    <footer className="hidden lg:block bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/images/logo/9Yards-Food-White-Logo.png"
                alt="9Yards Food"
                className="h-20 w-auto object-contain"
              />
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Bringing authentic Ugandan cuisine to your doorstep. 100% natural ingredients, 
              cooked fresh with love in Kampala.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '#', label: 'How to Order' },
                { href: '#', label: 'Delivery Areas' },
                { href: '#', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+256708899597"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +256 708 899 597
                </a>
              </li>
              <li>
                <a
                  href={defaultWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  Order via WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:deliveries@9yards.co.ug"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  deliveries@9yards.co.ug
                </a>
              </li>
              <li>
                <Link
                  to="/delivery-zones"
                  className="flex items-start gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Kampala, Uganda
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <TikTokIcon className="w-5 h-5" />
              </a>
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </a>
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe on YouTube"
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
            <div className="mt-6">
              <p className="text-primary-foreground/50 text-xs">Part of</p>
              <a
                href="https://9yards.co.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline text-sm font-medium"
              >
                9yards.co.ug
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} 9Yards Food. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-primary-foreground/50 hover:text-secondary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-foreground/50 hover:text-secondary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
