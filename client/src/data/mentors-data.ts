import { Mentor } from "@shared/schema";

// Default image path for mentors without specific images
const DEFAULT_AVATAR = "/mentor-avatars/default-avatar.jpg";

// Helper to complete missing mentor properties
const completeMentorData = (mentor: Partial<Omit<Mentor, "id">>) => {
  const locations = ["Tampa, FL", "Orlando, FL", "Miami, FL", "Jacksonville, FL", "Gainesville, FL"];
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9];
  
  return {
    ...mentor,
    avatarUrl: mentor.avatarUrl || DEFAULT_AVATAR,
    rating: mentor.rating || ratings[Math.floor(Math.random() * ratings.length)],
    location: mentor.location || locations[Math.floor(Math.random() * locations.length)],
    expertise: mentor.expertise || ["Mentoring", "Career Guidance", "Professional Development"],
  } as Omit<Mentor, "id">;
};

// Raw mentor data
const rawMentorData: Partial<Omit<Mentor, "id">>[] = [
  {
    name: "Dr. Maya Fields",
    title: "Environmental Scientist",
    clusterId: 1,
    clusterName: "Agriculture, Food, & Natural Resources",
    bio: "Specializes in sustainable farming practices and environmental conservation.",
    keywords: ["farming", "animals", "plants", "environment", "food"],
    avatarUrl: "/mentor-avatars/maya-fields.jpg",
    yearsExperience: 12,
    company: "Green Earth Research Institute",
    rating: 4.8,
    location: "Tampa, FL",
    expertise: ["Sustainable Agriculture", "Environmental Impact Assessment", "Conservation Biology"],
  },
  {
    name: "Carlos Bennett",
    title: "Civil Engineer",
    clusterId: 2,
    clusterName: "Architecture & Construction",
    bio: "Designs infrastructure projects with a focus on earthquake-resistant structures.",
    keywords: ["building", "tools", "design", "homes", "construction"],
    avatarUrl: "/mentor-avatars/carlos-bennett.jpg",
    yearsExperience: 15,
    company: "Bennett Infrastructure Solutions",
    rating: 4.9,
    location: "Orlando, FL",
    expertise: ["Structural Engineering", "Project Management", "Urban Planning"],
  },
  {
    name: "Lena Rosario",
    title: "Multimedia Artist",
    clusterId: 3,
    clusterName: "Arts, A/V Technology & Communications",
    bio: "Creates digital content across multiple platforms for major entertainment brands.",
    keywords: ["drawing", "music", "video", "writing", "speaking", "art", "creative", "design", "artist", "media", "film", "photography", "animation"],
    avatarUrl: DEFAULT_AVATAR,
    yearsExperience: 8,
    company: "Creative Vision Studios",
    rating: 4.7,
    location: "Miami, FL",
    expertise: ["Digital Art", "Animation", "Social Media Content"],
  },
  {
    name: "Thomas Kim",
    title: "Operations Manager",
    clusterId: 4,
    clusterName: "Business Management & Administration",
    bio: "Oversees daily operations for a Fortune 500 technology company.",
    keywords: ["money", "planning", "office", "manager", "teamwork", "business", "management", "administration", "operations", "leadership", "corporate", "executive", "strategy"],
    avatarUrl: null,
    yearsExperience: 10,
    company: "TechForward Enterprises"
  },
  {
    name: "Maria Nunez",
    title: "Teacher",
    clusterId: 5,
    clusterName: "Education & Training",
    bio: "Award-winning high school educator specializing in innovative STEM programs.",
    keywords: ["teaching", "classroom", "learning", "kids", "school", "education", "teacher", "instructor", "professor", "curriculum", "student", "tutor", "training", "stem"],
    avatarUrl: null,
    yearsExperience: 14,
    company: "Westside High School"
  },
  {
    name: "Devon Price",
    title: "Energy Technician",
    clusterId: 6,
    clusterName: "Energy",
    bio: "Installs and maintains renewable energy systems for commercial buildings.",
    keywords: ["electricity", "power", "solar", "wind", "energy"],
    avatarUrl: null,
    yearsExperience: 7,
    company: "Bright Future Energy"
  },
  {
    name: "Angela Leung",
    title: "Robotics Engineer",
    clusterId: 7,
    clusterName: "Engineering & Technology",
    bio: "Designs and develops automation solutions for manufacturing industries.",
    keywords: ["machines", "coding", "design", "invent", "robotics", "engineering", "mechanical", "electrical", "automation", "technology", "systems", "technical", "innovation", "mathematics"],
    avatarUrl: null,
    yearsExperience: 9,
    company: "Innovation Robotics"
  },
  {
    name: "Raj Patel",
    title: "Financial Advisor",
    clusterId: 8,
    clusterName: "Finance",
    bio: "Helps individuals and businesses plan for financial success and security.",
    keywords: ["banking", "money", "budget", "saving", "investing"],
    avatarUrl: null,
    yearsExperience: 11,
    company: "Secure Wealth Management"
  },
  {
    name: "Jasmine Carter",
    title: "City Council Member",
    clusterId: 9,
    clusterName: "Government & Public Administration",
    bio: "Works on policy development and community improvement initiatives.",
    keywords: ["law", "voting", "rules", "community", "leadership"],
    avatarUrl: null,
    yearsExperience: 6,
    company: "Oakville City Government"
  },
  {
    name: "Dr. Isaiah Greene",
    title: "Pediatrician",
    clusterId: 10,
    clusterName: "Health Science",
    bio: "Provides comprehensive healthcare for children from newborns to adolescents.",
    keywords: ["doctor", "nurse", "medicine", "hospital", "health", "healthcare", "medical", "physician", "pediatrics", "clinic", "patient care", "treatment", "diagnosis", "therapy"],
    avatarUrl: null,
    yearsExperience: 16,
    company: "Children's Wellness Center"
  },
  {
    name: "Chloe Duval",
    title: "Hotel Director",
    clusterId: 11,
    clusterName: "Hospitality & Tourism",
    bio: "Manages luxury hotel operations and enhances guest experiences.",
    keywords: ["travel", "hotels", "food", "guests", "service"],
    avatarUrl: null,
    yearsExperience: 13,
    company: "Grand Plaza Hotels"
  },
  {
    name: "Darnell Reed",
    title: "Counselor",
    clusterId: 12,
    clusterName: "Human Services",
    bio: "Provides guidance and support for individuals facing personal challenges.",
    keywords: ["helping", "family", "support", "social work", "care"],
    avatarUrl: null,
    yearsExperience: 8,
    company: "Community Support Services"
  },
  {
    name: "Zoey Wang",
    title: "Software Developer",
    clusterId: 13,
    clusterName: "Information Technology",
    bio: "Creates innovative software solutions for healthcare applications.",
    keywords: ["computers", "apps", "code", "tech", "internet", "programming", "software", "web", "development", "coding", "engineering", "computer science", "data", "technology"],
    avatarUrl: null,
    yearsExperience: 7,
    company: "MedTech Solutions"
  },
  {
    name: "Nathaniel Brooks",
    title: "Police Officer",
    clusterId: 14,
    clusterName: "Law, Public Safety & Security",
    bio: "Serves the community through law enforcement and public safety initiatives.",
    keywords: ["police", "safety", "law", "fire", "protect"],
    avatarUrl: null,
    yearsExperience: 9,
    company: "Oakville Police Department"
  },
  {
    name: "Emily Ortiz",
    title: "Machine Operator",
    clusterId: 15,
    clusterName: "Manufacturing",
    bio: "Operates advanced machinery in precision manufacturing environments.",
    keywords: ["factory", "machines", "tools", "parts", "make"],
    avatarUrl: null,
    yearsExperience: 5,
    company: "Precision Products Manufacturing"
  },
  {
    name: "Jared Lewis",
    title: "Marketing Specialist",
    clusterId: 16,
    clusterName: "Marketing, Sales & Service",
    bio: "Develops strategic marketing campaigns for consumer product companies.",
    keywords: ["selling", "ads", "store", "customer", "products"],
    avatarUrl: null,
    yearsExperience: 8,
    company: "Brand Elevate Marketing"
  },
  {
    name: "Kiana Thomas",
    title: "Logistics Coordinator",
    clusterId: 17,
    clusterName: "Transportation, Distribution & Logistics",
    bio: "Manages supply chain logistics for international shipping operations.",
    keywords: ["trucks", "travel", "planes", "packages", "delivery"],
    avatarUrl: null,
    yearsExperience: 7,
    company: "Global Transit Solutions"
  },
  {
    name: "Sgt. Leo Morales",
    title: "Army Sergeant",
    clusterId: 18,
    clusterName: "Military",
    bio: "Leads tactical operations and trains new recruits in specialized skills.",
    keywords: ["soldier", "army", "navy", "discipline", "mission"],
    avatarUrl: null,
    yearsExperience: 10,
    company: "U.S. Army"
  }
];

// Apply the helper function to ensure all mentors have the required fields
export const mentorsData: Omit<Mentor, "id">[] = rawMentorData.map(completeMentorData);