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
  ChevronDown,
  ChevronUp,
  Shield,
  Lock,
  UtensilsCrossed,
  AlertTriangle,
  CheckCircle,
  X,
  Loader2,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Pencil
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import PageHeader from '@/components/layout/PageHeader';
import MobilePageHeader from '@/components/layout/MobilePageHeader';
import OptimizedImage from '@/components/ui/optimized-image';
import SwipeableItem, { SwipeHint } from '@/components/ui/SwipeableItem';
import { useCart, OrderHistoryItem } from '@/context/CartContext';
import { deliveryZones, promoCodes, menuData } from '@/data/menu';
import {
  formatPrice,
  generateOrderId,
  generateWhatsAppMessage,
  getWhatsAppLink,
} from '@/lib/utils/order';
import { useGuest } from '@/context/GuestContext';
import { toast } from 'sonner';
import { useAddressAutocomplete, PhotonResult } from '@/hooks/useAddressAutocomplete';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import { haptics, isMobileDevice } from '@/lib/utils/ui';

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
  const { userName } = useGuest();
  
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showZoneOverride, setShowZoneOverride] = useState(false);
  
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
  const [coverageWarning, setCoverageWarning] = useState<{
    show: boolean;
    type: 'out-of-area' | 'far-from-zones' | null;
    distance?: number;
    message?: string;
  }>({ show: false, type: null });

  // Sync address query with user preferences on mount/change
  useEffect(() => {
    if (state.userPreferences.address && addressQuery !== state.userPreferences.address) {
      setAddressQuery(state.userPreferences.address);
    }
    // Pre-populate zone from context (set on home page)
    if (state.userPreferences.location && !selectedZone) {
      const zoneFromContext = deliveryZones.find(z => z.name === state.userPreferences.location);
      if (zoneFromContext) {
        setSelectedZone(zoneFromContext.name);
      }
    }
  }, [state.userPreferences.address, state.userPreferences.location]);

  const handleAddressSelect = (result: PhotonResult) => {
    setAddressQuery(result.displayName);
    setUserPreferences({ address: result.displayName });
    setShowAddressSuggestions(false);
    
    // Check if location is within delivery coverage
    if (!result.isInKampalaArea) {
      // Location is outside Kampala metro area (>25km from center)
      setCoverageWarning({
        show: true,
        type: 'out-of-area',
        distance: Math.round(result.distanceToZone),
        message: 'This location is outside our delivery area. We currently deliver within Kampala and surrounding areas only.'
      });
      setSelectedZone('');
      return;
    }
    
    // Check distance to nearest zone
    if (result.distanceToZone > 10) {
      // More than 10km from any delivery zone
      setCoverageWarning({
        show: true,
        type: 'far-from-zones',
        distance: Math.round(result.distanceToZone),
        message: `This location is ${Math.round(result.distanceToZone)}km from our nearest delivery zone. Delivery may not be available or may take longer.`
      });
      setSelectedZone('');
      return;
    }
    
    // Clear any previous warnings
    setCoverageWarning({ show: false, type: null });
    
    // Auto-select zone if available
    if (result.nearestZone) {
      setSelectedZone(result.nearestZone.name);
      setShowZoneOverride(false);
      // Persist to context
      setUserPreferences({ location: result.nearestZone.name });
      toast.success(`Delivery zone: ${result.nearestZone.name}`, {
        description: `${formatPrice(result.nearestZone.fee)} • ${result.nearestZone.estimatedTime}`
      });
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

    // Check for coverage warnings
    if (coverageWarning.show && coverageWarning.type === 'out-of-area') {
      toast.error('We cannot deliver to this location. Please choose an address within our delivery area.');
      return false;
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

  // Helper to get item image
  const getItemImage = (item: any) => {
    // Priority: Item Image -> Sauce Image -> Menu Data Lookup -> Fallback
    if (item.image) return item.image;
    if (item.sauce?.image) return item.sauce.image;
    
    // For single items, look up from menu data
    if (item.type === 'single') {
      // Extract raw ID (strip category prefix like 'lusaniya-', 'juice-', etc.)
      const getRawId = (id: string) => {
        const prefixes = ['lusaniya-', 'juice-', 'dessert-', 'side-', 'main-'];
        for (const prefix of prefixes) {
          if (id.startsWith(prefix)) {
            return id.substring(prefix.length);
          }
        }
        return id;
      };
      
      const rawId = getRawId(item.id);
      const itemName = item.mainDishes?.[0] || '';
      
      // Search in all menu categories
      const lusaniya = menuData.lusaniya.find(l => l.id === rawId || l.id === item.id || l.name === itemName);
      if (lusaniya?.image) return lusaniya.image;
      
      const juice = menuData.juices.find(j => j.id === rawId || j.id === item.id || j.name === itemName);
      if (juice?.image) return juice.image;
      
      const dessert = menuData.desserts.find(d => d.id === rawId || d.id === item.id || d.name === itemName);
      if (dessert?.image) return dessert.image;
      
      const side = menuData.sideDishes.find(s => s.id === rawId || s.id === item.id || s.name === itemName);
      if (side?.image) return side.image;
    }
    
    // For combos, try to get image from first main dish
    if (item.type === 'combo' && item.mainDishes?.[0]) {
      const mainDish = menuData.mainDishes.find(d => d.name === item.mainDishes[0]);
      if (mainDish?.image) return mainDish.image;
    }
    
    return null;
  };

  // Helper to get item description from menu data
  const getItemDescription = (item: any): string | null => {
    if (item.description) return item.description;
    
    if (item.type === 'single') {
      const getRawId = (id: string) => {
        const prefixes = ['lusaniya-', 'juice-', 'dessert-', 'side-', 'main-'];
        for (const prefix of prefixes) {
          if (id.startsWith(prefix)) {
            return id.substring(prefix.length);
          }
        }
        return id;
      };
      
      const rawId = getRawId(item.id);
      const itemName = item.mainDishes?.[0] || '';
      
      const lusaniya = menuData.lusaniya.find(l => l.id === rawId || l.id === item.id || l.name === itemName);
      if (lusaniya?.description) return lusaniya.description;
      
      const juice = menuData.juices.find(j => j.id === rawId || j.id === item.id || j.name === itemName);
      if (juice?.description) return juice.description;
      
      const dessert = menuData.desserts.find(d => d.id === rawId || d.id === item.id || d.name === itemName);
      if (dessert?.description) return dessert.description;
      
      const side = menuData.sideDishes.find(s => s.id === rawId || s.id === item.id || s.name === itemName);
      if (side?.description) return side.description;
    }
    
    return null;
  };

  // Empty Cart State
  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-24 lg:pb-0">
        <Header />
        <main id="main-content" className="pt-16 md:pt-20">
          <div className="container-custom px-5 sm:px-6 md:px-8 section-padding text-center">
             <div className="max-w-md mx-auto py-12">
               {/* Visual Circle */}
               <div className="w-32 h-32 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-secondary/10 relative">
                 <ShoppingBag className="w-12 h-12 text-secondary/40" />
                 <div className="absolute top-2 right-2 bg-background rounded-full p-2 border border-border shadow-sm">
                    <span className="text-xl">🤔</span>
                 </div>
               </div>
               
               <h1 className="text-3xl font-bold text-foreground mb-3">
                 Your Cart is Empty
               </h1>
               <p className="text-muted-foreground mb-8 text-lg">
                 Looks like you haven't decided yet. Check out our menu for some delicious inspiration!
               </p>
               <Link to="/menu" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-lg">
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
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <SEO 
        title={pageMetadata.cart.title}
        description={pageMetadata.cart.description}
        keywords={pageMetadata.cart.keywords}
        url={pageMetadata.cart.canonicalUrl}
        noIndex={!pageMetadata.cart.noIndex} // Cart page has noIndex: true in seo.ts, but user wants it indexed? Wait. 
        // Checking seo.ts: cart: { ..., noIndex: true }
        // My SEO component has noIndex defaulting to false.
        // So I should pass noIndex={true} or noIndex={pageMetadata.cart.noIndex}
        // Let's pass pageMetadata.cart.noIndex directly.
        // If pageMetadata.cart.noIndex is true, then noIndex prop is true, so robots meta will be noindex.
      />
      <Header />

      <main id="main-content" className="pt-16 md:pt-20">
        {/* Mobile App-Style Header */}
        <MobilePageHeader 
          title="Your Cart"
          subtitle={`${state.items.length} item${state.items.length !== 1 ? 's' : ''}`}
        />
        
        {/* Desktop Header */}
        <div className="hidden lg:block">
          <PageHeader 
            title="Your Cart"
            description={`Review your items (${state.items.length}) and checkout.`}
            variant="compact"
          />
        </div>

        <div className="container-custom px-5 sm:px-6 md:px-8 py-8 md:py-12">
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
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                   <h3 className="font-bold text-foreground">Order Items</h3>
                   <button 
                      onClick={() => {
                        clearCart();
                        toast.success('Cart cleared');
                      }}
                      className="text-muted-foreground hover:text-destructive text-sm flex items-center gap-1 transition-colors"
                      title="Remove all items from cart"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                </div>

                {/* Mobile swipe hint */}
                {state.items.length > 0 && isMobileDevice() && (
                  <SwipeHint className="lg:hidden" />
                )}

                {state.items.map((item, index) => {
                  const itemImage = getItemImage(item);
                  const itemDescription = getItemDescription(item);
                  const totalItemPrice = item.totalPrice * item.quantity;
                  
                  const itemContent = (
                    <div className="flex gap-4 items-start py-2">
                      {/* Visual */}
                      <div className="shrink-0 w-24 h-24 rounded-2xl bg-muted overflow-hidden border border-border relative">
                        {itemImage ? (
                          <OptimizedImage
                            src={itemImage}
                            alt={item.mainDishes.join(', ')}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                             <UtensilsCrossed className="w-8 h-8" />
                           </div>
                        )}
                        {/* Type badge */}
                        <span className={`absolute bottom-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                          item.type === 'combo' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.type === 'combo' ? 'Combo' : 'Single'}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between min-h-[96px]">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-[#212282] text-base font-bold leading-tight line-clamp-2">
                              {item.mainDishes.join(' + ')}{item.type === 'combo' ? ' Combo' : ''}
                            </h3>
                            {/* Hide X button on mobile (swipe instead) */}
                            <button 
                              onClick={() => {
                                haptics.light();
                                removeItem(item.id);
                              }}
                              className="hidden lg:flex text-muted-foreground/50 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                              title="Remove from Cart"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          
                          {/* Descriptions */}
                          <div className="text-sm text-muted-foreground space-y-1">
                              {/* Single item description from menu */}
                              {item.type === 'single' && itemDescription && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {itemDescription}
                                </p>
                              )}
                              
                              {/* Combo: Sauce with preparation and size */}
                              {item.type === 'combo' && item.sauce && (
                                 <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-medium text-foreground text-sm">{item.sauce.name}</span>
                                    {item.sauce.preparation && item.sauce.preparation !== 'Default' && (
                                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{item.sauce.preparation}</span>
                                    )}
                                    {item.sauce.size && (
                                      <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium">{item.sauce.size}</span>
                                    )}
                                 </div>
                              )}
                              
                              {/* Side dish */}
                              {item.sideDish && (
                                  <p className="text-xs">+ {item.sideDish}</p>
                              )}
                              
                              {/* Extras */}
                              {item.extras.length > 0 && (
                                <p className="text-xs text-[#E6411C]">
                                  + {item.extras.map((e) => e.quantity > 1 ? `${e.name} ×${e.quantity}` : e.name).join(', ')}
                                </p>
                              )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Price with breakdown for quantity > 1 */}
                          <div>
                            <p className="text-[#E6411C] font-bold text-lg">
                              {formatPrice(totalItemPrice)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-[10px] text-muted-foreground">
                                {formatPrice(item.totalPrice)} each
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 bg-muted rounded-full p-0.5 border border-border/50">
                              <button 
                                onClick={() => {
                                  haptics.light();
                                  if (item.quantity > 1) {
                                    updateQuantity(item.id, item.quantity - 1);
                                  } else {
                                    removeItem(item.id);
                                  }
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-background text-foreground hover:bg-white shadow-sm transition-all active:scale-95"
                                title={item.quantity > 1 ? "Decrease quantity" : "Remove item"}
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-sm font-bold text-foreground">{item.quantity}</span>
                              <button 
                                onClick={() => {
                                  haptics.light();
                                  updateQuantity(item.id, item.quantity + 1);
                                }}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#E6411C] text-white hover:bg-[#d13a18] shadow-sm transition-all active:scale-95"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Edit Button (Combos only) */}
                            {item.type === 'combo' && (
                                <button
                                    onClick={() => navigate('/menu', { state: { editItem: item } })}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100 active:scale-95"
                                    title="Edit Combo"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                  
                  return (
                    <div key={item.id} className="group">
                      {/* Mobile: Swipeable | Desktop: Regular */}
                      <div className="lg:hidden">
                        <SwipeableItem 
                          onDelete={() => {
                            removeItem(item.id);
                            toast.success('Item removed');
                          }}
                        >
                          {itemContent}
                        </SwipeableItem>
                      </div>
                      <div className="hidden lg:block">
                        {itemContent}
                      </div>
                      {index < state.items.length - 1 && (
                        <div className="h-px bg-border/40 w-full mt-6" />
                      )}
                    </div>
                  );
                })}
              </div>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-[#212282] font-medium hover:text-[#E6411C] transition-colors py-2"
              >
                <Plus className="w-4 h-4" />
                Add More Items
              </Link>
              
               {/* Mobile: Promo & Summary */}
               <div className="lg:hidden space-y-6 pt-6 border-t border-border">
                  {/* Promo Code - Mobile */}
                  <div className="md:max-w-lg md:mx-auto w-full">
                    <h4 className="text-sm font-bold text-[#212282] mb-3">Promo Code</h4>
                    {promoResult?.valid ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <CheckCircle className="w-4 h-4 text-green-700 shrink-0" />
                          <span className="text-sm font-semibold text-green-800 truncate">
                            {promoResult.code} ({promoResult.message})
                          </span>
                        </div>
                        <button onClick={handleRemovePromo} className="text-green-600 p-1"><X className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <div className="flex w-full items-center rounded-xl bg-gray-50 border border-gray-100 p-1 pl-3 transition-all">
                        <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Discount code"
                          className="flex-1 min-w-0 bg-transparent border-none text-foreground text-sm focus:ring-0 p-2"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="px-4 py-2 bg-[#212282] text-white rounded-lg text-sm font-bold hover:bg-[#1a1a6e]"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Payment Summary - Mobile */}
                  <div className="bg-muted/10 p-5 rounded-xl border border-border/50 md:max-w-lg md:mx-auto">
                    <h4 className="text-sm font-bold text-[#212282] mb-4">Payment Summary</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground font-bold">{formatPrice(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery Fee</span>
                        <span className="text-foreground font-bold">
                          {qualifiesForFreeDelivery || (promoResult?.valid && promoResult.discountType === 'free_delivery') ? (
                            <span className="text-green-600">FREE</span>
                          ) : selectedZone ? (
                            formatPrice(baseDeliveryFee)
                          ) : (
                            <span className="text-xs text-orange-500">Select zone below</span>
                          )}
                        </span>
                      </div>
                      {promoResult?.valid && promoResult.discountType !== 'free_delivery' && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span className="font-bold">-{formatPrice(discount)}</span>
                        </div>
                      )}
                      
                      <div className="border-t border-dashed border-border pt-3 mt-3 flex justify-between items-end">
                        <span className="text-foreground font-bold">Total</span>
                        <span className="text-[#212282] font-black text-2xl">{formatPrice(total)}</span>
                      </div>
                    </div>
                  </div>
               </div>

              {/* Delivery Form Toggle - Mobile */}
              <div className="lg:hidden mt-2 md:max-w-lg md:mx-auto w-full">
                <button
                  onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#212282]/5 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#212282]" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-[#212282]">Delivery Details</p>
                      <p className="text-xs text-gray-500">
                        {selectedZone ? `${selectedZone} • ${state.userPreferences.name || 'Details added'}` : 'Required to checkout'}
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
                  <div id="delivery-form" className="mt-4 p-5 bg-white rounded-xl border border-gray-200 space-y-5 shadow-sm animate-in slide-in-from-top-2">
                    {/* Re-using the same inputs as desktop but in a mobile container */}
                     {/* 1. Name */}
                     <div>
                      <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={state.userPreferences.name}
                        onChange={(e) => {
                          setUserPreferences({ name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: '' });
                        }}
                        placeholder="e.g. John Doe"
                        className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-sm focus:ring-[#212282]`}
                      />
                    </div>

                    {/* 2. Phone */}
                     <div>
                      <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">
                        Phone Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-100 text-gray-500 text-sm font-medium">
                          🇺🇬 +256
                        </span>
                        <input
                          type="tel"
                          value={state.userPreferences.phone}
                          onChange={(e) => {
                            setUserPreferences({ phone: e.target.value });
                            if (errors.phone) setErrors({ ...errors, phone: '' });
                          }}
                          placeholder="700 123 456"
                          className={`flex-1 p-3 rounded-r-lg border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-sm focus:ring-[#212282]`}
                        />
                      </div>
                    </div>

                    {/* 3. Delivery Location - Combined Address & Zone */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">
                        Delivery Location
                      </label>
                      
                      {/* Address Search */}
                      <div className="relative">
                         <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={addressQuery}
                            onChange={(e) => {
                                setAddressQuery(e.target.value);
                                setUserPreferences({ address: e.target.value });
                                setShowAddressSuggestions(true);
                                if(errors.address) setErrors({...errors, address: ''});
                            }}
                            onFocus={() => setShowAddressSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                            placeholder="Type your address or area..."
                            className={`w-full pl-9 p-3 rounded-lg border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'} text-sm`}
                          />
                          {isSearchingAddress && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-primary" />}
                          
                          {/* Suggestions (Mobile) */}
                          {showAddressSuggestions && addressSuggestions.length > 0 && (
                            <div className="absolute z-20 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
                              {addressSuggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => { e.preventDefault(); handleAddressSelect(suggestion); }}
                                  className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-none ${
                                    !suggestion.isInKampalaArea ? 'bg-red-50/50' : suggestion.distanceToZone > 5 ? 'bg-amber-50/50' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${
                                      !suggestion.isInKampalaArea ? 'text-red-500' : suggestion.nearestZone ? 'text-green-600' : 'text-amber-500'
                                    }`} />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                                      <p className="text-xs text-gray-500 truncate">{suggestion.displayName}</p>
                                      
                                      {/* Coverage Status Badge */}
                                      {!suggestion.isInKampalaArea ? (
                                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                          <X className="w-3 h-3" />
                                          Outside delivery area
                                        </span>
                                      ) : suggestion.nearestZone ? (
                                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                          <Truck className="w-3 h-3" />
                                          {suggestion.nearestZone.name}
                                        </span>
                                      ) : suggestion.distanceToZone > 5 ? (
                                        <span className="inline-flex items-center gap-1 mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                          <AlertTriangle className="w-3 h-3" />
                                          ~{Math.round(suggestion.distanceToZone)}km away
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                      </div>

                      {/* Coverage Warning - Mobile */}
                      {coverageWarning.show && (
                        <div className={`p-3 rounded-lg border flex items-start gap-2 ${
                          coverageWarning.type === 'out-of-area' 
                            ? 'bg-red-50 border-red-200' 
                            : 'bg-amber-50 border-amber-200'
                        }`}>
                           <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                             coverageWarning.type === 'out-of-area' ? 'bg-red-100' : 'bg-amber-100'
                           }`}>
                             {coverageWarning.type === 'out-of-area' ? (
                               <X className="w-3.5 h-3.5 text-red-600" />
                             ) : (
                               <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                             )}
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className={`text-xs font-medium ${
                               coverageWarning.type === 'out-of-area' ? 'text-red-800' : 'text-amber-800'
                             }`}>
                               {coverageWarning.type === 'out-of-area' ? 'Outside Delivery Area' : 'Limited Coverage'}
                             </p>
                             <p className={`text-[11px] mt-0.5 ${
                               coverageWarning.type === 'out-of-area' ? 'text-red-600' : 'text-amber-600'
                             }`}>
                               {coverageWarning.message}
                             </p>
                             <button 
                               onClick={() => {
                                 setCoverageWarning({ show: false, type: null });
                                 setAddressQuery('');
                                 setUserPreferences({ address: '' });
                               }}
                               className={`text-[11px] font-medium mt-1.5 underline ${
                                 coverageWarning.type === 'out-of-area' ? 'text-red-700' : 'text-amber-700'
                               }`}
                             >
                               Try a different address
                             </button>
                           </div>
                        </div>
                      )}

                      {/* Zone Display - Smart Auto-Detection */}
                      {!coverageWarning.show && selectedZone ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm text-green-800 font-bold">{selectedZone}</p>
                                <p className="text-xs text-green-600">
                                  {formatPrice(selectedZoneData?.fee || 0)} • {selectedZoneData?.estimatedTime}
                                </p>
                              </div>
                           </div>
                           <button 
                             onClick={() => setShowZoneOverride(!showZoneOverride)} 
                             className="text-xs font-medium text-green-700 hover:text-green-800 px-2.5 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                           >
                             Change
                           </button>
                        </div>
                      ) : !coverageWarning.show && !selectedZone && addressQuery.length > 3 ? (
                        // Address entered but no zone detected - show manual selector
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                           <p className="text-xs text-gray-600 mb-2">
                             Couldn't auto-detect zone. Please select manually:
                           </p>
                           <select 
                              value={selectedZone}
                              onChange={(e) => { 
                                setSelectedZone(e.target.value); 
                                setUserPreferences({ location: e.target.value });
                                if(errors.zone) setErrors({...errors, zone:''}); 
                              }}
                              className={`w-full p-2.5 rounded-lg border ${errors.zone ? 'border-red-500' : 'border-gray-300'} bg-white text-sm`}
                           >
                             <option value="">Choose zone...</option>
                             {deliveryZones.map(z => (
                               <option key={z.name} value={z.name}>
                                 {z.name} — {formatPrice(z.fee)} ({z.estimatedTime})
                               </option>
                             ))}
                           </select>
                        </div>
                      ) : !coverageWarning.show && !addressQuery ? (
                        // No address entered yet - prompt to enter
                        <p className="text-xs text-gray-500 italic">
                          Enter your address above to auto-detect delivery zone
                        </p>
                      ) : null}
                      
                      {/* Zone Override Dropdown (only shown when Change is clicked) */}
                      {showZoneOverride && selectedZone && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2">
                           <p className="text-xs text-gray-600 mb-2">Select a different zone:</p>
                           <select 
                              value={selectedZone}
                              onChange={(e) => { 
                                setSelectedZone(e.target.value); 
                                setUserPreferences({ location: e.target.value });
                                setShowZoneOverride(false);
                              }}
                              className="w-full p-2.5 rounded-lg border border-gray-300 bg-white text-sm"
                           >
                             {deliveryZones.map(z => (
                               <option key={z.name} value={z.name}>
                                 {z.name} — {formatPrice(z.fee)} ({z.estimatedTime})
                               </option>
                             ))}
                           </select>
                        </div>
                      )}
                    </div>
                    
                    {/* Special Instructions - Mobile */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">
                        Special Instructions
                      </label>
                      <textarea
                        value={state.userPreferences.specialInstructions || ''}
                        onChange={(e) => setUserPreferences({ specialInstructions: e.target.value })}
                        placeholder="E.g., Extra sauce, no onions, call on arrival..."
                        rows={2}
                        className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm resize-none focus:ring-[#212282]"
                      />
                    </div>
                    
                    {/* Promo Code - Mobile */}
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1.5 block uppercase tracking-wide">
                        Promo Code
                      </label>
                      {promoResult?.valid ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                          <span className="text-sm font-bold text-green-700">{promoResult.code} Applied</span>
                          <button onClick={handleRemovePromo} className="p-1 hover:bg-green-100 rounded transition-colors">
                            <X className="w-4 h-4 text-green-600"/>
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 p-3 rounded-lg border border-gray-200 bg-gray-50 text-sm uppercase"
                          />
                          <button 
                            onClick={handleApplyPromo} 
                            className="px-4 bg-[#212282] text-white rounded-lg font-bold text-sm hover:bg-[#1a1a6e] transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Mobile Estimated Delivery */}
                    {selectedZone && (
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg py-2.5 mt-2">
                        <Truck className="w-4 h-4 text-secondary" />
                        <span>Est. delivery: <span className="font-medium text-foreground">{getEstimatedDeliveryTime(selectedZone)}</span></span>
                      </div>
                    )}
                    
                    {/* Mobile Order Summary & Buttons */}
                    <div className="mt-6 pt-5 border-t border-gray-200">
                      {/* Order Totals */}
                      <div className="space-y-2.5 mb-5">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                          <span className="font-medium">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Delivery</span>
                          <span className="font-medium">
                            {qualifiesForFreeDelivery ? (
                              <span className="flex items-center gap-1.5">
                                <span className="line-through text-gray-400 text-xs">{formatPrice(baseDeliveryFee)}</span>
                                <span className="text-green-600 font-bold">FREE</span>
                              </span>
                            ) : (selectedZone ? formatPrice(baseDeliveryFee) : '-')}
                          </span>
                        </div>
                        {discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span className="font-bold">-{formatPrice(discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-3 border-t border-dashed border-gray-300">
                          <span className="font-bold text-[#212282] text-lg">Total</span>
                          <span className="font-black text-2xl text-[#E6411C]">{formatPrice(total)}</span>
                        </div>
                      </div>
                      
                      {/* Order Buttons */}
                      <div className="space-y-3">
                        <button
                          onClick={handleWhatsAppOrder}
                          disabled={isProcessingPayment}
                          className="w-full bg-[#25D366] text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                        >
                          <WhatsAppIcon className="w-5 h-5" />
                          <span>Order via WhatsApp</span>
                        </button>
                        <button
                          onClick={handleOnlinePayment}
                          disabled={isProcessingPayment}
                          className="w-full bg-[#212282] text-white h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1a1a6e] active:scale-[0.98] transition-all"
                        >
                          {isProcessingPayment ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                          <span>{isProcessingPayment ? 'Processing...' : 'Pay Now'}</span>
                        </button>
                        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 pt-1">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Secure Checkout</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm sticky top-28">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-[#212282]">
                    Order Summary
                  </h2>
                  <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {state.items.length} item{state.items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {!qualifiesForFreeDelivery && (
                  <div className="mb-6 p-4 bg-[#212282] rounded-xl overflow-hidden relative">
                    {/* Pattern Overlay */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10" />
                    
                    <div className="flex justify-between items-start mb-3 relative z-10">
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
                    <div className="flex flex-col gap-2 relative z-10">
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

                {/* Desktop Inputs */}
                <div className="space-y-4 mb-6">
                   <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">Your Name *</label>
                      <input
                        type="text"
                        value={state.userPreferences.name}
                        onChange={(e) => { setUserPreferences({name: e.target.value}); if(errors.name) setErrors({...errors, name:''});}}
                        onBlur={() => setTouched({...touched, name:true})}
                        className={`w-full p-3 rounded-xl border ${errors.name && touched.name ? 'border-red-500 bg-red-50' : 'border-border bg-gray-50'} focus:ring-[#E6411C]`}
                      />
                   </div>
                   <div>
                      <label className="text-sm font-medium text-[#212282] mb-2 block">Phone Number *</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-border bg-gray-100 text-gray-500 text-sm">🇺🇬 +256</span>
                        <input
                          type="tel"
                          value={state.userPreferences.phone}
                          onChange={(e) => { setUserPreferences({phone: e.target.value}); if(errors.phone) setErrors({...errors, phone:''});}}
                          onBlur={() => setTouched({...touched, phone:true})}
                          className={`flex-1 p-3 rounded-r-xl border ${errors.phone && touched.phone ? 'border-red-500 bg-red-50' : 'border-border bg-gray-50'}`}
                        />
                      </div>
                   </div>
                   
                   {/* Delivery Location - Combined Address & Zone */}
                    <div className="space-y-3">
                       <label className="text-sm font-medium text-[#212282] mb-2 block">Delivery Location *</label>
                       
                       {/* Address Search */}
                       <div className="relative">
                          <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            value={addressQuery}
                            onChange={(e) => {
                                setAddressQuery(e.target.value);
                                setUserPreferences({ address: e.target.value });
                                setShowAddressSuggestions(true);
                                if(errors.address) setErrors({...errors, address:''});
                            }}
                            onFocus={() => setShowAddressSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowAddressSuggestions(false), 200)}
                            className={`w-full pl-9 p-3 rounded-xl border ${errors.address && touched.address ? 'border-red-500' : 'border-border bg-gray-50'}`}
                            placeholder="Type your address or area..."
                          />
                          {isSearchingAddress && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-primary" />}
                          
                          {/* Desktop Suggestions */}
                          {showAddressSuggestions && addressSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
                              {addressSuggestions.map((s, i) => (
                                <button 
                                  key={i} 
                                  onClick={(e) => {e.preventDefault(); handleAddressSelect(s);}} 
                                  className={`w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                    !s.isInKampalaArea ? 'bg-red-50/50' : s.distanceToZone > 5 ? 'bg-amber-50/50' : ''
                                  }`}
                                >
                                   <div className="flex items-start gap-2">
                                     <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${
                                       !s.isInKampalaArea ? 'text-red-500' : s.nearestZone ? 'text-green-600' : 'text-amber-500'
                                     }`} />
                                     <div className="min-w-0 flex-1">
                                       <p className="text-sm font-medium text-gray-900">{s.name}</p>
                                       <p className="text-xs text-gray-500 truncate">{s.displayName}</p>
                                       
                                       {/* Coverage Status Badge */}
                                       {!s.isInKampalaArea ? (
                                         <span className="inline-flex items-center gap-1 mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                           <X className="w-3 h-3" />
                                           Outside delivery area
                                         </span>
                                       ) : s.nearestZone ? (
                                         <span className="inline-flex items-center gap-1 mt-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                                           <Truck className="w-3 h-3" />
                                           {s.nearestZone.name} • {formatPrice(s.nearestZone.fee)}
                                         </span>
                                       ) : s.distanceToZone > 5 ? (
                                         <span className="inline-flex items-center gap-1 mt-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                           <AlertTriangle className="w-3 h-3" />
                                           ~{Math.round(s.distanceToZone)}km from zones
                                         </span>
                                       ) : null}
                                     </div>
                                   </div>
                                </button>
                              ))}
                            </div>
                          )}
                       </div>

                       {/* Coverage Warning */}
                       {coverageWarning.show && (
                          <div className={`p-3 rounded-lg border flex items-start gap-2 ${
                            coverageWarning.type === 'out-of-area' 
                              ? 'bg-red-50 border-red-200' 
                              : 'bg-amber-50 border-amber-200'
                          }`}>
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                               coverageWarning.type === 'out-of-area' ? 'bg-red-100' : 'bg-amber-100'
                             }`}>
                               {coverageWarning.type === 'out-of-area' ? (
                                 <X className="w-4 h-4 text-red-600" />
                               ) : (
                                 <AlertTriangle className="w-4 h-4 text-amber-600" />
                               )}
                             </div>
                             <div className="flex-1 min-w-0">
                               <p className={`text-sm font-medium ${
                                 coverageWarning.type === 'out-of-area' ? 'text-red-800' : 'text-amber-800'
                               }`}>
                                 {coverageWarning.type === 'out-of-area' ? 'Outside Delivery Area' : 'Limited Coverage'}
                               </p>
                               <p className={`text-xs mt-0.5 ${
                                 coverageWarning.type === 'out-of-area' ? 'text-red-600' : 'text-amber-600'
                               }`}>
                                 {coverageWarning.message}
                               </p>
                               <button 
                                 onClick={() => {
                                   setCoverageWarning({ show: false, type: null });
                                   setAddressQuery('');
                                   setUserPreferences({ address: '' });
                                 }}
                                 className={`text-xs font-medium mt-2 underline ${
                                   coverageWarning.type === 'out-of-area' ? 'text-red-700' : 'text-amber-700'
                                 }`}
                               >
                                 Try a different address
                               </button>
                             </div>
                          </div>
                       )}

                       {/* Zone Display - Smart Auto-Detection */}
                       {!coverageWarning.show && selectedZone ? (
                          <div className="flex items-center justify-between p-2.5 bg-green-50 rounded-lg border border-green-100">
                             <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-green-700 font-medium">{selectedZone}</p>
                                  <p className="text-[11px] text-green-600">Delivery: {formatPrice(selectedZoneData?.fee || 0)} • {selectedZoneData?.estimatedTime}</p>
                                </div>
                             </div>
                             <button 
                               onClick={() => setShowZoneOverride(true)} 
                               className="text-xs font-medium text-green-700 hover:text-green-800 px-2 py-1 hover:bg-green-100 rounded transition-colors"
                             >
                               Change
                             </button>
                          </div>
                       ) : !coverageWarning.show && !selectedZone && addressQuery.length > 3 ? (
                          <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                             <p className="text-xs text-amber-700 mb-2">Zone not auto-detected. Please select:</p>
                             <select 
                                value={selectedZone}
                                onChange={(e) => { setSelectedZone(e.target.value); if(errors.zone) setErrors({...errors, zone:''}); }}
                                className="w-full p-2.5 rounded-lg border border-amber-200 bg-white text-sm focus:ring-[#E6411C] focus:border-[#E6411C]"
                             >
                               <option value="">Choose zone...</option>
                               {deliveryZones.map(z => (
                                 <option key={z.name} value={z.name}>
                                   {z.name} — {formatPrice(z.fee)} ({z.estimatedTime})
                                 </option>
                               ))}
                             </select>
                          </div>
                       ) : !coverageWarning.show && !addressQuery ? (
                          <p className="text-xs text-muted-foreground text-center py-2">Enter your address above to auto-detect delivery zone</p>
                       ) : null}
                       
                       {/* Zone Override Dropdown */}
                       {showZoneOverride && selectedZone && (
                          <div className="p-3 bg-gray-50 rounded-lg border border-border mt-2">
                             <p className="text-xs text-muted-foreground mb-2">Select a different zone:</p>
                             <select 
                                value={selectedZone}
                                onChange={(e) => { 
                                  setSelectedZone(e.target.value); 
                                  setShowZoneOverride(false);
                                  if(errors.zone) setErrors({...errors, zone:''}); 
                                }}
                                className="w-full p-2.5 rounded-lg border border-border bg-white text-sm focus:ring-[#E6411C] focus:border-[#E6411C]"
                             >
                               {deliveryZones.map(z => (
                                 <option key={z.name} value={z.name}>
                                   {z.name} — {formatPrice(z.fee)} ({z.estimatedTime})
                                 </option>
                               ))}
                             </select>
                          </div>
                       )}
                    </div>
                </div>
                
                {/* Desktop Promo */}
                <div className="mb-4">
                   <label className="text-sm font-medium text-[#212282] mb-2 block">Promo Code</label>
                   {promoResult?.valid ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                        <span className="text-sm font-bold text-green-700">{promoResult.code} Applied</span>
                        <button onClick={handleRemovePromo}><X className="w-4 h-4 text-green-600"/></button>
                      </div>
                   ) : (
                      <div className="flex gap-2">
                         <input 
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                            placeholder="Enter code"
                            className="flex-1 p-2.5 rounded-xl border border-border bg-gray-50 text-sm"
                         />
                         <button onClick={handleApplyPromo} className="px-4 bg-[#212282] text-white rounded-xl font-bold text-sm hover:bg-[#1a1a6e] transition-colors">Apply</button>
                      </div>
                   )}
                </div>
                
                {/* Special Instructions */}
                <div className="mb-6">
                   <label className="text-sm font-medium text-[#212282] mb-2 block">Special Instructions</label>
                   <textarea
                     value={state.userPreferences.specialInstructions || ''}
                     onChange={(e) => setUserPreferences({ specialInstructions: e.target.value })}
                     placeholder="E.g., Extra sauce, no onions, call on arrival..."
                     rows={2}
                     className="w-full p-3 rounded-xl border border-border bg-gray-50 text-sm resize-none focus:ring-[#E6411C] focus:border-[#E6411C]"
                   />
                </div>

                {/* Desktop Totals */}
                <div className="space-y-3 mb-6 pt-4 border-t border-border">
                   <div className="flex justify-between text-sm text-gray-500">
                     <span>Subtotal ({state.items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                     <span>{formatPrice(cartTotal)}</span>
                   </div>
                   <div className="flex justify-between text-sm text-gray-500">
                      <span>Delivery</span>
                      <span className="text-foreground font-semibold">
                         {qualifiesForFreeDelivery ? (
                           <span className="flex items-center gap-1">
                             <span className="line-through text-gray-400 text-xs">{formatPrice(baseDeliveryFee)}</span>
                             <span className="text-green-600">FREE</span>
                           </span>
                         ) : (selectedZone ? formatPrice(baseDeliveryFee) : '-')}
                      </span>
                   </div>
                   {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600"><span>Discount</span><span>-{formatPrice(discount)}</span></div>
                   )}
                   
                   {/* Savings Highlight */}
                   {((qualifiesForFreeDelivery && baseDeliveryFee > 0) || discount > 0) && (
                     <div className="bg-green-50 border border-green-100 rounded-lg p-2.5 flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                         <Tag className="w-3.5 h-3.5 text-green-600" />
                       </div>
                       <p className="text-xs text-green-700 font-medium">
                         You're saving {formatPrice((qualifiesForFreeDelivery ? baseDeliveryFee : 0) + discount)} on this order!
                       </p>
                     </div>
                   )}
                   
                   <div className="flex justify-between pt-3 border-t border-dashed border-gray-300">
                      <span className="font-bold text-[#212282] text-lg">Total</span>
                      <span className="font-extrabold text-2xl text-[#E6411C]">{formatPrice(total)}</span>
                   </div>
                   
                   {/* Estimated Delivery Time */}
                   {selectedZone && (
                     <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg py-2">
                       <Truck className="w-4 h-4 text-secondary" />
                       <span>Est. delivery: <span className="font-medium text-foreground">{getEstimatedDeliveryTime(selectedZone)}</span></span>
                     </div>
                   )}
                </div>

                {/* Desktop Actions */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#25D366] text-white rounded-xl py-3.5 mb-3 flex items-center justify-center gap-2 hover:bg-[#22c55e] transition-colors font-bold shadow-sm"
                >
                  <WhatsAppIcon className="w-5 h-5" /> Order via WhatsApp
                </button>
                <button
                  onClick={handleOnlinePayment}
                  className="w-full bg-[#212282] text-white rounded-xl py-3.5 flex items-center justify-center gap-2 hover:bg-[#1a1a6e] transition-colors font-bold"
                >
                  <CreditCard className="w-5 h-5" /> Pay Now
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400">
                   <Shield className="w-3 h-3" /> Secure Checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
