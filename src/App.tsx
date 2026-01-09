import { lazy, Suspense, useState } from "react";
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
const DeliveryZones = lazy(() => import("./pages/DeliveryZones"));
const Deals = lazy(() => import("./pages/Deals"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const OrderHistory = lazy(() => import("./pages/OrderHistory"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-6 animate-pulse">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-4 border-primary/30 border-t-primary animate-spin absolute inset-0" />
        <img 
          src="/images/logo/9Yards-Food-Coloured-favicon.jpg" 
          alt="9Yards Food" 
          className="w-20 h-20 rounded-full object-cover m-2"
        />
      </div>
      <p className="text-primary font-medium text-lg tracking-wide">Preparing deliciousness...</p>
    </div>
  </div>
);

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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/delivery-zones" element={<DeliveryZones />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/order-confirmation" element={<OrderConfirmation />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <FloatingWhatsApp isOpen={isChatOpen} onOpenChange={setIsChatOpen} />
                <PWAInstallPrompt />
                <MobileNav onChatClick={() => setIsChatOpen(prev => !prev)} />
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

