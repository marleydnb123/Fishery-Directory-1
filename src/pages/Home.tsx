import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Map, Calendar, Fish } from 'lucide-react';
import FisheryCard from '../components/common/FisheryCard';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase'; // Make sure this path is correct!
import { Fishery } from '../types/schema'; // Adjust import if needed

const heroImages = [
  "https://www.wokinghamcountryside.co.uk/sites/countryside/files/styles/scale_crop_7_3_large/public/2024-05/sunset%2C%20black.jpg?itok=OMc703vu",
  "https://www.fishermanholidays.com/images-waters/jonchery/catches/_1600x980_crop_center-center_80_line/109390/20231022_1851176545bfb5e07082.50810937.jpeg",
  "https://dreamcarpholidays.com/wp-content/uploads/2024/01/IMG-20240104-WA0062-722x488.jpg",
  "https://notch.io/cdn/shop/collections/FISHING_1600x.png?v=1595694362"
  // Add more image URLs as needed
];

const Home: React.FC = () => {
  const [featuredFisheries, setFeaturedFisheries] = useState<Fishery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fishery_of_the_week, setFisheryOfTheWeek] = useState(null);
  const [loading_fotw, setLoadingFOTW] = useState(false);
  const [error_fotw, setErrorFOTW] = useState(null);


  // Hero slideshow state
  const [currentHero, setCurrentHero] = useState(0);
  const [prevHero, setPrevHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevHero(currentHero);
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, [currentHero]);

  // Fetch featured fisheries from Supabase
  useEffect(() => { 
    const fetchFeatured = async () => { 
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('fisheries')
        .select('*')
        .eq('isfeatured', true)
        .limit(6); // Limit to 6 for the homepage
      if (error) {
        setError('Failed to load featured fisheries.');
        setFeaturedFisheries([]);
      } else {
        setFeaturedFisheries(
          (data || []).map((f: any) => ({
            ...f,
            isFeatured: f.isfeatured,
            hasAccommodation: f.hasaccommodation,
            species: Array.isArray(f.species) ? f.species : [],
          }))
        );
      }
      setLoading(false);
    };
    fetchFeatured();
  }, []);

   useEffect(() => {
  const fetch_fishery_of_the_week = async () => {
    setLoadingFOTW(true);
    setErrorFOTW(null);
    const { data, error } = await supabase
      .from('fisheries')
      .select('*')
      .eq('fishery_of_the_week', true)
      .single();
    if (error) {
      setErrorFOTW('Failed to load fishery of the week.');
      setFisheryOfTheWeek(null);
    } else {
      setFisheryOfTheWeek(data);
    }
    setLoadingFOTW(false);
  };
  fetch_fishery_of_the_week();
}, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return ( 
    <div className="min-h-screen">
      {/* Hero Section */}
<section className="h-screen relative flex items-center justify-center bg-black overflow-hidden">
  {/* Previous image fades out */}
  <motion.div
    key={prevHero}
    className="absolute inset-0 w-full h-full bg-cover bg-center"
    style={{
      backgroundImage: `url(${heroImages[prevHero]})`,
    }}
    initial={{ opacity: 1, scale: 1 }}
    animate={{ opacity: 0, scale: 1.06 }}
    transition={{ duration: 1.1, ease: "easeInOut" }}
  />
  {/* Current image fades in */}
  <motion.div
    key={currentHero}
    className="absolute inset-0 w-full h-full bg-cover bg-center"
    style={{
      backgroundImage: `url(${heroImages[currentHero]})`,
    }}
    initial={{ opacity: 0, scale: 1 }}
    animate={{ opacity: 1, scale: 1.06 }}
    transition={{ duration: 1.1, ease: "easeInOut" }}
  />
  {/* Frosted glass wrapper for ALL hero content */}
  <div className="relative z-10 flex justify-center w-full">
    <div className="backdrop-blur-sm bg-black/10 rounded-xl px-8 py-8 w-full max-w-6xl mx-4 text-center">
      <motion.h1 
        className="text-5xl md:text-6xl lg:text-8xl font-bebas font-bold text-white mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      > 
        Find the Best Coarse, Carp & Match Fishing Lakes in the UK 
      </motion.h1>
      <motion.p 
        className="text-xl md:text-4xl font-bebas font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Explore verified UK fishing lakes with detailed info on facilities, species, tactics & more.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <Button 
          to="/directory" 
          variant="primary" 
          size="lg"
        >
          Explore Fisheries
        </Button> 
      </motion.div>
    </div>
  </div> 
</section>



      {/* Featured Fisheries Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <motion.h2 
            className="text-6xl font-bebas font-bold text-gray-900 mb-2 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Featured Fisheries
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Explore our handpicked selection of the finest fishing spots across the UK
          </motion.p>
          
          {loading ? (
            <div className="text-center py-12 text-gray-600">Loading featured fisheries...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredFisheries.length > 0 ? (
                featuredFisheries.map((fishery) => (
                  <motion.div key={fishery.id} variants={itemVariants}>
                    <FisheryCard fishery={fishery} />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No featured fisheries found.
                </div>
              )}
            </motion.div>
          )}

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Button to="/directory" variant="outline">
              View All Fisheries
            </Button>
          </motion.div>
        </div>
      </section>

{/* ===================== Weekly Highlights Section ===================== */}
<section className="py-20 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
  <div className="container mx-auto max-w-6xl">
    {/* Section Title */}
    <h2 className="text-6xl font-bebas font-bold text-gray-900 mb-12 text-center">
      Weekly Highlights
    </h2>
    {/* Two-column layout */}
    <div className="flex flex-col md:flex-row items-stretch justify-center gap-12"> 
      
      {/* === Fishery of the Week Card === */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-3xl font-bebas font-bold text-gray-900 mb-4 text-center tracking-wide">
          Fishery of the Week
        </h3>
        <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl p-8 w-full min-w-[600px] max-w-[600px] min-h-[500px] max-h-[500px] flex flex-col justify-between transition-transform hover:scale-[1.025] hover:shadow-blue-200/40">
          {loading_fotw ? (
            <div className="text-gray-500 py-16 text-center">Loading...</div>
          ) : error_fotw ? (
            <div className="text-red-500 py-16 text-center">{error_fotw}</div>
          ) : fishery_of_the_week ? (
            <FisheryCard fishery={fishery_of_the_week} />
          ) : (
            <div className="text-gray-500 py-16 text-center">No fishery of the week available.</div>
          )} 
        </div>
      </div>

      {/* === Vertical Blue Divider === */}
      <div className="hidden md:flex items-center px-0">
        <div className="w-px bg-blue-700/30 rounded-full mx-auto" style={{ minHeight: '420px' }}></div>
      </div>
      
      {/* === Catch of the Week Card === */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-3xl font-bebas font-bold text-gray-900 mb-4 text-center tracking-wide">
          Catch of the Week
        </h3>
        <div className="relative bg-gradient-to-br from-blue-100 via-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl p-8 w-full min-w-[600px] max-w-[600px] min-h-[500px] max-h-[500px] flex flex-col justify-between transition-transform hover:scale-[1.025] hover:shadow-blue-200/40">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ934kToXbU3zHZE5ye6a2MH2pN8rMI2se-hA&s"
            alt="Angler with a 34lb Mirror Carp"
            className="w-full h-64 object-cover rounded-2xl mb-6 border border-blue-200 shadow"
          />
          <div>
            <p className="text-xl font-semibold text-blue-900 mb-2 text-center">
              34lb Mirror Carp
            </p>
            <p className="text-gray-700 mb-3 text-center">
              Landed after a thrilling 20-minute battle on the float, this stunning mirror carp is a testament to both patience and skill.
            </p>
            <p className="text-blue-800 text-sm text-center bg-blue-100 rounded px-3 py-1 inline-block"> 
              <span className="font-semibold">Caught at:</span> Willow Lake Carp Fishery
            </p>
          </div>
        </div>
      </div>
    </div>
  </div> 
</section>
{/* ================== End Weekly Highlights Section ================== */}





{/* How It Works Section */}
<section className="py-20 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
  <div className="container mx-auto">
    <motion.h2 
      className="text-6xl font-bebas font-bold text-gray-900 mb-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      How It Works
    </motion.h2>
    <motion.p 
      className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      Find your perfect fishing spot in three simple steps - no bookings through our site, yet.
    </motion.p>
    
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { transition: { staggerChildren: 0.15 } }
      }}
    >
      {/* Search Card */}
      <motion.div 
        className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-t-4 border-blue-400"
        whileHover={{ scale: 1.03 }}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-5 shadow">
          <Search className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">Search</h3>
        <p className="text-gray-600 text-center">
          Browse our directory or use search filters to discover the best fisheries across the UK.
        </p>
      </motion.div>
      
      {/* Explore Card */}
      <motion.div 
        className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-t-4 border-green-400"
        whileHover={{ scale: 1.03 }}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow">
          <Map className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">Explore</h3>
        <p className="text-gray-600 text-center">
          View detailed info for each fishery including species, facilities, rules, and more.
        </p>
      </motion.div>
      
      {/* Book Card */}
      <motion.div 
        className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow border-t-4 border-yellow-400"
        whileHover={{ scale: 1.03 }}
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      >
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-5 shadow">
          <Calendar className="h-8 w-8 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900">Book</h3>
        <p className="text-gray-600 text-center">
          Click through to the fishery’s official website to book your session or accommodation directly.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>

      {/* --- List Your Fishery Section --- */}
<section className="py-24 px-4 bg-gradient-to-br from-blue-100 via-white to-green-100">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-6xl max-w-7xl font-bebas font-bold text-gray-900 mb-2 text-center tracking-tight drop-shadow-lg animate-fade-in">
      List Your Fishery
    </h2>
    <p className="text-xl text-center text-gray-600 mb-14 max-w-5xl mx-auto animate-fade-in delay-100">
      Reach thousands of anglers every month. Choose the perfect plan and get your fishery in front of the UK’s most passionate fishing community.
    </p>

    {/* Pricing Table */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Free Listing */}
      <div className="relative bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-blue-100 hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-out animate-fade-in delay-150">
        <span className="absolute top-4 right-4 text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded uppercase tracking-wider font-semibold">Most Popular</span>
        <span className="text-2xl font-bold text-blue-600 mb-2">Free</span>
        <div className="text-4xl font-extrabold mb-3 text-blue-900">£0</div>
        <ul className="text-blue-800 text-base mb-6 space-y-2">
          <li>✔ Basic directory listing</li>
          <li>✔ Appear in search results</li>
          <li>✔ Add contact details</li>
        </ul>
        <a
          href="/contact"
          className="mt-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200"
        >
          List for Free
        </a>
      </div>
      {/* Featured Listing */}
      <div className="relative bg-gradient-to-br from-yellow-100 via-white to-yellow-50 rounded-2xl shadow-2xl p-8 flex flex-col items-center border-2 border-yellow-300 hover:scale-110 hover:shadow-yellow-400/40 transition-transform duration-300 ease-out animate-fade-in delay-200">
        <span className="absolute top-4 right-4 text-xs bg-yellow-200 text-yellow-900 px-2 py-1 rounded uppercase tracking-wider font-semibold">Featured</span>
        <span className="text-2xl font-bold text-yellow-700 mb-2">Featured</span>
        <div className="text-4xl font-extrabold mb-3 text-yellow-900">£15<span className="text-base font-normal">/mo</span></div>
        <ul className="text-yellow-900 text-base mb-6 space-y-2">
          <li>✔ Priority placement</li>
          <li>✔ Appear on homepage</li>
          <li>✔ Add images, videos & links</li>
          <li>✔ Highlighted in search</li>
        </ul>
        <a
          href="/contact"
          className="mt-auto bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200"
        >
          Get Featured
        </a>
      </div>
      {/* Premium Listing */}
      <div className="relative bg-gradient-to-br from-green-100 via-white to-green-50 rounded-2xl shadow-xl p-8 flex flex-col items-center border-2 border-green-300 hover:scale-105 hover:shadow-green-400/40 transition-transform duration-300 ease-out animate-fade-in delay-300">
        <span className="absolute top-4 right-4 text-xs bg-green-200 text-green-900 px-2 py-1 rounded uppercase tracking-wider font-semibold">Best Value</span>
        <span className="text-2xl font-bold text-green-700 mb-2">Premium</span>
        <div className="text-4xl font-extrabold mb-3 text-green-900">£99<span className="text-base font-normal">/yr</span></div>
        <ul className="text-green-900 text-base mb-6 space-y-2">
          <li>✔ All Featured benefits</li>
          <li>✔ Social media promotion</li>
          <li>✔ Analytics & insights</li>
          <li>✔ Direct booking link</li>
        </ul>
        <a
          href="/list-your-fishery?premium=true"
          className="mt-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition-all duration-200"
        >
          Go Premium
        </a>
      </div>
    </div>

    <p className="text-gray-500 text-base text-center mt-12 animate-fade-in delay-500">
      Have questions? <a href="/contact" className="text-blue-700 underline hover:text-blue-900">Contact us</a> for more details about listing options.
    </p>
  </div>

  {/* Animations */}
  <style>
    {`
      @keyframes fade-in {
        from { opacity: 0; transform: translateY(40px);}
        to { opacity: 1; transform: translateY(0);}
      }
      .animate-fade-in { animation: fade-in 1s cubic-bezier(.4,0,.2,1) both; }
      .delay-100 { animation-delay: .1s; }
      .delay-150 { animation-delay: .15s; }
      .delay-200 { animation-delay: .2s; }
      .delay-300 { animation-delay: .3s; }
      .delay-500 { animation-delay: .5s; }
    `}
  </style>
</section>
{/* --- End List Your Fishery Section --- */}


{/* CTA Banner with Blurred Image Background */}
<section className="relative py-16 px-4 overflow-hidden">
  {/* Blurred Background Image */}
  <div
    className="absolute inset-0 w-full h-full z-0"
    style={{
      backgroundImage: `url('https://lh6.googleusercontent.com/proxy/8paZbP_RWtXlzdAxlCjT0GtctaarKhzu-8dDbT03aoDlXOuuTRhWujk7z-owHPF5zPxxtSWgWMklxKDXzBWv2xQi9fQ5PA')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(1px)',
      WebkitFilter: 'blur(1px)',
    }}
    aria-hidden="true"
  />
  {/* Overlay for extra contrast */}
  <div
    className="absolute inset-0 w-full h-full z-0"
    style={{
      background: 'rgba(16, 24, 39, 0.7)', // dark overlay, adjust as needed
      backdropFilter: 'blur(1px)',
      WebkitBackdropFilter: 'blur(1px)',
    }}
    aria-hidden="true"
  />



  
  {/* CTA Content */}
  <motion.div 
    className="relative z-10 container mx-auto text-center"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <div className="max-w-3xl mx-auto">
      <h2 className="text-6xl font-bebas font-bold text-white mb-4 drop-shadow-lg">
        Ready to Find Your Next Fishing Adventure?
      </h2>
      <p className="text-primary-100 mb-8 text-lg drop-shadow">
        Join thousands of anglers who have discovered their perfect fishing spot through TackleFlow.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button to="/directory" variant="primary" size="lg">
          Explore Fisheries
        </Button>
        <Button to="/contact" variant="outline" size="lg" className="border-white text-white hover:bg-primary-800">
          Contact Us
        </Button>
      </div>
    </div>
  </motion.div>
</section> 

    </div>
  );
};

export default Home;
