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
      if (images.length >= 4) break;

      // 1. Main Sauce Image (Combo) or Item Image (Single)
      if (item.sauce?.image) addImage(item.sauce.image);
      if (item.image) addImage(item.image);

      // 2. Side Dish Image (Look up from menuData)
      if (item.sideDish) {
        const side = menuData.sideDishes.find(s => s.name === item.sideDish || s.id === item.sideDish);
        if (side?.image) addImage(side.image);
      }

      // 3. Extras
      if (item.extras) {
        for (const extra of item.extras) {
          const juice = menuData.juices.find(j => j.id === extra.id);
          if (juice?.image) addImage(juice.image);
          
          const dessert = menuData.desserts.find(d => d.id === extra.id);
          if (dessert?.image) addImage(dessert.image);
        }
      }
    }

    return images.slice(0, 4);
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
                    {/* Visual Side (Left) - Fixed square layout for mobile/desktop consistent */}
                    <div className="w-24 sm:w-32 md:w-48 bg-secondary/5 shrink-0 relative border-r border-border/50">
                      {orderImages.length > 0 ? (
                        orderImages.length === 1 ? (
                          <OptimizedImage 
                            src={orderImages[0]} 
                            alt="Order Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            {orderImages.map((img, i) => (
                              <div key={i} className="relative overflow-hidden border-[0.5px] border-white/20">
                                <OptimizedImage 
                                  src={img} 
                                  alt={`Item ${i+1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {/* Fill remaining slots with placeholder pattern if < 4, only if we want specific 2x2. 
                                Actually, sticking to just rendering available images in grid might look weird if 3.
                                Let's ensure we fill 4 slots for 2x2 if we have > 1, repeating if needed? 
                                User asked for "collage", 3 items in 2x2 leaves one blank. 
                                Let's attempt to fill up to 4 using modulo if we have at least 2.
                             */}
                             {Array.from({ length: 4 - orderImages.length }).map((_, i) => (
                                orderImages.length > 1 && (
                                   <div key={`fill-${i}`} className="bg-secondary/10 flex items-center justify-center">
                                      <div className="w-full h-full bg-secondary/5" />
                                   </div>
                                )
                             ))}
                          </div>
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-secondary/20">
                           <ShoppingBag className="w-8 h-8 md:w-12 md:h-12" />
                        </div>
                      )}
                    </div>

                    {/* Content Side (Right) */}
                    <div className="flex-1 p-3 md:p-6 flex flex-col justify-between min-w-0">
                      {/* Detailed Header Row */}
                      <div className="mb-2 md:mb-4">
                         <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] md:text-sm font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                #{order.orderId.slice(-6).toUpperCase()}
                              </span>
                              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                                 {formatDate(order.orderDate)}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {/* Desktop Badge Position (Next to Price) */}
                                <span className={`hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.className}`}>
                                    <BadgeIcon className="w-3 h-3" />
                                    {badge.label}
                                </span>
                                <span className="block text-base md:text-xl font-bold text-secondary">
                                  {formatPrice(order.total)}
                                </span>
                            </div>
                         </div>
                         
                         {/* Mobile-only date line */}
                         <div className="flex items-center gap-2 mb-1.5 sm:hidden">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${badge.className}`}>
                                <BadgeIcon className="w-2.5 h-2.5" />
                                {badge.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                               {formatDate(order.orderDate)}
                            </span>
                         </div>



                         {/* Items List (Wrapped) */}
                         <div className="text-xs md:text-sm text-foreground/80 line-clamp-2 leading-relaxed">
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
                      <div className="flex items-center gap-2 mt-2 pt-2 md:pt-4 border-t border-border/50">
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground mr-auto">
                            <MapPin className="w-4 h-4 text-secondary/70" />
                            <span className="line-clamp-1 max-w-[200px]">{order.deliveryLocation}</span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                           <button
                             onClick={() => handleTrackOrder(order.orderId)}
                             className="flex-1 md:flex-none h-8 md:h-10 text-xs md:text-sm font-medium text-foreground hover:text-green-600 border border-border rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-1.5 px-3"
                           >
                             <WhatsAppIcon className="w-3.5 h-3.5" />
                             Track
                           </button>
                           <button
                             onClick={() => handleReorder(order)}
                             className="flex-1 md:flex-none h-8 md:h-10 text-xs md:text-sm btn-secondary px-4 flex items-center justify-center gap-1.5"
                           >
                             <RefreshCw className="w-3.5 h-3.5" />
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
