import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import Footer from '@/components/layout/Footer';
import { useCart, CartItem } from '@/context/CartContext';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { MenuItemCard, Category } from '@/components/menu/MenuItemCard';
import ComboBuilder from '@/components/menu/ComboBuilder';
import { toast } from 'sonner';
import { vibrate } from '@/lib/utils/ui';

export default function FavoritesPage() {
  const { state, toggleFavorite, isFavorite, addItem, removeItem, updateQuantity, cartCount } = useCart();
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const [initialComboSelection, setInitialComboSelection] = useState<{ type: 'main' | 'sauce' | 'side'; id: string } | undefined>(undefined);


  // Get all items with their details
  const allItems = [
    ...menuData.mainDishes.map((d) => ({ ...d, price: null, category: 'Main Dish', categoryType: 'main' as Category, available: d.available })),
    ...menuData.sauces.map((s) => ({ id: s.id, name: s.name, image: s.image, price: s.basePrice, category: 'Sauce', categoryType: 'sauce' as Category, available: s.available })),
    ...menuData.juices.map((j) => ({ ...j, categoryType: 'juice' as Category, category: 'Juice' })),
    ...menuData.desserts.map((d) => ({ ...d, categoryType: 'dessert' as Category, category: 'Dessert' })),
    ...menuData.lusaniya.map((l) => ({ ...l, categoryType: 'lusaniya' as Category, category: 'Lusaniya', available: l.available })),
    ...menuData.sideDishes.map((s) => ({ ...s, price: null, categoryType: 'side' as Category, category: 'Side Dish' })),
  ];

  const favoriteItems = allItems.filter((item) => state.favorites.includes(item.id));

  // Handle Add to Cart Logic (shared with Menu)
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

  const handleIndividualAddToCart = (item: any) => {
    // Generate ID for single item
    const itemId = `${item.category}-${item.id}`;
    
    // Check if already in cart
    const existingItem = state.items.find(
      (cartItem) => cartItem.type === "single" && cartItem.id === itemId
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1);
      toast.success(`Added another ${item.name}`);
      vibrate(50);
    } else {
      const cartItem: CartItem = {
        id: itemId,
        name: item.name,
        type: "single",
        price: item.price || 0,
        totalPrice: item.price || 0,
        quantity: 1,
        image: item.image, // Pass image for cart
        description: item.description, // Pass description
        extras: [],
      };
      addItem(cartItem);
      toast.success(`${item.name} added to order`);
      vibrate(100);
    }
  };

  if (favoriteItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <SEO 
          title={pageMetadata.favorites.title}
          description={pageMetadata.favorites.description}
          keywords={pageMetadata.favorites.keywords}
          url={pageMetadata.favorites.canonicalUrl}
          noIndex={pageMetadata.favorites.noIndex}
        />
        <Header />
        <main className="pt-16 md:pt-20">
          <div className="container-custom section-padding text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                No Favorites Yet
              </h1>
              <p className="text-muted-foreground mb-8">
                Start adding your favorite dishes by tapping the heart icon on any menu item.
              </p>
              <Link to="/menu" className="btn-secondary inline-block">
                Browse Menu
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <SEO 
        title={pageMetadata.favorites.title}
        description={pageMetadata.favorites.description}
        keywords={pageMetadata.favorites.keywords}
        url={pageMetadata.favorites.canonicalUrl}
        noIndex={pageMetadata.favorites.noIndex}
      />
      <Header />
      <main className="pt-16 md:pt-20">
        <div className="container-custom section-padding">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            My Favorites ({favoriteItems.length})
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {favoriteItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={{
                    ...item,
                    categoryType: item.categoryType as Category, // Ensure type safety
                    // Only Lusaniya, Juice, and Dessert are truly individual. 
                    // Sauces (Proteins) should trigger combo builder.
                    isIndividual: ['lusaniya', 'juice', 'dessert'].includes(item.categoryType)
                }}
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
                onAddToCart={() => handleIndividualAddToCart(item)}
                isInCart={isIndividualInCart(item.id, item.category)}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(item.id)}
                isHighlighted={false}
                lusaniyaCount={getIndividualCount(item.id, item.category)} 
                onRemoveLusaniya={() => handleRemoveIndividual(item.id, item.category)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Combo Builder Modal */}
      <ComboBuilder
        isOpen={isComboBuilderOpen}
        onClose={() => {
            setIsComboBuilderOpen(false);
            setInitialComboSelection(undefined);
        }}
        initialSelection={initialComboSelection}
      />
      
      <Footer />
    </div>
  );
}
