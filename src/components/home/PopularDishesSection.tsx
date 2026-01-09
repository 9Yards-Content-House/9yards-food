import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Flame, Plus, Star } from 'lucide-react';
import OptimizedImage from '@/components/ui/optimized-image';
import { menuData, FEATURED_SAUCE_IDS, FEATURED_LUSANIYA_IDS } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useCart } from '@/context/CartContext';
import ComboBuilder from '@/components/menu/ComboBuilder';
import { vibrate } from '@/lib/utils/ui';


// Build featured items dynamically from menuData
const getFeaturedItems = () => {
  const items: FeaturedItem[] = [];
  
  // Add sauces
  FEATURED_SAUCE_IDS.forEach((id, index) => {
    const sauce = menuData.sauces.find(s => s.id === id);
    if (sauce) {
      items.push({
        id: sauce.id,
        name: sauce.name,
        description: sauce.preparations.length > 0 
          ? `${sauce.preparations.join(', ')}` 
          : 'Traditional preparation',
        image: sauce.image,
        price: sauce.basePrice,
        categoryType: 'sauce' as const,
        categoryLabel: 'Protein',
        available: sauce.available,
        isBestSeller: index === 0, // First item is best seller
      });
    }
  });
  
  // Add lusaniya items
  FEATURED_LUSANIYA_IDS.forEach((id) => {
    const lusaniya = menuData.lusaniya.find(l => l.id === id);
    if (lusaniya) {
      items.push({
        id: lusaniya.id,
        name: lusaniya.name,
        description: lusaniya.description,
        image: lusaniya.image,
        price: lusaniya.price,
        categoryType: 'lusaniya' as const,
        categoryLabel: 'Special',
        available: lusaniya.available,
        isBestSeller: false,
        isIndividual: true,
      });
    }
  });
  
  return items;
};

interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  categoryType: 'main' | 'sauce' | 'juice' | 'dessert' | 'lusaniya';
  categoryLabel: string;
  available: boolean;
  isBestSeller?: boolean;
  isIncluded?: boolean;
  isIndividual?: boolean;
}

interface DishCardProps {
  item: FeaturedItem;
  onAddToOrder: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  isInCart?: boolean;
  isVisible?: boolean;
  animationDelay?: number;
}

function DishCard({ 
  item, 
  onAddToOrder, 
  onToggleFavorite, 
  isFavorite,
  isInCart,
  isVisible = true,
  animationDelay = 0
}: DishCardProps) {
  const getPriceDisplay = () => {
    if (item.isIncluded) {
      return <span className="text-muted-foreground font-medium text-sm">Included</span>;
    }
    return <span className="text-secondary font-extrabold text-lg">{formatPrice(item.price)}</span>;
  };

  // Determine button text based on item type
  const getActionText = () => {
    const isIndividual = item.isIndividual || item.categoryType === 'lusaniya' || item.categoryType === 'juice' || item.categoryType === 'dessert';
    if (isIndividual) {
      return isInCart ? 'In Order' : 'Add to Order';
    }
    return 'Build Your Combo';
  };

  // Handle keyboard activation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && item.available) {
      e.preventDefault();
      onAddToOrder();
    }
  };

  return (
    <li
      role="button"
      tabIndex={item.available ? 0 : -1}
      onClick={() => item.available && onAddToOrder()}
      onKeyDown={handleKeyDown}
      aria-label={`${item.name}${!item.available ? ' - Sold out' : ''}, ${formatPrice(item.price)}`}
      aria-disabled={!item.available}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 
        hover:border-secondary/50 hover:bg-secondary/5 
        active:scale-[0.98] lg:active:scale-100
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
        flex flex-col list-none
        ${item.available ? 'cursor-pointer' : 'cursor-not-allowed'}
        ${!item.available ? 'opacity-60' : ''}
        ${isVisible 
          ? 'opacity-100 translate-y-0 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none' 
          : 'opacity-0 translate-y-6'
        }`}
      style={{ transitionDelay: isVisible ? `${animationDelay}ms` : '0ms' }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <OptimizedImage
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover 
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
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {item.available && item.isBestSeller && (
            <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3" aria-hidden="true" />
              Popular
            </span>
          )}
          {item.isIndividual && (
            <span className="bg-yards-blue text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" aria-hidden="true" />
              Special
            </span>
          )}
        </div>

        {/* Favorite Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className="absolute top-2 right-2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full 
            flex items-center justify-center hover:bg-white transition-colors z-10"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? 'text-red-500 fill-red-500'
                : 'text-gray-500'
            }`}
            aria-hidden="true"
          />
        </button>
        
        {/* Tap indicator on hover - desktop only */}
        {item.available && (
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors flex items-center justify-center">
            <span className={`opacity-0 group-hover:opacity-100 transition-opacity text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hidden md:flex items-center gap-1.5 ${
              (item.isIndividual || item.categoryType === 'lusaniya' || item.categoryType === 'juice' || item.categoryType === 'dessert') && isInCart ? 'bg-green-500' : 'bg-secondary'
            }`}>
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              {getActionText()}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Category tag */}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1">
          {item.categoryLabel}
        </span>
        
        {/* Name */}
        <h3 className="font-bold text-foreground text-sm md:text-base leading-tight mb-0.5 line-clamp-1">
          {item.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-xs md:text-sm line-clamp-1 mb-2">
          {item.description}
        </p>
        
        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          {getPriceDisplay()}
          
          {/* Visual indicator for tappable - mobile */}
          {item.available && (
            <span className="text-muted-foreground text-[10px] md:text-xs flex items-center gap-1 md:hidden">
              Tap to order
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function PopularDishesSection() {
  const { toggleFavorite, isFavorite, addItem, state } = useCart();
  const [isComboBuilderOpen, setIsComboBuilderOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Get featured items dynamically from menuData
  const featuredItems = getFeaturedItems();

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Check if an individual item is in the cart
  const isIndividualInCart = (itemId: string, category: string) => {
    return state.items.some(item => item.id.startsWith(`${category}-${itemId}`));
  };

  // Handle adding individual items to cart
  const handleIndividualAddToCart = (item: FeaturedItem) => {
    const cartItem = {
      id: `${item.categoryType}-${item.id}`,
      type: 'single' as const,
      mainDishes: [item.name],
      sauce: null,
      sideDish: '',
      extras: [],
      quantity: 1,
      totalPrice: item.price,
      description: item.description,
    };
    
    addItem(cartItem);
    vibrate(50);
  };

  // Handle item click - different behavior for individual vs regular items
  const handleItemClick = (item: FeaturedItem) => {
    const isIndividual = item.isIndividual || item.categoryType === 'lusaniya' || item.categoryType === 'juice' || item.categoryType === 'dessert';
    if (isIndividual) {
      handleIndividualAddToCart(item);
    } else {
      setIsComboBuilderOpen(true);
    }
  };

  return (
    <>
      <section 
        ref={sectionRef}
        className="section-padding bg-muted/30"
        aria-labelledby="popular-dishes-heading"
      >
        <div className="container-custom">
          {/* Section Header */}
          <div 
            className={`text-center mb-8 md:mb-12 px-4 transition-all duration-700 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-bold tracking-wider uppercase mb-2">
              Customer Favorites
            </span>
            <h2 
              id="popular-dishes-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3"
            >
              Our Most Popular Combos & Extras
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Authentic Ugandan dishes our customers love most. Choose one and build your perfect combo!
            </p>
          </div>

          {/* Dishes Grid - Semantic list */}
          <ul 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4 md:gap-6 px-4 md:px-0 list-none m-0 p-0"
            role="list"
            aria-label="Featured dishes"
          >
            {featuredItems.map((item, index) => (
              <DishCard
                key={item.id}
                item={item}
                onAddToOrder={() => handleItemClick(item)}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(item.id)}
                isInCart={(item.isIndividual || item.categoryType === 'lusaniya' || item.categoryType === 'juice' || item.categoryType === 'dessert') ? isIndividualInCart(item.id, item.categoryType) : false}
                isVisible={isVisible}
                animationDelay={100 + index * 75}
              />
            ))}
          </ul>

          {/* CTA */}
          <div 
            className={`text-center mt-8 md:mt-12 px-4 transition-all duration-700 ease-out motion-reduce:transition-none ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: isVisible ? `${100 + featuredItems.length * 75 + 100}ms` : '0ms' }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsComboBuilderOpen(true)}
                className="btn-secondary inline-flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
              >
                Start Building Your Combo
              </button>
              <Link 
                to="/menu" 
                className="text-secondary font-semibold inline-flex items-center gap-1 text-sm sm:text-base py-2 group"
              >
                <span className="group-hover:underline">View Full Menu</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Combo Builder Modal */}
      <ComboBuilder
        isOpen={isComboBuilderOpen}
        onClose={() => setIsComboBuilderOpen(false)}
      />
    </>
  );
}
