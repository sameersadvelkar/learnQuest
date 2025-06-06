import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sidebar } from '@/components/Sidebar';
import { ModuleContent } from '@/components/ModuleContent';
import { Navigation } from '@/components/Navigation';
import { TwoColumnLayout } from '@/components/layouts/TwoColumnLayout';
import { FullScreenLayout } from '@/components/layouts/FullScreenLayout';
import { ProgressTracker } from '@/components/ProgressTracker';
import { QuizComponent } from '@/components/QuizComponent';

import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { useSettings } from '@/contexts/SettingsContext';
import { contentLoader } from '@/data/contentLoader';
import { 
  Settings, 
  HelpCircle,
  Video,
  FileText,
  Activity as ActivityIcon,
  Book,
  CheckCircle,
  Home,
  User,
  LogOut,
  Globe
} from 'lucide-react';

export default function Course() {
  const { courseId } = useParams();
  const [location, setLocation] = useLocation();
  const { state: courseState, dispatch } = useCourse();
  const { updateActivityProgress, completeActivity, isActivityCompleted } = useProgressTracking();
  const { state: settings, dispatch: settingsDispatch } = useSettings();
  const [currentLayout, setCurrentLayout] = useState<'two-column' | 'fullscreen'>('two-column');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    // Initialize with file-based content
    if (!courseState.currentCourse) {
      const loadContent = async () => {
        try {
          const { courses, modules, activities } = await contentLoader.loadAllContent();
          
          if (courses.length > 0) {
            dispatch({ type: 'SET_COURSE', payload: courses[0] });
          }
          dispatch({ type: 'SET_MODULES', payload: modules });
          dispatch({ type: 'SET_ACTIVITIES', payload: activities });
          
          // Set initial current module and activity
          const firstModule = modules[0];
          const firstActivity = activities.find(a => a.moduleId === firstModule?.id);
          
          if (firstModule) {
            dispatch({ type: 'SET_CURRENT_MODULE', payload: firstModule });
          }
          if (firstActivity) {
            dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: firstActivity });
          }
        } catch (error) {
          console.error('Error loading course content:', error);
        }
      };
      
      loadContent();
    }
  }, [courseState.currentCourse, dispatch]);

  // All activities use the same two-column layout
  useEffect(() => {
    setCurrentLayout('two-column');
  }, [courseState.currentActivity]);

  const handleVideoProgress = (progress: number) => {
    if (courseState.currentActivity) {
      updateActivityProgress(courseState.currentActivity.id, progress);
    }
  };

  const handleVideoComplete = () => {
    if (courseState.currentActivity && courseState.currentModule) {
      completeActivity(courseState.currentActivity.id, courseState.currentModule.id);
      setShowCompletionMessage(true);
      setRedirectCountdown(5);
    }
  };

  // Auto-redirect countdown effect
  useEffect(() => {
    if (showCompletionMessage && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCompletionMessage && redirectCountdown === 0) {
      // Find next activity
      const currentActivityIndex = courseState.activities.findIndex(
        a => a.id === courseState.currentActivity?.id
      );
      const nextActivity = courseState.activities[currentActivityIndex + 1];
      
      if (nextActivity) {
        // Navigate to next activity
        const nextModule = courseState.modules.find(m => m.id === nextActivity.moduleId);
        if (nextModule) {
          dispatch({ type: 'SET_CURRENT_MODULE', payload: nextModule });
        }
        dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: nextActivity });
      } else {
        // No more activities, course is complete - redirect to thank you page
        setLocation('/course-complete');
      }
      
      setShowCompletionMessage(false);
      setRedirectCountdown(5);
    }
  }, [showCompletionMessage, redirectCountdown, courseState.activities, courseState.modules, courseState.currentActivity?.id, dispatch]);

  const handleQuizComplete = (score: number) => {
    if (courseState.currentActivity && courseState.currentModule) {
      completeActivity(courseState.currentActivity.id, courseState.currentModule.id);
      setShowCompletionMessage(true);
      setRedirectCountdown(5);
    }
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout clicked');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'reading':
        return <FileText className="w-4 h-4" />;
      case 'exercise':
        return <ActivityIcon className="w-4 h-4" />;
      default:
        return <Book className="w-4 h-4" />;
    }
  };

  const renderActivityContent = () => {
    if (!courseState.currentActivity) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Activity Selected</h2>
            <p className="text-gray-500">Select an activity from the sidebar to begin learning</p>
          </div>
        </div>
      );
    }

    const activity = courseState.currentActivity;

    // Handle quiz activities - display in regular course layout
    if (activity.type === 'quiz') {
      if (activity.id === 8) { // Props Practice Quiz
        const quizContent = {
          title: activity.title,
          description: activity.description || '',
          type: 'quiz' as const,
          quiz: {
            questions: [
              {
                id: 'props-1',
                question: 'What are props in React?',
                type: 'multiple-choice' as const,
                options: [
                  'Properties passed to components',
                  'Component state variables',
                  'Event handlers',
                  'CSS styles'
                ],
                correctAnswer: 0,
                explanation: 'Props are properties passed from parent to child components.'
              }
            ]
          }
        };
        
        return (
          <TwoColumnLayout 
            activity={activity}
          >
            <div className="max-w-4xl mx-auto p-6">
              <QuizComponent
                content={quizContent}
                onComplete={handleQuizComplete}
              />
            </div>
          </TwoColumnLayout>
        );
      } else {
        // Generic quiz for other activities
        const quizContent = {
          title: activity.title,
          description: activity.description || '',
          type: 'quiz' as const,
          quiz: {
            questions: [
              {
                id: 'sample-1',
                question: 'What is the main purpose of this module?',
                type: 'multiple-choice' as const,
                options: [
                  'To learn basic concepts',
                  'To practice implementation',
                  'To test knowledge',
                  'All of the above'
                ],
                correctAnswer: 3,
                explanation: 'This module covers all aspects: learning, practicing, and testing knowledge.'
              }
            ]
          }
        };

        return (
          <TwoColumnLayout 
            activity={activity}
          >
            <div className="max-w-4xl mx-auto p-6">
              <QuizComponent
                content={quizContent}
                onComplete={handleQuizComplete}
              />
            </div>
          </TwoColumnLayout>
        );
      }
    }

    // Handle video activities with custom content
    if (activity.id === 1) {
      return (
        <TwoColumnLayout 
          activity={activity}
          onVideoProgress={handleVideoProgress}
          onVideoComplete={handleVideoComplete}
          showCompletionMessage={showCompletionMessage}
          redirectCountdown={redirectCountdown}
          onCancelRedirect={() => {
            setShowCompletionMessage(false);
            setRedirectCountdown(5);
          }}
        >
          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{activity.title}</h2>
            <p className="text-gray-600">{activity.description}</p>
          </div>
        </TwoColumnLayout>
      );
    }

    if (activity.id === 6) {
      return (
        <TwoColumnLayout 
          activity={activity}
          onVideoProgress={handleVideoProgress}
          onVideoComplete={handleVideoComplete}
          showCompletionMessage={showCompletionMessage}
          redirectCountdown={redirectCountdown}
          onCancelRedirect={() => {
            setShowCompletionMessage(false);
            setRedirectCountdown(5);
          }}
        >
          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{activity.title}</h2>
            <p className="text-gray-600">{activity.description}</p>
          </div>
        </TwoColumnLayout>
      );
    }

    // Default video activity layout
    return (
      <TwoColumnLayout 
        activity={activity}
        onVideoProgress={handleVideoProgress}
        onVideoComplete={handleVideoComplete}
        showCompletionMessage={showCompletionMessage}
        redirectCountdown={redirectCountdown}
        onCancelRedirect={() => {
          setShowCompletionMessage(false);
          setRedirectCountdown(5);
        }}
      >
        <ModuleContent />
      </TwoColumnLayout>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Enhanced Top Navigation */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Book className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TechEdu Institute
                </h2>
              </div>
              
              {/* Course Progress Indicator */}
              <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-full border border-green-200/50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {courseState.currentActivity?.title || 'Select Activity'}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  Module {courseState.currentModule?.orderIndex || 1}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoHome}
                className="flex items-center space-x-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-2 hover:bg-purple-50 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>John Doe</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Language: English</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 flex flex-col">
          {renderActivityContent()}
          <Navigation />
        </main>
      </div>
    </div>
  );
}
