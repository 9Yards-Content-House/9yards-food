import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ChefHat, Truck, MessageCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

const steps = [
  {
    icon: UtensilsCrossed,
    title: 'Choose Your Food',
    description: 'Browse our menu and select from authentic Ugandan main dishes like Matooke, Posho, Rice, Cassava, and more.',
  },
  {
    icon: ChefHat,
    title: 'Customize Your Combo',
    description: 'Pick your sauce (Meat, Chicken, Fish, G-Nuts, etc.), select preparation style, and choose your free side dish.',
  },
  {
    icon: MessageCircle,
    title: 'Order via WhatsApp or Pay Online',
    description: 'Send your order directly to us via WhatsApp or pay securely online with Mobile Money or card.',
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Your freshly prepared meal arrives hot at your doorstep within 30-45 minutes.',
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h1>
              <p className="text-primary-foreground/70">
                Ordering authentic Ugandan food has never been easier. Follow these simple steps.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 mb-12 last:mb-0"
                >
                  {/* Step Number & Line */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <step.icon className="w-7 h-7 text-secondary-foreground" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <span className="text-secondary font-bold text-sm">
                      Step {index + 1}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
                Start Your Order
                <span>→</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
