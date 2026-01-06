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
  desserts: menuJSON.desserts.items,
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
