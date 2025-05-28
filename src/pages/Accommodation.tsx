import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AccommodationCard from '../components/common/AccommodationCard';
import { Accommodation, UKDistrict, FishSpecies } from '../types/schema';
import { supabase } from '../lib/supabase';

// --- HoverBannerCard component ---
function HoverBannerCard({ image, title, subtitle }) {
  return (
    <div
      className="group relative block w-full aspect-[4/3] overflow-hidden shadow-lg"
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
    </div>
  );
}

// --- CardGrid component ---
const hoverCards = [
  {
  image: "https://www.yorklakesidelodges.co.uk/wp-content/uploads/2018/06/holly-lodge-york-lakeside-lodges.jpg",
  title: "Lodges",
  subtitle: "Lakeside tranquillity",
},
{
  image: "https://lakeviewholidays.co.uk/wp-content/uploads/2019/05/Willow-800-x-600.jpg",
  title: "Holiday Homes",
  subtitle: "Woodland retreats",
},
{
  image: "https://tacklebox.co.uk/wp-content/uploads/2023/08/carp-fishing.webp",
  title: "Camping",
  subtitle: "Back to nature stays",
},
{
  image: "https://assets.parkholidays.com/assets/8a1e89800f1291cff561ee405e484b5b.jpg",
  title: "Caravan Parks",
  subtitle: "Cozy countryside escapes",
},
{
  image: "https://www.fisheries.co.uk/wp-content/uploads/2022/03/outpost1-600x563.jpg",
  title: "Cabins & Pods",
  subtitle: "Compact comfort by the lake",
},
{
  image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/e2/a6/e5/holme-lacy-house-hotel.jpg?w=1400&h=-1&s=1",
  title: "Hotels",
  subtitle: "Elegant rural breaks",
},
];

function CardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-7xl mx-auto py-12">
      {hoverCards.map((card, idx) => (
        <HoverBannerCard key={idx} {...card} />
      ))}
    </div>
  );
}

// --- Main Page ---
const AccommodationPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [fisheries, setFisheries] = useState<any[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<UKDistrict | ''>('');
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | ''>('');
  const [selectedType, setSelectedType] = useState<string>(''); // New for type filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
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
        setFilteredAccommodations(accommodationData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
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

  // Get unique accommodation types
  const types = Array.from(new Set(accommodations.map(acc => acc.type))).filter(Boolean);

  // Apply filters
  useEffect(() => {
    let results = [...accommodations];
    
    if (selectedDistrict) {
      const fisheryIds = fisheries
        .filter(fishery => fishery.district === selectedDistrict)
        .map(fishery => fishery.id);
      
      results = results.filter(acc => 
        fisheryIds.includes(acc.fishery_id)
      );
    }
    
    if (selectedSpecies) {
      const fisheryIds = fisheries
        .filter(fishery => fishery.species.includes(selectedSpecies))
        .map(fishery => fishery.id);
      
      results = results.filter(acc => 
        fisheryIds.includes(acc.fishery_id)
      );
    }

    if (selectedType) {
      results = results.filter(acc => acc.type === selectedType);
    }
    
    setFilteredAccommodations(results);
  }, [accommodations, fisheries, selectedDistrict, selectedSpecies, selectedType]);
  
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
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-blue-50 to-blue-100 pb-16">
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

      {/* --- Unsplash Hover Card Grid --- */}
      <CardGrid />

      <div className="container mx-auto px-4 pb-16" style={{ marginTop: '3rem' }}>
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-6xl font-bebas font-bold text-gray-900 mb-4">
            Explore Fisheries with Accommodation
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect fishing holidays from our collection of premium fisheries across the UK.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Type Filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Accommodation Type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading accommodations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : filteredAccommodations.length > 0 ? (
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
                  fishery={fisheries.find(f => f.id === accommodation.fishery_id)}
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
