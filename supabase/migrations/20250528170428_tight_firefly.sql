/*
  # Add Tactics Table
  
  1. New Tables
    - `tactics`
      - `id` (uuid, primary key)
      - `fishery_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `tactics` table
    - Add policies for public read access
    - Add policies for authenticated user management
*/

CREATE TABLE IF NOT EXISTS tactics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fishery_id uuid REFERENCES fisheries(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tactics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Tactics are viewable by everyone" ON tactics
  FOR SELECT USING (true);

CREATE POLICY "Tactics are editable by authenticated users only" ON tactics
  FOR ALL USING (auth.role() = 'authenticated');