import { createClient } from '@supabase/supabase-js';

async function populateMentors() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Adding mentors to Supabase database...');

  const mentors = [
    {
      name: "Lt. Sofia Rodriguez",
      title: "Navy Lieutenant", 
      company: "U.S. Navy",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 47,
      years_experience: 8,
      location: "Jacksonville, FL",
      expertise: ["Naval Operations", "Maritime Strategy", "Personnel Management"],
      bio: "I manage operations aboard naval vessels and lead teams at sea. I can guide you through Navy career opportunities!",
      cluster_id: 1, // Navy
      cluster_name: "Navy",
      keywords: ["navy", "ship", "sailor", "ocean", "service", "water", "sea", "maritime"]
    },
    {
      name: "Ens. Lily Nguyen",
      title: "Coast Guard Ensign",
      company: "U.S. Coast Guard", 
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 46,
      years_experience: 5,
      location: "Miami, FL",
      expertise: ["Maritime Safety", "Search & Rescue", "Law Enforcement"],
      bio: "I conduct maritime search and rescue operations and enforce federal laws at sea. I can guide you toward Coast Guard careers!",
      cluster_id: 2, // Coast Guard
      cluster_name: "Coast Guard",
      keywords: ["coast guard", "rescue", "maritime", "patrol", "service", "water", "ocean", "sea"]
    },
    {
      name: "Lt. James Cooper",
      title: "Marine Corps Lieutenant",
      company: "U.S. Marine Corps",
      avatar_url: "/mentor-avatars/default-avatar.jpg", 
      rating: 48,
      years_experience: 7,
      location: "Jacksonville, FL",
      expertise: ["Combat Operations", "Strategic Planning", "Team Leadership"],
      bio: "I lead combat operations and train elite forces for specialized missions. I can help you understand Marine Corps career paths!",
      cluster_id: 3, // Marine Corps
      cluster_name: "Marine Corps", 
      keywords: ["marines", "corps", "discipline", "mission", "service", "military", "combat"]
    },
    {
      name: "Sarah Chen",
      title: "Financial Advisor",
      company: "Wealth Management Partners",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 45,
      years_experience: 6,
      location: "Miami, FL", 
      expertise: ["Investment Planning", "Retirement Strategies", "Financial Analysis"],
      bio: "I help clients build wealth through strategic financial planning and investment management. Let me show you the path to financial advisory success!",
      cluster_id: 4, // Finance
      cluster_name: "Finance",
      keywords: ["finance", "money", "investment", "wealth", "advisor", "planning", "stocks", "banking"]
    },
    {
      name: "Dr. Maya Fields",
      title: "Environmental Scientist",
      company: "EcoResearch Institute", 
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 48,
      years_experience: 12,
      location: "Gainesville, FL",
      expertise: ["Climate Research", "Environmental Policy", "Sustainability"],
      bio: "I research climate change impacts and develop environmental solutions. I can help you navigate careers in environmental science and sustainability!",
      cluster_id: 5, // Health Science (we'll update this to a better cluster later)
      cluster_name: "Health Science",
      keywords: ["environment", "science", "research", "climate", "sustainability", "nature", "ecology"]
    },
    {
      name: "Marcus Johnson",
      title: "Software Engineer",
      company: "TechFlow Solutions",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 47,
      years_experience: 9,
      location: "Orlando, FL",
      expertise: ["Full-Stack Development", "Cloud Architecture", "AI/ML"],
      bio: "I build scalable web applications and work with cutting-edge AI technology. I can guide you through the exciting world of software development!",
      cluster_id: 6, // Information Technology
      cluster_name: "Information Technology", 
      keywords: ["programming", "software", "tech", "coding", "computer", "ai", "development", "web"]
    }
  ];

  try {
    // Insert mentors one by one to handle any duplicates gracefully
    for (const mentor of mentors) {
      const { data, error } = await supabase
        .from('mentors')
        .insert(mentor)
        .select();

      if (error) {
        console.log(`Note: ${mentor.name} may already exist in database`);
      } else {
        console.log(`✅ Added mentor: ${mentor.name}`);
      }
    }

    // Test mentor search functionality
    console.log('\nTesting mentor search...');
    const { data: oceanMentors } = await supabase
      .from('mentors')
      .select('*')
      .or('keywords.cs.{"ocean"},bio.ilike.%ocean%,keywords.cs.{"water"}');

    console.log(`Found ${oceanMentors?.length || 0} mentors for "ocean" search`);

    console.log('✅ Mentor data population completed!');

  } catch (error) {
    console.error('Error populating mentors:', error);
  }
}

populateMentors();