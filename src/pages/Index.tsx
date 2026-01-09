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
        title="Authentic Ugandan Cuisine Delivery in Kampala"
        description="Order authentic Ugandan dishes delivered fresh to your door. Matooke, Posho, Chicken, Fish & more. 100% natural ingredients. Serving Kampala."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": ["Restaurant", "FoodDeliveryService"],
          name: "9Yards Food",
          description: "Premium online food delivery service preparing and delivering authentic Ugandan cuisine. We cook fresh local meals and deliver them directly to your door in Kampala.",
          image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200",
          telephone: "+256708453744",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Kkonge",
            addressLocality: "Kampala",
            addressRegion: "Central",
            postalCode: "10101",
            addressCountry: "UG"
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: 0.3476,
            longitude: 32.5825
          },
          url: "https://food.9yards.co.ug",
          servesCuisine: "Ugandan",
          priceRange: "UGX",
          potentialAction: {
            "@type": "OrderAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://food.9yards.co.ug/menu",
              "inLanguage": "en-US",
              "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
              ]
            },
            "deliveryMethod": "http://purl.org/goodrelations/v1#DeliveryModeOwnFleet"
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
              ],
              opens: "08:00",
              closes: "22:00"
            }
          ],
          menu: "https://food.9yards.co.ug/menu"
        }}
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
