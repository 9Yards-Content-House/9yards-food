import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type GuestPreferences = {
  dietary?: string[];
  spiciness?: "mild" | "medium" | "hot";
};

type GuestContextType = {
  userName: string;
  setUserName: (name: string) => void;
  favorites: string[]; // Array of item IDs
  toggleFavorite: (itemId: string) => void;
  orderHistory: string[]; // Array of order IDs
  addOrder: (orderId: string) => void;
  preferences: GuestPreferences;
  updatePreferences: (prefs: Partial<GuestPreferences>) => void;
  isLoading: boolean;
};

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserNameState] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderHistory, setOrderHistory] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<GuestPreferences>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const storedName = localStorage.getItem("guest_name");
        const storedFavs = localStorage.getItem("guest_favorites");
        const storedOrders = localStorage.getItem("guest_orders");
        const storedPrefs = localStorage.getItem("guest_prefs");

        if (storedName) setUserNameState(storedName);
        if (storedFavs) setFavorites(JSON.parse(storedFavs));
        if (storedOrders) setOrderHistory(JSON.parse(storedOrders));
        if (storedPrefs) setPreferences(JSON.parse(storedPrefs));
      } catch (e) {
        console.error("Failed to load guest data", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Setters with persistence
  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem("guest_name", name);
  };

  const toggleFavorite = (itemId: string) => {
    setFavorites((prev) => {
      const newFavs = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId];
      localStorage.setItem("guest_favorites", JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const addOrder = (orderId: string) => {
    setOrderHistory((prev) => {
      const newOrders = [orderId, ...prev].slice(0, 50); // Keep last 50 orders
      localStorage.setItem("guest_orders", JSON.stringify(newOrders));
      return newOrders;
    });
  };

  const updatePreferences = (prefs: Partial<GuestPreferences>) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev, ...prefs };
      localStorage.setItem("guest_prefs", JSON.stringify(newPrefs));
      return newPrefs;
    });
  };

  return (
    <GuestContext.Provider
      value={{
        userName,
        setUserName,
        favorites,
        toggleFavorite,
        orderHistory,
        addOrder,
        preferences,
        updatePreferences,
        isLoading,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error("useGuest must be used within a GuestProvider");
  }
  return context;
};
