import { lazy, Suspense, useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { GuestProvider } from "@/context/GuestContext";
import ScrollToTop from "@/components/ScrollToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import MobileNav from "@/components/layout/MobileNav";
import { Analytics } from "@/components/Analytics";

// Lazy load all pages for code splitting
const Index = lazy(() => import("./pages/Index"));
const Menu = lazy(() => import("./pages/Menu"));
const Cart = lazy(() => import("./pages/Cart"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Deals = lazy(() => import("./pages/Deals"));
const Contact = lazy(() => import("./pages/Contact"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component - Only shows for navigation AFTER initial load
// During initial load, the splash screen handles the loading state
const PageLoader = () => {
  const [visible, setVisible] = useState(false);
  
  // Only show loader if splash screen is already hidden (not initial load)
  useEffect(() => {
    // Small delay to prevent flash on fast loads
    const timer = setTimeout(() => {
      if (window.splashScreenHidden) {
        setVisible(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Don't render anything if splash is still showing or not visible yet
  if (!visible) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        {/* Simple spinner */}
        <div className="relative w-16 h-16">
          <div 
            className="absolute inset-0 rounded-full border-[3px] border-muted border-t-[#E6411C] animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
          <div className="absolute inset-2 rounded-full bg-white shadow-sm flex items-center justify-center overflow-hidden">
            <img 
              src="/images/logo/9Yards-Food-Coloured-favicon.jpg" 
              alt="9Yards Food" 
              loading="eager"
              decoding="sync"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component that hides splash screen once the page is mounted
const SplashHider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Hide splash screen after a brief moment to ensure content is painted
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.hideSplashScreen) {
        window.hideSplashScreen();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  return <>{children}</>;
};

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <GuestProvider>
        <TooltipProvider>
          <Analytics />
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <ErrorBoundary>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <SplashHider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/order-confirmation" element={<OrderConfirmation />} />
                    <Route path="/order-history" element={<OrderHistory />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <FloatingWhatsApp isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
                  <PWAInstallPrompt />
                  <MobileNav onChatClick={() => setIsChatOpen(prev => !prev)} />
                </SplashHider>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </GuestProvider>
    </CartProvider>
  </QueryClientProvider>
  );
};

export default App;

