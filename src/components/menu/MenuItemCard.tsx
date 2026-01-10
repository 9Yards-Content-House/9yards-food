import {
  Heart,
  Plus,
  ShoppingCart,
  Flame,
} from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";
import { formatPrice } from "@/lib/utils/order";
import { itemDescriptions, bestSellers, newItems } from "@/data/menu";

export type Category =
  | "all"
  | "lusaniya"
  | "main"
  | "sauce"
  | "juice"
  | "dessert"
  | "side";

export interface MenuItemCardProps {
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
    isIndividual?: boolean;
  };
  onAddToOrder: () => void;
  onAddToCart?: () => void;
  isInCart?: boolean;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  isHighlighted?: boolean;
  lusaniyaCount?: number;
  onRemoveLusaniya?: () => void;
}

export function MenuItemCard({
  item,
  onAddToOrder,
  onAddToCart,
  isInCart,
  onToggleFavorite,
  isFavorite,
  isHighlighted,
  lusaniyaCount = 0,
  onRemoveLusaniya,
}: MenuItemCardProps) {
  const isBestSeller = bestSellers.includes(item.id);
  const isNew = newItems.includes(item.id);
  const isIndividual =
    item.isIndividual ||
    item.categoryType === "lusaniya" ||
    item.categoryType === "juice" ||
    item.categoryType === "dessert";

  // Get description - use item.description for Lusaniya items
  const description =
    item.description || itemDescriptions[item.id] || item.category;

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
      if (item.categoryType === "sauce") {
        return (
          <span className="text-secondary font-bold text-base">
            {formatPrice(item.price)}
          </span>
        );
      }
      // Juices and desserts
      if (item.categoryType === "juice" || item.categoryType === "dessert") {
        return (
          <span className="text-secondary font-bold text-base">
            {formatPrice(item.price)}
          </span>
        );
      }
      return (
        <span className="text-secondary font-extrabold text-lg">
          {formatPrice(item.price)}
        </span>
      );
    }
    // Main dishes - included in combo
    return (
      <span className="text-muted-foreground font-medium text-sm italic">
        Part of Combo
      </span>
    );
  };

  // Get category label for card
  const getCategoryLabel = () => {
    switch (item.categoryType) {
      case "lusaniya":
        return "Signature";
      case "main":
        return "Combo Base";
      case "sauce":
        return "Combo Protein";
      case "juice":
        return "Add-on";
      case "dessert":
        return "Add-on";
      case "side":
        return "Included Side";
      default:
        return item.category;
    }
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!item.available) return;
      if (isIndividual && onAddToCart && !isInCart) {
        onAddToCart();
      } else if (!isIndividual) {
        onAddToOrder();
      }
    }
  };

  return (
    <div
      data-item-id={item.id}
      role="button"
      tabIndex={item.available ? 0 : -1}
      onClick={() => {
        if (!item.available) return;
        if (isIndividual && onAddToCart && !isInCart) {
          onAddToCart();
        } else if (!isIndividual) {
          onAddToOrder();
        }
      }}
      onKeyDown={handleKeyDown}
      aria-label={`${item.name}${!item.available ? ' - Sold out' : isIndividual ? ' - Add to order' : ' - Start combo'}`}
      aria-disabled={!item.available}
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-secondary/50 hover:bg-secondary/5 active:scale-[0.98]
        transition-all duration-200 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2
        ${item.available ? "cursor-pointer" : "cursor-not-allowed"}
        ${
          isHighlighted
            ? "ring-4 ring-secondary ring-offset-2 animate-pulse"
            : ""
        }
        ${!item.available ? "opacity-60" : ""}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <OptimizedImage
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover 
            ${!item.available ? "grayscale" : ""}`}
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
              <Flame className="w-3 h-3" aria-hidden="true" />
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
          className="absolute top-2 right-2 w-10 h-10 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full 
            flex items-center justify-center hover:bg-white transition-colors z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-500 dark:text-gray-300"
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Tap indicator on hover - desktop only */}
        {item.available && !isIndividual && (
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors flex items-center justify-center" aria-hidden="true">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-full hidden md:flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Start Combo
            </span>
          </div>
        )}

        {/* Tap indicator on hover for Individual items - desktop only */}
        {item.available && isIndividual && (
          <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/10 transition-colors flex items-center justify-center" aria-hidden="true">
            <span className={`opacity-0 group-hover:opacity-100 transition-opacity text-xs font-semibold px-3 py-1.5 rounded-full hidden md:flex items-center gap-1.5 ${
              isInCart ? 'bg-green-500 text-white' : 'bg-secondary text-secondary-foreground'
            }`}>
              {isInCart ? (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  In Order
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Add to Order
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
        <p className="text-gray-600 text-xs md:text-sm line-clamp-1 mb-2">
          {description}
        </p>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
          {getPriceDisplay()}

          {/* Add to Cart button for Individual items */}
          {item.available &&
            isIndividual &&
            onAddToCart &&
            (lusaniyaCount > 0 ? (
              <div className="flex items-center gap-2 bg-secondary/10 rounded-full px-2 py-1" role="group" aria-label={`Quantity controls for ${item.name}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLusaniya?.();
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-white text-secondary rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <span aria-hidden="true">-</span>
                </button>
                <span className="text-sm font-bold w-4 text-center" aria-label={`Quantity: ${lusaniyaCount}`}>
                  {lusaniyaCount}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart();
                  }}
                  className="w-7 h-7 flex items-center justify-center bg-secondary text-white rounded-full shadow-sm focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart();
                }}
                className="text-xs font-bold px-3 py-2 rounded-full transition-all bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                Add to Order
              </button>
            ))}

          {/* Visual indicator for tappable - non-Individual items */}
          {item.available && !isIndividual && (
            <span className="text-[#E6411C] font-semibold text-[10px] md:text-xs flex items-center gap-1 md:hidden">
              Build Combo
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
