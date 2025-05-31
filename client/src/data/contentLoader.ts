import { Course, Module, Activity } from '@shared/schema';

// Content loader for file-based content management
export class ContentLoader {
  private static instance: ContentLoader;
  private courses: Course[] = [];
  private modules: Module[] = [];
  private activities: Activity[] = [];
  private loaded: boolean = false;

  static getInstance(): ContentLoader {
    if (!ContentLoader.instance) {
      ContentLoader.instance = new ContentLoader();
    }
    return ContentLoader.instance;
  }

  async loadAllContent(): Promise<{ courses: Course[], modules: Module[], activities: Activity[] }> {
    if (this.loaded) {
      return { courses: this.courses, modules: this.modules, activities: this.activities };
    }

    // Clear existing data to prevent duplicates
    this.courses = [];
    this.modules = [];
    this.activities = [];

    try {
      // Load React course content
      await this.loadReactCourse();
      
      this.loaded = true;
      return { courses: this.courses, modules: this.modules, activities: this.activities };
    } catch (error) {
      console.error('Error loading content:', error);
      // Fallback to existing sample data if file loading fails
      const { sampleCourse, sampleModules, sampleActivities } = await import('./courseContent');
      return { 
        courses: [sampleCourse], 
        modules: sampleModules, 
        activities: sampleActivities 
      };
    }
  }

  private async loadReactCourse(): Promise<void> {
    // Load course
    const courseData = await import('./content/courses/react-course/course.json');
    const course: Course = {
      ...courseData,
      createdAt: new Date(courseData.createdAt)
    };
    this.courses.push(course);

    // Load modules
    await this.loadModule('module-1', course.id);
    await this.loadModule('module-2', course.id);
    await this.loadModule('module-3', course.id);
  }

  private async loadModule(moduleFolder: string, courseId: number): Promise<void> {
    try {
      const moduleData = await import(`./content/courses/react-course/modules/${moduleFolder}/module.json`);
      const module: Module = {
        ...moduleData,
        courseId
      };
      this.modules.push(module);

      // Load activities for this module
      for (const activityFile of moduleData.activities) {
        await this.loadActivity(moduleFolder, activityFile, module.id);
      }
    } catch (error) {
      console.error(`Error loading module ${moduleFolder}:`, error);
    }
  }

  private async loadActivity(moduleFolder: string, activityFile: string, moduleId: number): Promise<void> {
    try {
      const activityData = await import(`./content/courses/react-course/modules/${moduleFolder}/activities/${activityFile}.json`);
      const activity: Activity = {
        ...activityData,
        moduleId,
        content: activityData.content || null,
        videoUrl: activityData.videoUrl || null,
        duration: activityData.duration || null,
        isLocked: activityData.isLocked || false,
        description: activityData.description || null
      };
      this.activities.push(activity);
    } catch (error) {
      console.error(`Error loading activity ${activityFile}:`, error);
    }
  }

  // Helper methods for developers
  async getCourse(courseId: number): Promise<Course | undefined> {
    const content = await this.loadAllContent();
    return content.courses.find(c => c.id === courseId);
  }

  async getModulesByCourse(courseId: number): Promise<Module[]> {
    const content = await this.loadAllContent();
    return content.modules.filter(m => m.courseId === courseId);
  }

  async getActivitiesByModule(moduleId: number): Promise<Activity[]> {
    const content = await this.loadAllContent();
    return content.activities.filter(a => a.moduleId === moduleId);
  }

  // Method to reload content (useful for development)
  async reloadContent(): Promise<void> {
    this.loaded = false;
    this.courses = [];
    this.modules = [];
    this.activities = [];
    await this.loadAllContent();
  }
}

// Export singleton instance
export const contentLoader = ContentLoader.getInstance();