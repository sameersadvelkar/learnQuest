import fs from 'fs/promises';
import path from 'path';
import type {
  School, InsertSchool,
  User, InsertUser,
  Course, InsertCourse,
  Module, InsertModule,
  Activity, InsertActivity,
  SchoolCourse, InsertSchoolCourse,
  StudentCourse, InsertStudentCourse,
  UserProgress, InsertUserProgress,
  Achievement, InsertAchievement,
  UserAchievement, InsertUserAchievement,
  UserSettings, InsertUserSettings,
  CourseTranslation, InsertCourseTranslation
} from "@shared/schema";

export interface IStorage {
  // School methods
  getAllSchools(): Promise<School[]>;
  getSchool(id: number): Promise<School | undefined>;
  createSchool(school: InsertSchool): Promise<School>;
  updateSchool(id: number, updates: Partial<School>): Promise<School | undefined>;

  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersBySchool(schoolId: number): Promise<User[]>;
  getStudentsBySchool(schoolId: number): Promise<User[]>;
  bulkCreateUsers(users: InsertUser[]): Promise<User[]>;

  // Course methods
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined>;
  getCoursesByStatus(status: string): Promise<Course[]>;
  approveCourse(courseId: number, approvedBy: number): Promise<Course | undefined>;
  publishCourse(courseId: number): Promise<Course | undefined>;
  importFileBasedCourse(coursePath: string): Promise<Course>;

  // School-Course assignment methods
  getSchoolCourses(schoolId: number): Promise<Course[]>;
  assignCourseToSchool(schoolId: number, courseId: number): Promise<SchoolCourse>;
  unassignCourseFromSchool(schoolId: number, courseId: number): Promise<boolean>;

  // Student-Course assignment methods
  getStudentCourses(studentId: number): Promise<Course[]>;
  assignCourseToStudent(studentId: number, courseId: number, assignedBy: number): Promise<StudentCourse>;
  unassignCourseFromStudent(studentId: number, courseId: number): Promise<boolean>;

  // Module methods
  getModule(id: number): Promise<Module | undefined>;
  getModulesByCourse(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;

  // Activity methods
  getActivitiesByModule(moduleId: number): Promise<Activity[]>;
  getActivitiesByCourse(courseId: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressForCourse(userId: number, courseId: number): Promise<UserProgress[]>;
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

  // Course Translation methods
  getCourseTranslations(courseId: number): Promise<CourseTranslation[]>;
  getCourseTranslation(courseId: number, language: string): Promise<CourseTranslation | undefined>;
  createCourseTranslation(translation: InsertCourseTranslation): Promise<CourseTranslation>;
  updateCourseTranslation(id: number, updates: Partial<CourseTranslation>): Promise<CourseTranslation | undefined>;
}

export class FileBasedStorage implements IStorage {
  private dataDir: string;
  private schools: Map<number, School> = new Map();
  private users: Map<number, User> = new Map();
  private courses: Map<number, Course> = new Map();
  private modules: Map<number, Module> = new Map();
  private activities: Map<number, Activity> = new Map();
  private schoolCourses: Map<number, SchoolCourse> = new Map();
  private studentCourses: Map<number, StudentCourse> = new Map();
  private userProgressRecords: Map<number, UserProgress> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<number, UserAchievement> = new Map();
  private userSettings: Map<number, UserSettings> = new Map();
  private courseTranslations: Map<number, CourseTranslation> = new Map();

  private currentSchoolId = 1;
  private currentUserId = 1;
  private currentCourseId = 1;
  private currentModuleId = 1;
  private currentActivityId = 1;
  private currentSchoolCourseId = 1;
  private currentStudentCourseId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;
  private currentUserAchievementId = 1;
  private currentUserSettingsId = 1;
  private currentCourseTranslationId = 1;

  constructor() {
    this.dataDir = process.cwd() + '/data';
    this.initializeFileBasedStorage();
  }

  private async initializeFileBasedStorage() {
    await this.ensureDataDirectory();
    await this.loadAllData();
    this.initializeData();
  }

  private async ensureDataDirectory() {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  private async loadAllData() {
    try {
      await Promise.all([
        this.loadFromFile('schools', this.schools),
        this.loadFromFile('users', this.users),
        this.loadFromFile('courses', this.courses),
        this.loadFromFile('modules', this.modules),
        this.loadFromFile('activities', this.activities),
        this.loadFromFile('schoolCourses', this.schoolCourses),
        this.loadFromFile('studentCourses', this.studentCourses),
        this.loadFromFile('userProgress', this.userProgressRecords),
        this.loadFromFile('achievements', this.achievements),
        this.loadFromFile('userAchievements', this.userAchievements),
        this.loadFromFile('userSettings', this.userSettings),
        this.loadFromFile('courseTranslations', this.courseTranslations),
        this.loadCounters()
      ]);
    } catch (error) {
      console.log('No existing data files found, starting with fresh data');
    }
  }

  private async loadFromFile<T>(filename: string, map: Map<number, T>) {
    try {
      const filePath = path.join(this.dataDir, `${filename}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      const items: T[] = JSON.parse(data);
      items.forEach((item: any) => map.set(item.id, item));
    } catch (error) {
      // File doesn't exist, which is fine for initial setup
    }
  }

  private async loadCounters() {
    try {
      const filePath = path.join(this.dataDir, 'counters.json');
      const data = await fs.readFile(filePath, 'utf-8');
      const counters = JSON.parse(data);
      
      this.currentSchoolId = counters.currentSchoolId || 1;
      this.currentUserId = counters.currentUserId || 1;
      this.currentCourseId = counters.currentCourseId || 1;
      this.currentModuleId = counters.currentModuleId || 1;
      this.currentActivityId = counters.currentActivityId || 1;
      this.currentSchoolCourseId = counters.currentSchoolCourseId || 1;
      this.currentStudentCourseId = counters.currentStudentCourseId || 1;
      this.currentProgressId = counters.currentProgressId || 1;
      this.currentAchievementId = counters.currentAchievementId || 1;
      this.currentUserAchievementId = counters.currentUserAchievementId || 1;
      this.currentUserSettingsId = counters.currentUserSettingsId || 1;
      this.currentCourseTranslationId = counters.currentCourseTranslationId || 1;
    } catch (error) {
      // File doesn't exist, use defaults
    }
  }

  private async saveToFile<T>(filename: string, map: Map<number, T>) {
    const filePath = path.join(this.dataDir, `${filename}.json`);
    const items = Array.from(map.values());
    await fs.writeFile(filePath, JSON.stringify(items, null, 2));
  }

  private async saveCounters() {
    const counters = {
      currentSchoolId: this.currentSchoolId,
      currentUserId: this.currentUserId,
      currentCourseId: this.currentCourseId,
      currentModuleId: this.currentModuleId,
      currentActivityId: this.currentActivityId,
      currentSchoolCourseId: this.currentSchoolCourseId,
      currentStudentCourseId: this.currentStudentCourseId,
      currentProgressId: this.currentProgressId,
      currentAchievementId: this.currentAchievementId,
      currentUserAchievementId: this.currentUserAchievementId,
      currentUserSettingsId: this.currentUserSettingsId,
      currentCourseTranslationId: this.currentCourseTranslationId
    };
    const filePath = path.join(this.dataDir, 'counters.json');
    await fs.writeFile(filePath, JSON.stringify(counters, null, 2));
  }

  private async persistData() {
    await Promise.all([
      this.saveToFile('schools', this.schools),
      this.saveToFile('users', this.users),
      this.saveToFile('courses', this.courses),
      this.saveToFile('modules', this.modules),
      this.saveToFile('activities', this.activities),
      this.saveToFile('schoolCourses', this.schoolCourses),
      this.saveToFile('studentCourses', this.studentCourses),
      this.saveToFile('userProgress', this.userProgressRecords),
      this.saveToFile('achievements', this.achievements),
      this.saveToFile('userAchievements', this.userAchievements),
      this.saveToFile('userSettings', this.userSettings),
      this.saveToFile('courseTranslations', this.courseTranslations),
      this.saveCounters()
    ]);
  }

  private initializeData() {
    // Create default super admin user
    const superAdmin: User = {
      id: 1,
      email: "admin@system.com",
      username: "admin",
      password: "admin123",
      role: "super_admin",
      schoolId: null,
      firstName: "System",
      lastName: "Administrator",
      createdAt: new Date()
    };
    this.users.set(1, superAdmin);
    this.currentUserId = 2;

    // No demo courses - ready for real course data
    this.currentCourseId = 1;

    // No demo modules - ready for real module data
    this.currentModuleId = 1;

    // No demo activities - ready for real activity data
    this.currentActivityId = 1;

    // Create achievements
    const achievementsList: Achievement[] = [
      {
        id: 1,
        title: "First Steps",
        description: "Complete your first lesson",
        iconType: "trophy",
        badgeColor: "blue",
        criteria: { type: "lesson_completion", count: 1 }
      },
      {
        id: 2,
        title: "Quiz Master",
        description: "Score 100% on a quiz",
        iconType: "medal",
        badgeColor: "gold",
        criteria: { type: "quiz_perfect_score", count: 1 }
      }
    ];

    achievementsList.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
    this.currentAchievementId = 3;
  }

  // School methods
  async getAllSchools(): Promise<School[]> {
    return Array.from(this.schools.values());
  }

  async getSchool(id: number): Promise<School | undefined> {
    return this.schools.get(id);
  }

  async createSchool(insertSchool: InsertSchool): Promise<School> {
    const school: School = {
      id: this.currentSchoolId++,
      ...insertSchool,
      logo: insertSchool.logo || null,
      adminName: insertSchool.adminName || null,
      adminPassword: insertSchool.adminPassword || null,
      address: insertSchool.address || null,
      city: insertSchool.city || null,
      state: insertSchool.state || null,
      pincode: insertSchool.pincode || null,
      studentsCount: insertSchool.studentsCount || 0,
      coursesCount: insertSchool.coursesCount || 0,
      isWhiteLabelEnabled: insertSchool.isWhiteLabelEnabled || false,
      isActive: insertSchool.isActive !== false,
      createdAt: new Date()
    };
    this.schools.set(school.id, school);
    await this.persistData();
    return school;
  }

  async updateSchool(id: number, updates: Partial<School>): Promise<School | undefined> {
    const school = this.schools.get(id);
    if (!school) return undefined;
    
    const updatedSchool = { ...school, ...updates };
    this.schools.set(id, updatedSchool);
    await this.persistData();
    return updatedSchool;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      role: insertUser.role || "student",
      schoolId: insertUser.schoolId || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    await this.persistData();
    return user;
  }

  async getUsersBySchool(schoolId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.schoolId === schoolId);
  }

  async getStudentsBySchool(schoolId: number): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      user => user.schoolId === schoolId && user.role === "student"
    );
  }

  async bulkCreateUsers(users: InsertUser[]): Promise<User[]> {
    const createdUsers: User[] = [];
    for (const insertUser of users) {
      const user = await this.createUser(insertUser);
      createdUsers.push(user);
    }
    return createdUsers;
  }

  // Course methods
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const course: Course = {
      id: this.currentCourseId++,
      title: insertCourse.title,
      description: insertCourse.description,
      totalModules: insertCourse.totalModules,
      totalPages: insertCourse.totalPages,
      estimatedDuration: insertCourse.estimatedDuration,
      difficulty: insertCourse.difficulty || null,
      prerequisites: insertCourse.prerequisites || null,
      learningObjectives: insertCourse.learningObjectives || null,
      image: insertCourse.image || null,
      category: insertCourse.category || null,
      hasCoursePage: insertCourse.hasCoursePage !== undefined ? insertCourse.hasCoursePage : true,
      status: insertCourse.status || "draft",
      sourceType: insertCourse.sourceType || "database",
      sourceIdentifier: insertCourse.sourceIdentifier || null,
      approvedBy: null,
      approvedAt: null,
      publishedAt: null,
      createdAt: new Date(),
      instructorName: insertCourse.instructorName || null,
      defaultLanguage: insertCourse.defaultLanguage || "en",
      supportedLanguages: insertCourse.supportedLanguages || ["en"]
    };
    this.courses.set(course.id, course);
    await this.persistData();
    return course;
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...updates };
    this.courses.set(id, updatedCourse);
    await this.persistData();
    return updatedCourse;
  }

  async getCoursesByStatus(status: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.status === status);
  }

  async approveCourse(courseId: number, approvedBy: number): Promise<Course | undefined> {
    const course = this.courses.get(courseId);
    if (!course) return undefined;
    
    const updatedCourse = { 
      ...course, 
      status: 'approved' as const,
      approvedBy,
      approvedAt: new Date()
    };
    this.courses.set(courseId, updatedCourse);
    return updatedCourse;
  }

  async publishCourse(courseId: number): Promise<Course | undefined> {
    const course = this.courses.get(courseId);
    if (!course || course.status !== 'approved') return undefined;
    
    const updatedCourse = { 
      ...course, 
      status: 'published' as const,
      publishedAt: new Date()
    };
    this.courses.set(courseId, updatedCourse);
    return updatedCourse;
  }

  async importFileBasedCourse(coursePath: string): Promise<Course> {
    // This would load from file system and create a database entry
    // For now, creating a placeholder that represents file-based course
    const course: Course = {
      id: this.currentCourseId++,
      title: `File-Based Course from ${coursePath}`,
      description: 'Imported from file-based content system',
      totalModules: 0,
      totalPages: 0,
      estimatedDuration: 0,
      difficulty: 'Beginner',
      prerequisites: null,
      learningObjectives: null,
      image: null,
      category: null,
      hasCoursePage: true,
      status: 'pending_approval',
      sourceType: 'file_based',
      sourceIdentifier: coursePath,
      approvedBy: null,
      approvedAt: null,
      publishedAt: null,
      createdAt: new Date(),
      instructorName: null,
      defaultLanguage: "en",
      supportedLanguages: ["en"]
    };
    this.courses.set(course.id, course);
    return course;
  }

  // School-Course methods
  async getSchoolCourses(schoolId: number): Promise<Course[]> {
    const schoolCourseIds = Array.from(this.schoolCourses.values())
      .filter(sc => sc.schoolId === schoolId)
      .map(sc => sc.courseId);
    
    return Array.from(this.courses.values())
      .filter(course => schoolCourseIds.includes(course.id));
  }

  async assignCourseToSchool(schoolId: number, courseId: number): Promise<SchoolCourse> {
    const assignment: SchoolCourse = {
      id: this.currentSchoolCourseId++,
      schoolId,
      courseId,
      assignedAt: new Date()
    };
    this.schoolCourses.set(assignment.id, assignment);
    return assignment;
  }

  async unassignCourseFromSchool(schoolId: number, courseId: number): Promise<boolean> {
    const assignment = Array.from(this.schoolCourses.entries())
      .find(([_, sc]) => sc.schoolId === schoolId && sc.courseId === courseId);
    
    if (assignment) {
      this.schoolCourses.delete(assignment[0]);
      return true;
    }
    return false;
  }

  // Student-Course methods
  async getStudentCourses(studentId: number): Promise<Course[]> {
    const studentCourseIds = Array.from(this.studentCourses.values())
      .filter(sc => sc.studentId === studentId)
      .map(sc => sc.courseId);
    
    return Array.from(this.courses.values())
      .filter(course => studentCourseIds.includes(course.id));
  }

  async assignCourseToStudent(studentId: number, courseId: number, assignedBy: number): Promise<StudentCourse> {
    const assignment: StudentCourse = {
      id: this.currentStudentCourseId++,
      studentId,
      courseId,
      assignedBy,
      assignedAt: new Date()
    };
    this.studentCourses.set(assignment.id, assignment);
    return assignment;
  }

  async unassignCourseFromStudent(studentId: number, courseId: number): Promise<boolean> {
    const assignment = Array.from(this.studentCourses.entries())
      .find(([_, sc]) => sc.studentId === studentId && sc.courseId === courseId);
    
    if (assignment) {
      this.studentCourses.delete(assignment[0]);
      return true;
    }
    return false;
  }

  // Module methods
  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }

  async getModulesByCourse(courseId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.courseId === courseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createModule(insertModule: InsertModule): Promise<Module> {
    const module: Module = {
      id: this.currentModuleId++,
      ...insertModule,
      description: insertModule.description || null,
      isLocked: insertModule.isLocked || null
    };
    this.modules.set(module.id, module);
    return module;
  }

  // Activity methods
  async getActivitiesByModule(moduleId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.moduleId === moduleId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async getActivitiesByCourse(courseId: number): Promise<Activity[]> {
    const moduleIds = Array.from(this.modules.values())
      .filter(module => module.courseId === courseId)
      .map(module => module.id);
    
    return Array.from(this.activities.values())
      .filter(activity => moduleIds.includes(activity.moduleId))
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      id: this.currentActivityId++,
      ...insertActivity,
      description: insertActivity.description || null,
      isLocked: insertActivity.isLocked || null,
      content: insertActivity.content || {},
      videoUrl: insertActivity.videoUrl || null,
      duration: insertActivity.duration || null,
      media: insertActivity.media || null
    };
    this.activities.set(activity.id, activity);
    await this.persistData();
    return activity;
  }

  // Progress methods
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgressRecords.values())
      .filter(progress => progress.userId === userId);
  }

  async getUserProgressForCourse(userId: number, courseId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgressRecords.values())
      .filter(progress => progress.userId === userId && progress.courseId === courseId);
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const progress: UserProgress = {
      id: this.currentProgressId++,
      ...insertProgress,
      moduleId: insertProgress.moduleId || null,
      activityId: insertProgress.activityId || null,
      completed: insertProgress.completed || null,
      completedAt: insertProgress.completedAt || null,
      progressPercentage: insertProgress.progressPercentage || null,
      timeSpent: insertProgress.timeSpent || null
    };
    this.userProgressRecords.set(progress.id, progress);
    await this.persistData();
    return progress;
  }

  async updateUserProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgressRecords.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.userProgressRecords.set(id, updatedProgress);
    await this.persistData();
    return updatedProgress;
  }

  // Achievement methods
  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const userAchievement: UserAchievement = {
      id: this.currentUserAchievementId++,
      ...insertUserAchievement,
      earnedAt: new Date()
    };
    this.userAchievements.set(userAchievement.id, userAchievement);
    await this.persistData();
    return userAchievement;
  }

  // Settings methods
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values())
      .find(settings => settings.userId === userId);
  }

  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const settings: UserSettings = {
      id: this.currentUserSettingsId++,
      ...insertSettings,
      audioMuted: insertSettings.audioMuted || null,
      videoQuality: insertSettings.videoQuality || null,
      language: insertSettings.language || null,
      notifications: insertSettings.notifications || null
    };
    this.userSettings.set(settings.id, settings);
    await this.persistData();
    return settings;
  }

  async updateUserSettings(userId: number, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const settings = Array.from(this.userSettings.values())
      .find(s => s.userId === userId);
    
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates };
    this.userSettings.set(settings.id, updatedSettings);
    await this.persistData();
    return updatedSettings;
  }

  // Course Translation methods
  async getCourseTranslations(courseId: number): Promise<CourseTranslation[]> {
    return Array.from(this.courseTranslations.values())
      .filter(translation => translation.courseId === courseId);
  }

  async getCourseTranslation(courseId: number, language: string): Promise<CourseTranslation | undefined> {
    return Array.from(this.courseTranslations.values())
      .find(translation => translation.courseId === courseId && translation.language === language);
  }

  async createCourseTranslation(insertTranslation: InsertCourseTranslation): Promise<CourseTranslation> {
    const translation: CourseTranslation = {
      id: this.currentCourseTranslationId++,
      courseId: insertTranslation.courseId,
      language: insertTranslation.language,
      title: insertTranslation.title || null,
      description: insertTranslation.description || null,
      prerequisites: insertTranslation.prerequisites || null,
      learningObjectives: insertTranslation.learningObjectives || null,
      instructorName: insertTranslation.instructorName || null,
      category: insertTranslation.category || null,
      additionalContent: insertTranslation.additionalContent || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.courseTranslations.set(translation.id, translation);
    await this.persistData();
    return translation;
  }

  async updateCourseTranslation(id: number, updates: Partial<CourseTranslation>): Promise<CourseTranslation | undefined> {
    const translation = this.courseTranslations.get(id);
    if (!translation) return undefined;
    
    const updatedTranslation = { 
      ...translation, 
      ...updates,
      updatedAt: new Date()
    };
    this.courseTranslations.set(id, updatedTranslation);
    await this.persistData();
    return updatedTranslation;
  }
}

export const storage = new FileBasedStorage();