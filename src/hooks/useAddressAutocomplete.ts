import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { deliveryZones } from '@/data/menu';

// Photon API configuration
const PHOTON_API_URL = "https://photon.komoot.io/api/";
const KAMPALA_CENTER = { lat: 0.3476, lon: 32.5825 };
const KAMPALA_METRO_RADIUS_KM = 25;
const DELIVERY_ZONE_NAMES = deliveryZones.map((z) => z.name.toLowerCase());

export interface PhotonResult {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  nearestZone: (typeof deliveryZones)[0] | null;
  distanceToZone: number;
  isDeliverable: boolean;
  isInKampalaArea: boolean;
  isExactZoneMatch: boolean;
}

const locationAliases: Record<string, string[]> = {
  "Kampala Central": ["kampala", "central", "city centre", "city center", "downtown", "old kampala"],
  Nakawa: ["nakawa", "nakawa division"],
  Kololo: ["kololo", "kololo hill"],
  Ntinda: ["ntinda", "ntinda trading centre", "ntinda trading center"],
  Bugolobi: ["bugolobi", "bugolobi flats"],
  Muyenga: ["muyenga", "muyenga hill", "tank hill"],
  Kabalagala: ["kabalagala", "kaba", "kabalagala trading centre"],
  Kira: ["kira", "kira town", "kira municipality"],
  Naalya: ["naalya", "nalya", "naalya estates"],
  Kyanja: ["kyanja", "kyanja ring road"],
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestDeliveryZone(lat: number, lon: number): { zone: (typeof deliveryZones)[0] | null; distance: number } {
  let nearestZone: (typeof deliveryZones)[0] | null = null;
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

async function fetchPhotonSuggestions(query: string, signal: AbortSignal): Promise<PhotonResult[]> {
  if (!query.trim() || query.length < 2) return [];

  try {
    const params = new URLSearchParams({
      q: query,
      limit: "6",
      lat: "0.3476",
      lon: "32.5825",
      lang: "en",
    });

    const response = await fetch(`${PHOTON_API_URL}?${params}`, { signal });
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();

    const results: PhotonResult[] = data.features
      .filter((feature: any) => feature.properties?.country === "Uganda")
      .map((feature: any) => {
        const props = feature.properties;
        const [lon, lat] = feature.geometry.coordinates;

        const parts = [
          props.name,
          props.locality,
          props.district,
          props.city,
          props.county,
        ].filter(Boolean);
        const displayName = [...new Set(parts)].slice(0, 3).join(", ");

        const { zone, distance } = findNearestDeliveryZone(lat, lon);
        const distanceToKampala = getDistanceFromLatLonInKm(lat, lon, KAMPALA_CENTER.lat, KAMPALA_CENTER.lon);
        const isInKampalaArea = distanceToKampala <= KAMPALA_METRO_RADIUS_KM;

        const locationName = (props.name || "").toLowerCase().trim();
        const locationWords = locationName.split(/[\s,]+/);

        const isExactZoneMatch = DELIVERY_ZONE_NAMES.some((zoneName) => {
          if (locationName === zoneName) return true;
          if (locationName.startsWith(zoneName + " ") || locationName.startsWith(zoneName + ",")) return true;
          if (locationWords[0] === zoneName) return true;
          return false;
        });

        const matchesAlias = Object.entries(locationAliases).some(([, aliases]) => {
          return aliases.some((alias) => {
            if (locationName === alias) return true;
            if (locationName.startsWith(alias + " ") || locationName.startsWith(alias + ",")) return true;
            if (locationWords[0] === alias) return true;
            return false;
          });
        });

        return {
          name: props.name || displayName,
          displayName: displayName || props.name,
          lat,
          lon,
          type: props.osm_value || props.type || "place",
          nearestZone: zone,
          distanceToZone: distance,
          isDeliverable: isExactZoneMatch || matchesAlias,
          isInKampalaArea,
          isExactZoneMatch: isExactZoneMatch || matchesAlias,
        };
      })
      .filter((result: PhotonResult, index: number, self: PhotonResult[]) =>
        index === self.findIndex((r) => r.displayName === result.displayName)
      );

    return results;
  } catch (error) {
    if ((error as Error).name === "AbortError") return [];
    console.warn("Photon API error, falling back to local search:", error);
    return [];
  }
}

export function useAddressAutocomplete(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<PhotonResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    if (!debouncedQuery.trim() || debouncedQuery.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const fetchResults = async () => {
      setIsSearching(true);
      const results = await fetchPhotonSuggestions(debouncedQuery, abortController.signal);
      if (!abortController.signal.aborted) {
        setSuggestions(results);
        setIsSearching(false);
      }
    };

    fetchResults();
    return () => abortController.abort();
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    suggestions,
    isSearching,
    findNearestDeliveryZone: (lat: number, lon: number) => findNearestDeliveryZone(lat, lon)
  };
}
