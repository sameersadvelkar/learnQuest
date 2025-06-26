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
    console.log('loadAllContent called, loaded status:', this.loaded);
    if (this.loaded) {
      console.log('Content already loaded, returning existing data');
      return { courses: this.courses, modules: this.modules, activities: this.activities };
    }

    // Clear existing data to prevent duplicates
    this.courses = [];
    this.modules = [];
    this.activities = [];

    try {
      console.log('Loading courses from directory...');
      // Load courses from the courses directory
      await this.loadCoursesFromDirectory();
      
      this.loaded = true;
      console.log('Content loaded successfully. Courses:', this.courses.length, 'Modules:', this.modules.length, 'Activities:', this.activities.length);
      return { courses: this.courses, modules: this.modules, activities: this.activities };
    } catch (error) {
      console.error('Error loading content:', error);
      return { courses: [], modules: [], activities: [] };
    }
  }

  private async loadCoursesFromDirectory(): Promise<void> {
    try {
      console.log('Starting to load courses from directory...');
      
      // Method 1: Explicit list (reliable for production)
      const availableCourses = [
        'digital-wellness-safety'
        // Add new course folder names here as they become available
      ];
      
      // Method 2: Auto-discovery (future enhancement)
      // Uncomment this section to enable dynamic course discovery
      /*
      const discoveredCourses = await this.discoverCoursesFromDirectory();
      const allCourses = [...new Set([...availableCourses, ...discoveredCourses])];
      console.log('Discovered courses:', discoveredCourses);
      console.log('All courses to load:', allCourses);
      */
      
      // Load each course using the generic loader
      for (const coursePath of availableCourses) {
        try {
          console.log(`Loading course from path: ${coursePath}`);
          await this.loadCourseFromPath(coursePath);
        } catch (courseError) {
          console.error(`Failed to load course ${coursePath}:`, courseError);
          // Continue loading other courses even if one fails
        }
      }
      
      console.log('Finished loading courses. Total courses:', this.courses.length);
    } catch (error) {
      console.error('Error in loadCoursesFromDirectory:', error);
    }
  }

  // Future enhancement: Auto-discover courses from filesystem
  private async discoverCoursesFromDirectory(): Promise<string[]> {
    try {
      // This would use filesystem APIs to scan the courses directory
      // For now, return empty array as dynamic discovery requires server-side support
      console.log('Course auto-discovery not yet implemented');
      return [];
    } catch (error) {
      console.error('Error discovering courses:', error);
      return [];
    }
  }

  // Generic method to load a course with the standard structure
  async loadCourseFromPath(coursePath: string): Promise<void> {
    try {
      // Load main course data
      const courseData = await import(`../../courses/${coursePath}/course.json`);
      console.log('Loading course:', courseData);
      const course: Course = {
        id: courseData.id || courseData.default?.id,
        title: courseData.title || courseData.default?.title,
        description: courseData.description || courseData.default?.description,
        totalModules: courseData.totalModules || courseData.default?.totalModules,
        totalPages: courseData.totalPages || courseData.default?.totalPages,
        estimatedDuration: courseData.estimatedDuration || courseData.default?.estimatedDuration,
        difficulty: courseData.difficulty || courseData.default?.difficulty,
        prerequisites: courseData.prerequisites || courseData.default?.prerequisites || [],
        learningObjectives: courseData.learningObjectives || courseData.default?.learningObjectives || [],
        image: courseData.image || courseData.default?.image,
        category: courseData.category || courseData.default?.category,
        hasCoursePage: (courseData.hasCoursePage !== false) && (courseData.default?.hasCoursePage !== false),
        createdAt: new Date(courseData.createdAt || courseData.default?.createdAt || Date.now()),
        sourceType: 'file_based',
        sourceIdentifier: coursePath,
        status: 'published',
        approvedBy: null,
        approvedAt: null,
        publishedAt: new Date(),
        instructorName: courseData.instructorName || courseData.default?.instructorName || 'CourseWing AI',
        defaultLanguage: courseData.defaultLanguage || courseData.default?.defaultLanguage || 'en',
        supportedLanguages: courseData.supportedLanguages || courseData.default?.supportedLanguages || ['en']
      };
      console.log('Created course object:', course);
      this.courses.push(course);

      // Load modules and activities for each module
      let moduleIdCounter = this.modules.length + 1;
      let activityIdCounter = this.activities.length + 1;
      
      const courseModules = courseData.modules || courseData.default?.modules || [];
      for (const moduleName of courseModules) {
        try {
          // Load module data
          const moduleData = await import(`../../courses/${coursePath}/modules/${moduleName}/module.json`);
          const moduleContent = moduleData.default || moduleData;
          const module: Module = {
            id: moduleIdCounter++,
            courseId: course.id,
            title: moduleContent.title,
            description: moduleContent.description,
            orderIndex: moduleContent.orderIndex,
            totalActivities: moduleContent.totalActivities,
            isLocked: moduleContent.isLocked || false
          };
          this.modules.push(module);

          // Load activities for this module
          const moduleActivities = moduleContent.activities || [];
          for (const activityName of moduleActivities) {
            try {
              const activityData = await import(`../../courses/${coursePath}/modules/${moduleName}/activities/${activityName}.json`);
              const activityContent = activityData.default || activityData;
              const activity: Activity = {
                id: activityIdCounter++,
                moduleId: module.id,
                title: activityContent.title,
                description: activityContent.description,
                type: activityContent.type,
                orderIndex: activityContent.orderIndex,
                content: activityContent.content,
                videoUrl: activityContent.videoUrl || null,
                duration: activityContent.estimatedDuration || null,
                isLocked: activityContent.isLocked || false
              };
              this.activities.push(activity);
              console.log(`Loaded activity: ${activity.title}`);
            } catch (activityError) {
              console.warn(`Could not load activity ${activityName} for module ${moduleName}:`, activityError);
            }
          }
        } catch (moduleError) {
          console.warn(`Could not load module ${moduleName}:`, moduleError);
        }
      }
    } catch (error) {
      console.error(`Error loading course from ${coursePath}:`, error);
    }
  }

  // Load Digital Wellness & Safety course with static imports
  private async loadDigitalWellnessCourse(): Promise<void> {
    try {
      // Static course data
      const course: Course = {
        id: 1,
        title: "Digital Wellness & Safety",
        description: "A narrative-based course designed to help students understand digital safety, privacy, misinformation, and healthy technology habits through the story of a student named Alex.",
        totalModules: 5,
        totalPages: 5,
        estimatedDuration: 60,
        difficulty: "Beginner",
        prerequisites: [],
        learningObjectives: [
          "How to manage your digital identity",
          "Recognize and respond to cyberbullying",
          "Detect misinformation and scams",
          "Set boundaries for healthy online habits",
          "Practice responsible digital citizenship"
        ],
        category: "Digital Literacy",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        hasCoursePage: true,
        status: "published",
        sourceType: "file_based",
        sourceIdentifier: "digital-wellness-safety",
        approvedBy: null,
        approvedAt: null,
        publishedAt: new Date("2024-12-16T18:00:00Z"),
        createdAt: new Date("2024-12-16T18:00:00Z"),
        instructorName: "CourseWing AI",
        defaultLanguage: "en",
        supportedLanguages: ["en"]
      };
      this.courses.push(course);

      // Static module data
      const modules: Module[] = [
        {
          id: 1,
          courseId: 1,
          title: "Creating a Responsible Online Persona",
          description: "Learn how your digital footprint and social media behavior shape your online identity.",
          orderIndex: 0,
          totalActivities: 1,
          isLocked: false
        },
        {
          id: 2,
          courseId: 1,
          title: "Privacy Protection and Cyberbullying",
          description: "Dive into online privacy settings and how to act against cyberbullying.",
          orderIndex: 1,
          totalActivities: 1,
          isLocked: false
        },
        {
          id: 3,
          courseId: 1,
          title: "Misinformation and Scams",
          description: "Build critical thinking skills to identify fake news and phishing scams.",
          orderIndex: 2,
          totalActivities: 1,
          isLocked: false
        },
        {
          id: 4,
          courseId: 1,
          title: "Healthy Online Relationships & Balance",
          description: "Understand how too much screen time affects your well-being and how to set boundaries.",
          orderIndex: 3,
          totalActivities: 1,
          isLocked: false
        },
        {
          id: 5,
          courseId: 1,
          title: "Digital Responsibility & Final Challenge",
          description: "Recap all lessons and reinforce key ideas through interactive tasks.",
          orderIndex: 4,
          totalActivities: 1,
          isLocked: false
        }
      ];
      this.modules.push(...modules);

      // Static activity data
      const activities: Activity[] = [
        {
          id: 1,
          moduleId: 1,
          title: "Understanding Digital Footprints",
          description: "Explore how online posts affect your reputation.",
          type: "interactive",
          orderIndex: 0,
          content: {
            story: "Meet Alex, a curious teen who loves sharing moments online. One day, Alex realizes that a silly post from two years ago is still visible to everyone. This makes Alex wonder: 'What kind of digital footprint am I creating?'",
            components: [
              {
                type: "flipcard",
                title: "Do's and Don'ts of Posting Online",
                data: {
                  cards: [
                    {
                      front: "Think Before You Post",
                      back: "DO: Ask yourself - Would I be comfortable if my teacher, family, or future employer saw this?"
                    },
                    {
                      front: "Share Personal Information",
                      back: "DON'T: Avoid posting your full name, address, phone number, or school details publicly."
                    },
                    {
                      front: "Use Privacy Settings",
                      back: "DO: Regularly check and update your privacy settings on all social media platforms."
                    },
                    {
                      front: "Post When Emotional",
                      back: "DON'T: Wait until you're calm before posting something when you're angry or upset."
                    }
                  ]
                }
              },
              {
                type: "multiplechoice",
                title: "Digital Safety Quiz",
                data: {
                  question: "Why is it important to manage your online persona?",
                  options: [
                    "Because it determines who can see your posts",
                    "Because it affects how others perceive you in the long term",
                    "Because it can help secure your personal information",
                    "All of the above"
                  ],
                  correctAnswer: 3,
                  explanation: "Managing your online persona affects your privacy, security, and reputation."
                }
              }
            ]
          },
          videoUrl: null,
          duration: 15,
          isLocked: false
        },
        {
          id: 2,
          moduleId: 2,
          title: "Protecting Your Privacy",
          description: "Learn why and how to manage privacy settings.",
          type: "interactive",
          orderIndex: 0,
          content: {
            story: "Alex receives a friend request from someone they don't know. While checking their profile settings, Alex discovers that their posts are visible to everyone! Alex also witnesses a classmate being mean to another student in the comments. What should Alex do in both situations?",
            components: [
              {
                type: "accordion",
                title: "Tips for Adjusting Privacy Settings",
                data: {
                  sections: [
                    {
                      title: "Profile Visibility",
                      content: "Set your profile to private so only friends can see your posts, photos, and personal information. Review who can find you using your email or phone number."
                    },
                    {
                      title: "Post Sharing Controls",
                      content: "Before posting, choose who can see it: Public, Friends, or Custom groups. Remember that even 'friends only' posts can be screenshot and shared."
                    },
                    {
                      title: "Contact Information",
                      content: "Hide your phone number and email from your public profile. Be selective about who can contact you directly through the platform."
                    }
                  ]
                }
              },
              {
                type: "multiplechoice",
                title: "Cyberbullying Response Quiz",
                data: {
                  question: "Which of the following is a recommended action when witnessing cyberbullying?",
                  options: [
                    "Ignore the situation",
                    "Join in",
                    "Report the incident and support the victim",
                    "Share the post with friends"
                  ],
                  correctAnswer: 2,
                  explanation: "Supporting victims and reporting abuse creates a safer online space."
                }
              }
            ]
          },
          videoUrl: null,
          duration: 15,
          isLocked: false
        },
        {
          id: 3,
          moduleId: 3,
          title: "Identifying Misinformation",
          description: "Learn how to verify information using trusted sources.",
          type: "interactive",
          orderIndex: 0,
          content: {
            story: "Alex sees a shocking news headline shared by a friend: 'Local School Bans All Technology Forever!' Alex is surprised and worried, but then remembers to check if this is real news. Alex also receives a suspicious email claiming to be from a popular gaming platform asking for account details.",
            components: [
              {
                type: "slider",
                title: "Examples of Real vs Fake Headlines",
                data: {
                  instruction: "Slide through these headlines and learn to spot the differences between real and fake news.",
                  slides: [
                    {
                      title: "REAL News Example",
                      content: "Source: Local News Channel 7 | Date: Today | Author: Sarah Martinez, Education Reporter",
                      headline: "District Implements New Technology Guidelines for Student Safety"
                    },
                    {
                      title: "FAKE News Red Flags",
                      content: "Source: Unknown blog | Date: Unclear | Author: Anonymous",
                      headline: "SHOCKING: Schools BANNED Technology FOREVER! Parents FURIOUS!"
                    }
                  ]
                }
              },
              {
                type: "multiplechoice",
                title: "Misinformation Detection Quiz",
                data: {
                  question: "Which strategy is most effective for identifying misinformation online?",
                  options: [
                    "Sharing the post immediately with friends",
                    "Checking the information against multiple credible sources",
                    "Accepting it at face value",
                    "Hiding the post without verification"
                  ],
                  correctAnswer: 1,
                  explanation: "Verifying with credible sources is key to identifying misinformation."
                }
              }
            ]
          },
          videoUrl: null,
          duration: 15,
          isLocked: false
        },
        {
          id: 4,
          moduleId: 4,
          title: "Digital Balance & Wellness",
          description: "Practice digital detox and set screen time goals.",
          type: "interactive",
          orderIndex: 0,
          content: {
            story: "Alex notices feeling tired and stressed after spending hours scrolling through social media. Friends seem happier online than in person, and Alex wonders if social media is affecting mood and sleep. Alex decides to track screen time and try some digital wellness strategies.",
            components: [
              {
                type: "tabs",
                title: "Daily/Weekly Digital Wellness Plan",
                data: {
                  tabs: [
                    {
                      title: "Daily Plan",
                      content: "Morning: Check messages for 10 minutes max. School hours: Phone in airplane mode during classes. Evening: 1 hour social media limit. Before bed: No screens 1 hour before sleep."
                    },
                    {
                      title: "Weekly Plan", 
                      content: "Tech-free Sunday morning. One evening per week without devices. Weekend outdoor activity with friends. Weekly review of screen time statistics and goals."
                    },
                    {
                      title: "Healthy Alternatives",
                      content: "Instead of endless scrolling: Read a book, call a friend, exercise, practice a hobby, help family with tasks, listen to music, or journal."
                    }
                  ]
                }
              },
              {
                type: "multiplechoice",
                title: "Digital Wellness Quiz",
                data: {
                  question: "What is one benefit of having designated 'offline' periods?",
                  options: [
                    "It reduces distractions and improves mood",
                    "It increases the number of notifications",
                    "It isolates you from your friends",
                    "It leads to unlimited screen time"
                  ],
                  correctAnswer: 0,
                  explanation: "Offline time supports mental wellness and reduces screen fatigue."
                }
              }
            ]
          },
          videoUrl: null,
          duration: 15,
          isLocked: false
        },
        {
          id: 5,
          moduleId: 5,
          title: "Review & Final Quiz",
          description: "Participate in a role-play challenge and complete the final interactive quiz.",
          type: "assessment",
          orderIndex: 0,
          content: {
            story: "Alex has learned so much about digital wellness and safety! Now it's time to put all these skills together. Alex's friend Maya needs help with some digital challenges. Can you help Alex give the right advice?",
            components: [
              {
                type: "dragdrop",
                title: "Match Digital Issues to Solutions",
                data: {
                  instruction: "Help Alex match each digital problem with the best solution. Drag the solutions to the correct problems.",
                  items: [
                    "Use privacy settings and report the behavior",
                    "Cross-check with multiple credible sources",
                    "Set specific times for social media use",
                    "Think before posting and consider consequences",
                    "Get permission before sharing photos of others"
                  ],
                  categories: [
                    {
                      name: "Maya is being cyberbullied",
                      items: ["Use privacy settings and report the behavior"]
                    },
                    {
                      name: "Maya saw shocking news online",
                      items: ["Cross-check with multiple credible sources"]
                    },
                    {
                      name: "Maya feels addicted to social media",
                      items: ["Set specific times for social media use"]
                    }
                  ]
                }
              },
              {
                type: "multiplechoice",
                title: "Final Challenge Quiz",
                data: {
                  question: "Which digital strategies will you adopt today?",
                  options: [
                    "Adjusting privacy settings on all my accounts",
                    "Fact-checking suspicious news before sharing",
                    "Setting specific times for social media use",
                    "All of the above"
                  ],
                  correctAnswer: 3,
                  explanation: "Adopting all these strategies creates a comprehensive approach to digital wellness and safety."
                }
              }
            ]
          },
          videoUrl: null,
          duration: 20,
          isLocked: false
        }
      ];
      this.activities.push(...activities);

      console.log('Digital Wellness course loaded successfully');
    } catch (error) {
      console.error('Error loading Digital Wellness course:', error);
    }
  }

  // Reset loaded state to force reload
  reset(): void {
    this.loaded = false;
    this.courses = [];
    this.modules = [];
    this.activities = [];
  }
}

export const contentLoader = ContentLoader.getInstance();