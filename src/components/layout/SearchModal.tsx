import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuData } from '@/data/menu';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Combine all menu items for search
const getAllMenuItems = () => {
  const items: { id: string; name: string; category: string; image: string; price?: number }[] = [];
  
  menuData.mainDishes.forEach(item => {
    items.push({ id: item.id, name: item.name, category: 'Main Dish', image: item.image });
  });
  
  menuData.sauces.forEach(item => {
    items.push({ id: item.id, name: item.name, category: 'Sauce', image: item.image, price: item.basePrice });
  });
  
  menuData.juices.forEach(item => {
    items.push({ id: item.id, name: item.name, category: 'Juice', image: item.image, price: item.price });
  });
  
  menuData.desserts.forEach(item => {
    items.push({ id: item.id, name: item.name, category: 'Dessert', image: item.image, price: item.price });
  });
  
  menuData.sideDishes.forEach(item => {
    items.push({ id: item.id, name: item.name, category: 'Side', image: item.image });
  });
  
  return items;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const allItems = useMemo(() => getAllMenuItems(), []);
  
  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 8); // Limit to 8 results
  }, [query, allItems]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleItemClick = (item: typeof allItems[0]) => {
    // Navigate to menu with the item highlighted
    navigate(`/menu?highlight=${item.id}&category=${item.category.toLowerCase()}`);
    setQuery('');
    onClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/menu?search=${encodeURIComponent(query)}`);
      setQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />
          
      {/* Modal */}
      <div
        className="fixed top-4 left-4 right-4 md:top-24 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl z-[101]"
      >
            <div className="bg-white rounded-2xl shadow-elevated overflow-hidden">
              {/* Search Input */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search menu... (e.g., chicken, fish, juice)"
                  className="w-full pl-12 pr-12 py-4 text-lg border-0 focus:outline-none focus:ring-0 bg-transparent"
                />
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </form>
              
              {/* Results */}
              {query.trim() && (
                <div className="border-t border-border">
                  {filteredItems.length > 0 ? (
                    <ul className="max-h-80 overflow-y-auto">
                      {filteredItems.map((item) => (
                        <li
                          key={item.id}
                        >
                          <button
                            onClick={() => handleItemClick(item)}
                            className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{item.name}</p>
                              <p className="text-sm text-muted-foreground">{item.category}</p>
                            </div>
                            {item.price && (
                              <span className="text-sm font-semibold text-secondary">
                                {item.price.toLocaleString()} UGX
                              </span>
                            )}
                            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-muted-foreground">No items found for "{query}"</p>
                      <button
                        onClick={() => {
                          navigate('/menu');
                          setQuery('');
                          onClose();
                        }}
                        className="mt-4 text-secondary font-medium hover:underline"
                      >
                        Browse full menu →
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Quick suggestions when empty */}
              {!query.trim() && (
                <div className="border-t border-border p-4">
                  <p className="text-sm text-muted-foreground mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Chicken', 'Fish', 'Matooke', 'Juice', 'Beef'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 bg-muted rounded-full text-sm font-medium text-foreground hover:bg-muted/70 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
  );
}
