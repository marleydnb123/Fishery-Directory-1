import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Star, Users, TrendingUp, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ListYourFishery: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Featured fisheries state
  const [featuredFisheries, setFeaturedFisheries] = useState<any[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  // Fetch featured fisheries
  useEffect(() => {
    const fetchFeaturedFisheries = async () => {
      try {
        const { data, error } = await supabase
          .from('fisheries')
          .select('*')
          .eq('isfeatured', true)
          .limit(3);

        if (error) throw error;
        setFeaturedFisheries(data || []);
      } catch (err: any) {
        setFeaturedError('Failed to load featured fisheries');
        console.error('Error fetching featured fisheries:', err);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedFisheries();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: subError } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);

      if (subError) throw subError;
      setSubscribed(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            className="text-4xl md:text-6xl lg:text-6xl font-bebas font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get Your Fishery Seen by Thousands of UK Anglers Every Month
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200 mb-4 max-w-3xl mx-auto"
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

     {/* Advertising Packages Section */}
<section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-50">
  <div className="container mx-auto">
    <motion.h2
      className="text-4xl md:text-5xl font-bebas font-bold text-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      Advertising Packages
    </motion.h2>
    <motion.p
      className="text-center text-xl text-gray-600 mb-16 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      With hundreds of thousands of visits from an engaged audience of committed anglers, as well as one of the UK's largest databases of fishing venues, we can promote your venue or business and generate clicks, calls, bookings and revenue so your business grows and becomes more profitable.
    </motion.p>
    
    {/* Fisheries and Fishing Holiday Venues */} 
    <motion.div
      className="flex flex-col lg:flex-row items-center gap-12 mb-8"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="lg:w-1/2">
        <img
          src="https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg"
          alt="Fishery with anglers"
          className="w-full h-96 object-cover rounded-2xl shadow-xl"
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h3 className="text-3xl md:text-4xl font-bebas font-bold text-gray-900">
          Fisheries & Fishing Holiday Venues
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          With hundreds of thousands of visits from an engaged audience of committed anglers, and one of the largest databases of angling venues in the UK, we'll make sure your venue gets seen. Our packages deliver visibility, clicks, calls, and bookings, which ultimately results in more anglers visiting your venue, adding revenue so your business grows and becomes more profitable.
        </p>
        <p className="text-lg text-gray-800 font-semibold">
          If you own a fishery or fishing holiday venue and would like more day tickets and holiday bookings, then get in touch today.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-customBlue hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
        >
          Promote Your Venue
        </Link>
      </div>
    </motion.div>

    {/* Sponsorship and Advertising - Reversed */}
    <motion.div
      className="flex flex-col lg:flex-row-reverse items-center gap-12 mb-20"
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="lg:w-1/2">
        <img
          src="https://images.pexels.com/photos/5582871/pexels-photo-5582871.jpeg"
          alt="Business meeting and marketing"
          className="w-full h-96 object-cover rounded-2xl shadow-xl"
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h3 className="text-3xl md:text-4xl font-bebas font-bold text-gray-900">
          Sponsorship & Advertising
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          If you have a business that would benefit from connecting with our audiences, we have a number of flexible sponsorship packages that can help. From low-cost banner advertising to content sponsorship, email marketing and social media.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          As well as a large angling audience, we also have one of the biggest databases of angling venues and owners in the UK. Whether you are a start up or large corporate, we've got a flexible advertising plan that will work for you.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-customBlue hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
        >
          Explore Sponsorship
        </Link>
      </div>
    </motion.div>

    {/* Looking to Sell */}
    <motion.div
      className="flex flex-col lg:flex-row items-center gap-12"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="lg:w-1/2">
        <img
          src="https://images.pexels.com/photos/259804/pexels-photo-259804.jpeg"
          alt="Property for sale with water"
          className="w-full h-96 object-cover rounded-2xl shadow-xl"
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h3 className="text-3xl md:text-4xl font-bebas font-bold text-gray-900">
          Looking to Sell Your Fishing Venue?
        </h3>
        <p className="text-lg text-gray-600 leading-relaxed">
          If you have a commercial fishery, a fishing lake, stretch of river or land with fishing potential that you want to sell then we can help. Equally, if you own a property with water and potential fishing, and you're looking to sell, please get in touch.
        </p>
        <p className="text-lg text-gray-600 leading-relaxed">
          We're not estate agents but we work closely with our partners who are. We'll also advertise your property on our website, putting your venue in front of hundreds of thousands of anglers in the UK.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-customBlue hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
        >
          List Your Property
        </Link>
      </div>
    </motion.div>
  </div>
</section>

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

      {/* Featured Fisheries Section */}
      <section className="py-6 bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="container mx-auto shadow-lg rounded-xl overflow-hidden">
          {/* Header Bar */}
          <div
            className="p-6"
            style={{
              background:
                "linear-gradient(90deg, #1e293b 0%, #334155 60%, #64748b 100%)"
            }}
          >
            <motion.h2
              className="text-4xl font-bebas font-bold text-white mb-1 text-center" 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Featured Fisheries
            </motion.h2>
            <motion.p
              className="text-gray-200 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Explore our handpicked selection of the finest fishing spots across the UK
            </motion.p>
          </div>
          {/* Cards Grid */}
          <div className="p-6 bg-gray-50">
            {featuredLoading ? (
              <div className="text-center py-8 text-gray-600">Loading featured fisheries...</div>
            ) : featuredError ? (
              <div className="text-center py-8 text-red-600">{featuredError}</div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {featuredFisheries.length > 0 ? (
                  featuredFisheries.map((f) => (
                    <motion.div
                      key={f.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <Link to={`/directory/${f.slug}`}>
                        <img
                          src={f.image || "https://www.welhamlake.co.uk/wp-content/uploads/2016/12/yorkshire-carp-fishing.jpg"} 
                          alt={f.name}
                          className="w-full h-40 object-cover transition-transform duration-200 hover:scale-[1.02]"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900">{f.name}</h3>
                          <div className="text-sm text-customBlue">{f.district}</div>
                          <div className="text-gray-600 text-xs mt-2 line-clamp-2">{f.description}</div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-3 text-center text-gray-500">
                    No featured fisheries found.
                  </div>
                )}
              </motion.div>
            )}
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

      {/* Sample Listing Preview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bebas font-bold text-center mb-12">
            Fisheries & Fishing Holiday Venues
          </h2>
          <div className="text-center text-xl text-gray-600 mb-12 max-w-4xl mx-auto">
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
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <img
              src="https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg"
              alt="Sample listing preview"
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bebas font-bold text-center mb-12">
            Sponsorship & Business Advertising
          </h2>
          <div className="text-center text-xl text-gray-600 mb-8 max-w-6xl mx-auto">
            <p className="mb-4">
              If your business supplies the angling world — tackle, bait, gear, services or destinations — we offer a range of flexible sponsorship and advertising options to suit all budgets.
            </p>
            <p className="mb-4">
              From banner ads and newsletter placements to featured articles and social content, we can help amplify your message to tens of thousands of active anglers each month.
            </p>
            <p>
              Our audience includes end customers and trade buyers — and our business listings, content sponsorships, and database access put your brand in front of exactly the right people.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-customBlue rounded-full flex items-center justify-center text-white font-bold mr-4">
                  BM
                </div>
                <div>
                  <h4 className="font-bold">Bill Matthews</h4>
                  <p className="text-sm text-gray-600">Nine Oaks Fishery</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Since listing with TackleFlow, we've seen a 40% increase in bookings. The platform is easy to use and the support team is fantastic."
              </p>
              <div className="text-yellow-400 mt-4">★★★★★</div>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-customBlue rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SH
                </div>
                <div>
                  <h4 className="font-bold">Sarah Hughes</h4>
                  <p className="text-sm text-gray-600">Lakeside Fishery</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The featured listing has been a game-changer for us. We're reaching more anglers than ever before."
              </p>
              <div className="text-yellow-400 mt-4">★★★★★</div>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-customBlue rounded-full flex items-center justify-center text-white font-bold mr-4">
                  JT
                </div>
                <div>
                  <h4 className="font-bold">John Thompson</h4>
                  <p className="text-sm text-gray-600">Willow Lakes</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Professional platform that really understands what fishery owners need. Great value for money."
              </p>
              <div className="text-yellow-400 mt-4">★★★★★</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
<section className="relative py-20 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100 overflow-hidden">
  {/* Background Elements */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-20 left-1/4 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute bottom-32 right-1/3 w-32 h-32 bg-indigo-400 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
  </div>

  <div className="container mx-auto max-w-4xl relative z-10">
    {/* Section Header */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        Got Questions? We've Got Answers
      </div>
      
      <h2 className="text-5xl md:text-6xl font-bebas font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-800 bg-clip-text text-transparent">
        Frequently Asked Questions
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Everything you need to know about listing your fishery and reaching the right buyers
      </p>
    </div>

    {/* FAQ Grid */}
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {/* FAQ Item 1 */}
      <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors">
              How do I update my listing?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Access your personalized dashboard anytime to make instant updates. Changes go live within minutes, and you'll receive confirmation notifications for all modifications.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Item 2 */}
      <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-teal-600 transition-colors">
              Can I list multiple properties?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Absolutely! Manage multiple fisheries, lakes, and river stretches from one account. Each property gets its own detailed profile with unique features and pricing.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Item 3 */}
      <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-purple-600 transition-colors">
              What photos work best?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              High-resolution images of your waters, facilities, and surrounding areas perform best. Our marketing team provides free photo guidelines and can recommend professional photographers if needed.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Item 4 */}
      <div className="group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-emerald-600 transition-colors">
              How quickly can I go live?
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Basic listings launch within 24 hours. Premium packages with professional optimization and enhanced marketing features typically take 2-3 days for the complete setup process.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Additional FAQ Items - Expandable */}
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/50">
      <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">More Questions?</h3>
      
      <div className="grid md:grid-cols-2 gap-6 text-sm">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-slate-900">What's included in Premium listings?</p>
              <p className="text-slate-600">Enhanced photos, priority placement, social media promotion, and dedicated support.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-slate-900">Do you handle viewings?</p>
              <p className="text-slate-600">We connect serious buyers with you directly. You maintain full control over all interactions.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-slate-900">What are your success rates?</p>
              <p className="text-slate-600">85% of our Premium listings receive qualified inquiries within 30 days.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="font-semibold text-slate-900">Can I pause my listing?</p>
              <p className="text-slate-600">Yes, temporarily pause or reactivate your listing anytime through your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Contact CTA */}
    <div className="text-center mt-12">
      <p className="text-lg text-slate-600 mb-6">Still have questions? Our team is here to help.</p>
      <Link
        to="/contact"
        className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Get Expert Help
      </Link>
    </div>
  </div>
</section>

       {/* Newsletter Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bebas font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter for the latest updates and fishery management tips
          </p>
          
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customBlue"
                required
              />
            </div>
            
            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}
            
            {subscribed ? (
              <div className="flex items-center justify-center text-green-600">
                <Check className="h-5 w-5 mr-2" />
                Thanks for subscribing!
              </div>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-customBlue hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            )}
          </form>
        </div>
      </section>
      
      {/* Enhanced CTA Section */}
<section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 overflow-hidden">
  {/* Background Elements */}
  <div className="absolute inset-0 opacity-5">
    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
    <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-400 rounded-full blur-3xl"></div>
    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-400 rounded-full blur-2xl"></div>
  </div>
  
  <div className="container mx-auto text-center relative z-10">
    {/* Badge */}
    <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200">
      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      Trusted by UK's Leading Angling Community
    </div>

    {/* Main Heading */}
    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bebas font-bold mb-8 bg-gradient-to-r from-slate-800 via-blue-900 to-teal-800 bg-clip-text text-transparent leading-tight">
      Ready to Sell Your 
      <span className="block text-blue-600">Fishery or Lake?</span>
    </h2>

    {/* Enhanced Description */}
    <div className="max-w-4xl mx-auto mb-12">
      <p className="text-xl md:text-2xl text-slate-700 mb-6 leading-relaxed font-light">
        Whether you own a <strong className="text-slate-900">fishery, lake, river stretch</strong>, or land with fishing rights — we connect you with serious buyers.
      </p>
      
      {/* Key Benefits Grid */}
      <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-slate-900 mb-2">Massive Reach</h3>
          <p className="text-slate-600">Access to thousands of qualified buyers actively searching for angling properties</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-slate-900 mb-2">Expert Network</h3>
          <p className="text-slate-600">Connected with trusted rural property specialists who understand angling assets</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-slate-900 mb-2">Targeted Marketing</h3>
          <p className="text-slate-600">Your property reaches fishing-focused investors and venue owners specifically</p>
        </div>
      </div>
    </div>

    {/* CTA Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <Link
        to="/contact"
        className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold px-10 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
      >
        List Your Fishery Now
        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
      
      <Link
        to="/how-it-works"
        className="inline-flex items-center text-slate-700 hover:text-blue-600 text-lg font-medium px-6 py-4 rounded-xl border-2 border-slate-200 hover:border-blue-300 bg-white/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        How It Works
      </Link>
    </div>

    {/* Trust Indicators */}
    <div className="mt-12 pt-8 border-t border-slate-200">
      <p className="text-sm text-slate-500 mb-4">Trusted by property owners across the UK</p>
      <div className="flex justify-center items-center space-x-8 opacity-60">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Active Listings</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Qualified Buyers</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-sm text-slate-600">Expert Support</span>
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
};

export default ListYourFishery;