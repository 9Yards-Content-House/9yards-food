import { useState, useMemo, useEffect } from 'react';
import { Heart, Plus, Search, X, ShoppingCart, Flame, TrendingUp, Utensils, Drumstick, GlassWater, Cake, Salad } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import ComboBuilder from '@/components/menu/ComboBuilder';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart } from '@/context/CartContext';

type Category = 'all' | 'main' | 'sauce' | 'juice' | 'dessert' | 'side';

// Category config with icons and colors
const categoryConfig: Record<string, { icon: React.ElementType; emoji: string }> = {
  all: { icon: Utensils, emoji: '🍽️' },
  main: { icon: Utensils, emoji: '🌾' },
  sauce: { icon: Drumstick, emoji: '🍖' },
  juice: { icon: GlassWater, emoji: '🥤' },
  dessert: { icon: Cake, emoji: '🍰' },
  side: { icon: Salad, emoji: '🥗' },
};

// Skeleton loader for menu cards
function MenuCardSkeleton() {
  return (
    <div className="card-premium animate-pulse">
      <div className="aspect-square bg-muted rounded-t-2xl" />
      <div className="p-4">
        <div className="h-5 bg-muted rounded w-3/4 mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-24" />
          <div className="h-5 bg-muted rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const { toggleFavorite, isFavorite, cartCount } = useCart();

  // Handle search params from SearchModal navigation
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const highlightParam = searchParams.get('highlight');
    const categoryParam = searchParams.get('category');

    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    if (highlightParam) {
      setHighlightedItem(highlightParam);
      // Clear highlight after 3 seconds
      const timer = setTimeout(() => setHighlightedItem(null), 3000);
      return () => clearTimeout(timer);
    }

    if (categoryParam) {
      const catMap: Record<string, Category> = {
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
  }, [searchParams]);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'main', label: 'Main Dishes' },
    { id: 'sauce', label: 'Sauces' },
    { id: 'juice', label: 'Juices' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'side', label: 'Side Dishes' },
  ];

  // Get item counts per category
  const categoryCounts = useMemo(() => ({
    all: menuData.mainDishes.length + menuData.sauces.length + menuData.juices.length + menuData.desserts.length + menuData.sideDishes.length,
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
      isBestSeller?: boolean;
      isPopular?: boolean;
    }> = [];

    if (activeCategory === 'all' || activeCategory === 'main') {
      menuData.mainDishes.forEach((d, index) =>
        items.push({ ...d, price: null, category: 'Main Dish', categoryType: 'main', isFree: false, isBestSeller: index === 0 })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'sauce') {
      menuData.sauces.forEach((s, index) =>
        items.push({
          id: s.id,
          name: s.name,
          image: s.image,
          price: s.basePrice,
          category: 'Sauce',
          categoryType: 'sauce',
          available: s.available,
          isBestSeller: index === 0,
          isPopular: index === 1,
        })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'juice') {
      menuData.juices.forEach((j, index) =>
        items.push({ ...j, category: 'Juice', categoryType: 'juice', isPopular: index === 0 })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'dessert') {
      menuData.desserts.forEach((d, index) =>
        items.push({ ...d, category: 'Dessert', categoryType: 'dessert', isPopular: index === 0 })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'side') {
      menuData.sideDishes.forEach((s) =>
        items.push({ ...s, price: null, category: 'Side Dish', categoryType: 'side', isFree: true })
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

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="pt-16 md:pt-20">
        {/* Hero Header */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container-custom px-4">
            <div
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Menu</h1>
              <p className="text-lg text-primary-foreground/80 mb-6 leading-relaxed">
                Explore our authentic Ugandan dishes, all made fresh with 100% natural
                ingredients. From savory main courses to refreshing juices.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={() => setIsComboBuilderOpen(true)}
                  className="btn-secondary inline-flex items-center gap-2 text-lg px-6 py-3"
                >
                  <Plus className="w-5 h-5" />
                  Build Your Combo
                </button>
                <span className="text-primary-foreground/60 text-sm">
                  {categoryCounts.all} delicious items available
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="sticky top-16 md:top-20 z-30 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="container-custom px-4 py-4">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search menu items..."
                  className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-border bg-background focus:border-secondary focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
              {categories.map((cat) => {
                const config = categoryConfig[cat.id];
                const count = categoryCounts[cat.id as Category];
                const isActive = activeCategory === cat.id;
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as Category)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border-2 min-h-[44px] hover:-translate-y-0.5 active:scale-[0.98] ${
                      isActive
                        ? 'bg-secondary text-secondary-foreground border-secondary shadow-md'
                        : 'bg-background text-muted-foreground border-border hover:border-secondary/50'
                    }`}
                  >
                    <span>{config.emoji}</span>
                    <span>{cat.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-secondary-foreground/20' : 'bg-muted'
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
        <section className="section-padding">
          <div className="container-custom">
            {/* Build Combo CTA Banner */}
            <div
              className="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-secondary to-orange-500 text-secondary-foreground shadow-xl overflow-hidden relative"
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to Order?</h3>
                  <p className="text-secondary-foreground/90 text-lg mb-4">
                    Build your perfect combo with main dishes, sauce, and free side dish!
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium">
                    <span className="flex items-center gap-1">✓ Choose Multiple Dishes</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">✓ Pick Your Sauce</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">✓ Free Side Included</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsComboBuilderOpen(true)}
                  className="bg-primary-foreground text-primary font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-[0.98] transition-all text-lg flex items-center gap-2"
                >
                  🍽️ Start Building
                </button>
              </div>
            </div>

            {/* Empty State */}
              {items.length === 0 ? (
                <div
                  className="text-center py-16"
                >
                  <div className="text-6xl mb-4">🔍</div>
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
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {items.map((item, index) => (
                    <div
                      key={`${item.category}-${item.id}`}
                      className={`card-premium food-card-hover group relative hover:-translate-y-2 transition-transform ${
                        highlightedItem === item.id 
                          ? 'ring-4 ring-secondary ring-offset-2 animate-pulse' 
                          : ''
                      }`}
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {/* Skeleton placeholder */}
                        {!loadedImages.has(item.id) && (
                          <div className="absolute inset-0 bg-muted animate-pulse" />
                        )}
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          onLoad={() => handleImageLoad(item.id)}
                          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                            loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className="absolute top-3 right-3 w-11 h-11 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-card transition-colors z-10"
                          aria-label={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart
                            className={`w-5 h-5 transition-colors ${
                              isFavorite(item.id)
                                ? 'text-secondary fill-secondary'
                                : 'text-foreground/70'
                            }`}
                          />
                        </button>

                        {/* Badges - Top Left */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {item.isBestSeller && (
                            <span className="bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                              <Flame className="w-3.5 h-3.5" />
                              Best Seller
                            </span>
                          )}
                          {item.isPopular && !item.isBestSeller && (
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                              <TrendingUp className="w-3.5 h-3.5" />
                              Popular
                            </span>
                          )}
                          {!item.isBestSeller && !item.isPopular && (
                            <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                              {item.category}
                            </span>
                          )}
                        </div>

                        {/* Free Badge for side dishes */}
                        {item.isFree && (
                          <span className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            ✓ FREE with combo
                          </span>
                        )}

                        {/* Quick Add Button (Desktop - on hover) */}
                        <button
                          onClick={() => setIsComboBuilderOpen(true)}
                          className="absolute bottom-3 left-3 right-3 bg-secondary text-secondary-foreground py-3 rounded-lg font-bold opacity-0 group-hover:opacity-100 hover:scale-[1.02] transition-all hidden lg:flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Plus className="w-5 h-5" />
                          Add to Order
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-bold text-foreground text-lg mb-2">{item.name}</h3>
                        
                        {/* Included message for main/side dishes */}
                        {(item.categoryType === 'main' || item.categoryType === 'side') && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.categoryType === 'side' 
                              ? 'Included free with every combo' 
                              : 'Choose as part of your combo'
                            }
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          {item.price ? (
                            <span className="text-xl font-bold text-secondary">
                              {item.category === 'Sauce' ? 'from ' : ''}
                              {formatPrice(item.price)}
                            </span>
                          ) : item.isFree ? (
                            <span className="text-lg font-bold text-green-600">
                              FREE
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm font-medium">
                              Part of combo
                            </span>
                          )}
                          
                          {/* Availability Badge */}
                          {item.available ? (
                            <span className="badge-available flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              Available
                            </span>
                          ) : (
                            <span className="badge-soldout">Sold Out</span>
                          )}
                        </div>

                        {/* Mobile Add Button */}
                        <button
                          onClick={() => setIsComboBuilderOpen(true)}
                          disabled={!item.available}
                          className="w-full mt-3 bg-secondary text-secondary-foreground py-3 rounded-lg font-bold lg:hidden flex items-center justify-center gap-2 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
                        >
                          {item.available ? (
                            <>
                              <Plus className="w-5 h-5" />
                              Add to Order
                            </>
                          ) : (
                            'Sold Out'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      
      {/* Floating Cart Button (Mobile) */}
        {cartCount > 0 && (
          <div
            className="fixed bottom-24 right-4 z-50 lg:hidden"
          >
            <Link
              to="/cart"
              className="w-16 h-16 bg-secondary text-secondary-foreground rounded-full shadow-2xl flex items-center justify-center relative hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
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
