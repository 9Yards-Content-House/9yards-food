import { useState, useEffect } from 'react';
import { Droplets, RefreshCw, Sprout, Soup, ChevronLeft, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Droplets,
    title: '100% Pure Fruit Juice',
    description:
      'Made fresh daily from real Ugandan fruits. No preservatives, no artificial flavors, just pure natural goodness.',
    badge: 'No Preservatives',
    badgeColor: 'bg-green-500/10 text-green-600',
  },
  {
    icon: RefreshCw,
    title: 'Freshly Made Daily',
    description:
      'We prepare every juice fresh when you order. No bottled-months-ago products. Just farm-fresh fruit blended to perfection.',
    badge: null,
    badgeColor: '',
  },
  {
    icon: Sprout,
    title: 'Locally Sourced Fruits',
    description:
      'We source only the finest fruits from Ugandan farms. Supporting local agriculture while delivering authentic tropical flavors.',
    badge: null,
    badgeColor: '',
  },
  {
    icon: Soup,
    title: 'Perfect with Any Meal',
    description:
      'The perfect complement to our authentic Ugandan dishes. Refreshing, healthy, and delicious with every order.',
    badge: null,
    badgeColor: '',
  },
];

const juiceImages = [
  { src: '/images/juices/01-9Yards-Food-Passion-Juice.jpg', alt: 'Fresh Passion Fruit Juice' },
  { src: '/images/juices/02-9Yards-Food-Mango-Juice.jpg', alt: 'Fresh Mango Juice' },
  { src: '/images/juices/03-9Yards-Food-Watermelon-Juice.jpg', alt: 'Fresh Watermelon Juice' },
  { src: '/images/juices/04-9Yards-Food-Pineapple-Juice.jpg', alt: 'Fresh Pineapple Juice' },
  { src: '/images/juices/05-9Yards-Food-Beetroot-Juice.jpg', alt: 'Fresh Beetroot Juice' },
];

export default function WhyChooseUsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % juiceImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + juiceImages.length) % juiceImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % juiceImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Carousel Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-muted">
              {/* Carousel Images */}
              {juiceImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {juiceImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-white w-6 sm:w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div>
              <span className="text-secondary font-semibold text-xs sm:text-sm uppercase tracking-wider">
                PREMIUM NATURAL JUICES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 sm:mb-6">
                Pure Ugandan Fruit Juice
              </h2>
              <p className="text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base lg:text-lg">
                We blend fresh, locally-sourced fruits daily to create authentic Ugandan juices. 
                No preservatives, no artificial flavors, just pure, natural refreshment 
                that perfectly complements your meal.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-muted/50 transition-colors cursor-default"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-foreground text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      {feature.badge && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${feature.badgeColor}`}>
                          {feature.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
