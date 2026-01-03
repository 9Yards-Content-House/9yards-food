export function formatPrice(amount: number): string {
  return `UGX ${amount.toLocaleString('en-UG')}`;
}

export function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${dateStr}-${random}`;
}

export function formatOrderDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-UG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function generateWhatsAppMessage(
  orderId: string,
  items: Array<{
    mainDishes: string[];
    sauce: { name: string; preparation: string; size: string; price: number } | null;
    sideDish: string;
    extras: Array<{ name: string; quantity: number; price: number }>;
    quantity: number;
    totalPrice: number;
  }>,
  customerInfo: {
    name: string;
    phone: string;
    location: string;
    address: string;
    specialInstructions?: string;
  },
  subtotal: number,
  deliveryFee: number,
  total: number,
  paymentMethod: string = 'Pay on Delivery'
): string {
  const orderDate = formatOrderDate();
  
  let message = `*NEW ORDER - 9Yards Food*\n\n`;
  message += `*Order #:* ${orderId}\n`;
  message += `*Date:* ${orderDate}\n\n`;
  message += `*ORDER DETAILS:*\n`;
  
  items.forEach((item, index) => {
    const dishes = item.mainDishes.join(' + ');
    const sauceInfo = item.sauce 
      ? `${item.sauce.name} (${item.sauce.preparation}, ${item.sauce.size})`
      : 'No sauce';
    
    message += `${index + 1}. ${dishes} + ${sauceInfo} + ${item.sideDish}\n`;
    message += `   Qty: ${item.quantity} × ${formatPrice(item.totalPrice)}\n`;
    
    if (item.extras.length > 0) {
      message += `   Extras: ${item.extras.map(e => `${e.name} (${e.quantity})`).join(', ')}\n`;
    }
  });
  
  message += `\n*DELIVERY INFO:*\n`;
  message += `*Name:* ${customerInfo.name}\n`;
  message += `*Phone:* ${customerInfo.phone}\n`;
  message += `*Location:* ${customerInfo.location}\n`;
  message += `*Address:* ${customerInfo.address}\n`;
  
  if (customerInfo.specialInstructions) {
    message += `*Special Instructions:* ${customerInfo.specialInstructions}\n`;
  }
  
  message += `\n*PAYMENT SUMMARY:*\n`;
  message += `*Subtotal:* ${formatPrice(subtotal)}\n`;
  message += `*Delivery Fee:* ${formatPrice(deliveryFee)}\n`;
  message += `*Total:* ${formatPrice(total)}\n\n`;
  message += `*Payment Method:* ${paymentMethod}\n\n`;
  message += `*Estimated Delivery:* 30-45 minutes`;
  
  return encodeURIComponent(message);
}

// Use centralized constant
import { WHATSAPP_NUMBER } from '@/lib/constants';

export function getWhatsAppLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
