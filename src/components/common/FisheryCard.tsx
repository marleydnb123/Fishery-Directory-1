import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Fish, Home, Waves } from 'lucide-react';
import { Fishery } from '../../types/schema';

interface FisheryCardProps {
  fishery: Fishery;
}

const FisheryCard: React.FC<FisheryCardProps> = ({ fishery }) => {
  const handleScrollTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white rounded-xl shadow-md overflow-hidden h-full"
    >
      <Link to={`/directory/${fishery.slug}`} className="block h-full" onClick={handleScrollTop}>
        <div className="h-48 overflow-hidden relative">
          <img
            src={fishery.image}
            alt={fishery.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {/* Featured bubble (top right) */}
          {fishery.isFeatured && (
            <div className="absolute top-4 right-4 bg-primary-600 text-white text-xs px-2 py-1 rounded-full shadow">
              Featured
            </div>
          )}
          {/* Accommodation bubble (top left) */}
          {fishery.hasAccommodation && (
            <div className="absolute top-4 left-4 bg-primary-200 text-primary-900 text-xs px-2 py-1 rounded-full shadow flex items-center gap-1">
              <Home className="h-3 w-3" />
              Accommodation
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between">
            <h3 className="text-4xl font-bebas font-semibold text-gray-900 mb-2">{fishery.name}</h3>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 text-primary-600" />
            <span className="text-sm">{fishery.district}</span>
          </div>
          
          {/* Fixed-height, 2-line clamped description */}
          <p className="text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">{fishery.description}</p>
          
          <div className="hidden md:flex flex-nowrap overflow-hidden gap-2 mt-2">
          {fishery.species.slice(0, 7).map((species, index) => (
          <span 
          key={index}
          className="flex items-center text-xs bg-primary-100 text-primary-900 px-2 py-1 rounded-full"
          >
          <Fish className="h-3 w-3 mr-1" />
          {species}
          </span>
            ))}
          </div>


          {/* Features badges (hidden on mobile, flex on md+) */}
            {fishery.features && fishery.features.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-2 mt-3">
            {fishery.features.map((feature: string, idx: number) => (
            <span
            key={idx}
            className="flex items-center text-xs bg-blue-100 text-blue-900 px-2 py-1 rounded-full"
            >
            <Waves className="h-3 w-3 mr-1" />
            {feature}
            </span>
            ))}
            </div>
            )}

            </div>
            </Link>
              </motion.div>
            );
          };

export default FisheryCard;
