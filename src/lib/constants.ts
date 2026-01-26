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

// Kitchen Location (Kigo, near Lake Victoria Serena Resort / Busabala junction)
export const KITCHEN_LOCATION = {
  lat: 0.2000,
  lon: 32.5835,
  name: 'Kigo',
};

// Maximum delivery distance in kilometers
export const MAX_DELIVERY_DISTANCE_KM = 30;

// Distance-based delivery pricing tiers
export interface DeliveryTier {
  maxDistance: number; // km
  fee: number; // UGX
  minTime: number; // minutes
  maxTime: number; // minutes
}

export const DELIVERY_TIERS: DeliveryTier[] = [
  { maxDistance: 5, fee: 0, minTime: 15, maxTime: 25 },
  { maxDistance: 10, fee: 5000, minTime: 20, maxTime: 30 },
  { maxDistance: 15, fee: 7000, minTime: 25, maxTime: 35 },
  { maxDistance: 20, fee: 10000, minTime: 30, maxTime: 40 },
  { maxDistance: 25, fee: 12000, minTime: 35, maxTime: 45 },
  { maxDistance: 30, fee: 15000, minTime: 40, maxTime: 50 },
];

// Calculate distance between two coordinates using Haversine formula
export function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate delivery fee based on distance from kitchen
export function calculateDeliveryFee(distanceKm: number): number | null {
  if (distanceKm > MAX_DELIVERY_DISTANCE_KM) return null; // Out of delivery range
  
  for (const tier of DELIVERY_TIERS) {
    if (distanceKm <= tier.maxDistance) {
      return tier.fee;
    }
  }
  return null;
}

// Calculate estimated delivery time based on distance
export function calculateDeliveryTime(distanceKm: number): string | null {
  if (distanceKm > MAX_DELIVERY_DISTANCE_KM) return null;
  
  for (const tier of DELIVERY_TIERS) {
    if (distanceKm <= tier.maxDistance) {
      return `${tier.minTime}-${tier.maxTime} mins`;
    }
  }
  return null;
}

// Get delivery tier info for a given distance
export function getDeliveryTierInfo(distanceKm: number): {
  fee: number;
  time: string;
  isDeliverable: boolean;
  distance: number;
} {
  const roundedDistance = Math.round(distanceKm * 10) / 10; // Round to 1 decimal
  
  if (distanceKm > MAX_DELIVERY_DISTANCE_KM) {
    return {
      fee: 0,
      time: 'N/A',
      isDeliverable: false,
      distance: roundedDistance,
    };
  }
  
  for (const tier of DELIVERY_TIERS) {
    if (distanceKm <= tier.maxDistance) {
      return {
        fee: tier.fee,
        time: `${tier.minTime}-${tier.maxTime} mins`,
        isDeliverable: true,
        distance: roundedDistance,
      };
    }
  }
  
  return {
    fee: 0,
    time: 'N/A',
    isDeliverable: false,
    distance: roundedDistance,
  };
}

// Delivery
export const DELIVERY = {
  minFreeDelivery: 80000, // UGX - free delivery on orders over this amount
  avgTime: '25-45 minutes',
  freeWithinKm: 5, // Free delivery within this distance
};

// Free delivery threshold constant for easy access
export const FREE_DELIVERY_THRESHOLD = 80000;

// Promo Codes
export const PROMO_CODES = {
  firstOrder: 'FIRST10',
  firstOrderDiscount: 10, // percent
};
