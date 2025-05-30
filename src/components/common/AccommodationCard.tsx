import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, PoundSterling } from 'lucide-react';
import { Accommodation } from '../../types/schema';

// Backup images from Unsplash for different accommodation types
const backupImages = {
  'Cabin': 'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9',
  'Lodge': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
  'Pod': 'https://images.unsplash.com/photo-1510798831971-661eb04b3739',
  'Tent': 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4',
  'Caravan': 'https://images.unsplash.com/photo-1520101244246-293f77ffc39e',
  'default': 'https://images.unsplash.com/photo-1566073771259-6a8506099945'
};

const getBackupImage = (type: string) => {
  const key = Object.keys(backupImages).find(k => 
    type.toLowerCase().includes(k.toLowerCase())
  ) || 'default';
  return `${backupImages[key]}?auto=format&fit=crop&w=800&q=80`;
};

interface AccommodationCardProps {
  accommodation: Accommodation;
  fishery?: {
    name: string;
    district: string;
    slug: string;
    species: string[];
    image: string;
  };
  hideSpecies?: boolean;
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, fishery, hideSpecies = false }) => {
  if (!fishery) return null;

  const handleScrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
      style={{ minHeight: 480, maxHeight: 480 }}
    >
      <div className="h-48 overflow-hidden flex-shrink-0">
        <img 
          src={accommodation.image || getBackupImage(accommodation.type)}
          alt={`${accommodation.type} at ${fishery.name}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 truncate">{accommodation.type}</h3>
          <div className="flex items-center text-primary-600 font-bold">
            <PoundSterling className="h-4 w-4 mr-1" />
            <span>{accommodation.price}</span>
            <span className="text-gray-500 text-sm font-normal">/night</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <Home className="h-4 w-4 mr-1 text-primary-600" />
          <span className="text-sm truncate">{fishery.name}, {fishery.district}</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
          {accommodation.notes || <span className="opacity-50">No notes</span>}
        </p>
        {!hideSpecies && <div className="flex flex-wrap gap-2 mt-auto mb-4 min-h-[32px]">
          {fishery.species.map((species, index) => (
            <span
              key={index}
            >
              {species}
            </span>
          ))}
        </div>}
        <Link
          to={`/directory/${fishery.slug}`}
          onClick={handleScrollTop}
          className="block w-full bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors text-center"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default AccommodationCard;
