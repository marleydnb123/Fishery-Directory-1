import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Globe, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { TackleShop } from '../../types/schema';

const emptyShop: Omit<TackleShop, 'id' | 'created_at'> = {
  name: '',
  slug: '',
  description: '',
  image: '',
  address: '',
  postcode: '',
  website: '',
  phone: '',
  email: '',
  brands: [],
  opening_hours: {},
};

const AdminTackleShops: React.FC = () => {
  const [shops, setShops] = useState<TackleShop[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<TackleShop | null>(null);
  const [formShop, setFormShop] = useState<Omit<TackleShop, 'id' | 'created_at'>>(emptyShop);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tackle_shops')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching shops:', error);
        setShops([]);
      } else {
        setShops(data || []);
      }
      setLoading(false);
    };
    fetchShops();
  }, []);

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteShop = async (id: string) => {
    await supabase.from('tackle_shops').delete().eq('id', id);
    setShops(shops.filter(shop => shop.id !== id));
    setIsDeleteModalOpen(false);
    setCurrentShop(null);
  };

  const handleAddShop = async () => {
    const slug = formShop.name.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('tackle_shops')
      .insert([{ ...formShop, slug }])
      .select()
      .single();
    if (!error && data) {
      setShops([data, ...shops]);
    }
    setIsAddModalOpen(false);
    setFormShop(emptyShop);
  };

  const handleEditShop = async () => {
    if (!currentShop) return;
    const { data, error } = await supabase
      .from('tackle_shops')
      .update(formShop)
      .eq('id', currentShop.id)
      .select()
      .single();
    if (!error && data) {
      setShops(shops.map(s => s.id === currentShop.id ? data : s));
    }
    setIsEditModalOpen(false);
    setCurrentShop(null);
    setFormShop(emptyShop);
  };

  return (
    <div>
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Manage Tackle Shops</h1>
        <button 
          onClick={() => {
            setIsAddModalOpen(true);
            setFormShop(emptyShop);
          }}
          className="bg-primary-600 hover:bg-primary-800 text-white py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Shop
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
            placeholder="Search tackle shops..."
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
                  Shop Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brands
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShops.map((shop) => (
                <tr key={shop.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img 
                          src={shop.image} 
                          alt={shop.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                        {shop.website && (
                          <a 
                            href={shop.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                          >
                            <Globe className="h-3 w-3 mr-1" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary-600 mr-2 mt-1" />
                      <div>
                        <div className="text-sm text-gray-900">{shop.address}</div>
                        <div className="text-sm text-gray-500">{shop.postcode}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{shop.phone}</div>
                    <div className="text-sm text-gray-500">{shop.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {shop.brands.slice(0, 2).map((brand, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-900"
                        >
                          {brand}
                        </span>
                      ))}
                      {shop.brands.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          +{shop.brands.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => {
                        setCurrentShop(shop);
                        setFormShop({
                          name: shop.name,
                          slug: shop.slug,
                          description: shop.description,
                          image: shop.image,
                          address: shop.address,
                          postcode: shop.postcode,
                          website: shop.website || '',
                          phone: shop.phone || '',
                          email: shop.email || '',
                          brands: shop.brands,
                          opening_hours: shop.opening_hours || {},
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentShop(shop);
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

        {filteredShops.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">No tackle shops found matching your search.</p>
          </div>
        )}
      </motion.div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add New Tackle Shop</h3>
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Shop Name"
              value={formShop.name}
              onChange={e => setFormShop(f => ({ ...f, name: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Image URL"
              value={formShop.image}
              onChange={e => setFormShop(f => ({ ...f, image: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Address"
              value={formShop.address}
              onChange={e => setFormShop(f => ({ ...f, address: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Postcode"
              value={formShop.postcode}
              onChange={e => setFormShop(f => ({ ...f, postcode: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Phone"
              value={formShop.phone}
              onChange={e => setFormShop(f => ({ ...f, phone: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Email"
              value={formShop.email}
              onChange={e => setFormShop(f => ({ ...f, email: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Website"
              value={formShop.website}
              onChange={e => setFormShop(f => ({ ...f, website: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Brands (comma separated)"
              value={formShop.brands.join(',')}
              onChange={e => setFormShop(f => ({ ...f, brands: e.target.value.split(',').map(b => b.trim()) }))}
            />
            <textarea
              className="w-full mb-4 border p-2 rounded"
              placeholder="Description"
              value={formShop.description}
              onChange={e => setFormShop(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddShop}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={!formShop.name || !formShop.address}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Edit Tackle Shop</h3>
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Shop Name"
              value={formShop.name}
              onChange={e => setFormShop(f => ({ ...f, name: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Image URL"
              value={formShop.image}
              onChange={e => setFormShop(f => ({ ...f, image: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Address"
              value={formShop.address}
              onChange={e => setFormShop(f => ({ ...f, address: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Postcode"
              value={formShop.postcode}
              onChange={e => setFormShop(f => ({ ...f, postcode: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Phone"
              value={formShop.phone}
              onChange={e => setFormShop(f => ({ ...f, phone: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Email"
              value={formShop.email}
              onChange={e => setFormShop(f => ({ ...f, email: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Website"
              value={formShop.website}
              onChange={e => setFormShop(f => ({ ...f, website: e.target.value }))}
            />
            <input
              className="w-full mb-2 border p-2 rounded"
              placeholder="Brands (comma separated)"
              value={formShop.brands.join(',')}
              onChange={e => setFormShop(f => ({ ...f, brands: e.target.value.split(',').map(b => b.trim()) }))}
            />
            <textarea
              className="w-full mb-4 border p-2 rounded"
              placeholder="Description"
              value={formShop.description}
              onChange={e => setFormShop(f => ({ ...f, description: e.target.value }))}
              rows={3}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditShop}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                disabled={!formShop.name || !formShop.address}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && currentShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{currentShop.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCurrentShop(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteShop(currentShop.id)}
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

export default AdminTackleShops;