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
  const [selectedbookingType, setbookingType] = useState('');
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
  const [accessAllHours, setaccessAllHours] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [carpOpen, setCarpOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false); 
  const [coarseOpen, setCoarseOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);
  const [guestsAllowed, setguestsAllowed] = useState(false);
  const [under18, setunder18] = useState(false);

  const districts: UKDistrict[] = [
    'Cumbria', 'Dumfries & Galloway', 'Yorkshire', 'Hampshire', 'Kent', 'Essex', 'Sussex', 'Dorset',
    'Wiltshire', 'Devon', 'Cornwall', 'Norfolk', 'Suffolk', 'Lancashire', 'Cheshire', 'Wales', 'France'
  ];
  const species: FishSpecies[] = [
    'Carp', 'Pike', 'Tench', 'Bream', 'Roach', 'Perch', 'Trout', 'Catfish', 'Eel', 'Barbel', 'Gudgeon', 'Sturgeon'
  ];

  
  // Get unique booking types from fisheries data
  const bookingTypes = React.useMemo(() => {
    const types = fisheries
      .filter(f => Array.isArray(f.booking_type) && f.booking_type.length > 0)
      .flatMap(f => f.booking_type);
    return Array.from(new Set(types)).sort();
  }, [fisheries]);

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
            bookingType: Array.isArray(f.booking_type) ? f.booking_type : [],
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
            accessAllHours: !!f.access_all_hours, 
            guestsAllowed: !!f.guests_allowed,
            under18: !!f.under_18,
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
    if (selectedbookingType) {
      results = results.filter(fishery =>
        Array.isArray(fishery.bookingType) && 
        fishery.bookingType.includes(selectedbookingType)
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
    if (accessAllHours) {
      results = results.filter(fishery => fishery.accessAllHours);
    }
    if (guestsAllowed) {
      results = results.filter(fishery => fishery.guestsAllowed)
    }
    if (under18) {
      results = results.filter(fishery => fishery.under18)
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
    selectedbookingType,
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
    accessAllHours,
    guestsAllowed,
    under18,
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

  const featuredFisheries = fisheries.filter(f => f.isFeatured).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-100 pb-16">
      <div className="relative w-full h-56 md:h-[380px] lg:h-[500px] mb-12">
        <img
          src="https://static.wixstatic.com/media/cc739e_696f733ac6a049babd9117b1375fd439~mv2.jpg/v1/fill/w_1189,h_797,al_c,q_85,enc_avif,quality_auto/cc739e_696f733ac6a049babd9117b1375fd439~mv2.jpg"
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

        <div className="bg-customBlue/40 rounded-xl shadow-md p-6 mb-16">
          <form
            className="flex flex-wrap gap-2 mb-4"
            onSubmit={e => e.preventDefault()}
            autoComplete="off"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by fishery name, region, or county"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 shadow-sm text-sm placeholder-gray-900 bg-transparent"
              aria-label="Search fisheries"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-customBlue hover:bg-blue-700 text-white font-medium rounded-lg shadow text-sm"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecies('');
                setSelectedDistrict('');
                setSelectedFishingType('');
                setbookingType('');
                setFeatureSearchTerm('');
                setFacilities('');
                setPriceRange('');
                setWifiSignal('');
                setBaitBoats(false);
                setMagicTwig(false);
                setCatchPhotos(false);
                setMatchFishingFriendly(false);
                setkeepnetsAllowed(false);
                setAccommodationOnly(false);
                setNightFishingAllowed(false);
                setDisabledAccess(false);
                setDogFriendly(false);
                setFirePitsAllowed(false);
                setParkingClose(false);
                setCampingAllowed(false);
                settackleShop(false);
                setprivateHire(false);
                settackleHire(false);
                setcoaching(false);
                setaccessAllHours(false);
                setguestsAllowed(false);
                setunder18(false);
              }}
              className="px-5 py-2 bg-customBlue  hover:bg-gray-600 text-white font-medium rounded-lg shadow text-sm"
            >
              Reset Filters
            </button>
          </form>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
            <div className="flex flex-col gap-3"> 
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fish Species</label>
                <select 
                  value={selectedSpecies}
                  onChange={e => setSelectedSpecies(e.target.value as FishSpecies | '')}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm bg-transparent"
                >
                  <option value="">All Species</option>
                  {species.map((specie) => ( 
                    <option key={specie} value={specie}>{specie}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Region / County</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value as UKDistrict | '')}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm bg-transparent"
                >
                  <option value="">All Regions</option> 
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Fishing Type</label>
                <select
                  value={selectedFishingType}
                  onChange={e => setSelectedFishingType(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm bg-transparent "
                >
                  <option value="">All Types</option>
                  {Array.from(new Set(fisheries.flatMap(f => f.fishingType))).sort().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Booking Type</label>
                <select
                  value={selectedbookingType}
                  onChange={e => setbookingType(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm bg-transparent"
                >
                  <option value="">All</option>
                  {bookingTypes.length > 0 ? bookingTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  )) : (
                    <option disabled>No booking types found</option>
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 ">Water Features</label> 
                <input
                  type="text"
                  value={featureSearchTerm}
                  onChange={handleFeatureSearch} 
                  placeholder="e.g. weed beds, lily pads"
                  className="w-full p-2 border border-gray-200   rounded focus:ring-1 focus:ring-blue-400 text-sm placeholder-gray-900 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Facilities</label>
                <input
                  type="text"
                  value={facilities}
                  onChange={e => setFacilities(e.target.value)}
                  placeholder="toilets, showers, café..."
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm placeholder-gray-900 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Day Ticket Price Range</label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value)}
                  placeholder="e.g. £10-£25"
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm placeholder-gray-900 bg-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Wi-Fi / Mobile Signal</label>
                <input
                  type="text"
                  value={wifiSignal}
                  onChange={e => setWifiSignal(e.target.value)}
                  placeholder="Wifi, Signal, Provider (vodafone, o2 etc)"
                  className="w-full p-2 border border-gray-200 rounded focus:ring-1 focus:ring-blue-400 text-sm placeholder-gray-900 bg-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="block text-xs font-semibold text-gray-600">
                Advanced Filters
              </h3>


              {/* GENERAL FACTS FILTERS */}
            <div className="border border-gray-200 rounded-lg ">
            <button
            type="button"
            onClick={() => setGeneralOpen(!generalOpen)}
          className="w-full flex items-center justify-between p-3 text-left rounded-xl hover:bg-customBlue/10 hover:rounded-xl transition-colors"
          >
          <h3 className="text-sm font-bold text-gray-800">GENERAL FACTS</h3>
          <svg
          className={`w-4 h-4 transition-transform ${generalOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
            viewBox="0 0 24 24"
          >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
      </button>
        {generalOpen && (
        <div className="px-3 pb-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={accessAllHours}
          onChange={() => setaccessAllHours(!accessAllHours)}
          className="w-4 h-4 accent-blue-600 rounded border-gray-300"
          id="24-hour-access"
            />
          <label htmlFor="24-hour-access" className="text-xs text-gray-700 font-medium">24 Hour Access</label>
                  </div>
          <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={guestsAllowed}
          onChange={() => setguestsAllowed(!guestsAllowed)}
          className="w-4 h-4 accent-blue-600 rounded border-gray-300"
          id="Guests Allowed"
            />
          <label htmlFor="guests-allowed" className="text-xs text-gray-700 font-medium">Guests Allowed</label>
            </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={under18}
          onChange={() => setunder18(!under18)}
          className="w-4 h-4 accent-blue-600 rounded border-gray-300"
          id="under-18"
        />
        <label htmlFor="under-18's" className="text-xs text-gray-700 font-medium">Under 18's</label>
                  </div>
                </div>
                )}
              </div>

              
              {/* CARP FISHING FILTERS */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCarpOpen(!carpOpen)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-customBlue/10 hover:rounded-xl transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800">CARP</h3>
                  <svg
                    className={`w-4 h-4 transition-transform ${carpOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {carpOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={baitBoats}
                        onChange={() => setBaitBoats(!baitBoats)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="bait-boats"
                      />
                      <label htmlFor="bait-boats" className="text-xs text-gray-700 font-medium">Bait Boats Allowed</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={magicTwig}
                        onChange={() => setMagicTwig(!magicTwig)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="magic-twig"
                      />
                      <label htmlFor="magic-twig" className="text-xs text-gray-700 font-medium">Magic Twig Allowed</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={catchPhotos}
                        onChange={() => setCatchPhotos(!catchPhotos)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="catch-photos"
                      />
                      <label htmlFor="catch-photos" className="text-xs text-gray-700 font-medium">Catch Photos</label>
                    </div>
                  </div>
                )}
              </div>

              
              

              {/* MATCH FISHING FILTERS */}
             
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setMatchOpen(!matchOpen)}
                  className="w-full flex items-center justify-between p-3 text-left rounded-xl text-left hover:bg-customBlue/10 hover:rounded-xl  transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800">MATCH</h3>
                  <svg
                    className={`w-4 h-4 transition-transform ${matchOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {matchOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={matchFishingFriendly}
                        onChange={() => setMatchFishingFriendly(!matchFishingFriendly)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="match-friendly"
                      />
                      <label htmlFor="match-friendly" className="text-xs text-gray-700 font-medium">Match Fishing Friendly</label>
                    </div>
                  </div>
                )}
              </div>

               

              {/* COARSE FISHING FILTERS */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setCoarseOpen(!coarseOpen)}
                  className="w-full flex items-center justify-between p-3 text-left rounded-xl text-left hover:bg-customBlue/10 hover:rounded-xl  transition-colors"
                >
                  <h3 className="text-sm font-bold text-gray-800">COARSE</h3>
                  <svg
                    className={`w-4 h-4 transition-transform ${coarseOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {coarseOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-center gap-2"> 
                      <input 
                        type="checkbox"
                        checked={accommodationOnly}
                        onChange={() => setAccommodationOnly(!accommodationOnly)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300" 
                        id="accommodation"
                      /> 
                      <label htmlFor="accommodation" className="text-xs text-gray-700 font-medium">On-site Accommodation</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={nightFishingAllowed}
                        onChange={() => setNightFishingAllowed(!nightFishingAllowed)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300" 
                        id="night-fishing"
                      />
                      <label htmlFor="night-fishing" className="text-xs text-gray-700 font-medium">Night Fishing Allowed</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={disabledAccess}
                        onChange={() => setDisabledAccess(!disabledAccess)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="disabled-access"
                      />
                      <label htmlFor="disabled-access" className="text-xs text-gray-700 font-medium">Disabled Access</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={dogFriendly}
                        onChange={() => setDogFriendly(!dogFriendly)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="dog-friendly"
                      />
                      <label htmlFor="dog-friendly" className="text-xs text-gray-700 font-medium">Dog Friendly</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={firePitsAllowed}
                        onChange={() => setFirePitsAllowed(!firePitsAllowed)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="fire-pits"
                      />
                      <label htmlFor="fire-pits" className="text-xs text-gray-700 font-medium">Fire Pits Allowed</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={parkingClose}
                        onChange={() => setParkingClose(!parkingClose)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="parking-close"
                      />
                      <label htmlFor="parking-close" className="text-xs text-gray-700 font-medium">Parking Close</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={campingAllowed}
                        onChange={() => setCampingAllowed(!campingAllowed)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="camping-allowed"
                      />
                      <label htmlFor="camping-allowed" className="text-xs text-gray-700 font-medium">Camping Allowed</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tackleShop}
                        onChange={() => settackleShop(!tackleShop)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="tackleshop"
                      />
                      <label htmlFor="tackleshop" className="text-xs text-gray-700 font-medium">Tackle Shop On-site</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={privateHire}
                        onChange={() => setprivateHire(!privateHire)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="privatehire"
                      />
                      <label htmlFor="privatehire" className="text-xs text-gray-700 font-medium">Private Hire</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={tackleHire}
                        onChange={() => settackleHire(!tackleHire)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="tacklehire"
                      />
                      <label htmlFor="tacklehire" className="text-xs text-gray-700 font-medium">Tackle Hire</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={coaching}
                        onChange={() => setcoaching(!coaching)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="coaching"
                      />
                      <label htmlFor="coaching" className="text-xs text-gray-700 font-medium">Coaching</label>
                    </div>
                     <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={keepnetsAllowed}
                        onChange={() => setkeepnetsAllowed(!keepnetsAllowed)}
                        className="w-4 h-4 accent-blue-600 rounded border-gray-300"
                        id="keepnetsAllowed"
                      />
                      <label htmlFor="keepnetsAllowed" className="text-xs text-gray-700 font-medium">Keepnets Allowed</label>
                    </div>
                  </div>
                )}
              </div>
            </div> 
          </div> 
        </div>

        {loading ? (
          <div className="text-center py-16 text-lg font-semibold text-gray-500">Loading fisheries...</div>
        ) : error ? (
          <div className="text-center py-16 text-lg font-semibold text-red-500">{error}</div>
        ) : filteredFisheries.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible" 
          >
            {filteredFisheries.map((fishery) => (
              <motion.div key={fishery.id} variants={itemVariants}>
                <FisheryCard fishery={fishery} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No fisheries found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        )}
      </div>

      <section className="py-12 px-4 bg-gradient-to-br from-blue-100 via-white to-blue-50 border border-blue-200"> 
        <div className="container mx-auto rounded-xl shadow-lg overflow-hidden">
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
              className="text-primary-200 text-center max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Explore our handpicked selection of the finest fishing spots across the UK
            </motion.p>
          </div>
          <div className="p-6 bg-gray-50">
            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading featured fisheries...</div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900">{f.name}</h3>
                          <div className="text-sm text-primary-700">{f.district}</div>
                          <div className="text-gray-600 text-xs mt-2 line-clamp-2">{f.description}</div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-4 text-center text-gray-500">
                    No featured fisheries found.
                  </div>
                )} 
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Directory;