import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] sm:min-h-[90svh] md:min-h-[85svh] lg:min-h-[80svh] flex items-center overflow-hidden pt-20 sm:pt-24 md:pt-24 lg:pt-24 pb-12 sm:pb-16 md:pb-20">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-primary-foreground leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              Craving Local Ugandan Food? We've <span className="text-secondary">Got You.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/80 mb-5 sm:mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 lg:max-w-xl">
              Freshly cooked with 100% natural ingredients and delivered hot to your door in 30-45 minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/menu"
                className="btn-secondary text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center whitespace-nowrap"
              >
                Build Your Combo
              </Link>
              <Link
                to="/menu"
                className="btn-ghost text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center whitespace-nowrap"
              >
                Browse Menu
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-md xl:max-w-lg">
            <div className="relative">
              <img
                src="/images/lusaniya/9Yards-Food-Lusaniya-01.png"
                alt="Delicious Ugandan food platter"
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
