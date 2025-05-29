import React, { useRef, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, name }) => {
  const [mapError, setMapError] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState({ lat: latitude, lng: longitude });

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
      <div className="h-[400px] md:h-[515px] rounded-lg overflow-hidden">
        <Map
          center={mapCenter}
          zoom={14}
          mapId="fishery-map"
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onIdle={() => {
            if (mapRef.current) {
              const newCenter = mapRef.current.getCenter();
              if (newCenter) {
                setMapCenter({
                  lat: newCenter.lat(),
                  lng: newCenter.lng(),
                });
              }
            }
          }}
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
