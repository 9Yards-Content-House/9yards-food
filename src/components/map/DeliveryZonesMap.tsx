import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DeliveryZone } from '@/data/menu';
import { formatPrice } from '@/lib/utils/order';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon matching brand colors
const createCustomIcon = (color: string) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background: ${color};
    width: 24px;
    height: 24px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Map center (Kampala)
const KAMPALA_CENTER: [number, number] = [0.3163, 32.5822];

// Component to fly to selected zone
function FlyToZone({ zone }: { zone: DeliveryZone | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (zone?.coordinates) {
      map.flyTo(zone.coordinates, 14, { duration: 1 });
    }
  }, [zone, map]);
  
  return null;
}

interface TierConfig {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface DeliveryZonesMapProps {
  zones: DeliveryZone[];
  selectedZone: DeliveryZone | null;
  tierConfig: Record<string, TierConfig>;
  getZoneTier: (fee: number) => string;
  onZoneSelect: (zone: DeliveryZone) => void;
}

export default function DeliveryZonesMap({
  zones,
  selectedZone,
  tierConfig,
  getZoneTier,
  onZoneSelect,
}: DeliveryZonesMapProps) {
  return (
    <MapContainer
      center={KAMPALA_CENTER}
      zoom={12}
      className="h-full w-full"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Zone markers */}
      {zones.map((zone) => {
        if (!zone.coordinates) return null;
        const tier = getZoneTier(zone.fee);
        const config = tierConfig[tier];
        
        return (
          <Marker
            key={zone.name}
            position={zone.coordinates}
            icon={createCustomIcon(config.color)}
            eventHandlers={{
              click: () => onZoneSelect(zone),
            }}
          >
            <Popup>
              <div className="text-center p-1">
                <h4 className="font-bold text-[#212282]">{zone.name}</h4>
                <p className="text-sm text-gray-600">{zone.estimatedTime}</p>
                <p className="font-bold text-[#E6411C]">{formatPrice(zone.fee)}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
      {/* Highlight selected zone */}
      {selectedZone?.coordinates && (
        <Circle
          center={selectedZone.coordinates}
          radius={1500}
          pathOptions={{
            color: tierConfig[getZoneTier(selectedZone.fee)].color,
            fillColor: tierConfig[getZoneTier(selectedZone.fee)].color,
            fillOpacity: 0.15,
          }}
        />
      )}
      
      <FlyToZone zone={selectedZone} />
    </MapContainer>
  );
}
