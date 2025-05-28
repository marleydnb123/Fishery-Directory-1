import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Star, Home as HomeIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Fishery } from '../../types/schema';

const emptyFishery: Omit<Fishery, 'id'> = {
  name: '',
  slug: '',
  district: '',
  image: '',
  species: [],
  features: [],
  isFeatured: false,
  hasAccommodation: false,
  description: '',
  contact_phone: '',
  contact_email: '',
  website: '',
  day_ticket_price: 0,
  descriptionpage: '',
  rules: '',
  night_fishing_allowed: false,
  fishing_type: '',
  match_fishing_friendly: false,
  disabled_access: false,
  facilities: [],
  dog_friendly: false,
  price_range: '',
  fire_pits_allowed: false,
  booking_type: '',
  parking_close: false,
  camping_allowed: false,
  catch_photos: false,
  wifi_signal: '',
  fisheryimages1: '',
  fisheryimages2: '',
  fisheryimages3: '',
  fisheryvideo: '',
  bait_boats: false,
};

const AdminFisheries: React.FC = () => {
  const [fisheries, setFisheries] = useState<Fishery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFishery, setCurrentFishery] = useState<Fishery | null>(null);
  const [formFishery, setFormFishery] = useState<Omit<Fishery, 'id'>>(emptyFishery);
  const [loading, setLoading] = useState(true);

  // Fetch fisheries from Supabase
  useEffect(() => {
    const fetchFisheries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('fisheries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        setFisheries([]);
      } else {
        setFisheries(
          (data || []).map((f: any) => ({
            ...f,
            isFeatured: f.isfeatured,
            hasAccommodation: f.hasaccommodation,
            species: Array.isArray(f.species) ? f.species : [],
            features: Array.isArray(f.features) ? f.features : [],
            description: f.description || '',
          }))
        );
      }
      setLoading(false);
    };
    fetchFisheries();
  }, []);

  // Filter fisheries based on search term
  const filteredFisheries = fisheries.filter(fishery => 
    fishery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fishery.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle delete fishery (Supabase)
  const handleDeleteFishery = async (id: string) => {
    await supabase.from('fisheries').delete().eq('id', id);
    setFisheries(fisheries.filter(fishery => fishery.id !== id));
    setIsDeleteModalOpen(false);
    setCurrentFishery(null);
  };

  // Handle toggle featured (Supabase)
  const handleToggleFeatured = async (id: string) => {
    const fishery = fisheries.find(f => f.id === id);
    if (!fishery) return;
    const updated = !fishery.isFeatured;
    await supabase.from('fisheries').update({ isfeatured: updated }).eq('id', id);
    setFisheries(fisheries.map(f => 
      f.id === id ? { ...f, isFeatured: updated } : f
    ));
  };

  // Handle toggle accommodation (Supabase)
  const handleToggleAccommodation = async (id: string) => {
    const fishery = fisheries.find(f => f.id === id);
    if (!fishery) return;
    const updated = !fishery.hasAccommodation;
    await supabase.from('fisheries').update({ hasaccommodation: updated }).eq('id', id);
    setFisheries(fisheries.map(f => 
      f.id === id ? { ...f, hasAccommodation: updated } : f
    ));
  };

  // Handle Add (Supabase) 
  const handleAddFishery = async () => {
    const slug = formFishery.name.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('fisheries')
      .insert([{
        name: formFishery.name,
        slug,
        district: formFishery.district,
        image: formFishery.image,
        species: formFishery.species,
        features: formFishery.features,
        description: formFishery.description,
        isfeatured: formFishery.isFeatured,
        hasaccommodation: formFishery.hasAccommodation,
        contact_phone: formFishery.contact_phone,
        contact_email: formFishery.contact_email,
        website: formFishery.website,
        day_ticket_price: formFishery.day_ticket_price,
        descriptionpage: formFishery.descriptionpage,
        rules: formFishery.rules,
        night_fishing_allowed: formFishery.night_fishing_allowed,
        fishing_type: formFishery.fishing_type,
        match_fishing_friendly: formFishery.match_fishing_friendly,
        disabled_access: formFishery.disabled_access,
        facilities: formFishery.facilities,
        dog_friendly: formFishery.dog_friendly,
        price_range: formFishery.price_range,
        fire_pits_allowed: formFishery.fire_pits_allowed,
        booking_type: formFishery.booking_type,
        parking_close: formFishery.parking_close,
        camping_allowed: formFishery.camping_allowed,
        catch_photos: formFishery.catch_photos,
        wifi_signal: formFishery.wifi_signal,
        fisheryimages1: formFishery.fisheryimages1,
        fisheryimages2: formFishery.fisheryimages2,
        fisheryimages3: formFishery.fisheryimages3,
        fisheryvideo: formFishery.fisheryvideo,
        bait_boats: formFishery.bait_boats,
      }])
      .select()
      .single();
    if (!error && data) {
      setFisheries([{
        ...data,
        isFeatured: data.isfeatured,
        hasAccommodation: data.hasaccommodation,
        species: Array.isArray(data.species) ? data.species : [],
        features: Array.isArray(data.features) ? data.features : [],
        description: data.description || '',
      }, ...fisheries]);
    }
    setIsAddModalOpen(false);
    setFormFishery(emptyFishery);
  };

  // Handle Edit (Supabase)
  const handleEditFishery = async () => {
    if (!currentFishery) return;
    const { data, error } = await supabase
      .from('fisheries')
      .update({
        name: formFishery.name,
        slug: formFishery.slug,
        district: formFishery.district,
        image: formFishery.image,
        species: formFishery.species,
        features: formFishery.features,
        description: formFishery.description,
        isfeatured: formFishery.isFeatured,
        hasaccommodation: formFishery.hasAccommodation,
        contact_phone: formFishery.contact_phone,
        contact_email: formFishery.contact_email,
        website: formFishery.website,
        day_ticket_price: formFishery.day_ticket_price,
        descriptionpage: formFishery.descriptionpage,
        rules: formFishery.rules,
        night_fishing_allowed: formFishery.night_fishing_allowed,
        fishing_type: formFishery.fishing_type,
        match_fishing_friendly: formFishery.match_fishing_friendly,
        disabled_access: formFishery.disabled_access,
        facilities: formFishery.facilities,
        dog_friendly: formFishery.dog_friendly,
        price_range: formFishery.price_range,
        fire_pits_allowed: formFishery.fire_pits_allowed,
        booking_type: formFishery.booking_type,
        parking_close: formFishery.parking_close,
        camping_allowed: formFishery.camping_allowed,
        catch_photos: formFishery.catch_photos,
        wifi_signal: formFishery.wifi_signal,
        fisheryimages1: formFishery.fisheryimages1,
        fisheryimages2: formFishery.fisheryimages2,
        fisheryimages3: formFishery.fisheryimages3,
        fisheryvideo: formFishery.fisheryvideo,
        bait_boats: formFishery.bait_boats,
      })
      .eq('id', currentFishery.id)
      .select()
      .single();
    if (!error && data) {
      setFisheries(fisheries.map(f =>
        f.id === currentFishery.id
          ? {
              ...data,
              isFeatured: data.isfeatured,
              hasAccommodation: data.hasaccommodation,
              species: Array.isArray(data.species) ? data.species : [],
              features: Array.isArray(data.features) ? data.features : [],
              description: data.description || '',
            }
          : f
      ));
    }
    setIsEditModalOpen(false);
    setCurrentFishery(null);
    setFormFishery(emptyFishery);
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="mt-0">
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Fisheries</h1>
        <button 
          onClick={() => {
            setIsAddModalOpen(true);
            setFormFishery(emptyFishery);
          }}
          className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Fishery
        </button>
      </motion.div>
      
      <motion.div 
        className="bg-white p-4 rounded-xl shadow-md mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search fisheries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fishery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Species
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Accommodation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFisheries.map((fishery, index) => (
                <motion.tr 
                  key={fishery.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={fishery.image} 
                          alt={fishery.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{fishery.name}</div>
                        <div className="text-xs text-gray-500">{fishery.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{fishery.district}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {fishery.species.slice(0, 2).map((species, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-900"
                        >
                          {species}
                        </span>
                      ))}
                      {fishery.species.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          +{fishery.species.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleFeatured(fishery.id)}
                      className={`rounded-full p-1 ${
                        fishery.isFeatured 
                          ? 'text-yellow-500 hover:bg-yellow-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={fishery.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <Star className="h-5 w-5" fill={fishery.isFeatured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleToggleAccommodation(fishery.id)}
                      className={`rounded-full p-1 ${
                        fishery.hasAccommodation 
                          ? 'text-blue-500 hover:bg-blue-50' 
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={fishery.hasAccommodation ? 'Remove accommodation' : 'Add accommodation'}
                    >
                      <HomeIcon className="h-5 w-5" fill={fishery.hasAccommodation ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate">
                    <div className="text-xs text-gray-700">{fishery.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => {
                        setCurrentFishery(fishery);
                        setFormFishery({
                          name: fishery.name,
                          slug: fishery.slug,
                          district: fishery.district,
                          image: fishery.image,
                          species: fishery.species,
                          features: fishery.features,
                          isFeatured: fishery.isFeatured,
                          hasAccommodation: fishery.hasAccommodation,
                          description: fishery.description,
                          contact_phone: fishery.contact_phone,
                          contact_email: fishery.contact_email,
                          website: fishery.website,
                          day_ticket_price: fishery.day_ticket_price,
                          descriptionpage: fishery.descriptionpage,
                          rules: fishery.rules,
                          night_fishing_allowed: fishery.night_fishing_allowed,
                          fishing_type: fishery.fishing_type,
                          match_fishing_friendly: fishery.match_fishing_friendly,
                          disabled_access: fishery.disabled_access,
                          facilities: fishery.facilities,
                          dog_friendly: fishery.dog_friendly,
                          price_range: fishery.price_range,
                          fire_pits_allowed: fishery.fire_pits_allowed,
                          booking_type: fishery.booking_type,
                          parking_close: fishery.parking_close,
                          camping_allowed: fishery.camping_allowed,
                          catch_photos: fishery.catch_photos,
                          wifi_signal: fishery.wifi_signal,
                          fisheryimages1: fishery.fisheryimages1,
                          fisheryimages2: fishery.fisheryimages2,
                          fisheryimages3: fishery.fisheryimages3,
                          fisheryvideo: fishery.fisheryvideo,
                          bait_boats: fishery.bait_boats
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentFishery(fishery);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredFisheries.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No fisheries found matching your search.</p>
          </div>
        )}
      </motion.div>
       
      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add New Fishery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Fishery name"
                    value={formFishery.name}
                    onChange={e => setFormFishery(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="District"
                    value={formFishery.district}
                    onChange={e => setFormFishery(f => ({ ...f, district: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Main image URL"
                    value={formFishery.image}
                    onChange={e => setFormFishery(f => ({ ...f, image: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Species (comma separated)"
                    value={formFishery.species.join(',')}
                    onChange={e => setFormFishery(f => ({ ...f, species: e.target.value.split(',').map(s => s.trim()) }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Features (comma separated)"
                    value={formFishery.features.join(',')}
                    onChange={e => setFormFishery(f => ({ ...f, features: e.target.value.split(',').map(s => s.trim()) }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Facilities (comma separated)"
                    value={formFishery.facilities?.join(',') || ''}
                    onChange={e => setFormFishery(f => ({ ...f, facilities: e.target.value.split(',').map(s => s.trim()) }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fishing Type</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="e.g., Match, Pleasure, Specimen"
                    value={formFishery.fishing_type || ''}
                    onChange={e => setFormFishery(f => ({ ...f, fishing_type: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="e.g., £10-25"
                    value={formFishery.price_range || ''}
                    onChange={e => setFormFishery(f => ({ ...f, price_range: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="e.g., Day Ticket, Members Only"
                    value={formFishery.booking_type || ''}
                    onChange={e => setFormFishery(f => ({ ...f, booking_type: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Signal</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="e.g., Strong, Weak, None"
                    value={formFishery.wifi_signal || ''}
                    onChange={e => setFormFishery(f => ({ ...f, wifi_signal: e.target.value }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.night_fishing_allowed || false}
                      onChange={e => setFormFishery(f => ({ ...f, night_fishing_allowed: e.target.checked }))}
                      className="mr-2"
                      id="nightFishing"
                    />
                    <label htmlFor="nightFishing" className="text-sm">Night Fishing Allowed</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.match_fishing_friendly || false}
                      onChange={e => setFormFishery(f => ({ ...f, match_fishing_friendly: e.target.checked }))}
                      className="mr-2"
                      id="matchFishing"
                    />
                    <label htmlFor="matchFishing" className="text-sm">Match Fishing Friendly</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.disabled_access || false}
                      onChange={e => setFormFishery(f => ({ ...f, disabled_access: e.target.checked }))}
                      className="mr-2"
                      id="disabledAccess"
                    />
                    <label htmlFor="disabledAccess" className="text-sm">Disabled Access</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.dog_friendly || false}
                      onChange={e => setFormFishery(f => ({ ...f, dog_friendly: e.target.checked }))}
                      className="mr-2"
                      id="dogFriendly"
                    />
                    <label htmlFor="dogFriendly" className="text-sm">Dog Friendly</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.fire_pits_allowed || false}
                      onChange={e => setFormFishery(f => ({ ...f, fire_pits_allowed: e.target.checked }))}
                      className="mr-2"
                      id="firePits"
                    />
                    <label htmlFor="firePits" className="text-sm">Fire Pits Allowed</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.parking_close || false}
                      onChange={e => setFormFishery(f => ({ ...f, parking_close: e.target.checked }))}
                      className="mr-2"
                      id="parkingClose"
                    />
                    <label htmlFor="parkingClose" className="text-sm">Close Parking</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.camping_allowed || false}
                      onChange={e => setFormFishery(f => ({ ...f, camping_allowed: e.target.checked }))}
                      className="mr-2"
                      id="campingAllowed"
                    />
                    <label htmlFor="campingAllowed" className="text-sm">Camping Allowed</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.catch_photos || false}
                      onChange={e => setFormFishery(f => ({ ...f, catch_photos: e.target.checked }))}
                      className="mr-2"
                      id="catchPhotos"
                    />
                    <label htmlFor="catchPhotos" className="text-sm">Catch Photos Available</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formFishery.bait_boats || false}
                      onChange={e => setFormFishery(f => ({ ...f, bait_boats: e.target.checked }))}
                      className="mr-2"
                      id="baitBoats"
                    />
                    <label htmlFor="baitBoats" className="text-sm">Bait Boats</label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Full Width Fields */}
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                  placeholder="Short description"
                  value={formFishery.description}
                  onChange={e => setFormFishery(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extended Description</label>
                <textarea
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                  placeholder="Detailed description for the fishery page"
                  value={formFishery.descriptionpage || ''}
                  onChange={e => setFormFishery(f => ({ ...f, descriptionpage: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rules</label>
                <textarea
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                  placeholder="Fishery rules"
                  value={formFishery.rules || ''}
                  onChange={e => setFormFishery(f => ({ ...f, rules: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Image Fields */}
              <div className="mt-4 space-y-4">
                <h4 className="font-medium text-gray-900">Additional Images</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image 1</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Image URL"
                    value={formFishery.fisheryimages1 || ''}
                    onChange={e => setFormFishery(f => ({ ...f, fisheryimages1: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image 2</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Image URL"
                    value={formFishery.fisheryimages2 || ''}
                    onChange={e => setFormFishery(f => ({ ...f, fisheryimages2: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image 3</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="Image URL"
                    value={formFishery.fisheryimages3 || ''}
                    onChange={e => setFormFishery(f => ({ ...f, fisheryimages3: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                  <input
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
                    placeholder="YouTube, Vimeo, or other video URL"
                    value={formFishery.fisheryvideo || ''}
                    onChange={e => setFormFishery(f => ({ ...f, fisheryvideo: e.target.value }))}
                  />
                </div>
              </div>
            
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddFishery}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  disabled={!formFishery.name}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
{isEditModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Edit Fishery</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Fishery name"
              value={formFishery.name}
              onChange={e => setFormFishery(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="District"
              value={formFishery.district}
              onChange={e => setFormFishery(f => ({ ...f, district: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Main image URL"
              value={formFishery.image}
              onChange={e => setFormFishery(f => ({ ...f, image: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Species (comma separated)"
              value={formFishery.species.join(',')}
              onChange={e => setFormFishery(f => ({ ...f, species: e.target.value.split(',').map(s => s.trim()) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Features (comma separated)"
              value={formFishery.features.join(',')}
              onChange={e => setFormFishery(f => ({ ...f, features: e.target.value.split(',').map(s => s.trim()) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Facilities (comma separated)"
              value={formFishery.facilities?.join(',') || ''}
              onChange={e => setFormFishery(f => ({ ...f, facilities: e.target.value.split(',').map(s => s.trim()) }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fishing Type</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="e.g., Match, Pleasure, Specimen"
              value={formFishery.fishing_type || ''}
              onChange={e => setFormFishery(f => ({ ...f, fishing_type: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="e.g., £10-25"
              value={formFishery.price_range || ''}
              onChange={e => setFormFishery(f => ({ ...f, price_range: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="e.g., Day Ticket, Members Only"
              value={formFishery.booking_type || ''}
              onChange={e => setFormFishery(f => ({ ...f, booking_type: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wi-Fi Signal</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="e.g., Strong, Weak, None"
              value={formFishery.wifi_signal || ''}
              onChange={e => setFormFishery(f => ({ ...f, wifi_signal: e.target.value }))}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.night_fishing_allowed || false}
                onChange={e => setFormFishery(f => ({ ...f, night_fishing_allowed: e.target.checked }))}
                className="mr-2"
                id="nightFishingEdit"
              />
              <label htmlFor="nightFishingEdit" className="text-sm">Night Fishing Allowed</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.match_fishing_friendly || false}
                onChange={e => setFormFishery(f => ({ ...f, match_fishing_friendly: e.target.checked }))}
                className="mr-2"
                id="matchFishingEdit"
              />
              <label htmlFor="matchFishingEdit" className="text-sm">Match Fishing Friendly</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.disabled_access || false}
                onChange={e => setFormFishery(f => ({ ...f, disabled_access: e.target.checked }))}
                className="mr-2"
                id="disabledAccessEdit"
              />
              <label htmlFor="disabledAccessEdit" className="text-sm">Disabled Access</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.dog_friendly || false}
                onChange={e => setFormFishery(f => ({ ...f, dog_friendly: e.target.checked }))}
                className="mr-2"
                id="dogFriendlyEdit"
              />
              <label htmlFor="dogFriendlyEdit" className="text-sm">Dog Friendly</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.fire_pits_allowed || false}
                onChange={e => setFormFishery(f => ({ ...f, fire_pits_allowed: e.target.checked }))}
                className="mr-2"
                id="firePitsEdit"
              />
              <label htmlFor="firePitsEdit" className="text-sm">Fire Pits Allowed</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.parking_close || false}
                onChange={e => setFormFishery(f => ({ ...f, parking_close: e.target.checked }))}
                className="mr-2"
                id="parkingCloseEdit"
              />
              <label htmlFor="parkingCloseEdit" className="text-sm">Close Parking</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.camping_allowed || false}
                onChange={e => setFormFishery(f => ({ ...f, camping_allowed: e.target.checked }))}
                className="mr-2"
                id="campingAllowedEdit"
              />
              <label htmlFor="campingAllowedEdit" className="text-sm">Camping Allowed</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.catch_photos || false}
                onChange={e => setFormFishery(f => ({ ...f, catch_photos: e.target.checked }))}
                className="mr-2"
                id="catchPhotosEdit"
              />
              <label htmlFor="catchPhotosEdit" className="text-sm">Catch Photos Available</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formFishery.bait_boats || false}
                onChange={e => setFormFishery(f => ({ ...f, bait_boats: e.target.checked }))}
                className="mr-2"
                id="baitboatsEdit"
              />
              <label htmlFor="baitboatsEdit" className="text-sm">Catch Photos Available</label>
            </div>
          </div>
        </div>
      </div>
      {/* Full Width Fields */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
            placeholder="Short description"
            value={formFishery.description}
            onChange={e => setFormFishery(f => ({ ...f, description: e.target.value }))}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Extended Description</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
            placeholder="Detailed description for the fishery page"
            value={formFishery.descriptionpage || ''}
            onChange={e => setFormFishery(f => ({ ...f, descriptionpage: e.target.value }))}
            rows={4}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rules</label>
          <textarea
            className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
            placeholder="Fishery rules"
            value={formFishery.rules || ''}
            onChange={e => setFormFishery(f => ({ ...f, rules: e.target.value }))}
            rows={4}
          />
        </div>
        {/* Image Fields */}
        <div className="mt-4 space-y-4">
          <h4 className="font-medium text-gray-900">Additional Images</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image 1</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Image URL"
              value={formFishery.fisheryimages1 || ''}
              onChange={e => setFormFishery(f => ({ ...f, fisheryimages1: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image 2</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Image URL"
              value={formFishery.fisheryimages2 || ''}
              onChange={e => setFormFishery(f => ({ ...f, fisheryimages2: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image 3</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="Image URL"
              value={formFishery.fisheryimages3 || ''}
              onChange={e => setFormFishery(f => ({ ...f, fisheryimages3: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
            <input
              className="w-full border p-2 rounded focus:ring-2 focus:ring-primary-400"
              placeholder="YouTube, Vimeo, or other video URL"
              value={formFishery.fisheryvideo || ''}
              onChange={e => setFormFishery(f => ({ ...f, fisheryvideo: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleEditFishery}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            disabled={!formFishery.name}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentFishery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{currentFishery.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentFishery(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteFishery(currentFishery.id)} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div> 
      )}
    </div>
  );
};

export default AdminFisheries;