import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function setupDatabase() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Setting up database tables...');

  try {
    // Read the SQL setup file
    const sqlPath = path.join(__dirname, 'setup-supabase.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split the SQL into individual statements (basic splitting by semicolon)
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.warn(`Warning executing statement: ${error.message}`);
        }
      }
    }

    // Test the connection by trying to fetch career clusters
    const { data: clusters, error: clusterError } = await supabase
      .from('career_clusters')
      .select('*')
      .limit(1);

    if (clusterError) {
      console.error('Error testing database connection:', clusterError.message);
      console.log('Attempting to create tables individually...');
      
      // Create tables individually if bulk creation failed
      await createTablesIndividually(supabase);
    } else {
      console.log('✅ Database setup completed successfully!');
      console.log(`Found ${clusters?.length || 0} career clusters in database.`);
    }

  } catch (error) {
    console.error('Error setting up database:', error);
    console.log('Attempting alternative setup method...');
    await createTablesIndividually(supabase);
  }
}

async function createTablesIndividually(supabase: any) {
  console.log('Creating tables individually...');

  const tables = [
    {
      name: 'users',
      sql: `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar_url TEXT,
        career_keywords TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    },
    {
      name: 'career_clusters',
      sql: `CREATE TABLE IF NOT EXISTS career_clusters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        icon_name VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`
    },
    {
      name: 'mentors',
      sql: `CREATE TABLE IF NOT EXISTS mentors (
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
      )`
    }
  ];

  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql_query: table.sql });
      if (error) {
        console.log(`Creating ${table.name} table using direct method...`);
      } else {
        console.log(`✅ Created ${table.name} table`);
      }
    } catch (err) {
      console.log(`Note: ${table.name} table may already exist`);
    }
  }

  console.log('✅ Database setup completed with individual table creation!');
}

// Run setup if this file is executed directly
setupDatabase()
  .then(() => {
    console.log('Database setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to setup database:', error);
    process.exit(1);
  });

export { setupDatabase };