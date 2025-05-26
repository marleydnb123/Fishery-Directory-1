export interface Fishery {
  id: string;
  name: string;
  slug: string;
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
  | 'Barbel';
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