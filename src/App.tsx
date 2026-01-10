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

// Loading fallback component - Premium branded experience
const loadingMessages = [
  "Preparing deliciousness...",
  "Warming up the kitchen...",
  "Gathering fresh ingredients...",
  "Almost ready to serve...",
  "Cooking up something special...",
  "Setting the table...",
];

const PageLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState(1);

  // Rotate messages every 2.5 seconds
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(messageTimer);
  }, []);

  // Animate dots
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDots((prev) => (prev % 3) + 1);
    }, 400);
    return () => clearInterval(dotTimer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fdfcfc] to-[#f5f3f3]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with spinner */}
        <div className="relative w-28 h-28">
          {/* Outer ring - spins */}
          <div 
            className="absolute inset-0 rounded-full border-[3px] border-[#212282]/20 border-t-[#E6411C] motion-safe:animate-spin"
            style={{ animationDuration: '1s' }}
          />
          {/* Inner ring - pulses */}
          <div className="absolute inset-2 rounded-full bg-[#212282]/5 motion-safe:animate-pulse" />
          {/* Logo */}
          <div className="absolute inset-3 rounded-full bg-white shadow-lg flex items-center justify-center overflow-hidden">
            <img 
              src="/images/logo/9Yards-Food-Coloured-favicon.jpg" 
              alt="9Yards Food" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-[#212282] font-bold text-xl tracking-tight">
          9Yards Food
        </h1>

        {/* Rotating message */}
        <p className="text-[#212282]/70 font-medium text-base h-6 transition-opacity duration-300">
          {loadingMessages[messageIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                dot <= dots ? 'bg-[#E6411C] scale-100' : 'bg-[#212282]/20 scale-75'
              }`}
            />
          ))}
        </div>

        {/* Accessibility: reduced motion fallback */}
        <noscript>
          <p className="text-[#212282]/50 text-sm">Loading...</p>
        </noscript>
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
                  <Route path="/deals" element={<Deals />} />
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

