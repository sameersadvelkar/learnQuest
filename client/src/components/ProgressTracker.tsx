import React from 'react';
import { Progress } from '@/components/ui/progress';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';

export function ProgressTracker() {
  const { state: courseState } = useCourse();
  const { getCourseProgress, getModuleProgress } = useProgressTracking();

  const courseProgress = getCourseProgress();
  const currentModuleProgress = courseState.currentModule 
    ? getModuleProgress(courseState.currentModule.id) 
    : 0;

  return (
    <div className="space-y-4">
      {/* Course Progress */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Course Progress</span>
          <span className="text-sm font-semibold text-primary">{courseProgress}%</span>
        </div>
        <Progress value={courseProgress} className="h-2" />
      </div>

      {/* Current Module Progress */}
      {courseState.currentModule && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {courseState.currentModule.title}
            </span>
            <span className="text-sm font-semibold text-secondary">{currentModuleProgress}%</span>
          </div>
          <Progress value={currentModuleProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}
