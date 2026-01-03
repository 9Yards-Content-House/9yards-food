import { Grid3X3, ChefHat, Truck, ChevronRight, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getWhatsAppUrl, WHATSAPP_MESSAGES } from '@/lib/constants';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const steps = [
  {
    icon: Grid3X3,
    title: 'Build Your Combo',
    description: "Click 'Build Your Combo' and customize your meal with your favorite main dishes and sauce",
    bgColor: 'bg-[#212282]',
    iconColor: 'text-white',
  },
  {
    icon: ChefHat,
    title: 'Customize & Add Extras',
    description: 'Choose your free side dish, add natural juices, and desserts to complete your order',
    bgColor: 'bg-[#E6411C]',
    iconColor: 'text-white',
  },
  {
    icon: WhatsAppIcon,
    title: 'Choose Payment Method',
    description: 'Send order via WhatsApp for cash payment or pay online with Mobile Money/Card',
    bgColor: 'bg-[#25D366]',
    iconColor: 'text-white',
    showPaymentOptions: true,
  },
  {
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Your food arrives hot and fresh within 30-45 minutes straight from our kitchen',
    bgColor: 'bg-[#212282]',
    iconColor: 'text-white',
  },
];

export default function HowItWorksSection() {
  return (
    <section 
      className="py-12 md:py-16 lg:py-20 bg-[#F5F5F5] overflow-hidden"
      aria-labelledby="how-to-order-heading"
    >
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[#E6411C] font-semibold text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 
            id="how-to-order-heading"
            className="text-3xl md:text-4xl font-bold text-[#212282] mt-2 mb-4 font-sans"
          >
            How to Order
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-sans">
            Building your perfect Ugandan meal is easy. Just follow these simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative"
              >
                {/* Arrow Connector (desktop) */}
                {index < steps.length - 1 && (
                  <div 
                    className="hidden lg:flex absolute top-[60px] -right-3 z-20"
                    aria-hidden="true"
                  >
                    <ChevronRight className="w-6 h-6 text-[#E6411C]" />
                  </div>
                )}

                {/* Card */}
                <div 
                  className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl transition-all duration-300 hover:shadow-lg group"
                >
                  {/* Step Number Badge */}
                  <div 
                    className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#E6411C] text-white text-base font-bold rounded-full flex items-center justify-center z-20 shadow-md group-hover:scale-110 transition-transform"
                    aria-label={`Step ${index + 1}`}
                  >
                    {index + 1}
                  </div>

                  {/* Icon Container */}
                  <div
                    className={`w-20 h-20 ${step.bgColor} rounded-2xl flex items-center justify-center mb-5 shadow-md relative z-10 mt-6 group-hover:scale-105 transition-transform`}
                    aria-hidden="true"
                  >
                    {typeof step.icon === 'function' && step.icon === WhatsAppIcon ? (
                      <WhatsAppIcon className={`w-10 h-10 ${step.iconColor}`} />
                    ) : (
                      <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-[#212282] mb-2 font-sans">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 font-sans">
                    {step.description}
                  </p>

                  {/* Payment options for step 3 */}
                  {step.showPaymentOptions && (
                    <div className="flex items-center justify-center gap-3 mt-auto">
                      <a
                        href={getWhatsAppUrl(WHATSAPP_MESSAGES.default)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#22c55e] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        aria-label="Order via WhatsApp"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        WhatsApp
                      </a>
                      <Link
                        to="/menu"
                        className="flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                        aria-label="Pay online"
                      >
                        <CreditCard className="w-4 h-4" />
                        Online Pay
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div 
                    className="flex lg:hidden justify-center my-4"
                    aria-hidden="true"
                  >
                    <ChevronRight className="w-6 h-6 text-[#E6411C] rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center mt-12">
          <Link
            to="/menu?combo=true"
            className="inline-flex items-center gap-2 bg-[#E6411C] hover:bg-[#d13a18] text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Start building your combo"
          >
            Build Your Combo Now
            <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-600 mt-4 text-sm font-sans">
            Questions? Check our{' '}
            <Link to="/how-it-works" className="text-[#212282] hover:text-[#E6411C] underline transition-colors">
              FAQ
            </Link>{' '}
            or{' '}
            <a 
              href={getWhatsAppUrl(WHATSAPP_MESSAGES.inquiry)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:text-[#22c55e] underline transition-colors"
            >
              contact us on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
