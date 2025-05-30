import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FisheryCard from '../components/common/FisheryCard';
import { FishSpecies, UKDistrict, Fishery } from '../types/schema';
import { supabase } from '../lib/supabase';

const Directory: React.FC = () => {
  const [fisheries, setFisheries] = useState<Fishery[]>([]);
  const [filteredFisheries, setFilteredFisheries] = useState<Fishery[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<UKDistrict | ''>('');
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | ''>('');
  const [featureSearchTerm, setFeatureSearchTerm] = useState('');
  const [accommodationOnly, setAccommodationOnly] = useState(false);
  const [nightFishingAllowed, setNightFishingAllowed] = useState(false);
  const [selectedFishingType, setSelectedFishingType] = useState('');
  const [matchFishingFriendly, setMatchFishingFriendly] = useState(false);
  const [disabledAccess, setDisabledAccess] = useState(false);
  const [facilities, setFacilities] = useState('');
  const [dogFriendly, setDogFriendly] = useState(false);
  const [priceRange, setPriceRange] = useState('');
  const [firePitsAllowed, setFirePitsAllowed] = useState(false);
  const [bookingType, setBookingType] = useState('');
  const [parkingClose, setParkingClose] = useState(false); 
  const [campingAllowed, setCampingAllowed] = useState(false);
  const [catchPhotos, setCatchPhotos] = useState(false); 
  const [wifiSignal, setWifiSignal] = useState('');
  const [baitBoats, setBaitBoats] = useState(false);
  const [magicTwig, setMagicTwig] = useState(false);
  const [tackleShop, settackleShop] = useState(false);
  const [privateHire, setprivateHire] = useState(false);
  const [tackleHire, settackleHire] = useState(false);
  const [coaching, setcoaching] = useState(false);
  const [keepnetsAllowed, setkeepnetsAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [carpOpen, setCarpOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const [coarseOpen, setCoarseOpen] = useState(false);

  // Available districts and species
  const districts: UKDistrict[] = [
    'Cumbria', 'Dumfries & Galloway', 'Yorkshire', 'Hampshire', 'Kent', 'Essex', 'Sussex', 'Dorset',
    'Wiltshire', 'Devon', 'Cornwall', 'Norfolk', 'Suffolk', 'Lancashire', 'Cheshire', 'Wales'
  ];
  const species: FishSpecies[] = [
    'Carp', 'Pike', 'Tench', 'Bream', 'Roach', 'Perch', 'Trout', 'Catfish', 'Eel', 'Barbel', 'Gudgeon'
  ];

  useEffect(() => {
    const fetchFisheries = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('fisheries') 
        .select('*'); 
      if (error) {
        setError(error.message);
        setFisheries([]);
      } else if (data) {
        setFisheries(
          data.map((f: any) => ({
            ...f,
            isFeatured: !!f.isfeatured,
            hasAccommodation: !!f.hasaccommodation,
            nightFishingAllowed: !!f.night_fishing_allowed,
            fishingType: Array.isArray(f.fishing_type) ? f.fishing_type : [],
            matchFishingFriendly: !!f.match_fishing_friendly,
            disabledAccess: !!f.disabled_access,
            facilities: Array.isArray(f.facilities) ? f.facilities : (f.facilities ? f.facilities.split(',') : []),
            dogFriendly: !!f.dog_friendly,
            priceRange: f.price_range,
            firePitsAllowed: !!f.fire_pits_allowed,
            bookingType: f.booking_type ? f.booking_type.toLowerCase() : '',
            parkingClose: !!f.parking_close,
            campingAllowed: !!f.camping_allowed,
            catchPhotos: !!f.catch_photos,
            wifiSignal: f.wifi_signal,
            district: f.district,
            species: Array.isArray(f.species) ? f.species : (f.species ? f.species.split(',') : []),
            features: Array.isArray(f.features) ? f.features : [],
            baitBoats: !!f.bait_boats,
            magicTwig: !!f.magic_twig,
            tackleShop: !!f.tackle_shop,
            privateHire: !!f.private_hire,
            tackleHire: !!f.tackle_hire,
            coaching: !!f.coaching,
            keepnetsAllowed: !!f.keepnets_allowed,
          }))
        );
      }
      setLoading(false);
    };
    fetchFisheries();
  }, []);

  useEffect(() => {
    let results = [...fisheries];
    if (searchTerm) {
      results = results.filter(fishery =>
        fishery.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fishery.district && fishery.district.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedDistrict) {
      results = results.filter(fishery =>
        fishery.district === selectedDistrict
      );
    }
    if (selectedSpecies) {
      results = results.filter(fishery =>
        Array.isArray(fishery.species) && fishery.species.includes(selectedSpecies)
      );
    }
    if (accommodationOnly) {
      results = results.filter(fishery => fishery.hasAccommodation);
    }
    if (featureSearchTerm) {
      results = results.filter(fishery =>
        Array.isArray(fishery.features) &&
        fishery.features.some(feature =>
          feature.toLowerCase().includes(featureSearchTerm.toLowerCase())
        )
      );
    }
    if (selectedFishingType) {
      results = results.filter(fishery =>
        Array.isArray(fishery.fishingType) && 
        fishery.fishingType.includes(selectedFishingType)
      ); 
    }
    if (matchFishingFriendly) {
      results = results.filter(fishery => fishery.matchFishingFriendly);
    }
    if (disabledAccess) {
      results = results.filter(fishery => fishery.disabledAccess);
    }
    if (facilities) {
      results = results.filter(fishery =>
        Array.isArray(fishery.facilities) &&
        fishery.facilities.some((facility: string) =>
          facility.toLowerCase().includes(facilities.toLowerCase())
        )
      ); 
    }
    if (dogFriendly) {
      results = results.filter(fishery => fishery.dogFriendly);
    }
    if (priceRange) {
      results = results.filter(fishery =>
        fishery.priceRange && fishery.priceRange.includes(priceRange)
      );
    }
    if (firePitsAllowed) {
      results = results.filter(fishery => fishery.firePitsAllowed);
    }
    if (bookingType) {
      results = results.filter(fishery =>
        fishery.bookingType && fishery.bookingType.toLowerCase() === bookingType
      );
    }
    if (parkingClose) {
      results = results.filter(fishery => fishery.parkingClose);
    }
    if (campingAllowed) {
      results = results.filter(fishery => fishery.campingAllowed);
    }
    if (catchPhotos) {
      results = results.filter(fishery => fishery.catchPhotos);
    }
    if (wifiSignal) {
      results = results.filter(fishery =>
        fishery.wifiSignal && fishery.wifiSignal.toLowerCase().includes(wifiSignal.toLowerCase())
      );
    }
    if (baitBoats) {
      results = results.filter(fishery => fishery.baitBoats);
    }
    if (magicTwig) {
      results = results.filter(fishery => fishery.magicTwig);
    }
    if (tackleShop) {
      results = results.filter(fishery => fishery.tackleShop);
    }
    if (privateHire) {
      results = results.filter(fishery => fishery.privateHire);
    }
    if (tackleHire) {
      results = results.filter(fishery => fishery.tackleHire);
    }
    if (coaching) {
      results = results.filter(fishery => fishery.coaching);
    }
    if (keepnetsAllowed) {
      results = results.filter(fishery => fishery.keepnetsAllowed);
    }
    setFilteredFisheries(results);
  }, [
    fisheries,
    searchTerm,
    selectedDistrict,
    selectedSpecies,
    accommodationOnly,
    featureSearchTerm,
    selectedFishingType,
    matchFishingFriendly,
    disabledAccess,
    facilities,
    dogFriendly,
    priceRange,
    firePitsAllowed,
    bookingType,
    parkingClose,
    campingAllowed,
    catchPhotos,
    wifiSignal,
    baitBoats,
    magicTwig,
    tackleShop,
    privateHire,
    tackleHire,
    coaching,
    keepnetsAllowed,
  ]);

  const handleFeatureSearch = (e: React.ChangeEvent<HTMLInputElement>) => setFeatureSearchTerm(e.target.value); 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  // Only show the first 4 featured fisheries
  const featuredFisheries = fisheries.filter(f => f.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 pb-16">
      {/* --- Image Banner Start --- */}
      <div className="relative w-full h-56 md:h-[380px] lg:h-[500px] mb-12">
        <img
          src="https://lh6.googleusercontent.com/proxy/8paZbP_RWtXlzdAxlCjT0GtctaarKhzu-8dDbT03aoDlXOuuTRhWujk7z-owHPF5zPxxtSWgWMklxKDXzBWv2xQi9fQ5PA"
          alt="Fishing lake banner"
          className="object-cover w-full h-full shadow-md"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center rounded-b-2xl px-4 md:px-12 lg:px-24">
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bebas font-bold text-white drop-shadow-lg mb-3 mt-16">
            Every Fishery That Matters - Right Here.
          </h2>
          <p className="text-base sm:text-lg md:text-2xl text-white drop-shadow-md max-w-2xl">
            Browse the best fisheries across the UK
          </p>
        </div>
      </div>
      {/* --- Image Banner End --- */}
            

      <div className="container mx-auto px-4 pb-8" style={{ marginTop: '3rem' }}>
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-6xl font-bebas font-bold text-gray-900 mb-2">
            Explore Fisheries
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect fishing spot from our collection of premium fisheries across the UK.
          </p>
        </motion.div>

{/* Main Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search fisheries by name, region, or species..."
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border-0 focus:ring-2 focus:ring-blue-400 text-gray-900 placeholder-gray-500 text-lg"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg">
                  Search
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-white font-medium">Quick filters:</span>
                <select 
                  value={selectedSpecies}
                  onChange={e => setSelectedSpecies(e.target.value)}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Species</option>
                  {species.map(specie => (
                    <option key={specie} value={specie} className="text-gray-900">{specie}</option>
                  ))}
                </select>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Regions</option>
                  {districts.map(district => (
                    <option key={district} value={district} className="text-gray-900">{district}</option>
                  ))}
                </select>
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Advanced Filters Panel */}
        {filtersOpen && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Column 1: Basic Filters */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Basic Options</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Fishing Type</label>
                    <select
                      value={selectedFishingType}
                      onChange={e => setSelectedFishingType(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      <option value="Carp">Carp Fishing</option>
                      <option value="Match">Match Fishing</option>
                      <option value="Coarse">Coarse Fishing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Booking Type</label>
                    <select
                      value={bookingType}
                      onChange={e => setBookingType(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    >
                      <option value="">All Booking Types</option>
                      <option value="booking required">Booking Required</option>
                      <option value="day tickets">Day Tickets Available</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range</label>
                    <input
                      type="text"
                      value={priceRange}
                      onChange={e => setPriceRange(e.target.value)}
                      placeholder="e.g. £10-£25"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Column 2: Features & Facilities */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Features & Facilities</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Water Features</label>
                    <input
                      type="text"
                      value={featureSearchTerm}
                      onChange={handleFeatureSearch}
                      placeholder="e.g. weed beds, lily pads, islands"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">On-site Facilities</label>
                    <input
                      type="text"
                      value={facilities}
                      onChange={e => setFacilities(e.target.value)}
                      placeholder="toilets, showers, café, shop..."
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Connectivity</label>
                    <input
                      type="text"
                      value={wifiSignal}
                      onChange={e => setWifiSignal(e.target.value)}
                      placeholder="WiFi, mobile signal, network provider"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Column 3: Specialized Options */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">Specialized Options</h4>

                {/* Carp Fishing Section */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                  <button
                    type="button"
                    onClick={() => setCarpOpen(!carpOpen)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h5 className="font-bold text-green-800">🎣 Carp Fishing</h5>
                    <ChevronDown className={`w-4 h-4 text-green-600 transition-transform ${carpOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {carpOpen && (
                    <div className="mt-4 space-y-3">
                      {[
                        { state: baitBoats, setter: setBaitBoats, label: "Bait Boats Allowed", id: "bait-boats" },
                        { state: magicTwig, setter: setMagicTwig, label: "Magic Twig Allowed", id: "magic-twig" },
                        { state: catchPhotos, setter: setCatchPhotos, label: "Catch Photography", id: "catch-photos" }
                      ].map(({ state, setter, label, id }) => (
                        <label key={id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state}
                            onChange={() => setter(!state)}
                            className="w-4 h-4 accent-green-600 rounded"
                          />
                          <span className="text-sm text-green-800 font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Match Fishing Section */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                  <button
                    type="button"
                    onClick={() => setMatchOpen(!matchOpen)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h5 className="font-bold text-blue-800">🏆 Match Fishing</h5>
                    <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${matchOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {matchOpen && (
                    <div className="mt-4 space-y-3">
                      {[
                        { state: matchFishingFriendly, setter: setMatchFishingFriendly, label: "Match Fishing Friendly", id: "match-friendly" },
                        { state: keepnetsAllowed, setter: setkeepnetsAllowed, label: "Keepnets Allowed", id: "keepnets" }
                      ].map(({ state, setter, label, id }) => (
                        <label key={id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state}
                            onChange={() => setter(!state)}
                            className="w-4 h-4 accent-blue-600 rounded"
                          />
                          <span className="text-sm text-blue-800 font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* General Amenities Section */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                  <button
                    type="button"
                    onClick={() => setCoarseOpen(!coarseOpen)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h5 className="font-bold text-purple-800">🏕️ Amenities</h5>
                    <ChevronDown className={`w-4 h-4 text-purple-600 transition-transform ${coarseOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {coarseOpen && (
                    <div className="mt-4 grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                      {[
                        { state: accommodationOnly, setter: setAccommodationOnly, label: "On-site Accommodation" },
                        { state: nightFishingAllowed, setter: setNightFishingAllowed, label: "Night Fishing" },
                        { state: disabledAccess, setter: setDisabledAccess, label: "Disabled Access" },
                        { state: dogFriendly, setter: setDogFriendly, label: "Dog Friendly" },
                        { state: firePitsAllowed, setter: setFirePitsAllowed, label: "Fire Pits Allowed" },
                        { state: parkingClose, setter: setParkingClose, label: "Close Parking" },
                        { state: campingAllowed, setter: setCampingAllowed, label: "Camping Allowed" },
                        { state: tackleShop, setter: settackleShop, label: "Tackle Shop" },
                        { state: privateHire, setter: setprivateHire, label: "Private Hire" },
                        { state: tackleHire, setter: settackleHire, label: "Tackle Hire" },
                        { state: coaching, setter: setcoaching, label: "Coaching Available" }
                      ].map(({ state, setter, label }, idx) => (
                        <label key={idx} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={state}
                            onChange={() => setter(!state)}
                            className="w-4 h-4 accent-purple-600 rounded"
                          />
                          <span className="text-sm text-purple-800 font-medium">{label}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setFiltersOpen(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-200">
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Fisheries</h2>
              <p className="text-gray-600">Showing {filteredFisheries.length} results</p>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400">
              <option>Sort by Relevance</option>
              <option>Sort by Price</option>
              <option>Sort by Rating</option>
              <option>Sort by Distance</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading fisheries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p className="text-xl font-semibold">{error}</p>
            </div>
          ) : filteredFisheries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFisheries.map((fishery) => (
                <FisheryCard key={fishery.id} fishery={fishery} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎣</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No fisheries found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms to find the perfect fishing spot.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecies('');
                  setSelectedDistrict('');
                  // Reset other filters as needed
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Featured Fisheries Section */}
        <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured Premium Fisheries
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12">
              Discover our handpicked selection of the finest fishing destinations across the UK, 
              chosen for their exceptional quality and angling experiences.
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-slate-300">Loading featured fisheries...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredFisheries.length > 0 ? (
                  featuredFisheries.map((fishery) => (
                    <div
                      key={fishery.id}
                      className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <img
                          src={fishery.image}
                          alt={fishery.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white mb-1">{fishery.name}</h3>
                          <div className="flex items-center gap-2 text-white/80">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{fishery.district}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-slate-300 text-sm mb-4 line-clamp-2">{fishery.description}</p>
                        <button className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-2 rounded-lg transition-colors">
                          Explore Fishery
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-slate-300">
                    <p className="text-lg">No featured fisheries available at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Directory;