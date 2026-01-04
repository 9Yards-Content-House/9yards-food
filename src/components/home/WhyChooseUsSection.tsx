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
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-secondary/5 to-background overflow-hidden">
      <div className="container-custom px-4">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Content Side - Order 1 on Mobile, 2 on Desktop (if we want image left) */}
          {/* Based on plan: Heading First on Mobile */}
          <div className="order-1 lg:order-2 w-full">
            <div className="mb-8 md:mb-10">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-4">
                Premium Natural Juices
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                Pure Ugandan Fruit Juice
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                We blend fresh, locally-sourced fruits daily to create authentic Ugandan juices. 
                No preservatives, no artificial flavors, just pure, natural refreshment.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-card/50 hover:bg-card border border-border/50 hover:border-secondary/20 p-5 rounded-xl transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary group-hover:text-white transition-colors">
                      <feature.icon className="w-5 h-5 text-secondary group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Carousel Side - Order 2 on Mobile, 1 on Desktop */}
          <div className="order-2 lg:order-1 w-full relative">
            {/* Decorative Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
            
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/50 dark:border-white/5 bg-muted">
              {juiceImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                    index === currentSlide 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-110'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient Overlay for Text Readability if needed, though clean looks good */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ))}

              {/* Controls Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end bg-gradient-to-t from-black/60 to-transparent pt-20">
                {/* Dots */}
                <div className="flex gap-2">
                  {juiceImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white w-6'
                          : 'bg-white/40 w-2 hover:bg-white/60'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevious}
                    className="w-10 h-10 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="w-10 h-10 rounded-full bg-black/20 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/10"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
