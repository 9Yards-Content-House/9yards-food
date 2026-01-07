import { Link } from 'react-router-dom';
import {
  Clock,
  Package,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Trash2,
  CreditCard,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import SEO from '@/components/SEO';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { useCart, OrderHistoryItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/order';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { toast } from 'sonner';

export default function OrderHistory() {
  const { orderHistory, clearOrderHistory, reorderFromHistory, addItem } = useCart();

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
        className: 'text-blue-700 bg-blue-50 border border-blue-100',
        icon: CreditCard
      };
    }
    return {
      label: 'WhatsApp Order',
      className: 'text-green-700 bg-green-50 border border-green-100',
      icon: WhatsAppIcon
    };
  };

  const handleTrackOrder = (orderId: string) => {
    const message = encodeURIComponent(
      `Hi! I'd like to track my order.\n\nOrder ID: ${orderId}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  if (orderHistory.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <SEO 
          title="Order History | 9Yards Food"
          description="View your past orders and reorder your favorite meals easily."
          url="/order-history"
        />
        <Header />
        <main className="pt-16 md:pt-20">
          <div className="container-custom section-padding text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                No Orders Yet
              </h1>
              <p className="text-muted-foreground mb-8">
                Your order history will appear here after you place your first order.
              </p>
              <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
                Browse Menu
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title="Order History | 9Yards Food"
        description="View your past orders and reorder your favorite meals easily."
        url="/order-history"
      />
      <Header />

      <main className="pt-16 md:pt-20">
        <div className="container-custom section-padding">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Order History
            </h1>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all order history?')) {
                  clearOrderHistory();
                  toast.success('Order history cleared');
                }
              }}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </button>
          </div>

          <div className="space-y-4">
            {orderHistory.map((order) => {
              const badge = getMethodBadge(order.paymentMethod);
              const BadgeIcon = badge.icon;
              
              return (
                <div
                  key={order.orderId}
                  className="card-premium p-4 md:p-6"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-foreground font-mono text-lg">
                          {order.orderId}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${badge.className}`}>
                          <BadgeIcon className="w-3.5 h-3.5" />
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-secondary">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="text-foreground font-medium">
                          <span className="text-muted-foreground mr-2">{item.quantity}x</span> 
                          {item.mainDishes.join(' + ')}
                          {item.sauce && <span className="text-muted-foreground font-normal"> with {item.sauce.name}</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-muted/30 -mx-4 -mb-4 md:-mx-6 md:-mb-6 p-4 md:p-6 flex flex-wrap gap-3 items-center justify-between border-t border-border mt-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground mb-0.5">Delivered to</p>
                      <p className="font-bold text-foreground">{order.deliveryLocation}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => handleTrackOrder(order.orderId)}
                        className="btn-primary bg-[#25D366] hover:bg-[#20bd5a] text-white border-none flex-1 sm:flex-none text-sm py-2 px-4 flex items-center justify-center gap-2"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
                        Track Order
                      </button>
                      
                      <button
                        onClick={() => handleReorder(order)}
                        className="btn-secondary flex-1 sm:flex-none text-sm py-2 px-4 flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Reorder
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
