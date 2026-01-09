import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Truck,
  Share2,
  ShoppingBag,
  Copy,
  MapPin,
  Check,
  UtensilsCrossed,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import Footer from '@/components/layout/Footer';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { formatPrice } from '@/lib/utils/order';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { toast } from 'sonner';

interface OrderItem {
  mainDishes: string[];
  sauce: { name: string; preparation: string; size: string; price: number } | null;
  sideDish: string;
  extras: Array<{ name: string; quantity: number; price: number }>;
  quantity: number;
  totalPrice: number;
}

interface OrderData {
  orderId: string;
  items: OrderItem[];
  customerInfo: {
    name: string;
    phone: string;
    location: string;
    address: string;
    specialInstructions?: string;
  };
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'whatsapp' | 'online';
  estimatedDelivery: string;
  orderDate: string;
}

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  const orderData = location.state as OrderData | null;

  useEffect(() => {
    if (!orderData) {
      navigate('/', { replace: true });
      return;
    }

    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderData.orderId);
    toast.success('Order ID copied to clipboard!');
  };

  const handleTrackViaWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello, I would like to check on my order.\n\nOrder ID: ${orderData.orderId}\nName: ${orderData.customerInfo.name}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    const shareText = `Just ordered delicious Ugandan food from 9Yards Food. Order #${orderData.orderId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '9Yards Food Order',
          text: shareText,
          url: 'https://food.9yards.co.ug',
        });
      } catch {
        // User cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    }
  };

  // Extract delivery time numbers for display
  const deliveryMatch = orderData.estimatedDelivery.match(/(\d+)-(\d+)/);
  const deliveryTime = deliveryMatch ? `${deliveryMatch[1]}-${deliveryMatch[2]}` : '30-45';

  return (
    <div className="min-h-screen bg-[#f8f6f6] pb-20 lg:pb-0">
      <SEO 
        title={pageMetadata.orderConfirmation.title}
        description={pageMetadata.orderConfirmation.description}
        url={pageMetadata.orderConfirmation.canonicalUrl}
        noIndex={pageMetadata.orderConfirmation.noIndex}
      />
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Mobile Container */}
        <div className="max-w-md mx-auto lg:max-w-4xl">
          {/* Top Navigation - Mobile */}
          <nav className="lg:hidden sticky top-16 z-40 bg-[#f8f6f6]/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/50">
            <div className="w-12" />
            <h2 className="text-[#212282] text-lg font-bold leading-tight tracking-tight text-center">Confirmation</h2>
            <div className="w-12 flex justify-end">
              <Link to="/" className="text-[#212282] text-base font-bold leading-normal hover:opacity-70 transition-opacity">
                Done
              </Link>
            </div>
          </nav>

          {/* Content */}
          <div className="px-4 lg:px-0 pb-32 lg:pb-8">
            {/* Hero Section: Success Animation */}
            <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6 text-center">
              {/* Confetti */}
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                  {[...Array(30)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 rounded-sm animate-bounce"
                      style={{
                        backgroundColor: ['#E6411C', '#212282', '#22C55E', '#F59E0B'][Math.floor(Math.random() * 4)],
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${1 + Math.random()}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Success Icon */}
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#E6411C]/10 rounded-full animate-pulse" />
                <div className="absolute inset-2 bg-[#E6411C]/20 rounded-full" />
                <CheckCircle className="w-12 h-12 text-[#E6411C]" />
              </div>

              <h1 className="text-[#212282] text-2xl md:text-3xl font-extrabold leading-tight tracking-tight mb-3">
                Order Placed Successfully!
              </h1>
              <p className="text-gray-500 text-base font-medium leading-relaxed max-w-[280px]">
                Your cravings are in good hands. The kitchen has received your order.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-1 p-5 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Est. Delivery</p>
                <p className="text-[#212282] text-xl font-bold leading-tight">
                  {deliveryTime} <span className="text-sm font-medium text-gray-400">min</span>
                </p>
              </div>
              <div className="flex flex-col gap-1 p-5 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Order No.</p>
                <button 
                  onClick={handleCopyOrderId}
                  className="flex items-center gap-2 text-left group"
                >
                  <p className="text-[#212282] text-base font-bold leading-tight truncate group-hover:text-[#E6411C] transition-colors">
                    {orderData.orderId}
                  </p>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-[#E6411C] transition-colors" />
                </button>
              </div>
            </div>

            {/* Timeline: What's Next */}
            <div className="mb-8">
              <h3 className="text-[#212282] text-lg font-bold mb-4 px-1">What's Next</h3>
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                {/* Step 1: Done */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-[#E6411C] flex items-center justify-center shrink-0 z-10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-[2px] h-full bg-[#E6411C]/30 my-1" />
                  </div>
                  <div className="pb-6">
                    <p className="text-[#212282] text-base font-bold">Order Received</p>
                    <p className="text-gray-500 text-sm">Your order has been sent to our team.</p>
                  </div>
                </div>

                {/* Step 2: Awaiting Confirmation */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full border-2 border-[#25D366] bg-white flex items-center justify-center shrink-0 z-10">
                      <div className="w-2.5 h-2.5 bg-[#25D366] rounded-full animate-pulse" />
                    </div>
                  </div>
                  <div className="pt-0.5">
                    <p className="text-[#212282] text-base font-bold">Awaiting Confirmation</p>
                    <p className="text-[#25D366] text-sm font-medium">Someone will reach out on WhatsApp to confirm your order and delivery details.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-[#212282] text-lg font-bold">Order Summary</h3>
                <button className="text-[#E6411C] text-sm font-semibold hover:underline">View Receipt</button>
              </div>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                {/* Items */}
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-b-0">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                      <UtensilsCrossed className="w-6 h-6 text-[#212282]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-[#212282] text-sm font-semibold leading-snug">
                          {item.quantity}x {item.mainDishes.join(' + ')} Combo
                        </p>
                        <p className="text-[#212282] text-sm font-semibold">
                          {formatPrice(item.totalPrice * item.quantity)}
                        </p>
                      </div>
                      <p className="text-gray-400 text-xs mt-1 truncate">
                        {item.sauce?.name} ({item.sauce?.preparation}), {item.sideDish}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Address & Total */}
                <div className="p-4 bg-gray-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 text-[#E6411C] border border-gray-100">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Delivering To</p>
                      <p className="text-sm text-[#212282] font-medium truncate">
                        {orderData.customerInfo.location}, {orderData.customerInfo.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <p className="text-base font-medium text-gray-600">Total Paid</p>
                    <p className="text-lg font-extrabold text-[#E6411C]">{formatPrice(orderData.total)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Share */}
            <div className="pb-8 flex justify-center">
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-500 hover:text-[#212282] transition-colors text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Share on Social Media
              </button>
            </div>
          </div>

          {/* Sticky Bottom Actions - Mobile */}
          <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 pb-6 z-40">
            <div className="flex flex-col gap-3 max-w-md mx-auto">
              <button
                onClick={handleTrackViaWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white rounded-xl py-3.5 px-4 font-bold text-base flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppIcon className="w-5 h-5" />
                Track Order on WhatsApp
              </button>
              <Link
                to="/menu"
                className="w-full bg-transparent border border-gray-200 text-[#212282] hover:bg-gray-50 rounded-xl py-3.5 px-4 font-bold text-base transition-colors text-center"
              >
                Browse More Food
              </Link>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex justify-center gap-4 py-8">
            <button
              onClick={handleTrackViaWhatsApp}
              className="bg-[#25D366] hover:bg-[#22c55e] text-white rounded-xl py-3.5 px-8 font-bold text-base flex items-center justify-center gap-2 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Track Order on WhatsApp
            </button>
            <Link
              to="/menu"
              className="bg-transparent border border-gray-200 text-[#212282] hover:bg-gray-50 rounded-xl py-3.5 px-8 font-bold text-base transition-colors"
            >
              Browse More Food
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
