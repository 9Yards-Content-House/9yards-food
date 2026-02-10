import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { menuData } from '@/data/menu';

export interface SauceSelection {
  id: string;
  name: string;
  preparation: string;
  size: string;
  price: number;
}

export interface ExtraItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  id: string;
  type: 'combo' | 'single';
  mainDishes: string[];
  sauce: SauceSelection | null;
  sideDish: string;
  extras: ExtraItem[];
  quantity: number;
  totalPrice: number;
  description?: string; // For single items like Lusaniya
}

export interface UserPreferences {
  location: string;
  phone: string;
  name: string;
  address: string;
  specialInstructions?: string;
  // Distance-based delivery info
  deliveryDistance?: number; // km from kitchen
  deliveryFee?: number; // calculated fee in UGX
  deliveryTime?: string; // estimated time string
  coordinates?: { lat: number; lon: number }; // delivery location coordinates
}

export interface OrderHistoryItem {
  orderId: string;
  orderDate: string;
  items: CartItem[];
  deliveryLocation: string;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'whatsapp' | 'online';
  status: 'pending' | 'completed' | 'cancelled';
}

interface CartState {
  items: CartItem[];
  favorites: string[];
  userPreferences: UserPreferences;
  orderHistory: OrderHistoryItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'SET_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_ORDER_TO_HISTORY'; payload: OrderHistoryItem }
  | { type: 'CLEAR_ORDER_HISTORY' }
  | { type: 'LOAD_STATE'; payload: CartState };

const initialState: CartState = {
  items: [],
  favorites: [],
  userPreferences: {
    location: '',
    phone: '',
    name: '',
    address: '',
    specialInstructions: '',
    deliveryDistance: undefined,
    deliveryFee: undefined,
    deliveryTime: undefined,
    coordinates: undefined,
  },
  orderHistory: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex !== -1) {
        // Item already exists, increment quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + (action.payload.quantity || 1)
        };
        return { ...state, items: updatedItems };
      }
      
      // New item, add to list
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };
    case 'CLEAR_FAVORITES':
      return { ...state, favorites: [] };
    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload },
      };
    case 'ADD_ORDER_TO_HISTORY':
      return {
        ...state,
        orderHistory: [action.payload, ...state.orderHistory].slice(0, MAX_ORDER_HISTORY),
      };
    case 'CLEAR_ORDER_HISTORY':
      return { ...state, orderHistory: [] };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  updateItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
  setUserPreferences: (prefs: Partial<UserPreferences>) => void;
  addOrderToHistory: (order: OrderHistoryItem) => void;
  clearOrderHistory: () => void;
  reorderFromHistory: (order: OrderHistoryItem) => void;
  cartTotal: number;
  cartCount: number;
  favoritesCount: number;
  orderHistory: OrderHistoryItem[];
  isFavorite: (id: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = '9yards_cart';

// Order history limits
const MAX_ORDER_HISTORY = 20; // Maximum number of orders to keep
const ORDER_HISTORY_DAYS = 90; // Remove orders older than this many days

// Helper to filter out old orders
function cleanOrderHistory(orders: OrderHistoryItem[]): OrderHistoryItem[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - ORDER_HISTORY_DAYS);
  
  return orders
    .filter(order => new Date(order.orderDate) > cutoffDate) // Remove orders older than 90 days
    .slice(0, MAX_ORDER_HISTORY); // Keep only the most recent 20
}

// Load initial state from localStorage
function getInitialState(): CartState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate that parsed data has expected structure
      if (parsed && Array.isArray(parsed.items)) {
        return {
          items: parsed.items || [],
          favorites: parsed.favorites || [],
          userPreferences: parsed.userPreferences || initialState.userPreferences,
          orderHistory: cleanOrderHistory(parsed.orderHistory || []), // Clean up old orders on load
        };
      }
    }
  } catch (e) {
    console.error('Failed to load cart from storage:', e);
  }
  return initialState;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, getInitialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Revalidate cart items against current menu prices on load
  useEffect(() => {
    if (state.items.length === 0) return;

    let changed = false;
    const updatedItems = state.items
      .map(item => {
        if (item.type === 'single') {
          // Look up current price for single items (lusaniya, juice, etc.)
          const idParts = item.id.split('-');
          const category = idParts[0]; // e.g. 'lusaniya', 'juice'
          const menuId = idParts.slice(1).join('-'); // e.g. 'ordinary-lusaniya'
          
          let currentPrice: number | undefined;
          let stillAvailable = true;

          if (category === 'lusaniya') {
            const entry = menuData.lusaniya.find(l => l.id === menuId);
            currentPrice = entry?.price;
            stillAvailable = !!entry?.available;
          } else if (category === 'juice') {
            const entry = menuData.juices.find(j => j.id === menuId);
            currentPrice = entry?.price;
            stillAvailable = !!entry?.available;
          }

          if (!stillAvailable) { changed = true; return null; }
          if (currentPrice !== undefined && currentPrice !== item.totalPrice) {
            changed = true;
            return { ...item, totalPrice: currentPrice };
          }
        } else if (item.type === 'combo') {
          // Recalculate combo price from current sauce + extras
          let newPrice = 0;
          if (item.sauce) {
            const currentSauce = menuData.sauces.find(s => s.id === item.sauce!.id);
            if (!currentSauce?.available) { changed = true; return null; }
            newPrice += currentSauce.basePrice;
            if (currentSauce.basePrice !== item.sauce.price) {
              changed = true;
            }
          }
          for (const extra of item.extras) {
            const juice = menuData.juices.find(j => j.id === extra.id);
            if (juice) {
              newPrice += juice.price * extra.quantity;
              if (juice.price !== extra.price) changed = true;
            } else {
              newPrice += extra.price * extra.quantity;
            }
          }
          if (newPrice > 0 && newPrice !== item.totalPrice) {
            changed = true;
            return {
              ...item,
              totalPrice: newPrice,
              sauce: item.sauce ? {
                ...item.sauce,
                price: menuData.sauces.find(s => s.id === item.sauce!.id)?.basePrice ?? item.sauce.price,
              } : null,
              extras: item.extras.map(e => {
                const juice = menuData.juices.find(j => j.id === e.id);
                return juice ? { ...e, price: juice.price } : e;
              }),
            };
          }
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    if (changed) {
      dispatch({ type: 'LOAD_STATE', payload: { ...state, items: updatedItems } });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save state to localStorage on change (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save cart to storage:', e);
      }
    }
  }, [state, isInitialized]);

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item });
  const updateItem = (item: CartItem) => dispatch({ type: 'UPDATE_ITEM', payload: item });
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) => 
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleFavorite = (id: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
  const clearFavorites = () => dispatch({ type: 'CLEAR_FAVORITES' });
  const setUserPreferences = (prefs: Partial<UserPreferences>) =>
    dispatch({ type: 'SET_USER_PREFERENCES', payload: prefs });
  const addOrderToHistory = (order: OrderHistoryItem) =>
    dispatch({ type: 'ADD_ORDER_TO_HISTORY', payload: order });
  const clearOrderHistory = () => dispatch({ type: 'CLEAR_ORDER_HISTORY' });
  
  const reorderFromHistory = (order: OrderHistoryItem) => {
    order.items.forEach(item => {
      dispatch({ 
        type: 'ADD_ITEM', 
        payload: {
          ...item,
          id: `combo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
      });
    });
  };

  const cartTotal = state.items.reduce(
    (total, item) => total + item.totalPrice * item.quantity,
    0
  );

  const cartCount = state.items.reduce((count, item) => count + item.quantity, 0);

  const favoritesCount = state.favorites.length;

  const isFavorite = (id: string) => state.favorites.includes(id);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleFavorite,
        clearFavorites,
        setUserPreferences,
        addOrderToHistory,
        clearOrderHistory,
        reorderFromHistory,
        cartTotal,
        cartCount,
        favoritesCount,
        orderHistory: state.orderHistory,
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
