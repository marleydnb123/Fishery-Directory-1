import React from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  name: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ latitude, longitude, name }) => {
  if (!latitude || !longitude) {
    return (
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
        Location data not available
      </div>
    );
  }

  return (
    <APIProvider apiKey="AIzaSyAdwvQifhxwcMuNBdUDXtgj6e0IXzRVt4c">
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