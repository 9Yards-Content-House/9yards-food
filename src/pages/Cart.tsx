import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { useCart } from '@/context/CartContext';
import { deliveryZones } from '@/data/menu';
import {
  formatPrice,
  generateOrderId,
  generateWhatsAppMessage,
  getWhatsAppLink,
} from '@/lib/utils/order';
import { toast } from 'sonner';

export default function CartPage() {
  const {
    state,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    setUserPreferences,
  } = useCart();
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const deliveryFee =
    deliveryZones.find((z) => z.name === selectedZone)?.fee || 0;
  const freeDeliveryThreshold = 50000;
  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;
  const finalDeliveryFee = qualifiesForFreeDelivery ? 0 : deliveryFee;
  const total = cartTotal + finalDeliveryFee;

  const handleWhatsAppOrder = () => {
    if (!state.userPreferences.name || !state.userPreferences.phone) {
      toast.error('Please fill in your name and phone number');
      return;
    }
    if (!selectedZone) {
      toast.error('Please select a delivery zone');
      return;
    }

    const orderId = generateOrderId();
    const message = generateWhatsAppMessage(
      orderId,
      state.items,
      {
        ...state.userPreferences,
        location: selectedZone,
      },
      cartTotal,
      finalDeliveryFee,
      total
    );

    window.open(getWhatsAppLink(message), '_blank');
    toast.success('Redirecting to WhatsApp...');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <Header />
        <main className="pt-20 md:pt-24">
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

      <main className="pt-20 md:pt-24">
        <div className="container-custom section-padding">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold text-foreground mb-8"
          >
            Your Cart ({state.items.length} items)
          </motion.h1>

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
                    Delivery Zone
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
                      Delivery Address
                    </label>
                    <textarea
                      value={state.userPreferences.address}
                      onChange={(e) => setUserPreferences({ address: e.target.value })}
                      placeholder="Enter delivery address"
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
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 p-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                    <button
                      onClick={() => {
                        if (promoCode === 'FIRST10') {
                          setPromoApplied(true);
                          toast.success('Promo code applied!');
                        } else {
                          toast.error('Invalid promo code');
                        }
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
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
                      {qualifiesForFreeDelivery ? (
                        <span className="text-secondary font-medium">FREE</span>
                      ) : selectedZone ? (
                        formatPrice(deliveryFee)
                      ) : (
                        'Select zone'
                      )}
                    </span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Discount (10%)</span>
                      <span className="text-secondary">
                        -{formatPrice(Math.round(cartTotal * 0.1))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-bold text-xl text-secondary">
                      {formatPrice(
                        promoApplied
                          ? Math.round(total * 0.9)
                          : total
                      )}
                    </span>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleWhatsAppOrder}
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Order via WhatsApp
                  </button>
                  <button
                    onClick={() => toast.info('Online payment coming soon!')}
                    className="w-full btn-outline flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay Online
                  </button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Estimated delivery: 30-45 minutes
                </p>
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
