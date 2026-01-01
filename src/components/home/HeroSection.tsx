import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, Leaf, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating food images */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute right-0 top-1/4 w-64 h-64 md:w-96 md:h-96 opacity-90 hidden lg:block"
      >
        <motion.img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
          alt="Delicious food"
          className="w-full h-full object-cover rounded-full shadow-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        />
      </motion.div>

      <div className="container-custom relative z-10 px-4 py-32 md:py-40">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
          >
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span className="text-primary-foreground text-sm font-medium">
              #1 Rated Local Food Delivery in Kampala
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6"
          >
            Authentic Ugandan
            <br />
            Cuisine, Delivered{' '}
            <span className="text-secondary">Fresh</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed"
          >
            Experience the rich flavors of Uganda with our freshly prepared local dishes. 
            100% natural ingredients, celebrity-approved, delivered in 30-45 minutes.
          </motion.p>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            {[
              { icon: Leaf, text: '100% Natural' },
              { icon: Clock, text: '30-45 min Delivery' },
              { icon: Award, text: 'Celebrity Approved' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full"
              >
                <item.icon className="w-4 h-4 text-secondary" />
                <span className="text-primary-foreground text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/menu"
              className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2 cta-pulse"
            >
              Order Now
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              to="/menu"
              className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold px-8 py-4 rounded-lg transition-all duration-200 hover:bg-primary-foreground/20 text-center"
            >
              View Menu
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-3 bg-secondary rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
