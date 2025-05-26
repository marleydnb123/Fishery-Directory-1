import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AccommodationCard from '../components/common/AccommodationCard';
import { Accommodation, UKDistrict, FishSpecies } from '../types/schema';
import { supabase } from '../lib/supabase';

// --- HoverBannerCard component ---
function HoverBannerCard({ image, title, subtitle, href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer" 
      className="group relative block w-full aspect-[4/5]  overflow-hidden shadow-lg"
      title={title}
    >
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden="true"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 z-10" />
      {/* Animated Borders (inset by 5px) */}
      {/* Top border */}
      <span className="pointer-events-none absolute left-[5px] right-[5px] top-[5px] h-0.5 w-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:w-[calc(100%-10px)] z-20" /> 
      {/* Left border */}
      <span className="pointer-events-none absolute left-[5px] top-[5px] bottom-[5px] w-0.5 h-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:h-[calc(100%-10px)] z-20" />
      {/* Bottom border */}
      <span className="pointer-events-none absolute left-[5px] right-[5px] bottom-[5px] h-0.5 w-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:w-[calc(100%-10px)] z-20" />
      {/* Right border */}
      <span className="pointer-events-none absolute right-[5px] top-[5px] bottom-[5px] w-0.5 h-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:h-[calc(100%-10px)] z-20" />
      {/* Card Content */}
      <div className="relative z-30 flex flex-col items-center justify-end h-full p-6 text-center">
        <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
        <h6 className="text-base text-white">{subtitle}</h6>
      </div>
    </a>
  );
}

// --- CardGrid component ---
const hoverCards = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    title: "Mountain Lake",
    subtitle: "Peaceful waters",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    title: "Forest Trail",
    subtitle: "Explore the woods",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80",
    title: "Desert Dunes",
    subtitle: "Sandy adventures",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3d41?auto=format&fit=crop&w=600&q=80",
    title: "City Nights",
    subtitle: "Urban exploration",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
    title: "Ocean View",
    subtitle: "Feel the breeze",
    href: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    title: "Countryside",
    subtitle: "Rolling hills",
    href: "#",
  },
];

function CardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto py-12">
      {hoverCards.map((card, idx) => (
        <HoverBannerCard key={idx} {...card} />
      ))}
    </div>
  );
}

// --- Main Page ---
const AccommodationPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [fisheries, setFisheries] = useState<{[key: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<UKDistrict | ''>('');
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | ''>('');
  
  // Available districts
  const districts: UKDistrict[] = [
    'Cumbria',
    'Dumfries & Galloway',
    'Yorkshire',
    'Hampshire',
    'Kent',
    'Essex',
    'Sussex',
    'Dorset',
    'Wiltshire',
    'Devon',
    'Cornwall',
    'Norfolk',
    'Suffolk',
    'Lancashire',
    'Cheshire',
    'Wales'
  ];
  
  // Available species
  const species: FishSpecies[] = [
    'Carp',
    'Pike',
    'Tench',
    'Bream',
    'Roach',
    'Perch',
    'Trout',
    'Catfish',
    'Eel',
    'Barbel'
  ];
  
  // Fetch accommodations and related fisheries
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all accommodations
        const { data: accommodationsData, error: accommodationsError } = await supabase
          .from('accommodation')
          .select('*');
          
        if (accommodationsError) throw accommodationsError;

        // Get unique fishery IDs
        const fisheryIds = [...new Set(accommodationsData.map(acc => acc.fishery_id))];
        
        // Fetch related fisheries
        const { data: fisheriesData, error: fisheriesError } = await supabase
          .from('fisheries')
          .select('id, name, district, species, image')
          .in('id', fisheryIds);
          
        if (fisheriesError) throw fisheriesError;
        
        // Create fisheries lookup object
        const fisheriesLookup = fisheriesData.reduce((acc, fishery) => {
          acc[fishery.id] = fishery;
          return acc;
        }, {});
        
        setAccommodations(accommodationsData);
        setFisheries(fisheriesLookup);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let results = [...accommodations];
    
    // Apply district filter
    if (selectedDistrict) {
      results = results.filter(acc => 
        fisheries[acc.fishery_id]?.district === selectedDistrict
      );
    }
    
    // Apply species filter
    if (selectedSpecies) {
      results = results.filter(acc =>
        fisheries[acc.fishery_id]?.species?.includes(selectedSpecies)
      );
    }
    
    setFilteredAccommodations(results);
  }, [accommodations, fisheries, selectedDistrict, selectedSpecies]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* --- Image Banner Start --- */}
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-56 md:h-[380px] lg:h-[500px] mb-12">
        <img
          src="https://www.carpsocial.com/wp-content/uploads/2022/05/Willow-Lake-Banner.jpg"
          alt="Fishing lake banner"
          className="object-cover w-full h-full shadow-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center rounded-b-2xl px-4 md:px-12 lg:px-24">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bebas font-bold text-white drop-shadow-lg mb-3 mt-16">
            Fishing Holidays
          </h2>
          <p className="text-white text-lg md:text-2xl mt-2 drop-shadow-md max-w-2xl">
            Find and book your perfect fishing holiday in the UK
          </p>
        </div>
      </div>
      {/* --- Image Banner End --- */}
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PoundSterling } from 'lucide-react';
import { Accommodation } from '../../types/schema';
import { supabase } from '../../lib/supabase';

// Card component with fixed layout and consistent row heights
interface AccommodationCardProps {
  accommodation: Accommodation;
  fishery?: {
    name: string;
    district: string;
    species: string[];
    image: string;
  };
}

const AccommodationCard: React.FC<AccommodationCardProps> = ({ accommodation, fishery }) => {
  if (!fishery) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
      style={{ minHeight: 480, maxHeight: 480 }} // Fixed height for uniform grid
    >
      <div className="h-48 overflow-hidden flex-shrink-0">
        <img
          src={fishery.image}
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
        <div className="flex flex-wrap gap-2 mt-auto mb-4 min-h-[32px]">
          {fishery.species.map((species, index) => (
            <span
              key={index}
              className="text-xs bg-primary-100 text-primary-900 px-2 py-1 rounded-full"
            >
              {species}
            </span>
          ))}
        </div>
        <button className="w-full bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

// Main list component fetching from Supabase and rendering a fixed grid
const AccommodationList: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [fisheries, setFisheries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [
        { data: accommodationData, error: accommodationError },
        { data: fisheriesData, error: fisheriesError }
      ] = await Promise.all([
        supabase.from('accommodation').select('*'),
        supabase.from('fisheries').select('*')
      ]);
      if (accommodationError) console.error(accommodationError);
      if (fisheriesError) console.error(fisheriesError);
      setAccommodations(accommodationData || []);
      setFisheries(fisheriesData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading accommodations...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {accommodations.map(accommodation => {
        const fishery = fisheries.find(f => f.id === accommodation.fishery_id);
        return (
          <AccommodationCard
            key={accommodation.id}
            accommodation={accommodation}
            fishery={fishery}
          />
        );
      })}
    </div>
  );
};

export default AccommodationList;

      {/* --- Unsplash Hover Card Grid --- */}
      <CardGrid />

      <div className="container mx-auto px-4 pb-16" style={{ marginTop: '3rem' }}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Explore Fisheries with Accommodation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect fishing holidays from our collection of premium fisheries across the UK.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* District Filter */}
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                District
              </label>
              <select
                id="district"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value as UKDistrict | '')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Districts</option>
                {districts.map((district) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            
            {/* Species Filter */}
            <div>
              <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
                Fish Species
              </label>
              <select
                id="species"
                value={selectedSpecies}
                onChange={(e) => setSelectedSpecies(e.target.value as FishSpecies | '')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Species</option>
                {species.map((specie) => (
                  <option key={specie} value={specie}>{specie}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {filteredAccommodations.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
            variants={containerVariants}
            initial="hidden" 
            animate="visible"
          >
            {filteredAccommodations.map((accommodation) => (
              <motion.div key={accommodation.id} variants={itemVariants}>
                <AccommodationCard 
                  accommodation={accommodation}
                  fishery={fisheries[accommodation.fishery_id]}
                />
              </motion.div>
            ))} 
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No accommodation found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        )}
      </div>
    </div> 
  ); 
}; 

export default AccommodationPage;