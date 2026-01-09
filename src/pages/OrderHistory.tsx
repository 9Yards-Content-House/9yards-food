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
  UtensilsCrossed
} from 'lucide-react';
import Header from '@/components/layout/Header';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import Footer from '@/components/layout/Footer';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import PageHeader from '@/components/layout/PageHeader';
import OptimizedImage from '@/components/ui/optimized-image';
import { useCart, OrderHistoryItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/order';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { toast } from 'sonner';
import { menuData } from '@/data/menu';

export default function OrderHistory() {
  const { orderHistory, clearOrderHistory, addItem } = useCart();

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

    // Iterate through items to collect images
    for (const item of order.items) {
      // 0. Explicit Lookup by ID (Handles all Single Items: Lusaniya, Juices, Desserts, Sides)
      // We do this unconditionally because combo IDs (generated) won't match these static IDs anyway.
      // This catches case where type might be missing or logic was ambiguous.
      
      const lusaniya = menuData.lusaniya.find(l => l.id === item.id);
      if (lusaniya?.image) { addImage(lusaniya.image); }

      const juice = menuData.juices.find(j => j.id === item.id);
      if (juice?.image) { addImage(juice.image); }

      const dessert = menuData.desserts.find(d => d.id === item.id);
      if (dessert?.image) { addImage(dessert.image); }
      
      const side = menuData.sideDishes.find(s => s.id === item.id);
      if (side?.image) { addImage(side.image); }
      
      // Also check main dishes just in case it was a bare main dish added as single (unlikely but safe)
      const main = menuData.mainDishes.find(m => m.id === item.id);
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

        <div className="container-custom py-8 md:py-12">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
              Past Orders ({orderHistory.length})
            </h2>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all order history?')) {
                  clearOrderHistory();
                  toast.success('Order history cleared');
                }
              }}
              className="text-xs md:text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-destructive/5 border border-transparent hover:border-destructive/20"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Clear History
            </button>
          </div>

          <div className="grid gap-4 md:gap-6 max-w-4xl mx-auto">
            {orderHistory.map((order) => {
              const badge = getMethodBadge(order.paymentMethod);
              const BadgeIcon = badge.icon;
              const orderImages = getOrderImages(order);
              
              return (
                <div
                  key={order.orderId}
                  className="card-premium group overflow-hidden border border-border/60 hover:border-secondary/30 transition-all duration-300"
                >
                  <div className="flex flex-row md:flex-row h-full">
                    {/* Visual Side (Left) - Optimized widths */}
                    <div className="w-28 sm:w-40 md:w-56 bg-secondary/5 shrink-0 relative border-r border-border/50">
                      {orderImages.length > 0 ? (
                        orderImages.length === 1 ? (
                          <OptimizedImage 
                            src={orderImages[0]} 
                            alt="Order Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            {/* Fill 4 slots, repeating images if necessary to create a full collage */}
                            {Array.from({ length: 4 }).map((_, i) => (
                              <div key={i} className="relative overflow-hidden border-[0.5px] border-white/20">
                                <OptimizedImage 
                                  src={orderImages[i % orderImages.length]} 
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
                    </div>

                    {/* Content Side (Right) - Better padding and spacing */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-between min-w-0">
                      {/* Detailed Header Row */}
                      <div className="mb-3 md:mb-5">
                         <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {/* Order ID Tag */}
                              <span className="font-mono text-[11px] md:text-sm font-bold text-muted-foreground bg-muted/80 px-2 py-1 rounded-md border border-border/50">
                                #{order.orderId.slice(-6).toUpperCase()}
                              </span>
                              {/* Date for Tablet+ */}
                              <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                                 {formatDate(order.orderDate)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Desktop Badge Position */}
                                <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider border ${badge.className}`}>
                                    <BadgeIcon className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    {badge.label}
                                </span>
                                <span className="block text-lg md:text-2xl font-bold text-secondary">
                                  {formatPrice(order.total)}
                                </span>
                            </div>
                         </div>
                         
                         {/* Mobile-only date line & Badge */}
                         <div className="flex items-center justify-between sm:hidden mb-2">
                            <span className="text-[11px] text-muted-foreground">
                               {formatDate(order.orderDate)}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${badge.className}`}>
                                <BadgeIcon className="w-3 h-3" />
                                {badge.label}
                            </span>
                         </div>

                         {/* Items List (Wrapped) */}
                         <div className="text-sm text-foreground/80 line-clamp-2 leading-relaxed">
                            {order.items.map((item, idx) => (
                               <span key={idx} className="mr-2 inline-block">
                                  <span className="font-bold text-foreground">
                                    {item.quantity}x
                                  </span> {item.mainDishes?.join(' + ') || item.name}
                               </span>
                            ))}
                         </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="flex items-center gap-3 mt-auto pt-3 md:pt-4 border-t border-dashed border-border/60">
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-auto">
                            <MapPin className="w-4 h-4 text-secondary/70 shrink-0" />
                            <span className="line-clamp-1 max-w-[200px]">{order.deliveryLocation}</span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                           <button
                             onClick={() => handleTrackOrder(order.orderId)}
                             className="flex-1 md:flex-none h-10 md:h-11 text-xs md:text-sm font-semibold text-foreground hover:text-green-700 border border-border/80 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all flex items-center justify-center gap-2 px-4 shadow-sm"
                           >
                             <WhatsAppIcon className="w-4 h-4" />
                             Track
                           </button>
                           <button
                             onClick={() => handleReorder(order)}
                             className="flex-1 md:flex-none h-10 md:h-11 text-xs md:text-sm font-bold bg-[#E6411C] hover:bg-[#d13a17] text-white rounded-xl flex items-center justify-center gap-2 px-6 shadow-sm shadow-orange-500/20 transition-all active:scale-[0.98]"
                           >
                             <RefreshCw className="w-4 h-4" />
                             Reorder
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
}
