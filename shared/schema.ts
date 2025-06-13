import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schools = pgTable("schools", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  logo: text("logo"),
  adminName: text("admin_name"),
  adminPassword: text("admin_password"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  studentsCount: integer("students_count").default(0),
  coursesCount: integer("courses_count").default(0),
  isWhiteLabelEnabled: boolean("is_white_label_enabled").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["student", "admin", "super_admin"] }).default("student").notNull(),
  schoolId: integer("school_id").references(() => schools.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  totalModules: integer("total_modules").notNull(),
  totalPages: integer("total_pages").notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  difficulty: text("difficulty").default("Beginner"),
  prerequisites: text("prerequisites").array(),
  learningObjectives: text("learning_objectives").array(),
  image: text("image"),
  category: text("category"),
  hasCoursePage: boolean("has_course_page").default(true),
  status: text("status", { enum: ["draft", "pending_approval", "approved", "published", "archived"] }).default("draft").notNull(),
  sourceType: text("source_type", { enum: ["database", "file_based"] }).default("database").notNull(),
  sourceIdentifier: text("source_identifier"), // file path for file-based courses
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  totalActivities: integer("total_activities").notNull(),
  isLocked: boolean("is_locked").default(false),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // 'video', 'quiz', 'reading', 'exercise'
  orderIndex: integer("order_index").notNull(),
  content: jsonb("content"), // YAML/JSON content
  videoUrl: text("video_url"),
  duration: integer("duration"), // in minutes
  isLocked: boolean("is_locked").default(false),
});

export const schoolCourses = pgTable("school_courses", {
  id: serial("id").primaryKey(),
  schoolId: integer("school_id").notNull().references(() => schools.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const studentCourses = pgTable("student_courses", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  assignedBy: integer("assigned_by").references(() => users.id),
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  courseId: integer("course_id").notNull(),
  moduleId: integer("module_id"),
  activityId: integer("activity_id"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  progressPercentage: integer("progress_percentage").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconType: text("icon_type").notNull(), // 'trophy', 'medal', 'star', etc.
  badgeColor: text("badge_color").notNull(),
  criteria: jsonb("criteria"), // Achievement criteria
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: integer("achievement_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  audioMuted: boolean("audio_muted").default(false),
  videoQuality: text("video_quality").default("auto"),
  language: text("language").default("en"),
  notifications: boolean("notifications").default(true),
});

export const supportRequests = pgTable("support_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  schoolId: integer("school_id").references(() => schools.id),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium").notNull(),
  status: text("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertSchoolSchema = createInsertSchema(schools).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertSchoolCourseSchema = createInsertSchema(schoolCourses).omit({
  id: true,
  assignedAt: true,
});

export const insertStudentCourseSchema = createInsertSchema(studentCourses).omit({
  id: true,
  assignedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
});

export const insertSupportRequestSchema = createInsertSchema(supportRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type School = typeof schools.$inferSelect;
export type InsertSchool = z.infer<typeof insertSchoolSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type SchoolCourse = typeof schoolCourses.$inferSelect;
export type InsertSchoolCourse = z.infer<typeof insertSchoolCourseSchema>;

export type StudentCourse = typeof studentCourses.$inferSelect;
export type InsertStudentCourse = z.infer<typeof insertStudentCourseSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export type SupportRequest = typeof supportRequests.$inferSelect;
export type InsertSupportRequest = z.infer<typeof insertSupportRequestSchema>;

// Content schemas for YAML/JSON validation
export const pageContentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["video", "reading", "quiz", "exercise"]),
  videoUrl: z.string().optional(),
  content: z.array(z.object({
    type: z.enum(["text", "code", "list", "image", "video"]),
    title: z.string().optional(),
    content: z.string(),
    language: z.string().optional(), // for code blocks
  })).optional(),
  objectives: z.array(z.string()).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    type: z.enum(["pdf", "link", "video", "document"]),
  })).optional(),
  quiz: z.object({
    questions: z.array(z.object({
      id: z.string(),
      question: z.string(),
      type: z.enum(["multiple-choice", "true-false", "text"]),
      options: z.array(z.string()).optional(),
      correctAnswer: z.union([z.string(), z.number()]),
      explanation: z.string().optional(),
    }))
  }).optional(),
});

export type PageContent = z.infer<typeof pageContentSchema>;
