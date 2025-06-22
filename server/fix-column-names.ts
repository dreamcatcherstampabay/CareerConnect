import { createClient } from '@supabase/supabase-js';

async function fixColumnNames() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Fixing database column names to match schema...');

  try {
    // Add the correctly named columns that the TypeScript schema expects
    console.log('Adding avatarUrl column to users table...');
    await supabase.rpc('exec_sql', { 
      sql_query: `ALTER TABLE users ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;` 
    });

    console.log('Adding clusterName column to mentors table...');
    await supabase.rpc('exec_sql', { 
      sql_query: `ALTER TABLE mentors ADD COLUMN IF NOT EXISTS "clusterName" VARCHAR(255);` 
    });

    console.log('Adding clusterId column to mentors table...');
    await supabase.rpc('exec_sql', { 
      sql_query: `ALTER TABLE mentors ADD COLUMN IF NOT EXISTS "clusterId" INTEGER;` 
    });

    console.log('Adding yearsExperience column to mentors table...');
    await supabase.rpc('exec_sql', { 
      sql_query: `ALTER TABLE mentors ADD COLUMN IF NOT EXISTS "yearsExperience" INTEGER DEFAULT 0;` 
    });

    console.log('Adding avatarUrl column to mentors table...');
    await supabase.rpc('exec_sql', { 
      sql_query: `ALTER TABLE mentors ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;` 
    });

    console.log('Adding careerKeywords column to users table...');
    await supabase.rpc('exec_sql', { 
      sql_query: `ALTER TABLE users ADD COLUMN IF NOT EXISTS "careerKeywords" TEXT[] DEFAULT '{}';` 
    });

    // Copy data from old columns to new columns if they exist
    console.log('Copying data from old column names to new ones...');
    
    await supabase.rpc('exec_sql', { 
      sql_query: `UPDATE users SET "avatarUrl" = avatar_url WHERE avatar_url IS NOT NULL AND "avatarUrl" IS NULL;` 
    });

    await supabase.rpc('exec_sql', { 
      sql_query: `UPDATE users SET "careerKeywords" = career_keywords WHERE career_keywords IS NOT NULL AND "careerKeywords" IS NULL;` 
    });

    await supabase.rpc('exec_sql', { 
      sql_query: `UPDATE mentors SET "avatarUrl" = avatar_url WHERE avatar_url IS NOT NULL AND "avatarUrl" IS NULL;` 
    });

    await supabase.rpc('exec_sql', { 
      sql_query: `UPDATE mentors SET "clusterName" = cluster_name WHERE cluster_name IS NOT NULL AND "clusterName" IS NULL;` 
    });

    await supabase.rpc('exec_sql', { 
      sql_query: `UPDATE mentors SET "clusterId" = cluster_id WHERE cluster_id IS NOT NULL AND "clusterId" IS NULL;` 
    });

    await supabase.rpc('exec_sql', { 
      sql_query: `UPDATE mentors SET "yearsExperience" = years_experience WHERE years_experience IS NOT NULL AND "yearsExperience" IS NULL;` 
    });

    console.log('✅ Database schema fixed successfully!');

    // Test user creation
    console.log('Testing user creation...');
    const testUser = {
      username: 'schema_test_user',
      password: 'test123',
      name: 'Schema Test',
      email: 'schema@test.com',
      avatarUrl: null,
      careerKeywords: []
    };

    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select();

    if (error) {
      console.error('Test user creation failed:', error.message);
    } else {
      console.log('✅ Test user created successfully!');
      
      // Clean up test user
      await supabase.from('users').delete().eq('username', 'schema_test_user');
    }

  } catch (error) {
    console.error('Error fixing schema:', error);
  }
}

fixColumnNames();