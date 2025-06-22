import { createClient, SupabaseClient } from '@supabase/supabase-js';
import session from "express-session";
import createMemoryStore from 'memorystore';
import { IStorage } from './storage';
import {
  User, InsertUser,
  CareerCluster, InsertCareerCluster,
  CareerKeyword, InsertCareerKeyword,
  Mentor, InsertMentor,
  MentorAvailability, InsertMentorAvailability,
  MentorSession, InsertMentorSession,
  CareerEvent, InsertCareerEvent,
  Notification, InsertNotification,
  Counselor, InsertCounselor,
  CounselorAvailability, InsertCounselorAvailability,
  CounselorSession, InsertCounselorSession,
  NewsletterSubscription, InsertNewsletterSubscription
} from '@shared/schema';

export class SupabaseStorage implements IStorage {
  private supabase: SupabaseClient;
  sessionStore: any;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // For now, use in-memory session store - can be upgraded to Supabase later
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User> {
    const { data: updatedUser, error } = await this.supabase
      .from('users')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return updatedUser;
  }

  async updateUserKeywords(id: number, keywords: string[]): Promise<User> {
    return this.updateUser(id, { careerKeywords: keywords });
  }

  // Career Clusters
  async getCareerClusters(): Promise<CareerCluster[]> {
    const { data, error } = await this.supabase
      .from('career_clusters')
      .select('*');
    
    if (error) throw new Error(`Failed to fetch career clusters: ${error.message}`);
    return data || [];
  }

  async getCareerClusterById(id: number): Promise<CareerCluster | undefined> {
    const { data, error } = await this.supabase
      .from('career_clusters')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getCareerClustersByCategory(category: string): Promise<CareerCluster[]> {
    const { data, error } = await this.supabase
      .from('career_clusters')
      .select('*')
      .eq('category', category);
    
    if (error) throw new Error(`Failed to fetch career clusters by category: ${error.message}`);
    return data || [];
  }

  async createCareerCluster(cluster: InsertCareerCluster): Promise<CareerCluster> {
    const { data, error } = await this.supabase
      .from('career_clusters')
      .insert(cluster)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create career cluster: ${error.message}`);
    return data;
  }

  async updateCareerClusterIcon(id: number, iconName: string): Promise<CareerCluster> {
    const { data, error } = await this.supabase
      .from('career_clusters')
      .update({ iconName })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update career cluster icon: ${error.message}`);
    return data;
  }

  async searchCareerClustersByKeyword(keyword: string): Promise<CareerCluster[]> {
    const lowerKeyword = keyword.toLowerCase().trim();
    
    if (!lowerKeyword) {
      return this.getCareerClusters();
    }

    // Get all clusters for client-side filtering (since we have complex keyword mapping)
    const allClusters = await this.getCareerClusters();
    
    // Apply the same search logic as the in-memory implementation
    const searchTerms = lowerKeyword.split(/\s+/).filter(term => term.length > 1);
    
    // Define expanded keyword mappings (same as in-memory implementation)
    const keywordToClusters: Record<string, string[]> = {
      // Military mappings
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
      
      // Other mappings
      "business": ["Business Management & Administration", "Marketing", "Finance"],
      "finance": ["Finance", "Business Management & Administration"],
      "money": ["Finance", "Business Management & Administration"],
      "budget": ["Finance", "Business Management & Administration"], 
      "wealth": ["Finance", "Business Management & Administration"],
      "healthcare": ["Health Science"],
      "doctor": ["Health Science"],
      "nurse": ["Health Science"],
      "medical": ["Health Science"],
      "tech": ["Information Technology", "Science, Technology, Engineering & Mathematics"],
      "computer": ["Information Technology"],
      "programming": ["Information Technology"],
    };
    
    const relatedClusterNames = new Set<string>();
    
    for (const term of searchTerms) {
      for (const [key, clusterNames] of Object.entries(keywordToClusters)) {
        if (term.includes(key) || key.includes(term)) {
          clusterNames.forEach(name => relatedClusterNames.add(name));
        }
      }
    }
    
    return allClusters.filter(cluster => {
      const clusterNameLower = cluster.name.toLowerCase();
      const clusterDescLower = cluster.description ? cluster.description.toLowerCase() : '';
      
      // Direct match
      const directMatch = searchTerms.some(term => 
        clusterNameLower.includes(term) || clusterDescLower.includes(term)
      );
      
      if (directMatch) return true;
      
      // Keyword mapping match
      if (Array.from(relatedClusterNames).some(name => name === cluster.name)) {
        return true;
      }
      
      return false;
    });
  }

  // Career Keywords
  async getCareerKeywords(): Promise<CareerKeyword[]> {
    const { data, error } = await this.supabase
      .from('career_keywords')
      .select('*');
    
    if (error) throw new Error(`Failed to fetch career keywords: ${error.message}`);
    return data || [];
  }

  async getCareerKeywordsByClusterId(clusterId: number): Promise<CareerKeyword[]> {
    const { data, error } = await this.supabase
      .from('career_keywords')
      .select('*')
      .eq('clusterId', clusterId);
    
    if (error) throw new Error(`Failed to fetch keywords by cluster: ${error.message}`);
    return data || [];
  }

  async createCareerKeyword(keyword: InsertCareerKeyword): Promise<CareerKeyword> {
    const { data, error } = await this.supabase
      .from('career_keywords')
      .insert(keyword)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create career keyword: ${error.message}`);
    return data;
  }

  async searchCareerKeywords(search: string): Promise<CareerKeyword[]> {
    const { data, error } = await this.supabase
      .from('career_keywords')
      .select('*')
      .ilike('keyword', `%${search}%`);
    
    if (error) throw new Error(`Failed to search career keywords: ${error.message}`);
    return data || [];
  }

  // Career Events
  async getCareerEvents(): Promise<CareerEvent[]> {
    const { data, error } = await this.supabase
      .from('career_events')
      .select('*')
      .order('eventDate', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch career events: ${error.message}`);
    return data || [];
  }

  async getCareerEventById(id: number): Promise<CareerEvent | undefined> {
    const { data, error } = await this.supabase
      .from('career_events')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getUpcomingCareerEvents(): Promise<CareerEvent[]> {
    const { data, error } = await this.supabase
      .from('career_events')
      .select('*')
      .gte('eventDate', new Date().toISOString())
      .order('eventDate', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch upcoming events: ${error.message}`);
    return data || [];
  }

  async getCareerEventsByClusterId(clusterId: number): Promise<CareerEvent[]> {
    const { data, error } = await this.supabase
      .from('career_events')
      .select('*')
      .eq('clusterId', clusterId)
      .order('eventDate', { ascending: true });
    
    if (error) throw new Error(`Failed to fetch events by cluster: ${error.message}`);
    return data || [];
  }

  async createCareerEvent(event: InsertCareerEvent): Promise<CareerEvent> {
    const { data, error } = await this.supabase
      .from('career_events')
      .insert({
        ...event,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create career event: ${error.message}`);
    return data;
  }

  // Mentors
  async getMentors(): Promise<Mentor[]> {
    const { data, error } = await this.supabase
      .from('mentors')
      .select('*');
    
    if (error) throw new Error(`Failed to fetch mentors: ${error.message}`);
    return data || [];
  }

  async getMentorById(id: number): Promise<Mentor | undefined> {
    const { data, error } = await this.supabase
      .from('mentors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getMentorsByClusterId(clusterId: number): Promise<Mentor[]> {
    const { data, error } = await this.supabase
      .from('mentors')
      .select('*')
      .eq('clusterId', clusterId);
    
    if (error) throw new Error(`Failed to fetch mentors by cluster: ${error.message}`);
    return data || [];
  }

  async createMentor(mentor: InsertMentor): Promise<Mentor> {
    const { data, error } = await this.supabase
      .from('mentors')
      .insert(mentor)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create mentor: ${error.message}`);
    return data;
  }

  async searchMentorsByKeyword(keyword: string): Promise<Mentor[]> {
    const lowerKeyword = keyword.toLowerCase().trim();
    
    if (!lowerKeyword) {
      return this.getMentors();
    }

    // Get all mentors and apply client-side filtering for complex keyword matching
    const allMentors = await this.getMentors();
    
    // Apply the same search logic as the in-memory implementation
    const searchTerms = lowerKeyword.split(/\s+/).filter(term => term.length > 1);
    
    // Define expanded keyword mappings for common search terms
    const keywordExpansions: Record<string, string[]> = {
      "military": ["army", "navy", "air force", "marines", "soldier", "service", "defense", "veteran", "naval", "combat", "uniform", "war", "weapon", "ship", "sea", "ocean", "water", "coast guard", "space force"],
      "navy": ["ship", "sea", "ocean", "water", "sailor", "vessel", "maritime", "naval"],
      "water": ["ocean", "sea", "maritime", "boat", "ship", "marine", "naval"],
      "ocean": ["sea", "marine", "water", "maritime", "naval", "coast"],
      "sea": ["ocean", "water", "maritime", "ship", "marine", "naval"],
      "ship": ["boat", "vessel", "navy", "ocean", "sea", "maritime"],
      "finance": ["banking", "money", "budget", "investment", "financial", "accounting", "economics", "stocks"],
      "money": ["finance", "banking", "budget", "investment", "wealth", "financial"],
      "tech": ["computers", "coding", "software", "internet", "technology", "digital", "electronics"],
      "computer": ["coding", "tech", "software", "programming", "apps", "internet", "it", "hardware"],
      "programming": ["coding", "software", "development", "apps", "computer", "java", "python", "javascript"],
      "healthcare": ["doctor", "nurse", "medicine", "hospital", "health", "patient", "treatment", "care"],
      "doctor": ["physician", "medical", "healthcare", "medicine", "hospital", "health", "specialist"],
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
    
    // Convert to array for easier comparisons
    const expandedTermsArray = Array.from(expandedKeywords);
    
    return allMentors.filter(mentor => {
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
    const { data, error } = await this.supabase
      .from('mentor_availability')
      .select('*')
      .eq('mentorId', mentorId);
    
    if (error) throw new Error(`Failed to fetch mentor availability: ${error.message}`);
    return data || [];
  }

  async createMentorAvailability(availability: InsertMentorAvailability): Promise<MentorAvailability> {
    const { data, error } = await this.supabase
      .from('mentor_availability')
      .insert(availability)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create mentor availability: ${error.message}`);
    return data;
  }

  // Mentor Sessions
  async getMentorSessions(studentId: number): Promise<MentorSession[]> {
    const { data, error } = await this.supabase
      .from('mentor_sessions')
      .select('*')
      .eq('studentId', studentId)
      .order('sessionDate', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch mentor sessions: ${error.message}`);
    return data || [];
  }

  async getMentorSessionById(id: number): Promise<MentorSession | undefined> {
    const { data, error } = await this.supabase
      .from('mentor_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createMentorSession(session: InsertMentorSession): Promise<MentorSession> {
    const { data, error } = await this.supabase
      .from('mentor_sessions')
      .insert({
        ...session,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create mentor session: ${error.message}`);
    return data;
  }

  async updateMentorSessionStatus(id: number, status: string): Promise<MentorSession> {
    const { data, error } = await this.supabase
      .from('mentor_sessions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update session status: ${error.message}`);
    return data;
  }

  // Notifications
  async getNotifications(userId: number): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch notifications: ${error.message}`);
    return data || [];
  }

  async getUnreadNotifications(userId: number): Promise<Notification[]> {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('userId', userId)
      .eq('isRead', false)
      .order('createdAt', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch unread notifications: ${error.message}`);
    return data || [];
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const { data, error } = await this.supabase
      .from('notifications')
      .insert({
        ...notification,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create notification: ${error.message}`);
    return data;
  }

  async markNotificationAsRead(id: number): Promise<Notification> {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ isRead: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to mark notification as read: ${error.message}`);
    return data;
  }

  async deleteNotification(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`Failed to delete notification: ${error.message}`);
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
  }

  async generateEventNotification(
    eventId: number,
    eventTitle: string,
    eventDate: Date,
    userId: number
  ): Promise<void> {
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
    const { data, error } = await this.supabase
      .from('counselors')
      .select('*')
      .eq('isActive', true)
      .order('name');
    
    if (error) throw new Error(`Failed to fetch counselors: ${error.message}`);
    return data || [];
  }

  async getCounselorById(id: number): Promise<Counselor | undefined> {
    const { data, error } = await this.supabase
      .from('counselors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createCounselor(counselor: InsertCounselor): Promise<Counselor> {
    const { data, error } = await this.supabase
      .from('counselors')
      .insert({
        ...counselor,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create counselor: ${error.message}`);
    return data;
  }

  async updateCounselor(id: number, data: Partial<InsertCounselor>): Promise<Counselor> {
    const { data: result, error } = await this.supabase
      .from('counselors')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update counselor: ${error.message}`);
    return result;
  }

  // Counselor Availability
  async getCounselorAvailability(counselorId: number): Promise<CounselorAvailability[]> {
    const { data, error } = await this.supabase
      .from('counselor_availability')
      .select('*')
      .eq('counselorId', counselorId)
      .eq('isAvailable', true)
      .order('dayOfWeek');
    
    if (error) throw new Error(`Failed to fetch counselor availability: ${error.message}`);
    return data || [];
  }

  async createCounselorAvailability(availability: InsertCounselorAvailability): Promise<CounselorAvailability> {
    const { data, error } = await this.supabase
      .from('counselor_availability')
      .insert({
        ...availability,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create counselor availability: ${error.message}`);
    return data;
  }

  // Counselor Sessions
  async getCounselorSessions(studentId: number): Promise<CounselorSession[]> {
    const { data, error } = await this.supabase
      .from('counselor_sessions')
      .select('*')
      .eq('studentId', studentId)
      .order('sessionDate', { ascending: false });
    
    if (error) throw new Error(`Failed to fetch counselor sessions: ${error.message}`);
    return data || [];
  }

  async getCounselorSessionById(id: number): Promise<CounselorSession | undefined> {
    const { data, error } = await this.supabase
      .from('counselor_sessions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createCounselorSession(session: InsertCounselorSession): Promise<CounselorSession> {
    const { data, error } = await this.supabase
      .from('counselor_sessions')
      .insert({
        ...session,
        createdAt: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create counselor session: ${error.message}`);
    return data;
  }

  async updateCounselorSessionStatus(id: number, status: string): Promise<CounselorSession> {
    const { data, error } = await this.supabase
      .from('counselor_sessions')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update counselor session status: ${error.message}`);
    return data;
  }

  // Newsletter Subscriptions
  async createNewsletterSubscription(email: string): Promise<NewsletterSubscription> {
    const { data, error } = await this.supabase
      .from('newsletter_subscriptions')
      .insert({ email })
      .select()
      .single();

    if (error) throw new Error(`Failed to create newsletter subscription: ${error.message}`);
    return data;
  }

  async getNewsletterSubscription(email: string): Promise<NewsletterSubscription | undefined> {
    const { data, error } = await this.supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('email', email)
      .single();

    if (error) return undefined;
    return data;
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    const { error } = await this.supabase
      .from('newsletter_subscriptions')
      .update({ is_active: false })
      .eq('email', email);

    if (error) throw new Error(`Failed to unsubscribe newsletter: ${error.message}`);
  }
}