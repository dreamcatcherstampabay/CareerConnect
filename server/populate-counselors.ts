import { createClient } from '@supabase/supabase-js';

async function populateCounselors() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Setting up counselors tables and data...');

  try {
    // Create counselors table
    const { error: counselorsError } = await supabase.rpc('exec_sql', {
      sql_query: `
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
      `
    });

    if (counselorsError) {
      console.error('Error creating counselors table:', counselorsError);
      return;
    }

    // Create counselor availability table
    const { error: availabilityError } = await supabase.rpc('exec_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS counselor_availability (
          id SERIAL PRIMARY KEY,
          "counselorId" INTEGER NOT NULL REFERENCES counselors(id),
          "dayOfWeek" TEXT NOT NULL,
          "startTime" TEXT NOT NULL,
          "endTime" TEXT NOT NULL,
          "isAvailable" BOOLEAN DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT NOW()
        );
      `
    });

    if (availabilityError) {
      console.error('Error creating counselor availability table:', availabilityError);
      return;
    }

    // Create counselor sessions table
    const { error: sessionsError } = await supabase.rpc('exec_sql', {
      sql_query: `
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
      `
    });

    if (sessionsError) {
      console.error('Error creating counselor sessions table:', sessionsError);
      return;
    }

    console.log('✅ Counselor tables created successfully');

    // Insert sample counselors
    const counselors = [
      {
        name: "Dr. Sarah Mitchell",
        title: "Academic Advisor & College Application Specialist",
        department: "Student Success Center",
        email: "s.mitchell@chamberlain.edu",
        phone: "(813) 555-0123",
        bio: "Dr. Mitchell has over 15 years of experience helping students navigate college applications and academic planning. She specializes in university transfer programs and scholarship applications.",
        specialties: ["College Applications", "Transfer Planning", "Scholarship Guidance", "Academic Planning"],
        officeLocation: "Student Success Center, Room 205",
        officeHours: "Monday-Friday 8:00 AM - 5:00 PM"
      },
      {
        name: "Mark Thompson",
        title: "Career Counselor & Academic Success Coach",
        department: "Career Services",
        email: "m.thompson@chamberlain.edu",
        phone: "(813) 555-0124",
        bio: "Mark specializes in helping students develop study skills, plan their academic journey, and connect their education to career goals. He has a background in both education and industry.",
        specialties: ["Study Skills", "Course Planning", "Career Guidance", "Time Management", "Academic Support"],
        officeLocation: "Career Services Center, Room 110",
        officeHours: "Tuesday-Thursday 9:00 AM - 6:00 PM, Friday 9:00 AM - 3:00 PM"
      }
    ];

    for (const counselor of counselors) {
      const { data, error } = await supabase
        .from('counselors')
        .insert(counselor)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting counselor ${counselor.name}:`, error);
        continue;
      }

      console.log(`✅ Added counselor: ${counselor.name}`);

      // Add availability for each counselor
      const availability = [
        { counselorId: data.id, dayOfWeek: "Monday", startTime: "09:00", endTime: "17:00" },
        { counselorId: data.id, dayOfWeek: "Tuesday", startTime: "09:00", endTime: "17:00" },
        { counselorId: data.id, dayOfWeek: "Wednesday", startTime: "09:00", endTime: "17:00" },
        { counselorId: data.id, dayOfWeek: "Thursday", startTime: "09:00", endTime: "17:00" },
        { counselorId: data.id, dayOfWeek: "Friday", startTime: "09:00", endTime: "15:00" },
      ];

      for (const avail of availability) {
        const { error: availError } = await supabase
          .from('counselor_availability')
          .insert(avail);

        if (availError) {
          console.error(`Error adding availability for ${counselor.name}:`, availError);
        }
      }
    }

    console.log('✅ All counselors and availability data added successfully!');

  } catch (error) {
    console.error('Error setting up counselors:', error);
  }
}

populateCounselors();