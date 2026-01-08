import { useState, useMemo, useEffect } from "react";
import {
  Heart,
  Plus,
  Search,
  X,
  ShoppingCart,
  Flame,
  Utensils,
  Drumstick,
  GlassWater,
  Cake,
  Salad,
  Star,
} from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ComboBuilder from "@/components/menu/ComboBuilder";
import { menuData } from "@/data/menu";
import { formatPrice } from "@/lib/utils/order";
import { useCart, CartItem } from "@/context/CartContext";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import { vibrate } from "@/lib/utils/ui"; // Add import

type Category =
  | "all"
  | "lusaniya"
  | "main"
  | "sauce"
  | "juice"
  | "dessert"
  | "side";

// Category config with icons and colors
const categoryConfig: Record<
  string,
  { icon: React.ElementType; description: string }
> = {
  all: { icon: Utensils, description: "Browse all our delicious offerings" },
  lusaniya: { icon: Star, description: "Ready-to-eat signature dishes" },
  main: {
    icon: Utensils,
    description: "Choose your base - included with every combo",
  },
  sauce: {
    icon: Drumstick,
    description: "Select your protein - the heart of your meal",
  },
  juice: { icon: GlassWater, description: "100% natural, freshly squeezed" },
  dessert: { icon: Cake, description: "Sweet treats to complete your meal" },
  side: { icon: Salad, description: "Fresh accompaniments - free with combos" },
};

// Item descriptions for better context
// Best sellers and new items are now imported from @/data/menu
import { bestSellers, newItems, itemDescriptions } from "@/data/menu";
import { MenuItemCard } from "@/components/menu/MenuItemCard";

// Skeleton loader for menu cards
function MenuCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4">
        <div className="h-5 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2 mb-4" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-10 bg-muted rounded w-10" />
        </div>
      </div>
    </div>
  );
}

// Menu item card component for cleaner code


export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CartItem | undefined>(undefined);
  const { toggleFavorite, isFavorite, cartCount, addItem, removeItem, updateQuantity, state } =
    useCart();

  const [initialComboSelection, setInitialComboSelection] = useState<{ type: 'main' | 'sauce' | 'side'; id: string } | undefined>(undefined);

  // Handle Edit Mode from Navigation
  useEffect(() => {
    if (location.state?.editItem) {
      setEditingItem(location.state.editItem);
      setIsComboBuilderOpen(true);
      // Clean up state so refresh doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Check if an individual item is in cart
  const isIndividualInCart = (itemId: string, category: string) => {
    return state.items.some(
      (cartItem) =>
        cartItem.type === "single" &&
        cartItem.id.includes(`${category}-${itemId}`)
    );
  };

  const getIndividualCount = (itemId: string, category: string) => {
    const item = state.items.find(
      (cartItem) =>
        cartItem.type === "single" && cartItem.id === `${category}-${itemId}`
    );
    return item ? item.quantity : 0;
  };

  const handleRemoveIndividual = (itemId: string, category: string) => {
    const existingItem = state.items.find(
      (item) => item.type === "single" && item.id === `${category}-${itemId}`
    );
    
    if (existingItem) {
      if (existingItem.quantity > 1) {
        updateQuantity(existingItem.id, existingItem.quantity - 1);
      } else {
        removeItem(existingItem.id);
      }
      vibrate(50);
    }
  };

  // Handle search params from SearchModal navigation
  useEffect(() => {
    const searchParam = searchParams.get("search");
    const highlightParam = searchParams.get("highlight");
    const categoryParam = searchParams.get("category");
    const comboParam = searchParams.get("combo");

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Auto-open combo builder if combo param is present
    if (comboParam === "true") {
      setIsComboBuilderOpen(true);
      // Clear the combo param from URL to allow re-triggering
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("combo");
      setSearchParams(newParams, { replace: true });
    }

    if (highlightParam) {
      setHighlightedItem(highlightParam);

      // Scroll to the highlighted item after a brief delay for rendering
      setTimeout(() => {
        const element = document.querySelector(
          `[data-item-id="${highlightParam}"]`
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      // Clear highlight after 3 seconds
      const timer = setTimeout(() => setHighlightedItem(null), 3000);
      return () => clearTimeout(timer);
    }

    if (categoryParam) {
      const catMap: Record<string, Category> = {
        lusaniya: "lusaniya",
        "main dish": "main",
        sauce: "sauce",
        juice: "juice",
        dessert: "dessert",
        side: "side",
      };
      if (catMap[categoryParam]) {
        setActiveCategory(catMap[categoryParam]);
      }
    }
  }, [searchParams, setSearchParams]);

  // Scroll to top on category change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeCategory]);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "lusaniya", label: "Lusaniya" },
    { id: "main", label: "Main Dishes" },
    { id: "sauce", label: "Sauces" },
    { id: "juice", label: "Juices" },
    { id: "dessert", label: "Desserts" },
    { id: "side", label: "Side Dishes" },
  ];

  // Get item counts per category
  const categoryCounts = useMemo(
    () => ({
      all:
        menuData.mainDishes.length +
        menuData.sauces.length +
        menuData.juices.length +
        menuData.desserts.length +
        menuData.sideDishes.length +
        menuData.lusaniya.length,
      lusaniya: menuData.lusaniya.length,
      main: menuData.mainDishes.length,
      sauce: menuData.sauces.length,
      juice: menuData.juices.length,
      dessert: menuData.desserts.length,
      side: menuData.sideDishes.length,
    }),
    []
  );

  const getFilteredItems = () => {
    const items: Array<{
      id: string;
      name: string;
      image: string;
      price: number | null;
      category: string;
      categoryType: Category;
      available: boolean;
      isFree?: boolean;
      description?: string;
      isIndividual?: boolean;
    }> = [];

    // Lusaniya items first (signature dishes)
    if (activeCategory === "all" || activeCategory === "lusaniya") {
      menuData.lusaniya.forEach((l) =>
        items.push({
          id: l.id,
          name: l.name,
          image: l.image,
          price: l.price,
          category: "Lusaniya",
          categoryType: "lusaniya",
          available: l.available,
          description: l.description,
          isIndividual: true,
        })
      );
    }

    if (activeCategory === "all" || activeCategory === "main") {
      menuData.mainDishes.forEach((d) =>
        items.push({
          ...d,
          price: null,
          category: "Main Dish",
          categoryType: "main",
          isFree: false,
          description: d.description || itemDescriptions[d.id],
        })
      );
    }
    if (activeCategory === "all" || activeCategory === "sauce") {
      menuData.sauces.forEach((s) =>
        items.push({
          id: s.id,
          name: s.name,
          image: s.image,
          price: s.basePrice,
          category: "Sauce",
          categoryType: "sauce",
          available: s.available,
          description: s.description || itemDescriptions[s.id],
        })
      );
    }
    if (activeCategory === "all" || activeCategory === "juice") {
      menuData.juices.forEach((j) =>
        items.push({
          ...j,
          category: "Juice",
          categoryType: "juice",
          description: j.description || itemDescriptions[j.id],
          isIndividual: true,
        })
      );
    }
    if (activeCategory === "all" || activeCategory === "dessert") {
      menuData.desserts.forEach((d) =>
        items.push({
          ...d,
          category: "Dessert",
          categoryType: "dessert",
          description: d.description || itemDescriptions[d.id],
          isIndividual: true,
        })
      );
    }
    if (activeCategory === "all" || activeCategory === "side") {
      menuData.sideDishes.forEach((s) =>
        items.push({
          ...s,
          price: null,
          category: "Side Dish",
          categoryType: "side",
          isFree: true,
          description: s.description || itemDescriptions[s.id],
        })
      );
    }

    return items;
  };

  // Filter items by search query
  const items = useMemo(() => {
    const allItems = getFilteredItems();
    if (!searchQuery.trim()) return allItems;

    const query = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleIndividualAddToCart = (item: {
    id: string;
    name: string;
    price: number | null;
    description?: string;
    categoryType: string;
  }) => {
    if (!item.price) return;

    const cartItem = {
      id: `${item.categoryType}-${item.id}`,
      type: "single" as const,
      mainDishes: [item.name],
      sauce: null,
      sideDish: "",
      extras: [],
      quantity: 1,
      totalPrice: item.price,
      description: item.description || "",
    };

    addItem(cartItem);
    toast.success(`${item.name} added to order!`, {
      description: formatPrice(item.price),
      action: {
        label: "View Order",
        onClick: () => (window.location.href = "/cart"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <SEO
        title="Our Menu | Authentic Ugandan Dishes & Combos"
        description="Explore our diverse menu of authentic Ugandan food. Build your own combo with Matooke, Rice, Beef, Chicken, Fish and more."
        url="/menu"
      />
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Header - More compact */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <div className="container-custom px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Discover Authentic Ugandan Flavors
              </h1>
              <p className="text-base md:text-lg text-primary-foreground/80 mb-4 leading-relaxed">
                Choose your dishes, build your combo, enjoy authentic flavors.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() => setIsComboBuilderOpen(true)}
                  className="btn-secondary inline-flex items-center gap-2 text-base px-5 py-2.5"
                >
                  <Plus className="w-5 h-5" />
                  Build My Combo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="sticky top-16 md:top-20 z-30 bg-card/95 backdrop-blur-md border-b border-border">
          <div className="container-custom px-4 py-3">
            {/* Search Bar */}
            <div className="mb-3">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find your favorite dish..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm focus:border-secondary focus:ring-1 focus:ring-secondary/20 focus:outline-none transition-all"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs - Horizontal scroll */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4">
              {categories.map((cat) => {
                const config = categoryConfig[cat.id];
                const count = categoryCounts[cat.id as Category];
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as Category)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border min-h-[40px] flex-shrink-0 ${
                      isActive
                        ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                        : "bg-card text-muted-foreground border-border hover:border-secondary/50 hover:bg-secondary/5"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                        isActive ? "bg-white/20" : "bg-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="py-6 md:py-8">
          <div className="container-custom px-4">
            {/* Build Combo CTA Banner */}
            <div className="mb-8 p-5 md:p-8 rounded-2xl bg-secondary text-white shadow-lg overflow-hidden relative">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    Create Your Custom Meal
                  </h3>
                  <p className="text-white/90 text-sm md:text-base mb-3 md:mb-0">
                    Customize your perfect meal with unlimited mains, your
                    choice of sauce, and a complimentary side dish.
                  </p>
                  <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium mt-3 text-white/80">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>{" "}
                      Choose Multiple Mains
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>{" "}
                      Fresh Protein Sauce
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>{" "}
                      Complimentary Side
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsComboBuilderOpen(true)}
                  className="w-full md:w-auto bg-white text-secondary font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl border-2 border-white hover:bg-white/90 transition-colors text-base md:text-lg flex items-center justify-center gap-2"
                >
                  Create My Meal →
                </button>
              </div>
            </div>

            {/* Category Header (when filtered) */}
            {activeCategory !== "all" && (
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {categories.find((c) => c.id === activeCategory)?.label}
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {categoryConfig[activeCategory].description}
                </p>
              </div>
            )}

            {/* Empty State */}
            {items.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  No items found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Try adjusting your search or filter to find what you're
                  looking for
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="btn-secondary"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Results count */}
                {searchQuery && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {items.length} {items.length === 1 ? "result" : "results"}{" "}
                    for "{searchQuery}"
                  </p>
                )}

                {/* Menu Grid - 3 cols desktop, 2 tablet, 2 mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {items.map((item) => (
                    <MenuItemCard
                      key={`${item.category}-${item.id}`}
                      item={item}
                      onAddToOrder={() => {
                let type: 'main' | 'sauce' | 'side' | undefined;
                if (item.categoryType === 'main') type = 'main';
                else if (item.categoryType === 'sauce') type = 'sauce';
                else if (item.categoryType === 'side') type = 'side';
                
                if (type) {
                    setInitialComboSelection({ type, id: item.id });
                }
                setIsComboBuilderOpen(true);
            }}
                      onAddToCart={
                        item.isIndividual
                          ? () => handleIndividualAddToCart(item)
                          : undefined
                      }
                      isInCart={
                        item.isIndividual
                          ? isIndividualInCart(item.id, item.categoryType)
                          : false
                      }
                      onToggleFavorite={toggleFavorite}
                      isFavorite={isFavorite(item.id)}
                      isHighlighted={highlightedItem === item.id}
                      lusaniyaCount={
                        item.isIndividual
                          ? getIndividualCount(item.id, item.categoryType)
                          : 0
                      }
                      onRemoveLusaniya={
                        item.isIndividual
                          ? () =>
                              handleRemoveIndividual(item.id, item.categoryType)
                          : undefined
                      }
                    />
                  ))}
                </div>

                {/* End of list indicator */}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />

      {/* Sticky Build Combo Button (Mobile) */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 lg:hidden w-auto sm:bottom-32">
        <button
          onClick={() => setIsComboBuilderOpen(true)}
          className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Start Order</span>
        </button>
      </div>

      <ComboBuilder
        isOpen={isComboBuilderOpen}
        onClose={() => {
            setIsComboBuilderOpen(false);
            setEditingItem(undefined);
            setInitialComboSelection(undefined);
        }}
        initialData={editingItem}
        initialSelection={initialComboSelection}
      />
    </div>
  );
}
