import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const markerColors = {
  user: '#3B82F6',
  competitor: '#EF4444',
  school: '#F59E0B',
  hospital: '#10B981',
  market: '#8B5CF6',
  residential: '#6B7280'
};

function createCustomIcon(color, label) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">${label}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

export default function MapView({ center, competitors = [], nearbyPlaces = [], userLocation, height = "400px" }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([center.lat, center.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add user location marker
    if (userLocation) {
      L.marker([userLocation.lat, userLocation.lng], {
        icon: createCustomIcon(markerColors.user, 'U')
      })
        .addTo(map)
        .bindPopup(`<strong>${userLocation.name}</strong><br/>Your business location`)
        .openPopup();
    }

    // Add competitor markers
    competitors.forEach(comp => {
      L.marker([comp.lat, comp.lng], {
        icon: createCustomIcon(markerColors.competitor, 'C')
      })
        .addTo(map)
        .bindPopup(`<strong>${comp.name}</strong><br/>Type: ${comp.type}<br/>Distance: ${comp.distance}<br/>Rating: ${comp.rating}/5`);
    });

    // Add nearby place markers
    nearbyPlaces.forEach(place => {
      const color = markerColors[place.type] || '#6B7280';
      const label = place.type === 'school' ? 'S' : place.type === 'hospital' ? 'H' : place.type === 'market' ? 'M' : 'R';
      L.marker([place.lat, place.lng], {
        icon: createCustomIcon(color, label)
      })
        .addTo(map)
        .bindPopup(`<strong>${place.name}</strong><br/>Type: ${place.type}<br/>Distance: ${place.distance}`);
    });

    // Fit bounds to show all markers
    const allPoints = [
      ...(userLocation ? [[userLocation.lat, userLocation.lng]] : []),
      ...competitors.map(c => [c.lat, c.lng]),
      ...nearbyPlaces.map(p => [p.lat, p.lng])
    ];

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [center, competitors, nearbyPlaces, userLocation]);

  return (
    <div className="relative">
      <div ref={mapRef} style={{ height, width: "100%" }} className="rounded-xl z-0" />
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <p className="text-xs font-semibold text-gray-700 mb-2">Legend</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerColors.user }} />
            <span className="text-xs text-gray-600">Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerColors.competitor }} />
            <span className="text-xs text-gray-600">Competitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerColors.school }} />
            <span className="text-xs text-gray-600">Schools</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerColors.hospital }} />
            <span className="text-xs text-gray-600">Hospitals</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerColors.market }} />
            <span className="text-xs text-gray-600">Markets</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: markerColors.residential }} />
            <span className="text-xs text-gray-600">Residential</span>
          </div>
        </div>
      </div>
    </div>
  );
}
