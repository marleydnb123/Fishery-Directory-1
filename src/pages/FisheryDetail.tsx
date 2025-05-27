import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Fish, Info, Book, Phone, Waves } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactPlayer from 'react-player';

// Define your types if you don't already have them
type Fishery = {
  id: string; 
  name: string;
  slug: string;
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

const FisheryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [fishery, setFishery] = useState<Fishery | null>(null);
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [accommodation, setAccommodation] = useState<Accommodation[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'lakes' | 'accommodation' | 'rules'>('overview');
  const [loading, setLoading] = useState(true);

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
        .select('*')
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
        species: Array.isArray(fisheryData.species) ? fisheryData.species : [],
        features: Array.isArray(fisheryData.features) ? fisheryData.features : [],
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
                  className="flex items-center text-sm bg-primary-600 bg-opacity-80 px-3 py-1 rounded-full"
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
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2
          className="w-full text-3xl font-bebas font-bold mb-4 ml-0 mr-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 text-white px-6 py-4 rounded-lg"
          style={{
            background: "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
          }}
        >
          About {fishery.name} 
        </h2>
        <p className="text-gray-700 mb-6">{fishery.description}</p>
        <p className="text-gray-700 mb-6">{fishery.descriptionpage}</p> 
        
        <div className="flex flex-col md:flex-row gap-6">
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
                        className="inline-flex items-center text-sm bg-primary-100 text-primary-900 px-3 py-1 rounded-full"
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
            <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Waves className="h-5 w-5 text-blue-600 mr-2" />
            Water Features
            </h3>
            <div className="flex flex-wrap gap-2">
            {fishery.features.map((feature, idx) => ( 
            <span
            key={idx}
            className="inline-flex items-center text-sm bg-blue-100 text-blue-900 px-3 py-1 rounded-full"
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

           {/* --- Images Section (Animated, Scalable on Hover) --- */}
<style>
{`
.img-hover-zoom {
  overflow: hidden;
  border-radius: 0.75rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  position: relative;
  background: #f3f4f6;
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
`}
</style>

<div className="bg-white rounded-xl shadow-md p-0 mb-16 overflow-hidden">
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
      <div className="img-hover-zoom flex-1">
        <img
          src={fishery.fisheryimages1 || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
          alt="Fishery image 1"
        />
      </div>
      <div className="img-hover-zoom flex-1">
        <img
          src={fishery.fisheryimages2 || "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"}
          alt="Fishery image 2"
        />
      </div>
      <div className="img-hover-zoom flex-1">
        <img
          src={fishery.fisheryimages3 || "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80"}
          alt="Fishery image 3"
        />
      </div>
    </div>
  </div>
</div>
{/* --- End Images Section --- */}

             

                      {/* --- Video Section (supports YouTube, Vimeo, MP4, etc.) --- */}
<div className="bg-white rounded-xl shadow-md p-0 mb-16 overflow-hidden">
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








                    <div className="flex flex-col md:flex-row gap-6">
             {/* Booking Information Card */}
<div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-0">
  {/* Gradient Header Bar - EXACT SAME AS CONTACT BAR */}
  <div
    className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-700 p-6 flex items-center rounded-t-xl"
    style={{
      background:
        "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
    }}
  >
    <Info className="h-7 w-7 text-white mr-3 animate-bounce" />
    <h3 className="text-3xl font-bebas font-bold tracking-wide text-white mb-0">Booking Information</h3>
  </div>
  {/* Card Content */}
  <div className="p-6">
    <ul className="mb-5 text-gray-700 space-y-2 leading-relaxed">
      <li>
        <span className="font-semibold text-primary-700">Day tickets:</span> Available on request.
      </li>
      <li>
        <span className="font-semibold text-primary-700">Group bookings:</span> Please enquire for special rates.
      </li>
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
        <a
          href={`mailto:${fishery.contact_email || ''}`}
          className="ml-1 text-primary-600 underline hover:text-primary-800"
        >
          {fishery.contact_email || "Not listed"}
        </a>
      </li>
    </ul>
    <a
      href={`mailto:${fishery.contact_email || ''}`}
      className="inline-block bg-primary-600 hover:bg-primary-800 text-white py-2 px-6 rounded-lg font-semibold shadow transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
    >
      Contact for Booking
    </a>
    <div className="mt-4 text-xs text-primary-500 italic">
      Fast replies, friendly staff. We do not handle bookings directly.
    </div>
  </div>
</div>


              
              {/* Location Card */}
<div className="flex-1 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-0">
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
                  <div> 
                    <span className="font-semibold ml-6">{fishery.name}</span> is located in <span className="font-semibold">{fishery.district}</span>, UK.
                  </div>
                  <div className="mt-2 text-primary-700 flex flex-wrap gap-4 text-sm">
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 ml-6 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/></svg>
                      Parking available
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="h-4 w-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="10"/></svg>
                      Toilets on site
                    </span>
                  </div>
                  <div className="mt-2 text-gray-600  ml-6 text-sm">
                    Detailed directions will be provided upon booking.
                  </div>
                </div>
                <div className="h-40 bg-gray-200 ml-6 mr-6 rounded-lg flex items-center justify-center shadow-inner">
                  <span className="text-gray-500">Map location preview</span>
                </div>
                <div className="mt-4 text-xs ml-6 mb-6 text-primary-500 italic">
                  Please check your booking confirmation for the exact address.
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
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6">
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
              <div className="w-80 max-w-md md:w-56 h-44 flex-shrink-0 bg-gray-100 mt-6 ml-6 mr-6 rounded-xl overflow-hidden flex items-center justify-center">  
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
    <h2 className="text-2xl font-semibold mb-6">Accommodation at {fishery.name}</h2>
    
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
              <h2 className="text-2xl font-semibold mb-4">Fishery Rules</h2>
              <p className="text-gray-700 mb-6">
                Please ensure you are familiar with and adhere to the following rules while fishing at {fishery.name}:
              </p>
              
              <div className="prose max-w-none text-gray-700">
                <p>{fishery.rules}</p>
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
<section className="py-12 px-4 bg-gray-50">
  <div className="container mx-auto shadow-lg overflow-hidden">
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
                    className="w-full h-40 object-cover"
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
  