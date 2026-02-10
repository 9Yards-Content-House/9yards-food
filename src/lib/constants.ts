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

// Maximum delivery distance in kilometers (20km covers central Kampala, Kololo, Ntinda outskirts)
export const MAX_DELIVERY_DISTANCE_KM = 20;

// Distance-based delivery pricing tiers
export interface DeliveryTier {
  maxDistance: number; // km
  fee: number; // UGX
  minTime: number; // minutes
  maxTime: number; // minutes
}

// Optimized for Kampala traffic + food freshness (from Kigo kitchen)
// All deliveries start at 5,000 UGX minimum, max 8,000 UGX
// 0-3 km: Kigo, Busabala, Kitende, Lweza, nearby resorts
// 3-6 km: Covers Munyonyo, Kajjansi, Sseguku area
// 6-10 km: Reaches Kabalagala, Muyenga, Ggaba, Buziga
// 10-15 km: City center, Nakasero, Kololo, Bugolobi
// 15-20 km: Ntinda, Nakawa, Kira, Naalya, Kyanja
export const DELIVERY_TIERS: DeliveryTier[] = [
  { maxDistance: 3, fee: 5000, minTime: 15, maxTime: 25 },
  { maxDistance: 6, fee: 5000, minTime: 25, maxTime: 35 },
  { maxDistance: 10, fee: 5000, minTime: 35, maxTime: 45 },
  { maxDistance: 15, fee: 6000, minTime: 45, maxTime: 60 },
  { maxDistance: 20, fee: 8000, minTime: 60, maxTime: 75 },
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
  minDeliveryFee: 5000, // UGX - all deliveries start at this minimum
  avgTime: '25-60 minutes',
};

// Promo Codes
export const PROMO_CODES = {
  firstOrder: 'FIRST10',
  firstOrderDiscount: 10, // percent
};
