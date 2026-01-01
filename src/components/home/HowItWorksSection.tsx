import { motion } from 'framer-motion';
import { UtensilsCrossed, ChefHat, Truck, MessageCircle } from 'lucide-react';

const steps = [
  {
    icon: UtensilsCrossed,
    title: 'Choose Your Food',
    description: 'Browse our menu and select your favorite main dishes and sauce',
    color: 'bg-primary',
  },
  {
    icon: ChefHat,
    title: 'Customize & Add Extras',
    description: 'Pick your free side dish, add natural juices and desserts',
    color: 'bg-secondary',
  },
  {
    icon: MessageCircle,
    title: 'Order via WhatsApp or Pay Online',
    description: 'Send your order directly to us or pay securely online',
    color: 'bg-accent',
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Your food arrives hot and fresh within 30-45 minutes',
    color: 'bg-primary',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding">
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
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ordering your favorite Ugandan food is easy. Just follow these simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line (desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-border" />
              )}

              <div className="relative flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-secondary text-secondary-foreground text-xs font-bold rounded-full flex items-center justify-center z-10">
                  {index + 1}
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg relative z-10`}
                >
                  <step.icon className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
