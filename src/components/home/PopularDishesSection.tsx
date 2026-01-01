import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Heart, Flame, TrendingUp } from 'lucide-react';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

// Get featured items (first 2 from each category)
const featuredItems = [
  ...menuData.sauces.slice(0, 3).map((s, index) => ({
    id: s.id,
    name: s.name,
    image: s.image,
    price: s.basePrice,
    category: 'sauce',
    available: s.available,
    isBestSeller: index === 0, // First sauce is best seller
    isPopular: index === 1,
  })),
  ...menuData.juices.slice(0, 2).map((j, index) => ({
    id: j.id,
    name: j.name,
    image: j.image,
    price: j.price,
    category: 'juice',
    available: j.available,
    isBestSeller: false,
    isPopular: index === 0,
  })),
  ...menuData.desserts.slice(0, 1).map(d => ({
    id: d.id,
    name: d.name,
    image: d.image,
    price: d.price,
    category: 'dessert',
    available: d.available,
    isBestSeller: false,
    isPopular: true,
  })),
];

// Skeleton loader component
function DishCardSkeleton() {
  return (
    <div className="card-premium animate-pulse">
      <div className="aspect-[4/3] bg-muted rounded-t-2xl" />
      <div className="p-5">
        <div className="flex justify-between gap-2">
          <div className="flex-1">
            <div className="h-5 bg-muted rounded w-3/4 mb-2" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-6 bg-muted rounded w-20" />
        </div>
        <div className="h-6 bg-muted rounded w-24 mt-3" />
      </div>
    </div>
  );
}

export default function PopularDishesSection() {
  const { toggleFavorite, isFavorite } = useCart();
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading] = useState(false); // Can be connected to actual loading state

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-12"
        >
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Most Loved
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Popular Dishes
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-secondary font-semibold hover:underline flex items-center gap-2"
          >
            See Full Menu
            <span>→</span>
          </Link>
        </motion.div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 6 }).map((_, index) => (
              <DishCardSkeleton key={index} />
            ))
          ) : (
            featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium food-card-hover group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* Skeleton placeholder while loading */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="absolute top-3 right-3 w-11 h-11 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-card transition-colors"
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

                  {/* Badges - Best Seller / Popular */}
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
                      <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Quick Add Button - Always visible on mobile, hover on desktop */}
                  <Link
                    to="/menu"
                    className="absolute bottom-3 right-3 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all hover:scale-110"
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus className="w-6 h-6 text-secondary-foreground" />
                  </Link>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-foreground text-lg mb-1">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Fresh & delicious
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-secondary font-bold text-xl">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="mt-3 flex items-center justify-between">
                    {item.available ? (
                      <span className="badge-available inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        In Stock
                      </span>
                    ) : (
                      <span className="badge-soldout inline-block">Sold Out</span>
                    )}
                    
                    {/* Mobile: Add to Menu Link */}
                    <Link
                      to="/menu"
                      className="lg:hidden text-secondary text-sm font-semibold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/menu" className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4">
            Explore Full Menu
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
