import { 
  users, 
  courses,
  modules,
  activities,
  userProgress,
  achievements,
  userAchievements,
  userSettings,
  type User, 
  type InsertUser,
  type Course,
  type InsertCourse,
  type Module,
  type InsertModule,
  type Activity,
  type InsertActivity,
  type UserProgress,
  type InsertUserProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type UserSettings,
  type InsertUserSettings
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Module methods
  getModulesByCourse(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;

  // Activity methods
  getActivitiesByModule(moduleId: number): Promise<Activity[]>;
  getActivitiesByCourse(courseId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined>;

  // Achievement methods
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;

  // Settings methods
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, updates: Partial<UserSettings>): Promise<UserSettings | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private modules: Map<number, Module>;
  private activities: Map<number, Activity>;
  private userProgressRecords: Map<number, UserProgress>;
  private achievements: Map<number, Achievement>;
  private userAchievements: Map<number, UserAchievement>;
  private userSettings: Map<number, UserSettings>;
  
  private currentUserId: number;
  private currentCourseId: number;
  private currentModuleId: number;
  private currentActivityId: number;
  private currentProgressId: number;
  private currentAchievementId: number;
  private currentUserAchievementId: number;
  private currentUserSettingsId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.modules = new Map();
    this.activities = new Map();
    this.userProgressRecords = new Map();
    this.achievements = new Map();
    this.userAchievements = new Map();
    this.userSettings = new Map();
    
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentModuleId = 1;
    this.currentActivityId = 1;
    this.currentProgressId = 1;
    this.currentAchievementId = 1;
    this.currentUserAchievementId = 1;
    this.currentUserSettingsId = 1;

    this.initializeData();
  }

  private initializeData() {
    // Create sample achievements
    const sampleAchievements: Achievement[] = [
      {
        id: 1,
        title: 'Getting Started',
        description: 'Complete your first activity',
        iconType: 'star',
        badgeColor: 'blue',
        criteria: null
      },
      {
        id: 2,
        title: 'Module Master',
        description: 'Complete your first module',
        iconType: 'trophy',
        badgeColor: 'gold',
        criteria: null
      },
      {
        id: 3,
        title: 'Streak Master',
        description: 'Complete activities 3 days in a row',
        iconType: 'fire',
        badgeColor: 'orange',
        criteria: null
      },
      {
        id: 4,
        title: 'Speed Learner',
        description: 'Complete 10 activities',
        iconType: 'bolt',
        badgeColor: 'purple',
        criteria: null
      }
    ];

    sampleAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
      this.currentAchievementId = Math.max(this.currentAchievementId, achievement.id + 1);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: new Date()
    };
    this.courses.set(id, course);
    return course;
  }

  // Module methods
  async getModulesByCourse(courseId: number): Promise<Module[]> {
    return Array.from(this.modules.values()).filter(
      module => module.courseId === courseId
    );
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const id = this.currentModuleId++;
    const module: Module = {
      ...insertModule,
      id
    };
    this.modules.set(id, module);
    return module;
  }

  // Activity methods
  async getActivitiesByModule(moduleId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      activity => activity.moduleId === moduleId
    );
  }

  async getActivitiesByCourse(courseId: number): Promise<Activity[]> {
    const courseModules = await this.getModulesByCourse(courseId);
    const moduleIds = courseModules.map(module => module.id);
    
    return Array.from(this.activities.values()).filter(
      activity => moduleIds.includes(activity.moduleId)
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const activity: Activity = {
      ...insertActivity,
      id
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgressRecords.values()).filter(
      progress => progress.userId === userId
    );
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const progress: UserProgress = {
      ...insertProgress,
      id,
      completedAt: insertProgress.completed ? new Date() : null
    };
    this.userProgressRecords.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const existingProgress = this.userProgressRecords.get(id);
    if (!existingProgress) {
      return undefined;
    }

    const updatedProgress: UserProgress = {
      ...existingProgress,
      ...updates,
      completedAt: updates.completed ? new Date() : existingProgress.completedAt
    };

    this.userProgressRecords.set(id, updatedProgress);
    return updatedProgress;
  }

  // Achievement methods
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(
      userAchievement => userAchievement.userId === userId
    );
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = {
      ...insertUserAchievement,
      id,
      earnedAt: new Date()
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Settings methods
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      settings => settings.userId === userId
    );
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = this.currentUserSettingsId++;
    const settings: UserSettings = {
      ...insertSettings,
      id
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async updateUserSettings(userId: number, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const existingSettings = Array.from(this.userSettings.values()).find(
      settings => settings.userId === userId
    );

    if (!existingSettings) {
      return undefined;
    }

    const updatedSettings: UserSettings = {
      ...existingSettings,
      ...updates
    };

    this.userSettings.set(existingSettings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
