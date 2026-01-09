import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, ArrowRight, History, TrendingUp, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuData, FEATURED_LUSANIYA_IDS } from '@/data/menu';
import { AnimatePresence, motion } from 'framer-motion';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchItem {
  id: string;
  name: string;
  category: string;
  image: string;
  price?: number;
}

// Combine all menu items for search
const getAllMenuItems = () => {
  const items: SearchItem[] = [];
  
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
  
  menuData.lusaniya.forEach(item => {
    items.push({ id: item.id, name: item.name, category: 'Lusaniya', image: item.image, price: item.price ?? undefined });
  });
  
  return items;
};

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const allItems = useMemo(() => getAllMenuItems(), []);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches');
      }
    }
  }, []);

  // Save recent search
  const addToHistory = (item: SearchItem) => {
    const newHistory = [item, ...recentSearches.filter(i => i.id !== item.id)].slice(0, 4);
    setRecentSearches(newHistory);
    localStorage.setItem('recent_searches', JSON.stringify(newHistory));
  };

  const removeHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newHistory = recentSearches.filter(i => i.id !== id);
    setRecentSearches(newHistory);
    localStorage.setItem('recent_searches', JSON.stringify(newHistory));
  };
  
  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 6); // Limit results
  }, [query, allItems]);

  const trendingItems = useMemo(() => {
    // Get features items or fall back to first few luscious items
    if (FEATURED_LUSANIYA_IDS && FEATURED_LUSANIYA_IDS.length > 0) {
      // Find the actual items for these IDs
      return allItems.filter(item => FEATURED_LUSANIYA_IDS.includes(item.id)).slice(0, 3);
    }
    return allItems.filter(item => item.category === 'Lusaniya').slice(0, 3);
  }, [allItems]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleItemClick = (item: SearchItem) => {
    addToHistory(item);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
              
          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-4 px-4 md:pt-20 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-2xl pointer-events-auto"
            >
              <div className="bg-background/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Search Input Area */}
                <div className="relative border-b border-border/50 shrink-0 bg-muted/10 p-4 pb-2">
                  <form onSubmit={handleSearch} className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="What are you craving?"
                      className="w-full pl-12 pr-12 py-3.5 text-lg bg-muted/50 border-transparent rounded-xl focus:bg-background focus:ring-2 focus:ring-secondary/20 focus:border-secondary/20 transition-all placeholder:text-muted-foreground/60"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {/* Clear Text Button (replaces shortcut) */}
                      {query && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                          }}
                          className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-muted text-[10px] font-bold text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-colors"
                        >
                          CLEAR
                        </button>
                      )}
                      
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Close search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </form>

                  {/* Quick Categories (Moved to Top) */}
                  {!query.trim() && (
                    <div className="flex flex-wrap gap-2 pb-2">
                       {['Main Dish', 'Sauce', 'Juice', 'Side'].map(cat => (
                         <button
                           key={cat}
                           onClick={() => setQuery(cat)}
                           className="px-3 py-1.5 rounded-lg bg-background border border-border/50 hover:border-secondary/50 hover:bg-secondary/5 hover:text-secondary text-sm font-medium transition-all shadow-sm"
                         >
                           {cat}
                         </button>
                       ))}
                     </div>
                  )}
                </div>
                
                {/* Content Area - Scrollable */}
                <div className="overflow-y-auto custom-scrollbar">
                  
                  {/* SEARCH RESULTS */}
                  {query.trim() ? (
                    <div className="p-2">
                      {filteredItems.length > 0 ? (
                        <div className="space-y-1">
                          {filteredItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group text-left"
                            >
                              <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.category}</p>
                              </div>
                              {item.price && (
                                <span className="text-sm font-semibold text-secondary">
                                  {item.price.toLocaleString()} UGX
                                </span>
                              )}
                              <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center text-muted-foreground">
                          <p>No delicious results found for "{query}"</p>
                          <button 
                             onClick={() => {
                                navigate('/menu');
                                onClose();
                             }}
                            className="mt-2 text-secondary hover:underline text-sm"
                          >
                            View full menu
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* EMPTY STATE */
                    <div className="p-4 md:p-6 space-y-6">
                      
                      {/* Recent Searches */}
                      {recentSearches.length > 0 && (
                        <section>
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                            <History className="w-3 h-3" />
                            <span>Recent</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recentSearches.map(item => (
                              <div 
                                key={`history-${item.id}`}
                                className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50"
                                onClick={() => handleItemClick(item)}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                  <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground truncate">{item.name}</span>
                                </div>
                                <button 
                                  onClick={(e) => removeHistoryItem(e, item.id)}
                                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-background rounded-full transition-all"
                                >
                                  <X className="w-3 h-3 text-muted-foreground" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Trending / Featured */}
                      <section>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                          <TrendingUp className="w-3 h-3 text-secondary" />
                          <span>Popular right now</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {trendingItems.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:bg-secondary/5 hover:border-secondary/50 transition-all text-left"
                            >
                              <div className="aspect-video sm:aspect-[4/3] w-full overflow-hidden">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h4 className="text-white font-medium text-sm truncate">{item.name}</h4>
                                {item.price && (
                                  <p className="text-white/90 text-xs mt-0.5">{item.price.toLocaleString()} UGX</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>
                    </div>
                  )}
                </div>
                
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
