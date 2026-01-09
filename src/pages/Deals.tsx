import { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Tag, Truck, Calendar, Copy, ArrowRight, Check, 
  Clock, GraduationCap, Users, Smartphone, Ticket, 
  Coins, MapPin, Star, Gift, Crown, Utensils,
  Fish, Flame, ChefHat
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { pageMetadata } from "@/data/seo";
import { toast } from "sonner";

export default function Deals() {
  const activeDeals = [
    {
      id: "first-10",
      code: "FIRST10",
      title: "10% Off Your First Order",
      description: "New to 9Yards? Enjoy a warm welcome with 10% off your entire first purchase.",
      icon: Tag,
      color: "bg-blue-100 text-blue-700",
      btnColor: "bg-blue-600 hover:bg-blue-700",
      terms: "Valid for new accounts only. No minimum spend.",
      badge: "ACTIVE",
      type: "code"
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
      badge: "ACTIVE",
      type: "code"
    },
    {
      id: "free-delivery",
      title: "Free Delivery",
      description: "Order for UGX 50,000 or more and we'll bring it to your doorstep for free.",
      icon: Truck,
      color: "bg-green-100 text-green-700",
      btnColor: "bg-green-600 hover:bg-green-700",
      terms: "Automatic at checkout. Within standard delivery zones.",
      badge: "ACTIVE",
      type: "automatic"
    },
    {
      id: "lunch-20",
      code: "LUNCH20",
      title: "Lunch Hour Deal",
      description: "Get 20% off orders placed between 12pm-2pm, Monday to Friday.",
      icon: Clock,
      color: "bg-yellow-100 text-yellow-700",
      btnColor: "bg-yellow-600 hover:bg-yellow-700 text-white",
      terms: "Mon-Fri, 12pm-2pm only.",
      badge: "NEW",
      type: "code"
    },
    {
      id: "student-15",
      code: "STUDENT15",
      title: "Student Special",
      description: "15% off your meal with a valid student ID. Fuel your studies!",
      icon: GraduationCap,
      color: "bg-purple-100 text-purple-700",
      btnColor: "bg-purple-600 hover:bg-purple-700",
      terms: "Must verify student status on delivery.",
      badge: "ACTIVE",
      type: "code"
    },
    {
      id: "refer-friend",
      title: "Refer a Friend",
      description: "Share the love! Both you and your friend get UGX 5,000 off your next order.",
      icon: Users,
      color: "bg-pink-100 text-pink-700",
      btnColor: "bg-pink-600 hover:bg-pink-700",
      terms: "Reward applied after friend's first order.",
      badge: "REWARDS",
      type: "action"
    },
  ];

  const combos = [
    {
      id: "family-feast",
      title: "Family Feast",
      items: "Matooke + Rice + Chicken (Half) + 2 Juices + Side",
      price: "45,000 UGX",
      originalPrice: "55,000 UGX",
      save: "Save 10K!",
      icon: ChefHat,
      color: "bg-orange-50 text-orange-600"
    },
    {
      id: "solo-special",
      title: "Solo Special",
      items: "Your choice + Fish + Juice + Side",
      price: "35,000 UGX",
      originalPrice: null,
      save: "Best Value",
      icon:  Utensils,
      color: "bg-blue-50 text-blue-600"
    },
    {
      id: "weekend-warrior",
      title: "Weekend Warrior",
      items: "Double portion + 2 sides + Dessert",
      price: "45,000 UGX",
      originalPrice: "53,000 UGX",
      save: "Save 8K!",
      icon: Flame,
      color: "bg-red-50 text-red-600"
    }
  ];

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Coupon code copied!", {
      description: `${code} has been copied to your clipboard.`,
      icon: <Check className="w-4 h-4 text-green-600" />,
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title={pageMetadata.deals.title}
        description={pageMetadata.deals.description}
        keywords={pageMetadata.deals.keywords}
        image={pageMetadata.deals.ogImage}
        url={pageMetadata.deals.canonicalUrl}
        jsonLd={pageMetadata.deals.schema}
      />
      <Header />

      <main className="flex-grow pt-16 md:pt-20">
        {/* HERO SECTION */}
        <section className="bg-primary text-primary-foreground py-12 md:py-20 relative overflow-hidden">
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
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Serving you more for less. Grab the latest promo codes and enjoy authentic Ugandan cuisine at unbeatable prices.
            </p>
          </div>
        </section>

        {/* SECTION 1: ACTIVE PROMO CODES */}
        <section className="py-12 md:py-16 px-4">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2">
              <Tag className="text-secondary" />
              Active Promo Codes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeDeals.map((deal) => (
                <div 
                  key={deal.id}
                  className="bg-white rounded-2xl p-6 border border-border hover:border-secondary/50 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                     <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
                       deal.badge === 'NEW' ? 'bg-green-100 text-green-700 border-green-200' : 
                       deal.badge === 'ACTIVE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                       'bg-purple-50 text-purple-600 border-purple-100'
                     }`}>
                       {deal.badge}
                     </span>
                  </div>

                  <div className="flex items-start justify-between mb-4 mt-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${deal.color}`}>
                      <deal.icon className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors pr-8">
                    {deal.title}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed text-sm">
                    {deal.description}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-gray-100 mt-auto">
                    {deal.type === "code" ? (
                      <button
                        onClick={() => copyToClipboard(deal.code!)}
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
                    ) : deal.type === "action" ? (
                       <button
                        onClick={() => {
                           const text = "Hey! Check out 9Yards Food. Use my referral link to get 5k off!";
                           if (navigator.share) {
                             navigator.share({ title: '9Yards Food Referal', text, url: window.location.origin });
                           } else {
                             copyToClipboard(window.location.origin);
                           }
                        }}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold transition-colors ${deal.btnColor}`}
                      >
                        Share Link
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <Link
                        to="/delivery-zones"
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold transition-colors ${deal.btnColor}`}
                      >
                        Check Zones
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
          </div>
        </section>

        {/* SECTION 2: HOW PROMO CODES WORK */}
        <section className="py-12 bg-white border-y border-border">
          <div className="container-custom px-4">
            <div className="text-center mb-10">
               <h2 className="text-2xl md:text-3xl font-bold mb-3">How to Use Your Promo Code</h2>
               <p className="text-muted-foreground">Saving money on your favorite meals is easy</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="text-center p-6 rounded-2xl bg-gray-50">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                     <Smartphone className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">1. Choose Your Food</h3>
                  <p className="text-sm text-gray-600">Browse our menu, build your perfect combo, and add items to your cart.</p>
               </div>
               <div className="text-center p-6 rounded-2xl bg-gray-50">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                     <Ticket className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">2. Enter Code at Checkout</h3>
                  <p className="text-sm text-gray-600">Paste your copied promo code in the "Discount Code" box before paying.</p>
               </div>
               <div className="text-center p-6 rounded-2xl bg-gray-50">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                     <Coins className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">3. Enjoy Your Savings</h3>
                  <p className="text-sm text-gray-600">The discount is applied instantly to your total. Bon appétit!</p>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: FREE DELIVERY */}
        <section className="py-12 md:py-16 px-4">
          <div className="container-custom">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-6 md:p-10 border border-green-100 flex flex-col md:flex-row items-center gap-8 md:gap-12">
               <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-green-200/50 text-green-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
                     <Truck className="w-3.5 h-3.5" />
                     FREE SHIPPING
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Free Delivery Made Simple</h2>
                  <p className="text-gray-700 mb-6 text-lg">
                     Don't worry about shipping costs. Spend <span className="font-bold text-green-700">UGX 50,000</span> or more and we'll deliver to your doorstep for free within our standard zones.
                  </p>
                  
                  {/* Visual Progress Bar Mockup */}
                  <div className="bg-white p-4 rounded-xl border border-green-100 max-w-md mb-6">
                     <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                        <span>UGX 0</span>
                        <span>UGX 50,000 GOAL</span>
                     </div>
                     <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-green-500 rounded-full" />
                     </div>
                     <p className="text-xs text-center mt-2 font-medium text-green-700">
                        Spend 50k+ to unlock free delivery!
                     </p>
                  </div>

                  <Link to="/delivery-zones" className="font-bold text-green-700 hover:text-green-800 hover:underline flex items-center gap-1">
                     Check Delivery Zones <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
               
               <div className="w-full md:w-1/3 flex justify-center">
                  <div className="relative">
                     <div className="absolute inset-0 bg-green-200/50 blur-3xl rounded-full" />
                     <MapPin className="w-32 h-32 text-green-600 relative z-10" />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: COMBO DEALS SHOWCASE */}
        <section className="py-12 md:py-16 px-4 bg-gray-50">
          <div className="container-custom">
             <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Combo Deals</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {combos.map((combo) => (
                   <div key={combo.id} className="bg-white rounded-2xl overflow-hidden border border-border hover:border-secondary/50 transition-all flex flex-col">
                      <div className={`p-6 flex items-center justify-between ${combo.color}`}>
                         <div>
                            <h3 className="font-bold text-lg">{combo.title}</h3>
                            <span className="text-xs font-bold bg-white/50 px-2 py-1 rounded-full">{combo.save}</span>
                         </div>
                         <combo.icon className="w-8 h-8 opacity-80" />
                      </div>
                      <div className="p-6 flex-grow flex flex-col">
                         <p className="text-sm text-gray-600 mb-4 flex-grow font-medium leading-relaxed">
                            {combo.items}
                         </p>
                         <div className="mt-auto">
                            <div className="flex items-center gap-3 mb-4">
                               <span className="text-xl font-bold text-primary">{combo.price}</span>
                               {combo.originalPrice && (
                                  <span className="text-sm text-muted-foreground line-through decoration-red-500">{combo.originalPrice}</span>
                               )}
                            </div>
                            <Link 
                               to={`/menu?combo=true&highlight=${combo.id}`} // Assuming functionality exists or just to menu
                               className="w-full btn-outline py-2.5 rounded-xl block text-center"
                            >
                               Build This Combo
                            </Link>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </section>

        {/* SECTION 5: LOYALTY REWARDS PREVIEW */}
        <section className="py-12 px-4">
           <div className="container-custom">
              <div className="bg-primary rounded-3xl p-8 md:p-12 text-center relative overflow-hidden text-white">
                 {/* Decorative background */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                 
                 <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/20">
                       <Crown className="w-3.5 h-3.5 text-yellow-400" />
                       COMING SOON
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Loyalty Program</h2>
                    <p className="text-lg text-primary-foreground/80 mb-8">
                       Earn points with every order, unlock exclusive VIP rewards, and enjoy member-only tastings.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 max-w-lg mx-auto">
                       <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                             <Coins className="w-5 h-5 text-yellow-400" />
                          </div>
                          <span className="text-sm font-bold">Earn Points</span>
                       </div>
                       <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                             <Gift className="w-5 h-5 text-pink-400" />
                          </div>
                          <span className="text-sm font-bold">Get Rewards</span>
                       </div>
                       <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2">
                             <Star className="w-5 h-5 text-purple-400" />
                          </div>
                          <span className="text-sm font-bold">VIP Status</span>
                       </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm p-1 rounded-full max-w-sm mx-auto flex items-center">
                       <input 
                          type="email" 
                          placeholder="Your email address" 
                          className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/50 text-sm flex-grow px-4"
                       />
                       <button className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-5 py-2 text-sm font-bold transition-transform active:scale-95">
                          Join Waitlist
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* SECTION 8: NEWSLETTER (Keep existing style) */}
        <section className="pb-12 md:pb-20 px-4">
          <div className="container-custom">
            <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden border border-gray-800">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
               <div className="absolute -top-[50%] -left-[10%] w-[100%] h-[200%] bg-secondary/10 rotate-12 blur-3xl rounded-[100%] pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Don't Miss Out on Future Deals
                </h2>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Subscribe to our WhatsApp updates to get exclusive promo codes, flash sale alerts, and "Secret Menu" items delivered straight to your phone.
                </p>
                
                <a 
                  href="https://wa.me/256708899597?text=Hello%2C%20I%20would%20like%20to%20receive%20updates%20about%20deals%20and%20promotions."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105"
                >
                  <Smartphone className="w-5 h-5" />
                  Subscribe on WhatsApp
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
