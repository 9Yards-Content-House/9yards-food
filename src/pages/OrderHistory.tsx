import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Package,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Trash2,
  CreditCard,
  MapPin,
  UtensilsCrossed,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import Header from '@/components/layout/Header';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import Footer from '@/components/layout/Footer';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import PageHeader from '@/components/layout/PageHeader';
import OptimizedImage from '@/components/ui/optimized-image';
import { useCart, OrderHistoryItem, CartItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/order';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { toast } from 'sonner';
import { menuData } from '@/data/menu';

const INITIAL_ORDERS_SHOWN = 5; // Show 5 orders initially

export default function OrderHistory() {
  const { orderHistory, clearOrderHistory, addItem } = useCart();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  
  // Determine which orders to display
  const visibleOrders = showAllOrders 
    ? orderHistory 
    : orderHistory.slice(0, INITIAL_ORDERS_SHOWN);
  const hiddenOrdersCount = orderHistory.length - INITIAL_ORDERS_SHOWN;

  const handleReorder = (order: OrderHistoryItem) => {
    // Add each item from the order to cart, preserving their original type
    order.items.forEach(item => {
      // Create a new item with proper structure based on type
      const cartItem = {
        ...item,
        // Generate new unique ID for combos, or use existing logic for singles
        id: item.type === 'combo' 
          ? `combo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          : item.id, // Preserve single item ID for proper deduplication
      };
      
      addItem(cartItem);
    });
    toast.success(`${order.items.length} item(s) added to cart!`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMethodBadge = (method: OrderHistoryItem['paymentMethod']) => {
    if (method === 'online') {
      return {
        label: 'Paid Online',
        className: 'text-blue-700 bg-blue-50 border-blue-100',
        icon: CreditCard
      };
    }
    return {
      label: 'WhatsApp Order',
      className: 'text-green-700 bg-green-50 border-green-100',
      icon: WhatsAppIcon
    };
  };

  const handleTrackOrder = (orderId: string) => {
    const message = encodeURIComponent(
      `Hi! I'd like to track my order.\n\nOrder ID: ${orderId}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

// Helper to get up to 4 images for the collage
  const getOrderImages = (order: OrderHistoryItem) => {
    const images: string[] = [];
    const seen = new Set<string>();

    const addImage = (src?: string) => {
      if (src && !seen.has(src)) {
        seen.add(src);
        images.push(src);
      }
    };

    // Helper to extract the raw item ID from prefixed cart IDs like "lusaniya-ordinary-lusaniya" -> "ordinary-lusaniya"
    const getRawItemId = (cartItemId: string) => {
      // Check for known category prefixes and strip them
      const prefixes = ['lusaniya-', 'juice-', 'dessert-', 'side-', 'main-'];
      for (const prefix of prefixes) {
        if (cartItemId.startsWith(prefix)) {
          return cartItemId.substring(prefix.length);
        }
      }
      return cartItemId;
    };

    // Iterate through items to collect images
    for (const item of order.items) {
      // Get the raw ID for lookups (strip category prefix if present)
      const rawId = getRawItemId(item.id);
      const itemName = item.mainDishes?.[0] || '';
      
      // 0. Explicit Lookup by ID or Name (Handles all Single Items: Lusaniya, Juices, Desserts, Sides)
      
      const lusaniya = menuData.lusaniya.find(l => l.id === rawId || l.id === item.id || l.name === itemName);
      if (lusaniya?.image) { addImage(lusaniya.image); }

      const juice = menuData.juices.find(j => j.id === rawId || j.id === item.id || j.name === itemName);
      if (juice?.image) { addImage(juice.image); }

      const dessert = menuData.desserts.find(d => d.id === rawId || d.id === item.id || d.name === itemName);
      if (dessert?.image) { addImage(dessert.image); }
      
      const side = menuData.sideDishes.find(s => s.id === rawId || s.id === item.id || s.name === itemName);
      if (side?.image) { addImage(side.image); }
      
      // Also check main dishes just in case it was a bare main dish added as single (unlikely but safe)
      const main = menuData.mainDishes.find(m => m.id === rawId || m.id === item.id);
      if (main?.image) { addImage(main.image); }

      // 1. Main Dishes (Combos)
      if (item.mainDishes) {
        item.mainDishes.forEach(mainName => {
           const dish = menuData.mainDishes.find(d => d.name === mainName);
           if (dish?.image) addImage(dish.image);
        });
      }

      // 2. Main Sauce Image (Combo) or Item Image (Single - fallback)
      if (item.sauce?.image) addImage(item.sauce.image);
      if (item.image) addImage(item.image);

      // 3. Side Dish Image
      if (item.sideDish) {
        const side = menuData.sideDishes.find(s => s.name === item.sideDish || s.id === item.sideDish);
        if (side?.image) addImage(side.image);
      }

      // 4. Extras
      if (item.extras) {
        for (const extra of item.extras) {
          const juice = menuData.juices.find(j => j.id === extra.id);
          if (juice?.image) addImage(juice.image);
          
          const dessert = menuData.desserts.find(d => d.id === extra.id);
          if (dessert?.image) addImage(dessert.image);
        }
      }
    }

    return images;
  };

  // Helper to get detailed item info for expanded view
  interface OrderItemDetail {
    id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    type: 'combo' | 'single';
    description?: string;
    // Combo-specific details
    comboDetails?: {
      mainDishes: string[];
      sauce?: { name: string; preparation?: string };
      sideDish?: string;
      extras?: { name: string; quantity: number }[];
    };
  }

  const getOrderItemDetails = (order: OrderHistoryItem): OrderItemDetail[] => {
    const details: OrderItemDetail[] = [];

    // Helper to extract raw ID
    const getRawItemId = (cartItemId: string) => {
      const prefixes = ['lusaniya-', 'juice-', 'dessert-', 'side-', 'main-'];
      for (const prefix of prefixes) {
        if (cartItemId.startsWith(prefix)) {
          return cartItemId.substring(prefix.length);
        }
      }
      return cartItemId;
    };

    for (const item of order.items) {
      const rawId = getRawItemId(item.id);
      let image = '';
      let name = item.mainDishes?.join(' + ') || 'Item';
      let description = '';
      let comboDetails: OrderItemDetail['comboDetails'] = undefined;

      // Try to find image based on item type
      if (item.type === 'combo') {
        // For combos, use sauce image or first main dish image
        if (item.sauce?.image) {
          image = item.sauce.image;
        } else if (item.mainDishes?.[0]) {
          const dish = menuData.mainDishes.find(d => d.name === item.mainDishes[0]);
          if (dish?.image) image = dish.image;
        }
        
        // Build combo name from sauce
        name = item.sauce?.name ? `${item.sauce.name} Combo` : `${item.mainDishes?.join(' + ')} Combo`;
        
        // Store detailed combo info
        comboDetails = {
          mainDishes: item.mainDishes || [],
          sauce: item.sauce ? { 
            name: item.sauce.name, 
            preparation: item.sauce.preparation 
          } : undefined,
          sideDish: item.sideDish || undefined,
          extras: item.extras?.length > 0 ? item.extras.map(e => ({ 
            name: e.name, 
            quantity: e.quantity 
          })) : undefined
        };
      } else {
        // Single items - look up in menu data
        // Try by ID first, then by name from mainDishes
        const itemName = item.mainDishes?.[0] || '';
        
        const lusaniya = menuData.lusaniya.find(l => 
          l.id === rawId || l.id === item.id || l.name === itemName
        );
        if (lusaniya) {
          image = lusaniya.image;
          name = lusaniya.name;
          description = lusaniya.description;
        }

        const juice = menuData.juices.find(j => 
          j.id === rawId || j.id === item.id || j.name === itemName
        );
        if (juice) {
          image = juice.image;
          name = juice.name;
          description = juice.description;
        }

        const dessert = menuData.desserts.find(d => 
          d.id === rawId || d.id === item.id || d.name === itemName
        );
        if (dessert) {
          image = dessert.image;
          name = dessert.name;
          description = dessert.description;
        }
        
        const side = menuData.sideDishes.find(s => 
          s.id === rawId || s.id === item.id || s.name === itemName
        );
        if (side) {
          image = side.image;
          name = side.name;
          description = side.description;
        }

        // Fallback to item properties
        if (!image && item.image) image = item.image;
        if (!name || name === 'Item') name = itemName || 'Item';
        if (!description && item.description) description = item.description;
      }

      details.push({
        id: item.id,
        name,
        image,
        price: item.totalPrice,
        quantity: item.quantity,
        type: item.type,
        description,
        comboDetails
      });
    }

    return details;
  };

  const toggleExpanded = (orderId: string) => {
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  if (orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <SEO 
          title={pageMetadata.orderHistory.title}
          description={pageMetadata.orderHistory.description}
          url={pageMetadata.orderHistory.canonicalUrl}
          noIndex={pageMetadata.orderHistory.noIndex}
        />
        <Header />
        <main className="pt-16 md:pt-20">
          <div className="container-custom section-padding text-center">
            <div className="max-w-md mx-auto py-12">
              <div className="w-32 h-32 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-secondary/10">
                <UtensilsCrossed className="w-12 h-12 text-secondary/50" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                No Orders Yet
              </h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Looks like you haven't indulged in our authentic cuisine yet. Time to change that?
              </p>
              <Link to="/menu" className="btn-secondary inline-flex items-center gap-2 px-8 py-3 text-lg">
                Explore Menu
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
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title={pageMetadata.orderHistory.title}
        description={pageMetadata.orderHistory.description}
        url={pageMetadata.orderHistory.canonicalUrl}
        noIndex={pageMetadata.orderHistory.noIndex}
      />
      <Header />

      <main className="pt-16 md:pt-20">
        <PageHeader 
          title="Order History"
          description="Track your current orders or reorder your past favorites in seconds."
        />

        <div className="container-custom px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              <span>Past Orders <span className="text-muted-foreground font-normal">({orderHistory.length})</span></span>
            </h2>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all order history?')) {
                  clearOrderHistory();
                  toast.success('Order history cleared');
                }
              }}
              className="text-[11px] sm:text-xs md:text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-destructive/5 border border-transparent hover:border-destructive/20"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden xs:inline">Clear</span> History
            </button>
          </div>

          <div className="grid gap-5 sm:gap-6 md:gap-7 max-w-4xl mx-auto">
            {visibleOrders.map((order) => {
              const badge = getMethodBadge(order.paymentMethod);
              const BadgeIcon = badge.icon;
              const orderImages = getOrderImages(order);
              const isExpanded = expandedOrderId === order.orderId;
              const itemDetails = isExpanded ? getOrderItemDetails(order) : [];
              
              return (
                <div
                  key={order.orderId}
                  className="card-premium group overflow-hidden border border-border/60 hover:border-secondary/30 transition-all duration-300"
                >
                  <div className="flex flex-row md:flex-row">
                    {/* Visual Side (Left) - Clickable for expand */}
                    {/* Image Collage - Hidden on mobile, visible on sm+ */}
                    <button
                      onClick={() => toggleExpanded(order.orderId)}
                      className="hidden sm:block w-36 md:w-44 lg:w-52 bg-secondary/5 shrink-0 relative border-r border-border/50 cursor-pointer group/img overflow-hidden"
                      title="Click to see order items"
                    >
                      {orderImages.length > 0 ? (
                        orderImages.length === 1 ? (
                          <OptimizedImage 
                            src={orderImages[0]} 
                            alt="Order Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                          />
                        ) : orderImages.length === 2 ? (
                          /* 2 images: Side by side layout */
                          <div className="grid grid-cols-2 w-full h-full">
                            {orderImages.map((img, i) => (
                              <div key={i} className="relative overflow-hidden border-[0.5px] border-white/20">
                                <OptimizedImage 
                                  src={img} 
                                  alt={`Item ${i+1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        ) : orderImages.length === 3 ? (
                          /* 3 images: 1 large on left, 2 stacked on right */
                          <div className="grid grid-cols-2 w-full h-full">
                            {/* Large image on left */}
                            <div className="relative overflow-hidden border-[0.5px] border-white/20">
                              <OptimizedImage 
                                src={orderImages[0]} 
                                alt="Item 1"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {/* 2 stacked images on right */}
                            <div className="grid grid-rows-2 h-full">
                              {orderImages.slice(1, 3).map((img, i) => (
                                <div key={i} className="relative overflow-hidden border-[0.5px] border-white/20">
                                  <OptimizedImage 
                                    src={img} 
                                    alt={`Item ${i+2}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          /* 4+ images: 2x2 grid */
                          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            {orderImages.slice(0, 4).map((img, i) => (
                              <div key={i} className="relative overflow-hidden border-[0.5px] border-white/20">
                                <OptimizedImage 
                                  src={img} 
                                  alt={`Item ${i+1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary/20">
                           <ShoppingBag className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                      )}
                      
                      {/* Expand indicator overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-2 transition-opacity ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover/img:opacity-100'}`}>
                        <span className="flex items-center gap-1 text-white text-[10px] sm:text-xs font-medium bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3" />
                              <span className="hidden sm:inline">Collapse</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              <span className="hidden sm:inline">View Items</span>
                            </>
                          )}
                        </span>
                      </div>
                    </button>

                    {/* Content Side (Right) - Better padding and spacing */}
                    <div className="flex-1 p-4 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between min-w-0">
                      {/* Detailed Header Row */}
                      <div className="mb-3 sm:mb-3 md:mb-4">
                         <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2 sm:gap-3">
                              {/* Order ID Tag */}
                              <span className="font-mono text-xs sm:text-[11px] md:text-sm font-bold text-foreground bg-muted px-2.5 py-1 rounded-lg border border-border/60">
                                #{order.orderId.slice(-6).toUpperCase()}
                              </span>
                              {/* Date for Tablet+ */}
                              <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                                 {formatDate(order.orderDate)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 sm:gap-3">
                                {/* Desktop Badge Position */}
                                <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${badge.className}`}>
                                    <BadgeIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    {badge.label}
                                </span>
                                <span className="block text-lg sm:text-lg md:text-xl font-bold text-secondary">
                                  {formatPrice(order.total)}
                                </span>
                            </div>
                         </div>
                         
                         {/* Mobile-only date line & Badge */}
                         <div className="flex items-center justify-between sm:hidden mb-3">
                            <span className="text-xs text-muted-foreground">
                               {formatDate(order.orderDate)}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${badge.className}`}>
                                <BadgeIcon className="w-3 h-3" />
                                {badge.label}
                            </span>
                         </div>

                         {/* Items List (Wrapped) */}
                         <div className="text-[13px] sm:text-sm text-foreground/90 line-clamp-2 leading-relaxed">
                            {order.items.map((item, idx) => (
                               <span key={idx} className="mr-1.5 sm:mr-2 inline-block">
                                  <span className="font-bold text-secondary">
                                    {item.quantity}x
                                  </span>{' '}
                                  <span className="text-foreground">{item.mainDishes?.join(' + ') || item.name}</span>
                                  {idx < order.items.length - 1 && <span className="text-muted-foreground/50 ml-1.5">·</span>}
                               </span>
                            ))}
                         </div>
                         
                         {/* Mobile-only: View Items button (since collage is hidden) */}
                         <button
                           onClick={() => toggleExpanded(order.orderId)}
                           className="sm:hidden mt-2 text-[11px] text-secondary font-medium flex items-center gap-1 hover:underline"
                         >
                           {isExpanded ? (
                             <>
                               <ChevronUp className="w-3.5 h-3.5" />
                               Hide details
                             </>
                           ) : (
                             <>
                               <ChevronDown className="w-3.5 h-3.5" />
                               {order.items.length === 1 ? 'View details' : `View ${order.items.length} items`}
                             </>
                           )}
                         </button>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-3 mt-auto pt-4 md:pt-4 border-t border-dashed border-border/50">
                        {/* Location - visible on all devices */}
                        <div className="flex items-center gap-2 text-[13px] sm:text-sm text-muted-foreground sm:mr-auto">
                            <MapPin className="w-4 h-4 text-secondary/60 shrink-0" />
                            <span className="line-clamp-1">{order.deliveryLocation}</span>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                           <button
                             onClick={() => handleTrackOrder(order.orderId)}
                             className="flex-1 sm:flex-none h-9 sm:h-10 md:h-11 text-xs md:text-sm font-semibold text-foreground hover:text-green-700 border border-border/80 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 shadow-sm"
                           >
                             <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                             Track
                           </button>
                           <button
                             onClick={() => handleReorder(order)}
                             className="flex-1 sm:flex-none h-9 sm:h-10 md:h-11 text-xs md:text-sm font-bold bg-[#E6411C] hover:bg-[#d13a17] text-white rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 shadow-sm shadow-orange-500/20 transition-all active:scale-[0.98]"
                           >
                             <RefreshCw className="w-4 h-4" />
                             Reorder
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Items Section */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="border-t border-border/50 bg-muted/30 p-3 md:p-4">
                      {/* Header with close button */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs md:text-sm font-semibold text-foreground flex items-center gap-2">
                          <Package className="w-4 h-4 text-secondary" />
                          Order Items ({order.items.length})
                        </h4>
                        <button
                          onClick={() => setExpandedOrderId(null)}
                          className="p-1.5 hover:bg-background rounded-full transition-colors text-muted-foreground hover:text-foreground"
                          title="Close"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Horizontal scrollable items */}
                      <div className="overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        <div className="flex gap-3 md:gap-4">
                          {itemDetails.map((item, idx) => (
                            <div 
                              key={idx}
                              className={`flex-shrink-0 bg-background rounded-xl border border-border/60 overflow-hidden shadow-sm hover:shadow-md hover:border-secondary/30 transition-all ${
                                item.type === 'combo' 
                                  ? 'w-[180px] sm:w-[200px] md:w-[220px]' 
                                  : 'w-[140px] sm:w-[160px] md:w-[180px]'
                              }`}
                            >
                              {/* Item Image */}
                              <div className={`w-full bg-muted relative overflow-hidden ${
                                item.type === 'combo' ? 'aspect-[4/3]' : 'aspect-square'
                              }`}>
                                {item.image ? (
                                  <OptimizedImage 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                    <UtensilsCrossed className="w-8 h-8" />
                                  </div>
                                )}
                                
                                {/* Quantity badge */}
                                {item.quantity > 1 && (
                                  <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                    ×{item.quantity}
                                  </span>
                                )}
                                
                                {/* Type badge */}
                                <span className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                                  item.type === 'combo' 
                                    ? 'bg-purple-100 text-purple-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.type === 'combo' ? 'Combo' : 'Single'}
                                </span>
                              </div>
                              
                              {/* Item Details */}
                              <div className="p-2.5 md:p-3">
                                <h5 className="font-semibold text-foreground text-xs md:text-sm leading-tight line-clamp-2 mb-1.5">
                                  {item.name}
                                </h5>
                                
                                {/* Combo breakdown */}
                                {item.type === 'combo' && item.comboDetails && (
                                  <div className="space-y-1 mb-2">
                                    {/* Base/Starch */}
                                    {item.comboDetails.mainDishes.length > 0 && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase shrink-0 w-8">Base</span>
                                        <span className="text-[10px] md:text-xs text-foreground/80 leading-tight">
                                          {item.comboDetails.mainDishes.join(' + ')}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {/* Sauce/Protein with preparation */}
                                    {item.comboDetails.sauce && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase shrink-0 w-8">Sauce</span>
                                        <span className="text-[10px] md:text-xs text-foreground/80 leading-tight">
                                          {item.comboDetails.sauce.name}
                                          {item.comboDetails.sauce.preparation && (
                                            <span className="text-muted-foreground"> ({item.comboDetails.sauce.preparation})</span>
                                          )}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {/* Side dish */}
                                    {item.comboDetails.sideDish && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase shrink-0 w-8">Side</span>
                                        <span className="text-[10px] md:text-xs text-foreground/80 leading-tight">
                                          {item.comboDetails.sideDish}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {/* Extras (juices, desserts) */}
                                    {item.comboDetails.extras && item.comboDetails.extras.length > 0 && (
                                      <div className="flex items-start gap-1.5">
                                        <span className="text-[9px] font-semibold text-muted-foreground uppercase shrink-0 w-8">+Add</span>
                                        <span className="text-[10px] md:text-xs text-foreground/80 leading-tight">
                                          {item.comboDetails.extras.map(e => 
                                            e.quantity > 1 ? `${e.name} ×${e.quantity}` : e.name
                                          ).join(', ')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Single item description */}
                                {item.type === 'single' && item.description && (
                                  <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1 mb-1.5">
                                    {item.description}
                                  </p>
                                )}
                                
                                <p className="text-secondary font-bold text-sm md:text-base">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Scroll hint for mobile */}
                      {itemDetails.length > 2 && (
                        <p className="text-[10px] text-muted-foreground text-center mt-2 md:hidden">
                          ← Swipe to see more →
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Show More / Show Less Button */}
          {orderHistory.length > INITIAL_ORDERS_SHOWN && (
            <div className="max-w-4xl mx-auto mt-6 md:mt-8">
              <button
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="w-full py-3 px-4 rounded-xl border border-border/60 bg-background hover:bg-muted/50 hover:border-secondary/30 transition-all flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground group"
              >
                {showAllOrders ? (
                  <>
                    <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                    Show {hiddenOrdersCount} older order{hiddenOrdersCount > 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

    </div>
  );
}
