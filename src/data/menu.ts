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

export const menuData: MenuData = {
  mainDishes: [
    { id: "matooke", name: "Matooke", description: "Steamed green bananas mashed to silky perfection - Uganda's beloved staple", image: "/images/menu/main-dishes/matooke.jpg", available: true },
    { id: "white-rice", name: "White Rice", description: "Fluffy, perfectly steamed long-grain rice", image: "/images/menu/main-dishes/9yards-food-white-rice.jpg", available: true },
    { id: "pilao", name: "Pilao", description: "Fragrant spiced rice cooked with aromatic herbs and spices", image: "/images/menu/main-dishes/9yards-food-pilao.jpg", available: true },
    { id: "posho", name: "Posho", description: "Traditional maize meal, soft and smooth - perfect with any stew", image: "/images/menu/main-dishes/9yards-food-posho.jpg", available: true },
    { id: "cassava", name: "Cassava", description: "Tender boiled cassava, naturally sweet and satisfying", image: "/images/menu/main-dishes/9yards-food-cassava.jpg", available: true },
  ],
  sauces: [
    {
      id: "liver",
      name: "Liver",
      description: "Succulent pan-fried liver in a savory onion and herb gravy",
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
      description: "Rich, velvety groundnut paste simmered with traditional spices",
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
      description: "Tender chicken slow-cooked in a rich tomato and onion gravy",
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
      description: "Melt-in-your-mouth beef chunks in a hearty, seasoned gravy",
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
      description: "Fresh tilapia, golden-fried or expertly smoked to perfection",
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
      description: "Crispy fish swimming in a luscious groundnut sauce",
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
      description: "Whole tilapia, seasoned and prepared fresh daily",
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
      description: "Creamy cowpeas slow-cooked in aromatic local spices",
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
    { id: "chapati", name: "Chapati", description: "Soft, flaky flatbread - perfect for scooping up your favorite stews", price: 2000, image: "/images/menu/desserts/Chapati.jpg", available: true },
    { id: "samosa", name: "Samosa", description: "Crispy golden pastry filled with spiced meat or vegetables", price: 1000, image: "/images/menu/desserts/Samosa.jpg", available: true },
  ],
  sideDishes: [
    { id: "cabbage", name: "Cabbage", description: "Fresh sautéed cabbage with onions and mild spices", image: "/images/menu/side-dish/9Yards-cabbage-Menu.jpg", available: true },
    { id: "avocado", name: "Avocado", description: "Creamy ripe avocado - the perfect healthy addition", image: "/images/menu/side-dish/9Yards-avocado-Menu.jpg", available: true },
  ],
  lusaniya: [
    { 
      id: "whole-chicken-pilao-lusaniya", 
      name: "Whole Chicken with Pilao Lusaniya", 
      description: "A feast for sharing! Whole roasted chicken on fragrant pilao with fresh kachumbari. Serves 2-3",
      price: 45000, 
      image: "/images/menu/lusaniya/whole-chicken-lusaniya.jpg", 
      available: true 
    },
    { 
      id: "beef-pilao-lusaniya", 
      name: "Beef & Pilao Lusaniya", 
      description: "Generous tender beef over spiced pilao rice, topped with zesty kachumbari. Serves 2-3",
      price: 35000, 
      image: "/images/menu/lusaniya/beef-&-pilao-lusaniya.jpg", 
      available: true 
    },
    { 
      id: "ordinary-lusaniya", 
      name: "Ordinary Lusaniya", 
      description: "Our signature combo - aromatic pilao with your choice of protein and fresh kachumbari",
      price: 30000, 
      image: "/images/menu/lusaniya/ordinary-lusaniya.jpg", 
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
