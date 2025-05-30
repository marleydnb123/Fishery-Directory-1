-- Drop existing table and function
DROP TABLE IF EXISTS fishery_visits CASCADE;
DROP FUNCTION IF EXISTS increment_fishery_visits;

-- Create fishery_visits table
CREATE TABLE fishery_visits (
  id bigserial PRIMARY KEY,
  fishery_id uuid REFERENCES fisheries(id) ON DELETE CASCADE,
  visit_count integer NOT NULL DEFAULT 0,
  last_visited timestamptz DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_fishery_visit UNIQUE (fishery_id)
);

-- Enable RLS
ALTER TABLE fishery_visits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view visit counts"
  ON fishery_visits FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update visit counts"
  ON fishery_visits FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create increment function
CREATE OR REPLACE FUNCTION increment_fishery_visits(fishery_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO fishery_visits (fishery_id, visit_count)
  VALUES (fishery_id_param, 1)
  ON CONFLICT (fishery_id) 
  DO UPDATE SET 
    visit_count = fishery_visits.visit_count + 1,
    last_visited = CURRENT_TIMESTAMP;
END;
$$;