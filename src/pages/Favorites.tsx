import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import SEO from '@/components/SEO';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/context/CartContext';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';

export default function FavoritesPage() {
  const { state, toggleFavorite } = useCart();

  // Get all items with their details
  const allItems = [
    ...menuData.mainDishes.map((d) => ({ ...d, price: null, category: 'Main Dish' })),
    ...menuData.sauces.map((s) => ({ id: s.id, name: s.name, image: s.image, price: s.basePrice, category: 'Sauce', available: s.available })),
    ...menuData.juices.map((j) => ({ ...j, category: 'Juice' })),
    ...menuData.desserts.map((d) => ({ ...d, category: 'Dessert' })),
    ...menuData.sideDishes.map((s) => ({ ...s, price: null, category: 'Side Dish' })),
  ];

  const favoriteItems = allItems.filter((item) => state.favorites.includes(item.id));

  if (favoriteItems.length === 0) {
    return (
      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <SEO 
          title="My Favorites | 9Yards Food"
          description="Your favorite authentic Ugandan dishes saved for quick ordering."
          url="/favorites"
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
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title="My Favorites | 9Yards Food"
        description="Your favorite authentic Ugandan dishes saved for quick ordering."
        url="/favorites"
      />
      <Header />
      <main className="pt-16 md:pt-20">
        <div className="container-custom section-padding">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            My Favorites ({favoriteItems.length})
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className="card-premium food-card-hover group"
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-border/50 hover:bg-destructive/10 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-secondary fill-secondary" />
                  </button>
                  <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                  {item.price && (
                    <span className="text-secondary font-bold">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
