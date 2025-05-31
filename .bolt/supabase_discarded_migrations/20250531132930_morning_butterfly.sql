/*
  # Convert booking_type to array
  
  1. Changes
    - Adds temporary array column
    - Safely converts existing values to arrays
    - Drops old column and renames new one
    
  2. Notes
    - Handles NULL values properly
    - Uses proper array syntax
*/

-- Add temporary column for array values
ALTER TABLE fisheries 
ADD COLUMN booking_type_array text[];

-- Convert existing values to arrays
UPDATE fisheries 
SET booking_type_array = 
  CASE 
    WHEN booking_type IS NULL THEN ARRAY[]::text[]
    WHEN booking_type = '' THEN ARRAY[]::text[]
    ELSE ARRAY[booking_type]
  END;

-- Drop old column and rename new one
ALTER TABLE fisheries 
DROP COLUMN booking_type;

ALTER TABLE fisheries 
RENAME COLUMN booking_type_array TO booking_type;