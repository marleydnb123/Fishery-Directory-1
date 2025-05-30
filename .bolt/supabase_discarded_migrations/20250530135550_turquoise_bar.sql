/*
  # Add Newsletter Subscriptions Table
  
  1. New Tables
    - `newsletter_subscriptions`
      - `id` (uuid, primary key)
      - `email` (text, unique, required)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `newsletter_subscriptions` table
    - Add policies for public insert access
    - Add policies for authenticated user read access
*/

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Newsletter subscriptions are insertable by everyone" ON newsletter_subscriptions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Newsletter subscriptions are viewable by authenticated users only" ON newsletter_subscriptions
  FOR SELECT USING (auth.role() = 'authenticated');