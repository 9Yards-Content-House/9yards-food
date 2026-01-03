// Centralized constants for 9Yards Food

// Contact Information
export const PHONE_NUMBER = '+256708899597';
export const PHONE_NUMBER_FORMATTED = '+256 708 899 597';
export const PHONE_NUMBER_SECONDARY = '+256763058142';
export const PHONE_NUMBER_SECONDARY_FORMATTED = '+256 763 058 142';
export const WHATSAPP_NUMBER = '256708899597'; // Without + for WhatsApp URLs
export const EMAIL = 'deliveries@9yards.co.ug';

// Social Media
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com/9yardsfood',
  tiktok: 'https://tiktok.com/@9yardsfood',
  youtube: 'https://youtube.com/@9yardsfood',
  website: 'https://9yards.co.ug',
};

// Business Hours
export const BUSINESS_HOURS = {
  open: '10:00 AM',
  close: '10:00 PM',
  days: 'Monday - Sunday',
};

// WhatsApp Pre-filled Messages
export const WHATSAPP_MESSAGES = {
  default: 'Hi! I would like to place an order from 9Yards Food 🍽️',
  inquiry: 'Hi 9Yards Food! I have a question about...',
  bulkOrder: "Hi 9Yards Food! I'd like to get a quote for bulk/catering order for my event.",
  support: 'Hi 9Yards Food! I need help with my order.',
};

// Generate WhatsApp URL with message
export function getWhatsAppUrl(message: string = WHATSAPP_MESSAGES.default): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Delivery
export const DELIVERY = {
  minFreeDelivery: 50000, // UGX
  avgTime: '30-45 minutes',
};

// Promo Codes
export const PROMO_CODES = {
  firstOrder: 'FIRST10',
  firstOrderDiscount: 10, // percent
};
