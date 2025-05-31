import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Play, BookOpen, HelpCircle, FileText, Code, Presentation, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';

const activityIcons = {
  video: Play,
  reading: BookOpen,
  quiz: HelpCircle,
  assignment: FileText,
  interactive: Code,
  presentation: Presentation,
  exercise: Code,
  assessment: HelpCircle,
  simulation: Code,
  project: FileText,
  lab: Code
};

export function AccordionNavigation() {
  const { state: courseState, dispatch } = useCourse();
  const { progressState, isModuleLocked, getModuleStatus } = useProgressTracking();
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([1])); // First module expanded by default

  const toggleModule = (moduleId: number) => {
    const module = courseState.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    // Don't allow expanding locked modules
    if (isModuleLocked(moduleId, module.orderIndex)) {
      return;
    }
    
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleActivityClick = (activityId: number) => {
    const activity = courseState.activities.find(a => a.id === activityId);
    if (!activity) return;
    
    const module = courseState.modules.find(m => m.id === activity.moduleId);
    if (!module) return;
    
    // Check if the module is locked
    if (isModuleLocked(activity.moduleId, module.orderIndex)) {
      return; // Don't allow access to locked module activities
    }
    
    // Check if this is the first activity and force progression from module 1
    const isFirstModule = module.orderIndex === 0;
    if (!isFirstModule) {
      // Check if previous modules are completed
      const previousModule = courseState.modules.find(m => m.orderIndex === module.orderIndex - 1);
      if (previousModule) {
        const previousModuleActivities = courseState.activities
          .filter(a => a.moduleId === previousModule.id)
          .map(a => a.id);
        const previousModuleCompleted = previousModuleActivities.every(id => 
          progressState.completedActivities.has(id)
        );
        
        if (!previousModuleCompleted) {
          return; // Don't allow access if previous module isn't completed
        }
      }
    }
    
    dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: activity });
    
    // Calculate correct page number based on module structure
    let pageNumber = 1;
    const sortedActivities = courseState.activities
      .sort((a, b) => {
        if (a.moduleId !== b.moduleId) {
          return a.moduleId - b.moduleId;
        }
        return a.orderIndex - b.orderIndex;
      });
    
    const activityIndex = sortedActivities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
      pageNumber = activityIndex + 1;
    }
    
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageNumber });
  };

  const getActivityStatus = (activityId: number) => {
    if (progressState.completedActivities.has(activityId)) {
      return 'completed';
    }
    if (courseState.currentActivity?.id === activityId) {
      return 'current';
    }
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'missed':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100';
      case 'current':
        return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
      case 'missed':
        return 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100';
    }
  };

  // Group activities by module
  const moduleGroups = courseState.modules.map(module => {
    const moduleActivities = courseState.activities
      .filter(activity => activity.moduleId === module.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    return {
      module,
      activities: moduleActivities
    };
  });

  return (
    <div className="space-y-2">
      {moduleGroups.map(({ module, activities }) => {
        const isExpanded = expandedModules.has(module.id);
        const completedActivities = activities.filter(a => progressState.completedActivities.has(a.id)).length;
        const totalActivities = activities.length;
        const moduleProgress = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
        const moduleStatus = getModuleStatus(module.id, module.orderIndex);
        const isLocked = moduleStatus === 'locked';

        return (
          <div key={module.id} className={cn(
            "border border-sidebar-border rounded-lg overflow-hidden bg-sidebar",
            isLocked && "opacity-50"
          )}>
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module.id)}
              className={cn(
                "w-full px-4 py-3 flex items-center justify-between transition-colors",
                isLocked 
                  ? "cursor-not-allowed" 
                  : "hover:bg-sidebar/50"
              )}
              aria-expanded={isExpanded}
              aria-controls={`module-${module.id}-content`}
              disabled={isLocked}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-sidebar-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-sidebar-foreground" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-medium text-sidebar-foreground text-sm">
                    {module.title}
                  </h3>
                  <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                    {completedActivities}/{totalActivities} activities • {Math.round(moduleProgress)}%
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 w-8 h-2 bg-sidebar-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </button>

            {/* Module Activities */}
            {isExpanded && (
              <div 
                id={`module-${module.id}-content`}
                className="border-t border-sidebar-border bg-sidebar/30"
              >
                {activities.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {activities.map((activity) => {
                      const status = getActivityStatus(activity.id);
                      const IconComponent = activityIcons[activity.type as keyof typeof activityIcons] || FileText;
                      const isActivityLocked = isLocked;
                      
                      return (
                        <button
                          key={activity.id}
                          onClick={() => handleActivityClick(activity.id)}
                          disabled={isActivityLocked}
                          className={cn(
                            "w-full p-3 rounded-md border text-left transition-all duration-200 flex items-center space-x-3",
                            getStatusColors(status),
                            courseState.currentActivity?.id === activity.id && "ring-2 ring-primary/20",
                            isActivityLocked && "cursor-not-allowed opacity-60"
                          )}
                        >
                          <div className="flex-shrink-0">
                            {getStatusIcon(status)}
                          </div>
                          <div className="flex-shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">
                              {activity.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs opacity-70">
                                {activity.duration}min
                              </span>
                              <span className="text-xs opacity-50">•</span>
                              <span className="text-xs opacity-70 capitalize">
                                {activity.type}
                              </span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-sidebar-foreground/60">
                    No activities in this module
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}