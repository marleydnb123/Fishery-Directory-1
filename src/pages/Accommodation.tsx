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
      {/* Animated Borders */}
      <span className="pointer-events-none absolute left-[5px] right-[5px] top-[5px] h-0.5 w-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:w-[calc(100%-10px)] z-20" /> 
      <span className="pointer-events-none absolute left-[5px] top-[5px] bottom-[5px] w-0.5 h-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:h-[calc(100%-10px)] z-20" />
      <span className="pointer-events-none absolute left-[5px] right-[5px] bottom-[5px] h-0.5 w-0 bg-blue-400 opacity-90 transition-all duration-500 group-hover:w-[calc(100%-10px)] z-20" />
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
  const [accommodations, setAccommodations] = useState<any[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<UKDistrict | ''>('');
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | ''>('');
  const [loading, setLoading] = useState(true);

  // Fetch accommodation from Supabase
  useEffect(() => {
    const fetchAccommodations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('accommodation')
        .select(`
          id,
          type,
          price,
          notes,
          created_at,
          fishery:fishery_id (
            id,
            name,
            district,
            species
          )
        `);
      if (error) {
        setAccommodations([]);
      } else if (data) {
        setAccommodations(data);
      }
      setLoading(false);
    };
    fetchAccommodations();
  }, []);

  // Get unique districts and species for filters
  const districts: UKDistrict[] = Array.from(
    new Set(accommodations.map(acc => acc.fishery?.district).filter(Boolean))
  ) as UKDistrict[];
  const species: FishSpecies[] = Array.from(
    new Set(
      accommodations
        .flatMap(acc => Array.isArray(acc.fishery?.species) ? acc.fishery.species : (acc.fishery?.species ? acc.fishery.species.split(',') : []))
        .filter(Boolean)
    )
  ) as FishSpecies[];

  // Apply filters
  useEffect(() => {
    let results = [...accommodations];
    if (selectedDistrict) {
      results = results.filter(acc => acc.fishery?.district === selectedDistrict);
    }
    if (selectedSpecies) {
      results = results.filter(acc =>
        Array.isArray(acc.fishery?.species)
          ? acc.fishery.species.includes(selectedSpecies)
          : acc.fishery?.species?.split(',').includes(selectedSpecies)
      );
    }
    setFilteredAccommodations(results);
  }, [accommodations, selectedDistrict, selectedSpecies]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
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
                onChange={e => setSelectedDistrict(e.target.value as UKDistrict | '')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Districts</option>
                {districts.map(district => (
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
                onChange={e => setSelectedSpecies(e.target.value as FishSpecies | '')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All Species</option>
                {species.map(specie => (
                  <option key={specie} value={specie}>{specie}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredAccommodations.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredAccommodations.map(accommodation => (
              <motion.div key={accommodation.id} variants={itemVariants}>
                <AccommodationCard accommodation={accommodation} />
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
