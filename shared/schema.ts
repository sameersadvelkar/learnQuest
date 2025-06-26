import { z } from "zod";

// TypeScript interfaces for the data model
export interface School {
  id: number;
  name: string;
  email: string;
  logo: string | null;
  adminName: string | null;
  adminPassword: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  studentsCount: number;
  coursesCount: number;
  isWhiteLabelEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: "student" | "admin" | "super_admin";
  schoolId: number | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  totalPages: number;
  estimatedDuration: number; // in minutes
  difficulty: string | null;
  prerequisites: string[] | null;
  learningObjectives: string[] | null;
  image: string | null;
  category: string | null;
  hasCoursePage: boolean;
  status: "draft" | "pending_approval" | "approved" | "published" | "archived";
  sourceType: "database" | "file_based";
  sourceIdentifier: string | null; // file path for file-based courses
  approvedBy: number | null;
  approvedAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
  instructorName: string | null;
  defaultLanguage: string;
  supportedLanguages: string[];
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  orderIndex: number | null;
  totalActivities: number | null;
  isLocked: boolean | null;
}

export interface Activity {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  type: string; // 'video', 'quiz', 'reading', 'exercise'
  orderIndex: number;
  content: any; // YAML/JSON content
  videoUrl: string | null;
  duration: number | null; // in minutes
  isLocked: boolean | null;
  media: string | null; // JSON string containing activity-specific media assets
}

export interface SchoolCourse {
  id: number;
  schoolId: number;
  courseId: number;
  assignedAt: Date;
}

export interface StudentCourse {
  id: number;
  studentId: number;
  courseId: number;
  assignedBy: number | null;
  assignedAt: Date;
}

export interface UserProgress {
  id: number;
  userId: number;
  courseId: number;
  moduleId: number | null;
  activityId: number | null;
  completed: boolean | null;
  completedAt: Date | null;
  progressPercentage: number | null;
  timeSpent: number | null; // in minutes
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  iconType: string;
  badgeColor: string;
  criteria: any; // JSON criteria for achievement
}

export interface UserAchievement {
  id: number;
  userId: number;
  achievementId: number;
  earnedAt: Date;
}

export interface UserSettings {
  id: number;
  userId: number;
  audioMuted: boolean | null;
  videoQuality: string | null;
  language: string | null;
  notifications: any | null; // JSON settings
}

export interface CourseTranslation {
  id: number;
  courseId: number;
  language: string;
  title: string | null;
  description: string | null;
  prerequisites: string[] | null;
  learningObjectives: string[] | null;
  instructorName: string | null;
  category: string | null;
  additionalContent: any | null; // JSON content
  createdAt: Date;
  updatedAt: Date;
}

// Zod schemas for validation
export const insertSchoolSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  logo: z.string().nullable().optional(),
  adminName: z.string().nullable().optional(),
  adminPassword: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  pincode: z.string().nullable().optional(),
  studentsCount: z.number().optional(),
  coursesCount: z.number().optional(),
  isWhiteLabelEnabled: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(["student", "admin", "super_admin"]).optional(),
  schoolId: z.number().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
});

export const insertCourseSchema = z.object({
  title: z.string(),
  description: z.string(),
  totalModules: z.number(),
  totalPages: z.number(),
  estimatedDuration: z.number(),
  difficulty: z.string().nullable().optional(),
  prerequisites: z.array(z.string()).nullable().optional(),
  learningObjectives: z.array(z.string()).nullable().optional(),
  image: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  hasCoursePage: z.boolean().optional(),
  status: z.enum(["draft", "pending_approval", "approved", "published", "archived"]).optional(),
  sourceType: z.enum(["database", "file_based"]).optional(),
  sourceIdentifier: z.string().nullable().optional(),
  instructorName: z.string().nullable().optional(),
  defaultLanguage: z.string().optional(),
  supportedLanguages: z.array(z.string()).optional(),
});

export const insertModuleSchema = z.object({
  courseId: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  orderIndex: z.number().nullable().optional(),
  totalActivities: z.number().nullable().optional(),
  isLocked: z.boolean().nullable().optional(),
});

export const insertActivitySchema = z.object({
  moduleId: z.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  type: z.string(),
  orderIndex: z.number(),
  content: z.any().optional(),
  videoUrl: z.string().nullable().optional(),
  duration: z.number().nullable().optional(),
  isLocked: z.boolean().nullable().optional(),
  media: z.string().nullable().optional(),
});

export const insertSchoolCourseSchema = z.object({
  schoolId: z.number(),
  courseId: z.number(),
});

export const insertStudentCourseSchema = z.object({
  studentId: z.number(),
  courseId: z.number(),
  assignedBy: z.number().nullable().optional(),
});

export const insertUserProgressSchema = z.object({
  userId: z.number(),
  courseId: z.number(),
  moduleId: z.number().nullable().optional(),
  activityId: z.number().nullable().optional(),
  completed: z.boolean().nullable().optional(),
  completedAt: z.date().nullable().optional(),
  progressPercentage: z.number().nullable().optional(),
  timeSpent: z.number().nullable().optional(),
});

export const insertAchievementSchema = z.object({
  title: z.string(),
  description: z.string(),
  iconType: z.string(),
  badgeColor: z.string(),
  criteria: z.any(),
});

export const insertUserAchievementSchema = z.object({
  userId: z.number(),
  achievementId: z.number(),
});

export const insertUserSettingsSchema = z.object({
  userId: z.number(),
  audioMuted: z.boolean().nullable().optional(),
  videoQuality: z.string().nullable().optional(),
  language: z.string().nullable().optional(),
  notifications: z.any().nullable().optional(),
});

export const insertCourseTranslationSchema = z.object({
  courseId: z.number(),
  language: z.string(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  prerequisites: z.array(z.string()).nullable().optional(),
  learningObjectives: z.array(z.string()).nullable().optional(),
  instructorName: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  additionalContent: z.any().nullable().optional(),
});

// Insert types
export type InsertSchool = z.infer<typeof insertSchoolSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type InsertSchoolCourse = z.infer<typeof insertSchoolCourseSchema>;
export type InsertStudentCourse = z.infer<typeof insertStudentCourseSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertCourseTranslation = z.infer<typeof insertCourseTranslationSchema>;