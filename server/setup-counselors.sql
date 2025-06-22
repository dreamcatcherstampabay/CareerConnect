-- Create counselors table
CREATE TABLE IF NOT EXISTS counselors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  specialties TEXT[],
  "avatarUrl" TEXT,
  "officeLocation" TEXT,
  "officeHours" TEXT,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create counselor availability table
CREATE TABLE IF NOT EXISTS counselor_availability (
  id SERIAL PRIMARY KEY,
  "counselorId" INTEGER NOT NULL REFERENCES counselors(id),
  "dayOfWeek" TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "isAvailable" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Create counselor sessions table
CREATE TABLE IF NOT EXISTS counselor_sessions (
  id SERIAL PRIMARY KEY,
  "studentId" INTEGER NOT NULL REFERENCES users(id),
  "counselorId" INTEGER NOT NULL REFERENCES counselors(id),
  "sessionDate" TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 30,
  "sessionType" TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled',
  "meetingLink" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Insert sample counselors
INSERT INTO counselors (name, title, department, email, phone, bio, specialties, "officeLocation", "officeHours") VALUES
(
  'Dr. Sarah Mitchell',
  'Academic Advisor & College Application Specialist',
  'Student Success Center',
  's.mitchell@chamberlain.edu',
  '(813) 555-0123',
  'Dr. Mitchell has over 15 years of experience helping students navigate college applications and academic planning. She specializes in university transfer programs and scholarship applications.',
  ARRAY['College Applications', 'Transfer Planning', 'Scholarship Guidance', 'Academic Planning'],
  'Student Success Center, Room 205',
  'Monday-Friday 8:00 AM - 5:00 PM'
),
(
  'Mark Thompson',
  'Career Counselor & Academic Success Coach',
  'Career Services',
  'm.thompson@chamberlain.edu',
  '(813) 555-0124',
  'Mark specializes in helping students develop study skills, plan their academic journey, and connect their education to career goals. He has a background in both education and industry.',
  ARRAY['Study Skills', 'Course Planning', 'Career Guidance', 'Time Management', 'Academic Support'],
  'Career Services Center, Room 110',
  'Tuesday-Thursday 9:00 AM - 6:00 PM, Friday 9:00 AM - 3:00 PM'
);

-- Insert availability for Dr. Sarah Mitchell (assuming she gets ID 1)
INSERT INTO counselor_availability ("counselorId", "dayOfWeek", "startTime", "endTime") VALUES
(1, 'Monday', '09:00', '17:00'),
(1, 'Tuesday', '09:00', '17:00'),
(1, 'Wednesday', '09:00', '17:00'),
(1, 'Thursday', '09:00', '17:00'),
(1, 'Friday', '09:00', '17:00');

-- Insert availability for Mark Thompson (assuming he gets ID 2)
INSERT INTO counselor_availability ("counselorId", "dayOfWeek", "startTime", "endTime") VALUES
(2, 'Tuesday', '09:00', '18:00'),
(2, 'Wednesday', '09:00', '18:00'),
(2, 'Thursday', '09:00', '18:00'),
(2, 'Friday', '09:00', '15:00');