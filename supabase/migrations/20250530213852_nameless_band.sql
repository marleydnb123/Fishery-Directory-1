/*
  # Visit Counter Setup
  
  1. Changes
    - Enable RLS on fishery_visits table
    - Add policies for public access to visit counts
    - Create function to increment visit counts
    
  2. Security
    - Policies allow anyone to read visit counts
    - Policies allow anyone to update visit counts
    - Function uses SECURITY DEFINER for reliable execution
*/

-- Enable RLS
ALTER TABLE fishery_visits ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can select visit count" ON fishery_visits;
    DROP POLICY IF EXISTS "Anyone can update visit count" ON fishery_visits;
END $$;

-- Create policies
CREATE POLICY "Anyone can select visit count"
  ON fishery_visits
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update visit count"
  ON fishery_visits
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create the increment function
CREATE OR REPLACE FUNCTION increment_fishery_visits(fishery_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO fishery_visits (fishery_id, visit_count, last_visited)
  VALUES (fishery_id_param, 1, CURRENT_TIMESTAMP)
  ON CONFLICT (fishery_id) 
  DO UPDATE SET
    visit_count = fishery_visits.visit_count + 1,
    last_visited = CURRENT_TIMESTAMP;
END;
$$;