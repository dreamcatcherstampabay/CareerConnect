-- Simple Supabase setup for Career Connect App
-- Run this in your Supabase SQL Editor

-- Create career_clusters table
CREATE TABLE IF NOT EXISTS career_clusters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  career_keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentors table
CREATE TABLE IF NOT EXISTS mentors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  rating INTEGER DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  location VARCHAR(255),
  expertise TEXT[] DEFAULT '{}',
  bio TEXT,
  cluster_id INTEGER,
  cluster_name VARCHAR(255),
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mentor_sessions table
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER,
  mentor_id INTEGER,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  session_id INTEGER,
  event_id INTEGER,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert career clusters (will skip if already exists due to UNIQUE constraint)
INSERT INTO career_clusters (name, category, description, icon_name) 
SELECT * FROM (VALUES
  ('Agriculture, Food, & Natural Resources', 'florida', 'Careers in agriculture and natural resources', 'ri-plant-line'),
  ('Architecture & Construction', 'florida', 'Careers in building design and construction', 'ri-building-line'),
  ('Arts, A/V Technology & Communication', 'florida', 'Careers in creative and media fields', 'ri-movie-line'),
  ('Business Management & Administration', 'florida', 'Careers in business operations and leadership', 'ri-user-settings-line'),
  ('Education & Training', 'florida', 'Careers in teaching and training', 'ri-graduation-cap-line'),
  ('Finance', 'florida', 'Careers in financial services', 'ri-money-dollar-circle-line'),
  ('Government & Public Administration', 'florida', 'Careers in public service', 'ri-government-line'),
  ('Health Science', 'florida', 'Careers in healthcare and medical science', 'ri-hospital-line'),
  ('Hospitality & Tourism', 'florida', 'Careers in travel and hospitality', 'ri-hotel-line'),
  ('Human Services', 'florida', 'Careers in social services', 'ri-team-line'),
  ('Information Technology', 'florida', 'Careers in computing and digital technology', 'ri-code-box-line'),
  ('Law, Public Safety & Security', 'florida', 'Careers in legal and safety fields', 'ri-shield-check-line'),
  ('Manufacturing', 'florida', 'Careers in product manufacturing', 'ri-robot-line'),
  ('Marketing, Sales, & Service', 'florida', 'Careers in marketing and sales', 'ri-store-2-line'),
  ('Transportation, Distribution, & Logistics', 'florida', 'Careers in transportation and logistics', 'ri-truck-line'),
  ('Army', 'military', 'Careers in the U.S. Army', 'ri-shield-star-line'),
  ('Navy', 'military', 'Careers in the U.S. Navy', 'ri-ship-line'),
  ('Air Force', 'military', 'Careers in the U.S. Air Force', 'ri-plane-line'),
  ('Marine Corps', 'military', 'Careers in the U.S. Marine Corps', 'ri-anchor-line'),
  ('Coast Guard', 'military', 'Careers in the U.S. Coast Guard', 'ri-lifebuoy-line'),
  ('Space Force', 'military', 'Careers in the U.S. Space Force', 'ri-rocket-line')
) AS v(name, category, description, icon_name)
WHERE NOT EXISTS (
  SELECT 1 FROM career_clusters WHERE career_clusters.name = v.name
);