import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, name }) => {
  // Early return if coordinates are missing
  if (!latitude || !longitude) {
    return (
      <div className="h-[300px] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 gap-2">
        <MapPin className="w-8 h-8" />
        <p>Location data not available</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <div className="h-[300px] rounded-lg overflow-hidden">
        <Map
          zoom={14}
          center={{ lat: latitude, lng: longitude }}
          gestureHandling={'cooperative'}
          disableDefaultUI={false}
          mapId={'fishery-map'}
          options={{
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,
            gestureHandling: "cooperative",
            mapTypeId: "hybrid"
          }}
        >
          <Marker 
            position={{ lat: latitude, lng: longitude }}
            title={name}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;