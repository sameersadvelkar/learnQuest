import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static course files
app.use('/courses', express.static(path.resolve(__dirname, '..', 'courses')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Helper function to load content with language support
async function loadCourseContentByLanguage(coursePath: string, filename: string, language: string = 'en'): Promise<any> {
  const languageFiles = [
    path.join(coursePath, `${filename}.${language}.json`), // course.hn.json
    path.join(coursePath, `${filename}.json`)              // course.json (fallback)
  ];
  
  for (const filePath of languageFiles) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // Continue to next file if current doesn't exist
      continue;
    }
  }
  
  throw new Error(`No content file found for ${filename}`);
}

// Discover all course directories automatically
async function discoverCourseDirectories(coursesPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(coursesPath, { withFileTypes: true });
    const courseDirectories = [];
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const coursePath = path.join(coursesPath, entry.name);
        const courseJsonPath = path.join(coursePath, 'course.json');
        
        // Check if directory has a course.json file
        try {
          await fs.access(courseJsonPath);
          courseDirectories.push(entry.name);
          console.log(`Found valid course directory: ${entry.name}`);
        } catch {
          console.log(`Skipping directory ${entry.name}: no course.json found`);
        }
      }
    }
    
    return courseDirectories;
  } catch (error) {
    console.error('Error discovering course directories:', error);
    return [];
  }
}

// Initialize file-based courses into server storage
async function initializeFileBasedCourses(): Promise<void> {
  try {
    console.log('Initializing file-based courses...');
    
    // Discover all course directories automatically
    const coursesPath = path.resolve(__dirname, '..', 'courses');
    const courseDirectories = await discoverCourseDirectories(coursesPath);
    
    console.log(`Found ${courseDirectories.length} course directories:`, courseDirectories);
    
    // Load each discovered course
    for (const courseFolder of courseDirectories) {
      try {
        const coursePath = path.join(coursesPath, courseFolder);
        
        // Read course.json (default English)
        const courseData = await loadCourseContentByLanguage(coursePath, 'course', 'en');
        
        // Create course in storage
        const course = await storage.createCourse({
          title: courseData.title,
          description: courseData.description,
          totalModules: courseData.totalModules,
          totalPages: courseData.totalPages || courseData.totalModules,
          estimatedDuration: courseData.estimatedDuration,
          difficulty: courseData.difficulty,
          prerequisites: courseData.prerequisites || [],
          learningObjectives: courseData.learningObjectives || [],
          image: courseData.image || null,

          category: courseData.category || 'General',
          hasCoursePage: courseData.hasCoursePage !== false,
          sourceType: 'file_based',
          sourceIdentifier: courseFolder,
          status: 'published',
          approvedBy: null,
          approvedAt: null,
          publishedAt: new Date(),
          instructorName: courseData.instructorName || 'CourseWind AI',
          defaultLanguage: courseData.defaultLanguage || 'en',
          supportedLanguages: courseData.supportedLanguages || ['en']
        });
        
        console.log(`Created course: ${course.title} (ID: ${course.id})`);
        
        // Load modules
        const moduleNames = courseData.modules || [];
        for (let i = 0; i < moduleNames.length; i++) {
          const moduleName = moduleNames[i];
          const moduleJsonPath = path.join(coursePath, 'modules', moduleName, 'module.json');
          
          try {
            const moduleData = JSON.parse(await fs.readFile(moduleJsonPath, 'utf-8'));
            
            const module = await storage.createModule({
              courseId: course.id,
              title: moduleData.title,
              description: moduleData.description,
              orderIndex: i + 1,
              totalActivities: moduleData.activities?.length || 0,
              isLocked: moduleData.isLocked || false
            });
            
            console.log(`Created module: ${module.title} (ID: ${module.id})`);
            
            // Load activities for this module
            const activityNames = moduleData.activities || [];
            for (let j = 0; j < activityNames.length; j++) {
              const activityName = activityNames[j];
              const activityJsonPath = path.join(coursePath, 'modules', moduleName, 'activities', `${activityName}.json`);
              
              try {
                const activityData = JSON.parse(await fs.readFile(activityJsonPath, 'utf-8'));
                
                const activity = await storage.createActivity({
                  moduleId: module.id,
                  title: activityData.title,
                  description: activityData.description,
                  type: activityData.type,
                  orderIndex: j + 1,
                  content: JSON.stringify(activityData.content) || null,
                  videoUrl: activityData.videoUrl || null,
                  duration: activityData.estimatedDuration || null,
                  isLocked: activityData.isLocked || false,
                  media: activityData.media ? JSON.stringify(activityData.media) : null
                });
                
                console.log(`Created activity: ${activity.title} (ID: ${activity.id})`);
              } catch (activityError) {
                console.warn(`Could not load activity ${activityName}:`, activityError);
              }
            }
          } catch (moduleError) {
            console.warn(`Could not load module ${moduleName}:`, moduleError);
          }
        }
      } catch (courseError) {
        console.error(`Failed to load course ${courseFolder}:`, courseError);
      }
    }
    
    console.log('File-based courses initialized successfully');
  } catch (error) {
    console.error('Error initializing file-based courses:', error);
  }
}

(async () => {
  // Initialize storage with file-based courses
  await initializeFileBasedCourses();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on configurable port for production deployment
  const port = process.env.PORT || 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
