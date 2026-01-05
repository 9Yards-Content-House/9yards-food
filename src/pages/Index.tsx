import Link from '@/components/NavLink';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PopularDishesSection from '@/components/home/PopularDishesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import SEO from '@/components/SEO';

export default function Index() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title="Authentic Ugandan Cuisine Delivery in Kampala"
        description="Order authentic Ugandan dishes delivered fresh to your door. Matooke, Posho, Chicken, Fish & more. 100% natural ingredients. Serving Kampala."
      />
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PopularDishesSection />
        <WhyChooseUsSection />
      </main>
      <Footer />
      <MobileNav />
      <FloatingWhatsApp />
    </div>
  );
}
