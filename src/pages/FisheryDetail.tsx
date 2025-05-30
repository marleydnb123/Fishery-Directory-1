import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { MapPin, Phone, Mail, Globe, Fish, Calendar, Clock, CreditCard } from 'lucide-react';

// ===================================
// Types
// ===================================
type Fishery = Database['public']['Tables']['fisheries']['Row'];
type Lake = Database['public']['Tables']['lakes']['Row'];
type Accommodation = Database['public']['Tables']['accommodation']['Row'];

// ===================================
// Component
// ===================================
export default function FisheryDetail() {
  // State Management
  const [fishery, setFishery] = useState<Fishery | null>(null);
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [accommodation, setAccommodation] = useState<Accommodation[]>([]);
  const [visitCount, setVisitCount] = useState<number>(0);
  const [visitUpdated, setVisitUpdated] = useState(false);
  const { slug } = useParams<{ slug: string }>();

  // ===================================
  // Data Fetching
  // ===================================
  useEffect(() => {
    const fetchFisheryData = async () => {
      if (!slug) return;

      try {
        // Fetch fishery details
        const { data: fisheryData } = await supabase
          .from('fisheries')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fisheryData) {
          setFishery(fisheryData);
          // Fetch associated lakes
          const { data: lakesData } = await supabase
            .from('lakes')
            .select('*')
            .eq('fishery_id', fisheryData.id);

          setLakes(lakesData || []);

          // Fetch associated accommodation
          const { data: accommodationData } = await supabase
            .from('accommodation')
            .select('*')
            .eq('fishery_id', fisheryData.id);

          setAccommodation(accommodationData || []);

          // Fetch visit count
          const { data: visitData } = await supabase
            .from('fishery_visits')
            .select('visit_count')
            .eq('fishery_id', fisheryData.id)
            .maybeSingle();

          if (visitData) {
            setVisitCount(visitData.visit_count);
          }
        }
      } catch (error) {
        console.error('Error fetching fishery data:', error);
      }
    };

    fetchFisheryData();
  }, [slug]);

  // ===================================
  // Visit Count Update
  // ===================================
  const updateVisitCount = async (fisheryId: string) => {
    if (!visitUpdated) {
      try {
        await supabase.rpc('increment_fishery_visits', { 
          fishery_id_param: fisheryId 
        });

        const { data: visitData } = await supabase
          .from('fishery_visits')
          .select('visit_count')
          .eq('fishery_id', fisheryId)
          .maybeSingle();

        if (visitData) {
          setVisitCount(visitData.visit_count);
        }
        
        setVisitUpdated(true);
      } catch (error) {
        console.error('Error updating visit count:', error);
      }
    }
  };

  // Update visit count on component mount
  useEffect(() => {
    if (fishery?.id) {
      updateVisitCount(fishery.id);
    }
  }, [fishery?.id]);

  if (!fishery) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // ===================================
  // Render Component
  // ===================================
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96">
        <img
          src={fishery.image || 'https://images.pexels.com/photos/1482193/pexels-photo-1482193.jpeg'}
          alt={fishery.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-white font-bold text-center">
            {fishery.name}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Visit Count */}
        <div className="text-sm text-gray-600 mb-4">
          Views: {visitCount}
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">About the Fishery</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{fishery.description}</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fishery.address && (
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                <span>{fishery.address}</span>
              </div>
            )}
            {fishery.contact_phone && (
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-blue-600 mr-2" />
                <span>{fishery.contact_phone}</span>
              </div>
            )}
            {fishery.contact_email && (
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-blue-600 mr-2" />
                <span>{fishery.contact_email}</span>
              </div>
            )}
            {fishery.website && (
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-blue-600 mr-2" />
                <a href={fishery.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Key Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Species */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Fish className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Species</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {fishery.species?.map((species, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {species}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Pricing</h2>
            </div>
            <div className="space-y-2">
              {fishery.pricing?.map((price, index) => (
                <p key={index} className="text-gray-700">{price}</p>
              ))}
            </div>
          </div>

          {/* Opening Times */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Opening Times</h2>
            </div>
            <div className="space-y-2">
              {fishery.opening_times?.map((time, index) => (
                <p key={index} className="text-gray-700">{time}</p>
              ))}
            </div>
          </div>

          {/* Day Tickets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-semibold">Day Tickets</h2>
            </div>
            <div className="space-y-2">
              {fishery.day_tickets?.map((ticket, index) => (
                <p key={index} className="text-gray-700">{ticket}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Lakes Section */}
        {lakes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Lakes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lakes.map((lake) => (
                <div key={lake.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {lake.image && (
                    <img src={lake.image} alt={lake.name} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{lake.name}</h3>
                    <p className="text-gray-700 mb-4">{lake.description}</p>
                    <div className="space-y-2">
                      {lake.species && (
                        <div className="flex flex-wrap gap-2">
                          {lake.species.map((species, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                              {species}
                            </span>
                          ))}
                        </div>
                      )}
                      {lake.size_acres && (
                        <p className="text-sm text-gray-600">Size: {lake.size_acres} acres</p>
                      )}
                      {lake.max_depth_ft && (
                        <p className="text-sm text-gray-600">Max Depth: {lake.max_depth_ft} ft</p>
                      )}
                      {lake.pegs && (
                        <p className="text-sm text-gray-600">Number of Pegs: {lake.pegs}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accommodation Section */}
        {accommodation.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Accommodation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodation.map((acc) => (
                <div key={acc.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {acc.image && (
                    <img src={acc.image} alt={acc.type} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{acc.type}</h3>
                    <p className="text-gray-700 mb-4">{acc.notes}</p>
                    <p className="text-lg font-semibold text-blue-600">£{acc.price} per night</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}