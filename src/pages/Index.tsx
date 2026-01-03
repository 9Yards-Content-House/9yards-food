import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PopularDishesSection from '@/components/home/PopularDishesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

export default function Index() {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
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
