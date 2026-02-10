// TypeScript interfaces and type definitions
export interface MainDish {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
}

export interface SauceOption {
  name: string;
  price: number;
}

export interface Sauce {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  available: boolean;
  preparations: string[];
  sizes: SauceOption[];
}

export interface Juice {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

export interface Dessert {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

export interface SideDish {
  id: string;
  name: string;
  description: string;
  image: string;
  available: boolean;
}

export interface LusaniyaItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
}

export interface MenuData {
  mainDishes: MainDish[];
  sauces: Sauce[];
  juices: Juice[];
  desserts: Dessert[];
  sideDishes: SideDish[];
  lusaniya: LusaniyaItem[];
}

export interface DeliveryZone {
  name: string;
  fee: number;
  estimatedTime: string;
  coordinates?: [number, number];
}

// Import JSON data
import menuJSON from './menu.json';

// Export menu data with proper typing
export const menuData: MenuData = {
  mainDishes: menuJSON.mainDishes.items,
  sauces: menuJSON.sauces.items,
  juices: menuJSON.juices.items,
  desserts: [],
  sideDishes: menuJSON.sideDishes.items,
  lusaniya: menuJSON.lusaniya.items,
};

// Export delivery zones
export const deliveryZones: DeliveryZone[] = menuJSON.deliveryZones.items;

// Export promo codes
export const promoCodes: Record<string, { discount: number; type: 'percentage' | 'fixed'; minOrder?: number }> = 
  menuJSON.promoCodes.codes;

// Export featured item IDs for home page
export const FEATURED_SAUCE_IDS = menuJSON.featuredItems.sauceIds;
export const FEATURED_LUSANIYA_IDS = menuJSON.featuredItems.lusaniyaIds;

// Best sellers
export const bestSellers = ["fish", "chicken-stew", "matooke", "whole-chicken-pilao-lusaniya"];
export const newItems: string[] = ["beef-pilao-lusaniya"];

// Item descriptions
export const itemDescriptions: Record<string, string> = {
  // Lusaniya items
  "whole-chicken-pilao-lusaniya": "Full chicken mixed with Pilao and Kachumbari",
  "beef-pilao-lusaniya": "Cow beef with pilao and Kachumbari",
  "ordinary-lusaniya": "Signature combo with chicken, pilao and kachumbari",
  // Main dishes
  matooke: "Traditional steamed green bananas",
  posho: "Smooth cornmeal, Ugandan staple",
  cassava: "Soft boiled cassava root",
  yam: "Tender yam slices",
  "sweet-potatoes": "Naturally sweet & nutritious",
  "irish-potatoes": "Classic boiled potatoes",
  rice: "Fluffy white rice",
  // Sauces
  meat: "Tender beef, your choice of style",
  "chicken-stew": "Juicy chicken, perfectly seasoned",
  fish: "Fresh Nile perch, fried or steamed",
  gnuts: "Rich groundnut sauce, authentic recipe",
  cowpeas: "Traditional peas in savory sauce",
  liver: "Tender liver, rich in flavor",
  // Juices
  mango: "100% natural, no preservatives",
  passion: "Tangy & refreshing",
  pineapple: "Sweet tropical goodness",
  watermelon: "Cool & hydrating",
  mixed: "Best of all fruits",
  cocktail: "Premium fruit blend",

  // Sides
  greens: "Fresh amaranth greens",
  beans: "Slow-cooked kidney beans",
  cabbage: "Lightly seasoned steamed cabbage",
  sukuma: "Kenyan-style collard greens",
};
