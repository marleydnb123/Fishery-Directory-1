import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Fish } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Lake } from '../../types/schema';

interface AddLakeForm {
  name: string;
  fishery_id: string;
  description: string;
  species: string[];
  size_acres?: number;
  max_depth_ft?: number;
  pegs?: number;
  image?: string;
}

const initialFormState: AddLakeForm = {
  name: '',
  fishery_id: '',
  description: '',
  species: [],
  size_acres: undefined,
  max_depth_ft: undefined,
  pegs: undefined,
  image: '',
};

const AdminLakes: React.FC = () => {
  const [lakes, setLakes] = useState<Lake[]>([]);
  const [fisheries, setFisheries] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLake, setCurrentLake] = useState<Lake | null>(null);
  const [formData, setFormData] = useState<AddLakeForm>(initialFormState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch lakes
        const { data: lakesData, error: lakesError } = await supabase
          .from('lakes')
          .select('*');

        if (lakesError) throw lakesError;

        // Fetch fisheries for the dropdown
        const { data: fisheriesData, error: fisheriesError } = await supabase
          .from('fisheries')
          .select('id, name');

        if (fisheriesError) throw fisheriesError;

        setLakes(lakesData || []);
        setFisheries(fisheriesData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter lakes based on search term
  const filteredLakes = lakes.filter(lake => {
    const fishery = fisheries.find(f => f.id === lake.fishery_id);
    return fishery?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lake.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Find fishery name by id
  const getFisheryName = (fisheryId: string): string => {
    const fishery = fisheries.find(f => f.id === fisheryId);
    return fishery ? fishery.name : 'Unknown Fishery';
  };

  // Handle add lake
  const handleAddLake = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('lakes')
        .insert([formData])
        .select()
        .single();

      if (error) throw error;

      setLakes([...lakes, data]);
      setIsAddModalOpen(false);
      setFormData(initialFormState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit lake
  const handleEditLake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLake) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lakes')
        .update(formData)
        .eq('id', currentLake.id)
        .select()
        .single();

      if (error) throw error;

      setLakes(lakes.map(lake => 
        lake.id === currentLake.id ? data : lake
      ));
      setIsEditModalOpen(false);
      setCurrentLake(null);
      setFormData(initialFormState);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete lake
  const handleDeleteLake = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lakes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLakes(lakes.filter(lake => lake.id !== id));
      setIsDeleteModalOpen(false);
      setCurrentLake(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'species') {
      setFormData(prev => ({
        ...prev,
        species: value.split(',').map(s => s.trim())
      }));
    } else if (['size_acres', 'max_depth_ft', 'pegs'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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

  return (
    <div>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Lakes</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Lake
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
            placeholder="Search lakes..."
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
                  Lake Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fishery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Species
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
              {filteredLakes.map((lake) => (
                <tr key={lake.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{lake.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getFisheryName(lake.fishery_id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {lake.species.map((species, i) => (
                        <span 
                          key={i}
                          className="flex items-center px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-900"
                        >
                          <Fish className="h-3 w-3 mr-1" />
                          {species}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 truncate max-w-xs">
                      {lake.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => {
                        setCurrentLake(lake);
                        setFormData({
                          name: lake.name,
                          fishery_id: lake.fishery_id,
                          description: lake.description,
                          species: lake.species,
                          size_acres: lake.size_acres,
                          max_depth_ft: lake.max_depth_ft,
                          pegs: lake.pegs,
                          image: lake.image,
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentLake(lake);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredLakes.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No lakes found matching your search.</p>
          </div>
        )}
      </motion.div>
      
      {/* Add/Edit Lake Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {isAddModalOpen ? 'Add New Lake' : 'Edit Lake'}
            </h3>
            <form onSubmit={isAddModalOpen ? handleAddLake : handleEditLake}>
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
                    Lake Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Species
                  </label>
                  <input
                    type="text"
                    name="species"
                    value={formData.species.join(',')}
                    onChange={handleInputChange}
                    placeholder="Comma separated species"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Size (acres)
                  </label>
                  <input
                    type="number"
                    name="size_acres"
                    value={formData.size_acres || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Depth (ft)
                  </label>
                  <input
                    type="number"
                    name="max_depth_ft"
                    value={formData.max_depth_ft || ''}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Pegs
                  </label>
                  <input
                    type="number"
                    name="pegs"
                    value={formData.pegs || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    setFormData(initialFormState);
                    setCurrentLake(null);
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
                  {loading ? 'Saving...' : (isAddModalOpen ? 'Add Lake' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentLake && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{currentLake.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentLake(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteLake(currentLake.id)}
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

export default AdminLakes;