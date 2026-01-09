import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Tag, 
  Copy, 
  Check, 
  Clock, 
  Sparkles, 
  Gift, 
  Percent, 
  ChevronRight,
  Timer,
  ShoppingBag,
  Star,
  Zap,
  TrendingUp,
  ArrowRight,
  Flame,
  Users,
  Truck,
  BadgePercent,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import MobilePageHeader from "@/components/layout/MobilePageHeader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
import { promoCodes } from "@/data/menu";
import { haptics } from "@/lib/utils/ui";

// Deal types
interface Deal {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: number;
  type: "percentage" | "fixed";
  minOrder?: number;
  icon: React.ElementType;
  color: "orange" | "blue" | "green" | "purple" | "pink";
  badge?: string;
  expiresAt?: Date;
  usageLimit?: string;
}

interface ComboDeal {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  items: string[];
  image: string;
  badge?: string;
}

// Transform promoCodes from menu.ts into Deal objects
const transformPromoDeals = (): Deal[] => {
  const dealConfigs: Record<string, { title: string; description: string; icon: React.ElementType; color: Deal["color"]; badge?: string; expiresAt?: Date; usageLimit?: string }> = {
    "FIRST10": {
      title: "First Order Discount",
      description: "Welcome to 9Yards! Enjoy 10% off your first order with us.",
      icon: Gift,
      color: "orange",
      badge: "New Customer",
      usageLimit: "One-time use"
    },
    "SAVE5K": {
      title: "Save 5,000 UGX",
      description: "Get 5,000 UGX off when you order above 30,000 UGX.",
      icon: BadgePercent,
      color: "blue",
      badge: "Popular"
    },
    "FREESHIP": {
      title: "Free Delivery",
      description: "Enjoy free delivery on your order. No delivery fees!",
      icon: Truck,
      color: "green",
      badge: "Free Shipping"
    },
    "TEST28": {
      title: "Special 28% Off",
      description: "Limited time offer - 28% off your entire order!",
      icon: Zap,
      color: "purple",
      badge: "Limited Time",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  };

  return Object.entries(promoCodes).map(([code, data]) => {
    const config = dealConfigs[code] || {
      title: `${code} Discount`,
      description: `Apply code ${code} for your discount.`,
      icon: Tag,
      color: "blue" as Deal["color"]
    };

    return {
      id: code.toLowerCase(),
      code,
      title: config.title,
      description: config.description,
      discount: data.discount,
      type: data.type,
      minOrder: data.minOrder,
      icon: config.icon,
      color: config.color,
      badge: 'badge' in config ? config.badge : undefined,
      expiresAt: 'expiresAt' in config ? config.expiresAt : undefined,
      usageLimit: 'usageLimit' in config ? config.usageLimit : undefined
    };
  });
};

// Combo deals
const comboDeals: ComboDeal[] = [
  {
    id: "family-feast",
    name: "Family Feast",
    description: "Perfect for the whole family - feeds 4-5 people",
    originalPrice: 85000,
    dealPrice: 69000,
    items: ["2 Whole Chicken Pilao Lusaniya", "2 Beef Stew", "4 Mixed Juices", "4 Mandazi"],
    image: "/images/menu/lusaniya/whole-chicken-pilao-lusaniya.png",
    badge: "Best Value"
  },
  {
    id: "solo-special",
    name: "Solo Special",
    description: "Perfect lunch for one person",
    originalPrice: 25000,
    dealPrice: 19000,
    items: ["1 Ordinary Lusaniya", "1 Juice", "1 Mandazi"],
    image: "/images/menu/lusaniya/ordinary-lusaniya.png",
    badge: "Lunch Deal"
  },
  {
    id: "weekend-warrior",
    name: "Weekend Warrior",
    description: "Treat yourself to something special",
    originalPrice: 48000,
    dealPrice: 39000,
    items: ["1 Whole Chicken Pilao", "2 Fish", "2 Cocktail Juices"],
    image: "/images/menu/lusaniya/whole-chicken-pilao-lusaniya.png"
  }
];

// Color configurations
const colorConfig = {
  orange: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100",
    border: "border-orange-200",
    icon: "bg-orange-100 text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-500 hover:bg-orange-600 text-white"
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100",
    border: "border-blue-200",
    icon: "bg-blue-100 text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-500 hover:bg-blue-600 text-white"
  },
  green: {
    bg: "bg-gradient-to-br from-green-50 to-green-100",
    border: "border-green-200",
    icon: "bg-green-100 text-green-600",
    badge: "bg-green-100 text-green-700",
    button: "bg-green-500 hover:bg-green-600 text-white"
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100",
    border: "border-purple-200",
    icon: "bg-purple-100 text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-500 hover:bg-purple-600 text-white"
  },
  pink: {
    bg: "bg-gradient-to-br from-pink-50 to-pink-100",
    border: "border-pink-200",
    icon: "bg-pink-100 text-pink-600",
    badge: "bg-pink-100 text-pink-700",
    button: "bg-pink-500 hover:bg-pink-600 text-white"
  }
};

// Countdown timer hook
const useCountdown = (targetDate: Date | undefined) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

// Deal Card Component
const DealCard = ({ deal, onCopy }: { deal: Deal; onCopy: (code: string) => void }) => {
  const [copied, setCopied] = useState(false);
  const countdown = useCountdown(deal.expiresAt);
  const colors = colorConfig[deal.color];
  const Icon = deal.icon;

  const handleCopy = () => {
    haptics.success();
    onCopy(deal.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDiscount = () => {
    if (deal.type === "percentage") return `${deal.discount}% OFF`;
    if (deal.discount === 0) return "FREE";
    return `${deal.discount.toLocaleString()} UGX OFF`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl border-2 ${colors.bg} ${colors.border} p-4 sm:p-5`}
    >
      {/* Badge */}
      {deal.badge && (
        <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium ${colors.badge}`}>
          {deal.badge}
        </div>
      )}

      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${colors.icon} flex items-center justify-center`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{deal.title}</h3>
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{deal.description}</p>
          
          {/* Min order if applicable */}
          {deal.minOrder && deal.minOrder > 0 && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <ShoppingBag className="w-3 h-3" />
              Min order: {deal.minOrder.toLocaleString()} UGX
            </p>
          )}

          {/* Usage limit */}
          {deal.usageLimit && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Users className="w-3 h-3" />
              {deal.usageLimit}
            </p>
          )}

          {/* Countdown Timer */}
          {countdown && (
            <div className="flex items-center gap-1.5 mt-2">
              <Timer className="w-3.5 h-3.5 text-red-500" />
              <span className="text-xs font-medium text-red-500">
                Ends in: {countdown.days}d {countdown.hours}h {countdown.minutes}m
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50">
        {/* Discount badge */}
        <div className="flex items-center gap-2">
          <span className="text-2xl sm:text-3xl font-black text-gray-900">{formatDiscount()}</span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${
            copied 
              ? "bg-green-100 text-green-700" 
              : `${colors.button}`
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              {deal.code}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// Combo Deal Card
const ComboDealCard = ({ combo, onOrder }: { combo: ComboDeal; onOrder: () => void }) => {
  const savings = combo.originalPrice - combo.dealPrice;
  const savingsPercent = Math.round((savings / combo.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden group"
    >
      {/* Badge */}
      {combo.badge && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#E6411C] text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Flame className="w-3 h-3" />
          {combo.badge}
        </div>
      )}

      {/* Savings badge */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
        Save {savingsPercent}%
      </div>

      {/* Image */}
      <div className="relative h-36 sm:h-44 bg-gradient-to-br from-orange-50 to-amber-50 overflow-hidden">
        <img
          src={combo.image}
          alt={combo.name}
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{combo.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{combo.description}</p>

        {/* Items list */}
        <div className="mt-3 space-y-1">
          {combo.items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-gray-600">
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 line-through">
              {combo.originalPrice.toLocaleString()} UGX
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-[#E6411C]">
                {combo.dealPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">UGX</span>
            </div>
          </div>
          <Button
            onClick={() => {
              haptics.success();
              onOrder();
            }}
            className="bg-[#212282] hover:bg-[#1a1b68] text-white"
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

// Featured Deal Hero
const FeaturedDealHero = ({ deal, onCopy }: { deal: Deal; onCopy: (code: string) => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    haptics.success();
    onCopy(deal.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E6411C] via-[#ff5c35] to-[#ff7a54] p-6 sm:p-8 text-white"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
            Deal of the Week
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black mb-2">{deal.title}</h2>
        <p className="text-white/80 text-sm sm:text-base max-w-md">{deal.description}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:items-center">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-base transition-all ${
              copied
                ? "bg-green-500 text-white"
                : "bg-white text-[#E6411C] hover:bg-white/90"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Tag className="w-5 h-5" />
                Use Code: {deal.code}
                <Copy className="w-4 h-4 ml-1 opacity-60" />
              </>
            )}
          </button>

          {deal.minOrder && deal.minOrder > 0 && (
            <span className="text-sm text-white/70">
              Min. order: {deal.minOrder.toLocaleString()} UGX
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// How It Works Section
const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Copy Code",
      description: "Tap any promo code to copy it",
      icon: Copy
    },
    {
      step: 2,
      title: "Add Items",
      description: "Browse menu and add to cart",
      icon: ShoppingBag
    },
    {
      step: 3,
      title: "Apply & Save",
      description: "Paste code at checkout",
      icon: Percent
    }
  ];

  return (
    <div className="bg-gray-50 rounded-2xl p-5 sm:p-6">
      <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
        <Star className="w-5 h-5 text-[#E6411C]" />
        How to Use Promo Codes
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {steps.map((step) => (
          <div key={step.step} className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white border-2 border-[#212282] flex items-center justify-center">
              <step.icon className="w-5 h-5 text-[#212282]" />
            </div>
            <h4 className="font-semibold text-sm text-gray-900">{step.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Empty State
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
      <Tag className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-bold text-gray-900">No Active Deals</h3>
    <p className="text-gray-500 mt-2 max-w-sm mx-auto">
      Check back soon! We're always cooking up new deals for you.
    </p>
  </div>
);

// Main Deals Page Component
const Deals = () => {
  const navigate = useNavigate();
  const deals = useMemo(() => transformPromoDeals(), []);
  const featuredDeal = deals.find(d => d.badge === "Popular" || d.badge === "Limited Time") || deals[0];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`, {
      description: "Apply at checkout to save",
      duration: 2000
    });
  };

  const handleOrderCombo = (combo: ComboDeal) => {
    toast.success(`${combo.name} added!`, {
      description: "View in your cart",
      action: {
        label: "View Cart",
        onClick: () => navigate("/cart")
      }
    });
    // In a real app, you'd add the combo to the cart here
    navigate("/menu");
  };

  return (
    <>
      <SEO
        title="Deals & Promo Codes"
        description="Save big on authentic Ugandan food! Get exclusive promo codes and combo deals from 9Yards Food."
        keywords="9Yards promo codes, food deals, Uganda food discounts, combo meals, save money"
      />

      {/* Desktop Header */}
      <Header />

      {/* Mobile Header */}
      <MobilePageHeader 
        title="Deals & Offers" 
        subtitle="Exclusive savings for you"
      />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-4 lg:pt-24 pb-8 bg-gradient-to-b from-orange-50/50 to-white overflow-hidden">
          <div className="hidden lg:block absolute top-20 left-10 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
          <div className="hidden lg:block absolute bottom-0 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            {/* Page title - desktop only */}
            <div className="hidden lg:block text-center mb-8">
              <Badge className="mb-4 bg-[#E6411C]/10 text-[#E6411C] border-none">
                <Sparkles className="w-3 h-3 mr-1" />
                Exclusive Offers
              </Badge>
              <h1 className="text-4xl font-black text-gray-900">
                Deals & <span className="text-[#E6411C]">Promo Codes</span>
              </h1>
              <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                Save big on your favorite Ugandan dishes with our exclusive deals and promo codes.
              </p>
            </div>

            {/* Featured Deal */}
            {featuredDeal && (
              <FeaturedDealHero deal={featuredDeal} onCopy={handleCopyCode} />
            )}

            {/* How it works */}
            <div className="mt-6">
              <HowItWorks />
            </div>
          </div>
        </section>

        {/* Promo Codes Section */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-[#E6411C]" />
                <h2 className="text-xl font-bold text-gray-900">Active Promo Codes</h2>
              </div>
              <span className="text-sm text-gray-500">{deals.length} available</span>
            </div>

            {deals.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} onCopy={handleCopyCode} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        </section>

        {/* Combo Deals Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#212282]" />
                <h2 className="text-xl font-bold text-gray-900">Combo Deals</h2>
              </div>
              <Button 
                variant="ghost" 
                className="text-[#212282] hover:text-[#212282]/80"
                onClick={() => navigate("/menu")}
              >
                View Menu
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {comboDeals.map((combo) => (
                <ComboDealCard 
                  key={combo.id} 
                  combo={combo} 
                  onOrder={() => handleOrderCombo(combo)} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-br from-[#212282] to-[#1a1b68] text-white">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <Gift className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl sm:text-3xl font-black mb-3">
              Hungry for More Savings?
            </h2>
            <p className="text-white/70 max-w-md mx-auto mb-6">
              Follow us on WhatsApp to get notified about exclusive flash deals and new promotions!
            </p>
            <Button
              onClick={() => {
                haptics.success();
                window.open("https://wa.me/256785aborey", "_blank");
              }}
              className="bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold px-6 py-3"
              size="lg"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5 mr-2" />
              Join WhatsApp Updates
            </Button>
          </div>
        </section>

        {/* Bottom padding for mobile nav */}
        <div className="h-24 lg:hidden" />
      </main>

      {/* Footer - Desktop only */}
      <Footer />
    </>
  );
};

export default Deals;
