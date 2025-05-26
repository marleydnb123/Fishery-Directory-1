import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PoundSterling } from 'lucide-react';
import { Accommodation } from '../../types/schema';
import { supabase } from '../lib/supabase';

interface AccommodationCardProps {
  accommodation: Accommodation;
  fishery: any; // Replace 'any' with your Fishery type interface
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, fishery }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white rounded-xl shadow-md overflow-hidden h-full"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={fishery?.image || '/placeholder-image.jpg'}
          alt={`${accommodation.type} at ${fishery?.name || 'Unknown Fishery'}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{accommodation.type}</h3>
          <div className="flex items-center text-primary-600 font-bold">
            <PoundSterling className="h-4 w-4 mr-1" />
            <span>{accommodation.price}</span>
            <span className="text-gray-500 text-sm font-normal">/night</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <Home className="h-4 w-4 mr-1 text-primary-600" />
          <span className="text-sm">{fishery?.name || 'Unknown'}, {fishery?.district || 'Unknown'}</span>
        </div>
        
        {accommodation.notes && (
          <p className="text-gray-600 mb-4">{accommodation.notes}</p>
        )}
        
        {fishery?.species?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {fishery.species.map((species: string, index: number) => (
              <span 
                key={index}
                className="text-xs bg-primary-100 text-primary-900 px-2 py-1 rounded-full"
              >
                {species}
              </span>
            ))}
          </div>
        )}
        
        <button className="mt-4 w-full bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const AccommodationList: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [fisheries, setFisheries] = useState<any[]>([]); // Replace 'any' with your Fishery type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          { data: accommodationData, error: accommodationError },
          { data: fisheriesData, error: fisheriesError }
        ] = await Promise.all([
          supabase.from('accommodation').select('*'),
          supabase.from('fisheries').select('*')
        ]);

        if (accommodationError) throw accommodationError;
        if (fisheriesError) throw fisheriesError;

        setAccommodations(accommodationData || []);
        setFisheries(fisheriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading accommodations...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {accommodations.map(accommodation => {
        const fishery = fisheries.find(f => f.id === accommodation.fishery_id);
        return fishery ? (
          <AccommodationCard 
            key={accommodation.id}
            accommodation={accommodation}
            fishery={fishery}
          />
        ) : null;
      })}
    </div>
  );
};

export default AccommodationList;
