import { 
  users, User, InsertUser, 
  careerClusters, CareerCluster, InsertCareerCluster,
  careerKeywords, CareerKeyword, InsertCareerKeyword,
  mentors, Mentor, InsertMentor,
  mentorAvailability, MentorAvailability, InsertMentorAvailability,
  mentorSessions, MentorSession, InsertMentorSession,
  notifications, Notification, InsertNotification,
  careerEvents, CareerEvent, InsertCareerEvent,
  counselors, Counselor, InsertCounselor,
  counselorAvailability, CounselorAvailability, InsertCounselorAvailability,
  counselorSessions, CounselorSession, InsertCounselorSession,
  newsletterSubscriptions, NewsletterSubscription, InsertNewsletterSubscription
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Define the storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User>;
  updateUserKeywords(id: number, keywords: string[]): Promise<User>;
  
  // Career Clusters
  getCareerClusters(): Promise<CareerCluster[]>;
  getCareerClusterById(id: number): Promise<CareerCluster | undefined>;
  getCareerClustersByCategory(category: string): Promise<CareerCluster[]>;
  createCareerCluster(cluster: InsertCareerCluster): Promise<CareerCluster>;
  updateCareerClusterIcon(id: number, iconName: string): Promise<CareerCluster>;
  searchCareerClustersByKeyword(keyword: string): Promise<CareerCluster[]>;
  
  // Career Keywords
  getCareerKeywords(): Promise<CareerKeyword[]>;
  getCareerKeywordsByClusterId(clusterId: number): Promise<CareerKeyword[]>;
  createCareerKeyword(keyword: InsertCareerKeyword): Promise<CareerKeyword>;
  searchCareerKeywords(search: string): Promise<CareerKeyword[]>;
  
  // Career Events
  getCareerEvents(): Promise<CareerEvent[]>;
  getCareerEventById(id: number): Promise<CareerEvent | undefined>;
  getUpcomingCareerEvents(): Promise<CareerEvent[]>;
  getCareerEventsByClusterId(clusterId: number): Promise<CareerEvent[]>;
  createCareerEvent(event: InsertCareerEvent): Promise<CareerEvent>;
  
  // Mentors
  getMentors(): Promise<Mentor[]>;
  getMentorById(id: number): Promise<Mentor | undefined>;
  getMentorsByClusterId(clusterId: number): Promise<Mentor[]>;
  createMentor(mentor: InsertMentor): Promise<Mentor>;
  searchMentorsByKeyword(keyword: string): Promise<Mentor[]>;
  
  // Mentor Availability
  getMentorAvailability(mentorId: number): Promise<MentorAvailability[]>;
  createMentorAvailability(availability: InsertMentorAvailability): Promise<MentorAvailability>;
  
  // Mentor Sessions
  getMentorSessions(studentId: number): Promise<MentorSession[]>;
  getMentorSessionById(id: number): Promise<MentorSession | undefined>;
  createMentorSession(session: InsertMentorSession): Promise<MentorSession>;
  updateMentorSessionStatus(id: number, status: string): Promise<MentorSession>;
  
  // Notifications
  getNotifications(userId: number): Promise<Notification[]>;
  getUnreadNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification>;
  deleteNotification(id: number): Promise<void>;
  
  // Generate notifications
  generateSessionNotifications(
    sessionId: number, 
    mentorName: string, 
    sessionDate: Date, 
    studentId: number
  ): Promise<void>;
  
  generateEventNotification(
    eventId: number,
    eventTitle: string,
    eventDate: Date,
    userId: number
  ): Promise<void>;

  // Counselors
  getCounselors(): Promise<Counselor[]>;
  getCounselorById(id: number): Promise<Counselor | undefined>;
  createCounselor(counselor: InsertCounselor): Promise<Counselor>;
  updateCounselor(id: number, data: Partial<InsertCounselor>): Promise<Counselor>;

  // Counselor Availability
  getCounselorAvailability(counselorId: number): Promise<CounselorAvailability[]>;
  createCounselorAvailability(availability: InsertCounselorAvailability): Promise<CounselorAvailability>;

  // Counselor Sessions
  getCounselorSessions(studentId: number): Promise<CounselorSession[]>;
  getCounselorSessionById(id: number): Promise<CounselorSession | undefined>;
  createCounselorSession(session: InsertCounselorSession): Promise<CounselorSession>;
  updateCounselorSessionStatus(id: number, status: string): Promise<CounselorSession>;

  // Newsletter Subscriptions
  createNewsletterSubscription(email: string): Promise<NewsletterSubscription>;
  getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined>;
  unsubscribeNewsletter(email: string): Promise<void>;
  
  // Session storage
  sessionStore: any; // Type for SessionStore
}

// Memory Storage Implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private careerClusters: Map<number, CareerCluster>;
  private careerKeywords: Map<number, CareerKeyword>;
  private mentors: Map<number, Mentor>;
  private mentorAvailability: Map<number, MentorAvailability>;
  private mentorSessions: Map<number, MentorSession>;
  private notifications: Map<number, Notification>;
  private careerEvents: Map<number, CareerEvent>;
  private counselors: Map<number, Counselor>;
  private counselorAvailability: Map<number, CounselorAvailability>;
  private counselorSessions: Map<number, CounselorSession>;
  private newsletterSubscriptions: Map<number, NewsletterSubscription>;
  sessionStore: any;
  
  private currentUserId: number = 1;
  private currentClusterId: number = 1;
  private currentKeywordId: number = 1;
  private currentMentorId: number = 1;
  private currentAvailabilityId: number = 1;
  private currentSessionId: number = 1;
  private currentNotificationId: number = 1;
  private currentEventId: number = 1;
  private currentCounselorId: number = 1;
  private currentCounselorAvailabilityId: number = 1;
  private currentCounselorSessionId: number = 1;
  private currentNewsletterSubscriptionId: number = 1;
  
  constructor() {
    this.users = new Map();
    this.careerClusters = new Map();
    this.careerKeywords = new Map();
    this.mentors = new Map();
    this.mentorAvailability = new Map();
    this.mentorSessions = new Map();
    this.notifications = new Map();
    this.careerEvents = new Map();
    this.counselors = new Map();
    this.counselorAvailability = new Map();
    this.counselorSessions = new Map();
    this.newsletterSubscriptions = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Add Career Clusters
    const floridaClusters = [
      { name: "Agriculture, Food, & Natural Resources", category: "florida", description: "Careers in agriculture and natural resources", iconName: "ri-plant-line" },
      { name: "Architecture & Construction", category: "florida", description: "Careers in building design and construction", iconName: "ri-building-line" },
      { name: "Arts, A/V Technology & Communication", category: "florida", description: "Careers in creative and media fields", iconName: "ri-movie-line" },
      { name: "Business Management & Administration", category: "florida", description: "Careers in business operations and leadership", iconName: "ri-user-settings-line" },
      { name: "Education & Training", category: "florida", description: "Careers in teaching and training", iconName: "ri-graduation-cap-line" },
      { name: "Energy", category: "florida", description: "Careers in energy production and management", iconName: "ri-flashlight-line" },
      { name: "Engineering & Technology Education", category: "florida", description: "Careers in engineering and technology development", iconName: "ri-tools-line" },
      { name: "Finance", category: "florida", description: "Careers in financial services", iconName: "ri-money-dollar-circle-line" },
      { name: "Government & Public Administration", category: "florida", description: "Careers in public service", iconName: "ri-government-line" },
      { name: "Health Science", category: "florida", description: "Careers in healthcare and medical science", iconName: "ri-hospital-line" },
      { name: "Hospitality & Tourism", category: "florida", description: "Careers in travel and hospitality", iconName: "ri-hotel-line" },
      { name: "Human Services", category: "florida", description: "Careers in social services", iconName: "ri-team-line" },
      { name: "Information Technology", category: "florida", description: "Careers in computing and digital technology", iconName: "ri-code-box-line" },
      { name: "Law, Public Safety & Security", category: "florida", description: "Careers in legal and safety fields", iconName: "ri-shield-check-line" },
      { name: "Manufacturing", category: "florida", description: "Careers in product manufacturing", iconName: "ri-robot-line" },
      { name: "Marketing, Sales, & Service", category: "florida", description: "Careers in marketing and sales", iconName: "ri-store-2-line" },
      { name: "Transportation, Distribution, & Logistics", category: "florida", description: "Careers in transportation and logistics", iconName: "ri-truck-line" }
    ];
    
    const militaryCareers = [
      { name: "Army", category: "military", description: "Careers in the U.S. Army", iconName: "ri-shield-star-line" },
      { name: "Navy", category: "military", description: "Careers in the U.S. Navy", iconName: "ri-ship-line" },
      { name: "Air Force", category: "military", description: "Careers in the U.S. Air Force", iconName: "ri-plane-line" },
      { name: "Marine Corps", category: "military", description: "Careers in the U.S. Marine Corps", iconName: "ri-anchor-line" },
      { name: "Coast Guard", category: "military", description: "Careers in the U.S. Coast Guard", iconName: "ri-lifebuoy-line" },
      { name: "Space Force", category: "military", description: "Careers in the U.S. Space Force", iconName: "ri-rocket-line" }
    ];
    
    [...floridaClusters, ...militaryCareers].forEach(cluster => {
      this.createCareerCluster(cluster);
    });
    
    // Add some mentors for each Florida career cluster and military career
    const mentors = [
      // 1. Agriculture, Food, & Natural Resources
      {
        name: "Dr. Maya Fields",
        title: "Environmental Scientist",
        company: "Green Earth Research Institute",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 48, // 4.8 stars
        yearsExperience: 12,
        location: "Tampa, FL",
        expertise: ["Sustainable Agriculture", "Environmental Impact Assessment", "Conservation Biology"],
        bio: "I specialize in sustainable farming practices and environmental conservation. Let me help you explore green careers!",
        clusterId: 1,
        clusterName: "Agriculture, Food, & Natural Resources",
        keywords: ["farming", "animals", "plants", "environment", "food"]
      },
      
      // 2. Architecture & Construction
      {
        name: "Carlos Bennett",
        title: "Civil Engineer",
        company: "Bennett Infrastructure Solutions",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 49, // 4.9 stars
        yearsExperience: 15,
        location: "Orlando, FL",
        expertise: ["Structural Engineering", "Project Management", "Urban Planning"],
        bio: "I design infrastructure projects with a focus on earthquake-resistant structures. I can guide you through the engineering field.",
        clusterId: 2,
        clusterName: "Architecture & Construction",
        keywords: ["building", "tools", "design", "homes", "construction"]
      },
      
      // 3. Arts, A/V Technology & Communications
      {
        name: "Lena Rosario",
        title: "Multimedia Artist",
        company: "Creative Vision Studios",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 47, // 4.7 stars
        yearsExperience: 8,
        location: "Miami, FL",
        expertise: ["Digital Art", "Animation", "Social Media Content"],
        bio: "I create digital content across multiple platforms for major entertainment brands. Let me show you how to break into creative fields!",
        clusterId: 3,
        clusterName: "Arts, A/V Technology & Communications",
        keywords: ["drawing", "music", "video", "writing", "speaking"]
      },
      
      // 4. Business Management & Administration
      {
        name: "Thomas Kim",
        title: "Operations Manager",
        company: "TechForward Enterprises",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 46, // 4.6 stars
        yearsExperience: 10,
        location: "Jacksonville, FL",
        expertise: ["Strategic Planning", "Team Leadership", "Business Operations"],
        bio: "I oversee daily operations for a Fortune 500 technology company. I can help you understand what it takes to succeed in business management.",
        clusterId: 4,
        clusterName: "Business Management & Administration",
        keywords: ["money", "planning", "office", "manager", "teamwork"]
      },
      
      // 5. Education & Training
      {
        name: "Maria Nunez",
        title: "High School Teacher",
        company: "Westside High School",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 50, // 5.0 stars
        yearsExperience: 14,
        location: "Gainesville, FL",
        expertise: ["STEM Education", "Curriculum Development", "Educational Technology"],
        bio: "I'm an award-winning high school educator specializing in innovative STEM programs. Let me guide you toward an impactful teaching career!",
        clusterId: 5,
        clusterName: "Education & Training",
        keywords: ["teaching", "classroom", "learning", "kids", "school"]
      },
      
      // 6. Energy
      {
        name: "Devon Price",
        title: "Energy Technician",
        company: "Bright Future Energy",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 45, // 4.5 stars
        yearsExperience: 7,
        location: "Tampa, FL",
        expertise: ["Solar Panel Installation", "Energy Efficiency", "Renewable Energy"],
        bio: "I install and maintain renewable energy systems for commercial buildings. I can help you enter this growing green tech field!",
        clusterId: 6,
        clusterName: "Energy",
        keywords: ["electricity", "power", "solar", "wind", "energy"]
      },
      
      // 7. Engineering & Technology Education
      {
        name: "Angela Leung",
        title: "Robotics Engineer",
        company: "Innovation Robotics",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 48, // 4.8 stars
        yearsExperience: 9,
        location: "Orlando, FL",
        expertise: ["Automation", "AI Development", "Mechanical Engineering"],
        bio: "I design and develop automation solutions for manufacturing industries. Let me show you how to build a career in cutting-edge robotics!",
        clusterId: 7,
        clusterName: "Engineering & Technology Education",
        keywords: ["machines", "coding", "design", "invent", "robotics"]
      },
      
      // 8. Finance
      {
        name: "Raj Patel",
        title: "Financial Advisor",
        company: "Secure Wealth Management",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 47, // 4.7 stars
        yearsExperience: 11,
        location: "Miami, FL",
        expertise: ["Investment Planning", "Retirement Strategies", "Personal Finance"],
        bio: "I help individuals and businesses plan for financial success and security. I can guide you toward a rewarding career in finance!",
        clusterId: 8,
        clusterName: "Finance",
        keywords: ["banking", "money", "budget", "saving", "investing"]
      },
      
      // 9. Government & Public Administration
      {
        name: "Jasmine Carter",
        title: "City Council Member",
        company: "Oakville City Government",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 46, // 4.6 stars
        yearsExperience: 6,
        location: "Jacksonville, FL",
        expertise: ["Policy Development", "Community Relations", "Public Speaking"],
        bio: "I work on policy development and community improvement initiatives. Let me show you how to make a difference through public service!",
        clusterId: 9,
        clusterName: "Government & Public Administration",
        keywords: ["law", "voting", "rules", "community", "leadership"]
      },
      
      // 10. Health Science
      {
        name: "Dr. Isaiah Greene",
        title: "Pediatrician",
        company: "Children's Wellness Center",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 49, // 4.9 stars
        yearsExperience: 16,
        location: "Gainesville, FL",
        expertise: ["Pediatric Care", "Preventative Medicine", "Medical Education"],
        bio: "I provide comprehensive healthcare for children from newborns to adolescents. I can guide you on the path to a medical career!",
        clusterId: 10,
        clusterName: "Health Science",
        keywords: ["doctor", "nurse", "medicine", "hospital", "health"]
      },
      
      // 11. Hospitality & Tourism
      {
        name: "Chloe Duval",
        title: "Hotel Director",
        company: "Grand Plaza Hotels",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 48, // 4.8 stars
        yearsExperience: 13,
        location: "Tampa, FL",
        expertise: ["Hospitality Management", "Customer Experience", "Event Planning"],
        bio: "I manage luxury hotel operations and enhance guest experiences. Let me help you explore exciting careers in hospitality and tourism!",
        clusterId: 11,
        clusterName: "Hospitality & Tourism",
        keywords: ["travel", "hotels", "food", "guests", "service"]
      },
      
      // 12. Human Services
      {
        name: "Darnell Reed",
        title: "Family Counselor",
        company: "Community Support Services",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 47, // 4.7 stars
        yearsExperience: 8,
        location: "Orlando, FL",
        expertise: ["Family Therapy", "Crisis Intervention", "Mental Health Support"],
        bio: "I provide guidance and support for individuals facing personal challenges. I can help you pursue a fulfilling career helping others!",
        clusterId: 12,
        clusterName: "Human Services",
        keywords: ["helping", "family", "support", "social work", "care"]
      },
      
      // 13. Information Technology
      {
        name: "Zoey Wang",
        title: "Software Developer",
        company: "MedTech Solutions",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 46, // 4.6 stars
        yearsExperience: 7,
        location: "Miami, FL",
        expertise: ["Mobile App Development", "UX Design", "Health Informatics"],
        bio: "I create innovative software solutions for healthcare applications. I can guide you into the exciting world of tech careers!",
        clusterId: 13,
        clusterName: "Information Technology",
        keywords: ["computers", "apps", "code", "tech", "internet"]
      },
      
      // 14. Law, Public Safety & Security
      {
        name: "Nathaniel Brooks",
        title: "Police Officer",
        company: "Oakville Police Department",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 47, // 4.7 stars
        yearsExperience: 9,
        location: "Jacksonville, FL",
        expertise: ["Community Policing", "Public Safety", "Criminal Justice"],
        bio: "I serve the community through law enforcement and public safety initiatives. Let me help you explore careers in public safety!",
        clusterId: 14,
        clusterName: "Law, Public Safety & Security",
        keywords: ["police", "safety", "law", "fire", "protect"]
      },
      
      // 15. Manufacturing
      {
        name: "Emily Ortiz",
        title: "Machine Operator",
        company: "Precision Products Manufacturing",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 45, // 4.5 stars
        yearsExperience: 5,
        location: "Gainesville, FL",
        expertise: ["CNC Machining", "Quality Control", "Industrial Safety"],
        bio: "I operate advanced machinery in precision manufacturing environments. I can show you the path to modern manufacturing careers!",
        clusterId: 15,
        clusterName: "Manufacturing",
        keywords: ["factory", "machines", "tools", "parts", "make"]
      },
      
      // 16. Marketing, Sales & Service
      {
        name: "Jared Lewis",
        title: "Marketing Specialist",
        company: "Brand Elevate Marketing",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 46, // 4.6 stars
        yearsExperience: 8,
        location: "Tampa, FL",
        expertise: ["Digital Marketing", "Brand Strategy", "Social Media"],
        bio: "I develop strategic marketing campaigns for consumer product companies. I can guide you into the dynamic world of marketing!",
        clusterId: 16,
        clusterName: "Marketing, Sales & Service",
        keywords: ["selling", "ads", "store", "customer", "products"]
      },
      
      // 17. Transportation, Distribution & Logistics
      {
        name: "Kiana Thomas",
        title: "Logistics Coordinator",
        company: "Global Transit Solutions",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 45, // 4.5 stars
        yearsExperience: 7,
        location: "Orlando, FL",
        expertise: ["Supply Chain Management", "International Shipping", "Inventory Control"],
        bio: "I manage supply chain logistics for international shipping operations. I can help you navigate careers in this global field!",
        clusterId: 17,
        clusterName: "Transportation, Distribution & Logistics",
        keywords: ["trucks", "travel", "planes", "packages", "delivery"]
      },
      
      // 18. Military - Army
      {
        name: "Sgt. Leo Morales",
        title: "Army Sergeant",
        company: "U.S. Army",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 48, // 4.8 stars
        yearsExperience: 10,
        location: "Fort Liberty, NC",
        expertise: ["Leadership", "Tactical Operations", "Training & Development"],
        bio: "I lead tactical operations and train new recruits in specialized skills. I can help you understand military career opportunities!",
        clusterId: 18, 
        clusterName: "Army",
        keywords: ["soldier", "army", "discipline", "mission", "service"]
      },
      
      // 19. Military - Navy
      {
        name: "Lt. Sofia Rodriguez",
        title: "Navy Lieutenant",
        company: "U.S. Navy",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 47, // 4.7 stars
        yearsExperience: 8,
        location: "Jacksonville, FL",
        expertise: ["Naval Operations", "Maritime Strategy", "Personnel Management"],
        bio: "I manage operations aboard naval vessels and lead teams at sea. I can guide you through Navy career opportunities!",
        clusterId: 19,
        clusterName: "Navy",
        keywords: ["navy", "ship", "sailor", "ocean", "service"]
      },
      
      // 20. Military - Air Force
      {
        name: "Capt. Marcus Wilson",
        title: "Air Force Captain",
        company: "U.S. Air Force",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 49, // 4.9 stars
        yearsExperience: 9,
        location: "Tampa, FL",
        expertise: ["Flight Operations", "Aviation Technology", "Aerospace Management"],
        bio: "I serve as a flight operations officer and coordinate missions. Let me show you the exciting career possibilities in the Air Force!",
        clusterId: 20,
        clusterName: "Air Force",
        keywords: ["air force", "pilot", "aviation", "planes", "service"]
      },
      
      // 21. Military - Marine Corps
      {
        name: "Lt. James Cooper",
        title: "Marine Corps Lieutenant",
        company: "U.S. Marine Corps",
        avatarUrl: "/mentor-avatars/default-avatar.jpg", 
        rating: 48, // 4.8 stars
        yearsExperience: 7,
        location: "Jacksonville, FL",
        expertise: ["Combat Operations", "Strategic Planning", "Team Leadership"],
        bio: "I lead combat operations and train elite forces for specialized missions. I can help you understand Marine Corps career paths!",
        clusterId: 21,
        clusterName: "Marine Corps",
        keywords: ["marines", "corps", "discipline", "mission", "service"]
      },
      
      // 22. Military - Coast Guard  
      {
        name: "Ens. Lily Nguyen",
        title: "Coast Guard Ensign",
        company: "U.S. Coast Guard",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 46, // 4.6 stars
        yearsExperience: 5,
        location: "Miami, FL",
        expertise: ["Maritime Safety", "Search & Rescue", "Law Enforcement"],
        bio: "I conduct maritime search and rescue operations and enforce federal laws at sea. I can guide you toward Coast Guard careers!",
        clusterId: 22,
        clusterName: "Coast Guard",
        keywords: ["coast guard", "rescue", "maritime", "patrol", "service"]
      },
      
      // 23. Military - Space Force
      {
        name: "Lt. Alex Chen",
        title: "Space Force Lieutenant",
        company: "U.S. Space Force",
        avatarUrl: "/mentor-avatars/default-avatar.jpg",
        rating: 49, // 4.9 stars
        yearsExperience: 6,
        location: "Cape Canaveral, FL",
        expertise: ["Satellite Operations", "Space Systems", "Cyber Defense"],
        bio: "I manage satellite operations and space domain awareness for national security. Let me show you the cutting-edge career opportunities in Space Force!",
        clusterId: 23,
        clusterName: "Space Force",
        keywords: ["space force", "space", "satellite", "aerospace", "service"]
      }
    ];
    
    mentors.forEach(mentor => {
      this.createMentor(mentor);
    });
    
    // Add some availability for mentors
    const now = new Date();
    // Generate availability for all mentors (1 to 23, including Space Force)
    for (let i = 1; i <= 23; i++) {
      for (let j = 0; j < 10; j++) {
        const date = new Date(now);
        date.setDate(date.getDate() + j);
        date.setHours(9 + j % 8, 0, 0, 0); // 9AM to 5PM
        
        this.createMentorAvailability({
          mentorId: i,
          date,
          isAvailable: Math.random() > 0.3 // 70% chance of being available
        });
      }
    }
  }
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const timestamp = new Date();
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: timestamp,
      careerKeywords: user.careerKeywords || [],
      avatarUrl: user.avatarUrl || null
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserKeywords(id: number, keywords: string[]): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    
    const updatedUser: User = { ...user, careerKeywords: keywords };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Career Clusters
  async getCareerClusters(): Promise<CareerCluster[]> {
    return Array.from(this.careerClusters.values());
  }
  
  async getCareerClusterById(id: number): Promise<CareerCluster | undefined> {
    return this.careerClusters.get(id);
  }
  
  async getCareerClustersByCategory(category: string): Promise<CareerCluster[]> {
    return Array.from(this.careerClusters.values())
      .filter(cluster => cluster.category === category);
  }
  
  async createCareerCluster(cluster: InsertCareerCluster): Promise<CareerCluster> {
    const id = this.currentClusterId++;
    const newCluster: CareerCluster = { ...cluster, id };
    this.careerClusters.set(id, newCluster);
    return newCluster;
  }

  async updateCareerClusterIcon(id: number, iconName: string): Promise<CareerCluster> {
    const cluster = this.careerClusters.get(id);
    if (!cluster) {
      throw new Error(`Career cluster with id ${id} not found`);
    }
    
    const updatedCluster: CareerCluster = { ...cluster, iconName };
    this.careerClusters.set(id, updatedCluster);
    return updatedCluster;
  }
  
  async searchCareerClustersByKeyword(keyword: string): Promise<CareerCluster[]> {
    const lowerKeyword = keyword.toLowerCase().trim();
    
    // If empty keyword, return all clusters
    if (!lowerKeyword) {
      return Array.from(this.careerClusters.values());
    }
    
    // Split multi-word searches to improve matching
    const searchTerms = lowerKeyword.split(/\s+/).filter(term => term.length > 1);
    
    // Define expanded keyword mappings for career clusters with common search terms
    const keywordToClusters: Record<string, string[]> = {
      // Arts & Communications
      "art": ["Arts, A/V Technology & Communication"],
      "music": ["Arts, A/V Technology & Communication"],
      "media": ["Arts, A/V Technology & Communication"],
      "creative": ["Arts, A/V Technology & Communication"],
      "writing": ["Arts, A/V Technology & Communication"],
      "design": ["Arts, A/V Technology & Communication", "Architecture & Construction"],
      "communication": ["Arts, A/V Technology & Communication"],
      "journalism": ["Arts, A/V Technology & Communication"],
      "film": ["Arts, A/V Technology & Communication"],
      "video": ["Arts, A/V Technology & Communication"],
      "photography": ["Arts, A/V Technology & Communication"],
      
      // Business & Finance
      "business": ["Business Management & Administration", "Marketing", "Finance"],
      "finance": ["Finance", "Business Management & Administration"],
      "money": ["Finance", "Business Management & Administration"],
      "budget": ["Finance", "Business Management & Administration"], 
      "wealth": ["Finance", "Business Management & Administration"],
      "accounting": ["Finance", "Business Management & Administration"],
      "marketing": ["Marketing", "Business Management & Administration"],
      "economics": ["Finance", "Business Management & Administration"],
      "management": ["Business Management & Administration"],
      "sales": ["Marketing", "Business Management & Administration"],
      "entrepreneurship": ["Business Management & Administration"],
      "banking": ["Finance"],
      "investment": ["Finance"],
      "financial": ["Finance"],
      "loan": ["Finance"],
      "credit": ["Finance"],
      "stocks": ["Finance"],
      
      // Technology
      "computer": ["Information Technology"],
      "tech": ["Information Technology", "Science, Technology, Engineering & Mathematics"],
      "programming": ["Information Technology"],
      "web": ["Information Technology"],
      "app": ["Information Technology"],
      "data": ["Information Technology"],
      "ai": ["Information Technology", "Science, Technology, Engineering & Mathematics"],
      "it": ["Information Technology"],
      "software": ["Information Technology"],
      "network": ["Information Technology"],
      "cyber": ["Information Technology"],
      "security": ["Information Technology", "Law, Public Safety, Corrections & Security"],
      
      // Healthcare
      "medical": ["Health Science"],
      "healthcare": ["Health Science"],
      "doctor": ["Health Science"],
      "nurse": ["Health Science"],
      "therapy": ["Health Science"],
      "psychology": ["Health Science", "Human Services"],
      "medicine": ["Health Science"],
      "dental": ["Health Science"],
      "pharmacy": ["Health Science"],
      "health": ["Health Science"],
      "patient": ["Health Science"],
      
      // Engineering
      "engineering": ["Science, Technology, Engineering & Mathematics", "Architecture & Construction"],
      "robotics": ["Science, Technology, Engineering & Mathematics", "Manufacturing"],
      "mechanical": ["Science, Technology, Engineering & Mathematics", "Manufacturing"],
      "electrical": ["Science, Technology, Engineering & Mathematics"],
      "manufacturing": ["Manufacturing"],
      "architecture": ["Architecture & Construction"],
      "construction": ["Architecture & Construction"],
      "building": ["Architecture & Construction"],
      
      // Education
      "education": ["Education & Training"],
      "teaching": ["Education & Training"],
      "academic": ["Education & Training"],
      "training": ["Education & Training"],
      "learning": ["Education & Training"],
      "school": ["Education & Training"],
      "teacher": ["Education & Training"],
      
      // Public Service
      "government": ["Government & Public Administration", "Law, Public Safety, Corrections & Security"],
      "military": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard", "Space Force"],
      "army": ["Army"],
      "navy": ["Navy"],
      "air force": ["Air Force"],
      "marines": ["Marine Corps"],
      "coast guard": ["Coast Guard"],
      "soldier": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "veteran": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "defense": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "service": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "uniform": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "combat": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "naval": ["Navy", "Coast Guard"],
      "war": ["Army", "Navy", "Air Force", "Marine Corps", "Coast Guard"],
      "space force": ["Air Force"],
      "water": ["Navy", "Coast Guard", "Marine Corps", "Agriculture, Food, & Natural Resources"],
      "sea": ["Navy", "Coast Guard", "Marine Corps"],
      "ocean": ["Navy", "Coast Guard", "Marine Corps"],
      "ship": ["Navy", "Coast Guard"],
      "law": ["Law, Public Safety, Corrections & Security"],
      "legal": ["Law, Public Safety, Corrections & Security"],
      "police": ["Law, Public Safety, Corrections & Security"],
      "criminal": ["Law, Public Safety, Corrections & Security"],
      "justice": ["Law, Public Safety, Corrections & Security"],
      
      // Science & Research
      "science": ["Science, Technology, Engineering & Mathematics", "Health Science"],
      "biology": ["Science, Technology, Engineering & Mathematics", "Health Science"],
      "chemistry": ["Science, Technology, Engineering & Mathematics"],
      "physics": ["Science, Technology, Engineering & Mathematics"],
      "research": ["Science, Technology, Engineering & Mathematics"],
      "lab": ["Science, Technology, Engineering & Mathematics", "Health Science"],
      
      // Agriculture & Natural Resources
      "agriculture": ["Agriculture, Food, & Natural Resources"],
      "environment": ["Agriculture, Food, & Natural Resources"],
      "veterinary": ["Agriculture, Food, & Natural Resources"],
      "farming": ["Agriculture, Food, & Natural Resources"],
      "animal": ["Agriculture, Food, & Natural Resources"],
      "food": ["Agriculture, Food, & Natural Resources", "Hospitality & Tourism"],
      "nature": ["Agriculture, Food, & Natural Resources"],
      
      // Hospitality & Tourism
      "hospitality": ["Hospitality & Tourism"],
      "culinary": ["Hospitality & Tourism"],
      "tourism": ["Hospitality & Tourism"],
      "hotel": ["Hospitality & Tourism"],
      "restaurant": ["Hospitality & Tourism"],
      "chef": ["Hospitality & Tourism"],
      "travel": ["Hospitality & Tourism"],
      
      // Transportation, Distribution & Logistics
      "transport": ["Transportation, Distribution & Logistics"],
      "logistics": ["Transportation, Distribution & Logistics"],
      "shipping": ["Transportation, Distribution & Logistics"],
      "aviation": ["Transportation, Distribution & Logistics"],
      "pilot": ["Transportation, Distribution & Logistics", "Air Force", "Navy"],
      "driving": ["Transportation, Distribution & Logistics"],
      "automotive": ["Transportation, Distribution & Logistics"],
      
      // Human Services
      "counseling": ["Human Services", "Health Science"],
      "social work": ["Human Services"],
      "community": ["Human Services"],
      "family": ["Human Services"],
      "childcare": ["Human Services", "Education & Training"]
    };
    
    // Create a set of related cluster names for all search terms
    const relatedClusterNames = new Set<string>();
    
    // Check each search term for matches in our keyword mapping
    for (const term of searchTerms) {
      for (const [key, clusterNames] of Object.entries(keywordToClusters)) {
        // Match if the search term contains the key or vice versa
        if (term.includes(key) || key.includes(term)) {
          clusterNames.forEach(name => relatedClusterNames.add(name));
        }
      }
    }
    
    // Also check singular/plural forms (simple s/es endings)
    const expandedSearchTerms = [...searchTerms];
    for (const term of searchTerms) {
      // Add plural form (add 's' or 'es')
      if (!term.endsWith('s')) {
        expandedSearchTerms.push(term + 's');
      }
      // Add singular form (remove 's' or 'es')
      if (term.endsWith('s') && term.length > 2) {
        expandedSearchTerms.push(term.substring(0, term.length - 1));
      }
    }
    
    // Add additional matches for expanded terms
    for (const term of expandedSearchTerms) {
      for (const [key, clusterNames] of Object.entries(keywordToClusters)) {
        if (term.includes(key) || key.includes(term)) {
          clusterNames.forEach(name => relatedClusterNames.add(name));
        }
      }
    }
    
    return Array.from(this.careerClusters.values())
      .filter(cluster => {
        const clusterNameLower = cluster.name.toLowerCase();
        const clusterDescLower = cluster.description ? cluster.description.toLowerCase() : '';
        
        // Direct match with any search term in name or description
        const directMatch = searchTerms.some(term => 
          clusterNameLower.includes(term) || clusterDescLower.includes(term)
        );
        
        if (directMatch) return true;
        
        // Check if this cluster's name is in our set of related clusters
        if (Array.from(relatedClusterNames).some(name => name === cluster.name)) {
          return true;
        }
        
        // Also check for partial matches within cluster name parts
        const clusterNameParts = clusterNameLower.split(/[,&\s]+/);
        const partialNameMatch = searchTerms.some(term => 
          clusterNameParts.some(part => part === term || part.startsWith(term) || part.endsWith(term))
        );
        
        if (partialNameMatch) return true;
        
        return false;
      });
  }
  
  // Career Keywords
  async getCareerKeywords(): Promise<CareerKeyword[]> {
    return Array.from(this.careerKeywords.values());
  }
  
  async getCareerKeywordsByClusterId(clusterId: number): Promise<CareerKeyword[]> {
    return Array.from(this.careerKeywords.values())
      .filter(keyword => keyword.clusterId === clusterId);
  }
  
  async createCareerKeyword(keyword: InsertCareerKeyword): Promise<CareerKeyword> {
    const id = this.currentKeywordId++;
    const newKeyword: CareerKeyword = { ...keyword, id };
    this.careerKeywords.set(id, newKeyword);
    return newKeyword;
  }
  
  async searchCareerKeywords(search: string): Promise<CareerKeyword[]> {
    const lowerSearch = search.toLowerCase();
    return Array.from(this.careerKeywords.values())
      .filter(keyword => keyword.keyword.toLowerCase().includes(lowerSearch));
  }
  
  // Career Events
  async getCareerEvents(): Promise<CareerEvent[]> {
    return Array.from(this.careerEvents.values());
  }
  
  async getCareerEventById(id: number): Promise<CareerEvent | undefined> {
    return this.careerEvents.get(id);
  }
  
  async getUpcomingCareerEvents(): Promise<CareerEvent[]> {
    const now = new Date();
    return Array.from(this.careerEvents.values()).filter(event => 
      new Date(event.eventDate) > now
    );
  }
  
  async getCareerEventsByClusterId(clusterId: number): Promise<CareerEvent[]> {
    return Array.from(this.careerEvents.values()).filter(event => 
      event.clusterId === clusterId
    );
  }
  
  async createCareerEvent(event: InsertCareerEvent): Promise<CareerEvent> {
    const id = this.currentEventId++;
    const newEvent: CareerEvent = { 
      ...event, 
      id,
      createdAt: new Date(),
      clusterId: event.clusterId ?? null,
      registrationUrl: event.registrationUrl ?? null,
      imageUrl: event.imageUrl ?? null
    };
    this.careerEvents.set(id, newEvent);
    return newEvent;
  }
  
  // Mentors
  async getMentors(): Promise<Mentor[]> {
    return Array.from(this.mentors.values());
  }
  
  async getMentorById(id: number): Promise<Mentor | undefined> {
    return this.mentors.get(id);
  }
  
  async getMentorsByClusterId(clusterId: number): Promise<Mentor[]> {
    return Array.from(this.mentors.values())
      .filter(mentor => mentor.clusterId === clusterId);
  }
  
  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const id = this.currentMentorId++;
    // If cluster name is not provided, fetch it from the cluster
    let clusterName = mentor.clusterName;
    if (!clusterName && mentor.clusterId) {
      const cluster = await this.getCareerClusterById(mentor.clusterId);
      clusterName = cluster?.name || null;
    }
    
    // Get keywords for this mentor's cluster
    let keywords = mentor.keywords;
    if (!keywords && mentor.clusterId) {
      const clusterKeywords = await this.getCareerKeywordsByClusterId(mentor.clusterId);
      keywords = clusterKeywords.map(k => k.keyword);
    }
    
    const newMentor: Mentor = { 
      ...mentor, 
      id, 
      clusterName: clusterName || null,
      keywords: keywords || null,
      avatarUrl: mentor.avatarUrl || null
    };
    
    this.mentors.set(id, newMentor);
    return newMentor;
  }
  
  async searchMentorsByKeyword(keyword: string): Promise<Mentor[]> {
    const lowerKeyword = keyword.toLowerCase().trim();
    
    // If empty keyword, return all mentors
    if (!lowerKeyword) {
      return Array.from(this.mentors.values());
    }
    
    // Split multi-word searches to improve matching
    const searchTerms = lowerKeyword.split(/\s+/).filter(term => term.length > 1);
    
    // Define expanded keyword mappings for common search terms
    const keywordExpansions: Record<string, string[]> = {
      // Arts & Communications
      "art": ["drawing", "creative", "design", "artist", "arts", "painting", "sculpture", "visual"],
      "music": ["audio", "sound", "recording", "band", "musician", "instrument", "singer", "composer", "orchestra"],
      "media": ["video", "film", "photography", "camera", "production", "broadcast", "television", "radio", "streaming"],
      "creative": ["drawing", "arts", "design", "video", "music", "innovative", "artistic"],
      "writing": ["author", "content", "blog", "journalist", "writer", "editor", "publishing", "books"],
      "design": ["drawing", "architecture", "creative", "graphics", "ux", "ui", "layouts", "visual"],
      "communication": ["speaking", "public", "presentation", "journalism", "broadcasting", "media"],
      
      // Business & Finance
      "business": ["office", "manager", "planning", "company", "entrepreneur", "corporate", "industry", "commercial"],
      "finance": ["banking", "money", "budget", "investment", "financial", "accounting", "economics", "stocks"],
      "marketing": ["advertising", "promotion", "brand", "selling", "ads", "seo", "social media", "digital"],
      "management": ["leadership", "administration", "supervising", "manager", "executive", "director", "supervisor"],
      "sales": ["retail", "selling", "commerce", "business", "customer", "market"],
      "entrepreneurship": ["startup", "business", "founder", "innovation", "venture"],
      
      // Technology
      "computer": ["coding", "tech", "software", "programming", "apps", "internet", "it", "hardware"],
      "tech": ["computers", "coding", "software", "internet", "technology", "digital", "electronics"],
      "programming": ["coding", "software", "development", "apps", "computer", "java", "python", "javascript"],
      "web": ["internet", "website", "coding", "design", "online", "browser", "development"],
      "app": ["mobile", "software", "development", "android", "ios", "programming"],
      "data": ["database", "analytics", "statistics", "science", "big data"],
      "ai": ["artificial intelligence", "machine learning", "neural networks", "algorithms", "tech"],
      
      // Healthcare
      "medical": ["doctor", "nurse", "medicine", "hospital", "health", "healthcare", "clinical", "patient"],
      "healthcare": ["doctor", "nurse", "medicine", "hospital", "health", "patient", "treatment", "care"],
      "doctor": ["physician", "medical", "healthcare", "medicine", "hospital", "health", "specialist"],
      "nurse": ["nursing", "healthcare", "medical", "health", "hospital", "patient", "care"],
      "therapy": ["rehabilitation", "treatment", "counseling", "medical", "health"],
      "psychology": ["mental health", "counseling", "behavior", "therapy", "brain"],
      
      // Engineering
      "engineering": ["machines", "design", "technology", "robotics", "mechanical", "electrical", "civil", "chemical"],
      "robotics": ["machines", "automation", "programming", "technology", "ai", "electronics", "mechanical"],
      "mechanical": ["engineering", "machines", "design", "manufacturing", "automotive"],
      "electrical": ["engineering", "electronics", "power", "circuits", "technology"],
      "manufacturing": ["production", "factory", "industrial", "assembly", "engineering"],
      
      // Education
      "education": ["teaching", "classroom", "learning", "school", "students", "instructor", "academic", "professor"],
      "teaching": ["classroom", "education", "learning", "school", "instructor", "students", "faculty"],
      "academic": ["education", "research", "university", "college", "school", "professor"],
      "training": ["education", "learning", "development", "skills", "teaching"],
      
      // Public Service
      "government": ["public", "administration", "law", "policy", "rules", "agency", "federal", "state"],
      "military": ["army", "navy", "air force", "marines", "soldier", "service", "defense", "veteran", "naval", "combat", "uniform", "war", "weapon", "ship", "sea", "ocean", "water", "coast guard", "space force"],
      "navy": ["ship", "sea", "ocean", "water", "sailor", "vessel", "maritime", "naval"],
      "water": ["ocean", "sea", "maritime", "boat", "ship", "marine", "naval"],
      "ocean": ["sea", "marine", "water", "maritime", "naval", "coast"],
      "sea": ["ocean", "water", "maritime", "ship", "marine", "naval"],
      "ship": ["boat", "vessel", "navy", "ocean", "sea", "maritime"],
      "law": ["legal", "justice", "police", "rules", "courts", "attorney", "lawyer", "judge"],
      "public service": ["government", "community", "nonprofit", "social work", "civic"],
      "police": ["law enforcement", "security", "criminal justice", "detective", "officer"],
      
      // Science & Research
      "science": ["research", "laboratory", "experiment", "scientist", "biology", "chemistry", "physics"],
      "biology": ["science", "life", "organisms", "medical", "research", "genetic"],
      "chemistry": ["science", "laboratory", "compounds", "materials", "research"],
      "physics": ["science", "engineering", "mathematics", "research", "technology"],
      "research": ["science", "development", "study", "investigation", "analysis"],
      
      // Agriculture & Natural Resources
      "agriculture": ["farming", "crops", "livestock", "food", "production", "agribusiness"],
      "environment": ["ecology", "conservation", "natural resources", "sustainability", "green"],
      "veterinary": ["animal", "doctor", "medicine", "health", "biology"],
      
      // Hospitality & Tourism
      "hospitality": ["hotel", "restaurant", "tourism", "service", "customer", "food", "beverage"],
      "culinary": ["cooking", "chef", "food", "restaurant", "kitchen", "baking", "gastronomy"],
      "tourism": ["travel", "hotel", "hospitality", "guide", "international"]
    };
    
    // Create a set of all expanded keywords for the search terms
    const expandedKeywords = new Set<string>();
    
    // First add all direct search terms
    searchTerms.forEach(term => expandedKeywords.add(term));
    
    // Then add expanded keywords for each search term
    for (const searchTerm of searchTerms) {
      for (const [key, values] of Object.entries(keywordExpansions)) {
        // Match if the search term contains the key or vice versa
        if (searchTerm.includes(key) || key.includes(searchTerm)) {
          values.forEach(value => expandedKeywords.add(value));
        }
      }
    }
    
    // Also check for singular/plural forms (simple check)
    const singularAndPluralForms = new Set<string>();
    // Copy all existing keywords
    expandedKeywords.forEach(term => singularAndPluralForms.add(term));
    
    // Add singular and plural forms
    expandedKeywords.forEach(term => {
      // Add plural form (add 's')
      if (!term.endsWith('s')) {
        singularAndPluralForms.add(term + 's');
      }
      // Add singular form (remove 's')
      if (term.endsWith('s') && term.length > 2) {
        singularAndPluralForms.add(term.substring(0, term.length - 1));
      }
    });
    
    // Convert to array for easier comparisons
    const expandedTermsArray = Array.from(singularAndPluralForms);
    
    // Check career clusters for related mentors
    const relatedClusterIds = new Set<number>();
    const clusterEntries = Array.from(this.careerClusters.entries());
    
    for (const [clusterId, cluster] of clusterEntries) {
      const clusterName = cluster.name.toLowerCase();
      const clusterDescription = cluster.description?.toLowerCase() || '';
      
      // Check if any of our expanded terms match this cluster
      if (expandedTermsArray.some(term => 
        clusterName.includes(term) || clusterDescription.includes(term)
      )) {
        relatedClusterIds.add(clusterId);
      }
    }
    
    return Array.from(this.mentors.values())
      .filter(mentor => {
        // Check if mentor is in a related cluster
        if (relatedClusterIds.has(mentor.clusterId)) {
          return true;
        }
        
        // Core search fields direct match (highest priority)
        const directMatch = 
          searchTerms.some(term => mentor.name.toLowerCase().includes(term)) || 
          searchTerms.some(term => mentor.title.toLowerCase().includes(term)) || 
          searchTerms.some(term => mentor.company.toLowerCase().includes(term)) || 
          (mentor.expertise && mentor.expertise.some(exp => 
            searchTerms.some(term => exp.toLowerCase().includes(term))
          )) ||
          (mentor.clusterName && searchTerms.some(term => 
            mentor.clusterName!.toLowerCase().includes(term)
          )) ||
          (mentor.keywords && mentor.keywords.some(k => 
            searchTerms.some(term => k.toLowerCase().includes(term))
          ));
        
        if (directMatch) return true;
        
        // Expanded keyword matches
        if (mentor.keywords) {
          const keywordMatch = mentor.keywords.some(k => 
            expandedTermsArray.some(term => 
              k.toLowerCase().includes(term)
            )
          );
          if (keywordMatch) return true;
        }
        
        // Bio content matches (check all terms and expanded terms)
        if (mentor.bio) {
          const bioMatch = 
            searchTerms.some(term => mentor.bio.toLowerCase().includes(term)) ||
            expandedTermsArray.some(term => 
              mentor.bio.toLowerCase().includes(term)
            );
          if (bioMatch) return true;
        }
        
        return false;
      });
  }
  
  // Mentor Availability
  async getMentorAvailability(mentorId: number): Promise<MentorAvailability[]> {
    return Array.from(this.mentorAvailability.values())
      .filter(avail => avail.mentorId === mentorId);
  }
  
  async createMentorAvailability(availability: InsertMentorAvailability): Promise<MentorAvailability> {
    const id = this.currentAvailabilityId++;
    const newAvailability: MentorAvailability = { 
      ...availability, 
      id,
      isAvailable: availability.isAvailable ?? null 
    };
    this.mentorAvailability.set(id, newAvailability);
    return newAvailability;
  }
  
  // Mentor Sessions
  async getMentorSessions(studentId: number): Promise<MentorSession[]> {
    return Array.from(this.mentorSessions.values())
      .filter(session => session.studentId === studentId);
  }
  
  async getMentorSessionById(id: number): Promise<MentorSession | undefined> {
    return this.mentorSessions.get(id);
  }
  
  async createMentorSession(session: InsertMentorSession): Promise<MentorSession> {
    const id = this.currentSessionId++;
    const timestamp = new Date();
    const newSession: MentorSession = { 
      ...session, 
      id, 
      createdAt: timestamp,
      notes: session.notes ?? null
    };
    this.mentorSessions.set(id, newSession);
    return newSession;
  }
  
  async updateMentorSessionStatus(id: number, status: string): Promise<MentorSession> {
    const session = this.mentorSessions.get(id);
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    
    const updatedSession: MentorSession = { ...session, status };
    this.mentorSessions.set(id, updatedSession);
    return updatedSession;
  }
  
  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
        return dateB.getTime() - dateA.getTime();
      });
  }
  
  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(notification => notification.userId === userId && !notification.isRead)
      .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date();
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date();
        return dateB.getTime() - dateA.getTime();
      });
  }
  
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = this.currentNotificationId++;
    const timestamp = new Date();
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: timestamp,
      sessionId: notification.sessionId ?? null,
      eventId: notification.eventId ?? null,
      isRead: notification.isRead ?? false
    };
    this.notifications.set(id, newNotification);
    return newNotification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }
    
    const updatedNotification: Notification = { ...notification, isRead: true };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async deleteNotification(id: number): Promise<void> {
    if (!this.notifications.has(id)) {
      throw new Error(`Notification with id ${id} not found`);
    }
    
    this.notifications.delete(id);
  }
  
  async generateSessionNotifications(
    sessionId: number, 
    mentorName: string, 
    sessionDate: Date, 
    studentId: number
  ): Promise<void> {
    // Create initial confirmation notification
    await this.createNotification({
      userId: studentId,
      sessionId: sessionId,
      title: "Session Scheduled",
      message: `Your mentorship session with ${mentorName} has been scheduled for ${sessionDate.toLocaleDateString()} at ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      type: "confirmation",
      isRead: false
    });
    
    // Create reminders based on session date
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const sessionTime = sessionDate.getTime();
    
    // One day before reminder
    const oneDayBefore = new Date(sessionTime - oneDay);
    if (oneDayBefore > now) {
      await this.createNotification({
        userId: studentId,
        sessionId: sessionId,
        title: "Session Tomorrow",
        message: `Reminder: Your mentorship session with ${mentorName} is tomorrow at ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        type: "reminder",
        isRead: false
      });
    }
    
    // One hour before reminder
    const oneHourBefore = new Date(sessionTime - (60 * 60 * 1000));
    if (oneHourBefore > now) {
      await this.createNotification({
        userId: studentId,
        sessionId: sessionId,
        title: "Session Starting Soon",
        message: `Your mentorship session with ${mentorName} will begin in 1 hour at ${sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
        type: "reminder",
        isRead: false
      });
    }
  }
  
  async generateEventNotification(
    eventId: number,
    eventTitle: string,
    eventDate: Date,
    userId: number
  ): Promise<void> {
    // Create event notification
    await this.createNotification({
      userId: userId,
      eventId: eventId,
      sessionId: null,
      title: "New Career Event",
      message: `A new career event "${eventTitle}" has been scheduled for ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      type: "event",
      isRead: false
    });
  }

  // Counselors
  async getCounselors(): Promise<Counselor[]> {
    return Array.from(this.counselors.values()).filter(c => c.isActive);
  }

  async getCounselorById(id: number): Promise<Counselor | undefined> {
    return this.counselors.get(id);
  }

  async createCounselor(counselor: InsertCounselor): Promise<Counselor> {
    const id = this.currentCounselorId++;
    const timestamp = new Date();
    const newCounselor: Counselor = {
      ...counselor,
      id,
      createdAt: timestamp,
      isActive: counselor.isActive ?? true,
      specialties: counselor.specialties ?? [],
      avatarUrl: counselor.avatarUrl ?? null,
      phone: counselor.phone ?? null,
      bio: counselor.bio ?? null,
      officeLocation: counselor.officeLocation ?? null,
      officeHours: counselor.officeHours ?? null
    };
    this.counselors.set(id, newCounselor);
    return newCounselor;
  }

  async updateCounselor(id: number, data: Partial<InsertCounselor>): Promise<Counselor> {
    const counselor = this.counselors.get(id);
    if (!counselor) {
      throw new Error(`Counselor with id ${id} not found`);
    }
    
    const updatedCounselor: Counselor = { ...counselor, ...data };
    this.counselors.set(id, updatedCounselor);
    return updatedCounselor;
  }

  // Counselor Availability
  async getCounselorAvailability(counselorId: number): Promise<CounselorAvailability[]> {
    return Array.from(this.counselorAvailability.values())
      .filter(avail => avail.counselorId === counselorId);
  }

  async createCounselorAvailability(availability: InsertCounselorAvailability): Promise<CounselorAvailability> {
    const id = this.currentCounselorAvailabilityId++;
    const timestamp = new Date();
    const newAvailability: CounselorAvailability = {
      ...availability,
      id,
      createdAt: timestamp,
      isAvailable: availability.isAvailable ?? true
    };
    this.counselorAvailability.set(id, newAvailability);
    return newAvailability;
  }

  // Counselor Sessions
  async getCounselorSessions(studentId: number): Promise<CounselorSession[]> {
    return Array.from(this.counselorSessions.values())
      .filter(session => session.studentId === studentId);
  }

  async getCounselorSessionById(id: number): Promise<CounselorSession | undefined> {
    return this.counselorSessions.get(id);
  }

  async createCounselorSession(session: InsertCounselorSession): Promise<CounselorSession> {
    const id = this.currentCounselorSessionId++;
    const timestamp = new Date();
    const newSession: CounselorSession = {
      ...session,
      id,
      createdAt: timestamp,
      status: session.status ?? "scheduled",
      duration: session.duration ?? 30,
      notes: session.notes ?? null,
      meetingLink: session.meetingLink ?? null
    };
    this.counselorSessions.set(id, newSession);
    return newSession;
  }

  async updateCounselorSessionStatus(id: number, status: string): Promise<CounselorSession> {
    const session = this.counselorSessions.get(id);
    if (!session) {
      throw new Error(`Counselor session with id ${id} not found`);
    }
    
    const updatedSession: CounselorSession = { ...session, status };
    this.counselorSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Newsletter Subscriptions
  async createNewsletterSubscription(email: string): Promise<NewsletterSubscription> {
    const existing = await this.getNewsletterSubscription(email);
    if (existing && existing.isActive) {
      return existing;
    }

    const id = this.currentNewsletterSubscriptionId++;
    const newSubscription: NewsletterSubscription = {
      id,
      email,
      subscribedAt: new Date(),
      isActive: true,
      preferences: null,
    };

    this.newsletterSubscriptions.set(id, newSubscription);
    return newSubscription;
  }

  async getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined> {
    return Array.from(this.newsletterSubscriptions.values())
      .find((sub: NewsletterSubscription) => sub.email === email);
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    const subscription = await this.getNewsletterSubscription(email);
    if (subscription) {
      const updated: NewsletterSubscription = { ...subscription, isActive: false };
      this.newsletterSubscriptions.set(subscription.id, updated);
    }
  }
}

import { SupabaseStorage } from "./supabase-storage";

export const storage = new SupabaseStorage();
