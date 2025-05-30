/*
  # Fix Visit Counter Implementation
  
  1. Changes
    - Drop and recreate fishery_visits table with correct structure
    - Add proper RLS policies
    - Create improved increment function
    
  2. Security
    - Enable RLS
    - Add policies for public access
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS increment_fishery_visits(uuid);

-- Recreate table with correct structure
DROP TABLE IF EXISTS fishery_visits;
CREATE TABLE fishery_visits (
  id bigserial PRIMARY KEY,
  fishery_id uuid REFERENCES fisheries(id) ON DELETE CASCADE,
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
DECLARE
  existing_visit_id bigint;
BEGIN
  -- Check if entry exists
  SELECT id INTO existing_visit_id 
  FROM fishery_visits 
  WHERE fishery_id = fishery_id_param;
  
  IF existing_visit_id IS NULL THEN
    -- Create new entry if none exists
    INSERT INTO fishery_visits (fishery_id, visit_count, last_visited)
    VALUES (fishery_id_param, 1, CURRENT_TIMESTAMP);
  ELSE
    -- Update existing entry
    UPDATE fishery_visits
    SET 
      visit_count = visit_count + 1,
      last_visited = CURRENT_TIMESTAMP
    WHERE id = existing_visit_id;
  END IF;
END;
$$ LANGUAGE plpgsql;