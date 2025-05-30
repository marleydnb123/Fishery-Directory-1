import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Fish, Info, Book, Phone, Waves } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ReactPlayer from 'react-player';
import GoogleMap from '../components/common/GoogleMap'; 

 

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
  tactics: string,
  Latitude: number | null;
  Longitude: number | null;
  pricing: string[];
  opening_times: string[];
  day_tickets: string[];
  payments: string[];
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
  const [error, setError] = useState<string | null>(null);
  const [visitUpdated, setVisitUpdated] = useState(false);
  const [loading_fotw, setLoadingFOTW] = useState(true);
  const [error_fotw, setErrorFOTW] = useState<string | null>(null);

  // Update visit count
  const updateVisitCount = async (fisheryId: string) => {
    if (!visitUpdated) {
      try {
        const { error } = await supabase.rpc('increment_fishery_visits', {
          fishery_id_param: fisheryId
        });
        if (error) throw error;
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
        {/* Stats Card */}
<div className="mb-8">
  <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200 rounded-2xl shadow flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-6">
    {/* Visitors */}
    <div className="flex-1 flex flex-col items-center">
      <span className="text-3xl font-bold text-grey-600">{fishery.visitors_monthly ?? '—'}</span>
      <span className="text-sm text-grey-600 mt-1">Visitors (Monthly)</span>
    </div>
    <div className="hidden sm:block h-12 w-px bg-blue-300 mx-4" />
    {/* Record Fish */}
    <div className="flex-1 flex flex-col items-center">
      <span className="text-3xl font-bold text-grey-600">{fishery.record_biggest_fish ?? '—'}</span>
      <span className="text-sm text-grey-600 mt-1">Record/Biggest Fish</span>
    </div> 
    <div className="hidden sm:block h-12 w-px bg-blue-300 mx-4" />
    {/* Match Record */}
    <div className="flex-1 flex flex-col items-center">
      <span className="text-3xl font-bold text-grey-600">{fishery.record_match_weight ?? '—'}</span>
      <span className="text-sm text-grey-600 mt-1">Record Match Weight</span>
    </div>
  </div>
</div>
        
        {fishery.descriptionpage.split(/\r?\n/).map((line, i) => ( 
          <p key={i} className="text-gray-700 mb-6">{line}</p>
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
            <div className="mt-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Waves className="h-5 w-5 text-blue-600 mr-2" />
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
    <h3 className="text-3xl font-bebas font-bold text-white mb-0">Tactics & Methods</h3>
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
                  