/*
  # Initial Schema Setup for TackleFlow

  1. New Tables
    - `fisheries`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `rules` (text)
      - `image` (text)
      - `species` (text[])
      - `district` (text)
      - `isFeatured` (boolean)
      - `hasAccommodation` (boolean)
      - `created_at` (timestamptz) 
      - `website` (text)
      - `contact_phone` (text)
      - `contact_email` (text)
      - `address` (text)
      - `postcode` (text)
      - `day_ticket_price` (decimal)
      
    - `lakes`
      - `id` (uuid, primary key)
      - `fishery_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `species` (text[])
      - `size_acres` (decimal)
      - `max_depth_ft` (decimal)
      - `pegs` (integer)
      - `created_at` (timestamptz)
      
    - `accommodation`
      - `id` (uuid, primary key)
      - `fishery_id` (uuid, foreign key)
      - `type` (text)
      - `price` (decimal)
      - `notes` (text)
      - `created_at` (timestamptz)
      
    - `messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create fisheries table
CREATE TABLE IF NOT EXISTS fisheries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  rules text,
  image text,
  species text[],
  district text,
  isFeatured boolean DEFAULT false,
  hasAccommodation boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  website text,
  contact_phone text,
  contact_email text,
  address text,
  postcode text,
  day_ticket_price decimal(10,2)
);

-- Create lakes table
CREATE TABLE IF NOT EXISTS lakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fishery_id uuid REFERENCES fisheries(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  species text[],
  size_acres decimal(10,2),
  max_depth_ft decimal(10,2),
  pegs integer,
  created_at timestamptz DEFAULT now()
);

-- Create accommodation table
CREATE TABLE IF NOT EXISTS accommodation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fishery_id uuid REFERENCES fisheries(id) ON DELETE CASCADE,
  type text NOT NULL,
  price decimal(10,2) NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE fisheries ENABLE ROW LEVEL SECURITY;
ALTER TABLE lakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for fisheries
CREATE POLICY "Fisheries are viewable by everyone" ON fisheries
  FOR SELECT USING (true);

CREATE POLICY "Fisheries are editable by authenticated users only" ON fisheries
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for lakes
CREATE POLICY "Lakes are viewable by everyone" ON lakes
  FOR SELECT USING (true);

CREATE POLICY "Lakes are editable by authenticated users only" ON lakes
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for accommodation
CREATE POLICY "Accommodation is viewable by everyone" ON accommodation
  FOR SELECT USING (true);

CREATE POLICY "Accommodation is editable by authenticated users only" ON accommodation
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for messages
CREATE POLICY "Messages are insertable by everyone" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Messages are viewable by authenticated users only" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');