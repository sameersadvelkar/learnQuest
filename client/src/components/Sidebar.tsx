import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ModuleNavigation } from '@/components/ModuleNavigation';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { Trophy, Clock, BookOpen } from 'lucide-react';

export function Sidebar() {
  const { state: courseState } = useCourse();
  const { progressState, getCourseProgress } = useProgressTracking();

  const courseProgress = getCourseProgress();
  const completedCount = progressState.completedActivities.size;
  const totalPages = courseState.currentCourse?.totalPages || 0;

  return (
    <aside className="w-80 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Course Header */}
      <div className="p-6 border-b border-sidebar-border bg-sidebar">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h1 className="font-semibold text-lg text-sidebar-foreground">
              {courseState.currentCourse?.title || 'Course Title'}
            </h1>
            <p className="text-sm text-sidebar-foreground/70">
              {courseState.currentCourse?.description || 'Course Description'}
            </p>
          </div>
        </div>
        
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-sidebar-foreground">Course Progress</span>
            <span className="text-sm font-semibold text-primary">{courseProgress}%</span>
          </div>
          <Progress value={courseProgress} className="h-2" />
          <div className="flex justify-between text-xs text-sidebar-foreground/60">
            <span>{completedCount} of {totalPages} completed</span>
            <span>~{Math.max(0, Math.ceil((totalPages - completedCount) * 10))}min left</span>
          </div>
        </div>
      </div>

      {/* Module Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ModuleNavigation />
      </nav>

      {/* Achievements Section */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center space-x-2 mb-3">
          <Trophy className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-sm text-sidebar-foreground">Achievements</h3>
        </div>
        
        <div className="space-y-2">
          {/* Points Display */}
          <div className="flex items-center justify-between p-2 bg-sidebar rounded-lg">
            <span className="text-sm text-sidebar-foreground">Total Points</span>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {progressState.totalPoints}
            </Badge>
          </div>

          {/* Streak Display */}
          <div className="flex items-center justify-between p-2 bg-sidebar rounded-lg">
            <span className="text-sm text-sidebar-foreground">Current Streak</span>
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              {progressState.streak} days
            </Badge>
          </div>

          {/* Recent Achievements */}
          <div className="flex space-x-2 mt-3">
            {progressState.earnedAchievements.slice(-3).map((achievementId) => (
              <div
                key={achievementId}
                className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center animate-pulse"
                title="Achievement earned!"
              >
                <Trophy className="w-4 h-4 text-white" />
              </div>
            ))}
            {progressState.earnedAchievements.length === 0 && (
              <div className="text-xs text-sidebar-foreground/50">
                Complete activities to earn achievements!
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
