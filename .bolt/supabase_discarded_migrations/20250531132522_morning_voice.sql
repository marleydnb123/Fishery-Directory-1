/*
  # Update Booking Type Column
  
  1. Changes
    - Modify booking_type column in fisheries table to be text[]
    - Add default value as empty array
    - Ensure existing data is preserved
    
  2. Security
    - No changes to RLS policies needed
*/

-- First ensure the column exists and convert existing data
DO $$ 
BEGIN
  -- Convert existing single values to arrays if needed
  UPDATE fisheries 
  SET booking_type = ARRAY[booking_type]
  WHERE booking_type IS NOT NULL AND booking_type != '';
  
  -- For null or empty values, set to empty array
  UPDATE fisheries
  SET booking_type = '{}'
  WHERE booking_type IS NULL OR booking_type = '';
END $$;

-- Now alter the column to be text array
ALTER TABLE fisheries 
ALTER COLUMN booking_type TYPE text[] USING booking_type::text[];