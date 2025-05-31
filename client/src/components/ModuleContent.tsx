import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ImageDisplay } from '@/components/ImageDisplay';
import { QuizComponent } from '@/components/QuizComponent';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { Video, BookOpen, CheckCircle, PlayCircle, Award, Image } from 'lucide-react';

export function ModuleContent() {
  const { state: courseState } = useCourse();
  const { currentModule, currentActivity } = courseState;
  const { completeActivity, isActivityCompleted, isModuleCompleted, getModuleProgress } = useProgressTracking();

  if (!currentModule || !currentActivity) {
    return null;
  }

  const isCompleted = isActivityCompleted(currentActivity.id);
  const moduleProgress = getModuleProgress(currentModule.id);
  const moduleIsCompleted = isModuleCompleted(currentModule.id);

  const handleCompleteActivity = () => {
    completeActivity(currentActivity.id, currentModule.id);
  };

  const renderActivityContent = () => {
    const content = currentActivity.content as any;
    
    // Handle different activity types
    switch (currentActivity.type) {
      case 'video':
        if (currentActivity.videoUrl) {
          return (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  Video Content
                </h3>
                <VideoPlayer
                  url={currentActivity.videoUrl}
                  title={currentActivity.title}
                  onComplete={handleCompleteActivity}
                />
              </CardContent>
            </Card>
          );
        }
        break;
        
      case 'quiz':
        if (content && content.type === 'quiz') {
          return (
            <Card>
              <CardContent className="p-6">
                <QuizComponent
                  content={content}
                  onComplete={(score) => {
                    console.log('Quiz completed with score:', score);
                    handleCompleteActivity();
                  }}
                />
              </CardContent>
            </Card>
          );
        }
        break;
        
      case 'reading':
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Reading Material
              </h3>
              {renderReadingContent(content)}
            </CardContent>
          </Card>
        );
        
      default:
        // For other activity types, show a placeholder with activity info
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentActivity.type.charAt(0).toUpperCase() + currentActivity.type.slice(1)} Activity
              </h3>
              <p className="text-gray-600 mb-4">
                This is a {currentActivity.type} activity. Duration: {currentActivity.duration} minutes.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">
                  Activity content will be displayed here based on the activity type and configuration.
                </p>
              </div>
            </CardContent>
          </Card>
        );
    }
    
    return null;
  };

  const renderReadingContent = (content: any) => {
    if (content && content.type === 'tabbed_content' && content.tabs) {
      return (
        <div className="space-y-4">
          {content.tabs.map((tab: any, index: number) => (
            <div key={tab.id || index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{tab.title}</h4>
              {tab.content?.type === 'markdown' && (
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{tab.content.text}</pre>
                </div>
              )}
              {tab.content?.type === 'code_example' && (
                <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm overflow-x-auto">
                  <pre>{tab.content.code}</pre>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    
    return (
      <div className="text-gray-600">
        <p>Reading content will be displayed here.</p>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-sm text-blue-600 mb-2">
            <span>Module {currentModule.orderIndex + 1}</span>
            <span>•</span>
            <span>Activity {currentActivity.orderIndex + 1}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentActivity.title}
          </h1>
          <p className="text-gray-600">
            {currentActivity.description || 'Learn the fundamentals you need to understand and apply these concepts in real-world scenarios.'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <Video className="w-4 h-4 mr-1" />
            Video
          </Badge>
          {isCompleted ? (
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Badge>
          ) : (
            <Button onClick={handleCompleteActivity} className="bg-blue-600 hover:bg-blue-700">
              <PlayCircle className="w-4 h-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      </div>

      {/* About This Lesson */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            About This Lesson
          </h3>
          <p className="text-blue-800">
            This lesson will teach you the fundamentals you need to understand and apply these concepts in real-world scenarios.
          </p>
        </CardContent>
      </Card>

      {/* Main Content */}
      {renderActivityContent()}

      {/* Key Takeaways */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4">
            Key Takeaways
          </h3>
          <ul className="space-y-2 text-amber-800">
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              Understand the core concepts
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              Apply what you learn in practice
            </li>
            <li className="flex items-start">
              <span className="text-amber-600 mr-2">•</span>
              Build confidence in your skills
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Module Progress */}
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Module Progress
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-purple-800">Progress in {currentModule.title}</span>
              <span className="text-purple-900 font-semibold">{moduleProgress}%</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${moduleProgress}%` }}
              ></div>
            </div>
            {moduleIsCompleted && (
              <div className="flex items-center text-green-700 font-medium">
                <CheckCircle className="w-4 h-4 mr-2" />
                Module completed! Next module is now unlocked.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Next Steps
          </h3>
          <p className="text-green-800">
            {isCompleted 
              ? "Great work! Move on to the next activity to continue building your knowledge."
              : "Complete this activity to progress through the module and unlock new content."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}