/*
  # Add Featured Column to Accommodation Table
  
  1. Changes
    - Add `featured` boolean column to accommodation table
    - Column defaults to false for backwards compatibility
    
  2. Security
    - No changes to RLS policies needed
*/

ALTER TABLE accommodation 
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;