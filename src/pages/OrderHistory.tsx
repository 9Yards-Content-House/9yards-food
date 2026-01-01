import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Clock,
  Package,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { useCart, OrderHistoryItem } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils/order';
import { toast } from 'sonner';

export default function OrderHistory() {
  const { orderHistory, clearOrderHistory, reorderFromHistory, addItem } = useCart();

  const handleReorder = (order: OrderHistoryItem) => {
    // Add each item from the order to cart
    order.items.forEach(item => {
      addItem({
        id: `combo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'combo',
        mainDishes: item.mainDishes,
        sauce: item.sauce,
        sideDish: item.sideDish,
        extras: item.extras,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      });
    });
    toast.success('Items added to cart!');
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

  const getStatusColor = (status: OrderHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'pending':
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: OrderHistoryItem['status']) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      case 'pending':
      default:
        return Clock;
    }
  };

  if (orderHistory.length === 0) {
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
          <div className="flex items-center justify-between mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl md:text-3xl font-bold text-foreground"
            >
              Order History
            </motion.h1>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
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
            </motion.button>
          </div>

          <div className="space-y-4">
            {orderHistory.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              
              return (
                <motion.div
                  key={order.orderId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-premium p-4 md:p-6"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4 pb-4 border-b border-border">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground font-mono">
                          {order.orderId}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-secondary">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.paymentMethod === 'online' ? 'Paid Online' : 'Cash on Delivery'}
                      </p>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.quantity}x {item.mainDishes.join(' + ')} + {item.sauce?.name}
                        </span>
                        <span className="text-muted-foreground">
                          {formatPrice(item.totalPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Info */}
                  <div className="text-sm text-muted-foreground mb-4">
                    <p>
                      <strong className="text-foreground">Delivered to:</strong>{' '}
                      {order.deliveryLocation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReorder(order)}
                      className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reorder
                    </button>
                    <Link
                      to="/menu"
                      className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      View Menu
                    </Link>
                  </div>
                </motion.div>
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
