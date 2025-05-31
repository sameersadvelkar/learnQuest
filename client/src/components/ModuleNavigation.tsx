import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { 
  CheckCircle, 
  PlayCircle, 
  Circle, 
  Lock, 
  Video, 
  FileText, 
  HelpCircle,
  Activity
} from 'lucide-react';

export function ModuleNavigation() {
  const { state: courseState, dispatch } = useCourse();
  const { getModuleProgress, isActivityCompleted, isModuleLocked } = useProgressTracking();

  const handleActivityClick = (activityId: number) => {
    const activity = courseState.activities.find(a => a.id === activityId);
    if (activity) {
      dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: activity });
      
      const module = courseState.modules.find(m => m.id === activity.moduleId);
      if (module) {
        dispatch({ type: 'SET_CURRENT_MODULE', payload: module });
      }
    }
  };

  const getActivityIcon = (type: string, completed: boolean, isCurrentActivity: boolean) => {
    if (completed) return <CheckCircle className="w-4 h-4 text-secondary" />;
    if (isCurrentActivity) return <PlayCircle className="w-4 h-4 text-primary" />;
    
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-gray-400" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4 text-gray-400" />;
      case 'reading':
        return <FileText className="w-4 h-4 text-gray-400" />;
      case 'exercise':
        return <Activity className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-300" />;
    }
  };

  const getModuleStatusBadge = (moduleId: number, moduleIndex: number) => {
    const progress = getModuleProgress(moduleId);
    const isLocked = isModuleLocked(moduleId, moduleIndex);
    
    if (isLocked) {
      return <Badge variant="secondary" className="bg-gray-200 text-gray-600">Locked</Badge>;
    }
    if (progress === 100) {
      return <Badge className="bg-secondary text-secondary-foreground">Complete</Badge>;
    }
    if (progress > 0) {
      return <Badge variant="outline" className="text-accent border-accent">In Progress</Badge>;
    }
    return null;
  };

  return (
    <div className="space-y-2">
      {courseState.modules
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((module, moduleIndex) => {
          const moduleProgress = getModuleProgress(module.id);
          const isLocked = isModuleLocked(module.id, moduleIndex);
          const moduleActivities = courseState.activities
            .filter(activity => activity.moduleId === module.id)
            .sort((a, b) => a.orderIndex - b.orderIndex);

          return (
            <div key={module.id} className="space-y-1">
              {/* Module Header */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-sidebar-accent">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-sidebar">
                    {isLocked ? (
                      <Lock className="w-4 h-4 text-gray-400" />
                    ) : moduleProgress === 100 ? (
                      <CheckCircle className="w-4 h-4 text-secondary" />
                    ) : moduleProgress > 0 ? (
                      <span className="text-primary text-sm font-bold">{moduleIndex + 1}</span>
                    ) : (
                      <span className="text-gray-400 text-sm font-bold">{moduleIndex + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${
                      isLocked ? 'text-gray-400' : 'text-sidebar-foreground'
                    }`}>
                      {module.title}
                    </h3>
                    {moduleProgress > 0 && !isLocked && (
                      <div className="text-xs text-sidebar-foreground/60">
                        {moduleProgress}% complete
                      </div>
                    )}
                  </div>
                </div>
                {getModuleStatusBadge(module.id, moduleIndex)}
              </div>

              {/* Activities List */}
              {!isLocked && (
                <div className="ml-4 space-y-1">
                  {moduleActivities.map((activity) => {
                    const completed = isActivityCompleted(activity.id);
                    const isCurrentActivity = courseState.currentActivity?.id === activity.id;
                    
                    return (
                      <Button
                        key={activity.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActivityClick(activity.id)}
                        className={`w-full justify-start text-left p-2 h-auto nav-item-hover ${
                          isCurrentActivity 
                            ? 'bg-primary/10 border border-primary/20 text-primary' 
                            : completed
                            ? 'text-secondary hover:bg-secondary/5'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          {getActivityIcon(activity.type, completed, isCurrentActivity)}
                          <div className="flex-1">
                            <div className="text-sm">{activity.title}</div>
                            {activity.duration && (
                              <div className="text-xs opacity-60">
                                {activity.duration} min
                              </div>
                            )}
                          </div>
                          {completed && !isCurrentActivity && (
                            <CheckCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
