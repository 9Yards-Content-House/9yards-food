import { UtensilsCrossed, ChefHat, Wallet, Truck } from 'lucide-react';

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
  return (
    <section 
      className="py-10 md:py-14 lg:py-16 bg-white"
      aria-labelledby="how-it-works-heading"
    >
      <div className="container-custom px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <span className="text-[#E6411C] text-xs sm:text-sm font-bold uppercase tracking-wider">
            Simple Process
          </span>
          <h2 
            id="how-it-works-heading"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#212282] mt-1 mb-2"
          >
            How to Order
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Get your authentic Ugandan meal in 4 easy steps
          </p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line - Horizontal on lg+ */}
          <div 
            className="absolute hidden lg:block top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-0.5 border-t-2 border-dashed border-gray-200 z-0"
            aria-hidden="true"
          />
          {/* Vertical connecting line for mobile/tablet */}
          <div 
            className="absolute lg:hidden left-8 sm:left-10 top-20 bottom-20 w-0.5 border-l-2 border-dashed border-gray-200 z-0"
            aria-hidden="true"
          />

          {/* Steps */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start lg:items-center lg:flex-col lg:text-center gap-4 lg:gap-0 flex-1"
              >
                {/* Icon Circle with Step Number */}
                <div className="relative flex-shrink-0">
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 bg-[#E6411C] text-white text-xs sm:text-sm font-bold rounded-full flex items-center justify-center z-10 shadow-md"
                    aria-label={`Step ${index + 1}`}
                  >
                    {index + 1}
                  </div>
                  
                  {/* Icon Circle */}
                  <div 
                    className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-[#FFF7F5] rounded-full flex items-center justify-center border border-orange-100 lg:mb-4"
                    aria-hidden="true"
                  >
                    <step.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-[#E6411C]" strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 lg:flex-none">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#212282] uppercase tracking-wide mb-1 lg:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed lg:max-w-[200px] lg:mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
