import { motion } from 'framer-motion';
import { UtensilsCrossed, ChefHat, Truck, MessageCircle, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: UtensilsCrossed,
    title: 'Choose Your Food',
    description: 'Browse our menu and select your favorite main dishes and sauce',
    color: 'bg-primary',
    iconColor: 'text-primary-foreground',
  },
  {
    icon: ChefHat,
    title: 'Customize & Add Extras',
    description: 'Pick your free side dish, add natural juices and desserts',
    color: 'bg-secondary',
    iconColor: 'text-secondary-foreground',
  },
  {
    icon: MessageCircle,
    title: 'Order via WhatsApp or Pay Online',
    description: 'Send your order directly to us or pay securely online',
    color: 'bg-accent',
    iconColor: 'text-accent-foreground',
    highlight: true,
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Your food arrives hot and fresh within 30-45 minutes',
    color: 'bg-primary',
    iconColor: 'text-primary-foreground',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            How to Order
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ordering your favorite Ugandan food is easy. Just follow these simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full opacity-20" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {/* Arrow Connector (desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-16 -right-3 z-20">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.3 }}
                    >
                      <ChevronRight className="w-6 h-6 text-secondary" />
                    </motion.div>
                  </div>
                )}

                <div className={`relative flex flex-col items-center text-center p-6 rounded-2xl transition-all duration-300 ${
                  step.highlight ? 'bg-secondary/5 border-2 border-secondary/20' : ''
                }`}>
                  {/* Step Number - Prominent */}
                  <motion.div 
                    className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-secondary text-secondary-foreground text-sm font-bold rounded-full flex items-center justify-center z-20 shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-24 h-24 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10 mt-4`}
                  >
                    <step.icon className={`w-12 h-12 ${step.iconColor}`} />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Payment options highlight for step 3 */}
                  {step.highlight && (
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-xs font-medium">
                        <MessageCircle className="w-3.5 h-3.5" />
                        WhatsApp
                      </div>
                      <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
                        <CreditCard className="w-3.5 h-3.5" />
                        Online Pay
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="flex lg:hidden justify-center my-4">
                    <div className="w-0.5 h-8 bg-gradient-to-b from-secondary to-transparent" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Encouraging CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-xl font-semibold text-foreground mb-4">
            It's that simple! 🎉
          </p>
          <Link
            to="/menu"
            className="btn-secondary inline-flex items-center gap-2"
          >
            Start Your Order
            <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
