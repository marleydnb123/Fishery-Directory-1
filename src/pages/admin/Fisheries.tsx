import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Fishery } from '../../types/schema';

// Initial form state with all fields
const initialFormState = {
  name: '',
  slug: '',
  description: '',
  rules: '',
  image: '',
  species: [] as string[],
  district: '',
  isfeatured: false,
  hasaccommodation: false,
  website: '',
  contact_phone: '',
  contact_email: '',
  address: '',
  postcode: '',
  day_ticket_price: null as number | null,
  features: [] as string[],
  night_fishing_allowed: false,
  fishing_type: [] as string[],
  match_fishing_friendly: false,
  disabled_access: false,
  facilities: [] as string[],
  dog_friendly: false,
  price_range: '',
  fire_pits_allowed: false,
  booking_type: [] as string[],
  parking_close: false,
  camping_allowed: false,
  catch_photos: false,
  wifi_signal: '',
  descriptionpage: '',
  fisheryimages1: '',
  fisheryimages2: '',
  fisheryimages3: '',
  fisheryvideo: '',
  bait_boats: false,
  magic_twig: false,
  tackle_shop: false,
  private_hire: false,
  tackle_hire: false,
  coaching: false,
  keepnets_allowed: false,
  tactics: '',
  latitude: null as number | null,
  longitude: null as number | null,
  pricing: [] as string[],
  opening_times: [] as string[],
  day_tickets: [] as string[],
  payment: [] as string[],
  fishery_of_the_week: false,
  record_biggest_fish: '',
  record_match_weight: '',
  stock: '',
  average_weight: '',
  access_all_hours: false,
  guests_allowed: false,
  under_18: false,
};

const AdminFisheries: React.FC = () => {
  const [fisheries, setFisheries] = useState<Fishery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentFishery, setCurrentFishery] = useState<Fishery | null>(null);
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Array fields that need special handling
  const arrayFields = [
    'species',
    'features',
    'fishing_type',
    'facilities',
    'booking_type',
    'pricing',
    'opening_times',
    'day_tickets',
    'payment',
  ];

  // Numeric fields that need special handling
  const numericFields = ['day_ticket_price', 'latitude', 'longitude'];

  // Boolean fields for checkboxes
  const booleanFields = [
    'isfeatured',
    'hasaccommodation',
    'night_fishing_allowed',
    'match_fishing_friendly',
    'disabled_access',
    'dog_friendly',
    'fire_pits_allowed',
    'parking_close',
    'camping_allowed',
    'catch_photos',
    'bait_boats',
    'magic_twig',
    'tackle_shop',
    'private_hire',
    'tackle_hire',
    'coaching',
    'keepnets_allowed',
    'fishery_of_the_week',
    'access_all_hours',
    'guests_allowed',
    'under_18',
  ];

  useEffect(() => {
    const fetchFisheries = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('fisheries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        setFisheries([]);
      } else {
        setFisheries(data || []);
      }
      setLoading(false);
    };

    fetchFisheries();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle array fields (comma-separated values)
    if (arrayFields.includes(name)) {
      const arrayValue = value.trim() === '' ? [] : value.split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        [name]: arrayValue,
      }));
      return;
    }

    // Handle boolean fields (checkboxes)
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }

    // Handle numeric fields
    if (numericFields.includes(name)) {
      const numValue = value.trim() === '' ? null : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
      return;
    }

    // Handle all other fields
    setFormData(prev => ({
      ...prev,
      [name]: value.trim() === '' ? null : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-');

      // Prepare submission data
      const submissionData = {
        ...formData,
        slug,
      };

      // Ensure all array fields are properly formatted
      arrayFields.forEach(field => {
        submissionData[field] = Array.isArray(submissionData[field]) 
          ? submissionData[field] 
          : (submissionData[field] ? String(submissionData[field]).split(',').map(item => item.trim()).filter(Boolean) : []);
      });

      // Handle numeric fields
      numericFields.forEach(field => {
        if (submissionData[field] === '') {
          submissionData[field] = null;
        } else if (submissionData[field]) {
          submissionData[field] = parseFloat(submissionData[field]);
        }
      });

      // Handle boolean fields
      booleanFields.forEach(field => {
        submissionData[field] = !!submissionData[field];
      });

      const { data, error } = isEditModalOpen
        ? await supabase
            .from('fisheries')
            .update(submissionData)
            .eq('id', currentFishery?.id)
            .select()
        : await supabase
            .from('fisheries')
            .insert([submissionData])
            .select();

      if (error) throw error;

      if (isEditModalOpen) {
        setFisheries(fisheries.map(f => (f.id === currentFishery?.id ? data[0] : f)));
      } else {
        setFisheries([data[0], ...fisheries]);
      }

      setFormData(initialFormState);
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setCurrentFishery(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter fisheries based on search term
  const filteredFisheries = fisheries.filter(fishery =>
    fishery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fishery.district?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Fisheries</h1>
        <button
          onClick={() => {
            setFormData(initialFormState);
            setIsAddModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Fishery
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search fisheries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Fisheries List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                District
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Species
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFisheries.map((fishery) => (
              <tr key={fishery.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{fishery.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{fishery.district}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {fishery.species?.slice(0, 3).map((species, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {species}
                      </span>
                    ))}
                    {fishery.species?.length > 3 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{fishery.species.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setCurrentFishery(fishery);
                      setFormData({
                        ...fishery,
                        species: fishery.species || [],
                        features: fishery.features || [],
                        fishing_type: fishery.fishing_type || [],
                        facilities: fishery.facilities || [],
                        booking_type: fishery.booking_type || [],
                        pricing: fishery.pricing || [],
                        opening_times: fishery.opening_times || [],
                        day_tickets: fishery.day_tickets || [],
                        payment: fishery.payment || [],
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentFishery(fishery);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isAddModalOpen ? 'Add New Fishery' : 'Edit Fishery'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        District
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rules
                      </label>
                      <textarea
                        name="rules"
                        value={formData.rules || ''}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Species and Features */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Species and Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Species (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="species"
                        value={formData.species?.join(', ') || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Carp, Pike, Tench"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Features (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="features"
                        value={formData.features?.join(', ') || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Car Park, Toilets, Cafe"
                      />
                    </div>
                  </div>
                </div>

                {/* Fishing Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Fishing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fishing Types (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="fishing_type"
                        value={formData.fishing_type?.join(', ') || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Match, Pleasure, Specimen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day Ticket Price
                      </label>
                      <input
                        type="number"
                        name="day_ticket_price"
                        value={formData.day_ticket_price || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="night_fishing_allowed"
                        checked={formData.night_fishing_allowed || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Night Fishing</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="match_fishing_friendly"
                        checked={formData.match_fishing_friendly || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Match Friendly</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="keepnets_allowed"
                        checked={formData.keepnets_allowed || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Keepnets Allowed</span>
                    </label>
                  </div>
                </div>

                {/* Facilities and Amenities */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Facilities and Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Facilities (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="facilities"
                        value={formData.facilities?.join(', ') || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Toilets, Showers, Cafe"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="disabled_access"
                        checked={formData.disabled_access || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Disabled Access</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="dog_friendly"
                        checked={formData.dog_friendly || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Dog Friendly</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="parking_close"
                        checked={formData.parking_close || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Close Parking</span>
                    </label>
                  </div>
                </div>

                {/* Booking and Payment */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Booking and Payment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booking Types (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="booking_type"
                        value={formData.booking_type?.join(', ') || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Day Ticket, Season Ticket"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Methods (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="payment"
                        value={formData.payment?.join(', ') || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="Cash, Card"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price Range
                      </label>
                      <input
                        type="text"
                        name="price_range"
                        value={formData.price_range || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        placeholder="£10-£20"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="contact_phone"
                        value={formData.contact_phone || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="contact_email"
                        value={formData.contact_email || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        name="postcode"
                        value={formData.postcode || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={formData.latitude || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        step="any"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="number"
                        name="longitude"
                        value={formData.longitude || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        step="any"
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Image 1
                      </label>
                      <input
                        type="url"
                        name="fisheryimages1"
                        value={formData.fisheryimages1 || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Image 2
                      </label>
                      <input
                        type="url"
                        name="fisheryimages2"
                        value={formData.fisheryimages2 || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Image 3
                      </label>
                      <input
                        type="url"
                        name="fisheryimages3"
                        value={formData.fisheryimages3 || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL
                      </label>
                      <input
                        type="url"
                        name="fisheryvideo"
                        value={formData.fisheryvideo || ''}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Features */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Additional Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="bait_boats"
                        checked={formData.bait_boats || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Bait Boats</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="magic_twig"
                        checked={formData.magic_twig || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Magic Twig</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="tackle_shop"
                        checked={formData.tackle_shop || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Tackle Shop</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="private_hire"
                        checked={formData.private_hire || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Private Hire</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="tackle_hire"
                        checked={formData.tackle_hire || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Tackle Hire</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="coaching"
                        checked={formData.coaching || false}
                        onChange={handleInputChange}
                        className="rounded text-blue-600"
                      />
                      <span className="text-sm">Coaching</span>
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      setFormData(initialFormState);
                      setCurrentFishery(null);
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : isAddModalOpen ? 'Add Fishery' : 'Save Changes'}
                  </button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentFishery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('fisheries')
                      .delete()
                      .eq('id', currentFishery.id);

                    if (error) throw error;

                    setFisheries(fisheries.filter(f => f.id !== currentFishery.id));
                    setIsDeleteModalOpen(false);
                    setCurrentFishery(null);
                  } catch (err: any) {
                    setError(err.message);
                  }
                }}
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