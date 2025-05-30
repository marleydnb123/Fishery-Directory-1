/*
  # Add Visit Counter Table, Function and Trigger
  
  1. Changes
    - Create fishery_visits table
    - Add function to increment visit count
    - Add trigger to handle visit count updates
    
  2. Security
    - Enable RLS on fishery_visits table
    - Add policies for public access
*/

-- Create fishery_visits table
CREATE TABLE IF NOT EXISTS fishery_visits (
  fishery_id uuid PRIMARY KEY REFERENCES fisheries(id) ON DELETE CASCADE,
  visit_count integer NOT NULL DEFAULT 0,
  last_visited timestamptz DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE fishery_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to visit counts" ON fishery_visits
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update to visit counts" ON fishery_visits
  FOR ALL USING (true);

-- Create function to increment visit count
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