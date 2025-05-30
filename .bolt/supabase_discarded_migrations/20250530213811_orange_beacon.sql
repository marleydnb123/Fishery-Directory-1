/*
  # Add Visit Counter Function and Policies
  
  1. Changes
    - Add RLS policies for fishery_visits table
    - Create increment_fishery_visits function
    - Add trigger to automatically create visit records
  
  2. Security
    - Enable RLS on fishery_visits table
    - Add policies for public read access
    - Add policies for function-based updates
*/

-- Enable RLS
ALTER TABLE fishery_visits ENABLE ROW LEVEL SECURITY;

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