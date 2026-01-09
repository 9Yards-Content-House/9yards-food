import Link from '@/components/NavLink';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import HeroSection from '@/components/home/HeroSection';
import RecommendedSection from '@/components/home/RecommendedSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import PopularDishesSection from '@/components/home/PopularDishesSection';
import WhyChooseUsSection from '@/components/home/WhyChooseUsSection';
import { useEffect } from 'react';
import { toast } from 'sonner';

import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import { useGuest } from '@/context/GuestContext';

export default function Index() {
  const { userName } = useGuest();

  useEffect(() => {
    if (userName) {
      const lastWelcomeKey = '9yards_last_welcome_toast';
      const lastWelcome = localStorage.getItem(lastWelcomeKey);
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (!lastWelcome || now - parseInt(lastWelcome) > oneDay) {
        // Show toast
        const timer = setTimeout(() => {
          toast.success(`Welcome back, ${userName}!`, {
            description: "Ready for your next meal?",
            duration: 3000, // Short duration as requested
          });
          localStorage.setItem(lastWelcomeKey, now.toString());
        }, 1500); // Small delay to allow app to load visual elements first
        
        return () => clearTimeout(timer);
      }
    }
  }, [userName]);

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title={pageMetadata.home.title}
        description={pageMetadata.home.description}
        keywords={pageMetadata.home.keywords}
        image={pageMetadata.home.ogImage}
        url={pageMetadata.home.canonicalUrl} // Use canonical as primary URL
        jsonLd={pageMetadata.home.schema}
      />
      <Header />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <PopularDishesSection />
        <WhyChooseUsSection />
      </main>
      <Footer />


    </div>
  );
}
