import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  avatarUrl: text("avatar_url"),
  careerKeywords: text("career_keywords").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  avatarUrl: true,
  careerKeywords: true,
});

export const careerClusters = pgTable("career_clusters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'florida' or 'military'
  description: text("description").notNull(),
  iconName: text("icon_name").notNull(),
});

export const insertCareerClusterSchema = createInsertSchema(careerClusters).pick({
  name: true,
  category: true,
  description: true,
  iconName: true,
});

export const mentors = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  avatarUrl: text("avatar_url"),
  rating: integer("rating").notNull(),
  yearsExperience: integer("years_experience").notNull(),
  location: text("location").notNull(),
  expertise: text("expertise").array().notNull(),
  bio: text("bio").notNull(),
  clusterId: integer("cluster_id").notNull(),
  clusterName: text("cluster_name"),
  keywords: text("keywords").array(),
});

export const insertMentorSchema = createInsertSchema(mentors).pick({
  name: true,
  title: true,
  company: true,
  avatarUrl: true,
  rating: true,
  yearsExperience: true,
  location: true,
  expertise: true,
  bio: true,
  clusterId: true,
  clusterName: true,
  keywords: true,
});

export const mentorAvailability = pgTable("mentor_availability", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").notNull(),
  date: timestamp("date").notNull(),
  isAvailable: boolean("is_available").default(true),
});

export const insertMentorAvailabilitySchema = createInsertSchema(mentorAvailability).pick({
  mentorId: true,
  date: true,
  isAvailable: true,
});

export const mentorSessions = pgTable("mentor_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  mentorId: integer("mentor_id").notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // 'scheduled', 'completed', 'cancelled'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMentorSessionSchema = createInsertSchema(mentorSessions).pick({
  studentId: true,
  mentorId: true,
  date: true,
  status: true,
  notes: true,
});

export const careerKeywords = pgTable("career_keywords", {
  id: serial("id").primaryKey(),
  clusterId: integer("cluster_id").notNull(),
  keyword: text("keyword").notNull().unique(),
});

export const insertCareerKeywordSchema = createInsertSchema(careerKeywords).pick({
  clusterId: true,
  keyword: true,
});

// Types exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type CareerCluster = typeof careerClusters.$inferSelect;
export type InsertCareerCluster = z.infer<typeof insertCareerClusterSchema>;

export type Mentor = typeof mentors.$inferSelect;
export type InsertMentor = z.infer<typeof insertMentorSchema>;

export type MentorAvailability = typeof mentorAvailability.$inferSelect;
export type InsertMentorAvailability = z.infer<typeof insertMentorAvailabilitySchema>;

export type MentorSession = typeof mentorSessions.$inferSelect;
export type InsertMentorSession = z.infer<typeof insertMentorSessionSchema>;

export type CareerKeyword = typeof careerKeywords.$inferSelect;
export type InsertCareerKeyword = z.infer<typeof insertCareerKeywordSchema>;

export const careerEvents = pgTable("career_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  eventDate: timestamp("event_date").notNull(),
  registrationUrl: text("registration_url"),
  imageUrl: text("image_url"),
  clusterId: integer("cluster_id").references(() => careerClusters.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCareerEventSchema = createInsertSchema(careerEvents).pick({
  title: true,
  description: true,
  location: true,
  eventDate: true,
  registrationUrl: true,
  imageUrl: true,
  clusterId: true,
});

export type CareerEvent = typeof careerEvents.$inferSelect;
export type InsertCareerEvent = z.infer<typeof insertCareerEventSchema>;

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: integer("session_id"),
  eventId: integer("event_id").references(() => careerEvents.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // 'upcoming_session', 'reminder', 'cancellation', 'event', etc.
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  sessionId: true,
  eventId: true,
  title: true,
  message: true,
  type: true,
  isRead: true,
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

// Counselors table for in-house school counselors
export const counselors = pgTable("counselors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  bio: text("bio"),
  specialties: text("specialties").array(),
  avatarUrl: text("avatarUrl"),
  officeLocation: text("officeLocation"),
  officeHours: text("officeHours"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertCounselorSchema = createInsertSchema(counselors).pick({
  name: true,
  title: true,
  department: true,
  email: true,
  phone: true,
  bio: true,
  specialties: true,
  avatarUrl: true,
  officeLocation: true,
  officeHours: true,
  isActive: true,
});

export type Counselor = typeof counselors.$inferSelect;
export type InsertCounselor = z.infer<typeof insertCounselorSchema>;

// Counselor availability table
export const counselorAvailability = pgTable("counselor_availability", {
  id: serial("id").primaryKey(),
  counselorId: integer("counselorId").notNull().references(() => counselors.id),
  dayOfWeek: text("dayOfWeek").notNull(), // Monday, Tuesday, etc.
  startTime: text("startTime").notNull(), // "09:00"
  endTime: text("endTime").notNull(), // "17:00"
  isAvailable: boolean("isAvailable").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertCounselorAvailabilitySchema = createInsertSchema(counselorAvailability).pick({
  counselorId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
  isAvailable: true,
});

export type CounselorAvailability = typeof counselorAvailability.$inferSelect;
export type InsertCounselorAvailability = z.infer<typeof insertCounselorAvailabilitySchema>;

// Counselor sessions table
export const counselorSessions = pgTable("counselor_sessions", {
  id: serial("id").primaryKey(),
  studentId: integer("studentId").notNull().references(() => users.id),
  counselorId: integer("counselorId").notNull().references(() => counselors.id),
  sessionDate: timestamp("sessionDate").notNull(),
  duration: integer("duration").default(30), // minutes
  sessionType: text("sessionType").notNull(), // "College Applications", "Course Planning", etc.
  notes: text("notes"),
  status: text("status").default("scheduled"), // scheduled, completed, cancelled
  meetingLink: text("meetingLink"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const insertCounselorSessionSchema = createInsertSchema(counselorSessions).pick({
  studentId: true,
  counselorId: true,
  sessionDate: true,
  duration: true,
  sessionType: true,
  notes: true,
  status: true,
  meetingLink: true,
});

export type CounselorSession = typeof counselorSessions.$inferSelect;
export type InsertCounselorSession = z.infer<typeof insertCounselorSessionSchema>;

// Newsletter subscriptions table
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  isActive: boolean("is_active").default(true),
  preferences: jsonb("preferences"), // For future segmentation
});

export const insertNewsletterSubscriptionSchema = createInsertSchema(newsletterSubscriptions).pick({
  email: true,
  isActive: true,
  preferences: true,
});

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = z.infer<typeof insertNewsletterSubscriptionSchema>;
