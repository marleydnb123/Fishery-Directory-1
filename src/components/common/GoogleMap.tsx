import React, { useRef, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, name }) => {
  const [mapError, setMapError] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return (
      <div className="h-[300px] bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-500 gap-2">
        <MapPin className="w-8 h-8" />
        <p>Location data not available</p>
      </div>
    );
  }

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
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_GOOGLE_MAPS_API_KEY"}
      onError={() => setMapError(true)}
    >
      <div className="min-h-[400px] h-auto rounded-lg overflow-hidden mb-6"> 
        <Map
          defaultCenter={{ lat: latitude, lng: longitude }}
          defaultZoom={14}
          mapId="fishery-map"
          onLoad={(map) => (mapRef.current = map)}
          options={{
            gestureHandling: "greedy",
            scrollwheel: true,
            draggable: true,
            zoomControl: true,
            mapTypeControl: true,
            scaleControl: true,
            streetViewControl: true,
            rotateControl: true,
            fullscreenControl: true,
            disableDefaultUI: false,
          }}
        >
          <Marker position={{ lat: latitude, lng: longitude }} title={name} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
