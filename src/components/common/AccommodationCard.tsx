import React from 'react';
import { motion } from 'framer-motion';
import { Home, PoundSterling } from 'lucide-react';
import { Accommodation } from '../../types/schema';
import { mockFisheries } from '../../data/mockData';

interface AccommodationCardProps {
  accommodation: Accommodation;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation }) => {
  // Find the fishery this accommodation belongs to
  const fishery = mockFisheries.find(f => f.id === accommodation.fishery_id);
  
  if (!fishery) return null;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white rounded-xl shadow-md overflow-hidden h-full"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={fishery.image}
          alt={`${accommodation.type} at ${fishery.name}`}
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
          <span className="text-sm">{fishery.name}, {fishery.district}</span>
        </div>
        
        <p className="text-gray-600 mb-4">{accommodation.notes}</p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {fishery.species.map((species, index) => (
            <span 
              key={index}
              className="text-xs bg-primary-100 text-primary-900 px-2 py-1 rounded-full"
            >
              {species}
            </span>
          ))}
        </div>
        
        <button className="mt-4 w-full bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default AccommodationCard;