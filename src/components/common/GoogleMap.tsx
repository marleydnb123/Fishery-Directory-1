import React, { useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

/**
 * GoogleMap Component
 * 
 * Displays an interactive Google Map with a marker at the specified location.
 * Includes fallback UI for cases where the map cannot be loaded.
 */
const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, name }) => {
  const [mapError, setMapError] = useState<boolean>(false);

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
      onError={() => setMapError(true)}
    >
      <div className="h-[300px] rounded-lg overflow-hidden"> 
        <Map
          zoom={14}
          center={{ lat: latitude, lng: longitude }}
          gestureHandling="cooperative"
          mapId="fishery-map"
        >
          <Marker position={{ lat: latitude, lng: longitude }} title={name} /> 
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;