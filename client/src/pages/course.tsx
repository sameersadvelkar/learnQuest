import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sidebar } from '@/components/Sidebar';
import { ModuleContent } from '@/components/ModuleContent';
import { Navigation } from '@/components/Navigation';
import { TwoColumnLayout } from '@/components/layouts/TwoColumnLayout';
import { FullScreenLayout } from '@/components/layouts/FullScreenLayout';
import { ProgressTracker } from '@/components/ProgressTracker';
import { QuizComponent } from '@/components/QuizComponent';
import { WhatIsReactPage } from '@/data/modules/module-1/activities/activity-1/page-1/Page';
import { PropsInDetailPage } from '@/data/modules/module-2/activities/activity-1/page-1/Page';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { useSettings } from '@/contexts/SettingsContext';
import { sampleCourse, sampleModules, sampleActivities } from '@/data/courseContent';
import { propsInDetailContent } from '@/data/modules/module-2/activities/activity-1/page-1/content';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Video,
  FileText,
  Activity as ActivityIcon,
  Book
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
    // Initialize with sample course data
    if (!courseState.currentCourse) {
      dispatch({ type: 'SET_COURSE', payload: sampleCourse });
      dispatch({ type: 'SET_MODULES', payload: sampleModules });
      dispatch({ type: 'SET_ACTIVITIES', payload: sampleActivities });
      
      // Set initial current module and activity
      const firstModule = sampleModules[0];
      const firstActivity = sampleActivities.find(a => a.moduleId === firstModule.id);
      
      if (firstModule) {
        dispatch({ type: 'SET_CURRENT_MODULE', payload: firstModule });
      }
      if (firstActivity) {
        dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: firstActivity });
      }
    }
  }, [courseState.currentCourse, dispatch]);

  // Set layout based on activity type
  useEffect(() => {
    if (courseState.currentActivity) {
      if (courseState.currentActivity.type === 'quiz') {
        setCurrentLayout('fullscreen');
      } else {
        setCurrentLayout('two-column');
      }
    }
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
      }
      
      setShowCompletionMessage(false);
      setRedirectCountdown(5);
    }
  }, [showCompletionMessage, redirectCountdown, courseState.activities, courseState.modules, courseState.currentActivity?.id, dispatch]);

  const handleQuizComplete = (score: number) => {
    if (courseState.currentActivity && courseState.currentModule) {
      completeActivity(courseState.currentActivity.id, courseState.currentModule.id);
    }
    setShowQuiz(false);
  };

  const toggleAudio = () => {
    settingsDispatch({ type: 'TOGGLE_AUDIO' });
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

    // Handle quiz activities
    if (activity.type === 'quiz') {
      if (activity.id === 8) { // Props Practice Quiz
        return (
          <FullScreenLayout
            title="Props Practice Quiz"
            subtitle="Test your understanding of props and components"
            onBack={() => setCurrentLayout('two-column')}
          >
            <QuizComponent
              content={propsInDetailContent}
              onComplete={handleQuizComplete}
            />
          </FullScreenLayout>
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
          <FullScreenLayout
            title={activity.title}
            subtitle={activity.description || undefined}
            onBack={() => setCurrentLayout('two-column')}
          >
            <QuizComponent
              content={quizContent}
              onComplete={handleQuizComplete}
            />
          </FullScreenLayout>
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
        >
          <WhatIsReactPage />
        </TwoColumnLayout>
      );
    }

    if (activity.id === 6) {
      return (
        <TwoColumnLayout 
          activity={activity}
          onVideoProgress={handleVideoProgress}
          onVideoComplete={handleVideoComplete}
        >
          <PropsInDetailPage />
        </TwoColumnLayout>
      );
    }

    // Default video activity layout
    return (
      <TwoColumnLayout 
        activity={activity}
        onVideoProgress={handleVideoProgress}
        onVideoComplete={handleVideoComplete}
      >
        <ModuleContent />
      </TwoColumnLayout>
    );
  };

  if (currentLayout === 'fullscreen') {
    return renderActivityContent();
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {courseState.currentActivity?.title || 'Select an Activity'}
          </h2>
          {courseState.currentActivity && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              {getActivityIcon(courseState.currentActivity.type)}
              <span className="capitalize">{courseState.currentActivity.type}</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAudio}
            className="p-2"
            title={settings.audioMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {settings.audioMuted ? (
              <VolumeX className="w-4 h-4 text-gray-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-600" />
            )}
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2" title="Help">
            <HelpCircle className="w-4 h-4 text-gray-600" />
          </Button>
          
          <Button variant="ghost" size="sm" className="p-2" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 flex flex-col relative">
          {renderActivityContent()}
          <Navigation />
          
          {/* Video Completion Overlay */}
          {showCompletionMessage && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Activity Completed!
                </h3>
                <p className="text-gray-600 mb-4">
                  Great job! You've successfully completed this activity.
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    Redirecting to next activity in <span className="font-bold text-blue-900">{redirectCountdown}</span> seconds
                  </p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${((5 - redirectCountdown) / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setShowCompletionMessage(false);
                    setRedirectCountdown(5);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Stay on this page
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
