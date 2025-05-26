import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Fish } from 'lucide-react';
import { mockLakes, mockFisheries } from '../../data/mockData';
import { Lake, Fishery } from '../../types/schema';

const AdminLakes: React.FC = () => {
  const [lakes, setLakes] = useState<Lake[]>(mockLakes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLake, setCurrentLake] = useState<Lake | null>(null);
  
  // Filter lakes based on search term
  const filteredLakes = lakes.filter(lake => 
    lake.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Find fishery name by id
  const getFisheryName = (fisheryId: string): string => {
    const fishery = mockFisheries.find(f => f.id === fisheryId);
    return fishery ? fishery.name : 'Unknown Fishery';
  };
  
  // Handle delete lake
  const handleDeleteLake = (id: string) => {
    setLakes(lakes.filter(lake => lake.id !== id));
    setIsDeleteModalOpen(false);
    setCurrentLake(null);
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
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Lakes</h1>
        <button 
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
              {filteredLakes.map((lake, index) => (
                <motion.tr 
                  key={lake.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                >
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
                </motion.tr>
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