import { useState, useMemo, useEffect, useCallback, lazy, Suspense } from 'react';
import { MapPin, Clock, Truck, Phone, Search, X, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Navigation, Zap, Crosshair, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/layout/Header';

// Lazy load the map component (Leaflet is ~170KB)
const DeliveryZonesMap = lazy(() => import('@/components/map/DeliveryZonesMap'));
import MobilePageHeader from '@/components/layout/MobilePageHeader';
import SEO from '@/components/SEO';
import { pageMetadata } from '@/data/seo';
import Footer from '@/components/layout/Footer';
import { deliveryZones, DeliveryZone } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { haptics } from '@/lib/utils/ui';

// Peak hours utility
function isPeakHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return (hour >= 12 && hour < 14) || (hour >= 18 && hour < 20);
}

function getAdjustedTime(baseTime: string): string {
  if (!isPeakHours()) return baseTime;
  const match = baseTime.match(/(\d+)-(\d+)/);
  if (match) {
    return `${parseInt(match[1]) + 15}-${parseInt(match[2]) + 15} mins`;
  }
  return baseTime;
}

// Zone tiers based on delivery fee
type ZoneTier = 'express' | 'standard' | 'extended';

function getZoneTier(fee: number): ZoneTier {
  if (fee <= 5000) return 'express';
  if (fee <= 7000) return 'standard';
  return 'extended';
}

const tierConfig = {
  express: {
    label: 'Express Zone',
    description: 'Fastest delivery, closest to us',
    color: '#22c55e',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    icon: Zap,
  },
  standard: {
    label: 'Standard Zone',
    description: 'Regular delivery times',
    color: '#3b82f6',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    icon: Truck,
  },
  extended: {
    label: 'Extended Zone',
    description: 'Slightly longer delivery',
    color: '#f59e0b',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    icon: Navigation,
  },
};

export default function DeliveryZonesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [expandedTier, setExpandedTier] = useState<ZoneTier | null>('express');
  const [showMap, setShowMap] = useState(true);
  const peakHours = isPeakHours();
  
  // Location detection state
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestZone, setNearestZone] = useState<DeliveryZone | null>(null);
  
  const { state, setUserPreferences } = useCart();
  const navigate = useNavigate();

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Find nearest zone to user location
  const findNearestZone = useCallback((userLat: number, userLon: number): DeliveryZone | null => {
    let nearest: DeliveryZone | null = null;
    let minDistance = Infinity;
    
    deliveryZones.forEach(zone => {
      if (zone.coordinates) {
        const distance = calculateDistance(userLat, userLon, zone.coordinates[0], zone.coordinates[1]);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = zone;
        }
      }
    });
    
    return nearest;
  }, [calculateDistance]);

  // Detect user location
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    setLocationError(null);
    haptics.light();
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        
        const nearest = findNearestZone(latitude, longitude);
        if (nearest) {
          setNearestZone(nearest);
          setSelectedZone(nearest);
          
          // Expand the tier containing the nearest zone
          const tier = getZoneTier(nearest.fee);
          setExpandedTier(tier);
          
          haptics.success();
        }
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        haptics.warning();
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please try again.');
            break;
          default:
            setLocationError('Unable to detect your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [findNearestZone]);

  // Group zones by tier
  const groupedZones = useMemo(() => {
    const groups: Record<ZoneTier, DeliveryZone[]> = {
      express: [],
      standard: [],
      extended: [],
    };
    
    deliveryZones.forEach(zone => {
      const tier = getZoneTier(zone.fee);
      groups[tier].push(zone);
    });
    
    // Sort each group by fee
    Object.keys(groups).forEach(tier => {
      groups[tier as ZoneTier].sort((a, b) => a.fee - b.fee);
    });
    
    return groups;
  }, []);

  // Filter zones based on search
  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return groupedZones;
    
    const query = searchQuery.toLowerCase();
    const filtered: Record<ZoneTier, DeliveryZone[]> = {
      express: [],
      standard: [],
      extended: [],
    };
    
    Object.entries(groupedZones).forEach(([tier, zones]) => {
      filtered[tier as ZoneTier] = zones.filter(zone => 
        zone.name.toLowerCase().includes(query)
      );
    });
    
    return filtered;
  }, [groupedZones, searchQuery]);

  // Total zones count for search results
  const totalFilteredZones = Object.values(filteredZones).flat().length;

  const handleZoneSelect = (zone: DeliveryZone) => {
    haptics.light();
    setSelectedZone(zone);
    
    // Save to cart context
    setUserPreferences({ location: zone.name });
    
    // On mobile, scroll to map
    if (window.innerWidth < 1024) {
      document.getElementById('delivery-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle "Order Now" with selected zone
  const handleOrderNow = () => {
    if (selectedZone) {
      haptics.medium();
      setUserPreferences({ location: selectedZone.name });
      navigate('/menu');
    }
  };

  const toggleTier = (tier: ZoneTier) => {
    haptics.light();
    setExpandedTier(prev => prev === tier ? null : tier);
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <SEO 
        title={pageMetadata.deliveryZones.title}
        description={pageMetadata.deliveryZones.description}
        keywords={pageMetadata.deliveryZones.keywords}
        image={pageMetadata.deliveryZones.ogImage}
        url={pageMetadata.deliveryZones.canonicalUrl}
        jsonLd={pageMetadata.deliveryZones.schema}
      />
      <Header />
      
      <main id="main-content" className="pt-16 md:pt-20">
        {/* Mobile App-Style Header */}
        <MobilePageHeader 
          title="Delivery Zones"
          subtitle={`${deliveryZones.length} areas covered`}
        />

        {/* Desktop Hero */}
        <section className="hidden lg:block bg-gradient-to-br from-[#212282] to-[#1a1a6e] text-white py-12">
          <div className="container-custom px-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Delivery Areas
              </h1>
              <p className="text-white/70 text-lg">
                We deliver across Kampala! Check if we cover your area and see delivery fees.
              </p>
            </div>
          </div>
        </section>

        <div className="container-custom px-4 py-6 lg:py-10">
          {/* Peak Hours Alert */}
          {peakHours && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-[#E6411C] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">Peak Hours Active</p>
                <p className="text-sm text-gray-600">
                  Delivery times may be 15-20 mins longer than usual. We're working hard to get your food to you!
                </p>
              </div>
            </motion.div>
          )}

          {/* Free Delivery Banner */}
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-[#E6411C] to-[#ff6b4a] text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">FREE Delivery</h3>
                <p className="text-white/90 text-sm">
                  On all orders over {formatPrice(50000)}!
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your area..."
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-[#212282]/20 focus:border-[#212282] transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              
              {/* Location Detection Button */}
              <button
                onClick={detectLocation}
                disabled={isLocating}
                className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#212282] text-white text-sm font-bold hover:bg-[#1a1a6e] active:scale-[0.98] transition-all disabled:opacity-70"
              >
                {isLocating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Crosshair className="w-5 h-5" />
                )}
                <span>{isLocating ? 'Detecting...' : 'Use My Location'}</span>
              </button>
            </div>
            
            {/* Location Error */}
            {locationError && (
              <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{locationError}</p>
              </div>
            )}
            
            {/* Nearest Zone Found */}
            {nearestZone && !locationError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-green-800 truncate">Nearest zone: {nearestZone.name}</p>
                    <p className="text-xs text-green-600">{formatPrice(nearestZone.fee)} • {nearestZone.estimatedTime}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleZoneSelect(nearestZone)}
                  className="text-xs font-bold text-green-700 hover:text-green-800 px-3 py-1.5 bg-green-100 hover:bg-green-200 rounded-lg transition-colors flex-shrink-0"
                >
                  View on map
                </button>
              </motion.div>
            )}
            
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground">
                {totalFilteredZones} area{totalFilteredZones !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Zones List */}
            <div className="space-y-4">
              {(['express', 'standard', 'extended'] as ZoneTier[]).map(tier => {
                const config = tierConfig[tier];
                const zones = filteredZones[tier];
                const isExpanded = expandedTier === tier;
                const TierIcon = config.icon;
                
                if (zones.length === 0 && searchQuery) return null;
                
                return (
                  <div 
                    key={tier}
                    className={`rounded-xl border overflow-hidden transition-all ${config.borderColor} ${
                      isExpanded ? 'shadow-md' : ''
                    }`}
                  >
                    {/* Tier Header */}
                    <button
                      onClick={() => toggleTier(tier)}
                      className={`w-full p-4 flex items-center justify-between ${config.bgColor} transition-colors`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.textColor} bg-white`}>
                          <TierIcon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <h3 className={`font-bold ${config.textColor}`}>{config.label}</h3>
                          <p className="text-xs text-muted-foreground">{config.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
                          {zones.length}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    
                    {/* Zones in Tier */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 bg-white divide-y divide-border/50">
                            {zones.map((zone) => (
                              <button
                                key={zone.name}
                                onClick={() => handleZoneSelect(zone)}
                                className={`w-full p-3 flex items-center justify-between hover:bg-muted/50 rounded-lg transition-colors ${
                                  selectedZone?.name === zone.name ? 'bg-muted' : ''
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: config.color }}
                                  />
                                  <div className="text-left">
                                    <h4 className="font-semibold text-foreground text-sm">
                                      {zone.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Clock className="w-3 h-3" />
                                      <span className={peakHours ? 'text-orange-600' : ''}>
                                        {getAdjustedTime(zone.estimatedTime)}
                                      </span>
                                      {peakHours && (
                                        <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                                          +15 min
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-[#E6411C] text-sm">
                                    {formatPrice(zone.fee)}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              {/* No Results */}
              {totalFilteredZones === 0 && searchQuery && (
                <div className="text-center py-8 px-4 bg-muted/30 rounded-xl">
                  <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-bold text-foreground mb-1">No areas found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    We couldn't find "{searchQuery}" in our delivery zones.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-[#212282] font-medium hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="lg:sticky lg:top-24">
              <div 
                id="delivery-map"
                className="rounded-2xl overflow-hidden border border-border shadow-sm"
              >
                {/* Map Toggle for Mobile */}
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="lg:hidden w-full p-4 bg-muted/50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#212282]" />
                    <span className="font-medium text-foreground">Interactive Map</span>
                  </div>
                  {showMap ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                {/* Map Container */}
                <AnimatePresence>
                  {(showMap || window.innerWidth >= 1024) && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="h-[300px] lg:h-[500px]">
                        <Suspense fallback={
                          <div className="h-full w-full bg-muted/30 flex items-center justify-center">
                            <div className="text-center">
                              <Loader2 className="w-8 h-8 animate-spin text-[#212282] mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Loading map...</p>
                            </div>
                          </div>
                        }>
                          <DeliveryZonesMap
                            zones={deliveryZones}
                            selectedZone={selectedZone}
                            tierConfig={tierConfig}
                            getZoneTier={getZoneTier}
                            onZoneSelect={handleZoneSelect}
                          />
                        </Suspense>
                      </div>
                      
                      {/* Selected Zone Info */}
                      {selectedZone && (
                        <div className="p-4 bg-white border-t border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: `${tierConfig[getZoneTier(selectedZone.fee)].color}20` }}
                              >
                                <MapPin 
                                  className="w-5 h-5"
                                  style={{ color: tierConfig[getZoneTier(selectedZone.fee)].color }}
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-foreground">{selectedZone.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{getAdjustedTime(selectedZone.estimatedTime)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-bold text-[#E6411C]">
                                {formatPrice(selectedZone.fee)}
                              </span>
                              <p className="text-xs text-muted-foreground">delivery fee</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-700 font-medium">
                              We deliver to this area!
                            </span>
                          </div>
                          
                          {/* Order Now CTA */}
                          <div className="mt-4 flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={handleOrderNow}
                              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#E6411C] text-white rounded-xl text-sm font-bold hover:bg-[#d13a18] active:scale-[0.98] transition-all"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>Order Now</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                            {state.items.length > 0 && (
                              <Link
                                to="/cart"
                                className="flex items-center justify-center gap-2 py-3 px-4 bg-[#212282] text-white rounded-xl text-sm font-bold hover:bg-[#1a1a6e] active:scale-[0.98] transition-all"
                              >
                                <span>Go to Cart</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Map Legend */}
              <div className="hidden lg:block mt-4 p-4 bg-muted/30 rounded-xl">
                <h4 className="text-sm font-bold text-foreground mb-3">Zone Legend</h4>
                <div className="space-y-2">
                  {(['express', 'standard', 'extended'] as ZoneTier[]).map(tier => {
                    const config = tierConfig[tier];
                    return (
                      <div key={tier} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-sm text-muted-foreground">{config.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Not in list CTA */}
          <div className="mt-10 text-center p-8 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl border border-border">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Phone className="w-7 h-7 text-[#212282]" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Don't See Your Area?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              We're constantly expanding! Contact us and we'll try to accommodate your delivery.
            </p>
            <a
              href="https://wa.me/256708899597"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#22c55e] transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
