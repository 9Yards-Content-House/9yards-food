import { UtensilsCrossed, ChefHat, Wallet, Truck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const steps = [
  {
    icon: UtensilsCrossed,
    title: 'Build Your Combo',
    description: 'Choose your main dishes (matooke, rice, posho) and select your protein sauce',
  },
  {
    icon: ChefHat,
    title: 'Customize & Add Extras',
    description: 'Pick your FREE side dish, add 100% natural juices, and desserts',
  },
  {
    icon: Wallet,
    title: 'Choose Payment Method',
    description: 'Order via WhatsApp and pay on delivery, or pay instantly with Mobile Money/Card',
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Hot, fresh, and delivered to your door in 30-45 minutes',
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-10 md:py-14 lg:py-16 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-custom px-5 sm:px-6 md:px-8">
        {/* Section Header */}
        <div 
          className={`text-center mb-8 md:mb-10 lg:mb-12 transition-all duration-700 ease-out motion-reduce:transition-none ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-2">
            Simple Process
          </span>
          <h2 
            id="how-it-works-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-1 mb-2"
          >
            How to Order
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Get your authentic Ugandan meal in 4 easy steps
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative pl-2 sm:pl-0">
          {/* Connecting Line - Horizontal on lg+ */}
          <div 
            className={`absolute hidden lg:block top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-0.5 border-t-2 border-dashed border-gray-200 z-0 transition-all duration-1000 delay-300 motion-reduce:transition-none ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transformOrigin: 'left center' }}
            aria-hidden="true"
          />
          {/* Vertical connecting line for mobile/tablet */}
          <div 
            className={`absolute lg:hidden left-[42px] sm:left-[46px] top-16 bottom-16 w-0.5 border-l-2 border-dashed border-gray-200 z-0 transition-all duration-1000 delay-300 motion-reduce:transition-none ${
              isVisible ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
            }`}
            style={{ transformOrigin: 'top center' }}
            aria-hidden="true"
          />

          {/* Steps - Using semantic ordered list */}
          <ol 
            className="relative z-10 flex flex-col lg:flex-row lg:justify-between gap-7 sm:gap-8 lg:gap-4 list-none m-0 p-0"
            role="list"
          >
            {steps.map((step, index) => (
              <li
                key={index}
                className={`flex items-start lg:items-center lg:flex-col lg:text-center gap-5 sm:gap-6 lg:gap-0 flex-1 
                  group cursor-default rounded-2xl p-3 -m-3 lg:p-4 lg:-m-4
                  hover:bg-gray-50/80 focus-within:bg-gray-50/80
                  ${isVisible 
                    ? 'opacity-100 translate-y-0 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none' 
                    : 'opacity-0 translate-y-6'
                  }`}
                style={{ 
                  transitionDelay: isVisible ? `${150 + index * 100}ms` : '0ms'
                }}
                tabIndex={0}
                role="listitem"
                aria-label={`Step ${index + 1}: ${step.title}`}
              >
                {/* Icon Circle with Step Number */}
                <div className="relative flex-shrink-0">
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 bg-[#E6411C] text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center z-10 shadow-md"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </div>
                  
                  {/* Icon Circle */}
                  <div 
                    className="w-[72px] h-[72px] sm:w-20 sm:h-20 md:w-[88px] md:h-[88px] bg-[#FFF7F5] rounded-full flex items-center justify-center border border-orange-100 lg:mb-4 shadow-sm shadow-orange-100/50"
                    aria-hidden="true"
                  >
                    <step.icon 
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-[#E6411C]" 
                      strokeWidth={1.5} 
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 lg:flex-none pt-1 sm:pt-2 lg:pt-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#212282] uppercase tracking-wide mb-1.5 lg:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] text-gray-600 leading-relaxed lg:max-w-[200px] lg:mx-auto">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
