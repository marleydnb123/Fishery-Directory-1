import React, { useState } from 'react';
import { APIProvider, Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';
import { useEffect } from 'react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, name }) => {
  const [mapError, setMapError] = useState<boolean>(false);
  const coreLibrary = useMapsLibrary('core');
  const [mapInstance, setMapInstance] = useState(null);

  // Early return if coordinates are missing
  if (!latitude || !longitude) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 gap-2">
        <MapPin className="w-8 h-8" />
        <p>Location data not available</p>
      </div>
    );
  }

  // Fallback UI for map errors
  if (mapError) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 gap-3 p-4">
        <MapPin className="w-8 h-8" />
        <div className="text-center">
          <p className="font-medium">Map temporarily unavailable</p>
          <p className="text-sm mt-1">Location: {name}</p>
          <p className="text-sm">Coordinates: {latitude}, {longitude}</p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider 
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDnt92TtJtFGhGCtzarFJ7Nnt_hI3XsVU4"}
      onError={(e) => {
        console.error('Google Maps Error:', e);
        setMapError(true);
      }}
    >
      <div className="h-[300px] rounded-lg overflow-hidden"> 
        <Map
          zoom={14}
          gestureHandling={'greedy'}
          center={{ lat: latitude, lng: longitude }}
          options={{
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,
            gestureHandling: "greedy",
            clickableIcons: true,
            keyboardShortcuts: true
          }}
          mapId="fishery-map"
          onLoad={(map) => setMapInstance(map)}
        >
          {coreLibrary && (
            <Marker 
              position={{ lat: latitude, lng: longitude }} 
              title={name}
              options={{
                draggable: false,
                animation: coreLibrary.Animation.DROP
              }}
            />
          )}
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;