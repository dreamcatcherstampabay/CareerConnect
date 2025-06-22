import { createClient } from '@supabase/supabase-js';

async function addMoreMentors() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Get cluster IDs for reference
  const { data: clusters } = await supabase.from('career_clusters').select('id, name');
  const clusterMap = new Map(clusters?.map(c => [c.name, c.id]) || []);

  const additionalMentors = [
    // Agriculture, Food, & Natural Resources
    {
      name: "Dr. Carlos Martinez",
      title: "Agricultural Engineer",
      company: "Florida Citrus Research Institute",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 46,
      years_experience: 11,
      location: "Lake Alfred, FL",
      expertise: ["Crop Management", "Irrigation Systems", "Sustainable Farming"],
      bio: "I develop innovative farming techniques for Florida's citrus industry. I can help you explore careers in agricultural engineering and sustainable food production.",
      cluster_id: clusterMap.get('Agriculture, Food, & Natural Resources'),
      cluster_name: "Agriculture, Food, & Natural Resources",
      keywords: ["agriculture", "farming", "food", "crops", "environment", "sustainability", "engineering"]
    },

    // Architecture & Construction
    {
      name: "Lisa Thompson",
      title: "Licensed Architect",
      company: "Thompson Design Group",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 47,
      years_experience: 13,
      location: "Miami, FL",
      expertise: ["Sustainable Design", "Commercial Buildings", "Project Management"],
      bio: "I design eco-friendly buildings and manage large construction projects. I can guide you through architecture and construction career paths.",
      cluster_id: clusterMap.get('Architecture & Construction'),
      cluster_name: "Architecture & Construction",
      keywords: ["architecture", "construction", "design", "building", "engineering", "planning", "sustainable"]
    },

    // Arts, A/V Technology & Communication
    {
      name: "Miguel Santos",
      title: "Creative Director",
      company: "Sunshine Media Productions",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 45,
      years_experience: 8,
      location: "Orlando, FL",
      expertise: ["Video Production", "Digital Marketing", "Brand Strategy"],
      bio: "I create multimedia campaigns for major brands and entertainment companies. I can help you break into the creative and media industry.",
      cluster_id: clusterMap.get('Arts, A/V Technology & Communication'),
      cluster_name: "Arts, A/V Technology & Communication",
      keywords: ["art", "media", "creative", "video", "design", "communication", "marketing", "digital"]
    },

    // Education & Training
    {
      name: "Prof. Jennifer Williams",
      title: "Education Professor",
      company: "University of Central Florida",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 49,
      years_experience: 15,
      location: "Orlando, FL",
      expertise: ["Curriculum Development", "Educational Technology", "Teacher Training"],
      bio: "I train future educators and develop innovative teaching methods. I can guide you toward a rewarding career in education.",
      cluster_id: clusterMap.get('Education & Training'),
      cluster_name: "Education & Training",
      keywords: ["education", "teaching", "training", "learning", "curriculum", "school", "university"]
    },

    // Energy
    {
      name: "Dr. Ahmed Hassan",
      title: "Solar Energy Engineer",
      company: "Florida Solar Solutions",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 48,
      years_experience: 10,
      location: "Tampa, FL",
      expertise: ["Renewable Energy", "Solar Panel Design", "Energy Efficiency"],
      bio: "I design solar energy systems for residential and commercial use. I can help you explore the growing field of renewable energy.",
      cluster_id: clusterMap.get('Energy'),
      cluster_name: "Energy",
      keywords: ["energy", "solar", "renewable", "engineering", "sustainability", "environment", "technology"]
    },

    // Engineering & Technology Education
    {
      name: "Robert Kim",
      title: "Robotics Engineer",
      company: "Advanced Automation Systems",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 47,
      years_experience: 9,
      location: "Melbourne, FL",
      expertise: ["Robotics", "Automation", "Machine Learning"],
      bio: "I develop robotic systems for manufacturing and aerospace applications. I can guide you through engineering and technology careers.",
      cluster_id: clusterMap.get('Engineering & Technology Education'),
      cluster_name: "Engineering & Technology Education",
      keywords: ["engineering", "robotics", "technology", "automation", "programming", "mechanical", "aerospace"]
    },

    // Government & Public Administration
    {
      name: "Maria Gonzalez",
      title: "City Manager",
      company: "City of Coral Gables",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 46,
      years_experience: 12,
      location: "Coral Gables, FL",
      expertise: ["Public Policy", "Municipal Management", "Community Development"],
      bio: "I manage city operations and develop policies that improve community life. I can help you understand careers in public service.",
      cluster_id: clusterMap.get('Government & Public Administration'),
      cluster_name: "Government & Public Administration",
      keywords: ["government", "public", "administration", "policy", "community", "management", "service"]
    },

    // Hospitality & Tourism
    {
      name: "David Park",
      title: "Hotel General Manager",
      company: "Oceanfront Resort & Spa",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 45,
      years_experience: 14,
      location: "Key West, FL",
      expertise: ["Hotel Operations", "Guest Services", "Revenue Management"],
      bio: "I manage luxury resort operations and create exceptional guest experiences. I can guide you through hospitality and tourism careers.",
      cluster_id: clusterMap.get('Hospitality & Tourism'),
      cluster_name: "Hospitality & Tourism",
      keywords: ["hospitality", "tourism", "hotel", "service", "management", "travel", "guest", "resort"]
    },

    // Human Services
    {
      name: "Dr. Patricia Lee",
      title: "Licensed Clinical Social Worker",
      company: "Community Care Center",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 48,
      years_experience: 16,
      location: "Jacksonville, FL",
      expertise: ["Mental Health Counseling", "Family Therapy", "Community Outreach"],
      bio: "I provide mental health services and coordinate community support programs. I can help you explore careers in human services.",
      cluster_id: clusterMap.get('Human Services'),
      cluster_name: "Human Services",
      keywords: ["counseling", "social work", "mental health", "community", "therapy", "support", "family"]
    },

    // Law, Public Safety & Security
    {
      name: "Detective Michael Brown",
      title: "Criminal Investigator",
      company: "Miami-Dade Police Department",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 47,
      years_experience: 11,
      location: "Miami, FL",
      expertise: ["Criminal Investigation", "Forensics", "Law Enforcement"],
      bio: "I investigate complex criminal cases and work with forensic evidence. I can guide you through law enforcement and criminal justice careers.",
      cluster_id: clusterMap.get('Law, Public Safety & Security'),
      cluster_name: "Law, Public Safety & Security",
      keywords: ["law", "police", "criminal", "justice", "investigation", "forensics", "security", "enforcement"]
    },

    // Manufacturing
    {
      name: "Sandra Rodriguez",
      title: "Production Manager",
      company: "Aerospace Components Inc.",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 46,
      years_experience: 10,
      location: "Melbourne, FL",
      expertise: ["Lean Manufacturing", "Quality Control", "Process Improvement"],
      bio: "I oversee production of precision aerospace components and implement efficient manufacturing processes.",
      cluster_id: clusterMap.get('Manufacturing'),
      cluster_name: "Manufacturing",
      keywords: ["manufacturing", "production", "quality", "aerospace", "engineering", "process", "factory"]
    },

    // Marketing, Sales, & Service
    {
      name: "Jessica Taylor",
      title: "Digital Marketing Manager",
      company: "Growth Marketing Agency",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 45,
      years_experience: 7,
      location: "Fort Lauderdale, FL",
      expertise: ["Digital Marketing", "Social Media Strategy", "Brand Management"],
      bio: "I develop digital marketing campaigns that drive business growth and build brand awareness.",
      cluster_id: clusterMap.get('Marketing, Sales, & Service'),
      cluster_name: "Marketing, Sales, & Service",
      keywords: ["marketing", "sales", "digital", "social media", "brand", "advertising", "strategy"]
    },

    // Transportation, Distribution, & Logistics
    {
      name: "Carlos Bennett",
      title: "Logistics Coordinator",
      company: "Port of Miami",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 46,
      years_experience: 9,
      location: "Miami, FL",
      expertise: ["Supply Chain Management", "Port Operations", "International Trade"],
      bio: "I coordinate cargo operations at one of the busiest ports in the US, managing complex logistics networks.",
      cluster_id: clusterMap.get('Transportation, Distribution, & Logistics'),
      cluster_name: "Transportation, Distribution, & Logistics",
      keywords: ["logistics", "transportation", "supply chain", "shipping", "trade", "port", "distribution"]
    },

    // Army
    {
      name: "Sgt. First Class Tony Rivera",
      title: "Army NCO",
      company: "U.S. Army",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 48,
      years_experience: 12,
      location: "MacDill AFB, FL",
      expertise: ["Leadership Training", "Military Operations", "Personnel Development"],
      bio: "I train soldiers and lead military operations around the world. I can guide you through Army career opportunities.",
      cluster_id: clusterMap.get('Army'),
      cluster_name: "Army",
      keywords: ["army", "military", "soldier", "leadership", "training", "service", "defense"]
    },

    // Air Force
    {
      name: "Captain Sarah Mitchell",
      title: "Air Force Pilot",
      company: "U.S. Air Force",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 49,
      years_experience: 8,
      location: "MacDill AFB, FL",
      expertise: ["Aviation", "Flight Operations", "Mission Planning"],
      bio: "I fly military aircraft and lead complex missions. I can help you explore Air Force aviation and technical careers.",
      cluster_id: clusterMap.get('Air Force'),
      cluster_name: "Air Force",
      keywords: ["air force", "pilot", "aviation", "military", "flight", "aerospace", "service"]
    },

    // Space Force
    {
      name: "1st Lt. Kevin Zhang",
      title: "Space Systems Officer",
      company: "U.S. Space Force",
      avatar_url: "/mentor-avatars/default-avatar.jpg",
      rating: 47,
      years_experience: 4,
      location: "Patrick Space Force Base, FL",
      expertise: ["Satellite Operations", "Space Technology", "Cybersecurity"],
      bio: "I manage satellite communications and space-based defense systems. I can guide you through Space Force technology careers.",
      cluster_id: clusterMap.get('Space Force'),
      cluster_name: "Space Force",
      keywords: ["space force", "satellite", "space", "technology", "cyber", "military", "aerospace"]
    }
  ];

  console.log('Adding mentors across all career clusters...');

  let successCount = 0;
  for (const mentor of additionalMentors) {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .insert(mentor)
        .select();

      if (error) {
        console.log(`Note: ${mentor.name} may already exist`);
      } else {
        console.log(`✅ Added: ${mentor.name} (${mentor.cluster_name})`);
        successCount++;
      }
    } catch (err) {
      console.log(`Error adding ${mentor.name}: ${err}`);
    }
  }

  // Get final mentor count
  const { data: allMentors } = await supabase.from('mentors').select('*');
  console.log(`\n✅ Database now contains ${allMentors?.length || 0} total mentors`);
  console.log(`   Added ${successCount} new mentors this session`);
}

addMoreMentors();