import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  MapPin,
  Truck,
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  Tag,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  UtensilsCrossed,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { useCart, OrderHistoryItem } from '@/context/CartContext';
import { deliveryZones, promoCodes } from '@/data/menu';
import {
  formatPrice,
  generateOrderId,
  generateWhatsAppMessage,
  getWhatsAppLink,
} from '@/lib/utils/order';
import { toast } from 'sonner';
import { useAddressAutocomplete, PhotonResult } from '@/hooks/useAddressAutocomplete';

// Flutterwave configuration
const FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK_TEST-2cbeceb8352891cbcd28a983ce8d57ac-X';

// Peak hours utility
function isPeakHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 12 && hour < 14) || (hour >= 18 && hour < 20);
}

function getEstimatedDeliveryTime(zone: string | undefined): string {
  const baseTime = deliveryZones.find(z => z.name === zone)?.estimatedTime || '30-45 mins';
  if (isPeakHours()) {
    const match = baseTime.match(/(\d+)-(\d+)/);
    if (match) {
      return `${parseInt(match[1]) + 15}-${parseInt(match[2]) + 15} mins`;
    }
  }
  return baseTime;
}

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

import SEO from '@/components/SEO';

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
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  
  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Address Autocomplete
  const { 
    query: addressQuery, 
    setQuery: setAddressQuery, 
    suggestions: addressSuggestions, 
    isSearching: isSearchingAddress 
  } = useAddressAutocomplete('');

  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);

  // Sync address query with user preferences on mount/change
  useEffect(() => {
    if (state.userPreferences.address && addressQuery !== state.userPreferences.address) {
      setAddressQuery(state.userPreferences.address);
    }
  }, [state.userPreferences.address]);

  const handleAddressSelect = (result: PhotonResult) => {
    setAddressQuery(result.displayName);
    setUserPreferences({ address: result.displayName });
    setShowAddressSuggestions(false);
    
    // Auto-select zone if available
    if (result.nearestZone) {
      setSelectedZone(result.nearestZone.name);
      setShowZoneDropdown(false);
    } else {
      // If no zone found, prompt user
      setShowZoneDropdown(true);
      toast.info('Please select your delivery zone manually');
    }
  };

  const selectedZoneData = deliveryZones.find((z) => z.name === selectedZone);
  const baseDeliveryFee = selectedZoneData?.fee || 0;
  const freeDeliveryThreshold = 50000;
  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;
  const freeDeliveryProgress = Math.min(100, (cartTotal / freeDeliveryThreshold) * 100);
  const amountToFreeDelivery = freeDeliveryThreshold - cartTotal;
  
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
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!state.userPreferences.name?.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!state.userPreferences.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^(\+?256|0)7[0-9]{8}$/.test(state.userPreferences.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Ugandan phone number';
      isValid = false;
    }

    if (!selectedZone) {
      newErrors.zone = 'Please select a delivery zone';
      isValid = false;
    }

    if (!state.userPreferences.address?.trim()) {
      newErrors.address = 'Delivery address is required';
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      phone: true,
      zone: true,
      address: true
    });

    if (!isValid) {
      toast.error('Please fix the errors in the delivery form');
      setShowDeliveryForm(true);
      // Scroll to form
      const formElement = document.getElementById('delivery-form');
      if (formElement) formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
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

    saveOrderToHistory(orderId, 'whatsapp');
    const orderData = createOrderData(orderId, 'whatsapp');
    window.open(getWhatsAppLink(message), '_blank');
    clearCart();
    navigate('/order-confirmation', { state: orderData });
  };

  const handleOnlinePayment = () => {
    if (!validateForm()) return;

    if (typeof window.FlutterwaveCheckout !== 'function') {
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
          saveOrderToHistory(orderId, 'online');
          const orderData = createOrderData(orderId, 'online');
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

  // Empty Cart State
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] pb-24 lg:pb-0">
        <Header />
        <main className="pt-16 md:pt-20">
          <div className="container-custom section-padding text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-12 h-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-[#212282] mb-2">
                Your Cart is Empty
              </h1>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added any items yet. Explore our menu and
                build your perfect meal!
              </p>
              <Link 
                to="/menu" 
                className="inline-flex items-center gap-2 bg-[#E6411C] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d13a18] transition-colors"
              >
                Browse Menu
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] pb-20 lg:pb-0">
      <SEO 
        title="Your Cart | 9Yards Food"
        description="Review your order of authentic Ugandan cuisine. Secure checkout with Mobile Money or Card. Fast delivery across Kampala."
        url="/cart"
      />
      <Header />

      <main className="pt-16 sm:pt-[4.5rem] md:pt-20">
        {/* Mobile Header - matches main Header height behavior */}
        <div className="lg:hidden sticky top-16 sm:top-[4.5rem] md:top-20 z-30 h-14 sm:h-16 bg-[#fcf9f8]/95 backdrop-blur-md px-4 border-b border-gray-100">
          <div className="flex items-center justify-between h-full">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#212282]" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-[#212282]">My Cart</h2>
            <button 
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
              className="text-[#E6411C] text-sm font-bold hover:text-[#E6411C]/80 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="container-custom section-padding">
          {/* Desktop Title */}
          <h1 className="hidden lg:block text-2xl md:text-3xl font-bold text-[#212282] mb-8">
            Your Cart ({state.items.length} {state.items.length === 1 ? 'item' : 'items'})
          </h1>

          {/* Peak Hours Alert */}
          {peakHours && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#E6411C] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">High Demand</p>
                <p className="text-sm text-gray-600">
                  Deliveries may take 15-20 mins longer than usual due to peak hours.
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Free Delivery Progress - Mobile */}
              {!qualifiesForFreeDelivery && (
                <div className="lg:hidden">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <p className="text-[#212282] text-sm font-medium">
                        Add <span className="font-bold text-[#E6411C]">{formatPrice(amountToFreeDelivery)}</span> for free delivery
                      </p>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4 text-[#E6411C]" />
                        <p className="text-xs font-bold text-[#E6411C]">{Math.round(freeDeliveryProgress)}%</p>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#E6411C] rounded-full transition-all duration-500"
                        style={{ width: `${freeDeliveryProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex flex-col gap-4">
                {state.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4 items-start">
                      <div className="shrink-0">
                        <div className="h-[88px] w-[88px] rounded-2xl bg-gray-100 shadow-sm flex items-center justify-center">
                          <UtensilsCrossed className="w-10 h-10 text-[#212282]" />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between min-h-[88px]">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-[#212282] text-base font-bold leading-tight mb-1">
                              {item.mainDishes.join(' + ')}{item.type !== 'single' ? ' Combo' : ''}
                            </h3>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors -mt-1 -mr-2 p-2"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-gray-500 text-xs font-medium leading-normal line-clamp-1">
                            {item.type === 'single' && item.description ? (
                              item.description
                            ) : (
                              <>
                                {item.sauce?.name}
                                {(item.sauce?.preparation && item.sauce.preparation !== 'Default') || (item.sauce?.size && item.sauce.size !== 'Regular') ? (
                                  <> ({[
                                    item.sauce?.preparation !== 'Default' ? item.sauce?.preparation : null,
                                    item.sauce?.size !== 'Regular' ? item.sauce?.size : null
                                  ].filter(Boolean).join(', ')})</>
                                ) : null}
                                {item.sideDish ? ` + ${item.sideDish}` : ''}
                              </>
                            )}
                          </p>
                          {item.extras.length > 0 && (
                            <p className="text-gray-500 text-xs italic mt-0.5">
                              + {item.extras.map((e) => `${e.name} (${e.quantity})`).join(', ')}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <p className="text-[#E6411C] font-bold text-base">
                            {formatPrice(item.totalPrice * item.quantity)}
                          </p>
                          
                          <div className="flex items-center bg-gray-100 rounded-full p-1 h-8 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white text-[#212282] shadow-sm transition-colors hover:bg-gray-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-[#212282]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E6411C] text-white shadow-md transition-colors hover:bg-[#d13a18]"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < state.items.length - 1 && (
                      <div className="h-px bg-gray-100 w-full mt-4" />
                    )}
                  </div>
                ))}
              </div>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-[#212282] font-medium hover:text-[#E6411C] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add More Items
              </Link>

              {/* Promo Code - Mobile */}
              <div className="lg:hidden mt-4 md:max-w-lg md:mx-auto w-full">
                <h4 className="text-sm font-bold text-[#212282] mb-3">Promo Code</h4>
                {promoResult?.valid ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="bg-green-100 p-1.5 rounded-full flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-700" />
                      </div>
                      <span className="text-sm font-semibold text-green-800 truncate">
                        {promoResult.code} ({promoResult.message})
                      </span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-800 flex-shrink-0 ml-2"
                      aria-label="Remove promo code"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex w-full items-center rounded-xl bg-gray-50 border border-gray-100 p-1 pl-3 shadow-sm focus-within:ring-2 focus-within:ring-[#E6411C]/20 transition-all overflow-hidden">
                    <Tag className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter discount code"
                      className="flex-1 min-w-0 bg-transparent border-none text-[#212282] placeholder:text-gray-400 text-sm font-medium focus:ring-0 p-2"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="flex-shrink-0 px-3 py-2 bg-[#212282] text-white rounded-xl text-sm font-bold hover:bg-[#212282]/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Summary - Mobile */}
              <div className="lg:hidden mt-4 md:max-w-lg md:mx-auto w-full">
                <h4 className="text-sm font-bold text-[#212282] mb-4">Payment Summary</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Subtotal</span>
                    <span className="text-[#212282] font-bold">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 font-medium">Delivery Fee</span>
                    <span className="text-[#212282] font-bold">
                      {qualifiesForFreeDelivery || (promoResult?.valid && promoResult.discountType === 'free_delivery') ? (
                        <span className="text-green-600">FREE</span>
                      ) : selectedZone ? (
                        formatPrice(baseDeliveryFee)
                      ) : (
                        'Select zone'
                      )}
                    </span>
                  </div>
                  {promoResult?.valid && promoResult.discountType !== 'free_delivery' && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-600 font-medium">Discount</span>
                      <span className="text-green-600 font-bold">-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="my-2 border-t border-dashed border-gray-300" />
                  <div className="flex justify-between items-end">
                    <span className="text-[#212282] font-bold text-base">Total</span>
                    <span className="text-[#212282] font-extrabold text-2xl">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Form Toggle - Mobile */}
              <div className="lg:hidden mt-6 md:max-w-lg md:mx-auto w-full">
                <button
                  onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#212282]/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#212282]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#212282]">Delivery Details</p>
                      <p className="text-xs text-gray-500">
                        {selectedZone ? `${selectedZone} • ${estimatedDelivery}` : 'Add your delivery info'}
                      </p>
                    </div>
                  </div>
                  {showDeliveryForm ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {showDeliveryForm && (
                  <div id="delivery-form" className="mt-4 p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                    {/* Delivery Address - First (Smart Search) */}
                    <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={addressQuery}
                            onChange={(e) => {
                              setAddressQuery(e.target.value);
                              setUserPreferences({ address: e.target.value });
                              setShowAddressSuggestions(true);
                              if (errors.address) setErrors({ ...errors, address: '' });
                            }}
                            onFocus={() => setShowAddressSuggestions(true)}
                            onBlur={() => {
                              // Delay closing to allow clicking suggestions
                              setTimeout(() => setShowAddressSuggestions(false), 200);
                              setTouched({ ...touched, address: true });
                            }}
                            placeholder="Search area (e.g. Kololo, Kyengera)"
                            className={`w-full pl-10 pr-3 py-3 rounded-xl border ${errors.address && touched.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                          />
                          {isSearchingAddress && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 text-[#E6411C] animate-spin" />
                            </div>
                          )}
                        </div>
                        
                        {/* Address Suggestions Dropdown */}
                        {showAddressSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                            {addressSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddressSelect(suggestion);
                                }}
                                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors"
                              >
                                <p className="text-sm font-medium text-[#212282]">{suggestion.name}</p>
                                <p className="text-xs text-gray-500 truncate">{suggestion.displayName}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                        {errors.address && touched.address && (
                        <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {errors.address}
                        </p>
                      )}
                      
                      {/* Manual Zone Toggle */}
                      {!selectedZone && !showZoneDropdown && (
                        <button
                          onClick={() => setShowZoneDropdown(true)}
                          className="text-xs text-[#E6411C] font-semibold underline mt-2 hover:text-[#d13a18]"
                        >
                          Can't find your location? Select zone manually
                        </button>
                      )}
                    </div>
                    {/* Delivery Zone - Mobile (Only show if requested or selected) */}
                    {(showZoneDropdown || selectedZone) && (
                      <div>
                        {/* Only show label/select if it's being manually selected OR if we want to show the specific dropdown. 
                            Actually, if selectedZone exists, we previously showed a summary card. 
                            Let's keep the summary card logic for consistency, but hide the SELECT unless requested. 
                        */}
                        {!selectedZone ? (
                           <div>
                            <label className="text-sm font-medium text-[#212282] mb-2 block">
                              Delivery Zone *
                            </label>
                            <select
                              value={selectedZone}
                              onChange={(e) => {
                                setSelectedZone(e.target.value);
                                if (errors.zone) setErrors({ ...errors, zone: '' });
                              }}
                              onBlur={() => setTouched({ ...touched, zone: true })}
                              className={`w-full p-3 rounded-xl border ${errors.zone && touched.zone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                            >
                              <option value="">Select your delivery area...</option>
                              {deliveryZones.map((zone) => (
                                <option key={zone.name} value={zone.name}>
                                  {zone.name} - {formatPrice(zone.fee)} ({zone.estimatedTime})
                                </option>
                              ))}
                            </select>
                            {errors.zone && touched.zone && (
                              <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {errors.zone}
                              </p>
                            )}
                          </div>
                        ) : (
                          /* Summary Card when Zone is Selected */
                          <div className="flex items-center justify-between p-3 bg-[#212282]/5 rounded-xl border border-[#212282]/10 mt-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[#212282]/10 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-[#212282]" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Delivery Zone</p>
                                <p className="text-sm font-bold text-[#212282]">{selectedZone}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedZone('');
                                setShowZoneDropdown(true);
                              }}
                              className="text-xs font-bold text-[#E6411C] px-2 py-1 rounded hover:bg-[#E6411C]/10 transition-colors"
                            >
                              Change
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={state.userPreferences.name}
                        onChange={(e) => {
                          setUserPreferences({ name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        onBlur={() => setTouched({ ...touched, name: true })}
                        placeholder="Enter your full name"
                        className={`w-full p-3 rounded-xl border ${errors.name && touched.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">
                        Phone Number *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                          🇺🇬 +256
                        </span>
                        <input
                          type="tel"
                          value={state.userPreferences.phone}
                          onChange={(e) => {
                            setUserPreferences({ phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                          }}
                          onBlur={() => setTouched({ ...touched, phone: true })}
                          placeholder="700 123 456"
                          className={`flex-1 p-3 rounded-r-xl border ${errors.phone && touched.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                        />
                      </div>
                      {errors.phone && touched.phone ? (
                        <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {errors.phone}
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 mt-1">We'll call if we need directions.</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">
                        Delivery Address *
                      </label>
                      <div className="relative">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={addressQuery}
                            onChange={(e) => {
                              setAddressQuery(e.target.value);
                              setUserPreferences({ address: e.target.value });
                              setShowAddressSuggestions(true);
                              if (errors.address) setErrors({ ...errors, address: '' });
                            }}
                            onFocus={() => setShowAddressSuggestions(true)}
                            onBlur={() => {
                              // Delay closing to allow clicking suggestions
                              setTimeout(() => setShowAddressSuggestions(false), 200);
                              setTouched({ ...touched, address: true });
                            }}
                            placeholder="Search area (e.g. Kololo)"
                            className={`w-full pl-10 pr-3 py-3 rounded-xl border ${errors.address && touched.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                          />
                          {isSearchingAddress && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Loader2 className="w-4 h-4 text-[#E6411C] animate-spin" />
                            </div>
                          )}
                        </div>
                        
                        {/* Address Suggestions Dropdown */}
                        {showAddressSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                            {addressSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleAddressSelect(suggestion);
                                }}
                                className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors"
                              >
                                <p className="text-sm font-medium text-[#212282]">{suggestion.name}</p>
                                <p className="text-xs text-gray-500 truncate">{suggestion.displayName}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.address && touched.address && (
                        <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> {errors.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        placeholder="Gate code, landmark, special requests..."
                        rows={2}
                        className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C] resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile/Tablet Checkout Buttons - Integrated into flow */}
              <div className="lg:hidden mt-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-6 md:max-w-lg md:mx-auto">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-[#212282]">Checkout</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Choose Payment Method</p>
                </div>

                <div className="space-y-3">
                  {/* WhatsApp Button */}
                  <button
                    onClick={handleWhatsAppOrder}
                    disabled={isProcessingPayment}
                    className="w-full bg-[#25D366] text-white rounded-xl py-4 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-green-500/10"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span className="font-bold">Order via WhatsApp</span>
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="mx-3 flex-shrink-0 text-[10px] font-black uppercase text-gray-300 tracking-widest">Or pay securely now</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                  </div>

                  {/* Pay Now Button */}
                  <button
                    onClick={handleOnlinePayment}
                    disabled={isProcessingPayment}
                    className="w-full bg-[#212282] text-white rounded-xl py-4 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-primary/10"
                  >
                    {isProcessingPayment ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <CreditCard className="w-5 h-5" />
                    )}
                    <span className="font-bold">{isProcessingPayment ? 'Processing...' : 'Pay Now'}</span>
                  </button>
                </div>

                {/* Security Footer */}
                <div className="flex flex-col items-center gap-2 pt-2 border-t border-gray-50 mt-4">
                  <div className="flex items-center gap-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Secure
                    </span>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Encrypted
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary - Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
                <h2 className="text-lg font-bold text-[#212282] mb-6">
                  Order Summary
                </h2>

                {/* Free Delivery Progress - Desktop */}
                {!qualifiesForFreeDelivery && (
                  <div className="mb-6 p-4 bg-[#212282] rounded-xl overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Truck className="w-4 h-4 text-[#E6411C]" />
                          <p className="text-white/80 text-xs font-bold uppercase tracking-wider">Spend & Save</p>
                        </div>
                        <h3 className="text-white text-xl font-bold">Free Delivery</h3>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">
                          {formatPrice(cartTotal)} <span className="text-white/60 text-sm font-normal">/ {formatPrice(freeDeliveryThreshold)}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#E6411C] rounded-full transition-all"
                          style={{ width: `${freeDeliveryProgress}%` }}
                        />
                      </div>
                      <p className="text-white/90 text-sm font-medium">
                        You are <span className="text-[#E6411C] font-bold">{formatPrice(amountToFreeDelivery)}</span> away from Free Delivery!
                      </p>
                    </div>
                  </div>
                )}

                {/* Manual Zone Toggle - Desktop */}
                {!selectedZone && !showZoneDropdown && (
                  <button
                    onClick={() => setShowZoneDropdown(true)}
                    className="text-xs text-[#E6411C] font-semibold underline mt-2 hover:text-[#d13a18]"
                  >
                    Can't find your location? Select zone manually
                  </button>
                )}

                {/* Delivery Zone - Desktop (Hybrid) */}
                {(showZoneDropdown || selectedZone) && (
                  <div className="mb-6">
                    {!selectedZone ? (
                      <div>
                        <label className="text-sm font-medium text-[#212282] mb-2 block">
                          Delivery Zone *
                        </label>
                        <select
                          value={selectedZone}
                          onChange={(e) => {
                            setSelectedZone(e.target.value);
                            if (errors.zone) setErrors({ ...errors, zone: '' });
                          }}
                          onBlur={() => setTouched({ ...touched, zone: true })}
                          className={`w-full p-3 rounded-xl border ${errors.zone && touched.zone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                        >
                          <option value="">Select your delivery area...</option>
                          {deliveryZones.map((zone) => (
                            <option key={zone.name} value={zone.name}>
                              {zone.name} - {formatPrice(zone.fee)} ({zone.estimatedTime})
                            </option>
                          ))}
                        </select>
                        {errors.zone && touched.zone && (
                          <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {errors.zone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3 bg-[#212282]/5 rounded-xl border border-[#212282]/10">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#212282]/10 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-[#212282]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-medium">Delivery Zone</p>
                            <p className="text-sm font-bold text-[#212282]">{selectedZone}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setSelectedZone('');
                            setShowZoneDropdown(true);
                          }}
                          className="text-xs font-bold text-[#E6411C] px-2 py-1 rounded hover:bg-[#E6411C]/10 transition-colors"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Info - Desktop */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-[#212282] mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={state.userPreferences.name}
                      onChange={(e) => {
                        setUserPreferences({ name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      onBlur={() => setTouched({ ...touched, name: true })}
                      placeholder="Enter your full name"
                      className={`w-full p-3 rounded-xl border ${errors.name && touched.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#212282] mb-2 block">
                      Phone Number *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                        🇺🇬 +256
                      </span>
                      <input
                        type="tel"
                        value={state.userPreferences.phone}
                        onChange={(e) => {
                          setUserPreferences({ phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        onBlur={() => setTouched({ ...touched, phone: true })}
                        placeholder="700 123 456"
                        className={`flex-1 p-3 rounded-r-xl border ${errors.phone && touched.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                      />
                    </div>
                    {errors.phone && touched.phone ? (
                      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.phone}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">We'll call if we need directions.</p>
                    )}
                  </div>
                {/* Customer Info - Desktop */}
                <div className="space-y-4 mb-6">
                  {/* Delivery Address - First (Smart Search) */}
                  <div>
                    <label className="text-sm font-medium text-[#212282] mb-2 block">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={addressQuery}
                          onChange={(e) => {
                            setAddressQuery(e.target.value);
                            setUserPreferences({ address: e.target.value });
                            setShowAddressSuggestions(true);
                            if (errors.address) setErrors({ ...errors, address: '' });
                          }}
                          onFocus={() => setShowAddressSuggestions(true)}
                          onBlur={() => {
                            setTimeout(() => setShowAddressSuggestions(false), 200);
                            setTouched({ ...touched, address: true });
                          }}
                          placeholder="Search area (e.g. Kololo, Kyengera)"
                          className={`w-full pl-10 pr-3 py-3 rounded-xl border ${errors.address && touched.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C]`}
                        />
                        {isSearchingAddress && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 text-[#E6411C] animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      {/* Address Suggestions Dropdown */}
                      {showAddressSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddressSelect(suggestion);
                              }}
                              className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-none transition-colors"
                            >
                              <p className="text-sm font-medium text-[#212282]">{suggestion.name}</p>
                              <p className="text-xs text-gray-500 truncate">{suggestion.displayName}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.address && touched.address && (
                      <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#212282] mb-2 block">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Gate code, landmark, special requests..."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-[#212282] focus:outline-none focus:ring-2 focus:ring-[#E6411C]/20 focus:border-[#E6411C] resize-none"
                    />
                  </div>
                </div>

                {/* Promo Code - Desktop */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-[#212282] mb-2 block">
                    Promo Code
                  </label>
                  {promoResult?.valid ? (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="bg-green-100 p-1.5 rounded-full flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-700" />
                        </div>
                        <span className="text-sm font-semibold text-green-800 truncate">
                          {promoResult.code}
                        </span>
                      </div>
                      <span className="text-green-700 text-sm font-bold flex-shrink-0 ml-2">-{formatPrice(discount)}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <div className="flex-1 min-w-0 flex items-center rounded-xl bg-gray-50 border border-gray-200 pl-3 overflow-hidden">
                        <Tag className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Enter discount code"
                          className="flex-1 min-w-0 p-3 bg-transparent border-none text-[#212282] focus:ring-0 placeholder:text-gray-400 text-sm"
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        className="flex-shrink-0 px-4 py-2 bg-[#212282] text-white rounded-xl font-bold hover:bg-[#212282]/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown - Desktop */}
                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-[#212282] font-semibold">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="text-[#212282] font-semibold">
                      {qualifiesForFreeDelivery || (promoResult?.valid && promoResult.discountType === 'free_delivery') ? (
                        <span className="text-green-600 font-bold">FREE</span>
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
                      <span className="text-green-600 font-bold">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-dashed border-gray-300">
                    <span className="font-bold text-[#212282]">Total</span>
                    <span className="font-extrabold text-xl text-[#E6411C]">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Buttons - Desktop */}
                <div className="space-y-4">
                  {/* Section Header */}
                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-[#212282]">Choose Your Payment Method</h3>
                    <p className="text-sm text-gray-500">Select the option that works best for you.</p>
                  </div>

                  {/* WhatsApp Button */}
                  <div className="space-y-2">
                    <button
                      onClick={handleWhatsAppOrder}
                      disabled={isProcessingPayment}
                      className="w-full bg-[#25D366] text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors hover:bg-[#22c55e] disabled:opacity-50"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      <span className="font-bold">Order via WhatsApp</span>
                    </button>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      Quick & easy. Opens WhatsApp with your order ready to send. Pay when you receive your food.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 flex-shrink-0 text-xs font-semibold uppercase text-gray-400">Or pay securely now</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Pay Now Button */}
                  <div className="space-y-2">
                    <button
                      onClick={handleOnlinePayment}
                      disabled={isProcessingPayment}
                      className="w-full bg-[#212282] text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 transition-colors hover:bg-[#1a1a6e] disabled:opacity-50"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-bold">Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          <span className="font-bold">Pay Now</span>
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      Pay securely via MTN/Airtel Mobile Money or Card.
                    </p>
                    {/* Trust Badge */}
                    <div className="flex justify-center mt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wide border border-gray-200 rounded px-2 py-1">
                        <Shield className="w-3 h-3" />
                        Secured by Flutterwave
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Footer */}
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    100% Secure Payments
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Your Data is Protected
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>

      <Footer />
      
      {/* Sticky Mobile Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-4 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Total</p>
            <p className="text-xl font-black text-[#212282]">{formatPrice(total)}</p>
          </div>
          <button
            onClick={() => {
              // If form is not visible, show it first
              if (!showDeliveryForm) {
                setShowDeliveryForm(true);
                toast.info('Please confirm your delivery details');
                // Scroll to delivery toggle
                setTimeout(() => {
                  const element = document.getElementById('delivery-form') || document.querySelector('button[class*="items-center justify-between"]');
                  element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
              } else {
                handleWhatsAppOrder();
              }
            }}
            disabled={isProcessingPayment}
            className="flex-1 bg-[#25D366] text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Order Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
