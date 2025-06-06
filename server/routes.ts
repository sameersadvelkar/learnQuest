import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCourseSchema, insertModuleSchema, insertActivitySchema, insertUserProgressSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Find user by username
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, you'd hash and compare passwords
      // For now, we'll do a simple comparison
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // School routes
  app.get("/api/schools/:id", async (req, res) => {
    try {
      const schoolId = parseInt(req.params.id);
      const school = await storage.getSchool(schoolId);
      
      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }
      
      res.json(school);
    } catch (error) {
      console.error("Error fetching school:", error);
      res.status(500).json({ message: "Failed to fetch school" });
    }
  });

  // Create school with admin account
  app.post("/api/schools", async (req, res) => {
    try {
      const { name, email, adminName, address, city, state, pincode, isWhiteLabelEnabled, adminPassword } = req.body;
      
      if (!name || !email || !adminName || !address || !city || !state || !pincode) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      // Create the school
      const school = await storage.createSchool({
        name,
        email,
        adminName,
        adminPassword,
        address,
        city,
        state,
        pincode,
        studentsCount: 0,
        coursesCount: 0,
        isWhiteLabelEnabled: isWhiteLabelEnabled || false,
        isActive: true,
        logo: null
      });

      // Create the admin user for this school
      const adminUser = await storage.createUser({
        username: adminName.toLowerCase().replace(/\s+/g, ''),
        email,
        password: adminPassword,
        role: 'admin',
        firstName: adminName.split(' ')[0] || adminName,
        lastName: adminName.split(' ').slice(1).join(' ') || '',
        schoolId: school.id
      });

      res.json({ school, adminUser: { ...adminUser, password: undefined } });
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(500).json({ message: "Failed to create school" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Course preview with full details
  app.get("/api/courses/:id/preview", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Get modules and activities for the course
      const modules = await storage.getModulesByCourse(courseId);
      const courseWithModules = {
        ...course,
        modules: await Promise.all(modules.map(async (module) => {
          const activities = await storage.getActivitiesByModule(module.id);
          return {
            ...module,
            activities
          };
        }))
      };

      res.json(courseWithModules);
    } catch (error) {
      console.error("Error fetching course preview:", error);
      res.status(500).json({ message: "Failed to fetch course preview" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      const validatedCourse = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedCourse);
      res.status(201).json(course);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid course data", errors: error.errors });
      }
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Module routes
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const modules = await storage.getModulesByCourse(courseId);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ message: "Failed to fetch modules" });
    }
  });

  app.post("/api/modules", async (req, res) => {
    try {
      const validatedModule = insertModuleSchema.parse(req.body);
      const module = await storage.createModule(validatedModule);
      res.status(201).json(module);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid module data", errors: error.errors });
      }
      console.error("Error creating module:", error);
      res.status(500).json({ message: "Failed to create module" });
    }
  });

  // Activity routes
  app.get("/api/modules/:moduleId/activities", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const activities = await storage.getActivitiesByModule(moduleId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.get("/api/courses/:courseId/activities", async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const activities = await storage.getActivitiesByCourse(courseId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const validatedActivity = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedActivity);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid activity data", errors: error.errors });
      }
      console.error("Error creating activity:", error);
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const validatedProgress = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      const progress = await storage.createUserProgress(validatedProgress);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      console.error("Error creating user progress:", error);
      res.status(500).json({ message: "Failed to create user progress" });
    }
  });

  app.put("/api/users/:userId/progress/:progressId", async (req, res) => {
    try {
      const progressId = parseInt(req.params.progressId);
      const updates = req.body;
      const progress = await storage.updateUserProgress(progressId, updates);
      
      if (!progress) {
        return res.status(404).json({ message: "Progress record not found" });
      }
      
      res.json(progress);
    } catch (error) {
      console.error("Error updating user progress:", error);
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // User settings routes
  app.get("/api/users/:userId/settings", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const settings = await storage.getUserSettings(userId);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.post("/api/users/:userId/settings", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const validatedSettings = insertUserSettingsSchema.parse({
        ...req.body,
        userId
      });
      const settings = await storage.createUserSettings(validatedSettings);
      res.status(201).json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      console.error("Error creating user settings:", error);
      res.status(500).json({ message: "Failed to create user settings" });
    }
  });

  app.put("/api/users/:userId/settings", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      const settings = await storage.updateUserSettings(userId, updates);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post("/api/users/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { achievementId } = req.body;
      
      if (!achievementId) {
        return res.status(400).json({ message: "Achievement ID is required" });
      }
      
      const userAchievement = await storage.createUserAchievement({
        userId,
        achievementId: parseInt(achievementId)
      });
      
      res.status(201).json(userAchievement);
    } catch (error) {
      console.error("Error creating user achievement:", error);
      res.status(500).json({ message: "Failed to create user achievement" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
