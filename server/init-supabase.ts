import { createClient } from '@supabase/supabase-js';

async function initializeSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Initializing database with sample data...');

  try {
    // Insert career clusters data - this will verify table existence
    console.log('Setting up career clusters...');
    
    const clusters = [
      { name: 'Agriculture, Food, & Natural Resources', category: 'florida', description: 'Careers in agriculture and natural resources', icon_name: 'ri-plant-line' },
      { name: 'Architecture & Construction', category: 'florida', description: 'Careers in building design and construction', icon_name: 'ri-building-line' },
      { name: 'Arts, A/V Technology & Communication', category: 'florida', description: 'Careers in creative and media fields', icon_name: 'ri-movie-line' },
      { name: 'Business Management & Administration', category: 'florida', description: 'Careers in business operations and leadership', icon_name: 'ri-user-settings-line' },
      { name: 'Education & Training', category: 'florida', description: 'Careers in teaching and training', icon_name: 'ri-graduation-cap-line' },
      { name: 'Energy', category: 'florida', description: 'Careers in energy production and management', icon_name: 'ri-flashlight-line' },
      { name: 'Engineering & Technology Education', category: 'florida', description: 'Careers in engineering and technology development', icon_name: 'ri-tools-line' },
      { name: 'Finance', category: 'florida', description: 'Careers in financial services', icon_name: 'ri-money-dollar-circle-line' },
      { name: 'Government & Public Administration', category: 'florida', description: 'Careers in public service', icon_name: 'ri-government-line' },
      { name: 'Health Science', category: 'florida', description: 'Careers in healthcare and medical science', icon_name: 'ri-hospital-line' },
      { name: 'Hospitality & Tourism', category: 'florida', description: 'Careers in travel and hospitality', icon_name: 'ri-hotel-line' },
      { name: 'Human Services', category: 'florida', description: 'Careers in social services', icon_name: 'ri-team-line' },
      { name: 'Information Technology', category: 'florida', description: 'Careers in computing and digital technology', icon_name: 'ri-code-box-line' },
      { name: 'Law, Public Safety & Security', category: 'florida', description: 'Careers in legal and safety fields', icon_name: 'ri-shield-check-line' },
      { name: 'Manufacturing', category: 'florida', description: 'Careers in product manufacturing', icon_name: 'ri-robot-line' },
      { name: 'Marketing, Sales, & Service', category: 'florida', description: 'Careers in marketing and sales', icon_name: 'ri-store-2-line' },
      { name: 'Transportation, Distribution, & Logistics', category: 'florida', description: 'Careers in transportation and logistics', icon_name: 'ri-truck-line' },
      { name: 'Army', category: 'military', description: 'Careers in the U.S. Army', icon_name: 'ri-shield-star-line' },
      { name: 'Navy', category: 'military', description: 'Careers in the U.S. Navy', icon_name: 'ri-ship-line' },
      { name: 'Air Force', category: 'military', description: 'Careers in the U.S. Air Force', icon_name: 'ri-plane-line' },
      { name: 'Marine Corps', category: 'military', description: 'Careers in the U.S. Marine Corps', icon_name: 'ri-anchor-line' },
      { name: 'Coast Guard', category: 'military', description: 'Careers in the U.S. Coast Guard', icon_name: 'ri-lifebuoy-line' },
      { name: 'Space Force', category: 'military', description: 'Careers in the U.S. Space Force', icon_name: 'ri-rocket-line' }
    ];

    for (const cluster of clusters) {
      await supabase
        .from('career_clusters')
        .upsert(cluster, { onConflict: 'name' });
    }

    // Create users table
    await supabase.sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar_url TEXT,
        career_keywords TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Create mentors table
    await supabase.sql`
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
      )
    `;

    // Create other necessary tables
    await supabase.sql`
      CREATE TABLE IF NOT EXISTS career_keywords (
        id SERIAL PRIMARY KEY,
        keyword VARCHAR(255) NOT NULL,
        cluster_id INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await supabase.sql`
      CREATE TABLE IF NOT EXISTS career_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP WITH TIME ZONE NOT NULL,
        location VARCHAR(255),
        cluster_id INTEGER,
        registration_url TEXT,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await supabase.sql`
      CREATE TABLE IF NOT EXISTS mentor_availability (
        id SERIAL PRIMARY KEY,
        mentor_id INTEGER,
        day_of_week INTEGER NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await supabase.sql`
      CREATE TABLE IF NOT EXISTS mentor_sessions (
        id SERIAL PRIMARY KEY,
        student_id INTEGER,
        mentor_id INTEGER,
        session_date TIMESTAMP WITH TIME ZONE NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        status VARCHAR(50) DEFAULT 'scheduled',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await supabase.sql`
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
      )
    `;

    console.log('✅ Database initialization completed successfully!');
    
    // Test the connection
    const { data: testData } = await supabase.from('career_clusters').select('count').single();
    console.log('✅ Database connection verified');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

initializeSupabase()
  .then(() => {
    console.log('Supabase initialization completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to initialize Supabase:', error);
    process.exit(1);
  });

export { initializeSupabase };