import { Link } from 'react-router-dom';
import { 
  Leaf, ChefHat, Heart, Truck, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobilePageHeader from '@/components/layout/MobilePageHeader';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import { haptics } from '@/lib/utils/ui';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Core values - just 4 key differentiators
const values = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'Fresh ingredients, no preservatives or shortcuts.',
  },
  {
    icon: ChefHat,
    title: 'Our Own Kitchen',
    description: 'We cook everything ourselves—no third parties.',
  },
  {
    icon: Heart,
    title: 'Traditional Recipes',
    description: 'Authentic flavors passed down through generations.',
  },
  {
    icon: Truck,
    title: '30-45 Min Delivery',
    description: 'Hot food delivered fast across Kampala.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={pageMetadata.about.title}
        description={pageMetadata.about.description}
        keywords={pageMetadata.about.keywords}
        image={pageMetadata.about.ogImage}
        url={pageMetadata.about.canonicalUrl}
        jsonLd={pageMetadata.about.schema}
      />
      
      {/* Desktop Header */}
      <Header />
      
      {/* Mobile Header */}
      <MobilePageHeader 
        title="About Us" 
        subtitle="Our story"
      />

      <main className="pt-32">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#212282] via-[#2a2b9a] to-[#1a1b68] text-white pt-12 pb-12 lg:pt-16 lg:pb-24 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E6411C]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/30 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#E6411C]/40 rounded-full" />
          <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-white/20 rounded-full" />
          
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-2xl">
              {/* Text Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="text-center lg:text-left"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                  Real Ugandan Food,{' '}
                  <span className="text-[#E6411C]">Delivered</span>
                </h1>
                
                <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0">
                  We started 9Yards because Kampala deserved better than ordinary takeout. 
                  Every dish is made fresh in our own kitchen using recipes passed down through generations.
                </p>

                <Link
                  to="/menu"
                  onClick={() => haptics.medium()}
                  className="inline-flex items-center gap-2 bg-[#E6411C] hover:bg-[#d13a18] text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Explore Our Menu
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                What Makes Us Different
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-xl p-5 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#E6411C]/10 flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-[#E6411C]" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple CTA */}
        <section className="py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-3">
              Ready to Try?
            </h2>
            <p className="text-gray-600 mb-6">
              Use code <span className="font-bold text-[#E6411C]">FIRST10</span> for 10% off your first order
            </p>
            <Link
              to="/menu"
              onClick={() => haptics.medium()}
              className="inline-flex items-center gap-2 bg-[#E6411C] hover:bg-[#d13a18] text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              View Menu
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Bottom padding for mobile nav */}
        <div className="h-24 lg:hidden" />
      </main>
      
      <Footer />
    </div>
  );
}
