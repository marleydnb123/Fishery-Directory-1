/*
  # Fix Array Fields in Fisheries Table
  
  1. Changes
    - Add proper array type constraints for array fields
    - Add default empty arrays for required array fields
    - Update column types to ensure proper array handling
    
  2. Security
    - No changes to RLS policies
*/

-- Ensure array fields have proper array type constraints
ALTER TABLE fisheries 
  ALTER COLUMN species SET DEFAULT '{}',
  ALTER COLUMN features SET DEFAULT '{}',
  ALTER COLUMN fishing_type SET DEFAULT '{}',
  ALTER COLUMN facilities SET DEFAULT '{}',
  ALTER COLUMN booking_type SET DEFAULT '{}',
  ALTER COLUMN pricing SET DEFAULT '{}',
  ALTER COLUMN opening_times SET DEFAULT '{}',
  ALTER COLUMN day_tickets SET DEFAULT '{}',
  ALTER COLUMN payment SET DEFAULT '{}';

-- Add check constraints to ensure array fields are actually arrays
ALTER TABLE fisheries 
  ADD CONSTRAINT species_is_array CHECK (species IS NULL OR array_ndims(species) = 1),
  ADD CONSTRAINT features_is_array CHECK (features IS NULL OR array_ndims(features) = 1),
  ADD CONSTRAINT fishing_type_is_array CHECK (fishing_type IS NULL OR array_ndims(fishing_type) = 1),
  ADD CONSTRAINT facilities_is_array CHECK (facilities IS NULL OR array_ndims(facilities) = 1),
  ADD CONSTRAINT booking_type_is_array CHECK (booking_type IS NULL OR array_ndims(booking_type) = 1),
  ADD CONSTRAINT pricing_is_array CHECK (pricing IS NULL OR array_ndims(pricing) = 1),
  ADD CONSTRAINT opening_times_is_array CHECK (opening_times IS NULL OR array_ndims(opening_times) = 1),
  ADD CONSTRAINT day_tickets_is_array CHECK (day_tickets IS NULL OR array_ndims(day_tickets) = 1),
  ADD CONSTRAINT payment_is_array CHECK (payment IS NULL OR array_ndims(payment) = 1);