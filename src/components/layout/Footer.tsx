import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';
import { WHATSAPP_NUMBER, SOCIAL_LINKS, getWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/constants';

// TikTok icon (Lucide doesn't have TikTok)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// WhatsApp icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Default WhatsApp message for footer
const defaultWhatsAppUrl = getWhatsAppUrl(WHATSAPP_MESSAGES.default);

export default function Footer() {
  return (
    // Hidden on mobile - users access footer content via MoreSheet in bottom nav
    <footer className="hidden lg:block bg-[#212282] text-white" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-6 py-12 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <Link to="/" className="inline-block mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212282] rounded">
              <img 
                src="/images/logo/9Yards-Food-White-Logo.png"
                alt="9Yards Food"
                loading="lazy"
                decoding="async"
                width={112}
                height={56}
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-white/80 text-[13px] leading-relaxed">
              Bringing authentic Ugandan cuisine to your doorstep. 100% natural ingredients, 
              cooked fresh with love in Kampala.
            </p>
          </div>

          {/* Explore - wrapped in nav for semantics */}
          <nav aria-label="Footer navigation">
            <h4 className="font-bold text-base mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/80 hover:text-[#E6411C] hover:underline underline-offset-2 transition-colors text-[13px] focus-visible:outline-none focus-visible:text-[#E6411C] focus-visible:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact - using address element for semantic HTML */}
          <div>
            <h4 className="font-bold text-base mb-4">Contact Us</h4>
            <address className="not-italic">
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="tel:+256708899597"
                    className="flex items-center gap-2.5 text-white/80 hover:text-[#E6411C] transition-colors text-[13px] focus-visible:outline-none focus-visible:text-[#E6411C] focus-visible:underline"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    +256 708 899 597
                  </a>
                </li>
                <li>
                  <a
                    href={defaultWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-white/80 hover:text-[#E6411C] transition-colors text-[13px] focus-visible:outline-none focus-visible:text-[#E6411C] focus-visible:underline"
                  >
                    <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                    Order via WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:deliveries@9yards.co.ug"
                    className="flex items-center gap-2.5 text-white/80 hover:text-[#E6411C] transition-colors text-[13px] focus-visible:outline-none focus-visible:text-[#E6411C] focus-visible:underline"
                  >
                    <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    deliveries@9yards.co.ug
                  </a>
                </li>
                <li>
                  <span
                    className="flex items-center gap-2.5 text-white/80 text-[13px]"
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    Kampala, Uganda
                  </span>
                </li>
              </ul>
            </address>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-base mb-4">Follow Us</h4>
            <div className="flex gap-2.5" role="list" aria-label="Social media links">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on Instagram"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E6411C] hover:scale-110 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212282]"
              >
                <Instagram className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow us on TikTok"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E6411C] hover:scale-110 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212282]"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
              <a
                href={defaultWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E6411C] hover:scale-110 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212282]"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
              {SOCIAL_LINKS.youtube && (
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Subscribe on YouTube"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#E6411C] hover:scale-110 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#212282]"
                >
                  <Youtube className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>
            <div className="mt-5">
              <p className="text-white/50 text-xs">Part of</p>
              <a
                href="https://9yards.co.ug"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E6411C] hover:underline text-[13px] font-medium focus-visible:outline-none focus-visible:underline"
              >
                9yards.co.ug
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} 9Yards Food. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs">
            <Link to="/privacy" className="text-white/50 hover:text-[#E6411C] hover:underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:text-[#E6411C] focus-visible:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/50 hover:text-[#E6411C] hover:underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:text-[#E6411C] focus-visible:underline">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
