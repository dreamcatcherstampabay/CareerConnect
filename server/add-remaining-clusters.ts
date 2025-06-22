import { createClient } from '@supabase/supabase-js';

async function addRemainingClusters() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Adding remaining career clusters...');

  const additionalClusters = [
    // Remaining Florida Career Clusters
    { name: 'Agriculture, Food, & Natural Resources', category: 'florida', description: 'Careers in agriculture and natural resources', icon_name: 'ri-plant-line' },
    { name: 'Architecture & Construction', category: 'florida', description: 'Careers in building design and construction', icon_name: 'ri-building-line' },
    { name: 'Arts, A/V Technology & Communication', category: 'florida', description: 'Careers in creative and media fields', icon_name: 'ri-movie-line' },
    { name: 'Business Management & Administration', category: 'florida', description: 'Careers in business operations and leadership', icon_name: 'ri-user-settings-line' },
    { name: 'Education & Training', category: 'florida', description: 'Careers in teaching and training', icon_name: 'ri-graduation-cap-line' },
    { name: 'Energy', category: 'florida', description: 'Careers in energy production and management', icon_name: 'ri-flashlight-line' },
    { name: 'Engineering & Technology Education', category: 'florida', description: 'Careers in engineering and technology development', icon_name: 'ri-tools-line' },
    { name: 'Government & Public Administration', category: 'florida', description: 'Careers in public service', icon_name: 'ri-government-line' },
    { name: 'Hospitality & Tourism', category: 'florida', description: 'Careers in travel and hospitality', icon_name: 'ri-hotel-line' },
    { name: 'Human Services', category: 'florida', description: 'Careers in social services', icon_name: 'ri-team-line' },
    { name: 'Law, Public Safety & Security', category: 'florida', description: 'Careers in legal and safety fields', icon_name: 'ri-shield-check-line' },
    { name: 'Manufacturing', category: 'florida', description: 'Careers in product manufacturing', icon_name: 'ri-robot-line' },
    { name: 'Marketing, Sales, & Service', category: 'florida', description: 'Careers in marketing and sales', icon_name: 'ri-store-2-line' },
    { name: 'Transportation, Distribution, & Logistics', category: 'florida', description: 'Careers in transportation and logistics', icon_name: 'ri-truck-line' },
    
    // Remaining Military Branches
    { name: 'Army', category: 'military', description: 'Careers in the U.S. Army', icon_name: 'ri-shield-star-line' },
    { name: 'Air Force', category: 'military', description: 'Careers in the U.S. Air Force', icon_name: 'ri-plane-line' },
    { name: 'Space Force', category: 'military', description: 'Careers in the U.S. Space Force', icon_name: 'ri-rocket-line' }
  ];

  try {
    // Insert each cluster, handling duplicates gracefully
    for (const cluster of additionalClusters) {
      const { data, error } = await supabase
        .from('career_clusters')
        .insert(cluster)
        .select();

      if (error) {
        console.log(`Note: ${cluster.name} may already exist`);
      } else {
        console.log(`✅ Added: ${cluster.name}`);
      }
    }

    // Get final count
    const { data: allClusters } = await supabase
      .from('career_clusters')
      .select('*');

    console.log(`\n✅ Database now contains ${allClusters?.length || 0} total career clusters`);

    // Show breakdown by category
    const florida = allClusters?.filter(c => c.category === 'florida').length || 0;
    const military = allClusters?.filter(c => c.category === 'military').length || 0;
    
    console.log(`   - Florida clusters: ${florida}`);
    console.log(`   - Military branches: ${military}`);

  } catch (error) {
    console.error('Error adding clusters:', error);
  }
}

addRemainingClusters();