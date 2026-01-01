import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';
import { deliveryZones } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';

export default function DeliveryZonesPreview() {
  const featuredZones = deliveryZones.slice(0, 6);

  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Delivery Coverage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              We Deliver Across Kampala
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed">
              From Kololo to Ntinda, Bugolobi to Muyenga—we've got Kampala covered. 
              Check if we deliver to your area and see our delivery fees.
            </p>

            {/* Zone Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {featuredZones.map((zone) => (
                <div
                  key={zone.name}
                  className="bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{zone.name}</span>
                  <span className="text-xs text-primary-foreground/60">
                    {formatPrice(zone.fee)}
                  </span>
                </div>
              ))}
            </div>

            <Link
              to="/delivery-zones"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All Zones
              <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-primary-foreground/5 border border-primary-foreground/10">
              {/* Simple map placeholder */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-secondary mx-auto mb-4" />
                  <p className="text-primary-foreground/60 text-sm">
                    Interactive map available on Delivery Zones page
                  </p>
                </div>
              </div>

              {/* Animated pins */}
              {[
                { top: '30%', left: '40%' },
                { top: '45%', left: '55%' },
                { top: '60%', left: '35%' },
                { top: '35%', left: '60%' },
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ top: pos.top, left: pos.left }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: i * 0.3,
                  }}
                >
                  <div className="w-4 h-4 bg-secondary rounded-full shadow-lg" />
                  <div className="absolute top-1 left-1 w-2 h-2 bg-secondary/50 rounded-full animate-ping" />
                </motion.div>
              ))}
            </div>

            {/* Free delivery badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground px-6 py-3 rounded-xl shadow-lg"
            >
              <div className="text-xs uppercase tracking-wider opacity-80">
                Orders over 50,000 UGX
              </div>
              <div className="font-bold text-lg">FREE Delivery!</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
