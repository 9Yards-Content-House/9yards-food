import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'DJ Marcus',
    role: 'Radio Personality',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    quote: "The best local food I've ever had delivered. The matoke with fish is incredible!",
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Nalwanga',
    role: 'Influencer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    quote: "Fresh, authentic, and delivered hot. 9Yards is my go-to for local cuisine.",
    rating: 5,
  },
  {
    id: 3,
    name: 'Patrick Mukasa',
    role: 'Chef & Food Critic',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    quote: "Finally, a delivery service that respects traditional cooking methods. Outstanding!",
    rating: 5,
  },
  {
    id: 4,
    name: 'Grace Akello',
    role: 'TV Host',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    quote: "The groundnut sauce is exactly like my grandmother used to make. Pure nostalgia!",
    rating: 5,
  },
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
              className="card-premium p-6"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <button
                    onClick={() => setActiveVideo(testimonial.id)}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Play className="w-3 h-3 text-secondary-foreground fill-current" />
                  </button>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-3">
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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '10K+', label: 'Happy Customers' },
            { value: '4.9', label: 'Average Rating' },
            { value: '50K+', label: 'Orders Delivered' },
            { value: '30 min', label: 'Avg Delivery Time' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
