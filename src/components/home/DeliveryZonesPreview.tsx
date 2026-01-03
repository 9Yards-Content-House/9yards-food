import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Search, CheckCircle, XCircle } from 'lucide-react';
import { deliveryZones } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';
import { useState, useMemo } from 'react';

export default function DeliveryZonesPreview() {
  const featuredZones = deliveryZones.slice(0, 6);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Check if search query matches any zone
  const matchedZone = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return deliveryZones.find(zone => 
      zone.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <section className="section-padding bg-primary text-primary-foreground overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Delivery Coverage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              We Deliver Across Kampala
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed">
              From Kololo to Ntinda, Bugolobi to Muyenga—we've got Kampala covered. 
              Check if we deliver to your area and see our delivery fees.
            </p>

            {/* Search Input - Check if we deliver */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-5 h-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHasSearched(false);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Check if we deliver to you..."
                  className="w-full pl-12 pr-24 py-4 rounded-xl bg-primary-foreground text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary shadow-lg"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Check
                </button>
              </div>
              
              {/* Search Result */}
              {hasSearched && (
                <div className="mt-3">
                  {matchedZone ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        Yes! We deliver to <strong>{matchedZone.name}</strong> for {formatPrice(matchedZone.fee)} ({matchedZone.estimatedTime})
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-secondary">
                      <XCircle className="w-5 h-5" />
                      <span>
                        We don't cover that area yet. <Link to="/contact" className="underline">Request it!</Link>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Zone Pills */}
            <div className="flex flex-wrap gap-3 mb-8">
              {featuredZones.map((zone) => (
                <button
                  key={zone.name}
                  onClick={() => {
                    setSearchQuery(zone.name);
                    setHasSearched(true);
                  }}
                  className="bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary-foreground/20 hover:scale-105 transition-all cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">{zone.name}</span>
                  <span className="text-xs text-primary-foreground/60">
                    {formatPrice(zone.fee)}
                  </span>
                </button>
              ))}
            </div>

            <Link
              to="/delivery-zones"
              className="btn-secondary inline-flex items-center gap-2"
            >
              View All Zones
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Map Preview */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary-foreground/10 to-primary-foreground/5 border border-primary-foreground/10 relative">
              {/* Stylized Map Background */}
              <div className="absolute inset-0 opacity-30">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Grid lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <g key={i}>
                      <line x1={i * 40} y1="0" x2={i * 40} y2="400" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                      <line x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    </g>
                  ))}
                  {/* Road-like curves */}
                  <path d="M50 200 Q150 150 200 200 T350 200" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                  <path d="M200 50 Q150 150 200 200 T200 350" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                  <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
                  <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
                </svg>
              </div>

              {/* Kampala Label */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="w-4 h-4 bg-secondary rounded-full mx-auto mb-2 shadow-lg" />
                <span className="text-primary-foreground font-bold text-lg">Kampala</span>
              </div>

              {/* Pins */}
              {[
                { top: '25%', left: '35%', name: 'Kololo' },
                { top: '40%', left: '60%', name: 'Ntinda' },
                { top: '65%', left: '30%', name: 'Muyenga' },
                { top: '30%', left: '65%', name: 'Bukoto' },
                { top: '55%', left: '55%', name: 'Bugolobi' },
                { top: '70%', left: '60%', name: 'Nakawa' },
              ].map((pos, i) => (
                <div
                  key={i}
                  className="absolute group cursor-pointer"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className="w-4 h-4 bg-secondary rounded-full shadow-lg group-hover:scale-150 transition-transform" />
                  <div className="absolute top-1 left-1 w-2 h-2 bg-secondary/50 rounded-full animate-ping" />
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card text-foreground text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    {pos.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Free delivery badge */}
            <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-secondary to-orange-500 text-secondary-foreground px-6 py-4 rounded-xl shadow-lg">
              <div className="text-xs uppercase tracking-wider opacity-80">
                Orders over 50,000 UGX
              </div>
              <div className="font-bold text-xl">FREE Delivery!</div>
            </div>

            {/* Request new area */}
            <div className="absolute -bottom-4 right-0 md:-right-4">
              <Link
                to="/contact"
                className="bg-primary-foreground text-foreground px-4 py-3 rounded-xl shadow-lg text-sm font-medium hover:bg-primary-foreground/90 transition-colors inline-flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Request New Area
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
