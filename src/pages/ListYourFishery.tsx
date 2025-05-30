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
<section className="py-16 px-4 bg-white">
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
      className="text-center text-xl text-gray-600 mb-16 max-w-4xl mx-auto"
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
      <section className="py-12 bg-gradient-to-b from-blue-50 via-white to-blue-50">
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

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bebas font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">How do I update my listing?</h3>
              <p className="text-gray-700">
                You can update your listing anytime through your admin dashboard. Changes are usually live within minutes.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">Can I list multiple lakes?</h3>
              <p className="text-gray-700">
                Yes! You can add as many lakes as you have, each with their own details, species, and features.
              </p>
            </div> 
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">What photos should I include?</h3>
              <p className="text-gray-700">
                We recommend high-quality photos of your lakes, facilities, and surroundings. Our team can help with photo selection.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">How long does setup take?</h3>
              <p className="text-gray-700">
                Basic listings can be live within 24 hours. Featured and Premium listings typically take 2-3 days for optimal setup.
              </p>
            </div>
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
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bebas font-bold mb-6">
            Looking to Sell Your Fishery or Lake?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            If you're thinking of selling a fishery, lake, river stretch, or land with fishing rights — we can help.
            We're not estate agents, but we work closely with trusted rural property partners. And with one of the UK's largest databases of angling venue owners, holidaymakers, and investors, we can put your property in front of the right eyes.
            List your water with us and reach thousands of qualified, fishing-focused buyers actively searching for properties with angling potential.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-customBlue hover:bg-blue-700 text-white text-lg font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            List a Fishery for Sale
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ListYourFishery;