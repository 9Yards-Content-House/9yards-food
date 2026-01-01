import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Clock, Leaf, Award, MapPin, Navigation } from 'lucide-react';
import { useState, useEffect } from 'react';

// Carousel images for rotating food display
const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600',
    alt: 'Delicious Ugandan cuisine',
  },
  {
    src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600',
    alt: 'Fresh grilled dishes',
  },
  {
    src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600',
    alt: 'Traditional local food',
  },
  {
    src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600',
    alt: 'Hot fresh meals',
  },
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Geolocation handler
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Use reverse geocoding to get address (simplified)
          const { latitude, longitude } = position.coords;
          // For demo, show coordinates - in production, use Google Maps API
          setLocation(`Kampala Area (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        } catch {
          setLocation('Location detected - Kampala');
        }
        setIsLocating(false);
      },
      () => {
        setLocation('');
        setIsLocating(false);
        alert('Unable to retrieve your location. Please enter it manually.');
      },
      { timeout: 10000 }
    );
  };

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

      {/* Rotating food image carousel */}
      <div className="absolute right-0 top-1/4 w-72 h-72 md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px] hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative w-full h-full"
          >
            <motion.img
              src={heroImages[currentImageIndex].src}
              alt={heroImages[currentImageIndex].alt}
              className="w-full h-full object-cover rounded-full shadow-2xl ring-4 ring-secondary/30"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-secondary/20 blur-3xl -z-10" />
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel indicators */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-secondary w-6' 
                  : 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>

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
            className="flex flex-wrap gap-3 mb-8"
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

          {/* Location Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-8"
          >
            <div className="relative max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where should we deliver?"
                className="w-full pl-12 pr-14 py-4 rounded-xl bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg text-base"
              />
              <button
                onClick={handleGetLocation}
                disabled={isLocating}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-secondary hover:bg-secondary/90 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Detect my location"
              >
                <Navigation className={`w-5 h-5 text-secondary-foreground ${isLocating ? 'animate-pulse' : ''}`} />
              </button>
            </div>
            <p className="text-primary-foreground/60 text-sm mt-2 ml-1">
              Enter your location or tap the button to auto-detect
            </p>
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

          {/* Celebrity endorsement badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-primary-foreground/30 flex items-center justify-center text-xs font-bold text-primary-foreground">SD</div>
              <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-primary-foreground/30 flex items-center justify-center text-xs font-bold text-primary-foreground">DJ</div>
              <div className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-primary-foreground/30 flex items-center justify-center text-xs font-bold text-primary-foreground">+5</div>
            </div>
            <div className="text-primary-foreground/80 text-sm">
              <span className="font-semibold text-secondary">🎯 Featured by</span> Spice Diana, Top DJs & More
            </div>
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
