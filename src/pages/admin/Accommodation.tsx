import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Home, PoundSterling } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Accommodation } from '../../types/schema';

interface AddAccommodationForm {
  type: string;
  fishery_id: string;
  price: number;
  notes: string;
  image?: string;
}

const initialFormState: AddAccommodationForm = {
  type: '',
  fishery_id: '',
  price: 0,
  notes: '',
  image: '',
};

const AdminAccommodation: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [fisheries, setFisheries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);
  const [formData, setFormData] = useState<AddAccommodationForm>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch accommodations
        const { data: accommodationData, error: accommodationError } = await supabase
          .from('accommodation')
          .select('*');

        if (accommodationError) throw accommodationError;

        // Fetch fisheries for the dropdown
        const { data: fisheriesData, error: fisheriesError } = await supabase
          .from('fisheries')
          .select('id, name');

        if (fisheriesError) throw fisheriesError;

        setAccommodations(accommodationData || []);
        setFisheries(fisheriesData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Filter accommodations based on search term
  const filteredAccommodations = accommodations.filter(accommodation => {
    const fishery = fisheries.find(f => f.id === accommodation.fishery_id);
    return fishery?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           accommodation.type.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Find fishery name by id
  const getFisheryName = (fisheryId: string): string => {
    const fishery = fisheries.find(f => f.id === fisheryId);
    return fishery ? fishery.name : 'Unknown Fishery';
  };
  
  // Handle add accommodation
  const handleAddAccommodation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('accommodation')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setAccommodations([...accommodations, data]);
      setIsAddModalOpen(false);
      setFormData(initialFormState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete accommodation
  const handleDeleteAccommodation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accommodation')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAccommodations(accommodations.filter(acc => acc.id !== id));
      setIsDeleteModalOpen(false);
      setCurrentAccommodation(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 p-4">
        Error: {error}
      </div>
    );
  }
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
    <div>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Accommodation</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Accommodation
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
            placeholder="Search accommodation..."
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fishery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price/Night
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccommodations.map((accommodation, index) => (
                <motion.tr 
                  key={accommodation.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 text-primary-600 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{accommodation.type}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getFisheryName(accommodation.fishery_id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <PoundSterling className="h-4 w-4 text-primary-600 mr-1" />
                      {accommodation.price}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {accommodation.notes}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentAccommodation(accommodation);
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
        
        {filteredAccommodations.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No accommodation found matching your search.</p>
          </div>
        )}
      </motion.div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentAccommodation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this <span className="font-semibold">{currentAccommodation.type}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentAccommodation(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAccommodation(currentAccommodation.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Accommodation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Accommodation</h3>
            <form onSubmit={handleAddAccommodation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fishery
                  </label>
                  <select
                    name="fishery_id"
                    value={formData.fishery_id}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  >
                    <option value="">Select a fishery</option>
                    {fisheries.map(fishery => (
                      <option key={fishery.id} value={fishery.id}>
                        {fishery.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Cabin, Lodge, Pod"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Night (£)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setFormData(initialFormState);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Accommodation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccommodation;