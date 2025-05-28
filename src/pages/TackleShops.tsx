import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Globe, Phone, Mail, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { TackleShop } from '../types/schema';

const allDistricts = [
  'Cumbria', 'Dumfries & Galloway', 'Yorkshire', 'Hampshire', 'Kent', 'Essex', 'Sussex', 'Dorset',
  'Wiltshire', 'Devon', 'Cornwall', 'Norfolk', 'Suffolk', 'Lancashire', 'Cheshire', 'Wales'
];

const TackleShops: React.FC = () => {
  const [shops, setShops] = useState<TackleShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tackle_shops')
        .select('*')
        .order('name');
      if (error) {
        setError('Failed to load tackle shops');
        setShops([]);
      } else {
        setShops(data || []);
      }
      setLoading(false);
    };
    fetchShops();
  }, []);

  // Enhanced filtering logic: search bar matches District too!
  const filteredShops = shops.filter(shop => {
    const matchesSearch =
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shop.District && shop.District.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDistrict =
      !selectedDistrict || shop.District === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

return (
  <div className="min-h-screen pb-16 bg-gray-50"> 
    {/* Hero Section */}
    <div className="relative w-full h-56 md:h-[380px] lg:h-[500px] mb-12">
      <div className="absolute inset-0">
        <img
          src="https://www.hackett-lakes.co.uk/wp-content/uploads/Banner4.jpg"
          alt="Tackle Shop Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          className="text-3xl sm:text-5xl md:text-7xl font-bebas font-bold text-white drop-shadow-lg mb-3 mt-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} 
        >
          Tackle Shops Directory
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg md:text-2xl text-white drop-shadow-md max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Find your local fishing tackle shop and get equipped for your next adventure
        </motion.p>
      </div>
    </div>

      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tackle shops by name, location, or district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          {/* District Dropdown */}
          <div className="w-full md:w-64">
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
            >
              <option value="">All Districts</option>
              {allDistricts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Shops Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tackle shops...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filteredShops.map((shop) => (
              <motion.div
                key={shop.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={shop.image || 'https://images.pexels.com/photos/2846815/pexels-photo-2846815.jpeg'}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  /> 
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-primary-600 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p>{shop.address}</p>
                        <p>{shop.postcode}</p>
                        <p className="text-xs text-primary-800">{shop.District}</p>
                      </div>
                    </div>
                    {shop.phone && (
                      <p className="flex items-center">
                        <Phone className="h-5 w-5 text-primary-600 mr-2" />
                        {shop.phone}
                      </p>
                    )}
                    {shop.email && (
                      <p className="flex items-center">
                        <Mail className="h-5 w-5 text-primary-600 mr-2" />
                        {shop.email}
                      </p>
                    )}
                  </div>
                  {shop.brands && shop.brands.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Popular Brands:</h4>
                      <div className="flex flex-wrap gap-2">
                        {shop.brands.slice(0, 3).map((brand, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                          >
                            {brand}
                          </span>
                        ))}
                        {shop.brands.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            +{shop.brands.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {shop.website && (
                    <a
                      href={shop.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-800"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Visit Website
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && filteredShops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No tackle shops found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TackleShops;
