import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import OptimizedImage from "@/components/ui/optimized-image";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Locate,
  Loader2,
  History,
  Globe,
  Check,
  AlertTriangle,
  X,
  Star,
} from "lucide-react";
import { formatPrice } from "@/lib/utils/order";
import {
  WHATSAPP_NUMBER,
  KITCHEN_LOCATION,
  MAX_DELIVERY_DISTANCE_KM,
  getDistanceFromLatLonInKm,
  getDeliveryTierInfo,
} from "@/lib/constants";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import { useCart } from "@/context/CartContext";
import { haptics } from "@/lib/utils/ui";

// Local storage key for recent searches
const RECENT_SEARCHES_KEY = "9yards_recent_locations";
const MAX_RECENT_SEARCHES = 3;

// Photon API configuration (OpenStreetMap-based, free, no API key needed)
const PHOTON_API_URL = "https://photon.komoot.io/api/";

// Kampala metro area bounds (used to determine if location is in Kampala area)
const KAMPALA_CENTER = { lat: 0.3476, lon: 32.5825 };
const KAMPALA_METRO_RADIUS_KM = 35; // Approximate radius of greater Kampala metro area

// Type for Photon API results
interface PhotonResult {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  distanceFromKitchen: number; // km from our kitchen
  deliveryFee: number | null;
  deliveryTime: string | null;
  isDeliverable: boolean;
  isInKampalaArea: boolean;
}

// Popular areas with coordinates for suggestions (near Kigo kitchen location)
const POPULAR_AREAS = [
  // Immediate area (closest to kitchen ~0-3km)
  { name: "Busabala", lat: 0.2050, lon: 32.5780 },
  { name: "Kigo", lat: 0.2000, lon: 32.5835 },
  { name: "Kitende", lat: 0.2150, lon: 32.5650 },
  // Nearby areas (~3-6km)
  { name: "Lweza", lat: 0.2300, lon: 32.5500 },
  { name: "Kajjansi", lat: 0.2450, lon: 32.5350 },
  { name: "Sseguku", lat: 0.2400, lon: 32.5600 },
];

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
function saveRecentSearch(locationName: string): void {
  try {
    const recent = getRecentSearches().filter((name) => name !== locationName);
    recent.unshift(locationName);
    localStorage.setItem(
      RECENT_SEARCHES_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT_SEARCHES))
    );
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

// Fetch locations from Photon API (OpenStreetMap)
async function fetchPhotonSuggestions(
  query: string,
  signal: AbortSignal
): Promise<PhotonResult[]> {
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

        // Calculate distance from our kitchen in Kigo
        const distanceFromKitchen = getDistanceFromLatLonInKm(
          lat,
          lon,
          KITCHEN_LOCATION.lat,
          KITCHEN_LOCATION.lon
        );

        // Get delivery tier info based on distance
        const tierInfo = getDeliveryTierInfo(distanceFromKitchen);

        // Check if location is within Kampala metro area
        const distanceToKampala = getDistanceFromLatLonInKm(
          lat,
          lon,
          KAMPALA_CENTER.lat,
          KAMPALA_CENTER.lon
        );
        const isInKampalaArea = distanceToKampala <= KAMPALA_METRO_RADIUS_KM;

        return {
          name: props.name || displayName,
          displayName: displayName || props.name,
          lat,
          lon,
          type: props.osm_value || props.type || "place",
          distanceFromKitchen,
          deliveryFee: tierInfo.isDeliverable ? tierInfo.fee : null,
          deliveryTime: tierInfo.isDeliverable ? tierInfo.time : null,
          isDeliverable: tierInfo.isDeliverable,
          isInKampalaArea,
        };
      })
      // Remove duplicates by name
      .filter(
        (result: PhotonResult, index: number, self: PhotonResult[]) =>
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
  const { setUserPreferences } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  // Selected delivery info based on distance
  const [selectedDelivery, setSelectedDelivery] = useState<{
    locationName: string;
    lat: number;
    lon: number;
    distance: number;
    fee: number;
    time: string;
  } | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [apiResults, setApiResults] = useState<PhotonResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

        const results = await fetchPhotonSuggestions(
          debouncedQuery,
          abortController.signal
        );

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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter zones based on debounced search query (local fallback)
  // Removed - we now use distance-based pricing from API results only

  // Popular areas with delivery info for suggestions
  const popularAreasWithDelivery = useMemo(() => {
    return POPULAR_AREAS.map((area) => {
      const distance = getDistanceFromLatLonInKm(
        area.lat,
        area.lon,
        KITCHEN_LOCATION.lat,
        KITCHEN_LOCATION.lon
      );
      const tierInfo = getDeliveryTierInfo(distance);
      return {
        ...area,
        distanceFromKitchen: distance,
        deliveryFee: tierInfo.fee,
        deliveryTime: tierInfo.time,
        isDeliverable: tierInfo.isDeliverable,
      };
    });
  }, []);

  // Combined suggestions: API results + popular areas
  const displaySuggestions = useMemo(() => {
    // If searching with a query
    if (debouncedQuery.trim()) {
      const hasApiResults = apiResults.length > 0;

      if (hasApiResults) {
        // Sort by distance (closest first), deliverable locations first
        const sortedResults = [...apiResults].sort((a, b) => {
          // Deliverable locations first
          if (a.isDeliverable && !b.isDeliverable) return -1;
          if (!a.isDeliverable && b.isDeliverable) return 1;
          // Then by distance
          return a.distanceFromKitchen - b.distanceFromKitchen;
        });

        return {
          type: "search" as const,
          popularAreas: [],
          apiResults: sortedResults,
          hasApiResults,
        };
      }

      return {
        type: "search" as const,
        popularAreas: [],
        apiResults: [],
        hasApiResults: false,
      };
    }

    // Show popular areas when no search query (already sorted by distance implicitly)
    return {
      type: "popular" as const,
      popularAreas: popularAreasWithDelivery,
      apiResults: [],
      hasApiResults: false,
    };
  }, [debouncedQuery, apiResults, popularAreasWithDelivery]);

  // Total items for keyboard navigation
  const totalSuggestionItems = useMemo(() => {
    return (
      displaySuggestions.popularAreas.length +
      (displaySuggestions.apiResults?.length || 0)
    );
  }, [displaySuggestions]);

  // Reset highlighted index when suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [totalSuggestionItems]);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;

    // Check API results for a deliverable location
    const deliverableResult = apiResults.find((r) => r.isDeliverable);
    if (deliverableResult) {
      handleSelectLocation({
        name: deliverableResult.displayName,
        lat: deliverableResult.lat,
        lon: deliverableResult.lon,
        distanceFromKitchen: deliverableResult.distanceFromKitchen,
        deliveryFee: deliverableResult.deliveryFee!,
        deliveryTime: deliverableResult.deliveryTime!,
        isDeliverable: true,
      });
      return;
    }

    // If no deliverable result, show not found
    setSelectedDelivery(null);
    setShowNotFound(true);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  }, [searchQuery, apiResults]);

  // Handle selecting a location (API result or popular area)
  const handleSelectLocation = useCallback(
    (location: {
      name: string;
      lat: number;
      lon: number;
      distanceFromKitchen: number;
      deliveryFee: number;
      deliveryTime: string;
      isDeliverable: boolean;
    }) => {
      if (location.isDeliverable) {
        setSearchQuery(location.name);
        setDebouncedQuery(location.name);
        setSelectedDelivery({
          locationName: location.name,
          lat: location.lat,
          lon: location.lon,
          distance: location.distanceFromKitchen,
          fee: location.deliveryFee,
          time: location.deliveryTime,
        });
        setShowNotFound(false);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setLocationError(null);
        setApiResults([]);
        saveRecentSearch(location.name);
        setRecentSearches(getRecentSearches());

        // Persist to CartContext for use in Cart page
        setUserPreferences({
          location: location.name,
          address: location.name,
          deliveryDistance: location.distanceFromKitchen,
          deliveryFee: location.deliveryFee,
          deliveryTime: location.deliveryTime,
          coordinates: { lat: location.lat, lon: location.lon },
        });

        // Haptic feedback on success
        haptics.success();
      } else {
        // Location is outside delivery area
        setSearchQuery(location.name);
        setDebouncedQuery(location.name);
        setSelectedDelivery(null);
        setShowNotFound(true);
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        setApiResults([]);

        // Haptic feedback for not found
        haptics.warning();
      }
    },
    [setUserPreferences]
  );

  // Handle selecting an API result
  const handleSelectApiResult = useCallback(
    (result: PhotonResult) => {
      handleSelectLocation({
        name: result.displayName,
        lat: result.lat,
        lon: result.lon,
        distanceFromKitchen: result.distanceFromKitchen,
        deliveryFee: result.deliveryFee ?? 0,
        deliveryTime: result.deliveryTime ?? "N/A",
        isDeliverable: result.isDeliverable,
      });
    },
    [handleSelectLocation]
  );

  // Handle selecting a popular area
  const handleSelectPopularArea = useCallback(
    (area: (typeof POPULAR_AREAS)[0] & {
      distanceFromKitchen: number;
      deliveryFee: number;
      deliveryTime: string;
      isDeliverable: boolean;
    }) => {
      handleSelectLocation({
        name: area.name,
        lat: area.lat,
        lon: area.lon,
        distanceFromKitchen: area.distanceFromKitchen,
        deliveryFee: area.deliveryFee,
        deliveryTime: area.deliveryTime,
        isDeliverable: area.isDeliverable,
      });
    },
    [handleSelectLocation]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const popularItems = displaySuggestions.popularAreas || [];
      const apiItems = displaySuggestions.apiResults || [];
      const totalItems = popularItems.length + apiItems.length;

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
            if (highlightedIndex < popularItems.length) {
              // Selecting a popular area
              handleSelectPopularArea(popularItems[highlightedIndex]);
            } else {
              // Selecting an API result
              const apiIndex = highlightedIndex - popularItems.length;
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
    },
    [
      showSuggestions,
      displaySuggestions,
      highlightedIndex,
      handleSelectPopularArea,
      handleSelectApiResult,
      handleSearch,
    ]
  );

  // Reverse geocode to get location name from coordinates
  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `${PHOTON_API_URL}reverse?lat=${lat}&lon=${lon}&limit=1`
      );
      if (!response.ok) throw new Error("Reverse geocode failed");
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties;
        // Try to get a meaningful location name (suburb, town, district, city)
        const locationName = props.name || 
          props.suburb || 
          props.district || 
          props.locality ||
          props.city || 
          props.county ||
          props.state ||
          "Your Location";
        return locationName;
      }
      return "Your Location";
    } catch (error) {
      console.error("Reverse geocode error:", error);
      return "Your Location";
    }
  }, []);

  // Geolocation handler
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    setSelectedDelivery(null);
    setShowNotFound(false);
    setShowSuggestions(false);

    // First try with high accuracy, then fall back to low accuracy if it fails
    const tryGetPosition = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Calculate distance from our kitchen in Kigo
          const distanceFromKitchen = getDistanceFromLatLonInKm(
            latitude,
            longitude,
            KITCHEN_LOCATION.lat,
            KITCHEN_LOCATION.lon
          );

          // Get delivery tier info
          const tierInfo = getDeliveryTierInfo(distanceFromKitchen);

          // Reverse geocode to get actual location name
          const locationName = await reverseGeocode(latitude, longitude);

          setIsLocating(false);

          if (tierInfo.isDeliverable) {
            // Within delivery range
            handleSelectLocation({
              name: locationName,
              lat: latitude,
              lon: longitude,
              distanceFromKitchen,
              deliveryFee: tierInfo.fee,
              deliveryTime: tierInfo.time,
              isDeliverable: true,
            });
          } else {
            setSearchQuery(locationName);
            setShowNotFound(true);
            setLocationError(`We don't deliver beyond ${MAX_DELIVERY_DISTANCE_KM}km yet`);
          }
        },
        (error) => {
          // If high accuracy fails, try with low accuracy
          if (highAccuracy && error.code !== error.PERMISSION_DENIED) {
            tryGetPosition(false);
            return;
          }

          setIsLocating(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                "Please enable location access in your browser settings"
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(
                "Location unavailable. Please try again or enter address manually"
              );
              break;
            case error.TIMEOUT:
              setLocationError("Location request timed out. Please try again");
              break;
            default:
              setLocationError(
                "Unable to get location. Please enter address manually"
              );
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 10000 : 15000,
          maximumAge: 0, // Always get fresh location
        }
      );
    };

    // Start with high accuracy
    tryGetPosition(true);
  }, [handleSelectLocation, reverseGeocode]);

  const handleOrderNow = () => {
    if (selectedDelivery) {
      // Navigate to menu with location pre-selected
      navigate("/menu");
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hello, I would like to place an order. My delivery location is ${searchQuery}.`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <section className="relative min-h-[85svh] sm:min-h-[82svh] md:min-h-[78svh] lg:min-h-[82svh] flex items-center pt-20 sm:pt-28 md:pt-28 lg:pt-24 pb-8 sm:pb-10 md:pb-12">
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
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-center gap-4 sm:gap-6 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div
            className={`flex-1 text-center lg:text-left w-full lg:max-w-xl xl:max-w-2xl lg:pt-4 transition-all duration-700 ease-out relative z-20 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            {/* Headline */}
            <h1 className="text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] xl:text-[3.3rem] font-extrabold text-primary-foreground leading-[1.12] xl:leading-[1.18] mb-3 sm:mb-4 text-balance">
              Craving Local Ugandan Food?{" "}
              <span className="text-secondary">We've Got You.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 mb-5 sm:mb-6 leading-relaxed max-w-md mx-auto lg:mx-0">
              Freshly cooked with 100% natural ingredients. Delivered hot and
              fast across Kampala.
            </p>

            {/* Location Search Card */}
            <div
              ref={containerRef}
              className="bg-white rounded-xl sm:rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] p-4 sm:p-5 max-w-md mx-auto lg:mx-0 transition-shadow duration-300 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] relative z-[100]"
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
                        setSelectedDelivery(null);
                        setShowNotFound(false);
                        setLocationError(null);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      className="w-full pl-10 pr-16 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-transparent text-sm transition-all duration-200"
                      aria-label="Enter your delivery address"
                      aria-expanded={
                        showSuggestions && (displaySuggestions.popularAreas.length > 0 || (displaySuggestions.apiResults?.length ?? 0) > 0)
                      }
                      aria-haspopup="listbox"
                      aria-controls="location-suggestions"
                      aria-activedescendant={
                        highlightedIndex >= 0
                          ? `suggestion-${highlightedIndex}`
                          : undefined
                      }
                      role="combobox"
                      autoComplete="off"
                    />
                    {/* Clear Button - shows when there's text */}
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setDebouncedQuery("");
                          setSelectedDelivery(null);
                          setShowNotFound(false);
                          setLocationError(null);
                          setApiResults([]);
                          inputRef.current?.focus();
                        }}
                        className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Clear search"
                        title="Clear"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
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
                    className="btn-secondary px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 whitespace-nowrap text-sm transition-colors"
                    aria-label="Search for delivery availability"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden xs:inline">Find Food</span>
                  </button>
                </div>

                {/* Suggestions Dropdown - Shows for search results or popular areas */}
                {showSuggestions &&
                  (displaySuggestions.popularAreas.length > 0 ||
                    (displaySuggestions.apiResults &&
                      displaySuggestions.apiResults.length > 0) ||
                    isSearching) && (
                    <div
                      ref={dropdownRef}
                      id="location-suggestions"
                      role="listbox"
                      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-visible z-[10500] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[320px] overflow-y-auto"
                      style={{
                        minWidth: '100%',
                        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.18)',
                        border: '1px solid #e5e7eb',
                        marginTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        paddingTop: '0.5rem',
                        zIndex: 9999,
                        left: 0,
                        right: 0,
                        width: '100%',
                        maxWidth: '100%',
                        // Responsive tweaks for mobile
                        ...(window.innerWidth < 640 ? {
                          borderRadius: '1rem',
                          marginLeft: '-1rem',
                          marginRight: '-1rem',
                          width: 'calc(100% + 2rem)',
                          maxWidth: 'calc(100% + 2rem)',
                          boxShadow: '0 8px 32px -8px rgba(0,0,0,0.18)',
                        } : {})
                      }}
                    >
                      {/* Loading indicator */}
                      {isSearching && (
                        <div className="px-4 py-3 flex items-center gap-2 text-gray-500 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Searching locations...
                        </div>
                      )}

                      {/* Section Header for popular areas */}
                      {displaySuggestions.type === "popular" && !isSearching && (
                        <div className="px-4 py-2 bg-secondary/5 border-b border-secondary/10">
                          <span className="text-xs font-medium text-secondary uppercase tracking-wide flex items-center gap-1.5">
                            <Star className="w-3 h-3" />
                            Popular Areas
                          </span>
                        </div>
                      )}

                      {/* Popular Areas */}
                      {displaySuggestions.popularAreas.length > 0 && (
                        <>
                          {displaySuggestions.popularAreas.map((area, index) => (
                            <button
                              key={`popular-${area.name}`}
                              id={`suggestion-${index}`}
                              role="option"
                              aria-selected={highlightedIndex === index}
                              onClick={() => handleSelectPopularArea(area)}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors focus:outline-none ${
                                highlightedIndex === index
                                  ? "bg-secondary/10"
                                  : "hover:bg-secondary/5"
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary/10`}>
                                  <MapPin
                                    className={`w-4 h-4 ${
                                      highlightedIndex === index
                                          ? "text-secondary"
                                          : "text-secondary/70"
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className={`font-medium text-sm block ${
                                      highlightedIndex === index
                                        ? "text-secondary"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {area.name}
                                  </span>
                                  <span className="text-xs text-gray-500 flex items-center gap-2">
                                    <span className="flex items-center gap-1">
                                      <Truck className="w-3 h-3" />
                                      {area.distanceFromKitchen.toFixed(1)} km
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {area.deliveryTime}
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    highlightedIndex === index
                                      ? "bg-secondary/20 text-secondary"
                                      : "bg-gray-100 text-gray-600"
                                  }`}>
                                    {formatPrice(area.deliveryFee)}
                                  </span>
                                <span className="text-xs text-green-600 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> We deliver
                                </span>
                              </div>
                            </button>
                          ))}
                        </>
                      )}

                      {/* API Results (search results) */}
                      {displaySuggestions.apiResults &&
                        displaySuggestions.apiResults.length > 0 && (
                          <>
                            {displaySuggestions.apiResults.map(
                              (result, idx) => {
                                const index =
                                  displaySuggestions.popularAreas.length + idx;
                                return (
                                  <button
                                    key={`api-${result.displayName}-${idx}`}
                                    id={`suggestion-${index}`}
                                    role="option"
                                    aria-selected={highlightedIndex === index}
                                    onClick={() =>
                                      handleSelectApiResult(result)
                                    }
                                    onMouseEnter={() =>
                                      setHighlightedIndex(index)
                                    }
                                    className={`w-full px-4 py-3 text-left flex items-center justify-between gap-3 transition-colors focus:outline-none ${
                                      highlightedIndex === index
                                        ? "bg-secondary/10"
                                        : "hover:bg-secondary/5"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        result.isDeliverable
                                          ? "bg-secondary/10"
                                          : "bg-gray-100"
                                      }`}>
                                        <MapPin
                                          className={`w-4 h-4 ${
                                            result.isDeliverable
                                              ? highlightedIndex === index
                                                  ? "text-secondary"
                                                  : "text-secondary/70"
                                              : "text-gray-400"
                                          }`}
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <span
                                          className={`font-medium text-sm block truncate ${
                                            highlightedIndex === index
                                              ? "text-secondary"
                                              : "text-gray-900"
                                          }`}
                                        >
                                          {result.name}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-2">
                                          {result.isDeliverable ? (
                                            <>
                                              <span className="flex items-center gap-1">
                                                <Truck className="w-3 h-3" />
                                                {result.distanceFromKitchen.toFixed(1)} km
                                              </span>
                                              <span>•</span>
                                              <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {result.deliveryTime}
                                              </span>
                                            </>
                                          ) : (
                                            <span className="flex items-center gap-1 text-amber-600">
                                              <AlertTriangle className="w-3 h-3" />
                                              {result.distanceFromKitchen.toFixed(1)} km (outside delivery area)
                                            </span>
                                          )}
                                        </span>
                                        {result.displayName !== result.name && (
                                          <span className="text-xs text-gray-400 truncate block">
                                            {result.displayName}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                      {result.isDeliverable ? (
                                        <>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                              highlightedIndex === index
                                                ? "bg-secondary/20 text-secondary"
                                                : "bg-gray-100 text-gray-600"
                                            }`}>
                                              {formatPrice(result.deliveryFee!)}
                                            </span>
                                          <span className="text-xs text-green-600 flex items-center gap-0.5">
                                            <Check className="w-3 h-3" /> We deliver
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                          Contact us
                                        </span>
                                      )}
                                    </div>
                                  </button>
                                );
                              }
                            )}
                          </>
                        )}

                      {/* No results message */}
                      {!isSearching &&
                        displaySuggestions.type === "search" &&
                        displaySuggestions.popularAreas.length === 0 &&
                        (!displaySuggestions.apiResults ||
                          displaySuggestions.apiResults.length === 0) &&
                        debouncedQuery.length >= 2 && (
                          <div className="px-4 py-3 text-sm text-gray-500 text-center">
                            No locations found for "{debouncedQuery}"
                          </div>
                        )}

                      {/* Keyboard hint */}
                      {(displaySuggestions.popularAreas.length > 0 ||
                        (displaySuggestions.apiResults &&
                          displaySuggestions.apiResults.length > 0)) && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 hidden sm:flex items-center justify-center gap-4 text-xs text-gray-400">
                          <span>
                            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                              ↑↓
                            </kbd>{" "}
                            Navigate
                          </span>
                          <span>
                            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                              Enter
                            </kbd>{" "}
                            Select
                          </span>
                          <span>
                            <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">
                              Esc
                            </kbd>{" "}
                            Close
                          </span>
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Location Error */}
              {locationError && !selectedDelivery && !showNotFound && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1.5">
                  <XCircle className="w-3 h-3" />
                  {locationError}
                </div>
              )}

              {/* Result Messages */}
              {selectedDelivery && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-green-800 font-semibold text-sm">
                        We deliver to {selectedDelivery.locationName}!
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1.5 text-xs text-green-700">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedDelivery.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {formatPrice(selectedDelivery.fee)}
                        </span>
                        <span className="flex items-center gap-1 text-green-600/70">
                          ({selectedDelivery.distance.toFixed(1)} km away)
                        </span>
                      </div>
                      <button
                        onClick={handleOrderNow}
                        className="mt-2.5 btn-secondary text-xs px-4 py-2 transition-colors"
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
                        Outside delivery area
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        We currently deliver within {MAX_DELIVERY_DISTANCE_KM}km. Contact us to check availability.
                      </p>
                      <button
                        onClick={handleWhatsAppContact}
                        className="mt-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <WhatsAppIcon className="w-4 h-4" />
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
            className={`flex-shrink-0 w-full max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[340px] xl:max-w-[400px] lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2 xl:right-12 transition-all duration-700 delay-100 ease-out z-10 ${
              isVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95"
            }`}
          >
            <div className="relative">
              {/* Subtle shadow effect behind image */}
              <div className="absolute inset-0 bg-secondary/15 blur-3xl rounded-full scale-90 -z-10" />
              <OptimizedImage
                src="/images/lusaniya/9Yards-Food-Lusaniya-05.png"
                alt="Delicious Ugandan food platter featuring fresh local cuisine"
                className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
