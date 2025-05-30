/*
  # Fix Fishery Visits Table and Function

  1. Changes
    - Drop existing function to avoid conflicts
    - Recreate table with correct structure
    - Add proper RLS policies
    - Create improved increment function
    
  2. Security
    - Enable RLS on table
    - Add policies for public access
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS increment_fishery_visits(uuid);

-- Recreate table with correct structure
DROP TABLE IF EXISTS fishery_visits;
CREATE TABLE fishery_visits (
  fishery_id uuid PRIMARY KEY REFERENCES fisheries(id) ON DELETE CASCADE,
  visit_count integer NOT NULL DEFAULT 0,
  last_visited timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE fishery_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to visit counts" ON fishery_visits
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to visit counts" ON fishery_visits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to visit counts" ON fishery_visits
  FOR UPDATE USING (true);

-- Create improved increment function
CREATE OR REPLACE FUNCTION increment_fishery_visits(fishery_id_param uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO fishery_visits (fishery_id, visit_count)
  VALUES (fishery_id_param, 1)
  ON CONFLICT (fishery_id) 
  DO UPDATE SET 
    visit_count = fishery_visits.visit_count + 1,
    last_visited = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;