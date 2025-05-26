/*
  # Add tackle shops table
  
  1. New Tables
    - `tackle_shops`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `slug` (text, unique, required)
      - `description` (text)
      - `image` (text)
      - `address` (text)
      - `postcode` (text)
      - `website` (text)
      - `phone` (text)
      - `email` (text)
      - `opening_hours` (jsonb)
      - `brands` (text[])
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `tackle_shops` table
    - Add policies for public read access
    - Add policies for authenticated user management
*/

CREATE TABLE IF NOT EXISTS tackle_shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image text,
  address text,
  postcode text,
  website text,
  phone text,
  email text,
  opening_hours jsonb,
  brands text[],
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tackle_shops ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tackle shops are viewable by everyone" ON tackle_shops
  FOR SELECT USING (true);

CREATE POLICY "Tackle shops are editable by authenticated users only" ON tackle_shops
  FOR ALL USING (auth.role() = 'authenticated');