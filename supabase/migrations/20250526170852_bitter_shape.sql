/*
  # Add Image Column to Accommodation Table
  
  1. Changes
    - Add `image` column to `accommodation` table
    - Column is nullable to maintain compatibility with existing records
    
  2. Security
    - No changes to RLS policies needed
*/

ALTER TABLE accommodation 
ADD COLUMN IF NOT EXISTS image text;