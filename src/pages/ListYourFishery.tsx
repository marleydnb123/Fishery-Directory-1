import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Fishery } from '../types/schema';
import FisheryCard from '../components/common/FisheryCard';

const ListYourFishery: React.FC = () => {
  const [featuredFisheries, setFeaturedFisheries] = useState<Fishery[]>([]);
  const [loadingFisheries, setLoadingFisheries] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedFisheries = async () => {
      setLoadingFisheries(true);
      setFetchError(null);
      const { data, error } = await supabase
        .from('fisheries')
        .select('*')
        .eq('isfeatured', true)
        .limit(3);

      if (error) {
        setFetchError('Failed to load featured fisheries.');
        setFeaturedFisheries([]);
      } else if (data) {
        setFeaturedFisheries(
          data.map((f: any) => ({
            ...f,
            isFeatured: f.isfeatured,
            hasAccommodation: f.hasaccommodation,
            species: Array.isArray(f.species) ? f.species : [],
          }))
        );
      }
      setLoadingFisheries(false);
    };

    fetchFeaturedFisheries();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg')`,
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bebas font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get Your Fishery Seen by Thousands of UK Anglers Every Month
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join our network, increase bookings, and boost visibility with one simple listing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/contact"
              className="inline-block bg-customBlue hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              List My Fishery
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="w-12 h-12 text-customBlue mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">150K+</h3>
              <p className="text-gray-600">Monthly Visitors</p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <TrendingUp className="w-12 h-12 text-customBlue mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Active Venues</p>
            </motion.div>
            <motion.div
              className="bg-white p-8 rounded-xl shadow-lg text-center"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Star className="w-12 h-12 text-customBlue mx-auto mb-4" />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="text-gray-600">Years Experience</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bebas font-bold text-center mb-12">
            Advertising Packages
          </h2>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
            With hundreds of thousands of visits from a highly engaged angling audience each month, and one of the UK's largest directories of fisheries, we help you reach more anglers, generate more enquiries, and grow your business — simply and affordably.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <div className="text-4xl font-bold mb-6">£0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Basic directory listing
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Appear in search results
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Add contact details
                </li>
              </ul>
              <Link
                to="/contact"
                className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
            {/* Featured Plan */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8 border-2 border-customBlue relative"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="absolute top-4 right-4 bg-customBlue text-white text-xs px-2 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4">Featured</h3>
              <div className="text-4xl font-bold mb-6">£15<span className="text-lg font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Priority placement
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Appear on homepage
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Add images & videos
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Highlighted in search
                </li>
              </ul>
              <Link
                to="/contact"
                className="block text-center bg-customBlue hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Get Featured
              </Link>
            </motion.div>
            {/* Premium Plan */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-8"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4">Premium</h3>
              <div className="text-4xl font-bold mb-6">£99<span className="text-lg font-normal">/yr</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  All Featured benefits
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Social media promotion
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Analytics & insights
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  Direct booking link
                </li>
              </ul>
              <Link
                to="/contact"
                className="block text-center bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Go Premium
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Fisheries Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bebas font-bold text-center mb-12">
            Fisheries & Fishing Holiday Venues
          </h2>
          <div className="text-center text-xl text-gray-600 mb-16 max-w-4xl mx-auto">
            <p className="mb-4">
              If you own a fishery or fishing holiday venue and want to attract more anglers, we're here to help.
            </p>
            <p className="mb-4">
              Our audience includes match anglers, specimen hunters, pleasure fishers, and families looking for fishing breaks — and our platform connects them directly with venues like yours.
            </p>
            <p>
              We offer affordable advertising packages that put your venue in front of the right people, helping drive calls, bookings and visits. Whether you're a local day ticket water or a holiday destination with lodges and pods, we'll get you noticed.
            </p>
          </div>
          {/* Example Fishery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loadingFisheries ? (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading featured fisheries...</p>
              </div>
            ) : fetchError ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-red-600">{fetchError}</p>
              </div>
            ) : featuredFisheries.length > 0 ? (
              featuredFisheries.map((fishery) => (
                <motion.div
                  key={fishery.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <FisheryCard fishery={fishery} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-600">No featured fisheries available.</p>
              </div>
            )}
          </div>
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold mb-4">Overview</h3>
              <ul className="space-y-2">
                <li>✓ Detailed venue description</li>
                <li>✓ Photo gallery</li>
                <li>✓ Available species</li>
                <li>✓ Facilities list</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>✓ Interactive map</li>
                <li>✓ Booking information</li>
                <li>✓ Rules & regulations</li>
                <li>✓ Contact details</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListYourFishery;
