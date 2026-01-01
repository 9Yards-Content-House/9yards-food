import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-bold text-lg">9Y</span>
              </div>
              <div>
                <span className="font-bold text-lg">9Yards</span>
                <span className="font-bold text-lg text-secondary ml-1">Food</span>
              </div>
            </div>
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
                { href: '/delivery-zones', label: 'Delivery Zones' },
                { href: '/how-it-works', label: 'How It Works' },
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
                  href="tel:+256700488870"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +256 700 488 870
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@9yards.co.ug"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  info@9yards.co.ug
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
                { icon: Instagram, href: 'https://instagram.com/9yardsfood', label: 'Instagram' },
                { icon: Youtube, href: 'https://youtube.com/@9yardsfood', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
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
