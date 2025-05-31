import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Fish, Info, Book, Phone, Waves, ChevronDown, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactPlayer from 'react-player';
import GoogleMap from '../components/common/GoogleMap'; 

// Define your types if you don't already have them
type Fishery = {
  id: string; 
  name: string;
  slug: string;
  visit_count?: number;
  description: string;
  rules: string | null;
  image: string | null;
  species: string[];
  district: string;
  isfeatured: boolean;
  hasaccommodation: boolean;
  website?: string 
  contact_phone?: string; 
  contact_email?: string;
  address?: string;
  postcode?: string;
  day_ticket_price?: string;
  features: string[];
  descriptionpage: string;
  fisheryimages1: string | null;
  fisheryimages2: string | null; 
  fisheryimages3: string | null; 
  fisheryvideo: string | null;
  facilities: string | null;
  tactics: string,
  Latitude: number | null;
  Longitude: number | null;
  pricing: string[];
  opening_times: string[];
  day_tickets: string[];
  payments: string[];
  // Add these new fields
  fishing_type: string[];
  record_biggest_fish?: string | null;
  record_match_weight?: string | null;
  stock?: string | null;
  average_weight?: string | null;
};

type Lake = {
  id: string;
  name: string;
  description: string;
  species: string[];
  fishery_id: string;
};

type Accommodation = {
  id: string;
  type: string;
  notes: string;
  price: number;
  fishery_id: string;
};

type FisheryVisit = {
  id: number;
  fishery_id: string;
  visit_count: number;
  last_visited: string;
}

// Define available stats
type StatOption = {
  key: string;
  label: string;
  value: (fishery: Fishery) => string;
  condition?: (fishery: Fishery) => boolean;
};

const FisheryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fishery, setFishery] = useState<Fishery | null>(null);
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [accommodation, setAccommodation] = useState<Accommodation[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'lakes' | 'accommodation' | 'rules'>('overview');
  const [loading, setLoading] = useState(true);
  const [visitUpdated, setVisitUpdated] = useState(false);
  
  // New state for stat selection
  const [selectedStat, setSelectedStat] = useState<string>('auto');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to update visit count
  const updateVisitCount = async (fisheryId: string) => {
    if (!visitUpdated) {
      try {
        await supabase.rpc('increment_fishery_visits', { 
          fishery_id_param: fisheryId 
        });
        setVisitUpdated(true);
      } catch (error) {
        console.error('Error updating visit count:', error);
      }
    }
  };

  // --- Featured Fisheries State & Fetch ---
  const [featuredFisheries, setFeaturedFisheries] = useState<Fishery[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      setFeaturedLoading(true);
      setFeaturedError(null);
      const { data, error } = await supabase
        .from('fisheries')
        .select('*')
        .eq('isfeatured', true)
        .limit(4);
      if (error) {
        setFeaturedError('Failed to load featured fisheries.');
        setFeaturedFisheries([]);
      } else {
        setFeaturedFisheries(
          (data || []).map((f: any) => ({
            ...f,
            species: Array.isArray(f.species) ? f.species : [],
            features: Array.isArray(f.features) ? f.features : [],
          }))
        );
      }
      setFeaturedLoading(false);
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch fishery by slug
      const { data: fisheryData, error: fisheryError } = await supabase
        .from('fisheries')
        .select('*, fishery_visits(visit_count)')
        .eq('slug', slug)
        .single();

      if (fisheryError || !fisheryData) {
        setFishery(null);
        setLakes([]);
        setAccommodation([]);
        setLoading(false);
        return;
      }

      setFishery({
        ...fisheryData,
        visit_count: fisheryData.fishery_visits?.visit_count || 0,
        species: Array.isArray(fisheryData.species) ? fisheryData.species : [],
        features: Array.isArray(fisheryData.features) ? fisheryData.features : [],
        fishing_type: Array.isArray(fisheryData.fishing_type) ? fisheryData.fishing_type : [],
        pricing: Array.isArray(fisheryData.pricing) ? fisheryData.pricing : [], 
        opening_times: Array.isArray(fisheryData.opening_times) ? fisheryData.opening_times : [],
        day_tickets: Array.isArray(fisheryData.day_tickets) ? fisheryData.day_tickets : [],
        payments: Array.isArray(fisheryData.payments) ? fisheryData.payments : [],
      }); 

      // Fetch lakes for this fishery
      const { data: lakesData } = await supabase
        .from('lakes')
        .select('*')
        .eq('fishery_id', fisheryData.id);

      setLakes(lakesData || []);

      // Fetch accommodation for this fishery if available
      if (fisheryData.hasaccommodation) {
        const { data: accommodationData } = await supabase
          .from('accommodation')
          .select('*')
          .eq('fishery_id', fisheryData.id);
 
        setAccommodation(accommodationData || []);
      } else {
        setAccommodation([]);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug]);
   
  // Update visit count when fishery data is loaded
  useEffect(() => {
    if (fishery?.id && !visitUpdated) {
      updateVisitCount(fishery.id);
    }
  }, [fishery, visitUpdated]);

  // Define available stat options
  const getStatOptions = (fishery: Fishery): StatOption[] => {
    if (!fishery) return [];

    return [
      {
        key: 'auto',
        label: 'Auto (Smart)',
        value: () => getAutoStatValue(fishery).value,
      },
      {
        key: 'match_weight',
        label: 'Match Weight',
        value: (f) => f.record_match_weight || '—',
        condition: (f) => f.fishing_type.includes('Match'),
      },
      {
        key: 'stock',
        label: 'Stock Info',
        value: (f) => f.stock || '—',
        condition: (f) => f.fishing_type.includes('Specimen'),
      },
      {
        key: 'average_weight',
        label: 'Average Weight',
        value: (f) => f.average_weight || '—',
        condition: (f) => f.fishing_type.includes('Coarse'),
      },
    ].filter(option => !option.condition || option.condition(fishery));
  };

  // Auto stat logic (your existing logic)
  const getAutoStatValue = (fishery: Fishery) => {
    if (!fishery || !fishery.fishing_type || fishery.fishing_type.length === 0) {
      return { value: '—', label: 'N/A' };
    }

    const hasMatch = fishery.fishing_type.includes('Match');
    const hasSpecimen = fishery.fishing_type.includes('Specimen');
    const hasCoarse = fishery.fishing_type.includes('Coarse');

    let value: string | null = null;
    let label = '';

    if (hasMatch) {
      value = fishery.record_match_weight ?? null;
      label = 'Record Match Weight';
      if (hasSpecimen || hasCoarse) {
        label += ' (Primary)';
      }
    } else if (hasSpecimen) {
      value = fishery.stock ?? null;
      label = 'Stock';
      if (hasCoarse) {
        label += ' (Primary)';
      }
    } else if (hasCoarse) {
      value = fishery.average_weight ?? null;
      label = 'Average Weight';
    } else {
      value = null;
      label = 'N/A';
    }

    return {
      value: value || '—',
      label,
      hasMultipleTypes: (hasMatch && (hasSpecimen || hasCoarse)) || (hasSpecimen && hasCoarse)
    };
  };

  const [expandedImage, setExpandedImage] = useState(null);

  // Get current stat display
  const getCurrentStatDisplay = () => {
    if (!fishery) return { value: '—', label: 'N/A' };

    const statOptions = getStatOptions(fishery);
    const currentOption = statOptions.find(opt => opt.key === selectedStat);
    
    if (!currentOption) return { value: '—', label: 'N/A' };

    if (selectedStat === 'auto') {
      return getAutoStatValue(fishery);
    }

    return {
      value: currentOption.value(fishery),
      label: currentOption.label,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!fishery) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-gray-600">Fishery not found.</div>
      </div>
    );
  }

  const statOptions = getStatOptions(fishery);
  const currentStat = getCurrentStatDisplay();

  return (
    <div className="min-h-screen pb-16 bg-gray-50">
      {/* Hero Image */}
      <div  
        className="h-80 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${fishery.image || 'https://www.welhamlake.co.uk/wp-content/uploads/2016/12/yorkshire-carp-fishing.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="container mx-auto h-full flex items-end">
          <div className="text-white p-6 md:p-8 relative z-10">
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bebas font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {fishery.name} 
            </motion.h1>
            <motion.div 
              className="flex items-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MapPin className="h-5 w-5 mr-1 text-primary-400" />
              <span>{fishery.district}</span>
            </motion.div>
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {(fishery.species || []).map((species, index) => (
                <span 
                  key={index}
                  className="flex items-center text-sm bg-primary-600 bg-opacity-80 px-3 py-1 rounded-full transition-transform duration-200 hover:scale-[1.04]"
                >
                  <Fish className="h-4 w-4 mr-1" />
                  {species}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto">
          <nav className="flex justify-center overflow-x-auto">
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'lakes'
                  ? 'border-primary-600 text-primary-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('lakes')}
            >
              Lakes
            </button>
            {fishery.hasaccommodation && (
              <button
                className={`px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === 'accommodation'
                    ? 'border-primary-600 text-primary-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('accommodation')}
              >
                Accommodation
              </button>
            )}
            <button
              className={`px-4 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'rules'
                  ? 'border-primary-600 text-primary-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('rules')}
            >
              Rules
            </button>
          </nav>
        </div>
      </div>

     {/* Content */} 
<div className="container mx-auto px-4 py-8"> 
  {activeTab === 'overview' && (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md p-6 mb-8">
        
        <h2
          className="w-[calc(100%+3rem)] -ml-6 -mr-6 -mt-6 text-3xl font-bebas font-bold rounded-t-lg mb-4 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white px-6 py-4"
          style={{
            background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
          }}
        >
          About {fishery.name} 
        </h2>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Content - Takes up 2 columns */}
          <div className="lg:col-span-2">
            {fishery.descriptionpage.split(/\r?\n/).map((line, i) => ( 
              <p key={i} className="text-gray-700 mb-6 max-w-4xl">{line}</p>
            ))} 
              
            <div className="flex flex-col gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">Facilities</h3> 
                  {fishery.facilities && fishery.facilities.length > 0 ? (
                    <ul className="space-y-2 text-gray-700">
                      {fishery.facilities.map((facility, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary-600 mr-2"></div>
                          <span>{facility}</span>
                        </li>
                      ))}
                      {fishery.hasAccommodation && (
                        <li className="flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary-600 mr-2"></div>
                          <span>Accommodation available</span>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No facilities information available</p>
                  )}
              </div>
                    
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-3">Available Species</h3>
                <div className="flex flex-wrap gap-2">
                  {(fishery.species || []).map((species, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center text-sm bg-primary-100 text-primary-900 px-3 py-1 rounded-full transition-transform duration-200 hover:scale-[1.04]"
                    >
                      <Fish className="h-4 w-4 mr-1" />
                      {species}
                    </span> 
                  ))}
                </div>  
              </div> 
            </div> 

            {/* --- Water Features Section --- */}
            {fishery.features && fishery.features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  Water Features 
                </h3>
                <div className="flex flex-wrap gap-2">
                  {fishery.features.map((feature, idx) => ( 
                    <span
                      key={idx}
                      className="inline-flex items-center text-sm bg-blue-100 text-blue-900 px-3 py-1 rounded-full transition-transform duration-200 hover:scale-[1.04]"
                    >
                      <Waves className="h-4 w-4 mr-1" />
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* --- End Water Features Section --- */}
          </div>

            {/* Right Column - Stats Card */}
          <div className="lg:col-span-1 flex justify-center lg:justify-end">
            <div className="w-full max-w-xs bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-2xl shadow-lg border border-slate-200/50 p-6">
              {/* Title */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-1">Quick Stats</h3>
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary-400 to-blue-400 mx-auto rounded-full"></div>
              </div>

              <div className="space-y-5">
                {/* Visitors */}
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100"> 
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-4 w-4 text-emerald-600 mr-2" />
                    <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Monthly Visitors</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-800">{fishery.visit_count}</span>
                </div>
                
                {/* Record Fish */}
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
                  <div className="flex items-center justify-center mb-1">
                    <Trophy className="h-4 w-4 text-orange-600 mr-2" />
                    <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">Record Fish</span>
                  </div>
                  <span className="text-2xl font-bold text-orange-800">{fishery.record_biggest_fish ?? '—'}</span>
                </div> 

                {/* Fish Species Count */}
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100">
                  <div className="flex items-center justify-center mb-1">
                    <Fish className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-xs font-medium text-purple-700 uppercase tracking-wide">Species Available</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-800">{fishery.species?.length || 0}</span>
                </div>

                {/* Water Features Count */}
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-100">
                  <div className="flex items-center justify-center mb-1">
                    <Waves className="h-4 w-4 text-cyan-600 mr-2" />
                    <span className="text-xs font-medium text-cyan-700 uppercase tracking-wide">Water Features</span>
                  </div>
                  <span className="text-2xl font-bold text-cyan-800">{fishery.features?.length || 0}</span>
                </div>

                {/* Facilities Count */}
                <div className="text-center p-3 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100">
                  <div className="flex items-center justify-center mb-1">
                    <MapPin className="h-4 w-4 text-rose-600 mr-2" />
                    <span className="text-xs font-medium text-rose-700 uppercase tracking-wide">Facilities</span>
                  </div>
                  <span className="text-2xl font-bold text-rose-800">{fishery.facilities?.length || 0}</span>
                </div>
                
                {/* Dropdown Toggle */}
                <div className="relative mt-1">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-sm text-grey-600 hover:text-primary-600 transition-colors duration-200 px-2 py-1 rounded-md hover:bg-white/50"
                  >
                    <span className="text-center">{currentStat.label}</span>
                    <ChevronDown 
                      className={`h-4 w-4 ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48 z-10"
                    >
                      {statOptions.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => {
                            setSelectedStat(option.key);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors duration-150 ${
                            selectedStat === option.key 
                              ? 'bg-primary-100 text-primary-900 font-medium' 
                              : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                          {option.key === 'auto' && (
                            <span className="text-xs text-gray-500 block">
                              Automatically selects best stat
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
                
                {/* Click outside to close dropdown */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-5" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}
                
                {/* Show multiple types indicator for auto mode */}
                {selectedStat === 'auto' && getAutoStatValue(fishery).hasMultipleTypes && (
                  <span className="text-xs text-blue-500 mt-1 text-center">
                    Multiple types: {fishery.fishing_type.join(', ')}
                  </span>
                )}
              </div> 
            </div>
          </div>
        </div>
   


            </div>
{/* --- Images Section (Animated, Scalable on Hover, Expandable) --- */}
<style>
{`
.img-hover-zoom {
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  position: relative;
  background: #f3f4f6;
  cursor: pointer;
}
.img-hover-zoom img {
  width: 100%;
  height: 18rem;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(.4,0,.2,1), filter 0.3s cubic-bezier(.4,0,.2,1), opacity 0.5s;
  will-change: transform, filter, opacity;
  opacity: 0;
  animation: fadeInImg 0.7s forwards;
}
.img-hover-zoom:hover img {
  transform: scale(1.02);
  filter: brightness(1.07) saturate(1.05);
}
@keyframes fadeInImg {
  to { opacity: 1; }
}
.img-hover-zoom::after {
  content: "";
  position: absolute;
  inset: 0;
  transition: background 0.3s;
  pointer-events: none;
} 
.img-hover-zoom:hover::after {
  background: rgba(0,0,0,0.03);
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeInModal 0.3s forwards;
}
@keyframes fadeInModal {
  to { opacity: 1; }
}
.modal-content {
  max-width: 60vw;
  max-height: 60vh;
  position: relative;
  transform: scale(0.8);
  animation: scaleInModal 0.3s forwards;
}
@keyframes scaleInModal {
  to { transform: scale(1); }
}
.modal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
}
.close-button {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.close-button:hover {
  background: rgba(255, 255, 255, 1);
}
`}
</style>
<div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md p-0 mb-16 overflow-hidden">
  {/* Gradient Header Bar */}
  <div
    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl mb-0"
    style={{
      background:
        "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
    }}
  >
    <h3 className="text-3xl font-bebas font-bold text-white mb-0">Images</h3>
  </div>
  {/* Images Content */}
  <div className="p-6">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="img-hover-zoom flex-1" onClick={() => setExpandedImage(fishery.fisheryimages1 || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80")}>
        <img
          src={fishery.fisheryimages1 || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
          alt="Fishery image 1"
        />
      </div>
      <div className="img-hover-zoom flex-1" onClick={() => setExpandedImage(fishery.fisheryimages2 || "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80")}>
        <img
          src={fishery.fisheryimages2 || "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"}
          alt="Fishery image 2"
        />
      </div>
      <div className="img-hover-zoom flex-1" onClick={() => setExpandedImage(fishery.fisheryimages3 || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80")}>
        <img
          src={fishery.fisheryimages3 || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80"}
          alt="Fishery image 3"
        />
      </div>
    </div>
  </div>
</div>

{/* Modal for expanded image */}
{expandedImage && (
  <div className="modal-overlay" onClick={() => setExpandedImage(null)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-button" onClick={() => setExpandedImage(null)}>
        ×
      </button>
      <img
        src={expandedImage}
        alt="Expanded view"
        className="modal-image"
      />
    </div>
  </div>
)}
{/* --- End Images Section --- */}
             

                      {/* --- Video Section (supports YouTube, Vimeo, MP4, etc.) --- */}
<div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md p-0 mb-16 overflow-hidden">
  {/* Gradient Header Bar */}
  <div
    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl mb-0"
    style={{
      background:
        "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
    }}
  >
    <h3 className="text-3xl font-bebas font-bold text-white mb-0">Fishery Video</h3>
  </div>
  {/* Video Content */}
  <div className="p-6">
    <div
      className="rounded-lg overflow-hidden shadow-inner bg-gray-100 flex justify-center items-center"
      style={{ minHeight: "28rem" }}
    >
      <ReactPlayer
        url={fishery.fisheryvideo || "https://www.youtube.com/watch?v=ysz5S6PUM-U"}
        controls
        width="100%"
        height="28rem"
        style={{ background: "#000", borderRadius: "0.75rem" }}
        config={{
          youtube: { 
            playerVars: { showinfo: 1 }
          }
        }}
      />
    </div>
  </div>
</div>
{/* --- End Video Section --- */}


{/* --- Tactics & Methods Section --- */}
<div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md p-0 mb-16 overflow-hidden">
  {/* Gradient Header Bar */}
  <div
    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl mb-0"
    style={{
      background:
        "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
    }}
  >
    <svg
      className="h-7 w-7 text-white mr-3 animate-bounce"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7c0-1.657-2.686-3-6-3S4 5.343 4 7m12 0v10a4 4 0 01-8 0V7m12 0c0-1.657-2.686-3-6-3S4 5.343 4 7m12 0v10a4 4 0 01-8 0V7"
      />
    </svg>
    <h3 className="text-3xl font-bebas font-bold text-white mb-0">Tactics, Methods & Bait Advice</h3>
  </div>
  {/* Tactics Content */}
  <div className="p-6">
    {fishery.tactics ? (
      <div className="mb-5 text-gray-700 space-y-4 leading-relaxed">
        {fishery.tactics.split('\n').map((tactic, index) => (
          tactic.trim() && (
            <div key={index} className="flex items-start">
              <span>{tactic.trim()}</span>
            </div>
          )
        ))}
      </div>
    ) : (
      <div className="text-gray-500 italic">No tactics available for this fishery yet.</div>
    )}
    <div className="text-primary-600 italic text-sm">
      
    </div>
  </div>
</div>






<div className="flex flex-col md:flex-row gap-6">
  {/* Booking Information Card */}
  <div className="flex-1 bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-0 flex flex-col">
    {/* Gradient Header Bar */}
    <div
      className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl"
      style={{
        background:
          "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
      }}
    >
      <Info className="h-7 w-7 text-white mr-3 animate-bounce" />
      <h3 className="text-3xl font-bebas font-bold tracking-wide text-white mb-0">
        Booking & Contact Information
      </h3>
    </div>
    {/* Card Content */}
    <div className="flex-1 flex flex-col justify-between p-6">
      <div>
        {/* Booking Info Section */}
        <h4 className="text-xl font-bold text-primary-700 mb-2 underline">Booking Information</h4>
        <ul className="mb-2 text-gray-700 space-y-2 leading-relaxed">
          <li>
            <span className="font-semibold text-primary-700">Day tickets:</span> <ul className="ml-4 list-disc">
              {(fishery.day_tickets && fishery.day_tickets.length > 0)
                ? fishery.day_tickets.map((day_tickets, idx) => (
                    <li key={idx}>{day_tickets}</li>
                  ))
                : <li>Not listed</li>
              }
            </ul>
          </li> 
          
          <li>
            <span className="font-semibold text-primary-700">Pricing:</span>
            <ul className="ml-4 list-disc">
              {(fishery.pricing && fishery.pricing.length > 0)
                ? fishery.pricing.map((price, idx) => (
                    <li key={idx}>{price}</li>
                  ))
                : <li>Not listed</li>
              }
            </ul>
          </li>
          <li>
            <span className="font-semibold text-primary-700">Opening times:</span>
            <ul className="ml-4 list-disc">
              {(fishery.opening_times && fishery.opening_times.length > 0)
                ? fishery.opening_times.map((time, idx) => (
                    <li key={idx}>{time}</li>
                  ))
                : <li>Not listed</li>
              }
            </ul>
          </li>
          <li>
            <span className="font-semibold text-primary-700 mb-2">Payment Types:</span> <ul className="ml-4 list-disc">
              {(fishery.payment && fishery.payment.length > 0)
                ? fishery.payment.map((payment, idx) => (
                    <li key={idx}>{payment}</li>
                  ))
                : <li>Not listed</li>
              }
            </ul>
          </li>
        </ul>
        {/* Contact Info Section */}
        <h4 className="text-xl font-bold text-primary-700 mb-2 underline">Contact Information</h4> 
        <ul className="mb-4 text-gray-700 space-y-2 leading-relaxed">
          <li>
            <span className="font-semibold text-primary-700">Phone:</span>
            <a
              href={`tel:${fishery.contact_phone || ''}`}
              className="ml-1 text-primary-600 underline hover:text-primary-800"
            >
              {fishery.contact_phone || "Not listed"}
            </a>
          </li>
          <li>
            <span className="font-semibold text-primary-700">Email:</span>
            {fishery.contact_email ? (
              <a
                href={`mailto:${fishery.contact_email}`}
                className="ml-1 text-primary-600 underline hover:text-primary-800"
              >
                {fishery.contact_email}
              </a>
            ) : (
              <span className="ml-1 text-gray-400">Not listed</span>
            )}
          </li>
          <li>
            <span className="font-semibold text-primary-700">Address:</span> {fishery.address || "Not listed"}
          </li>
        </ul>
        <div className=" mb-2 text-sm text-primary-500 italic">
          Fast replies & friendly staff. We do not handle bookings directly, contact the Fishery directly to book.
        </div> 
      </div>
    </div>
  </div>







              
              {/* Location Card */}
<div className="flex-1 bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-0">
  {/* Gradient Header Bar - EXACT SAME AS CONTACT BAR */}
  <div
    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl mb-0"
    style={{
      background:
        "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
    }}
  >
                  <MapPin className="h-7 w-7 text-white mr-3 animate-bounce" />
                  <h3 className="text-3xl font-bebas font-semibold text-white tracking-wide">Location</h3>
                </div>
                <div className="mb-5 mt-6 text-gray-700 leading-relaxed">
                  <div className="ml-6">
  <span className="font-semibold">{fishery.name}</span> is located in <span className="font-semibold">{fishery.district}</span>, UK.
</div>
                  <div className="mt-2 text-primary-700 flex flex-wrap gap-4 text-sm">
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 ml-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/></svg>
                      Parking available
                    </span>
                    <span className="inline-flex items-center">
                      
                    </span>
                  </div>
                  <div className="mt-6 mr-6 ml-6">
                    <GoogleMap  
                      latitude={fishery.Latitude || 0}
                      longitude={fishery.Longitude || 0}
                      name={fishery.name}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )} 




       {activeTab === 'lakes' && ( 
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    >
    <h2
      className="w-full text-2xl sm:text-3xl md:text-4xl font-bebas font-semibold mb-6 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white px-6 py-4         rounded-lg"
        style={{
        background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
        }}
        >
        Lakes at {fishery.name}
        </h2>

          {lakes.length > 0 ? (
      <div className="space-y-6">
        {lakes.map((lake) => (
          <div
            key={lake.id}
            className="bg-white rounded-xl shadow-md overflow-hidden" 
          >
            <div className="flex flex-col md:flex-row">
              {/* 
                Mobile: slightly wider image (w-80 or max-w-md), keeps mt-6 ml-6 mr-6.
                Desktop: md:w-56, same margins.
              */}
              <div className="w-80 max-w-md md:w-56 h-44 flex-shrink-0 bg-gray-100 mt-6 ml-6 mr-6 mb-6 rounded-xl overflow-hidden flex items-center justify-center">  
                <img
                  src={lake.image}
                  alt={lake.name}
                  className="w-full h-full object-cover rounded-xl"
                /> 
              </div>
              {/* Lake details */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                  {lake.name}
                </h3>
                <p className="text-gray-700 mb-4">{lake.description}</p>
                <div className="mb-2 font-medium">Available Species:</div>
                <div className="flex flex-wrap gap-2">
                  {(lake.species || []).map((species, index) => (
                    <span
                      key={index} 
                      className="inline-flex items-center text-sm bg-primary-100 text-primary-900 px-3 py-1 rounded-full"
                    >
                      <Fish className="h-4 w-4 mr-1" />
                      {species}
                    </span>
                  ))}
                </div>
              </div>
            </div> 
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-gray-700">No lake information available.</p>
      </div>
    )}
  </motion.div>
)}


 

 
        {activeTab === 'accommodation' && fishery.hasaccommodation && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }} 
    transition={{ duration: 0.3 }}
  >
    <h2
      className="w-full text-2xl sm:text-3xl md:text-4xl font-semibold font-bebas mb-6 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white px-6 py-4 rounded-lg"
      style={{
        background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
      }}
    >
      Accommodation at {fishery.name}
    </h2>
    
    {accommodation.length > 0 ? (
      <div className="space-y-6">
        {accommodation.map((acc) => (
          <div key={acc.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Responsive image: wider on mobile, fixed width on desktop, with all margins */}

              <div className="w-80 max-w-md md:w-56 h-44 flex-shrink-0 bg-gray-100 mt-6 ml-6 mr-6 mb-6 rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={acc.image}
                  alt={acc.type}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {/* Details on the right */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{acc.type}</h3>
                  <div className="text-primary-600 font-bold">
                    £{acc.price}
                    <span className="text-gray-500 text-sm font-normal">/night</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-4">{acc.notes}</p>
                <a
                  href={fishery.website}
target="_blank"
rel="noopener noreferrer"

                  className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-6 rounded-lg transition-colors self-start"
                >
                  <Book className="h-4 w-4 mr-2 inline" />
                  Book Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-gray-700">No accommodation information available.</p>
      </div>
    )}
  </motion.div>
)}



        {activeTab === 'rules' && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2
        className="w-[calc(100%+3rem)] -ml-6 -mr-6 -mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold font-bebas rounded-t-lg mb-4 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white px-6 py-4"
        style={{
          background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
        }}
      >
        Fishery Rules
      </h2>
      <p className="text-gray-700 mb-6">
        Please ensure you are familiar with and adhere to the following rules while fishing at {fishery.name}:
      </p>

      <div className="prose max-w-none text-gray-700">
        {(() => {
          const lines = fishery.rules.split(/\r?\n/);
          const elements = [];
          let listItems = [];
          let lastWasHeader = false;

          lines.forEach((line, i) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('-')) {
              listItems.push(trimmed.slice(1).trim());
              lastWasHeader = false;
            } else {
              // Flush any bullets before a new header/paragraph/blank
              if (listItems.length > 0) {
                elements.push(
                  <ul key={`ul-${i}`} className="list-disc ml-6">
                    {listItems.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                );
                listItems = [];
              }
              if (trimmed === '') {
                elements.push(<div key={i} style={{ height: '1.25em' }} />);
                lastWasHeader = false;
              } else {
                // Treat as header if previous line was blank or it's the first line
                const isHeader = i === 0 || (lines[i - 1] && lines[i - 1].trim() === '');
                elements.push(
                  <p
                    key={i}
                    className={isHeader ? 'font-semibold text-lg mt-4 mb-2' : ''}
                  >
                    {line}
                  </p>
                );
                lastWasHeader = isHeader;
              }
            }
          });

          // Flush any remaining bullets
          if (listItems.length > 0) {
            elements.push(
              <ul key={`ul-end`} className="list-disc ml-6">
                {listItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            );
          }

          return elements;
        })()}
      </div>
      
      <div className="mt-8 p-4 bg-primary-100 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-primary-900 mr-2 mt-0.5" />
          <p className="text-primary-900">
            Failure to comply with these rules may result in being asked to leave the fishery without refund.
          </p>
        </div>
      </div>
    </div>
  </motion.div>
)}

 
{/* --- Featured Fisheries Section --- */}
<section className="py-12 bg-gradient-to-b from-blue-50 via-white to-blue-50 ">
  <div className="container mx-auto shadow-lg rounded-xl overflow-hidden">
    {/* Header Bar */}
    <div
      className="p-6"
      style={{
        background:
          "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
      }}
    >
      <motion.h2
        className="text-4xl font-bebas font-bold text-white mb-1 text-center" 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        Featured Fisheries
      </motion.h2>
      <motion.p
        className="text-primary-200 text-center max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Explore our handpicked selection of the finest fishing spots across the UK
      </motion.p>
    </div>
    {/* Cards Grid */}
    <div className="p-6 bg-gray-50">
      {featuredLoading ? (
        <div className="text-center py-8 text-gray-600">Loading featured fisheries...</div>
      ) : featuredError ? (
        <div className="text-center py-8 text-red-600">{featuredError}</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredFisheries.length > 0 ? (
            featuredFisheries.map((f) => (
              <motion.div
                key={f.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link to={`/directory/${f.slug}`}>
                  <img
                    src={f.image || "https://www.welhamlake.co.uk/wp-content/uploads/2016/12/yorkshire-carp-fishing.jpg"} 
                    alt={f.name}
                    className="w-full h-40 object-cover transition-transform duration-200 hover:scale-[1.02]"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{f.name}</h3>
                    <div className="text-sm text-primary-700">{f.district}</div>
                    <div className="text-gray-600 text-xs mt-2 line-clamp-2">{f.description}</div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-4 text-center text-gray-500">
              No featured fisheries found.
            </div>
          )}
        </motion.div>
      )}
    </div>
  </div>
</section>
{/* --- End Featured Fisheries Section --- */}

          {/* --- End Tactics & Methods Section --- */}


{/* --- Reviews Section --- */}
<div className="bg-gradient-to-b from-blue-50 via-white to-blue-50 rounded-xl shadow-md p-0 mb-16 overflow-hidden">
  {/* Gradient Header Bar */}
  <div
    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl mb-0"
    style={{
      background:
        "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
    }}
  >
    <svg
      className="h-7 w-7 text-white mr-3 animate-bounce"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 17.75l-6.172 3.245 1.179-6.873-5-4.873 6.9-1.002L12 2.5l3.093 6.747 6.9 1.002-5 4.873 1.179 6.873z"
      />
    </svg>
    <h3 className="text-3xl font-bebas font-bold text-white mb-0">Reviews</h3>
  </div>
  {/* Reviews Content */}
  <div className="p-6">
    {/* Featured Review */}
    <div className="relative mb-8">
      <div className="bg-gradient-to-br from-primary-700 via-primary-200 to-white rounded-2xl shadow-xl p-8 border-4 border-primary-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-primary-300">
            JD
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary-900 text-xl">Jane D.</span>
              <span className="flex text-yellow-400 text-2xl">★★★★★</span>
            </div>
            <div className="text-xs text-primary-500">May 2025</div>
          </div>
        </div>
        <p className="text-primary-900 text-lg italic leading-relaxed">
          "Absolutely stunning fishery! Landed my PB carp and the atmosphere was so peaceful. Staff were super friendly and helpful. Can't wait to return!"
        </p>
      </div>
      <span className="absolute top-2 right-6 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Featured</span>
    </div>

    {/* Scrollable Review River */}
    <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
      {/* Review 2 */}
      <div className="min-w-[320px] bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-xl p-6 shadow flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold shadow">
            TS
          </div>
          <span className="font-semibold text-primary-800 text-lg">Tom S.</span>
          <span className="flex text-yellow-400 text-lg">★★★★☆</span>
        </div>
        <p className="text-gray-700 mb-2">
          "Beautiful location, well-stocked lakes. Only downside was a bit of mud on the pegs after rain."
        </p>
        <div className="text-xs text-gray-400">April 2025</div>
      </div>
      {/* Review 3 */}
      <div className="min-w-[320px] bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-xl p-6 shadow flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold shadow">
            SL
          </div>
          <span className="font-semibold text-primary-800 text-lg">Sophie L.</span>
          <span className="flex text-yellow-400 text-lg">★★★★★</span>
        </div>
        <p className="text-gray-700 mb-2">
          "Great for families and beginners. My kids caught their first fish here and loved every minute."
        </p>
        <div className="text-xs text-gray-400">March 2025</div>
      </div>
      {/* Review 4 */}
      <div className="min-w-[320px] bg-gradient-to-br from-primary-50 via-white to-primary-100 rounded-xl p-6 shadow flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-xl font-bold shadow">
            AG
          </div>
          <span className="font-semibold text-primary-800 text-lg">Alex G.</span>
          <span className="flex text-yellow-400 text-lg">★★★★★</span>
        </div>
        <p className="text-gray-700 mb-2">
          "Top-notch facilities and a great variety of fish. Highly recommend for a relaxing weekend."
        </p>
        <div className="text-xs text-gray-400">February 2025</div>
      </div>
      {/* Add more reviews as needed */}
    </div>
    <style>{`
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `}</style>
  </div>
</div>
{/* --- End Reviews Section --- */}

        
               {/* Contact Bar */}
        <div className="mt-8 rounded-xl shadow-lg p-0 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background:
                "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
            }}
          >
            <div className="mb-4 md:mb-0 flex items-center gap-4">
              <span className="text-2xl font-bold tracking-wide text-white">
                {fishery.name}
              </span>
              <span className="hidden md:inline-block text-primary-200 text-sm">
                {fishery.district}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {fishery.website && (
                <a 
                  href={fishery.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-primary-900 px-6 py-2 rounded-lg font-semibold shadow hover:bg-primary-100 hover:text-primary-700 transition"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71" />
                  </svg>
                  Visit Website
                </a>
              )}
              {/* Example: Add social icons if you want */}
              {/* 
              <a href="#" className="text-primary-200 hover:text-white transition">
                <TwitterIcon className="h-5 w-5" />
              </a>
              */} 
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};


export default FisheryDetail;