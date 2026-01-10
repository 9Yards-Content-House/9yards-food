import { useState, useEffect, useRef, useCallback } from 'react';
import { Droplets, Sprout, Clock, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import OptimizedImage from '@/components/ui/optimized-image';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Droplets,
    title: '100% Pure',
    description: 'No preservatives or artificial flavors',
  },
  {
    icon: Clock,
    title: 'Fresh Daily',
    description: 'Made fresh when you order',
  },
  {
    icon: Sprout,
    title: 'Locally Sourced',
    description: 'From Ugandan farms',
  },
  {
    icon: Leaf,
    title: 'All Natural',
    description: 'Just real fruit, nothing else',
  },
];

const juiceImages = [
  { src: '/images/juices/01-9Yards-Food-Passion-Juice.jpg', alt: 'Fresh Passion Fruit Juice', name: 'Passion Fruit', color: '#F59E0B' },
  { src: '/images/juices/02-9Yards-Food-Mango-Juice.jpg', alt: 'Fresh Mango Juice', name: 'Mango', color: '#F97316' },
  { src: '/images/juices/03-9Yards-Food-Watermelon-Juice.jpg', alt: 'Fresh Watermelon Juice', name: 'Watermelon', color: '#EF4444' },
  { src: '/images/juices/04-9Yards-Food-Pineapple-Juice.jpg', alt: 'Fresh Pineapple Juice', name: 'Pineapple', color: '#EAB308' },
  { src: '/images/juices/05-9Yards-Food-Beetroot-Juice.jpg', alt: 'Fresh Beetroot Juice', name: 'Beetroot', color: '#DC2626' },
];

export default function WhyChooseUsSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Auto-play carousel (respects pause state)
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % juiceImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isPaused]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + juiceImages.length) % juiceImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % juiceImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  // Keyboard navigation for carousel
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToNext();
    }
  }, [goToPrevious, goToNext]);

  // Touch/swipe support
  const touchStartX = useRef<number | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
    touchStartX.current = null;
  };

  return (
    <section 
      ref={sectionRef}
      className="py-12 lg:py-20 bg-white overflow-hidden"
      aria-labelledby="juice-section-heading"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content Side */}
          <div className="order-1 lg:order-2 w-full">
            {/* Header */}
            <div 
              className={`mb-6 lg:mb-8 text-center lg:text-left transition-all duration-700 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-3">
                9Yards Juice
              </span>
              <h2 
                id="juice-section-heading"
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2"
              >
                Pure Ugandan Fruit Juice
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
                Fresh, locally-sourced fruits blended daily. No preservatives, just pure natural refreshment.
              </p>
            </div>

            {/* Features - stacked on mobile, 2x2 on tablet+ */}
            <ul 
              className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 list-none m-0 p-0 transition-all duration-700 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
              role="list"
              aria-label="Juice features"
            >
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#E6411C]/5"
                  style={{ transitionDelay: isVisible ? `${150 + index * 50}ms` : '0ms' }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg bg-[#E6411C]/10 flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <feature.icon className="w-4 h-4 text-[#E6411C]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div 
              className={`text-center lg:text-left transition-all duration-700 ease-out motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '350ms' : '0ms' }}
            >
              <Link
                to="/menu"
                className="btn-secondary inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                View All Juices
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Image Carousel Side */}
          <div 
            className={`order-2 lg:order-1 w-full relative transition-all duration-700 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
          >
            {/* Decorative blur */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#E6411C]/10 rounded-full blur-3xl" aria-hidden="true" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-3xl" aria-hidden="true" />
            
            <div 
              ref={carouselRef}
              className="relative aspect-[3/4] sm:aspect-[4/5] max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-xl bg-gray-100"
              role="region"
              aria-roledescription="carousel"
              aria-label="Fresh juice showcase"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onFocus={() => setIsPaused(true)}
              onBlur={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div aria-live="polite" aria-atomic="true" className="sr-only">
                Showing {juiceImages[currentSlide].name} Juice, slide {currentSlide + 1} of {juiceImages.length}
              </div>
              
              {juiceImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-out motion-reduce:transition-none ${
                    index === currentSlide 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-105'
                  }`}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${juiceImages.length}: ${image.name} Juice`}
                  aria-hidden={index !== currentSlide}
                >
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    priority={index === 0}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden="true" />
                  
                  {/* Juice name label */}
                  <div className="absolute bottom-20 left-0 right-0 text-center">
                    <span 
                      className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-bold backdrop-blur-sm"
                      style={{ backgroundColor: `${image.color}CC` }}
                    >
                      {image.name} Juice
                    </span>
                  </div>
                </div>
              ))}

              {/* Controls */}
              <div className="absolute inset-x-0 bottom-0 p-4 flex justify-between items-center">
                {/* Dots */}
                <div className="flex gap-1.5" role="tablist" aria-label="Carousel slides">
                  {juiceImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 ${
                        index === currentSlide
                          ? 'bg-white w-6'
                          : 'bg-white/40 w-2 hover:bg-white/70'
                      }`}
                      role="tab"
                      aria-selected={index === currentSlide}
                      aria-label={`Go to ${image.name} Juice slide`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevious}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
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
