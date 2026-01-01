import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Heart } from 'lucide-react';
import { menuData } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart } from '@/context/CartContext';

// Get featured items (first 2 from each category)
const featuredItems = [
  ...menuData.sauces.slice(0, 3).map(s => ({
    id: s.id,
    name: s.name,
    image: s.image,
    price: s.basePrice,
    category: 'sauce',
    available: s.available,
  })),
  ...menuData.juices.slice(0, 2).map(j => ({
    id: j.id,
    name: j.name,
    image: j.image,
    price: j.price,
    category: 'juice',
    available: j.available,
  })),
  ...menuData.desserts.slice(0, 1).map(d => ({
    id: d.id,
    name: d.name,
    image: d.image,
    price: d.price,
    category: 'dessert',
    available: d.available,
  })),
];

export default function PopularDishesSection() {
  const { toggleFavorite, isFavorite } = useCart();

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
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card-premium food-card-hover group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-card transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      isFavorite(item.id)
                        ? 'text-secondary fill-secondary'
                        : 'text-foreground/70'
                    }`}
                  />
                </button>

                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {item.category}
                </span>

                {/* Quick Add Button (appears on hover) */}
                <Link
                  to="/menu"
                  className="absolute bottom-3 right-3 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all"
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
                    <span className="text-secondary font-bold text-lg">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                </div>

                {/* Availability */}
                {item.available ? (
                  <span className="badge-available mt-3 inline-block">Available</span>
                ) : (
                  <span className="badge-soldout mt-3 inline-block">Sold Out</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/menu" className="btn-secondary inline-flex items-center gap-2">
            Explore Full Menu
            <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
