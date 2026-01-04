import { useState, useMemo, useEffect } from 'react';
import { Heart, Plus, Search, X, ShoppingCart, Flame, Utensils, Drumstick, GlassWater, Cake, Salad, Star } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import ComboBuilder from '@/components/menu/ComboBuilder';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

type Category = 'all' | 'lusaniya' | 'main' | 'sauce' | 'juice' | 'dessert' | 'side';

// Category config with icons and colors
const categoryConfig: Record<string, { icon: React.ElementType; description: string }> = {
  all: { icon: Utensils, description: 'Browse all our delicious offerings' },
  lusaniya: { icon: Star, description: 'Ready-to-eat signature dishes' },
  main: { icon: Utensils, description: 'Choose your base - included with every combo' },
  sauce: { icon: Drumstick, description: 'Select your protein - the heart of your meal' },
  juice: { icon: GlassWater, description: '100% natural, freshly squeezed' },
  dessert: { icon: Cake, description: 'Sweet treats to complete your meal' },
  side: { icon: Salad, description: 'Fresh accompaniments - free with combos' },
};

// Item descriptions for better context
const itemDescriptions: Record<string, string> = {
  // Lusaniya items
  'whole-chicken-lusaniya': 'Full chicken mixed with Pilao and Kachumbari',
  'beef-lusaniya': 'Cow beef with pilao and Kachumbari',
  // Main dishes
  matooke: 'Traditional steamed green bananas',
  posho: 'Smooth cornmeal, Ugandan staple',
  cassava: 'Soft boiled cassava root',
  yam: 'Tender yam slices',
  'sweet-potatoes': 'Naturally sweet & nutritious',
  'irish-potatoes': 'Classic boiled potatoes',
  rice: 'Fluffy white rice',
  // Sauces
  meat: 'Tender beef, your choice of style',
  chicken: 'Juicy chicken, perfectly seasoned',
  fish: 'Fresh Nile perch, fried or steamed',
  gnuts: 'Rich groundnut sauce, authentic recipe',
  'cow-peas': 'Traditional peas in savory sauce',
  liver: 'Tender liver, rich in flavor',
  // Juices
  mango: '100% natural, no preservatives',
  passion: 'Tangy & refreshing',
  pineapple: 'Sweet tropical goodness',
  watermelon: 'Cool & hydrating',
  mixed: 'Best of all fruits',
  cocktail: 'Premium fruit blend',
  // Desserts
  mandazi: 'Soft African donuts',
  rolex: 'Famous egg & chapati roll',
  samosa: 'Crispy savory pastry',
  // Sides
  greens: 'Fresh amaranth greens',
  beans: 'Slow-cooked kidney beans',
  cabbage: 'Lightly seasoned steamed cabbage',
  sukuma: 'Kenyan-style collard greens',
};

// Best sellers - only top items (be selective)
const bestSellers = ['fish', 'chicken', 'matooke', 'whole-chicken-lusaniya'];
const newItems: string[] = ['beef-lusaniya']; // Add item IDs here when you have new items

// Skeleton loader for menu cards
function MenuCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border animate-pulse">
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
interface MenuItemCardProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: number | null;
    category: string;
    categoryType: Category;
    available: boolean;
    isFree?: boolean;
    description?: string;
    isLusaniya?: boolean;
  };
  onAddToOrder: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  isHighlighted: boolean;
  imageLoaded: boolean;
  onImageLoad: () => void;
}

function MenuItemCard({ 
  item, 
  onAddToOrder,
  onAddToCart,
  isInCart,
  onToggleFavorite, 
  isFavorite, 
  isHighlighted,
  imageLoaded,
  onImageLoad 
}: MenuItemCardProps) {
  const isBestSeller = bestSellers.includes(item.id);
  const isNew = newItems.includes(item.id);
  const isLusaniya = item.isLusaniya || item.categoryType === 'lusaniya';
  
  // Get description - use item.description for Lusaniya items
  const description = item.description || itemDescriptions[item.id] || item.category;
  
  // Determine price display based on item type
  const getPriceDisplay = () => {
    if (item.isFree) {
      return (
        <span className="inline-flex items-center gap-1 text-green-600 font-semibold text-sm">
          FREE
        </span>
      );
    }
    if (item.price) {
      // Sauces show the base price (determines combo cost)
      if (item.categoryType === 'sauce') {
        return <span className="text-secondary font-bold text-base">{formatPrice(item.price)}</span>;
      }
      // Juices and desserts
      if (item.categoryType === 'juice' || item.categoryType === 'dessert') {
        return <span className="text-secondary font-bold text-base">{formatPrice(item.price)}</span>;
      }
      return <span className="text-secondary font-bold text-base">{formatPrice(item.price)}</span>;
    }
    // Main dishes - included in combo
    return <span className="text-muted-foreground font-medium text-sm">Combo base</span>;
  };
  
  // Get category label for card
  const getCategoryLabel = () => {
    switch (item.categoryType) {
      case 'lusaniya': return 'Signature';
      case 'main': return 'Base';
      case 'sauce': return 'Protein';
      case 'juice': return 'Add-on';
      case 'dessert': return 'Add-on';
      case 'side': return 'Included';
      default: return item.category;
    }
  };

  return (
    <div
      data-item-id={item.id}
      onClick={() => {
        if (!item.available) return;
        if (isLusaniya && onAddToCart && !isInCart) {
          onAddToCart();
        } else if (!isLusaniya) {
          onAddToOrder();
        }
      }}
      className={`group relative bg-card rounded-2xl overflow-hidden border border-border 
        hover:border-secondary/50 transition-all duration-200 flex flex-col
        ${item.available ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${isHighlighted ? 'ring-4 ring-secondary ring-offset-2 animate-pulse' : ''}
        ${!item.available ? 'opacity-60' : ''}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* Skeleton placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          onLoad={onImageLoad}
          className={`w-full h-full object-cover 
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            ${!item.available ? 'grayscale' : ''}`}
        />
        
        {/* Sold out overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-black/70 text-white text-sm font-bold px-4 py-2 rounded-full border border-white/20">
              Sold Out
            </span>
          </div>
        )}

        {/* Badge - Top Left */}
        <div className="absolute top-2.5 left-2.5">
          {item.available && isBestSeller && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" />
              Popular
            </span>
          )}
          {item.available && isNew && !isBestSeller && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              New
            </span>
          )}
          {item.isFree && item.available && !isBestSeller && !isNew && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">
              FREE
            </span>
          )}
        </div>

        {/* Favorite Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full 
            flex items-center justify-center hover:bg-white transition-colors z-10"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-500 dark:text-gray-300'
            }`}
          />
        </button>
        
        {/* Tap indicator on hover - desktop only */}
        {item.available && !isLusaniya && (
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hidden md:flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add to Combo
            </span>
          </div>
        )}
        
        {/* Tap indicator on hover for Lusaniya items - desktop only */}
        {item.available && isLusaniya && (
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hidden md:flex items-center gap-1.5">
              {isInCart ? (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  In Cart
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add to Cart
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Category tag */}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
          {getCategoryLabel()}
        </span>
        
        {/* Name */}
        <h3 className="font-bold text-foreground text-sm md:text-base leading-tight mb-0.5 line-clamp-1">
          {item.name}
        </h3>
        
        {/* Description */}
        <p className="text-muted-foreground text-xs md:text-sm line-clamp-1 mb-2">
          {description}
        </p>
        
        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          {getPriceDisplay()}
          
          {/* Add to Cart button for Lusaniya items */}
          {item.available && isLusaniya && onAddToCart && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isInCart) {
                  onAddToCart();
                }
              }}
              className={`text-xs font-bold px-3 py-2 rounded-full transition-all ${
                isInCart 
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-105 active:scale-95'
              }`}
            >
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
          )}
          
          {/* Visual indicator for tappable - non-Lusaniya items */}
          {item.available && !isLusaniya && (
            <span className="text-muted-foreground text-[10px] md:text-xs flex items-center gap-1 md:hidden">
              Tap to add
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { toggleFavorite, isFavorite, cartCount, addItem, state } = useCart();

  // Check if a Lusaniya item is in cart
  const isLusaniyaInCart = (itemId: string) => {
    return state.items.some(cartItem => 
      cartItem.type === 'single' && cartItem.id.includes(`lusaniya-${itemId}`)
    );
  };

  // Handle search params from SearchModal navigation
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const highlightParam = searchParams.get('highlight');
    const categoryParam = searchParams.get('category');
    const comboParam = searchParams.get('combo');

    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Auto-open combo builder if combo param is present
    if (comboParam === 'true') {
      setIsComboBuilderOpen(true);
      // Clear the combo param from URL to allow re-triggering
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('combo');
      setSearchParams(newParams, { replace: true });
    }
    
    if (highlightParam) {
      setHighlightedItem(highlightParam);
      
      // Scroll to the highlighted item after a brief delay for rendering
      setTimeout(() => {
        const element = document.querySelector(`[data-item-id="${highlightParam}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
      
      // Clear highlight after 3 seconds
      const timer = setTimeout(() => setHighlightedItem(null), 3000);
      return () => clearTimeout(timer);
    }

    if (categoryParam) {
      const catMap: Record<string, Category> = {
        'lusaniya': 'lusaniya',
        'main dish': 'main',
        'sauce': 'sauce',
        'juice': 'juice',
        'dessert': 'dessert',
        'side': 'side',
      };
      if (catMap[categoryParam]) {
        setActiveCategory(catMap[categoryParam]);
      }
    }
  }, [searchParams, setSearchParams]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'lusaniya', label: 'Lusaniya' },
    { id: 'main', label: 'Main Dishes' },
    { id: 'sauce', label: 'Sauces' },
    { id: 'juice', label: 'Juices' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'side', label: 'Side Dishes' },
  ];

  // Get item counts per category
  const categoryCounts = useMemo(() => ({
    all: menuData.mainDishes.length + menuData.sauces.length + menuData.juices.length + menuData.desserts.length + menuData.sideDishes.length + menuData.lusaniya.length,
    lusaniya: menuData.lusaniya.length,
    main: menuData.mainDishes.length,
    sauce: menuData.sauces.length,
    juice: menuData.juices.length,
    dessert: menuData.desserts.length,
    side: menuData.sideDishes.length,
  }), []);

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
      isLusaniya?: boolean;
    }> = [];

    // Lusaniya items first (signature dishes)
    if (activeCategory === 'all' || activeCategory === 'lusaniya') {
      menuData.lusaniya.forEach((l) =>
        items.push({
          id: l.id,
          name: l.name,
          image: l.image,
          price: l.price,
          category: 'Lusaniya',
          categoryType: 'lusaniya',
          available: l.available,
          description: l.description,
          isLusaniya: true,
        })
      );
    }

    if (activeCategory === 'all' || activeCategory === 'main') {
      menuData.mainDishes.forEach((d) =>
        items.push({ 
          ...d, 
          price: null, 
          category: 'Main Dish', 
          categoryType: 'main', 
          isFree: false,
          description: itemDescriptions[d.id]
        })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'sauce') {
      menuData.sauces.forEach((s) =>
        items.push({
          id: s.id,
          name: s.name,
          image: s.image,
          price: s.basePrice,
          category: 'Sauce',
          categoryType: 'sauce',
          available: s.available,
          description: itemDescriptions[s.id]
        })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'juice') {
      menuData.juices.forEach((j) =>
        items.push({ 
          ...j, 
          category: 'Juice', 
          categoryType: 'juice',
          description: itemDescriptions[j.id]
        })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'dessert') {
      menuData.desserts.forEach((d) =>
        items.push({ 
          ...d, 
          category: 'Dessert', 
          categoryType: 'dessert',
          description: itemDescriptions[d.id]
        })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'side') {
      menuData.sideDishes.forEach((s) =>
        items.push({ 
          ...s, 
          price: null, 
          category: 'Side Dish', 
          categoryType: 'side', 
          isFree: true,
          description: itemDescriptions[s.id]
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
    return allItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [activeCategory, searchQuery]);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Handle adding Lusaniya items directly to cart
  const handleAddLusaniyaToCart = (item: { id: string; name: string; price: number | null; description?: string }) => {
    if (!item.price) return;
    
    // Check if already in cart
    if (isLusaniyaInCart(item.id)) {
      toast.info(`${item.name} is already in your cart`);
      return;
    }
    
    const cartItem = {
      id: `lusaniya-${item.id}-${Date.now()}`,
      type: 'single' as const,
      mainDishes: [item.name],
      sauce: null,
      sideDish: '',
      extras: [],
      quantity: 1,
      totalPrice: item.price,
      description: item.description || '',
    };
    
    addItem(cartItem);
    toast.success(`${item.name} added to cart!`, {
      description: formatPrice(item.price),
      action: {
        label: 'View Cart',
        onClick: () => window.location.href = '/cart',
      },
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Header - More compact */}
        <section className="bg-primary text-primary-foreground py-8 md:py-12">
          <div className="container-custom px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">Discover Authentic Ugandan Flavors</h1>
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
                        ? 'bg-secondary text-secondary-foreground border-secondary shadow-md'
                        : 'bg-card text-muted-foreground border-border hover:border-secondary/50 hover:bg-secondary/5'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-muted'
                    }`}>
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
            <div
              className="mb-8 p-5 md:p-8 rounded-2xl bg-secondary text-white shadow-lg overflow-hidden relative"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 relative z-10">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">Create Your Custom Meal</h3>
                  <p className="text-white/90 text-sm md:text-base mb-3 md:mb-0">
                    Customize your perfect meal with unlimited mains, your choice of sauce, and a complimentary side dish.
                  </p>
                  <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium mt-3 text-white/80">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> Choose Multiple Mains</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> Fresh Protein Sauce</span>
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-white rounded-full"></span> Complimentary Side</span>
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
            {activeCategory !== 'all' && (
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {categories.find(c => c.id === activeCategory)?.label}
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
                  Try adjusting your search or filter to find what you're looking for
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
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
                    {items.length} {items.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                  </p>
                )}
                
                {/* Menu Grid - 3 cols desktop, 2 tablet, 2 mobile */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {items.map((item) => (
                    <MenuItemCard
                      key={`${item.category}-${item.id}`}
                      item={item}
                      onAddToOrder={() => setIsComboBuilderOpen(true)}
                      onAddToCart={item.isLusaniya ? () => handleAddLusaniyaToCart(item) : undefined}
                      isInCart={item.isLusaniya ? isLusaniyaInCart(item.id) : false}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={isFavorite(item.id)}
                      isHighlighted={highlightedItem === item.id}
                      imageLoaded={loadedImages.has(item.id)}
                      onImageLoad={() => handleImageLoad(item.id)}
                    />
                  ))}
                </div>

                {/* End of list indicator */}
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      
      {/* Floating Cart Button (Mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 right-4 z-40 lg:hidden">
          <Link
            to="/cart"
            className="w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-xl flex items-center justify-center relative hover:scale-110 active:scale-95 transition-transform"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          </Link>
        </div>
      )}

      <ComboBuilder
        isOpen={isComboBuilderOpen}
        onClose={() => setIsComboBuilderOpen(false)}
      />
    </div>
  );
}
