import React from 'react';
import { MapPin } from 'lucide-react';
import GoogleMap from './GoogleMap';

interface LocationInfoProps {
  name: string;
  district: string;
  latitude: number | null;
  longitude: number | null;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  name,
  district,
  latitude,
  longitude
}) => {
  return (
    <div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-0">
      <div
        className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl mb-0"
        style={{
          background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
        }}
      >
        <MapPin className="h-7 w-7 text-white mr-3 animate-bounce" />
        <h3 className="text-3xl font-bebas font-semibold text-white tracking-wide">
          Location
        </h3>
      </div>

      <div className="mb-5 mt-6 text-gray-700 leading-relaxed">
        <div className="ml-6">
          <span className="font-semibold">{name}</span> is located in{' '}
          <span className="font-semibold">{district}</span>, UK.
        </div>

        <div className="mt-2 text-primary-700 flex flex-wrap gap-4 text-sm">
          <span className="inline-flex items-center">
            <span className="w-4 h-4 mr-2 ml-6 rounded-full bg-green-500" />
            Parking available
          </span>
        </div>

        <div className="mt-2 text-gray-600 ml-6 text-sm">
          Detailed directions will be provided upon booking.
        </div>

        <div className="mt-6">
          <GoogleMap
            latitude={latitude || 0}
            longitude={longitude || 0}
            name={name}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;