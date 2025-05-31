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
  Activity,
  AlertCircle,
  Clock
} from 'lucide-react';

export function ModuleNavigation() {
  const { state: courseState, dispatch } = useCourse();
  const { getModuleProgress, isActivityCompleted, isModuleLocked, getModuleStatus } = useProgressTracking();

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

  const isActivityMissed = (activity: any, moduleActivities: any[]) => {
    // Check if user has progressed past this activity but hasn't completed it
    const currentActivityIndex = moduleActivities.findIndex(a => a.id === courseState.currentActivity?.id);
    const thisActivityIndex = moduleActivities.findIndex(a => a.id === activity.id);
    
    return currentActivityIndex > thisActivityIndex && !isActivityCompleted(activity.id);
  };

  const getActivityIcon = (type: string, completed: boolean, isCurrentActivity: boolean, isMissed: boolean) => {
    if (completed) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (isMissed) return <AlertCircle className="w-4 h-4 text-orange-500" />;
    if (isCurrentActivity) return <PlayCircle className="w-4 h-4 text-blue-600" />;
    
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

  const getModuleStatusIcon = (moduleId: number, moduleIndex: number) => {
    const status = getModuleStatus(moduleId, moduleIndex);
    
    switch (status) {
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'active':
        return <PlayCircle className="w-5 h-5 text-blue-600" />;
      case 'available':
        return <Circle className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
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
                {getModuleStatusIcon(module.id, moduleIndex)}
              </div>

              {/* Activities List */}
              {!isLocked && (
                <div className="ml-4 space-y-1">
                  {moduleActivities.map((activity) => {
                    const completed = isActivityCompleted(activity.id);
                    const isCurrentActivity = courseState.currentActivity?.id === activity.id;
                    const isMissed = isActivityMissed(activity, moduleActivities);
                    
                    return (
                      <Button
                        key={activity.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleActivityClick(activity.id)}
                        className={`w-full justify-start text-left p-2 h-auto nav-item-hover relative ${
                          isCurrentActivity 
                            ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                            : completed
                            ? 'text-green-700 hover:bg-green-50 border border-green-100'
                            : isMissed
                            ? 'text-orange-700 hover:bg-orange-50 border border-orange-200 bg-orange-25'
                            : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          {getActivityIcon(activity.type, completed, isCurrentActivity, isMissed)}
                          <div className="flex-1">
                            <div className={`text-sm ${isMissed ? 'font-medium' : ''}`}>
                              {activity.title}
                              {isMissed && (
                                <Badge variant="outline" className="ml-2 text-xs bg-orange-100 text-orange-700 border-orange-300">
                                  Missed
                                </Badge>
                              )}
                            </div>
                            {activity.duration && (
                              <div className="text-xs opacity-60 flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{activity.duration} min</span>
                              </div>
                            )}
                          </div>
                          {completed && !isCurrentActivity && (
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          )}
                          {isMissed && !completed && (
                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          )}
                        </div>
                        {/* Missed activity indicator dot */}
                        {isMissed && !completed && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"></div>
                        )}
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
