import fs from 'fs/promises';
import path from 'path';

export class LanguageLoader {
  private coursesPath: string;

  constructor() {
    this.coursesPath = path.resolve(process.cwd(), 'courses');
  }

  private async getCourseFolder(courseId: number): Promise<string | null> {
    try {
      // Import storage to get course details
      const { storage } = await import('./storage');
      const course = await storage.getCourse(courseId);
      
      if (course && course.sourceIdentifier) {
        return course.sourceIdentifier;
      }
      
      // Fallback mapping for legacy courses
      if (courseId === 1) {
        return 'digital-wellness-safety';
      } else if (courseId === 2) {
        return 'example-course';
      }
      
      return null;
    } catch (error) {
      console.error('Error getting course folder for courseId', courseId, ':', error);
      return null;
    }
  }

  async loadCourseContent(courseId: number, language: string = 'en'): Promise<any | null> {
    try {
      const courseFolder = await this.getCourseFolder(courseId);
      if (!courseFolder) {
        console.log(`No course folder found for course ID ${courseId}`);
        return null;
      }
      
      const coursePath = path.join(this.coursesPath, courseFolder);
      const languageFilePath = path.join(coursePath, `course.${language}.json`);
      
      const content = await fs.readFile(languageFilePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.log(`No ${language} course file found for course ${courseId}, using default`);
      return null;
    }
  }

  async loadModuleContent(moduleId: number, language: string = 'en'): Promise<any | null> {
    try {
      // Get course ID from module
      const { storage } = await import('./storage');
      const module = await storage.getModule(moduleId);
      if (!module) {
        console.log(`Module ${moduleId} not found`);
        return null;
      }
      
      const courseFolder = await this.getCourseFolder(module.courseId);
      if (!courseFolder) {
        console.log(`No course folder found for course ID ${module.courseId}`);
        return null;
      }
      
      // Map module ID to correct module folder
      const moduleFolder = `module-${moduleId}`;
      
      const coursePath = path.join(this.coursesPath, courseFolder);
      const modulePath = path.join(
        coursePath, 
        'modules', 
        moduleFolder, 
        `module.${language}.json`
      );
      
      console.log(`Loading module content from: ${modulePath}`);
      const content = await fs.readFile(modulePath, 'utf-8');
      const parsedContent = JSON.parse(content);
      console.log(`Loaded ${language} module content: ${parsedContent.title}`);
      return parsedContent;
    } catch (error) {
      console.log(`No ${language} module file found for module ${moduleId}, using default`);
      return null;
    }
  }

  async loadActivityContent(activityId: number, moduleId: number, language: string = 'en'): Promise<any | null> {
    try {
      // Get course ID from module
      const { storage } = await import('./storage');
      const module = await storage.getModule(moduleId);
      if (!module) {
        console.log(`Module ${moduleId} not found`);
        return null;
      }
      
      const courseFolder = await this.getCourseFolder(module.courseId);
      if (!courseFolder) {
        console.log(`No course folder found for course ID ${module.courseId}`);
        return null;
      }
      
      // Map module ID to correct module folder (1-based indexing)
      const moduleFolder = `module-${moduleId}`;
      
      // Map activity ID to correct activity file (1-based indexing)  
      const activityFile = `activity-${activityId}.${language}.json`;
      
      const coursePath = path.join(this.coursesPath, courseFolder);
      const activityPath = path.join(
        coursePath, 
        'modules', 
        moduleFolder, 
        'activities', 
        activityFile
      );
      
      console.log(`Loading activity content from: ${activityPath}`);
      const content = await fs.readFile(activityPath, 'utf-8');
      const parsedContent = JSON.parse(content);
      console.log(`Loaded ${language} activity content: ${parsedContent.title}`);
      return parsedContent;
    } catch (error) {
      console.log(`No ${language} activity file found for activity ${activityId}, using default`);
      return null;
    }
  }
}

export const languageLoader = new LanguageLoader();