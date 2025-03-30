-- Password stored in the database for each entry is the encrypted version of password123. To login as a user use password123 and not what is actually stored in the database.
USE petminder;

INSERT INTO `users`
  (`username`, `name`, `phoneNumber`, `email`, `password`, `address`, `verified`, `language`, `role`)
VALUES
  -- Owners
  ('ownerOne',   'Alice Owner',    '555111', 'alice.owner@example.com',   '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '123 Pet St',        false, 'English', 'owner'),
  ('ownerTwo',   'Bart Owner',     '555222', 'bart.owner@example.com',    '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '456 Dog Walk Ln',   true,  'Spanish', 'owner'),
  ('ownerThree', 'Charlie Owner',  '555333', 'charlie.owner@example.com', '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '789 Cat Ave',       false, 'French',  'owner'),
  ('ownerFour',  'Diana Owner',    '555444', 'diana.owner@example.com',   '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '321 Rabbit Rd',     true,  'English', 'owner'),

  -- Minders
  ('minderOne',  'Mike Minder',    '555555', 'mike.minder@example.com',   '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '100 Walker Blvd',   true,  'English', 'minder'),
  ('minderTwo',  'Nathan Minder',  '555666', 'nathan.minder@example.com', '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '200 Sitter Ave',    false, 'German',  'minder'),
  ('minderThree','Olivia Minder',  '555777', 'olivia.minder@example.com', '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '300 CatCare Dr',    true,  'French',  'minder'),
  ('minderFour', 'Pat Minder',     '555888', 'pat.minder@example.com',    '$2b$12$LaE0zue9lgOf0ANfkkCXX.q.fBI7aLhnn1gTozFR7Ec.KGj5mwB5K', '400 Puppy Pl',      false, 'Spanish', 'minder');

INSERT INTO `petOwner` (`id`, `ratings`)
VALUES
  (1, 4.2),    
  (2, 3.8),     
  (3, 4.5),     
  (4, 3.6);     

INSERT INTO `petMinder` (`id`, `description`, `availability`, `ratings`, `latitude`, `longitude`)
VALUES
  (5, 'Specializes in large dogs',   'Mon-Fri 7am-3pm', 4.7, 40.123456, -74.123456),
  (6, 'Overnight pet sitter',        'Weekends only',   4.2, 41.987654, -73.555555),
  (7, 'Expert in cat boarding',      'Flexible schedule',4.9, 39.765432, -75.234567),
  (8, 'Long-distance dog walking',   'Everyday 9am-6pm',3.9, 38.888888, -76.111111);

