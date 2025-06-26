import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCourse } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';

import { useProgressTracking } from '@/hooks/useProgress';
import { useState as useReactState } from 'react';

import { AnimatedStats, ProgressRing } from '@/components/AnimatedStats';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Play, 
  CheckCircle,
  Star,
  TrendingUp,
  Users,
  LogOut,
  User,
  Globe,
  ChevronDown,
  Calendar,
  Target,
  Award,
  Flame,
  Zap,
  Brain,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const { state: courseState, dispatch } = useCourse();
  const { state: authState, logout } = useAuth();
  const { progressState, getCourseProgress } = useProgressTracking();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load courses from API
    const loadContent = async () => {
      setIsLoading(true);
      try {
        console.log('Home: Starting to load content from API...');
        
        // Load courses from API
        const coursesResponse = await fetch('/api/courses');
        if (!coursesResponse.ok) throw new Error('Failed to fetch courses');
        const courses = await coursesResponse.json();
        
        console.log('Home: Content loaded - Courses:', courses.length);
        console.log('Home: Courses data:', courses);
        
        // Store all courses in context
        dispatch({ type: 'SET_COURSES', payload: courses });
        if (courses.length > 0) {
          dispatch({ type: 'SET_COURSE', payload: courses[0] });
          console.log('Home: Set current course to:', courses[0].title);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContent();
  }, [dispatch]);

  const courseProgress = getCourseProgress();
  const completedActivities = progressState.completedActivities.size;

  // Function to get course-specific progress from localStorage
  const getCourseSpecificProgress = (courseId: number, totalActivities: number) => {
    try {
      const progressKey = `courseProgress_${courseId}`;
      const savedProgress = localStorage.getItem(progressKey);
      
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        
        // Get completed activities count
        let completedActivitiesCount = 0;
        if (parsed.completedActivities) {
          // Handle array format (how it's saved to localStorage)
          completedActivitiesCount = Array.isArray(parsed.completedActivities) 
            ? parsed.completedActivities.length 
            : 0;
        }
        
        const progressPercent = totalActivities > 0 ? Math.round((completedActivitiesCount / totalActivities) * 100) : 0;
        
        return {
          completedCount: completedActivitiesCount,
          progressPercent: Math.min(100, progressPercent) // Cap at 100%
        };
      }
    } catch (error) {
      console.error(`Error loading progress for course ${courseId}:`, error);
    }
    return { completedCount: 0, progressPercent: 0 };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header - Responsive */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">CourseWind</h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Professional Learning Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-emerald-50 px-2 sm:px-4 py-1 sm:py-2 rounded-xl border border-emerald-200">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
              <span className="text-xs sm:text-sm font-semibold text-emerald-700">
                {progressState.totalPoints} pts
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 h-8 sm:h-10 px-2 sm:px-3 rounded-xl hover:bg-gray-50">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium shadow-sm">
                    {authState.user?.username?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">{authState.user?.username || 'Student'}</span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-semibold text-gray-900">{authState.user?.username || 'Student'}</p>
                    <p className="text-xs text-gray-500">{authState.user?.email || 'student@coursewind.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg">
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">
                  <Globe className="w-4 h-4 mr-3 text-gray-500" />
                  Language: English
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 rounded-lg">
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Enhanced Welcome Section - Responsive */}
        <div className="mb-6 sm:mb-8 relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  Welcome back to your learning journey!
                </h2>
                <p className="text-emerald-100 text-sm sm:text-base md:text-lg">
                  Continue where you left off and master new skills with our interactive courses.
                </p>
              </div>
              <div className="hidden md:block flex-shrink-0">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-xs sm:text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Today: 45 min studied</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Goal: 60 min daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Rank: Advanced Learner</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full -ml-8 sm:-ml-12 -mb-8 sm:-mb-12"></div>
        </div>

        {/* Professional Stats Cards - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">

          <Card className="border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">{completedActivities}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Completed</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Activities completed</span>
                <span className="sm:hidden">Activities</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">{progressState.totalPoints}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Points</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2 text-gray-600 text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Experience earned</span>
                <span className="sm:hidden">Experience</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">{progressState.streak}</div>
                  <div className="text-gray-500 text-xs sm:text-sm font-medium">Day Streak</div>
                </div>
              </div>
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      i < Math.min(progressState.streak, 7)
                        ? 'bg-emerald-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Courses - Responsive */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card className="border border-gray-200 shadow-lg bg-white">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-emerald-100 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">My Courses</span>
                      <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Continue your learning journey</p>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {/* Course Grid - Responsive */}
                <div className="grid gap-6 md:grid-cols-2">
                  {courseState.courses?.map((course) => {
                    const courseModules = courseState.modules.filter(m => m.courseId === course.id);
                    const courseActivities = courseState.activities.filter(a => 
                      courseModules.some(m => m.id === a.moduleId)
                    );
                    // Use actual course data from backend
                    const courseTotalActivities = course.totalPages || courseActivities.length || 1;
                    
                    console.log(`Course ${course.id} (${course.title}):`, {
                      courseModules: courseModules.length,
                      courseActivities: courseActivities.length,
                      courseTotalPages: course.totalPages,
                      finalTotal: courseTotalActivities
                    });
                    
                    // Get course-specific progress from localStorage
                    const courseSpecificProgress = getCourseSpecificProgress(course.id, courseTotalActivities);
                    const courseCompletedActivities = courseSpecificProgress.completedCount;
                    const courseProgressPercent = courseSpecificProgress.progressPercent;

                    return (
                      <div key={course.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="relative h-48">
                          <img 
                            src={course.image || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="text-xs opacity-75 mb-1">{course.category?.toUpperCase() || 'COURSE'}</div>
                            <h3 className="text-xl font-bold line-clamp-2">{course.title}</h3>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span className="text-sm font-medium text-gray-700">{courseCompletedActivities} of {courseTotalActivities} lessons</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-700">{Math.max(0, Math.ceil((courseTotalActivities - courseCompletedActivities) * 10))}min</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {course.description || "Continue your learning journey with this course."}
                          </p>
                          
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm font-bold text-emerald-600">{courseProgressPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${courseProgressPercent}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <Link href={`/course/${course.id}`}>
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl">
                              {courseProgressPercent > 0 ? 'Continue →' : 'Start Course →'}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  
                  {(!courseState.courses || courseState.courses.length === 0) && (
                    <div className="col-span-2 text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No courses available</p>
                      <p className="text-sm text-gray-500">Check back later for new courses</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressState.completedActivities.size === 0 ? (
                    <div className="text-center py-6">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No activities completed yet</p>
                      <p className="text-sm text-muted-foreground">Start your first lesson to see your progress here</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Completed "What is React?"</p>
                          <p className="text-xs text-muted-foreground">Module 1 • 2 hours ago</p>
                        </div>
                        <Badge variant="secondary">+100 pts</Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg">
                        <Trophy className="w-5 h-5 text-accent" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Achievement Unlocked: Getting Started</p>
                          <p className="text-xs text-muted-foreground">First activity completed</p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">+250 pts</Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Achievements */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">Achievements</span>
                  </div>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {progressState.earnedAchievements.length > 0 ? progressState.earnedAchievements.length : '0'}/12
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressState.earnedAchievements.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Trophy className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Target className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <p className="font-medium text-sm mb-1">Start Your Journey!</p>
                      <p className="text-xs text-muted-foreground">Complete activities to unlock achievements</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className="relative group">
                          {i < progressState.earnedAchievements.length ? (
                            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 cursor-pointer">
                              <Award className="w-7 h-7 text-white" />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                              <Trophy className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Learning Streak */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold">Learning Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{progressState.streak}</div>
                        <div className="text-xs text-red-100">days</div>
                      </div>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Flame className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-sm">
                      {progressState.streak === 0 ? 'Start your streak!' : 
                       progressState.streak === 1 ? 'Great start!' :
                       progressState.streak < 7 ? 'Building momentum!' :
                       progressState.streak < 30 ? 'Excellent progress!' :
                       'Streak master!'}
                    </p>
                    
                    <div className="flex justify-center space-x-1">
                      {Array.from({ length: 7 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < Math.min(progressState.streak, 7)
                              ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-sm'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {progressState.streak === 0 ? 'Complete a lesson to start' :
                       `Keep going! ${7 - (progressState.streak % 7)} more days to next milestone`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold">Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-blue-200 hover:bg-blue-50" size="sm">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Study Schedule</span>
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50" size="sm">
                  <Brain className="w-4 h-4 mr-2 text-purple-600" />
                  <span>Practice Mode</span>
                </Button>
                <Button variant="outline" className="w-full justify-start border-green-200 hover:bg-green-50" size="sm">
                  <Target className="w-4 h-4 mr-2 text-green-600" />
                  <span>Set Goals</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

    </div>
  );
}
