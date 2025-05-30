/*
  # Add Bait Boats Column
  
  1. Changes
    - Add `bait_boats` boolean column to fisheries table
    - Column defaults to false for backwards compatibility
    
  2. Security
    - No changes to RLS policies needed
*/

ALTER TABLE fisheries 
ADD COLUMN IF NOT EXISTS bait_boats boolean DEFAULT false;