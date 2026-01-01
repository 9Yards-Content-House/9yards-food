import { motion, useInView } from 'framer-motion';
import { Play, Star, CheckCircle, X, Users, Trophy, Package, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'DJ Marcus',
    role: 'Radio Personality',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    quote: "The best local food I've ever had delivered. The matoke with fish is incredible!",
    rating: 5,
    verified: true,
    platform: 'instagram',
  },
  {
    id: 2,
    name: 'Sarah Nalwanga',
    role: 'Influencer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    quote: "Fresh, authentic, and delivered hot. 9Yards is my go-to for local cuisine.",
    rating: 5,
    verified: true,
    platform: 'tiktok',
  },
  {
    id: 3,
    name: 'Patrick Mukasa',
    role: 'Chef & Food Critic',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    quote: "Finally, a delivery service that respects traditional cooking methods. Outstanding!",
    rating: 5,
    verified: true,
    platform: 'instagram',
  },
  {
    id: 4,
    name: 'Grace Akello',
    role: 'TV Host',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    quote: "The groundnut sauce is exactly like my grandmother used to make. Pure nostalgia!",
    rating: 5,
    verified: true,
    platform: 'instagram',
  },
];

// Animated counter hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, isInView, startOnView]);

  return { count, ref };
}

// Stats data with icons
const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers', icon: Users },
  { value: 4.9, suffix: '', label: 'Average Rating', icon: Trophy, isDecimal: true },
  { value: 50000, suffix: '+', label: 'Orders Delivered', icon: Package },
  { value: 30, suffix: ' min', label: 'Avg Delivery Time', icon: Clock },
];

export default function SocialProofSection() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            Loved by Thousands
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            What People Are Saying
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join celebrities, influencers, and food lovers who trust 9Yards Food 
            for authentic Ugandan cuisine.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="card-premium p-6 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-secondary/20"
                  />
                  <button
                    onClick={() => setActiveVideo(testimonial.id)}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Play className="w-3 h-3 text-secondary-foreground fill-current ml-0.5" />
                  </button>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-foreground text-sm">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                    {testimonial.platform === 'instagram' && (
                      <svg className="w-3 h-3 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {testimonial.platform === 'tiktok' && (
                      <svg className="w-3 h-3 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 text-sm leading-relaxed">
                "{testimonial.quote}"
              </p>
            </motion.div>
          ))}
        </div>

        {/* View All Reviews CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button className="text-secondary font-semibold hover:underline flex items-center gap-2 mx-auto">
            View All Reviews
            <span>→</span>
          </button>
        </motion.div>

        {/* Stats with Count-up Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-card rounded-2xl p-2 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
            >
              <X className="w-4 h-4 text-secondary-foreground" />
            </button>
            <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-secondary mx-auto mb-3" />
                <p className="text-muted-foreground">Video testimonial coming soon</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

// Stat card component with count-up animation
function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { count, ref } = useCountUp(
    stat.isDecimal ? Math.floor(stat.value * 10) : stat.value,
    2000
  );
  const Icon = stat.icon;
  const displayValue = stat.isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center bg-card rounded-2xl p-6 shadow-soft"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
        {displayValue}{stat.suffix}
      </div>
      <div className="text-muted-foreground text-sm">{stat.label}</div>
    </motion.div>
  );
}
