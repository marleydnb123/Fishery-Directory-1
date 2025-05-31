export interface Fishery {
  id: string;
  name: string;
  slug: string;
  visit_count?: number;
  description: string;
  rules: string;
  image: string;
  species: string[];
  district: string;
  isFeatured: boolean;
  hasAccommodation: boolean;
  created_at: string;
  website?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  postcode?: string;
  day_ticket_price?: number;
  features: string[];
  night_fishing_allowed?: boolean;
  fishing_type?: string[]; 
  match_fishing_friendly?: boolean;
  disabled_access?: boolean;
  facilities?: string[];
  dog_friendly?: boolean;
  price_range?: string;
  fire_pits_allowed?: boolean;
  bookingType: string[];
  parking_close?: boolean;
  camping_allowed?: boolean;
  catch_photos?: boolean;
  wifi_signal?: string;
  descriptionpage?: string;
  fisheryimages1?: string;
  fisheryimages2?: string;
  fisheryimages3?: string;
  fisheryvideo?: string;
  bait_boats?: boolean;
  magic_twig?: boolean;
  private_hire?: boolean;  
  tackle_hire?: boolean;   
  coaching?: boolean;      
  keepnets_allowed?: boolean;  
  tactics?: string; 
  pricing?: string[];
  opening_times?: string[];
  day_tickets?: string[];
  payments?: string[];
  fishery_of_the_week?: boolean;
  record_biggest_fish?: string;
  record_match_weight?: string;
  access_all_hours?: boolean;
  guests_allowed?: boolean;
  under_18?: boolean;
}

export interface Lake {
  id: string;
  fishery_id: string;
  name: string;
  description: string;
  species: string[];
  size_acres?: number;
  max_depth_ft?: number;
  pegs?: number;
  created_at: string;
}

export interface Accommodation {
  id: string;
  fishery_id: string;
  type: string;
  price: number;
  notes: string;
  image?: string;
  created_at: string;
  featured: boolean;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface TackleShop {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  address: string;
  postcode: string;
  website?: string;
  phone?: string;
  email?: string;
  opening_hours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  brands: string[];
  created_at: string;
}

export type FishSpecies = 
  | 'Carp'
  | 'Pike'
  | 'Tench'
  | 'Bream'
  | 'Roach'
  | 'Perch'
  | 'Trout'
  | 'Catfish'
  | 'Eel'
  | 'Barbel'
  | 'Gudgeon';

export type UKDistrict =
  | 'Cumbria'
  | 'Dumfries & Galloway'
  | 'Yorkshire'
  | 'Hampshire'
  | 'Kent'
  | 'Essex'
  | 'Sussex'
  | 'Dorset'
  | 'Wiltshire'
  | 'Devon'
  | 'Cornwall'
  | 'Norfolk'
  | 'Suffolk'
  | 'Lancashire'
  | 'Cheshire'
  | 'Wales'
  | 'West Midlands'
  | 'Oxfordshire';

export type AccommodationType =
  | 'Cabin'
  | 'Lodge'
  | 'Tent'
  | 'Campervan'
  | 'Lakeside Pod'
  | 'Static Caravan'
  | 'Bungalow';