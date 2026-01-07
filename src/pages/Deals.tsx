import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Tag, Truck, Calendar, Copy, ArrowRight, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { toast } from "sonner";

export default function Deals() {
  const deals = [
    {
      id: "first-10",
      code: "FIRST10",
      title: "10% Off Your First Order",
      description: "New to 9Yards? Enjoy a warm welcome with 10% off your entire first purchase.",
      icon: Tag,
      color: "bg-blue-100 text-blue-700",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      terms: "Valid for new accounts only. No minimum spend.",
    },
    {
      id: "weekend-15",
      code: "WEEKEND15",
      title: "Weekend Special",
      description: "Make your weekends tastier! Get 15% off all combos every Saturday and Sunday.",
      icon: Calendar,
      color: "bg-orange-100 text-orange-700",
      btnColor: "bg-orange-600 hover:bg-orange-700",
      terms: "Valid Sat-Sun. Applies to Main+Sauce combos.",
    },
    {
      id: "free-delivery",
      title: "Free Delivery",
      description: "Order for UGX 50,000 or more and we'll bring it to your doorstep for free.",
      icon: Truck,
      color: "bg-green-100 text-green-700",
      btnColor: "bg-green-600 hover:bg-green-700",
      terms: "Automatic at checkout. Within standard delivery zones.",
      isAutomatic: true,
    },
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!", {
      description: `${code} has been copied to your clipboard.`,
      icon: <Check className="w-4 h-4 text-green-600" />,
    });
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="Deals & Promos | 9Yards Food"
        description="Check out our latest offers, promo codes, and special deals. Save with FIRST10, weekend specials, and free delivery offers."
        url="/deals"
      />
      <Header />

      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-primary text-primary-foreground py-12 md:py-20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="container-custom px-4 relative z-10 text-center max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
              Limited Time Offers
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Exclusive Deals & <br className="hidden md:block" />
              <span className="text-secondary">Special Promotions</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Serving you more for less. Grab the latest promo codes and enjoy authentic Ugandan cuisine at unbeatable prices.
            </p>
          </div>
        </section>

        {/* Deals Grid */}
        <section className="py-12 md:py-16 px-4">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {deals.map((deal) => (
                <div 
                  key={deal.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-border flex flex-col h-full group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${deal.color}`}>
                      <deal.icon className="w-6 h-6" />
                    </div>
                    {deal.code && (
                      <span className="text-xs font-bold bg-primary/5 text-primary px-2 py-1 rounded border border-primary/10">
                        PROMO CODE
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {deal.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    {deal.description}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    {deal.code ? (
                      <button
                        onClick={() => copyToClipboard(deal.code)}
                        className="w-full relative overflow-hidden group/btn bg-gray-50 hover:bg-gray-100 border border-gray-200 border-dashed rounded-xl p-3 flex items-center justify-between transition-all"
                      >
                        <span className="font-mono font-bold text-lg text-gray-800 ml-2">
                          {deal.code}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-primary pr-2">
                          <Copy className="w-3.5 h-3.5" />
                          Copy Code
                        </span>
                      </button>
                    ) : (
                      <Link
                        to="/menu"
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold transition-colors ${deal.btnColor}`}
                      >
                        Start Ordering
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                    
                    <p className="text-[11px] text-gray-400 text-center italic">
                      {deal.terms}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden">
               {/* Decorative circles */}
               <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[50%] -left-[10%] w-[100%] h-[200%] bg-secondary/10 rotate-12 blur-3xl rounded-[100%]" />
              </div>
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Don't Miss Out on Future Deals
                </h2>
                <p className="text-gray-300 mb-8">
                  Subscribe to our WhatsApp updates to get exclusive promo codes and flash sale alerts delivered straight to your phone.
                </p>
                
                <a 
                  href="https://wa.me/256708899597?text=Hi%2C%20I'd%20like%20to%20subscribe%20to%209Yards%20Food%20deals!"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3 rounded-full font-bold transition-transform hover:scale-105"
                >
                  Subscribe on WhatsApp
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
