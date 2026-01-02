import { Link } from "react-router-dom";
import { Clock, Truck } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[90svh] md:min-h-[85svh] lg:min-h-[80svh] flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-24 lg:pt-24 pb-8 sm:pb-12 md:pb-16">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-12 xl:gap-20">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left max-w-2xl lg:max-w-none">
            {/* Headline */}
            <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary-foreground leading-[1.15] mb-4 sm:mb-5 md:mb-6">
              Craving Local Ugandan Food? We've <span className="text-secondary">Got You.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/80 mb-6 sm:mb-8 leading-relaxed max-w-md mx-auto lg:mx-0 lg:max-w-lg">
              Freshly cooked with 100% natural ingredients and delivered hot to your door in 30-45 minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
              <Link
                to="/menu"
                className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-center whitespace-nowrap font-bold"
              >
                Build Your Combo
              </Link>
              <Link
                to="/menu"
                className="btn-ghost text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-center whitespace-nowrap"
              >
                Browse Menu
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">30-45 min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Free delivery over 50k</span>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full max-w-[260px] sm:max-w-[300px] md:max-w-[360px] lg:max-w-[420px] xl:max-w-[480px]">
            <div className="relative">
              <img
                src="/images/lusaniya/9Yards-Food-Lusaniya-01.png"
                alt="Delicious Ugandan food platter"
                className="w-full h-auto object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
