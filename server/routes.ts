import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { 
  insertMentorSessionSchema, 
  insertCareerKeywordSchema, 
  insertNotificationSchema,
  insertCareerEventSchema,
  insertCounselorSessionSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: "Valid email address is required" });
      }

      // Check if already subscribed
      const existing = await storage.getNewsletterSubscription(email);
      if (existing && existing.isActive) {
        return res.status(200).json({ message: "Already subscribed to newsletter" });
      }

      const subscription = await storage.createNewsletterSubscription(email);
      res.status(201).json({ message: "Successfully subscribed to newsletter" });
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
    }
  });

  // Career Clusters API Routes
  app.get("/api/career-clusters", async (req, res) => {
    try {
      const clusters = await storage.getCareerClusters();
      res.json(clusters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career clusters" });
    }
  });

  app.get("/api/career-clusters/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const clusters = await storage.getCareerClustersByCategory(category);
      res.json(clusters);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career clusters by category" });
    }
  });

  app.get("/api/career-clusters/search", async (req, res) => {
    try {
      const { keyword } = req.query;
      if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({ error: "Keyword parameter is required" });
      }
      const clusters = await storage.searchCareerClustersByKeyword(keyword);
      res.json(clusters);
    } catch (error) {
      res.status(500).json({ error: "Failed to search career clusters" });
    }
  });

  app.get("/api/career-clusters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid cluster ID" });
      }
      
      const cluster = await storage.getCareerClusterById(id);
      if (!cluster) {
        return res.status(404).json({ error: "Career cluster not found" });
      }
      
      res.json(cluster);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career cluster" });
    }
  });
  
  // Career Keywords API Routes
  app.get("/api/career-keywords", async (req, res) => {
    try {
      const keywords = await storage.getCareerKeywords();
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career keywords" });
    }
  });
  
  app.get("/api/career-keywords/cluster/:clusterId", async (req, res) => {
    try {
      const clusterId = parseInt(req.params.clusterId);
      if (isNaN(clusterId)) {
        return res.status(400).json({ error: "Invalid cluster ID" });
      }
      
      const keywords = await storage.getCareerKeywordsByClusterId(clusterId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch keywords by cluster" });
    }
  });
  
  app.get("/api/career-keywords/search", async (req, res) => {
    try {
      const { search } = req.query;
      if (!search || typeof search !== "string") {
        return res.status(400).json({ error: "Search parameter is required" });
      }
      
      const keywords = await storage.searchCareerKeywords(search);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ error: "Failed to search keywords" });
    }
  });
  
  app.post("/api/career-keywords", async (req, res) => {
    try {
      const validationResult = insertCareerKeywordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid keyword data", details: validationResult.error });
      }
      
      const keyword = await storage.createCareerKeyword(validationResult.data);
      res.status(201).json(keyword);
    } catch (error) {
      res.status(500).json({ error: "Failed to create keyword" });
    }
  });

  // Mentors API Routes
  app.get("/api/mentors", async (req, res) => {
    try {
      const mentors = await storage.getMentors();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentors" });
    }
  });

  // Order is important here - more specific routes need to be defined first
  app.get("/api/mentors/search", async (req, res) => {
    try {
      const { keyword } = req.query;
      if (!keyword || typeof keyword !== "string") {
        return res.status(400).json({ error: "Keyword parameter is required" });
      }
      
      const mentors = await storage.searchMentorsByKeyword(keyword);
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: "Failed to search mentors" });
    }
  });

  app.get("/api/mentors/cluster/:clusterId", async (req, res) => {
    try {
      const clusterId = parseInt(req.params.clusterId);
      if (isNaN(clusterId)) {
        return res.status(400).json({ error: "Invalid cluster ID" });
      }
      
      const mentors = await storage.getMentorsByClusterId(clusterId);
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentors by cluster" });
    }
  });

  // Generic ID route must come after more specific routes 
  app.get("/api/mentors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid mentor ID" });
      }
      
      const mentor = await storage.getMentorById(id);
      if (!mentor) {
        return res.status(404).json({ error: "Mentor not found" });
      }
      
      res.json(mentor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentor" });
    }
  });

  // Mentor Availability API Routes
  app.get("/api/mentor-availability/:mentorId", async (req, res) => {
    try {
      const mentorId = parseInt(req.params.mentorId);
      if (isNaN(mentorId)) {
        return res.status(400).json({ error: "Invalid mentor ID" });
      }
      
      const availability = await storage.getMentorAvailability(mentorId);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentor availability" });
    }
  });

  // Mentor Sessions API Routes (Protected)
  app.get("/api/mentor-sessions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const studentId = req.user!.id;
      const sessions = await storage.getMentorSessions(studentId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mentor sessions" });
    }
  });

  app.post("/api/mentor-sessions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const schema = insertMentorSessionSchema
        .extend({
          date: z.string().transform((val) => new Date(val))
        });
      
      const validationResult = schema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid session data", details: validationResult.error });
      }
      
      // Override the studentId with the authenticated user's ID
      const sessionData = {
        ...validationResult.data,
        studentId: req.user!.id,
      };
      
      const session = await storage.createMentorSession(sessionData);
      
      // Get mentor name for notification
      const mentor = await storage.getMentorById(session.mentorId);
      if (mentor) {
        // Generate notifications for the new session
        await storage.generateSessionNotifications(
          session.id,
          mentor.name,
          session.date,
          session.studentId
        );
      }
      
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to create mentor session" });
    }
  });

  app.patch("/api/mentor-sessions/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== "string" || !["scheduled", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      
      const session = await storage.getMentorSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Only allow users to modify their own sessions
      if (session.studentId !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to modify this session" });
      }
      
      const updatedSession = await storage.updateMentorSessionStatus(id, status);
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ error: "Failed to update session status" });
    }
  });
  
  // User Career Keywords API Routes (Protected)
  app.patch("/api/user/career-keywords", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const schema = z.object({
        keywords: z.array(z.string())
      });
      
      const validationResult = schema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid keywords data", details: validationResult.error });
      }
      
      const userId = req.user!.id;
      const { keywords } = validationResult.data;
      
      const updatedUser = await storage.updateUserKeywords(userId, keywords);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user keywords" });
    }
  });
  
  // Notifications API Routes (Protected)
  app.get("/api/notifications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const userId = req.user!.id;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });
  
  app.get("/api/notifications/unread", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const userId = req.user!.id;
      const notifications = await storage.getUnreadNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch unread notifications" });
    }
  });
  
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid notification ID" });
      }
      
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });
  
  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid notification ID" });
      }
      
      await storage.deleteNotification(id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });
  
  // Career Events API Routes
  app.get("/api/career-events", async (req, res) => {
    try {
      const events = await storage.getCareerEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career events" });
    }
  });
  
  app.get("/api/career-events/upcoming", async (req, res) => {
    try {
      const events = await storage.getUpcomingCareerEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming career events" });
    }
  });
  
  app.get("/api/career-events/cluster/:clusterId", async (req, res) => {
    try {
      const clusterId = parseInt(req.params.clusterId);
      if (isNaN(clusterId)) {
        return res.status(400).json({ error: "Invalid cluster ID" });
      }
      
      const events = await storage.getCareerEventsByClusterId(clusterId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch events by cluster" });
    }
  });
  
  app.get("/api/career-events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const event = await storage.getCareerEventById(id);
      if (!event) {
        return res.status(404).json({ error: "Career event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch career event" });
    }
  });
  
  app.post("/api/career-events", async (req, res) => {
    try {
      // Admin-only endpoint in a real app
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const schema = insertCareerEventSchema
        .extend({
          eventDate: z.string().transform((val) => new Date(val))
        });
      
      const validationResult = schema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid event data", details: validationResult.error });
      }
      
      const event = await storage.createCareerEvent(validationResult.data);
      
      // Send notification to all users about this event (simplified for demo)
      // In a real app, would filter by users who might be interested in this event
      await storage.generateEventNotification(
        event.id,
        event.title,
        event.eventDate,
        req.user!.id // For now, just notify the creator
      );
      
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create career event" });
    }
  });

  // Counselors API Routes
  app.get("/api/counselors", async (req, res) => {
    try {
      const counselors = await storage.getCounselors();
      res.json(counselors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch counselors" });
    }
  });

  app.get("/api/counselors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid counselor ID" });
      }
      
      const counselor = await storage.getCounselorById(id);
      if (!counselor) {
        return res.status(404).json({ error: "Counselor not found" });
      }
      
      res.json(counselor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch counselor" });
    }
  });

  app.get("/api/counselors/:id/availability", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid counselor ID" });
      }
      
      const availability = await storage.getCounselorAvailability(id);
      res.json(availability);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch counselor availability" });
    }
  });

  // Counselor Sessions API Routes (Protected)
  app.get("/api/counselor-sessions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const userId = req.user!.id;
      const sessions = await storage.getCounselorSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch counselor sessions" });
    }
  });

  app.post("/api/counselor-sessions", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const schema = insertCounselorSessionSchema
        .extend({
          sessionDate: z.string().transform((val) => new Date(val)),
          studentId: z.number().optional()
        });
      
      const validationResult = schema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid session data", details: validationResult.error });
      }
      
      const userId = req.user!.id;
      const sessionData = { ...validationResult.data, studentId: userId };
      
      const session = await storage.createCounselorSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to create counselor session" });
    }
  });

  app.patch("/api/counselor-sessions/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid session ID" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== "string" || !["scheduled", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }
      
      const session = await storage.getCounselorSessionById(id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      
      // Only allow users to modify their own sessions
      if (session.studentId !== req.user!.id) {
        return res.status(403).json({ error: "Not authorized to modify this session" });
      }
      
      const updatedSession = await storage.updateCounselorSessionStatus(id, status);
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ error: "Failed to update session status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
