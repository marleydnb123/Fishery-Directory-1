/*
  # Fix fishery visits tracking

  1. Changes
    - Create fishery_visits table with proper constraints
    - Add function to safely increment visit counts
    - Add policies for secure access

  2. Security
    - Enable RLS on fishery_visits table
    - Add policies for read/write access
*/

-- Create fishery_visits table with proper constraints
CREATE TABLE IF NOT EXISTS fishery_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fishery_id uuid NOT NULL REFERENCES fisheries(id) ON DELETE CASCADE,
  visit_count integer NOT NULL DEFAULT 0,
  last_visited timestamptz DEFAULT now(),
  UNIQUE(fishery_id)
);

-- Enable RLS
ALTER TABLE fishery_visits ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view visit counts"
  ON fishery_visits
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update visit counts"
  ON fishery_visits
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS increment_fishery_visits;

-- Create new function with proper upsert handling
CREATE OR REPLACE FUNCTION increment_fishery_visits(fishery_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO fishery_visits (fishery_id, visit_count, last_visited)
  VALUES (fishery_id_param, 1, now())
  ON CONFLICT (fishery_id) 
  DO UPDATE SET 
    visit_count = fishery_visits.visit_count + 1,
    last_visited = now();
END;
$$;