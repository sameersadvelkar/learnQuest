import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AccordionNavigation } from '@/components/AccordionNavigation';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { Trophy, Clock, BookOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state: courseState } = useCourse();
  const { progressState, getCourseProgress } = useProgressTracking();

  const courseProgress = getCourseProgress();
  const completedCount = progressState.completedActivities.size;
  const totalActivities = courseState.activities.length;

  console.log('Sidebar render - isOpen:', isOpen);

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-16 left-0 w-80 bg-white/95 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-2xl z-50 transform transition-all duration-300 ease-out ${
          isOpen 
            ? 'translate-x-0 opacity-100' 
            : '-translate-x-full opacity-0'
        }`}
        style={{
          height: 'calc(100vh - 64px)'
        }}
      >
        {/* Course Header */}
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm relative">
          {/* Close button for mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-2 right-2 lg:hidden hover:bg-white/50 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center space-x-3 mb-4 animate-fade-in">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg transform transition-transform duration-200 hover:scale-105">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="font-semibold text-lg text-gray-900 transition-colors duration-200">
                {courseState.currentCourse?.title || 'Course Title'}
              </h1>
              <p className="text-sm text-gray-600 transition-colors duration-200">
                {courseState.currentCourse?.category || 'Course Category'}
              </p>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="space-y-2 animate-slide-up">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Course Progress</span>
              <span className="text-sm font-semibold text-emerald-600 transition-all duration-300">
                {courseProgress}%
              </span>
            </div>
            <Progress value={courseProgress} className="h-2 transition-all duration-500" />
            <div className="flex justify-between text-xs text-gray-600">
              <span className="transition-opacity duration-300">{completedCount} of {totalActivities} completed</span>
              <span className="transition-opacity duration-300">~{Math.max(0, Math.ceil((totalActivities - completedCount) * 10))}min left</span>
            </div>
          </div>
        </div>

        {/* Module Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 animate-fade-in-delayed">
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <AccordionNavigation />
          </div>
        </nav>

        {/* Achievements Section */}
        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 backdrop-blur-sm animate-slide-up-delayed">
          <div className="flex items-center space-x-2 mb-3">
            <Trophy className="w-4 h-4 text-emerald-600 transition-colors duration-200" />
            <h3 className="font-semibold text-sm text-gray-900">Achievements</h3>
          </div>
          
          <div className="space-y-2">
            {/* Points Display */}
            <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-white/80">
              <span className="text-sm text-gray-700">Total Points</span>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 transition-colors duration-200">
                {progressState.totalPoints}
              </Badge>
            </div>

            {/* Streak Display */}
            <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-white/80">
              <span className="text-sm text-gray-700">Current Streak</span>
              <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50 transition-colors duration-200">
                {progressState.streak} days
              </Badge>
            </div>

            {/* Recent Achievements */}
            <div className="flex space-x-2 mt-3">
              {progressState.earnedAchievements.slice(-3).map((achievementId, index) => (
                <div
                  key={achievementId}
                  className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 animate-bounce"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  title="Achievement earned!"
                >
                  <Trophy className="w-4 h-4 text-white" />
                </div>
              ))}
              {progressState.earnedAchievements.length === 0 && (
                <div className="text-xs text-gray-500 transition-opacity duration-300">
                  Complete activities to earn achievements!
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}