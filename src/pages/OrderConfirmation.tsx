import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  ChefHat,
  Truck,
  Home,
  MessageCircle,
  Share2,
  ShoppingBag,
  Copy,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
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

const orderSteps = [
  { icon: CheckCircle, label: 'Order Placed', description: 'We received your order' },
  { icon: ChefHat, label: 'Preparing', description: 'Our chefs are cooking' },
  { icon: Truck, label: 'On The Way', description: 'Your food is coming' },
  { icon: Home, label: 'Delivered', description: 'Enjoy your meal!' },
];

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Get order data from navigation state
  const orderData = location.state as OrderData | null;

  useEffect(() => {
    // If no order data, redirect to home
    if (!orderData) {
      navigate('/', { replace: true });
      return;
    }

    // Hide confetti after animation
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
      `Hi! I'd like to track my order.\n\nOrder ID: ${orderData.orderId}\nName: ${orderData.customerInfo.name}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleShare = async () => {
    const shareText = `Just ordered delicious Ugandan food from 9Yards Food! 🍽️ Order #${orderData.orderId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '9Yards Food Order',
          text: shareText,
          url: 'https://food.9yards.co.ug',
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="pt-20 md:pt-24">
        <div className="container-custom section-padding">
          {/* Success Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            {/* Confetti Background */}
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                {[...Array(50)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: -20, 
                      x: Math.random() * window.innerWidth,
                      rotate: 0,
                      opacity: 1,
                    }}
                    animate={{ 
                      y: window.innerHeight + 100, 
                      rotate: Math.random() * 360,
                      opacity: 0,
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      delay: Math.random() * 0.5,
                      ease: 'linear',
                    }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor: ['#E6411C', '#212282', '#22C55E', '#F59E0B'][Math.floor(Math.random() * 4)],
                    }}
                  />
                ))}
              </div>
            )}

            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-14 h-14 text-green-500" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-foreground mb-2"
            >
              Order Placed Successfully! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground max-w-md mx-auto"
            >
              Thank you for your order! We're preparing your delicious Ugandan meal.
            </motion.p>
          </motion.div>

          {/* Order ID Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="card-premium p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">Order Number</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl md:text-3xl font-bold text-primary font-mono">
                  {orderData.orderId}
                </span>
                <button
                  onClick={handleCopyOrderId}
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                  aria-label="Copy order ID"
                >
                  <Copy className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                <Clock className="w-4 h-4 inline mr-1" />
                Estimated delivery: <span className="font-semibold text-foreground">{orderData.estimatedDelivery}</span>
              </p>
            </div>
          </motion.div>

          {/* Order Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">Order Status</h2>
            <div className="card-premium p-6">
              <div className="flex justify-between items-start">
                {orderSteps.map((step, index) => (
                  <div key={step.label} className="flex flex-col items-center relative flex-1">
                    {/* Connector Line */}
                    {index < orderSteps.length - 1 && (
                      <div 
                        className={`absolute top-6 left-1/2 h-0.5 w-full ${
                          index === 0 ? 'bg-green-500' : 'bg-muted'
                        }`}
                      />
                    )}
                    
                    {/* Icon */}
                    <div 
                      className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 
                          ? 'bg-green-500 text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <step.icon className="w-6 h-6" />
                    </div>
                    
                    {/* Label */}
                    <p className={`mt-2 text-xs md:text-sm font-medium text-center ${
                      index === 0 ? 'text-green-600' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground text-center hidden md:block">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">Order Details</h2>
            <div className="card-premium p-6">
              {/* Items */}
              <div className="space-y-4 mb-6">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-foreground">
                        {item.mainDishes.join(' + ')} Combo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.sauce?.name} ({item.sauce?.preparation}, {item.sauce?.size}) + {item.sideDish}
                      </p>
                      {item.extras.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          + {item.extras.map(e => `${e.name} (${e.quantity})`).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        {formatPrice(item.totalPrice * item.quantity)}
                      </p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Info */}
              <div className="pt-4 border-t border-border mb-4">
                <p className="text-sm text-muted-foreground mb-1">
                  <strong className="text-foreground">Delivering to:</strong>
                </p>
                <p className="text-foreground">{orderData.customerInfo.name}</p>
                <p className="text-sm text-muted-foreground">{orderData.customerInfo.phone}</p>
                <p className="text-sm text-muted-foreground">{orderData.customerInfo.location}</p>
                <p className="text-sm text-muted-foreground">{orderData.customerInfo.address}</p>
                {orderData.customerInfo.specialInstructions && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Note:</strong> {orderData.customerInfo.specialInstructions}
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-foreground">
                    {orderData.deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatPrice(orderData.deliveryFee)
                    )}
                  </span>
                </div>
                {orderData.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-{formatPrice(orderData.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-xl text-secondary">
                    {formatPrice(orderData.total)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  Payment: {orderData.paymentMethod === 'online' ? 'Paid Online' : 'Pay on Delivery'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleTrackViaWhatsApp}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Track via WhatsApp
              </button>
              <button
                onClick={handleShare}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share Order
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-2 text-secondary font-medium hover:underline"
              >
                <ShoppingBag className="w-5 h-5" />
                Continue Shopping
              </Link>
              <Link
                to="/order-history"
                className="inline-flex items-center justify-center gap-2 text-primary font-medium hover:underline"
              >
                View Order History
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
