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
    { id: "white-rice", name: "White Rice", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400", available: true },
    { id: "pilao", name: "Pilao", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400", available: true },
    { id: "posho", name: "Posho", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400", available: true },
    { id: "cassava", name: "Cassava", image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400", available: true },
    { id: "yam", name: "Yam", image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400", available: true },
    { id: "sweet-potatoes", name: "Sweet Potatoes", image: "https://images.unsplash.com/photo-1596097635121-14b63b7a0b17?w=400", available: true },
    { id: "irish-potatoes", name: "Irish Potatoes", image: "https://images.unsplash.com/photo-1518977676601-b53f82ber5d8?w=400", available: true },
  ],
  sauces: [
    {
      id: "liver",
      name: "Liver",
      description: "Tender and flavorful liver, rich in iron and protein",
      basePrice: 20000,
      image: "/images/menu/sauces/9Yards-Liver-Menu.jpg",
      available: true,
      preparations: [],
      sizes: [
        { name: "Regular", price: 20000 },
      ],
    },
    {
      id: "gnuts",
      name: "G-Nuts",
      description: "Creamy groundnut sauce with authentic Ugandan spices",
      basePrice: 15000,
      image: "/images/menu/sauces/9Yards-G-Nuts-Menu.jpg",
      available: true,
      preparations: [],
      sizes: [
        { name: "Regular", price: 15000 },
      ],
    },
    {
      id: "chicken-stew",
      name: "Chicken Stew",
      description: "Juicy chicken pieces in a rich, aromatic tomato-based stew",
      basePrice: 20000,
      image: "/images/menu/sauces/9Yards-Chicken-Stew-Menu.jpg",
      available: true,
      preparations: ["Fried", "Boiled", "Grilled"],
      sizes: [
        { name: "Regular", price: 20000 },
        { name: "Half-Chicken", price: 35000 },
        { name: "Full Chicken", price: 55000 },
      ],
    },
    {
      id: "beef-stew",
      name: "Beef Stew",
      description: "Tender beef chunks slow-cooked in savory gravy",
      basePrice: 15000,
      image: "/images/menu/sauces/9Yards-Beef-Stew-Menu.jpg",
      available: true,
      preparations: ["Fried", "Boiled"],
      sizes: [
        { name: "Regular", price: 15000 },
      ],
    },
    {
      id: "fish",
      name: "Fish",
      description: "Fresh Nile perch, perfectly seasoned and cooked to order",
      basePrice: 15000,
      image: "/images/menu/sauces/9Yards-Fresh-Fish-Menu.jpg",
      available: true,
      preparations: ["Fried", "Smoked", "Boiled"],
      sizes: [
        { name: "Regular", price: 15000 },
      ],
    },
    {
      id: "fish-gnuts",
      name: "Fish & G-Nuts",
      description: "Delicious fish paired with creamy groundnut sauce",
      basePrice: 20000,
      image: "/images/menu/sauces/9Yards-Fish-&-G-Nuts-Menu.jpg",
      available: true,
      preparations: [],
      sizes: [
        { name: "Regular", price: 20000 },
      ],
    },
    {
      id: "fresh-fish",
      name: "Fresh Fish",
      description: "Premium whole fish, freshly prepared with herbs and spices",
      basePrice: 20000,
      image: "/images/menu/sauces/9Yards-Fresh-Fish-Menu.jpg",
      available: true,
      preparations: [],
      sizes: [
        { name: "Regular", price: 20000 },
      ],
    },
    {
      id: "cowpeas",
      name: "Cowpeas",
      description: "Hearty cowpeas simmered in a traditional savory sauce",
      basePrice: 15000,
      image: "/images/menu/sauces/9Yards-cowpeas-Menu.jpg",
      available: true,
      preparations: [],
      sizes: [
        { name: "Regular", price: 15000 },
      ],
    },
  ],
  juices: [
    { id: "passion", name: "Passion Fruit Juice", description: "Tangy and refreshing with natural tropical sweetness", price: 5000, image: "/images/menu/juices/9yards-passion-fruit-juice-menu.jpg", available: true },
    { id: "mango", name: "Mango Juice", description: "Sweet, smooth, and bursting with tropical mango flavor", price: 5000, image: "/images/menu/juices/9yards-mango-juice-menu.jpg", available: true },
    { id: "watermelon", name: "Watermelon Juice", description: "Light, refreshing, and naturally hydrating", price: 5000, image: "/images/menu/juices/9yards-watermelon-juice-menu.jpg", available: true },
    { id: "pineapple", name: "Pineapple Juice", description: "Sweet, tangy, and tropical. Fresh pineapple blended to perfection", price: 5000, image: "/images/menu/juices/9yards-pineapple-juice-menu.jpg", available: true },
    { id: "beetroot", name: "Beetroot Juice", description: "Pure beetroot juice. Earthy, naturally sweet, and incredibly nutritious", price: 5000, image: "/images/menu/juices/9yards-beetroot-juice-menu.jpg", available: true },
  ],
  desserts: [
    { id: "chapati", name: "Chapati", price: 2000, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400", available: true },
    { id: "samosa", name: "Samosa", price: 1000, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400", available: true },
  ],
  sideDishes: [
    { id: "mixed-greens", name: "Mixed Greens", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400", available: true },
    { id: "cabbage", name: "Cabbage", image: "https://images.unsplash.com/photo-1598030343246-eec71cb44930?w=400", available: true },
    { id: "beans", name: "Beans", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400", available: true },
    { id: "avocado", name: "Avocado", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400", available: true },
  ],
  lusaniya: [
    { 
      id: "chicken-pilao-single", 
      name: "Chicken Pilao (Single Meal)", 
      description: "Delicious chicken served with flavored pilao rice",
      price: 15000, 
      image: "/images/lusaniya/chicken-pilao.png", 
      available: true 
    },
    { 
      id: "beef-pilao-single", 
      name: "Beef Pilao (Single Meal)", 
      description: "Tender beef served with flavored pilao rice",
      price: 15000, 
      image: "/images/lusaniya/beef-pilao.png", 
      available: true 
    },
    { 
      id: "whole-chicken-pilao-lusaniya", 
      name: "Whole Chicken with Pilao Lusaniya", 
      description: "Full chicken mixed with pilao and kachumbari - serves 2-3 people",
      price: 45000, 
      image: "/images/lusaniya/9Yards-Food-Lusaniya-05.png", 
      available: true 
    },
    { 
      id: "beef-pilao-lusaniya", 
      name: "Beef & Pilao Lusaniya", 
      description: "Generous beef portions with pilao and kachumbari - serves 2-3 people",
      price: 35000, 
      image: "/images/lusaniya/9Yards-Food-Lusaniya-02.png", 
      available: true 
    },
    { 
      id: "ordinary-lusaniya", 
      name: "Ordinary Lusaniya", 
      description: "Classic lusaniya with pilao and kachumbari",
      price: 30000, 
      image: "/images/lusaniya/ordinary-lusaniya.png", 
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
