export interface MainDish {
  id: string;
  name: string;
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
  basePrice: number;
  image: string;
  available: boolean;
  preparations: string[];
  sizes: SauceOption[];
}

export interface Juice {
  id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
}

export interface Dessert {
  id: string;
  name: string;
  price: number;
  image: string;
  available: boolean;
}

export interface SideDish {
  id: string;
  name: string;
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

export const menuData: MenuData = {
  mainDishes: [
    { id: "matooke", name: "Matooke", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400", available: true },
    { id: "posho", name: "Posho", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", available: true },
    { id: "cassava", name: "Cassava", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", available: true },
    { id: "yam", name: "Yam", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400", available: true },
    { id: "sweet-potatoes", name: "Sweet Potatoes", image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0b17?w=400", available: true },
    { id: "irish-potatoes", name: "Irish Potatoes", image: "https://images.unsplash.com/photo-1518977676601-b53f82ber5d8?w=400", available: true },
    { id: "rice", name: "Rice", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400", available: true },
  ],
  sauces: [
    {
      id: "meat",
      name: "Meat",
      basePrice: 15000,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
      available: true,
      preparations: ["Fried", "Boiled"],
      sizes: [
        { name: "Regular", price: 15000 },
        { name: "Large", price: 22000 },
      ],
    },
    {
      id: "chicken",
      name: "Chicken",
      basePrice: 18000,
      image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400",
      available: true,
      preparations: ["Fried", "Boiled", "Grilled"],
      sizes: [
        { name: "Quarter", price: 18000 },
        { name: "Half", price: 28000 },
        { name: "Full", price: 45000 },
      ],
    },
    {
      id: "fish",
      name: "Fish",
      basePrice: 25000,
      image: "https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400",
      available: true,
      preparations: ["Fried", "Steamed"],
      sizes: [
        { name: "1 Piece", price: 25000 },
        { name: "Full Fish", price: 35000 },
      ],
    },
    {
      id: "gnuts",
      name: "G-Nuts (Groundnut Sauce)",
      basePrice: 12000,
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
      available: true,
      preparations: ["Traditional"],
      sizes: [
        { name: "Regular", price: 12000 },
        { name: "Large", price: 18000 },
      ],
    },
    {
      id: "cow-peas",
      name: "Cow Peas",
      basePrice: 10000,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
      available: true,
      preparations: ["Traditional"],
      sizes: [
        { name: "Regular", price: 10000 },
        { name: "Large", price: 15000 },
      ],
    },
    {
      id: "liver",
      name: "Liver",
      basePrice: 18000,
      image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400",
      available: true,
      preparations: ["Fried", "Boiled"],
      sizes: [
        { name: "Regular", price: 18000 },
        { name: "Large", price: 25000 },
      ],
    },
  ],
  juices: [
    { id: "mango", name: "Mango Juice", price: 5000, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400", available: true },
    { id: "passion", name: "Passion Fruit", price: 5000, image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400", available: true },
    { id: "pineapple", name: "Pineapple", price: 5000, image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400", available: true },
    { id: "watermelon", name: "Watermelon", price: 5000, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400", available: true },
    { id: "mixed", name: "Mixed Fruit", price: 6000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400", available: true },
    { id: "cocktail", name: "Fruit Cocktail", price: 7000, image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400", available: true },
  ],
  desserts: [
    { id: "mandazi", name: "Mandazi", price: 3000, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", available: true },
    { id: "rolex", name: "Rolex (Egg Roll)", price: 5000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", available: true },
    { id: "samosa", name: "Samosa", price: 2000, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", available: true },
  ],
  sideDishes: [
    { id: "greens", name: "Mixed Greens", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", available: true },
    { id: "beans", name: "Beans", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400", available: true },
    { id: "cabbage", name: "Steamed Cabbage", image: "https://images.unsplash.com/photo-1598030343246-eec71cb44930?w=400", available: true },
    { id: "sukuma", name: "Sukuma Wiki", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", available: true },
  ],
  lusaniya: [
    { 
      id: "whole-chicken-lusaniya", 
      name: "Whole Chicken with Pilao", 
      description: "Full chicken mixed with Pilao and Kachumbari",
      price: 45000, 
      image: "/images/lusaniya/9Yards-Food-Lusaniya-05.png", 
      available: true 
    },
    { 
      id: "beef-lusaniya", 
      name: "Beef Lusaniya", 
      description: "Cow beef with pilao and Kachumbari",
      price: 35000, 
      image: "/images/lusaniya/9Yards-Food-Lusaniya-02.png", 
      available: true 
    },
  ],
};

export interface DeliveryZone {
  name: string;
  fee: number;
  estimatedTime: string;
  coordinates?: [number, number];
}

export const deliveryZones: DeliveryZone[] = [
  { name: "Kampala Central", fee: 5000, estimatedTime: "30-45 mins", coordinates: [0.3163, 32.5822] },
  { name: "Nakawa", fee: 7000, estimatedTime: "40-50 mins", coordinates: [0.3200, 32.6150] },
  { name: "Kololo", fee: 5000, estimatedTime: "30-40 mins", coordinates: [0.3350, 32.5950] },
  { name: "Ntinda", fee: 6000, estimatedTime: "35-45 mins", coordinates: [0.3550, 32.6200] },
  { name: "Bugolobi", fee: 6000, estimatedTime: "35-45 mins", coordinates: [0.3100, 32.6050] },
  { name: "Muyenga", fee: 7000, estimatedTime: "40-50 mins", coordinates: [0.2950, 32.5950] },
  { name: "Kabalagala", fee: 6000, estimatedTime: "35-45 mins", coordinates: [0.2900, 32.5850] },
  { name: "Kira", fee: 8000, estimatedTime: "45-55 mins", coordinates: [0.3800, 32.6300] },
  { name: "Naalya", fee: 8000, estimatedTime: "45-55 mins", coordinates: [0.3700, 32.6500] },
  { name: "Kyanja", fee: 8000, estimatedTime: "45-55 mins", coordinates: [0.3850, 32.5850] },
];

export const promoCodes: Record<string, { discount: number; type: 'percentage' | 'fixed'; minOrder?: number }> = {
  "FIRST10": { discount: 10, type: "percentage", minOrder: 20000 },
  "SAVE5K": { discount: 5000, type: "fixed", minOrder: 30000 },
  "FREESHIP": { discount: 0, type: "fixed" },
};
