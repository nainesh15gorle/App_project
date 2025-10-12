/*
  # SRM E-Yantra Lab Inventory Management System Database Schema

  ## Overview
  This migration creates the complete database schema for the SRM E-Yantra Lab 
  Inventory Management System, including tables for components, transactions, 
  categories, and user management.

  ## New Tables
  
  ### 1. `categories`
  - `id` (uuid, primary key) - Unique identifier for category
  - `name` (text) - Category name (e.g., "Sensors", "Motors", "Controllers")
  - `description` (text, nullable) - Category description
  - `created_at` (timestamptz) - Timestamp of creation
  
  ### 2. `components`
  - `id` (uuid, primary key) - Unique identifier for component
  - `name` (text) - Component name
  - `description` (text, nullable) - Component description
  - `category_id` (uuid, foreign key) - Reference to categories table
  - `stock_quantity` (integer) - Current stock level
  - `min_stock_level` (integer) - Minimum stock threshold for alerts
  - `unit_price` (decimal) - Price per unit
  - `location` (text, nullable) - Storage location in lab
  - `image_url` (text, nullable) - Component image URL
  - `created_at` (timestamptz) - Timestamp of creation
  - `updated_at` (timestamptz) - Timestamp of last update
  
  ### 3. `transactions`
  - `id` (uuid, primary key) - Unique identifier for transaction
  - `component_id` (uuid, foreign key) - Reference to components table
  - `transaction_type` (text) - Type: 'checkout' or 'return'
  - `quantity` (integer) - Number of items in transaction
  - `user_name` (text) - Name of person conducting transaction
  - `user_email` (text) - Email of person conducting transaction
  - `purpose` (text, nullable) - Purpose of checkout/return
  - `transaction_date` (timestamptz) - Date and time of transaction
  - `expected_return_date` (timestamptz, nullable) - Expected return date for checkouts
  - `actual_return_date` (timestamptz, nullable) - Actual return date
  - `status` (text) - Status: 'pending', 'completed', 'overdue'
  - `created_at` (timestamptz) - Timestamp of creation

  ## Security
  - Enable Row Level Security (RLS) on all tables
  - Create policies for public read access (suitable for lab management)
  - Create policies for authenticated insert/update operations
  
  ## Indexes
  - Index on component names for fast searching
  - Index on transaction dates for reporting
  - Index on category relationships

  ## Important Notes
  1. All tables use UUID primary keys for scalability
  2. Timestamps use timestamptz for timezone awareness
  3. Foreign key constraints ensure data integrity
  4. Default values set for common fields
  5. RLS policies allow public read access for transparency
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create components table
CREATE TABLE IF NOT EXISTS components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock_quantity integer DEFAULT 0 NOT NULL CHECK (stock_quantity >= 0),
  min_stock_level integer DEFAULT 10 NOT NULL,
  unit_price decimal(10, 2) DEFAULT 0.00,
  location text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id uuid REFERENCES components(id) ON DELETE CASCADE NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('checkout', 'return')),
  quantity integer NOT NULL CHECK (quantity > 0),
  user_name text NOT NULL,
  user_email text NOT NULL,
  purpose text,
  transaction_date timestamptz DEFAULT now(),
  expected_return_date timestamptz,
  actual_return_date timestamptz,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_components_name ON components(name);
CREATE INDEX IF NOT EXISTS idx_components_category ON components(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_component ON transactions(component_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access (suitable for lab transparency)
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view components"
  ON components FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view transactions"
  ON transactions FOR SELECT
  USING (true);

-- Create RLS policies for authenticated users to manage data
CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert components"
  ON components FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update components"
  ON components FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
  ('Sensors', 'Various types of sensors including ultrasonic, IR, temperature, etc.'),
  ('Motors & Actuators', 'DC motors, servo motors, stepper motors, and actuators'),
  ('Controllers', 'Microcontrollers, Arduino boards, Raspberry Pi, and development boards'),
  ('Power Supply', 'Batteries, power adapters, voltage regulators, and power management'),
  ('Communication', 'Wireless modules, Bluetooth, WiFi, RF modules'),
  ('Mechanical', 'Chassis, wheels, mounting brackets, screws, and mechanical parts'),
  ('Electronic Components', 'Resistors, capacitors, LEDs, transistors, and basic components'),
  ('Tools & Equipment', 'Soldering irons, multimeters, wire strippers, and other tools')
ON CONFLICT (name) DO NOTHING;

-- Insert sample components
INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'Ultrasonic Sensor HC-SR04',
  'Ultrasonic distance sensor with 2cm-400cm range',
  id,
  45,
  10,
  3.50,
  'Shelf A1'
FROM categories WHERE name = 'Sensors'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'Arduino Uno R3',
  'ATmega328P based microcontroller board',
  id,
  28,
  5,
  22.00,
  'Cabinet B2'
FROM categories WHERE name = 'Controllers'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'Servo Motor SG90',
  '9g micro servo motor with 180° rotation',
  id,
  62,
  15,
  2.80,
  'Drawer C3'
FROM categories WHERE name = 'Motors & Actuators'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'ESP32 DevKit',
  'WiFi and Bluetooth enabled microcontroller',
  id,
  15,
  5,
  8.50,
  'Cabinet B2'
FROM categories WHERE name = 'Controllers'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'IR Sensor Module',
  'Infrared obstacle detection sensor',
  id,
  38,
  10,
  1.50,
  'Shelf A2'
FROM categories WHERE name = 'Sensors'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'L298N Motor Driver',
  'Dual H-bridge motor driver for DC motors',
  id,
  22,
  8,
  4.20,
  'Drawer C1'
FROM categories WHERE name = 'Motors & Actuators'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  '9V Battery',
  'Standard 9V alkaline battery',
  id,
  5,
  10,
  2.50,
  'Storage D1'
FROM categories WHERE name = 'Power Supply'
ON CONFLICT DO NOTHING;

INSERT INTO components (name, description, category_id, stock_quantity, min_stock_level, unit_price, location) 
SELECT 
  'Breadboard 830 points',
  'Solderless breadboard for prototyping',
  id,
  18,
  5,
  3.00,
  'Shelf E1'
FROM categories WHERE name = 'Electronic Components'
ON CONFLICT DO NOTHING;