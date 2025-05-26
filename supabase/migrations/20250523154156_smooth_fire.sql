/*
  # Insert Initial Fishery Data

  This migration adds real fishery data from UK fisheries directories.
*/

-- Insert fisheries
INSERT INTO fisheries (name, slug, description, district, species, image, rules, isFeatured, hasAccommodation, website, contact_phone, day_ticket_price) 
VALUES
  (
    'Barston Lakes',
    'barston-lakes',
    'One of the Midlands premier match and pleasure fishing venues featuring 3 lakes. The main lake is 25 acres and holds matches up to 100 pegs. Excellent facilities including tackle shop and café.',
    'West Midlands',
    ARRAY['Carp', 'Bream', 'Tench', 'Roach', 'Perch'],
    'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg',
    'No nuts or particle baits. Barbless hooks only. No floating baits.',
    true,
    true,
    'https://www.barstonlakes.co.uk',
    '01675 444890',
    8.50
  ),
  (
    'Linear Fisheries',
    'linear-fisheries',
    'One of the UK''s premier carp fishing venues with seven lakes spanning over 100 acres. Home to specimen carp up to 50lb+.',
    'Oxfordshire',
    ARRAY['Carp', 'Tench', 'Bream'],
    'https://images.pexels.com/photos/886210/pexels-photo-886210.jpeg',
    'Minimum 42" landing net. No braid mainline. Barbless hooks only.',
    true,
    true,
    'https://www.linearfisheries.com',
    '01865 232876',
    30.00
  ),
  (
    'Woodland Lakes',
    'woodland-lakes',
    'Beautiful complex of 13 lakes set in stunning Yorkshire countryside. Excellent match and pleasure fishing for all abilities.',
    'Yorkshire',
    ARRAY['Carp', 'Roach', 'Bream', 'Tench', 'Perch'],
    'https://images.pexels.com/photos/2174656/pexels-photo-2174656.jpeg',
    'No floating baits. Barbless hooks only. No nuts.',
    true,
    true,
    'https://www.woodlandlakes.co.uk',
    '01845 501321',
    9.00
  );

-- Insert lakes
INSERT INTO lakes (fishery_id, name, description, species, size_acres, max_depth_ft, pegs)
VALUES
  (
    (SELECT id FROM fisheries WHERE slug = 'barston-lakes'),
    'Main Lake',
    'Large 25 acre lake perfect for matches and pleasure fishing. Regular match weights of 100lb+.',
    ARRAY['Carp', 'Bream', 'Roach'],
    25.0,
    12.0,
    100
  ),
  (
    (SELECT id FROM fisheries WHERE slug = 'linear-fisheries'),
    'St Johns Lake',
    'Famous 20 acre specimen carp lake holding fish to over 40lb.',
    ARRAY['Carp'],
    20.0,
    14.0,
    45
  ),
  (
    (SELECT id FROM fisheries WHERE slug = 'woodland-lakes'),
    'Skylark Lake',
    'Popular match lake with excellent head of carp to 10lb.',
    ARRAY['Carp', 'Roach', 'Bream'],
    5.0,
    8.0,
    40
  );

-- Insert accommodation
INSERT INTO accommodation (fishery_id, type, price, notes)
VALUES
  (
    (SELECT id FROM fisheries WHERE slug = 'linear-fisheries'),
    'Lakeside Pod',
    75.00,
    'Modern fishing pod with power, heating and great lake views. Sleeps 2.'
  ),
  (
    (SELECT id FROM fisheries WHERE slug = 'woodland-lakes'),
    'Static Caravan',
    85.00,
    'Fully equipped holiday caravan sleeping up to 4 people.'
  );