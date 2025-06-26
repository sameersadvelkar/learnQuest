import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { CourseIntroSection } from '@/components/CourseIntroSection';
import { ModuleContent } from '@/components/ModuleContent';
import { SimpleAudioPlayer } from '@/components/SimpleAudioPlayer';

import { useCourse } from '@/contexts/CourseContext';
import { getAudioFile } from '@/utils/audioUtils';
import { CourseImage } from '@/components/JSONImageRenderer';
import { useSettings } from '@/contexts/SettingsContext';
import { useProgressTracking } from '@/hooks/useProgress';
import LanguageSelector from '@/components/LanguageSelector';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';

import { Book, Home, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Course() {
  const { courseId } = useParams();
  const [location, setLocation] = useLocation();
  const { state: courseState, dispatch } = useCourse();
  const { state: settings, dispatch: settingsDispatch } = useSettings();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { isActivityCompleted, setCourseId } = useProgressTracking();
  const [showCourseIntro, setShowCourseIntro] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  console.log('Course component render - courseId:', courseId, 'state:', {
    hasCurrentCourse: !!courseState.currentCourse,
    modulesCount: courseState.modules.length,
    loading: courseState.loading
  });

  const [localLoading, setLocalLoading] = useState(false);
  const [localModules, setLocalModules] = useState<any[]>([]);
  const [localActivities, setLocalActivities] = useState<any[]>([]);

  // Initialize course-specific progress tracking
  useEffect(() => {
    if (courseId) {
      setCourseId(parseInt(courseId));
    }
  }, [courseId, setCourseId]);

  useEffect(() => {
    if (courseId) {
      setLocalLoading(true);
      
      const loadCourseData = async () => {
        try {
          const [courseRes, modulesRes, activitiesRes] = await Promise.all([
            fetch(`/api/courses/${courseId}?lang=${currentLanguage}`),
            fetch(`/api/courses/${courseId}/modules?lang=${currentLanguage}`),
            fetch(`/api/courses/${courseId}/activities?lang=${currentLanguage}`)
          ]);

          const course = await courseRes.json();
          const modules = await modulesRes.json();
          const activities = await activitiesRes.json();

          // Set local state first
          setLocalModules(modules);
          setLocalActivities(activities);

          // Then update context
          dispatch({ type: 'SET_COURSE', payload: course });
          dispatch({ type: 'SET_MODULES', payload: modules });
          dispatch({ type: 'SET_ACTIVITIES', payload: activities });

          if (modules.length > 0) {
            dispatch({ type: 'SET_CURRENT_MODULE', payload: modules[0] });
            const moduleActivities = activities.filter((activity: any) => activity.moduleId === modules[0].id);
            if (moduleActivities.length > 0) {
              dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: moduleActivities[0] });
            }
          }

          setLocalLoading(false);
        } catch (error) {
          console.error('Failed to load course:', error);
          setLocalLoading(false);
        }
      };

      loadCourseData();
    }
  }, [courseId, currentLanguage]);

  const handleGoHome = () => {
    setLocation('/');
  };

  const handlePreviousActivity = async () => {
    const { currentModule, currentActivity, activities, modules } = courseState;
    if (!currentModule || !currentActivity) return;

    // Start transition
    setIsTransitioning(true);

    // Wait for transition to start
    await new Promise(resolve => setTimeout(resolve, 150));

    const moduleActivities = activities.filter(activity => activity.moduleId === currentModule.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    const currentIndex = moduleActivities.findIndex(activity => activity.id === currentActivity.id);
    
    if (currentIndex > 0) {
      // Previous activity in same module
      const previousActivity = moduleActivities[currentIndex - 1];
      dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: previousActivity });
    } else {
      // Go to previous module's last activity
      const sortedModules = modules.sort((a, b) => a.orderIndex - b.orderIndex);
      const currentModuleIndex = sortedModules.findIndex(module => module.id === currentModule.id);
      
      if (currentModuleIndex > 0) {
        const previousModule = sortedModules[currentModuleIndex - 1];
        const previousModuleActivities = activities.filter(activity => activity.moduleId === previousModule.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        
        if (previousModuleActivities.length > 0) {
          const lastActivity = previousModuleActivities[previousModuleActivities.length - 1];
          dispatch({ type: 'SET_CURRENT_MODULE', payload: previousModule });
          dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: lastActivity });
        }
      }
    }

    // End transition and scroll to top after content loads
    setTimeout(() => {
      setIsTransitioning(false);
      // Small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 300);
  };

  const handleNextActivity = async () => {
    const { currentModule, currentActivity, activities, modules } = courseState;
    if (!currentModule || !currentActivity) return;

    // Start transition
    setIsTransitioning(true);

    // Wait for transition to start
    await new Promise(resolve => setTimeout(resolve, 150));

    const moduleActivities = activities.filter(activity => activity.moduleId === currentModule.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    const currentIndex = moduleActivities.findIndex(activity => activity.id === currentActivity.id);
    
    if (currentIndex < moduleActivities.length - 1) {
      // Next activity in same module
      const nextActivity = moduleActivities[currentIndex + 1];
      dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: nextActivity });
    } else {
      // Go to next module's first activity
      const sortedModules = modules.sort((a, b) => a.orderIndex - b.orderIndex);
      const currentModuleIndex = sortedModules.findIndex(module => module.id === currentModule.id);
      
      if (currentModuleIndex < sortedModules.length - 1) {
        const nextModule = sortedModules[currentModuleIndex + 1];
        const nextModuleActivities = activities.filter(activity => activity.moduleId === nextModule.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        
        if (nextModuleActivities.length > 0) {
          const firstActivity = nextModuleActivities[0];
          dispatch({ type: 'SET_CURRENT_MODULE', payload: nextModule });
          dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: firstActivity });
        }
      } else {
        // This is the last activity of the last module - course completed!
        const courseId = courseState.currentCourse?.id;
        if (courseId) {
          setLocation(`/course/${courseId}/complete`);
          return;
        }
      }
    }

    // End transition and scroll to top after content loads
    setTimeout(() => {
      setIsTransitioning(false);
      // Small delay to ensure content is rendered before scrolling
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    }, 300);
  };



  const handleStartCourse = () => {
    setShowCourseIntro(false);
    // Ensure we have module and activity set when starting
    if (courseState.modules.length > 0 && !courseState.currentModule) {
      const firstModule = courseState.modules[0];
      dispatch({ type: 'SET_CURRENT_MODULE', payload: firstModule });
      
      const moduleActivities = courseState.activities.filter(activity => activity.moduleId === firstModule.id);
      if (moduleActivities.length > 0) {
        dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: moduleActivities[0] });
      }
    }
  };

  const toggleSidebar = () => {
    console.log('Toggle sidebar clicked, current state:', settings.sidebarOpen);
    settingsDispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  // Show course introduction if flag is set and we have course data
  if (showCourseIntro && courseState.currentCourse && (courseState.modules.length > 0 || localModules.length > 0)) {
    // Use local modules if available, otherwise use context modules
    const modules = localModules.length > 0 ? localModules : courseState.modules;
    const activities = localActivities.length > 0 ? localActivities : courseState.activities;
    
    // Calculate module activities for intro display
    const modulesWithActivities = modules.map(module => ({
      ...module,
      totalActivities: activities.filter(activity => activity.moduleId === module.id).length
    }));

    const introAudioFile = getAudioFile(courseId!, 'intro');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        {/* Course Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 sticky top-0 z-50 shadow-lg shadow-blue-100/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Book className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {courseState.currentCourse?.title}
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Interactive Learning Experience</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/30">
                <LanguageSelector />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">{t('buttons.dashboard')}</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="relative">
          <CourseIntroSection
            course={courseState.currentCourse}
            modules={modulesWithActivities}
            onStartCourse={handleStartCourse}
          />
        </div>
      </div>
    );
  }

  // Show loading if we don't have modules yet
  if (localLoading) {
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course content...</p>
          {/* Debug info */}
          <div className="mt-4 text-xs text-gray-400">
            Loading: {courseState.loading.toString()}, Course: {!!courseState.currentCourse ? 'loaded' : 'missing'}, Modules: {courseState.modules.length}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (courseState.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{courseState.error}</p>
          <Button onClick={() => setLocation('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-blue-100/20 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <Book className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {courseState.currentCourse?.title}
                </h1>
                <p className="text-xs text-gray-500 font-medium">Interactive Learning Experience</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 border border-white/30">
              <LanguageSelector />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 text-gray-600 hover:text-blue-600 rounded-xl transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">{t('buttons.dashboard')}</span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 text-gray-600 hover:text-emerald-600 rounded-xl transition-all duration-300"
            >
              <Book className="w-4 h-4" />
              <span className="font-medium">{t('navigation.menu')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar 
          isOpen={settings.sidebarOpen} 
          onClose={() => settingsDispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
        
        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {courseState.currentModule && courseState.currentActivity ? (
              <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 relative">
                <div className={`max-w-4xl mx-auto px-6 py-8 transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  
                  {/* Audio Player Section - Above Media */}
                  <div className="mb-6 flex justify-end">
                    <div className="p-2">
                      <SimpleAudioPlayer 
                        courseId={courseId!} 
                        pageType="activity" 
                        activityId={courseState.currentActivity.id}
                      />
                    </div>
                  </div>

                  {/* Full-Bleed Activity Card */}
                  <Card className="mb-8 bg-white shadow-sm overflow-hidden">
                    {/* Full-bleed Media Area */}
                    <div className="w-full h-80 bg-gray-300 flex items-center justify-center overflow-hidden">
                      {(() => {
                        const ActivityMediaRenderer = React.lazy(() => import('@/components/ActivityMediaRenderer'));
                        
                        return (
                          <React.Suspense fallback={<div className="text-gray-500">Loading media...</div>}>
                            <ActivityMediaRenderer 
                              activity={courseState.currentActivity}
                              showType="hero"
                              className="w-full h-full object-cover"
                              maxImages={1}
                            />
                          </React.Suspense>
                        );
                      })()}
                    </div>

                    <CardContent className="p-6">
                      {/* Activity Title and Description */}
                      <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                          {courseState.currentActivity.title}
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed">
                          {courseState.currentActivity.description}
                        </p>
                      </div>

                      {/* Story Context (if available) */}
                      {(() => {
                        const content = courseState.currentActivity?.content;
                        let parsedContent;
                        
                        try {
                          // Parse content if it's a JSON string
                          parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
                        } catch (error) {
                          parsedContent = content;
                        }
                        
                        const story = parsedContent?.story;
                        
                        return story ? (
                          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                            <p className="text-sm text-blue-700 leading-relaxed font-medium">
                              {story}
                            </p>
                          </div>
                        ) : null;
                      })()}
                    </CardContent>
                  </Card>

                  {/* All Interactive Components - Keep Card Style */}
                  <div className="mb-8">
                    <ModuleContent />
                  </div>



                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-8 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2"
                      onClick={handlePreviousActivity}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </Button>
                    
                    <Button
                      className={`flex items-center space-x-2 transition-all duration-200 ${
                        isActivityCompleted(courseState.currentActivity?.id || 0) 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={handleNextActivity}
                      disabled={!isActivityCompleted(courseState.currentActivity?.id || 0)}
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {courseState.currentCourse?.title}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {courseState.currentCourse?.description}
                    </p>
                    <div className="mt-6 text-sm text-gray-500">
                      Loading course content...
                    </div>
                  </div>
                  

                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}