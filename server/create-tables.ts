import { createClient } from '@supabase/supabase-js';

async function createTables() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Testing Supabase connection and creating initial data...');

  try {
    // Try to insert career clusters data directly - table will be created automatically by Supabase
    const clusters = [
      { name: 'Agriculture, Food, & Natural Resources', category: 'florida', description: 'Careers in agriculture and natural resources', icon_name: 'ri-plant-line' },
      { name: 'Navy', category: 'military', description: 'Careers in the U.S. Navy', icon_name: 'ri-ship-line' },
      { name: 'Coast Guard', category: 'military', description: 'Careers in the U.S. Coast Guard', icon_name: 'ri-lifebuoy-line' },
      { name: 'Finance', category: 'florida', description: 'Careers in financial services', icon_name: 'ri-money-dollar-circle-line' }
    ];

    console.log('Inserting career clusters...');
    const { data: insertedClusters, error: clusterError } = await supabase
      .from('career_clusters')
      .insert(clusters)
      .select();

    if (clusterError) {
      console.log('Career clusters table may not exist, error:', clusterError.message);
      console.log('Please create the tables manually in your Supabase dashboard using the SQL editor.');
      return;
    }

    console.log(`✅ Successfully inserted ${insertedClusters?.length || 0} career clusters`);

    // Test reading the data
    const { data: readClusters, error: readError } = await supabase
      .from('career_clusters')
      .select('*');

    if (readError) {
      console.error('Error reading career clusters:', readError.message);
    } else {
      console.log(`✅ Successfully read ${readClusters?.length || 0} career clusters from database`);
    }

  } catch (error) {
    console.error('Error:', error);
    console.log('\nPlease create the tables manually in your Supabase dashboard:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Click on "SQL Editor" in the sidebar');
    console.log('3. Run the SQL from setup-supabase.sql file');
  }
}

createTables();