import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Copy, 
  Check, 
  Percent,
  Bell,
  Sparkles
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/constants";
import { toast } from "sonner";
import MobilePageHeader from "@/components/layout/MobilePageHeader";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEO from "@/components/SEO";
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
}

// Single active promo - 8% discount on orders above 80,000
const activeDeal: Deal = {
  id: "save8",
  code: "SAVE8",
  title: "8% Off Your Order",
  description: "Get 8% off when you order above 80,000 UGX. Use code at checkout!",
  discount: 8,
  type: "percentage",
  minOrder: 80000
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#E6411C] via-[#ff5c35] to-[#ff7a54] p-5 sm:p-8 lg:p-10 text-white shadow-xl"
      role="region"
      aria-label="Featured deal of the week"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Large percentage icon */}
        <div className="absolute -top-4 -right-4 sm:top-4 sm:right-4 lg:top-6 lg:right-6 opacity-10">
          <Percent className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" strokeWidth={1} />
        </div>
        {/* Subtle circles for visual interest */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl">
        {/* Deal badge */}
        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
            Deal of the Week
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 leading-tight">{deal.title}</h2>
        <p className="text-white/90 text-sm sm:text-lg lg:text-xl max-w-lg leading-relaxed">{deal.description}</p>

        <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#E6411C] w-full sm:w-auto shadow-lg ${
              copied
                ? "bg-green-500 text-white focus-visible:ring-green-300"
                : "bg-white text-[#E6411C] hover:bg-white/95 hover:shadow-xl focus-visible:ring-white"
            }`}
            aria-label={copied ? `Code ${deal.code} copied to clipboard` : `Copy promo code ${deal.code}`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                <span role="status">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                Use Code: {deal.code}
              </>
            )}
          </button>

          {deal.minOrder && deal.minOrder > 0 && (
            <span className="text-xs sm:text-base text-white/80 text-center sm:text-left">
              On orders above {deal.minOrder.toLocaleString()} UGX
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Main Deals Page Component
const Deals = () => {
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Copied "${code}" to clipboard!`, {
      description: "Apply at checkout to save",
      duration: 2000
    });
  };

  return (
    <>
      <SEO
        title="Deals & Promo Codes"
        description="Save 8% on orders above 80,000 UGX! Get exclusive promo codes from 9Yards Food."
        keywords="9Yards promo codes, food deals, Uganda food discounts, 8% off"
      />

      {/* Desktop Header */}
      <Header />

      {/* Mobile Header */}
      <MobilePageHeader 
        title="Deals & Offers" 
        subtitle="Exclusive savings for you"
      />

      <main id="main-content" className="min-h-screen bg-gray-50 flex flex-col">
        {/* Blue Header Section - Fixed spacing */}
        <section className="bg-primary text-primary-foreground pt-6 lg:pt-28 pb-8 sm:pb-10 lg:pb-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page title - desktop only */}
            <div className="hidden lg:block">
              <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-3">
                Exclusive Offers
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                Deals & Promo Codes
              </h1>
              <p className="text-primary-foreground/80 mt-3 max-w-xl text-base sm:text-lg lg:text-xl">
                Save on your favorite Ugandan dishes with our current promotions.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Deal Section */}
        <section className="flex-1 py-6 sm:py-8 lg:py-12" aria-label="Current promotion">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturedDealHero deal={activeDeal} onCopy={handleCopyCode} />

            {/* More deals coming soon notice */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 sm:mt-12 lg:mt-14 flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-600 text-xs sm:text-sm border border-gray-200">
                <Bell className="w-4 h-4 text-primary" aria-hidden="true" />
                <span>More deals coming soon! Follow us for updates.</span>
              </div>
              
              {/* Social links hint */}
              <p className="mt-4 text-xs text-gray-400">
                Follow us on <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Instagram</a> or <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TikTok</a> for flash deals
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bottom padding for mobile nav */}
        <div className="h-24 lg:hidden" aria-hidden="true" />
      </main>

      {/* Footer - Desktop only */}
      <Footer />
    </>
  );
};

export default Deals;
