import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  KITCHEN_LOCATION,
  MAX_DELIVERY_DISTANCE_KM,
  getDistanceFromLatLonInKm,
  getDeliveryTierInfo,
} from '@/lib/constants';

// Photon API configuration
const PHOTON_API_URL = "https://photon.komoot.io/api/";
const KAMPALA_CENTER = { lat: 0.3476, lon: 32.5825 };
const KAMPALA_METRO_RADIUS_KM = 25;

export interface PhotonResult {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  type: string;
  distanceFromKitchen: number;
  deliveryFee: number | null;
  deliveryTime: string | null;
  isDeliverable: boolean;
  isInKampalaArea: boolean;
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

        // Calculate distance from kitchen and get tier-based pricing
        const distanceFromKitchen = getDistanceFromLatLonInKm(
          lat, lon,
          KITCHEN_LOCATION.lat, KITCHEN_LOCATION.lon
        );
        const tierInfo = getDeliveryTierInfo(distanceFromKitchen);

        const distanceToKampala = getDistanceFromLatLonInKm(lat, lon, KAMPALA_CENTER.lat, KAMPALA_CENTER.lon);
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
  };
}
