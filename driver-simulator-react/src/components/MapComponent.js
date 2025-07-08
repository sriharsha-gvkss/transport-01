import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Box } from '@mui/material';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ currentLocation, locationHistory, driverLocation, showDriverLocation = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 15);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Create driver marker
      const driverIcon = L.divIcon({
        className: 'driver-marker',
        html: '<div style="background-color: #1976d2; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      markerRef.current = L.marker([currentLocation.lat, currentLocation.lng], { icon: driverIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup('Driver Location');

      // Create driver marker for rider view
      if (showDriverLocation) {
        const driverIconRed = L.divIcon({
          className: 'driver-marker-red',
          html: '<div style="background-color: #f44336; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        driverMarkerRef.current = L.marker([currentLocation.lat, currentLocation.lng], { icon: driverIconRed })
          .addTo(mapInstanceRef.current)
          .bindPopup('Driver Location');
      }

      // Create path for location history
      pathRef.current = L.polyline([], { color: '#1976d2', weight: 3, opacity: 0.7 })
        .addTo(mapInstanceRef.current);
    }

    // Update marker position
    if (markerRef.current) {
      markerRef.current.setLatLng([currentLocation.lat, currentLocation.lng]);
    }

    // Update driver marker position if available
    if (driverMarkerRef.current && driverLocation) {
      driverMarkerRef.current.setLatLng([driverLocation.lat, driverLocation.lng]);
    }

    // Update path
    if (pathRef.current && locationHistory.length > 1) {
      const pathCoords = locationHistory.map(loc => [loc.lat, loc.lng]);
      pathRef.current.setLatLngs(pathCoords);
    }

    // Center map on current location or driver location
    if (mapInstanceRef.current) {
      if (showDriverLocation && driverLocation) {
        // Center between user and driver
        const centerLat = (currentLocation.lat + driverLocation.lat) / 2;
        const centerLng = (currentLocation.lng + driverLocation.lng) / 2;
        mapInstanceRef.current.setView([centerLat, centerLng], 14);
      } else {
        mapInstanceRef.current.setView([currentLocation.lat, currentLocation.lng]);
      }
    }

  }, [currentLocation, locationHistory, driverLocation, showDriverLocation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  return (
    <Box
      ref={mapRef}
      sx={{
        height: 400,
        width: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}
    />
  );
};

export default MapComponent; 