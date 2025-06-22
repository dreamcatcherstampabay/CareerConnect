-- Career Connect App Database Setup for Supabase
-- Run this SQL in your Supabase SQL Editor to create all necessary tables

-- Enable RLS (Row Level Security) for better security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Users table
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

-- Career clusters table
CREATE TABLE IF NOT EXISTS career_clusters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  icon_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career keywords table
CREATE TABLE IF NOT EXISTS career_keywords (
  id SERIAL PRIMARY KEY,
  keyword VARCHAR(255) NOT NULL,
  cluster_id INTEGER REFERENCES career_clusters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Career events table
CREATE TABLE IF NOT EXISTS career_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(255),
  cluster_id INTEGER REFERENCES career_clusters(id) ON DELETE SET NULL,
  registration_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentors table
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
  cluster_id INTEGER REFERENCES career_clusters(id) ON DELETE SET NULL,
  cluster_name VARCHAR(255),
  keywords TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentor availability table
CREATE TABLE IF NOT EXISTS mentor_availability (
  id SERIAL PRIMARY KEY,
  mentor_id INTEGER REFERENCES mentors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentor sessions table
CREATE TABLE IF NOT EXISTS mentor_sessions (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  mentor_id INTEGER REFERENCES mentors(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(50) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES mentor_sessions(id) ON DELETE SET NULL,
  event_id INTEGER REFERENCES career_events(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial career clusters data
INSERT INTO career_clusters (name, category, description, icon_name) VALUES
-- Florida Career Clusters
('Agriculture, Food, & Natural Resources', 'florida', 'Careers in agriculture and natural resources', 'ri-plant-line'),
('Architecture & Construction', 'florida', 'Careers in building design and construction', 'ri-building-line'),
('Arts, A/V Technology & Communication', 'florida', 'Careers in creative and media fields', 'ri-movie-line'),
('Business Management & Administration', 'florida', 'Careers in business operations and leadership', 'ri-user-settings-line'),
('Education & Training', 'florida', 'Careers in teaching and training', 'ri-graduation-cap-line'),
('Energy', 'florida', 'Careers in energy production and management', 'ri-flashlight-line'),
('Engineering & Technology Education', 'florida', 'Careers in engineering and technology development', 'ri-tools-line'),
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
-- Military Branches
('Army', 'military', 'Careers in the U.S. Army', 'ri-shield-star-line'),
('Navy', 'military', 'Careers in the U.S. Navy', 'ri-ship-line'),
('Air Force', 'military', 'Careers in the U.S. Air Force', 'ri-plane-line'),
('Marine Corps', 'military', 'Careers in the U.S. Marine Corps', 'ri-anchor-line'),
('Coast Guard', 'military', 'Careers in the U.S. Coast Guard', 'ri-lifebuoy-line'),
('Space Force', 'military', 'Careers in the U.S. Space Force', 'ri-rocket-line')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_career_keywords_cluster_id ON career_keywords(cluster_id);
CREATE INDEX IF NOT EXISTS idx_mentors_cluster_id ON mentors(cluster_id);
CREATE INDEX IF NOT EXISTS idx_mentor_availability_mentor_id ON mentor_availability(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_student_id ON mentor_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_mentor_sessions_mentor_id ON mentor_sessions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Enable Row Level Security (optional - can be configured later)
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE mentor_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;