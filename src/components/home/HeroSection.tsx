import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-[500px] md:h-[650px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative z-10 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-tight mb-6">
            Authentic Ugandan
            <br />
            Cuisine, Delivered{' '}
            <span className="text-secondary">Fresh</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed max-w-xl mx-auto">
            Experience the rich flavors of Uganda with our freshly prepared local dishes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>
      </div>
    </section>
  );
}
