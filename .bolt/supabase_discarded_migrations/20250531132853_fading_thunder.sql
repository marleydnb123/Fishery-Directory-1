/*
  # Update booking_type to array type
  
  1. Changes
    - Adds a temporary column to store array values
    - Converts existing booking_type values to arrays
    - Drops original column and renames new column
  
  2. Security
    - Preserves existing RLS policies
*/

-- Add temporary column for array values
ALTER TABLE fisheries 
ADD COLUMN booking_type_array text[];

-- Convert existing values to arrays
UPDATE fisheries 
SET booking_type_array = 
  CASE 
    WHEN booking_type IS NULL OR booking_type = '' THEN '{}'::text[]
    ELSE ARRAY[booking_type]
  END;

-- Drop old column and rename new one
ALTER TABLE fisheries 
DROP COLUMN booking_type;

ALTER TABLE fisheries 
RENAME COLUMN booking_type_array TO booking_type;