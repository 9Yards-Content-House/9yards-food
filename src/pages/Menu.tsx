import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Plus, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import ComboBuilder from '@/components/menu/ComboBuilder';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart } from '@/context/CartContext';

type Category = 'all' | 'main' | 'sauce' | 'juice' | 'dessert' | 'side';

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useCart();

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'main', label: 'Main Dishes' },
    { id: 'sauce', label: 'Sauces' },
    { id: 'juice', label: 'Juices' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'side', label: 'Side Dishes' },
  ];

  const getFilteredItems = () => {
    const items: Array<{
      id: string;
      name: string;
      image: string;
      price: number | null;
      category: string;
      available: boolean;
      isFree?: boolean;
    }> = [];

    if (activeCategory === 'all' || activeCategory === 'main') {
      menuData.mainDishes.forEach((d) =>
        items.push({ ...d, price: null, category: 'Main Dish', isFree: false })
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
          available: s.available,
        })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'juice') {
      menuData.juices.forEach((j) =>
        items.push({ ...j, category: 'Juice' })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'dessert') {
      menuData.desserts.forEach((d) =>
        items.push({ ...d, category: 'Dessert' })
      );
    }
    if (activeCategory === 'all' || activeCategory === 'side') {
      menuData.sideDishes.forEach((s) =>
        items.push({ ...s, price: null, category: 'Side Dish', isFree: true })
      );
    }

    return items;
  };

  const items = getFilteredItems();

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-12 md:py-16">
          <div className="container-custom px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Menu</h1>
              <p className="text-primary-foreground/70 mb-6">
                Explore our authentic Ugandan dishes, all made fresh with 100% natural
                ingredients.
              </p>
              <button
                onClick={() => setIsComboBuilderOpen(true)}
                className="btn-secondary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Build Your Combo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 md:top-20 z-30 bg-card/95 backdrop-blur-md border-b border-border">
          <div className="container-custom px-4 py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as Category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="section-padding">
          <div className="container-custom">
            {/* Build Combo CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 rounded-2xl gradient-cta text-secondary-foreground"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">Ready to Order?</h3>
                  <p className="text-secondary-foreground/80 text-sm">
                    Build your perfect combo with main dishes, sauce, and free side dish
                  </p>
                </div>
                <button
                  onClick={() => setIsComboBuilderOpen(true)}
                  className="bg-primary-foreground text-primary font-semibold px-6 py-3 rounded-lg hover:bg-primary-foreground/90 transition-colors"
                >
                  Start Building
                </button>
              </div>
            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.category}-${item.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-premium food-card-hover group"
                >
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-card transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          isFavorite(item.id)
                            ? 'text-secondary fill-secondary'
                            : 'text-foreground/70'
                        }`}
                      />
                    </button>

                    {/* Category */}
                    <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>

                    {/* Free Badge */}
                    {item.isFree && (
                      <span className="absolute bottom-3 left-3 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        FREE with combo
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-foreground mb-1">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      {item.price ? (
                        <span className="text-secondary font-bold">
                          {item.category === 'Sauce' ? 'from ' : ''}
                          {formatPrice(item.price)}
                        </span>
                      ) : item.isFree ? (
                        <span className="text-secondary font-semibold text-sm">
                          Included
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Part of combo
                        </span>
                      )}
                      {item.available ? (
                        <span className="badge-available">Available</span>
                      ) : (
                        <span className="badge-soldout">Sold Out</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
      <ComboBuilder
        isOpen={isComboBuilderOpen}
        onClose={() => setIsComboBuilderOpen(false)}
      />
    </div>
  );
}
