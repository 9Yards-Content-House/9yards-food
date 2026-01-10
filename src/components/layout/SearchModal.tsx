import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, X, History, TrendingUp, Mic, MicOff, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { menuData, FEATURED_LUSANIYA_IDS } from '@/data/menu';
import { AnimatePresence, motion, PanInfo } from 'framer-motion';

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

// Category config
const CATEGORIES = [
  { key: 'Main Dish', label: 'Main Dish' },
  { key: 'Sauce', label: 'Sauce' },
  { key: 'Juice', label: 'Juice' },
  { key: 'Side', label: 'Side' },
  { key: 'Dessert', label: 'Dessert' },
  { key: 'Lusaniya', label: 'Lusaniya' },
];

// Popular search suggestions
const SEARCH_SUGGESTIONS = [
  'Matooke', 'Fish', 'Chicken', 'G-Nuts', 'Pilao', 'Posho', 'Rice', 'Beef', 'Passion', 'Mango'
];

// Format price helper
const formatPrice = (price: number) => {
  return `UGX ${new Intl.NumberFormat('en-UG').format(price)}`;
};

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

// Custom hook for debounced value
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 150);
  
  const allItems = useMemo(() => getAllMenuItems(), []);

  // Check voice support on mount
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
  }, []);

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
  const addToHistory = useCallback((item: SearchItem) => {
    setRecentSearches(prev => {
      const newHistory = [item, ...prev.filter(i => i.id !== item.id)].slice(0, 6);
      localStorage.setItem('recent_searches', JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const removeHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const newHistory = prev.filter(i => i.id !== id);
      localStorage.setItem('recent_searches', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearAllHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  };
  
  // Filtered items with debounce
  const filteredItems = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    setIsSearching(true);
    const lowerQuery = debouncedQuery.toLowerCase();
    const results = allItems.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    ).slice(0, 8);
    setTimeout(() => setIsSearching(false), 100);
    return results;
  }, [debouncedQuery, allItems]);

  // Search suggestions based on query
  const suggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    const lowerQuery = query.toLowerCase();
    return SEARCH_SUGGESTIONS.filter(s => 
      s.toLowerCase().startsWith(lowerQuery) && s.toLowerCase() !== lowerQuery
    ).slice(0, 4);
  }, [query]);

  const trendingItems = useMemo(() => {
    if (FEATURED_LUSANIYA_IDS && FEATURED_LUSANIYA_IDS.length > 0) {
      return allItems.filter(item => FEATURED_LUSANIYA_IDS.includes(item.id)).slice(0, 3);
    }
    return allItems.filter(item => item.category === 'Lusaniya').slice(0, 3);
  }, [allItems]);

  // Focus input when modal opens + body scroll lock
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (isOpen) {
      setSelectedIndex(-1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      const items = filteredItems.length > 0 ? filteredItems : [];
      const maxIndex = items.length - 1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
      } else if (e.key === 'Enter' && selectedIndex >= 0 && items[selectedIndex]) {
        e.preventDefault();
        handleItemClick(items[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredItems, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedEl = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Voice search
  const startVoiceSearch = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setQuery(transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, []);

  const stopVoiceSearch = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const handleItemClick = (item: SearchItem) => {
    addToHistory(item);
    navigate(`/menu?highlight=${item.id}&category=${item.category.toLowerCase()}`);
    setQuery('');
    onClose();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/menu?search=${encodeURIComponent(query)}`);
      setQuery('');
      onClose();
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/menu?category=${category.toLowerCase()}`);
    setQuery('');
    onClose();
  };

  // Swipe to dismiss handler
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 && info.velocity.y > 0) {
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
            aria-hidden="true"
          />
              
          {/* Modal Container */}
          <div 
            className="fixed inset-0 z-[101] flex items-start justify-center pt-12 sm:pt-4 md:pt-20 px-0 sm:px-4 pointer-events-none"
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label="Search menu items"
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.3 }}
              onDragEnd={handleDragEnd}
              className="w-full sm:max-w-2xl pointer-events-auto h-full sm:h-auto"
            >
              <div className="bg-white sm:bg-background/95 sm:backdrop-blur-xl sm:border sm:border-white/20 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto sm:max-h-[85vh]">
                
                {/* Swipe indicator - Mobile only */}
                <div className="sm:hidden flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Search Input Area */}
                <div className="relative border-b border-border/50 shrink-0 bg-gray-50 sm:bg-muted/10 p-4 pb-3">
                  <form onSubmit={handleSearch} className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(-1);
                      }}
                      placeholder="What are you craving?"
                      className="w-full pl-12 pr-24 py-4 text-base sm:text-lg bg-white sm:bg-muted/50 border border-gray-200 sm:border-transparent rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#E6411C] focus:border-[#E6411C] transition-all placeholder:text-muted-foreground/60"
                      aria-label="Search menu items"
                      aria-describedby="search-instructions"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    <span id="search-instructions" className="sr-only">
                      Type to search menu items. Use arrow keys to navigate results, Enter to select.
                    </span>
                    
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {/* Clear button */}
                      {query && (
                        <button
                          type="button"
                          onClick={() => {
                            setQuery('');
                            setSelectedIndex(-1);
                            inputRef.current?.focus();
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-secondary transition-colors border border-transparent hover:border-secondary/20 hover:bg-secondary/5"
                          aria-label="Clear search"
                        >
                          Clear
                        </button>
                      )}

                      {/* Voice search button */}
                      {voiceSupported && (
                        <button
                          type="button"
                          onClick={isListening ? stopVoiceSearch : startVoiceSearch}
                          className={`p-2.5 rounded-full transition-all ${
                            isListening 
                              ? 'bg-[#E6411C] text-white animate-pulse' 
                              : 'hover:bg-gray-100 text-muted-foreground hover:text-foreground'
                          }`}
                          aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                      )}
                      
                      {/* Close button */}
                      <button
                        type="button"
                        onClick={onClose}
                        className="p-2.5 rounded-full hover:bg-gray-100 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Close search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </form>

                  {/* Voice listening indicator */}
                  {isListening && (
                    <div className="flex items-center justify-center gap-2 text-[#E6411C] text-sm font-medium mb-3">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-4 bg-[#E6411C] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-6 bg-[#E6411C] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-4 bg-[#E6411C] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span>Listening...</span>
                    </div>
                  )}

                  {/* Search suggestions */}
                  {suggestions.length > 0 && !isListening && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs text-muted-foreground py-1">Suggestions:</span>
                      {suggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1 rounded-full bg-[#E6411C]/10 text-[#E6411C] text-sm font-medium hover:bg-[#E6411C]/20 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Categories */}
                  {!query.trim() && !isListening && (
                    <div className="flex flex-wrap gap-2">
                      {CATEGORIES.slice(0, 4).map(cat => (
                        <button
                          key={cat.key}
                          onClick={() => handleCategoryClick(cat.key)}
                          className="px-4 py-2 rounded-xl bg-white sm:bg-background border border-gray-200 sm:border-border/50 hover:border-[#E6411C]/50 hover:bg-[#E6411C]/5 text-sm font-medium transition-all shadow-sm min-h-[44px]"
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Content Area - Scrollable */}
                <div 
                  className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain"
                  role="listbox"
                  aria-label="Search results"
                >
                  
                  {/* Loading state */}
                  {isSearching && query.trim() && (
                    <div className="p-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                          <div className="w-12 h-12 rounded-lg bg-gray-200" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SEARCH RESULTS */}
                  {!isSearching && debouncedQuery.trim() ? (
                    <div className="p-2" ref={resultsRef}>
                      {filteredItems.length > 0 ? (
                        <>
                          {/* Results count - screen reader announcement */}
                          <div className="sr-only" role="status" aria-live="polite">
                            {filteredItems.length} results found for {debouncedQuery}
                          </div>
                          
                          <div className="space-y-1">
                            {filteredItems.map((item, index) => (
                              <button
                                key={item.id}
                                data-index={index}
                                onClick={() => handleItemClick(item)}
                                className={`w-full flex items-center gap-4 p-3 rounded-xl transition-colors group text-left min-h-[72px] ${
                                  selectedIndex === index 
                                    ? 'bg-[#E6411C]/10 ring-2 ring-[#E6411C]/30' 
                                    : 'hover:bg-muted/50'
                                }`}
                                role="option"
                                aria-selected={selectedIndex === index}
                              >
                                <div className="w-14 h-14 rounded-lg bg-muted overflow-hidden shrink-0">
                                  <img
                                    src={item.image}
                                    alt=""
                                    loading="eager"
                                    decoding="sync"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground truncate text-base">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">{item.category}</p>
                                </div>
                                {item.price && (
                                  <span className="text-sm font-bold text-[#E6411C] whitespace-nowrap">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                                <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-[#E6411C] group-hover:translate-x-1 transition-all shrink-0" />
                              </button>
                            ))}
                          </div>

                          {/* View all results link */}
                          <button
                            onClick={handleSearch}
                            className="w-full mt-3 p-3 text-center text-[#E6411C] font-medium hover:bg-[#E6411C]/5 rounded-xl transition-colors"
                          >
                            View all results for "{debouncedQuery}" →
                          </button>
                        </>
                      ) : (
                        <div className="py-12 text-center">
                          {/* Empty state illustration */}
                          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-10 h-10 text-gray-300" />
                          </div>
                          <p className="text-muted-foreground font-medium mb-2">
                            No results for "{debouncedQuery}"
                          </p>
                          <p className="text-sm text-muted-foreground/70 mb-4">
                            Try a different spelling or browse categories
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            {CATEGORIES.slice(0, 4).map(cat => (
                              <button
                                key={cat.key}
                                onClick={() => handleCategoryClick(cat.key)}
                                className="px-4 py-2 rounded-lg bg-[#E6411C]/10 text-[#E6411C] text-sm font-medium hover:bg-[#E6411C]/20 transition-colors"
                              >
                                {cat.label}
                              </button>
                            ))}
                          </div>
                          <button 
                            onClick={() => {
                              navigate('/menu');
                              onClose();
                            }}
                            className="mt-4 text-[#212282] hover:underline text-sm font-medium"
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
                          <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              <History className="w-3.5 h-3.5" />
                              <span>Recent Searches</span>
                            </div>
                            <button
                              onClick={clearAllHistory}
                              className="text-xs text-[#E6411C] hover:underline font-medium"
                            >
                              Clear all
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {recentSearches.map(item => (
                              <div 
                                key={`history-${item.id}`}
                                className="group flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50 min-h-[60px]"
                                onClick={() => handleItemClick(item)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && handleItemClick(item)}
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt="" 
                                    loading="eager"
                                    decoding="sync"
                                    className="w-11 h-11 rounded-lg object-cover" 
                                  />
                                  <div className="min-w-0">
                                    <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground truncate block">{item.name}</span>
                                    <span className="text-xs text-muted-foreground">{item.category}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={(e) => removeHistoryItem(e, item.id)}
                                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white rounded-full transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
                                  aria-label={`Remove ${item.name} from history`}
                                >
                                  <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* Empty history state */}
                      {recentSearches.length === 0 && (
                        <section className="text-center py-6">
                          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-7 h-7 text-gray-400" />
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Start typing to discover delicious meals
                          </p>
                        </section>
                      )}

                      {/* Trending / Featured */}
                      <section>
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                          <TrendingUp className="w-3.5 h-3.5 text-[#E6411C]" />
                          <span>Popular right now</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {trendingItems.map(item => (
                            <button
                              key={item.id}
                              onClick={() => handleItemClick(item)}
                              className="group relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 hover:bg-[#E6411C]/5 hover:border-[#E6411C]/50 transition-all text-left min-h-[140px]"
                            >
                              <div className="aspect-[3/2] w-full overflow-hidden">
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  loading="eager"
                                  decoding="sync"
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h4 className="text-white font-semibold text-sm truncate">{item.name}</h4>
                                {item.price && (
                                  <p className="text-white/90 text-xs mt-0.5 font-medium">{formatPrice(item.price)}</p>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Browse all categories */}
                      <section className="pt-2">
                        <button
                          onClick={() => {
                            navigate('/menu');
                            onClose();
                          }}
                          className="w-full p-4 rounded-xl border border-dashed border-gray-300 hover:border-[#E6411C] hover:bg-[#E6411C]/5 transition-all text-center group"
                        >
                          <span className="text-muted-foreground group-hover:text-[#E6411C] font-medium">
                            Browse full menu →
                          </span>
                        </button>
                      </section>
                    </div>
                  )}
                </div>

                {/* Keyboard hint - Desktop only */}
                <div className="hidden sm:flex items-center justify-center gap-4 p-3 border-t border-border/50 bg-muted/30 text-xs text-muted-foreground">
                  <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd> Select</span>
                  <span><kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Esc</kbd> Close</span>
                </div>
                
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
