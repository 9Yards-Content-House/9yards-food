import { motion } from 'framer-motion';
import { Leaf, ChefHat, Award, Truck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Natural Ingredients',
    description:
      'We use only fresh, locally sourced ingredients. No preservatives, no shortcuts—just authentic Ugandan flavors.',
  },
  {
    icon: ChefHat,
    title: 'We Cook Our Own Food',
    description:
      'Unlike aggregators, we prepare every dish ourselves. Quality control from kitchen to your doorstep.',
  },
  {
    icon: Award,
    title: 'Celebrity & Influencer Approved',
    description:
      'Trusted by Uganda\'s top personalities for authentic, delicious local cuisine.',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description:
      'Hot food delivered in 30-45 minutes across Kampala. Track your order every step of the way.',
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800"
                alt="Fresh Ugandan cuisine"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:right-6 bg-card rounded-2xl shadow-elevated p-6 max-w-[240px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">100%</div>
                  <div className="text-sm text-muted-foreground">Natural</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Every ingredient is carefully selected for quality and freshness.
              </p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                Why 9Yards Food
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                The 9Yards Difference
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We're not just another food delivery service. We're passionate about 
                preserving and sharing the authentic flavors of Uganda with quality 
                you can taste in every bite.
              </p>
            </motion.div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
