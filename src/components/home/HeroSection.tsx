import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Clock, Truck, CheckCircle2, XCircle, Locate, Loader2, History, Globe } from "lucide-react";
import { deliveryZones } from "@/data/menu";
import { formatPrice } from "@/lib/utils/order";
import { WHATSAPP_NUMBER } from "@/lib/constants";

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = "9yards_recent_locations";
const MAX_RECENT_SEARCHES = 3;

// Photon API configuration (OpenStreetMap-based, free, no API key needed)
const PHOTON_API_URL = "https://photon.komoot.io/api/";
const PHOTON_DEBOUNCE_MS = 300;
const MAX_DELIVERY_DISTANCE_KM = 10; // Maximum distance from a delivery zone center

// Kampala metro area bounds (used to determine if location is in Kampala area)
const KAMPALA_CENTER = { lat: 0.3476, lon: 32.5825 };
const KAMPALA_METRO_RADIUS_KM = 25; // Approximate radius of greater Kampala metro area

// Exact delivery zone names for matching
const DELIVERY_ZONE_NAMES = deliveryZones.map((z) => z.name.toLowerCase());

// Type for Photon API results
interface PhotonResult {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  nearestZone: typeof deliveryZones[0] | null;
  distanceToZone: number;
  isDeliverable: boolean;
  isInKampalaArea: boolean;
  isExactZoneMatch: boolean;
}

// Extended location data with aliases for fuzzy matching (fallback)
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

// Clear all recent searches
function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Silently fail if localStorage is not available
  }
}

// Find nearest delivery zone to given coordinates
function findNearestDeliveryZone(lat: number, lon: number): { zone: typeof deliveryZones[0] | null; distance: number } {
  let nearestZone: typeof deliveryZones[0] | null = null;
  let minDistance = Infinity;

  deliveryZones.forEach((zone) => {
    if (zone.coordinates) {
      const distance = getDistanceFromLatLonInKm(lat, lon, zone.coordinates[0], zone.coordinates[1]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestZone = zone;
      }
    }
  });

  return { zone: nearestZone, distance: minDistance };
}

// Fetch locations from Photon API (OpenStreetMap)
async function fetchPhotonSuggestions(query: string, signal: AbortSignal): Promise<PhotonResult[]> {
  if (!query.trim() || query.length < 2) return [];

  try {
    // Photon API with Uganda bounding box and bias towards Kampala
    const params = new URLSearchParams({
      q: query,
      limit: "6",
      lat: "0.3476", // Kampala latitude for bias
      lon: "32.5825", // Kampala longitude for bias
      lang: "en",
    });

    const response = await fetch(`${PHOTON_API_URL}?${params}`, { signal });
    
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    // Filter and transform results - only show Uganda results
    const results: PhotonResult[] = data.features
      .filter((feature: any) => {
        const country = feature.properties?.country;
        return country === "Uganda";
      })
      .map((feature: any) => {
        const props = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;

        // Build display name
        const parts = [
          props.name,
          props.locality,
          props.district,
          props.city,
          props.county,
        ].filter(Boolean);
        const displayName = [...new Set(parts)].slice(0, 3).join(", ");

        // Find nearest delivery zone
        const { zone, distance } = findNearestDeliveryZone(lat, lon);

        // Check if location is within Kampala metro area
        const distanceToKampala = getDistanceFromLatLonInKm(lat, lon, KAMPALA_CENTER.lat, KAMPALA_CENTER.lon);
        const isInKampalaArea = distanceToKampala <= KAMPALA_METRO_RADIUS_KM;

        // Check if the location name exactly matches one of our delivery zones
        const locationName = (props.name || "").toLowerCase().trim();
        const locationWords = locationName.split(/[\s,]+/);
        
        // Strict matching: location name must BE one of our zones or start with it
        const isExactZoneMatch = DELIVERY_ZONE_NAMES.some((zoneName) => {
          // Exact match
          if (locationName === zoneName) return true;
          // Location starts with zone name (e.g., "Kololo Hill" starts with "kololo")
          if (locationName.startsWith(zoneName + " ") || locationName.startsWith(zoneName + ",")) return true;
          // First word is the zone name
          if (locationWords[0] === zoneName) return true;
          return false;
        });

        // Also check aliases for exact match (strict)
        const matchesAlias = Object.entries(locationAliases).some(([, aliases]) => {
          return aliases.some((alias) => {
            // Exact match
            if (locationName === alias) return true;
            // Location starts with alias
            if (locationName.startsWith(alias + " ") || locationName.startsWith(alias + ",")) return true;
            // First word matches alias
            if (locationWords[0] === alias) return true;
            return false;
          });
        });

        const isDeliverableZone = isExactZoneMatch || matchesAlias;

        return {
          name: props.name || displayName,
          displayName: displayName || props.name,
          lat,
          lon,
          type: props.osm_value || props.type || "place",
          nearestZone: zone,
          distanceToZone: distance,
          // Deliverable ONLY if it's an exact match to our delivery zones
          isDeliverable: isDeliverableZone,
          isInKampalaArea,
          isExactZoneMatch: isDeliverableZone,
        };
      })
      // Remove duplicates by name
      .filter((result: PhotonResult, index: number, self: PhotonResult[]) => 
        index === self.findIndex((r) => r.displayName === result.displayName)
      );

    return results;
  } catch (error) {
    if ((error as Error).name === "AbortError") {
      // Request was cancelled, ignore
      return [];
    }
    console.warn("Photon API error, falling back to local search:", error);
    return [];
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
  const [apiResults, setApiResults] = useState<PhotonResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
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

  // Debounce search query (150ms for local, 300ms for API)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch API suggestions when debounced query changes
  useEffect(() => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setApiResults([]);
      setIsSearching(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        // Add extra debounce for API calls
        await new Promise((resolve) => setTimeout(resolve, 150));
        
        if (abortController.signal.aborted) return;
        
        const results = await fetchPhotonSuggestions(debouncedQuery, abortController.signal);
        
        if (!abortController.signal.aborted) {
          setApiResults(results);
        }
      } catch (error) {
        // Ignore abort errors
        if ((error as Error).name !== "AbortError") {
          console.warn("Search error:", error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    fetchResults();

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery]);

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

  // Filter zones based on debounced search query (local fallback)
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

  // Combined suggestions: API results + local matches
  const displaySuggestions = useMemo(() => {
    // If searching with a query
    if (debouncedQuery.trim()) {
      // Combine API results with local delivery zone matches
      const hasApiResults = apiResults.length > 0;
      const hasLocalResults = filteredZones.length > 0;

      if (hasApiResults || hasLocalResults) {
        return { 
          type: "search" as const, 
          zones: filteredZones,
          apiResults: apiResults,
          hasApiResults,
          hasLocalResults
        };
      }
      
      return { type: "search" as const, zones: [], apiResults: [], hasApiResults: false, hasLocalResults: false };
    }
    
    // Show recent searches only (no popular areas)
    const recentZones = recentSearches
      .map((name) => deliveryZones.find((z) => z.name === name))
      .filter(Boolean) as typeof deliveryZones;
    
    if (recentZones.length > 0) {
      return { type: "recent" as const, zones: recentZones, apiResults: [], hasApiResults: false, hasLocalResults: false };
    }
    
    // Return empty - don't show dropdown if no recent searches
    return { type: "empty" as const, zones: [], apiResults: [], hasApiResults: false, hasLocalResults: false };
  }, [debouncedQuery, filteredZones, recentSearches, apiResults]);

  // Total items for keyboard navigation
  const totalSuggestionItems = useMemo(() => {
    return displaySuggestions.zones.length + (displaySuggestions.apiResults?.length || 0);
  }, [displaySuggestions]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [totalSuggestionItems]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    
    // First check API results
    const deliverableApiResult = apiResults.find((r) => r.isDeliverable);
    if (deliverableApiResult && deliverableApiResult.nearestZone) {
      handleSelectZone(deliverableApiResult.nearestZone, {
        name: deliverableApiResult.displayName,
        lat: deliverableApiResult.lat,
        lon: deliverableApiResult.lon
      });
      return;
    }

    // Then check local matches
    if (filteredZones.length > 0) {
      handleSelectZone(filteredZones[0]);
    } else {
      setSelectedZone(null);
      setShowNotFound(true);
    }
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, [searchQuery, filteredZones, apiResults]);

  const handleSelectZone = useCallback((zone: typeof deliveryZones[0], location?: { name: string; lat: number; lon: number }) => {
    setSearchQuery(location?.name || zone.name);
    setDebouncedQuery(location?.name || zone.name);
    setSelectedZone(zone);
    setSelectedLocation(location || null);
    setShowNotFound(false);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setLocationError(null);
    setApiResults([]);
    saveRecentSearch(zone.name);
    setRecentSearches(getRecentSearches());
  }, []);

  // Handle selecting an API result (location outside delivery zones)
  const handleSelectApiResult = useCallback((result: PhotonResult) => {
    if (result.isDeliverable && result.nearestZone) {
      handleSelectZone(result.nearestZone, {
        name: result.displayName,
        lat: result.lat,
        lon: result.lon
      });
    } else {
      // Location is outside delivery area
      setSearchQuery(result.displayName);
      setDebouncedQuery(result.displayName);
      setSelectedZone(null);
      setSelectedLocation({ name: result.displayName, lat: result.lat, lon: result.lon });
      setShowNotFound(true);
      setShowSuggestions(false);
      setHighlightedIndex(-1);
      setApiResults([]);
    }
  }, [handleSelectZone]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const localZones = displaySuggestions.zones;
    const apiItems = displaySuggestions.apiResults || [];
    const totalItems = localZones.length + apiItems.length;
    
    if (!showSuggestions || totalItems === 0) {
      if (e.key === "Enter") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < localZones.length) {
            // Selecting a local delivery zone
            handleSelectZone(localZones[highlightedIndex]);
          } else {
            // Selecting an API result
            const apiIndex = highlightedIndex - localZones.length;
            if (apiIndex < apiItems.length) {
              handleSelectApiResult(apiItems[apiIndex]);
            }
          }
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
  }, [showSuggestions, displaySuggestions, highlightedIndex, handleSelectZone, handleSelectApiResult, handleSearch]);

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
    setShowSuggestions(false);

    // First try with high accuracy, then fall back to low accuracy if it fails
    const tryGetPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          console.log(`Location obtained: ${latitude}, ${longitude} (accuracy: ${accuracy}m, highAccuracy: ${highAccuracy})`);
          
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
            handleSelectZone(nearestZone, {
              name: `Near ${nearestZone.name}`,
              lat: latitude,
              lon: longitude
            });
          } else {
            setSearchQuery("My Location");
            setShowNotFound(true);
            setLocationError("We don't deliver to your area yet");
          }
        },
        (error) => {
          // If high accuracy fails, try with low accuracy
          if (highAccuracy && error.code !== error.PERMISSION_DENIED) {
            console.log("High accuracy failed, trying low accuracy...");
            tryGetPosition(false);
            return;
          }
          
          setIsLocating(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Please enable location access in your browser settings");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location unavailable. Please try again or enter address manually");
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Please try again");
              break;
            default:
              setLocationError("Unable to get location. Please enter address manually");
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 10000 : 15000,
          maximumAge: 0 // Always get fresh location
        }
      );
    };

    // Start with high accuracy
    tryGetPosition(true);
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
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-4 sm:gap-6 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div 
            className={`flex-1 text-center lg:text-left w-full lg:max-w-xl xl:max-w-2xl lg:pt-4 transition-all duration-700 ease-out relative z-20 ${
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
              className="bg-white rounded-xl sm:rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] p-3.5 sm:p-5 max-w-md mx-auto lg:mx-0 transition-shadow duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] relative z-[100]"
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
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent text-sm transition-all duration-200"
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
                {showSuggestions && (displaySuggestions.zones.length > 0 || (displaySuggestions.apiResults && displaySuggestions.apiResults.length > 0) || isSearching) && (
                  <div 
                    ref={dropdownRef}
                    id="location-suggestions"
                    role="listbox"
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[200] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[320px] overflow-y-auto"
                  >
                    {/* Loading indicator */}
                    {isSearching && (
                      <div className="px-4 py-3 flex items-center gap-2 text-gray-500 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching locations...
                      </div>
                    )}

                    {/* Section Header for recent searches */}
                    {displaySuggestions.type === "recent" && !isSearching && (
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                          <History className="w-3 h-3" />
                          Recent
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearRecentSearches();
                            setRecentSearches([]);
                            setShowSuggestions(false);
                          }}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          Clear
                        </button>
                      </div>
                    )}

                    {/* Local Delivery Zones (exact matches) */}
                    {displaySuggestions.zones.length > 0 && (
                      <>
                        {displaySuggestions.type === "search" && displaySuggestions.hasApiResults && (
                          <div className="px-4 py-2 bg-green-50 border-b border-green-100">
                            <span className="text-xs font-medium text-green-700 uppercase tracking-wide flex items-center gap-1.5">
                              <CheckCircle2 className="w-3 h-3" />
                              Delivery Zones
                            </span>
                          </div>
                        )}
                        {displaySuggestions.zones.map((zone, index) => (
                          <button
                            key={`zone-${zone.name}`}
                            id={`suggestion-${index}`}
                            role="option"
                            aria-selected={highlightedIndex === index}
                            onClick={() => handleSelectZone(zone)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors focus:outline-none ${
                              highlightedIndex === index
                                ? "bg-secondary/10"
                                : "hover:bg-secondary/5"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <MapPin className={`w-4 h-4 flex-shrink-0 ${highlightedIndex === index ? "text-secondary" : "text-secondary/70"}`} />
                              <span className={`font-medium text-sm truncate ${highlightedIndex === index ? "text-secondary" : "text-gray-900"}`}>
                                {zone.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                ✓ We deliver here
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                highlightedIndex === index 
                                  ? "bg-secondary/20 text-secondary" 
                                  : "bg-gray-100 text-gray-500"
                              }`}>
                                {zone.estimatedTime}
                              </span>
                            </div>
                          </button>
                        ))}
                      </>
                    )}

                    {/* API Results (other Uganda locations) */}
                    {displaySuggestions.apiResults && displaySuggestions.apiResults.length > 0 && (
                      <>
                        {displaySuggestions.zones.length > 0 && (
                          <div className="px-4 py-2 bg-gray-50 border-y border-gray-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                              <Globe className="w-3 h-3" />
                              Other Locations
                            </span>
                          </div>
                        )}
                        {displaySuggestions.apiResults.map((result, idx) => {
                          const index = displaySuggestions.zones.length + idx;
                          return (
                            <button
                              key={`api-${result.displayName}-${idx}`}
                              id={`suggestion-${index}`}
                              role="option"
                              aria-selected={highlightedIndex === index}
                              onClick={() => handleSelectApiResult(result)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              className={`w-full px-4 py-2.5 text-left flex items-center justify-between gap-3 transition-colors focus:outline-none ${
                                highlightedIndex === index
                                  ? "bg-secondary/10"
                                  : "hover:bg-secondary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <MapPin className={`w-4 h-4 flex-shrink-0 ${
                                  result.isDeliverable 
                                    ? (highlightedIndex === index ? "text-secondary" : "text-secondary/70")
                                    : "text-gray-400"
                                }`} />
                                <div className="min-w-0">
                                  <span className={`font-medium text-sm truncate block ${
                                    highlightedIndex === index ? "text-secondary" : "text-gray-900"
                                  }`}>
                                    {result.name}
                                  </span>
                                  {result.displayName !== result.name && (
                                    <span className="text-xs text-gray-500 truncate block">
                                      {result.displayName}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                {result.isDeliverable ? (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                                    ✓ We deliver here
                                  </span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                                    ⚠ Message to confirm
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </>
                    )}

                    {/* No results message */}
                    {!isSearching && displaySuggestions.type === "search" && displaySuggestions.zones.length === 0 && (!displaySuggestions.apiResults || displaySuggestions.apiResults.length === 0) && debouncedQuery.length >= 2 && (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        No locations found for "{debouncedQuery}"
                      </div>
                    )}

                    {/* Keyboard hint */}
                    {(displaySuggestions.zones.length > 0 || (displaySuggestions.apiResults && displaySuggestions.apiResults.length > 0)) && (
                      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 hidden sm:flex items-center justify-center gap-4 text-xs text-gray-400">
                        <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">↑↓</kbd> Navigate</span>
                        <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Enter</kbd> Select</span>
                        <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Esc</kbd> Close</span>
                      </div>
                    )}
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
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-green-700">
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
                        className="mt-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors active:scale-[0.98] flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        WhatsApp Us
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Message */}
            <p className="text-primary-foreground/70 text-xs sm:text-sm mt-4 sm:mt-5 max-w-md mx-auto lg:mx-0">
              No signup required • Order via WhatsApp or pay online
            </p>
          </div>

          {/* Right Image - Shows first on mobile (flex-col-reverse), positioned right on desktop */}
          <div 
            className={`flex-shrink-0 w-full max-w-[160px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[340px] xl:max-w-[400px] lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2 xl:right-12 transition-all duration-700 delay-100 ease-out z-10 ${
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <div className="relative">
              {/* Subtle shadow effect behind image */}
              <div className="absolute inset-0 bg-black/10 blur-3xl rounded-full scale-75 -z-10" />
              <img
                src="/images/lusaniya/9Yards-Food-Lusaniya-01.png"
                alt="Delicious Ugandan food platter featuring fresh local cuisine"
                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
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
