import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCourse } from '@/contexts/CourseContext';
import { Video, BookOpen, CheckCircle } from 'lucide-react';

export function ModuleContent() {
  const { state: courseState } = useCourse();
  const { currentModule, currentActivity } = courseState;

  if (!currentModule || !currentActivity) {
    return null;
  }

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
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
          <Video className="w-4 h-4 mr-1" />
          Video
        </Badge>
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

      {/* Next Steps */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Next Steps
          </h3>
          <p className="text-green-800">
            After completing this lesson, move on to the next activity to continue building your knowledge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}