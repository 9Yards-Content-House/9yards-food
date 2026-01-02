import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, Clock, Truck, CheckCircle2, XCircle } from "lucide-react";
import { deliveryZones } from "@/data/menu";
import { formatPrice } from "@/lib/utils/order";
import { WHATSAPP_NUMBER } from "@/lib/constants";

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

export default function HeroSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState<typeof deliveryZones[0] | null>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Filter zones based on search query
  const filteredZones = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    
    return deliveryZones.filter((zone) => {
      // Check zone name
      if (zone.name.toLowerCase().includes(query)) return true;
      
      // Check aliases
      const aliases = locationAliases[zone.name] || [];
      return aliases.some((alias) => alias.includes(query));
    });
  }, [searchQuery]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    if (filteredZones.length > 0) {
      setSelectedZone(filteredZones[0]);
      setShowNotFound(false);
    } else {
      setSelectedZone(null);
      setShowNotFound(true);
    }
    setShowSuggestions(false);
  };

  const handleSelectZone = (zone: typeof deliveryZones[0]) => {
    setSearchQuery(zone.name);
    setSelectedZone(zone);
    setShowNotFound(false);
    setShowSuggestions(false);
  };

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
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container-custom relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 sm:gap-8 lg:gap-12 xl:gap-16">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full lg:max-w-xl xl:max-w-2xl lg:pt-4">
            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground leading-[1.1] mb-3 sm:mb-4">
              Craving Local Food? <br className="hidden sm:block" />
              We've <span className="text-secondary">Got You.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/80 mb-5 sm:mb-6 leading-relaxed">
              Find fresh, delicious Ugandan meals delivered to your door.
            </p>

            {/* Location Search Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 max-w-md mx-auto lg:mx-0">
              {/* Search Input */}
              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                    <input
                      type="text"
                      placeholder="Enter Your Address"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                        setSelectedZone(null);
                        setShowNotFound(false);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full pl-10 pr-3 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary text-sm"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="btn-secondary px-4 sm:px-5 py-2.5 sm:py-3 flex items-center gap-2 whitespace-nowrap text-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden xs:inline">Find Food</span>
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && searchQuery && filteredZones.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
                    {filteredZones.map((zone) => (
                      <button
                        key={zone.name}
                        onClick={() => handleSelectZone(zone)}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span className="text-gray-900 font-medium text-sm">{zone.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{zone.estimatedTime}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Result Messages */}
              {selectedZone && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-green-800 font-semibold text-sm">
                        We deliver to {selectedZone.name}!
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-green-700">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {selectedZone.estimatedTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {selectedZone.fee === 0 ? "Free" : formatPrice(selectedZone.fee)}
                        </span>
                      </div>
                      <button
                        onClick={handleOrderNow}
                        className="mt-2 btn-secondary text-xs px-3 py-1.5"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showNotFound && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-amber-800 font-semibold text-sm">
                        Area not found
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Contact us to check availability.
                      </p>
                      <button
                        onClick={handleWhatsAppContact}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
                      >
                        WhatsApp Us
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full max-w-[200px] sm:max-w-[240px] md:max-w-[300px] lg:max-w-[340px] xl:max-w-[380px] lg:absolute lg:right-4 lg:top-1/2 lg:-translate-y-1/2 xl:right-12">
            <div className="relative">
              <img
                src="/images/lusaniya/9Yards-Food-Lusaniya-01.png"
                alt="Delicious Ugandan food platter"
                className="w-full h-auto object-contain drop-shadow-2xl animate-float"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
