import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';

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
}

export interface UserPreferences {
  location: string;
  phone: string;
  name: string;
  address: string;
  specialInstructions?: string;
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
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
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
  },
  orderHistory: [],
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
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
    case 'SET_USER_PREFERENCES':
      return {
        ...state,
        userPreferences: { ...state.userPreferences, ...action.payload },
      };
    case 'ADD_ORDER_TO_HISTORY':
      return {
        ...state,
        orderHistory: [action.payload, ...state.orderHistory].slice(0, 50), // Keep last 50 orders
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
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
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
          orderHistory: parsed.orderHistory || [],
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
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id: string, quantity: number) => 
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleFavorite = (id: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id });
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
        removeItem,
        updateQuantity,
        clearCart,
        toggleFavorite,
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
