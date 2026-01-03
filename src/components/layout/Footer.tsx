import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
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

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/delivery-zones', label: 'Delivery Areas' },
                { href: '/how-it-works', label: 'Order Guide' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
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
                  href="mailto:deliveries@9yards.co.ug"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  deliveries@9yards.co.ug
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-primary-foreground/70 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Kampala, Uganda
                </div>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com/9yardsfood', label: 'Follow us on Instagram' },
                { icon: Youtube, href: 'https://youtube.com/@9yardsfood', label: 'Subscribe on YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
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
