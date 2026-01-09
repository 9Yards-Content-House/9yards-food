import { useState, useEffect } from 'react';
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
    <section className="py-12 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Content Side */}
          <div className="order-1 lg:order-2 w-full">
            {/* Header */}
            <div className="mb-6 lg:mb-8 text-center lg:text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-[#E6411C]/10 text-[#E6411C] text-xs font-bold uppercase tracking-wide mb-3">
                9Yards Juice
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">
                Pure Ugandan Fruit Juice
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto lg:mx-0">
                Fresh, locally-sourced fruits blended daily. No preservatives, just pure natural refreshment.
              </p>
            </div>

            {/* Features - 2x2 compact grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#E6411C]/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E6411C]/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-[#E6411C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center lg:text-left">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 bg-[#E6411C] hover:bg-[#d13a18] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                View All Juices
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Image Carousel Side */}
          <div className="order-2 lg:order-1 w-full relative">
            {/* Decorative blur */}
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#E6411C]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#F59E0B]/10 rounded-full blur-3xl" />
            
            <div className="relative aspect-[3/4] sm:aspect-[4/5] max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-xl bg-gray-100">
              {juiceImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-500 ease-out ${
                    index === currentSlide 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <OptimizedImage
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    priority={index === 0}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
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
                <div className="flex gap-1.5">
                  {juiceImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'bg-white w-6'
                          : 'bg-white/40 w-2 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-2">
                  <button
                    onClick={goToPrevious}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all"
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
