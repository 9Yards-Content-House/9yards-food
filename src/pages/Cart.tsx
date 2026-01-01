import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  CreditCard,
  MapPin,
  Truck,
  Gift,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { useCart, OrderHistoryItem } from '@/context/CartContext';
import { deliveryZones, promoCodes } from '@/data/menu';
import {
  formatPrice,
  generateOrderId,
  generateWhatsAppMessage,
  getWhatsAppLink,
} from '@/lib/utils/order';
import { toast } from 'sonner';

// Flutterwave configuration
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-2cbeceb8352891cbcd28a983ce8d57ac-X';

// Peak hours utility
function isPeakHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  // Lunch: 12-2PM, Dinner: 6-8PM
  return (hour >= 12 && hour < 14) || (hour >= 18 && hour < 20);
}

function getEstimatedDeliveryTime(zone: string | undefined): string {
  const baseTime = deliveryZones.find(z => z.name === zone)?.estimatedTime || '30-45 mins';
  if (isPeakHours()) {
    // Add 15 mins to both ends for peak hours
    const match = baseTime.match(/(\d+)-(\d+)/);
    if (match) {
      return `${parseInt(match[1]) + 15}-${parseInt(match[2]) + 15} mins`;
    }
  }
  return baseTime;
}

// Promo code validation
interface PromoResult {
  valid: boolean;
  discount: number;
  discountType: 'percentage' | 'fixed' | 'free_delivery';
  message: string;
  code?: string;
}

function validatePromoCode(code: string, subtotal: number, deliveryFee: number): PromoResult {
  const upperCode = code.toUpperCase().trim();
  const promo = promoCodes[upperCode];
  
  if (!promo) {
    return { valid: false, discount: 0, discountType: 'fixed', message: 'Invalid promo code' };
  }
  
  if (promo.minOrder && subtotal < promo.minOrder) {
    return { 
      valid: false, 
      discount: 0, 
      discountType: 'fixed',
      message: `Minimum order of ${formatPrice(promo.minOrder)} required` 
    };
  }
  
  // Handle FREESHIP special case
  if (upperCode === 'FREESHIP') {
    return {
      valid: true,
      discount: deliveryFee,
      discountType: 'free_delivery',
      message: 'Free delivery applied!',
      code: upperCode,
    };
  }
  
  if (promo.type === 'percentage') {
    const discount = Math.round(subtotal * (promo.discount / 100));
    return {
      valid: true,
      discount,
      discountType: 'percentage',
      message: `${promo.discount}% discount applied!`,
      code: upperCode,
    };
  }
  
  return {
    valid: true,
    discount: promo.discount,
    discountType: 'fixed',
    message: `${formatPrice(promo.discount)} discount applied!`,
    code: upperCode,
  };
}

// Flutterwave payment handler
declare global {
  interface Window {
    FlutterwaveCheckout: (config: FlutterwaveConfig) => void;
  }
}

interface FlutterwaveConfig {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
  callback: (response: FlutterwaveResponse) => void;
  onclose: () => void;
}

interface FlutterwaveResponse {
  status: string;
  transaction_id: number;
  tx_ref: string;
  flw_ref: string;
}

export default function CartPage() {
  const navigate = useNavigate();
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    setUserPreferences,
    addOrderToHistory,
  } = useCart();
  
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Calculate delivery fee
  const selectedZoneData = deliveryZones.find((z) => z.name === selectedZone);
  const baseDeliveryFee = selectedZoneData?.fee || 0;
  const freeDeliveryThreshold = 50000;
  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;
  
  // Apply promo adjustments
  const deliveryFee = useMemo(() => {
    if (qualifiesForFreeDelivery) return 0;
    if (promoResult?.valid && promoResult.discountType === 'free_delivery') return 0;
    return baseDeliveryFee;
  }, [qualifiesForFreeDelivery, promoResult, baseDeliveryFee]);

  const discount = useMemo(() => {
    if (!promoResult?.valid) return 0;
    if (promoResult.discountType === 'free_delivery') return baseDeliveryFee;
    return promoResult.discount;
  }, [promoResult, baseDeliveryFee]);

  const total = cartTotal + deliveryFee - (promoResult?.discountType !== 'free_delivery' ? discount : 0);
  const estimatedDelivery = getEstimatedDeliveryTime(selectedZone);
  const peakHours = isPeakHours();

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    const result = validatePromoCode(promoCode, cartTotal, baseDeliveryFee);
    setPromoResult(result);
    if (result.valid) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoResult(null);
    toast.info('Promo code removed');
  };

  const validateForm = (): boolean => {
    if (!state.userPreferences.name?.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!state.userPreferences.phone?.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!selectedZone) {
      toast.error('Please select a delivery zone');
      return false;
    }
    if (!state.userPreferences.address?.trim()) {
      toast.error('Please enter your delivery address');
      return false;
    }
    return true;
  };

  const createOrderData = (orderId: string, paymentMethod: 'whatsapp' | 'online') => {
    return {
      orderId,
      items: state.items,
      customerInfo: {
        ...state.userPreferences,
        location: selectedZone,
        specialInstructions,
      },
      subtotal: cartTotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
      estimatedDelivery,
      orderDate: new Date().toISOString(),
    };
  };

  const saveOrderToHistory = (orderId: string, paymentMethod: 'whatsapp' | 'online') => {
    const historyItem: OrderHistoryItem = {
      orderId,
      orderDate: new Date().toISOString(),
      items: state.items,
      deliveryLocation: selectedZone,
      deliveryFee,
      subtotal: cartTotal,
      discount,
      total,
      paymentMethod,
      status: 'pending',
    };
    addOrderToHistory(historyItem);
  };

  const handleWhatsAppOrder = () => {
    if (!validateForm()) return;

    const orderId = generateOrderId();
    const message = generateWhatsAppMessage(
      orderId,
      state.items,
      {
        ...state.userPreferences,
        location: selectedZone,
        specialInstructions,
      },
      cartTotal,
      deliveryFee,
      total,
      'Pay on Delivery'
    );

    // Save to history
    saveOrderToHistory(orderId, 'whatsapp');

    // Navigate to confirmation
    const orderData = createOrderData(orderId, 'whatsapp');
    
    // Open WhatsApp
    window.open(getWhatsAppLink(message), '_blank');
    
    // Clear cart and navigate
    clearCart();
    navigate('/order-confirmation', { state: orderData });
  };

  const handleOnlinePayment = () => {
    if (!validateForm()) return;

    // Check if Flutterwave is loaded
    if (typeof window.FlutterwaveCheckout !== 'function') {
      // Load Flutterwave script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.flutterwave.com/v3.js';
      script.async = true;
      script.onload = () => initiatePayment();
      document.body.appendChild(script);
    } else {
      initiatePayment();
    }
  };

  const initiatePayment = () => {
    setIsProcessingPayment(true);
    const orderId = generateOrderId();

    const config: FlutterwaveConfig = {
      public_key: FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: orderId,
      amount: total,
      currency: 'UGX',
      payment_options: 'card,mobilemoneyuganda,ussd',
      customer: {
        email: `${state.userPreferences.phone.replace(/\D/g, '')}@9yards.co.ug`,
        phone_number: state.userPreferences.phone,
        name: state.userPreferences.name,
      },
      customizations: {
        title: '9Yards Food',
        description: `Order ${orderId}`,
        logo: 'https://food.9yards.co.ug/logo.png',
      },
      callback: (response: FlutterwaveResponse) => {
        setIsProcessingPayment(false);
        
        if (response.status === 'successful') {
          // Save to history
          saveOrderToHistory(orderId, 'online');
          
          // Navigate to confirmation
          const orderData = createOrderData(orderId, 'online');
          
          // Clear cart and navigate
          clearCart();
          navigate('/order-confirmation', { state: orderData });
          
          toast.success('Payment successful!');
        } else {
          toast.error('Payment failed. Please try again.');
        }
      },
      onclose: () => {
        setIsProcessingPayment(false);
      },
    };

    window.FlutterwaveCheckout(config);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <Header />
        <main className="pt-16 md:pt-20">
          <div className="container-custom section-padding text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items yet. Explore our menu and
                build your perfect meal!
              </p>
              <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
                Browse Menu
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="pt-16 md:pt-20">
        <div className="container-custom section-padding">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-foreground mb-8"
          >
            Your Cart ({state.items.length} items)
          </motion.h1>

          {/* Peak Hours Alert */}
          {peakHours && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Peak Hours</p>
                <p className="text-sm text-yellow-700">
                  High demand right now! Delivery may take {estimatedDelivery}.
                </p>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-premium p-4 md:p-6"
                >
                  <div className="flex gap-4">
                    {/* Image placeholder */}
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1">
                        {item.mainDishes.join(' + ')} Combo
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.sauce?.name} ({item.sauce?.preparation},{' '}
                        {item.sauce?.size}) + {item.sideDish}
                      </p>
                      {item.extras.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          + {item.extras.map((e) => `${e.name} (${e.quantity})`).join(', ')}
                        </p>
                      )}

                      {/* Price & Actions */}
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-secondary font-bold">
                          {formatPrice(item.totalPrice * item.quantity)}
                        </span>

                        <div className="flex items-center gap-3">
                          {/* Quantity */}
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, Math.max(1, item.quantity - 1))
                              }
                              className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-background transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-background transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-11 h-11 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-secondary font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add More Items
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card-premium p-6 sticky top-28"
              >
                <h2 className="text-lg font-bold text-foreground mb-6">
                  Order Summary
                </h2>

                {/* Free Delivery Progress */}
                {!qualifiesForFreeDelivery && (
                  <div className="mb-6 p-4 bg-secondary/10 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium text-foreground">
                        Free Delivery Progress
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-secondary rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            100,
                            (cartTotal / freeDeliveryThreshold) * 100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Spend{' '}
                      <span className="font-semibold text-secondary">
                        {formatPrice(freeDeliveryThreshold - cartTotal)}
                      </span>{' '}
                      more for free delivery!
                    </p>
                  </div>
                )}

                {/* Delivery Zone */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Delivery Zone *
                  </label>
                  <select
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="">Select your area</option>
                    {deliveryZones.map((zone) => (
                      <option key={zone.name} value={zone.name}>
                        {zone.name} - {formatPrice(zone.fee)} ({zone.estimatedTime})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={state.userPreferences.name}
                      onChange={(e) => setUserPreferences({ name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={state.userPreferences.phone}
                      onChange={(e) => setUserPreferences({ phone: e.target.value })}
                      placeholder="+256 700 000 000"
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Delivery Address *
                    </label>
                    <textarea
                      value={state.userPreferences.address}
                      onChange={(e) => setUserPreferences({ address: e.target.value })}
                      placeholder="Enter delivery address"
                      rows={2}
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Gate code, landmarks, special requests..."
                      rows={2}
                      className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    />
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Promo Code
                  </label>
                  {promoResult?.valid ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {promoResult.code}
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromo}
                        className="text-green-600 hover:text-green-800"
                        aria-label="Remove promo code"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                      <button
                        onClick={handleApplyPromo}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Try: FIRST10, SAVE5K, or FREESHIP
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="text-foreground">
                      {qualifiesForFreeDelivery || (promoResult?.valid && promoResult.discountType === 'free_delivery') ? (
                        <span className="text-secondary font-medium">FREE</span>
                      ) : selectedZone ? (
                        formatPrice(baseDeliveryFee)
                      ) : (
                        'Select zone'
                      )}
                    </span>
                  </div>
                  {promoResult?.valid && promoResult.discountType !== 'free_delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-xl text-secondary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={isProcessingPayment}
                    className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Order via WhatsApp
                  </button>
                  <button
                    onClick={handleOnlinePayment}
                    disabled={isProcessingPayment}
                    className="w-full btn-outline flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay Online
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    Estimated delivery: {estimatedDelivery}
                  </p>
                  {peakHours && (
                    <p className="text-xs text-yellow-600 mt-1">
                      (Peak hours - may take longer)
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
