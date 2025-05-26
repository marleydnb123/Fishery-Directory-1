import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Home, PoundSterling } from 'lucide-react';
import { mockAccommodation, mockFisheries } from '../../data/mockData';
import { Accommodation } from '../../types/schema';

const AdminAccommodation: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>(mockAccommodation);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAccommodation, setCurrentAccommodation] = useState<Accommodation | null>(null);
  
  // Filter accommodations based on search term
  const filteredAccommodations = accommodations.filter(accommodation => {
    const fishery = mockFisheries.find(f => f.id === accommodation.fishery_id);
    return fishery?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           accommodation.type.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Find fishery name by id
  const getFisheryName = (fisheryId: string): string => {
    const fishery = mockFisheries.find(f => f.id === fisheryId);
    return fishery ? fishery.name : 'Unknown Fishery';
  };
  
  // Handle delete accommodation
  const handleDeleteAccommodation = (id: string) => {
    setAccommodations(accommodations.filter(acc => acc.id !== id));
    setIsDeleteModalOpen(false);
    setCurrentAccommodation(null);
  };
  
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
    </div>
  );
};

export default AdminAccommodation;