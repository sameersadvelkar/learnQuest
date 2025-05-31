import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { Video, BookOpen, CheckCircle, PlayCircle, Award } from 'lucide-react';

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