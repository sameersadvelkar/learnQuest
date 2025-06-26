interface CourseData {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  totalPages: number;
  estimatedDuration: number;
  difficulty?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  category?: string;
  image?: string;
  hasCoursePage?: boolean;
  createdAt: string;
  modules: string[];
}

interface ModuleData {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  totalActivities: number;
  isLocked: boolean;
  activities: string[];
}

interface ActivityData {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz' | 'interactive';
  orderIndex: number;
  content: any;
  isRequired: boolean;
  estimatedDuration: number;
}

export class FileContentLoader {
  private courses: Map<string, CourseData> = new Map();
  private modules: Map<string, ModuleData> = new Map();
  private activities: Map<string, ActivityData> = new Map();

  async loadAllContent(): Promise<{
    courses: CourseData[];
    modules: ModuleData[];
    activities: ActivityData[];
  }> {
    try {
      // Load React Fundamentals course
      await this.loadCourse('react-fundamentals');
      
      // Load Digital Wellness & Safety course
      await this.loadCourse('digital-wellness');
      
      return {
        courses: Array.from(this.courses.values()),
        modules: Array.from(this.modules.values()),
        activities: Array.from(this.activities.values())
      };
    } catch (error) {
      console.error('Error loading file-based content:', error);
      return { courses: [], modules: [], activities: [] };
    }
  }

  private async loadCourse(courseFolder: string): Promise<void> {
    try {
      // Load course.json
      const courseResponse = await fetch(`/courses/${courseFolder}/course.json`);
      if (courseResponse.ok) {
        const courseData: CourseData = await courseResponse.json();
        this.courses.set(courseFolder, courseData);

        // Load modules for this course
        for (const moduleFolder of courseData.modules) {
          await this.loadModule(courseFolder, moduleFolder);
        }
      }
    } catch (error) {
      console.error(`Error loading course ${courseFolder}:`, error);
    }
  }

  private async loadModule(courseFolder: string, moduleFolder: string): Promise<void> {
    try {
      // Load module.json
      const moduleResponse = await fetch(`/courses/${courseFolder}/modules/${moduleFolder}/module.json`);
      if (moduleResponse.ok) {
        const moduleData: ModuleData = await moduleResponse.json();
        this.modules.set(`${courseFolder}-${moduleFolder}`, moduleData);

        // Load activities for this module
        for (const activityFile of moduleData.activities) {
          await this.loadActivity(courseFolder, moduleFolder, activityFile);
        }
      }
    } catch (error) {
      console.error(`Error loading module ${moduleFolder}:`, error);
    }
  }

  private async loadActivity(courseFolder: string, moduleFolder: string, activityFile: string): Promise<void> {
    try {
      // Load activity.json
      const activityResponse = await fetch(`/courses/${courseFolder}/modules/${moduleFolder}/activities/${activityFile}.json`);
      if (activityResponse.ok) {
        const activityData: ActivityData = await activityResponse.json();
        this.activities.set(`${courseFolder}-${moduleFolder}-${activityFile}`, activityData);
      }
    } catch (error) {
      console.error(`Error loading activity ${activityFile}:`, error);
    }
  }

  getCourse(courseId: number): CourseData | undefined {
    return Array.from(this.courses.values()).find(course => course.id === courseId);
  }

  getModulesByCourse(courseId: number): ModuleData[] {
    return Array.from(this.modules.values()).filter(module => module.courseId === courseId);
  }

  getActivitiesByModule(moduleId: number): ActivityData[] {
    return Array.from(this.activities.values()).filter(activity => activity.moduleId === moduleId);
  }
}

export const fileContentLoader = new FileContentLoader();