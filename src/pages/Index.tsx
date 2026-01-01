import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import HeroSection from '@/components/home/HeroSection';
import SocialProofSection from '@/components/home/SocialProofSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PopularDishesSection from '@/components/home/PopularDishesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import DeliveryZonesPreview from '@/components/home/DeliveryZonesPreview';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function Index() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      <main>
        <HeroSection />
        <SocialProofSection />
        <HowItWorksSection />
        <PopularDishesSection />
        <WhyChooseUsSection />
        <DeliveryZonesPreview />
      </main>
      <Footer />
      <MobileNav />
      <FloatingWhatsApp />
    </div>
  );
}
