import { motion } from 'framer-motion';
import { Leaf, ChefHat, Award, Heart, Truck, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-16 md:py-24">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-2 mb-6">
                Bringing Authentic Ugandan Flavors to Your Doorstep
              </h1>
              <p className="text-primary-foreground/70 text-lg leading-relaxed">
                At 9Yards Food, we're passionate about preserving the rich culinary heritage 
                of Uganda while making it accessible to everyone through modern food delivery.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800"
                  alt="Cooking in kitchen"
                  className="rounded-3xl shadow-elevated"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We believe every Ugandan deserves access to delicious, freshly prepared 
                  local cuisine without compromising on quality or authenticity. That's why 
                  we cook every dish ourselves, using only 100% natural ingredients sourced 
                  from local farmers and markets.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike food aggregators, we don't just connect you to restaurants—we ARE 
                  the kitchen. Every meal is prepared with love, care, and decades of 
                  culinary expertise passed down through generations.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-muted/30">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                What We Stand For
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Leaf,
                  title: '100% Natural',
                  description: 'No preservatives, no shortcuts. Just fresh, natural ingredients in every dish.',
                },
                {
                  icon: ChefHat,
                  title: 'We Cook It All',
                  description: 'Every meal is prepared in our own kitchen with quality control at every step.',
                },
                {
                  icon: Heart,
                  title: 'Made With Love',
                  description: 'Traditional recipes passed down through generations, cooked with passion.',
                },
                {
                  icon: Truck,
                  title: 'Fast Delivery',
                  description: 'Hot food delivered to your door in 30-45 minutes across Kampala.',
                },
                {
                  icon: Award,
                  title: 'Quality First',
                  description: 'Celebrity-approved quality that you can taste in every single bite.',
                },
                {
                  icon: Users,
                  title: 'Community Focus',
                  description: 'Supporting local farmers and creating jobs in our community.',
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-premium p-6 text-center"
                >
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
