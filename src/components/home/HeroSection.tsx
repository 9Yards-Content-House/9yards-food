import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, Clock, Truck, CheckCircle2, XCircle, Locate, Loader2, History } from "lucide-react";
import { deliveryZones } from "@/data/menu";
import { formatPrice } from "@/lib/utils/order";
import { WHATSAPP_NUMBER } from "@/lib/constants";

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = "9yards_recent_locations";
const MAX_RECENT_SEARCHES = 3;

// Extended location data with aliases for fuzzy matching
const locationAliases: Record<string, string[]> = {
  "Kampala Central": ["kampala", "central", "city centre", "city center", "downtown", "old kampala"],
  "Nakawa": ["nakawa", "nakawa division"],
  "Kololo": ["kololo", "kololo hill"],
  "Ntinda": ["ntinda", "ntinda trading centre", "ntinda trading center"],
  "Bugolobi": ["bugolobi", "bugolobi flats"],
  "Muyenga": ["muyenga", "muyenga hill", "tank hill"],
  "Kabalagala": ["kabalagala", "kaba", "kabalagala trading centre"],
  "Kira": ["kira", "kira town", "kira municipality"],
  "Naalya": ["naalya", "nalya", "naalya estates"],
  "Kyanja": ["kyanja", "kyanja ring road"],
};

// Popular/suggested areas to show when input is empty
const popularAreas = ["Kololo", "Ntinda", "Kabalagala", "Bugolobi"];

// Helper to calculate distance between two coordinates (Haversine formula)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get recent searches from localStorage
function getRecentSearches(): string[] {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save a search to recent searches
function saveRecentSearch(zoneName: string): void {
  try {
    const recent = getRecentSearches().filter((name) => name !== zoneName);
    recent.unshift(zoneName);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT_SEARCHES)));
  } catch {
    // Silently fail if localStorage is not available
  }
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<typeof deliveryZones[0] | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Debounce search query (150ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter zones based on debounced search query
  const filteredZones = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    
    const query = debouncedQuery.toLowerCase().trim();
    
    return deliveryZones.filter((zone) => {
      // Check zone name
      if (zone.name.toLowerCase().includes(query)) return true;
      
      // Check aliases
      const aliases = locationAliases[zone.name] || [];
      return aliases.some((alias) => alias.includes(query));
    });
  }, [debouncedQuery]);

  // Get suggestions to display (filtered, popular, or recent)
  const displaySuggestions = useMemo(() => {
    if (debouncedQuery.trim()) {
      return { type: "search" as const, zones: filteredZones };
    }
    
    // Show recent searches first, then popular areas
    const recentZones = recentSearches
      .map((name) => deliveryZones.find((z) => z.name === name))
      .filter(Boolean) as typeof deliveryZones;
    
    if (recentZones.length > 0) {
      return { type: "recent" as const, zones: recentZones };
    }
    
    const popular = popularAreas
      .map((name) => deliveryZones.find((z) => z.name === name))
      .filter(Boolean) as typeof deliveryZones;
    
    return { type: "popular" as const, zones: popular };
  }, [debouncedQuery, filteredZones, recentSearches]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [displaySuggestions.zones]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    if (filteredZones.length > 0) {
      handleSelectZone(filteredZones[0]);
    } else {
      setSelectedZone(null);
      setShowNotFound(true);
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, [searchQuery, filteredZones]);

  const handleSelectZone = useCallback((zone: typeof deliveryZones[0]) => {
    setSearchQuery(zone.name);
    setDebouncedQuery(zone.name);
    setSelectedZone(zone);
    setShowNotFound(false);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setLocationError(null);
    saveRecentSearch(zone.name);
    setRecentSearches(getRecentSearches());
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const zones = displaySuggestions.zones;
    
    if (!showSuggestions || zones.length === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < zones.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : zones.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < zones.length) {
          handleSelectZone(zones[highlightedIndex]);
        } else if (filteredZones.length > 0) {
          handleSelectZone(filteredZones[0]);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions, displaySuggestions.zones, highlightedIndex, handleSelectZone, handleSearch, filteredZones]);

  // Geolocation handler
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setSelectedZone(null);
    setShowNotFound(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Find the nearest delivery zone
        let nearestZone: typeof deliveryZones[0] | null = null;
        let minDistance = Infinity;

        deliveryZones.forEach((zone) => {
          if (zone.coordinates) {
            const distance = getDistanceFromLatLonInKm(
              latitude,
              longitude,
              zone.coordinates[0],
              zone.coordinates[1]
            );
            if (distance < minDistance) {
              minDistance = distance;
              nearestZone = zone;
            }
          }
        });

        setIsLocating(false);

        if (nearestZone && minDistance < 15) {
          // Within 15km of a delivery zone
          handleSelectZone(nearestZone);
        } else {
          setSearchQuery("My Location");
          setShowNotFound(true);
          setLocationError("We don't deliver to your area yet");
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("Unable to get location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [handleSelectZone]);

  const handleOrderNow = () => {
    if (selectedZone) {
      // Navigate to menu with location pre-selected
      navigate("/menu");
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hi! I'd like to order food. My location: ${searchQuery}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="relative min-h-[90svh] sm:min-h-[85svh] md:min-h-[80svh] lg:min-h-[80svh] flex items-center overflow-hidden pt-24 sm:pt-28 md:pt-28 lg:pt-24 pb-8 sm:pb-10 md:pb-12">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />

      <div className="container-custom relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div 
            className={`flex-1 text-center lg:text-left w-full lg:max-w-xl xl:max-w-2xl lg:pt-4 transition-all duration-700 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {/* Headline */}
            <h1 className="text-[1.6rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.3rem] font-extrabold text-primary-foreground leading-[1.15] xl:leading-[1.2] mb-3 sm:mb-4 text-balance">
              Craving Local Ugandan Food? We've <span className="text-secondary">Got You.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/85 mb-5 sm:mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              Freshly cooked with 100% natural ingredients and delivered hot to your door in 30-45 minutes.
            </p>

            {/* Location Search Card */}
            <div 
              ref={containerRef}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 max-w-md mx-auto lg:mx-0 transition-shadow duration-300 hover:shadow-2xl"
            >
              {/* Search Input */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Enter delivery address"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        setSelectedZone(null);
                        setShowNotFound(false);
                        setLocationError(null);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm transition-all duration-200"
                      aria-label="Enter your delivery address"
                      aria-expanded={showSuggestions && displaySuggestions.zones.length > 0}
                      aria-haspopup="listbox"
                      aria-controls="location-suggestions"
                      aria-activedescendant={highlightedIndex >= 0 ? `suggestion-${highlightedIndex}` : undefined}
                      role="combobox"
                      autoComplete="off"
                    />
                    {/* Geolocation Button */}
                    <button
                      onClick={handleGetLocation}
                      disabled={isLocating}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-secondary hover:bg-secondary/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Use my current location"
                      title="Use my location"
                    >
                      {isLocating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Locate className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="btn-secondary px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 whitespace-nowrap text-sm active:scale-[0.98] transition-transform"
                    aria-label="Search for delivery availability"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden xs:inline">Find Food</span>
                  </button>
                </div>

                {/* Suggestions Dropdown - Shows for search results, recent, or popular */}
                {showSuggestions && displaySuggestions.zones.length > 0 && (
                  <div 
                    ref={dropdownRef}
                    id="location-suggestions"
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    {/* Section Header */}
                    {displaySuggestions.type !== "search" && (
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                          {displaySuggestions.type === "recent" ? (
                            <>
                              <History className="w-3 h-3" />
                              Recent
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
                              Popular Areas
                            </>
                          )}
                        </span>
                      </div>
                    )}
                    {displaySuggestions.zones.map((zone, index) => (
                      <button
                        key={zone.name}
                        id={`suggestion-${index}`}
                        role="option"
                        aria-selected={highlightedIndex === index}
                        onClick={() => handleSelectZone(zone)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-4 transition-colors focus:outline-none ${
                          highlightedIndex === index
                            ? "bg-secondary/10 text-secondary"
                            : "hover:bg-secondary/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className={`w-4 h-4 ${highlightedIndex === index ? "text-secondary" : "text-secondary/70"}`} />
                          <span className={`font-medium text-sm ${highlightedIndex === index ? "text-secondary" : "text-gray-900"}`}>
                            {zone.name}
                          </span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          highlightedIndex === index 
                            ? "bg-secondary/20 text-secondary" 
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {zone.estimatedTime}
                        </span>
                      </button>
                    ))}
                    {/* Keyboard hint */}
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 hidden sm:flex items-center justify-center gap-4 text-xs text-gray-400">
                      <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">↑↓</kbd> Navigate</span>
                      <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Enter</kbd> Select</span>
                      <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Esc</kbd> Close</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Error */}
              {locationError && !selectedZone && !showNotFound && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                  <XCircle className="w-3 h-3" />
                  {locationError}
                </div>
              )}

              {/* Result Messages */}
              {selectedZone && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-green-800 font-semibold text-sm">
                        We deliver to {selectedZone.name}!
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-green-700">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedZone.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {selectedZone.fee === 0 ? "Free Delivery" : formatPrice(selectedZone.fee)}
                        </span>
                      </div>
                      <button
                        onClick={handleOrderNow}
                        className="mt-2.5 btn-secondary text-xs px-4 py-2 active:scale-[0.98] transition-transform"
                      >
                        Order Now →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showNotFound && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-800 font-semibold text-sm">
                        Area not found
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        Contact us to check availability in your area.
                      </p>
                      <button
                        onClick={handleWhatsAppContact}
                        className="mt-2.5 bg-green-500 hover:bg-green-600 text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors active:scale-[0.98]"
                      >
                        WhatsApp Us
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Message */}
            <p className="text-primary-foreground/70 text-xs sm:text-sm mt-4 sm:mt-5 max-w-md mx-auto lg:mx-0">
              Order in 2 minutes • No signup required • Free delivery UGX 50K+
            </p>
          </div>

          {/* Right Image */}
          <div 
            className={`flex-1 w-full max-w-[180px] sm:max-w-[220px] md:max-w-[280px] lg:max-w-[340px] xl:max-w-[400px] lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2 xl:right-12 transition-all duration-700 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <div className="relative">
              {/* Subtle glow effect behind image */}
              <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full scale-75 -z-10" />
              <img
                src="/images/lusaniya/9Yards-Food-Lusaniya-01.png"
                alt="Delicious Ugandan food platter featuring fresh local cuisine"
                className="w-full h-auto object-contain drop-shadow-2xl animate-float"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
