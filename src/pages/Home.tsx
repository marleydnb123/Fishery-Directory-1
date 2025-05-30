import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Map, Calendar, Fish } from 'lucide-react';
import FisheryCard from '../components/common/FisheryCard';
import AccommodationCard from '../components/common/AccommodationCard';
import Button from '../components/common/Button';
import { supabase } from '../lib/supabase'; // Make sure this path is correct!
import { Fishery, Accommodation } from '../types/schema';

const heroImages = [
  "https://www.wokinghamcountryside.co.uk/sites/countryside/files/styles/scale_crop_7_3_large/public/2024-05/sunset%2C%20black.jpg?itok=OMc703vu",
  "https://www.fishermanholidays.com/images-waters/jonchery/catches/_1600x980_crop_center-center_80_line/109390/20231022_1851176545bfb5e07082.50810937.jpeg",
  "https://eub5dofeuim.exactdn.com/wp-content/uploads/visvakantie/nederland/carp-lake-rosmalen/carp-lake-rosmalen-sfeerfoto-8.jpg?strip=all&lossy=1&quality=60&webp=65&sharp=1&ssl=1",
  "https://notch.io/cdn/shop/collections/FISHING_1600x.png?v=1595694362",
  "https://www.carpology.net/uploads/cms/blog/3241/5-image-main.jpg",
  "https://static.wixstatic.com/media/cc739e_696f733ac6a049babd9117b1375fd439~mv2.jpg/v1/fill/w_1189,h_797,al_c,q_85,enc_avif,quality_auto/cc739e_696f733ac6a049babd9117b1375fd439~mv2.jpg"
  // Add more image URLs as needed
];

const Home: React.FC = () => {
  const [featuredFisheries, setFeaturedFisheries] = useState<Fishery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fishery_of_the_week, setFisheryOfTheWeek] = useState(null);
  const [featuredAccommodations, setFeaturedAccommodations] = useState<Accommodation[]>([]);
  const [loadingAccommodations, setLoadingAccommodations] = useState(true);
  const [accommodationError, setAccommodationError] = useState<string | null>(null);
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

  // Fetch featured accommodations
  useEffect(() => {
    const fetchFeaturedAccommodations = async () => {
      setLoadingAccommodations(true);
      setAccommodationError(null);
      try {
        const { data: accommodations, error: accError } = await supabase
          .from('accommodation')
          .select('*, fishery:fisheries(name, district, slug, species, image)')
          .eq('featured', true)
          .limit(3);

        if (accError) throw accError;
        setFeaturedAccommodations(accommodations || []);
      } catch (err: any) {
        setAccommodationError(err.message);
      } finally {
        setLoadingAccommodations(false);
      }
    };
    fetchFeaturedAccommodations();
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
        Find the Best Coarse, Carp & Match Fisheries in the UK 
      </motion.h1>
      <motion.p 
        className="text-xl md:text-4xl font-bebas font-bold text-white mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Explore verified UK fisheries with detailed information on lakes, facilities, species, tactics & more.
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
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
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
      
      {/* Featured Accommodation Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="container mx-auto">
          <motion.h2 
            className="text-6xl font-bebas font-bold text-gray-900 mb-2 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Featured Accommodation
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Discover premium lakeside stays at our featured fishing destinations
          </motion.p>
          
          {loadingAccommodations ? (
            <div className="text-center py-12 text-gray-600">Loading featured accommodations...</div>
          ) : accommodationError ? (
            <div className="text-center py-12 text-red-600">{accommodationError}</div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredAccommodations.length > 0 ? (
                featuredAccommodations.map((accommodation) => (
                  <motion.div key={accommodation.id} variants={itemVariants}>
                    <AccommodationCard 
                      accommodation={accommodation}
                      fishery={accommodation.fishery}
                      hideSpecies={true}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center text-gray-500">
                  No featured accommodations found.
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
            <Button to="/accommodation" variant="outline">
              View All Accommodation
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
        <div className="
          relative bg-gradient-to-br from-blue-100 via-white to-blue-50 rounded-3xl shadow-2xl p-0
         w-full max-w-[95vw] min-h-[380px] max-h-[380px]
  md:min-w-[600px] md:max-w-[600px] md:min-h-[450px] md:max-h-[450px]
          flex flex-col transition-transform hover:scale-[1.025] hover:shadow-blue-200/40 overflow-hidden
        ">
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
        <div
          className="w-px bg-blue-700/30 rounded-full mx-auto mt-10"
          style={{ minHeight: '490px' }}
        ></div>
      </div>

      {/* === Catch of the Week Card === */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-3xl font-bebas font-bold text-gray-900 mb-4 text-center tracking-wide">
          Catch of the Week
        </h3>
        <div className="
          relative bg-gradient-to-br from-blue-100 via-white to-blue-50 border border-blue-200 rounded-3xl shadow-2xl p-0
          w-full max-w-[95vw] md:min-w-[600px] md:max-w-[600px] min-h-[450px] max-h-[450px]
          flex flex-col transition-transform hover:scale-[1.025] hover:shadow-blue-200/40 overflow-hidden
        ">
          {/* Card Figure/Image */}
        <div className="w-full h-40 md:h-64 overflow-hidden">
        <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ934kToXbU3zHZE5ye6a2MH2pN8rMI2se-hA&s"
        alt="Angler with a 34lb Mirror Carp"
        className="w-full h-full object-cover"
        />
        </div>

          {/* Card Body */}
          <div className="flex-1 flex flex-col justify-between p-4">
            <div>
              <h4 className="text-3xl font-bebas font-bold text-gray-900 mb-2 text-center">
                34lb Mirror Carp
              </h4>
              <p className="text-gray-700 mb-2 text-center">
                Taken confidently from the margins on a trimmed wafter, this solid mirror carp ran hard for the far shelf, putting every turn of pressure through the rod                     before finally slipping into the net after a well-managed, tactical battle.
              </p>
            </div>
            {/* Card Footer */}
            <div className="w-full text-center mt-2">
              <p className="text-blue-800 text-sm bg-blue-100 rounded px-3 py-1 inline-block">
                <span className="font-semibold">Caught at:</span> Willow Lake Carp Fishery
              </p>
            </div>
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
          Click through to the fishery's official website to book your session or accommodation directly.
        </p>
      </motion.div>
    </motion.div>
  </div>
</section>

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