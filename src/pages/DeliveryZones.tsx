import { motion } from 'framer-motion';
import { MapPin, Clock, Truck, Phone } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { deliveryZones } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';

export default function DeliveryZonesPage() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main className="pt-16 md:pt-20">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Delivery Areas
              </h1>
              <p className="text-primary-foreground/70">
                We deliver across Kampala! Check if we cover your area and see delivery fees.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Zones Grid */}
        <section className="section-padding">
          <div className="container-custom">
            {/* Free Delivery Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-2xl gradient-cta text-secondary-foreground text-center"
            >
              <Truck className="w-10 h-10 mx-auto mb-3" />
              <h3 className="text-xl font-bold mb-1">FREE Delivery</h3>
              <p className="text-secondary-foreground/80">
                On all orders over 50,000 UGX!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryZones.map((zone, index) => (
                <motion.div
                  key={zone.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-premium p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <h3 className="font-bold text-foreground">{zone.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {zone.estimatedTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-secondary font-bold">
                        {formatPrice(zone.fee)}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        delivery fee
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Not in list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center p-8 bg-muted/50 rounded-2xl"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">
                Don't See Your Area?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact us and we'll try to accommodate your delivery!
              </p>
              <a
                href="https://wa.me/256700488870"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contact Us on WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
