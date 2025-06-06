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
  UserSettings, InsertUserSettings
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

  // School-Course assignment methods
  getSchoolCourses(schoolId: number): Promise<Course[]>;
  assignCourseToSchool(schoolId: number, courseId: number): Promise<SchoolCourse>;
  unassignCourseFromSchool(schoolId: number, courseId: number): Promise<boolean>;

  // Student-Course assignment methods
  getStudentCourses(studentId: number): Promise<Course[]>;
  assignCourseToStudent(studentId: number, courseId: number, assignedBy: number): Promise<StudentCourse>;
  unassignCourseFromStudent(studentId: number, courseId: number): Promise<boolean>;

  // Module methods
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
}

export class MemStorage implements IStorage {
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

  constructor() {
    this.initializeData();
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

    // Create operational courses
    const courses: Course[] = [
      {
        id: 1,
        title: "Web Development Fundamentals",
        description: "Master HTML, CSS, and JavaScript to build modern websites",
        totalModules: 3,
        totalPages: 15,
        estimatedDuration: 40,
        difficulty: "Beginner",
        prerequisites: ["Basic computer skills"],
        learningObjectives: [
          "Build responsive websites with HTML and CSS",
          "Add interactivity with JavaScript",
          "Deploy websites to production"
        ],
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Frontend",
        hasCoursePage: true,
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Python Programming",
        description: "Learn Python programming from basics to advanced concepts",
        totalModules: 4,
        totalPages: 20,
        estimatedDuration: 50,
        difficulty: "Beginner",
        prerequisites: ["Basic programming concepts"],
        learningObjectives: [
          "Write Python programs",
          "Work with data structures",
          "Build simple applications"
        ],
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        category: "Backend",
        hasCoursePage: true,
        createdAt: new Date()
      }
    ];

    courses.forEach(course => {
      this.courses.set(course.id, course);
    });
    this.currentCourseId = 3;

    // Create modules
    const modules: Module[] = [
      {
        id: 1,
        courseId: 1,
        title: "HTML Fundamentals",
        description: "Learn HTML structure and elements",
        orderIndex: 1,
        totalActivities: 3,
        isLocked: false
      },
      {
        id: 2,
        courseId: 1,
        title: "CSS Styling",
        description: "Master CSS for beautiful websites",
        orderIndex: 2,
        totalActivities: 3,
        isLocked: false
      },
      {
        id: 3,
        courseId: 1,
        title: "JavaScript Basics",
        description: "Add interactivity with JavaScript",
        orderIndex: 3,
        totalActivities: 3,
        isLocked: false
      },
      {
        id: 4,
        courseId: 2,
        title: "Python Basics",
        description: "Introduction to Python programming",
        orderIndex: 1,
        totalActivities: 3,
        isLocked: false
      }
    ];

    modules.forEach(module => {
      this.modules.set(module.id, module);
    });
    this.currentModuleId = 5;

    // Create activities
    const activities: Activity[] = [
      {
        id: 1,
        moduleId: 1,
        type: "lesson",
        title: "What is HTML?",
        description: "Introduction to HTML",
        orderIndex: 1,
        isLocked: false,
        content: {
          type: "lesson",
          content: "HTML is the standard markup language for creating web pages."
        },
        videoUrl: null,
        duration: 15
      },
      {
        id: 2,
        moduleId: 1,
        type: "quiz",
        title: "HTML Quiz",
        description: "Test your HTML knowledge",
        orderIndex: 2,
        isLocked: false,
        content: {
          type: "quiz",
          questions: [
            {
              id: "q1",
              type: "multiple-choice",
              question: "What does HTML stand for?",
              options: ["HyperText Markup Language", "High Tech Modern Language"],
              correct: 0
            }
          ]
        },
        videoUrl: null,
        duration: 10
      }
    ];

    activities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });
    this.currentActivityId = 3;

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
    return school;
  }

  async updateSchool(id: number, updates: Partial<School>): Promise<School | undefined> {
    const school = this.schools.get(id);
    if (!school) return undefined;
    
    const updatedSchool = { ...school, ...updates };
    this.schools.set(id, updatedSchool);
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
      createdAt: new Date()
    };
    this.courses.set(course.id, course);
    return course;
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (!course) return undefined;
    
    const updatedCourse = { ...course, ...updates };
    this.courses.set(id, updatedCourse);
    return updatedCourse;
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
      duration: insertActivity.duration || null
    };
    this.activities.set(activity.id, activity);
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
    return progress;
  }

  async updateUserProgress(id: number, updates: Partial<UserProgress>): Promise<UserProgress | undefined> {
    const progress = this.userProgressRecords.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.userProgressRecords.set(id, updatedProgress);
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
    return settings;
  }

  async updateUserSettings(userId: number, updates: Partial<UserSettings>): Promise<UserSettings | undefined> {
    const settings = Array.from(this.userSettings.values())
      .find(s => s.userId === userId);
    
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...updates };
    this.userSettings.set(settings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();