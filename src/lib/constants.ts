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
  instagram: 'https://www.instagram.com/9yards_food/',
  tiktok: 'https://www.tiktok.com/@9yardsfood',
  youtube: '',
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
  default: 'Hello, I would like to place an order.',
  inquiry: 'Hello, I have a question about',
  bulkOrder: 'Hello, I would like to inquire about bulk or catering options for an event.',
  support: 'Hello, I need assistance with my order.',
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
