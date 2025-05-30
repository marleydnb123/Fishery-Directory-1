/*
  # Fix fishery visits functionality

  1. Changes
    - Add unique constraint on fishery_id in fishery_visits table
    - Create or replace increment_fishery_visits function to handle missing records

  2. Security
    - No changes to RLS policies
*/

-- Add unique constraint to fishery_id
ALTER TABLE fishery_visits 
ADD CONSTRAINT unique_fishery_id UNIQUE (fishery_id);

-- Create or replace the increment_fishery_visits function
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