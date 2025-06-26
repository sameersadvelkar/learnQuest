import React from 'react';
import { Button } from '@/components/ui/button';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { useTranslation } from '@/hooks/useTranslation';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function Navigation() {
  const { state: courseState, dispatch } = useCourse();
  const { completeActivity, isActivityCompleted } = useProgressTracking();
  const { t } = useTranslation();

  const currentActivity = courseState.currentActivity;
  const currentModule = courseState.currentModule;
  
  const handlePrevious = () => {
    if (!currentActivity || !currentModule) return;
    
    const moduleActivities = courseState.activities
      .filter(a => a.moduleId === currentModule.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    const currentIndex = moduleActivities.findIndex(a => a.id === currentActivity.id);
    
    if (currentIndex > 0) {
      // Go to previous activity in same module
      const previousActivity = moduleActivities[currentIndex - 1];
      dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: previousActivity });
    } else {
      // Go to last activity of previous module
      const currentModuleIndex = courseState.modules
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .findIndex(m => m.id === currentModule.id);
      
      if (currentModuleIndex > 0) {
        const previousModule = courseState.modules
          .sort((a, b) => a.orderIndex - b.orderIndex)[currentModuleIndex - 1];
        
        const previousModuleActivities = courseState.activities
          .filter(a => a.moduleId === previousModule.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        
        if (previousModuleActivities.length > 0) {
          const lastActivity = previousModuleActivities[previousModuleActivities.length - 1];
          dispatch({ type: 'SET_CURRENT_MODULE', payload: previousModule });
          dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: lastActivity });
        }
      }
    }
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!currentActivity || !currentModule) return;
    
    const moduleActivities = courseState.activities
      .filter(a => a.moduleId === currentModule.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    const currentIndex = moduleActivities.findIndex(a => a.id === currentActivity.id);
    
    if (currentIndex < moduleActivities.length - 1) {
      // Go to next activity in same module
      const nextActivity = moduleActivities[currentIndex + 1];
      dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: nextActivity });
    } else {
      // Go to first activity of next module
      const currentModuleIndex = courseState.modules
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .findIndex(m => m.id === currentModule.id);
      
      const sortedModules = courseState.modules.sort((a, b) => a.orderIndex - b.orderIndex);
      if (currentModuleIndex < sortedModules.length - 1) {
        const nextModule = sortedModules[currentModuleIndex + 1];
        
        const nextModuleActivities = courseState.activities
          .filter(a => a.moduleId === nextModule.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        
        if (nextModuleActivities.length > 0) {
          const firstActivity = nextModuleActivities[0];
          dispatch({ type: 'SET_CURRENT_MODULE', payload: nextModule });
          dispatch({ type: 'SET_CURRENT_ACTIVITY', payload: firstActivity });
        }
      }
    }
    
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = () => {
    if (!currentActivity || !currentModule) return;
    
    completeActivity(currentActivity.id, currentModule.id);
  };

  const canGoPrevious = () => {
    if (!currentActivity || !currentModule) return false;
    
    const allActivities = courseState.activities.sort((a, b) => {
      if (a.moduleId !== b.moduleId) {
        const moduleA = courseState.modules.find(m => m.id === a.moduleId);
        const moduleB = courseState.modules.find(m => m.id === b.moduleId);
        return (moduleA?.orderIndex || 0) - (moduleB?.orderIndex || 0);
      }
      return a.orderIndex - b.orderIndex;
    });
    
    const currentIndex = allActivities.findIndex(a => a.id === currentActivity.id);
    return currentIndex > 0;
  };

  const canGoNext = () => {
    if (!currentActivity || !currentModule) return false;
    
    const allActivities = courseState.activities.sort((a, b) => {
      if (a.moduleId !== b.moduleId) {
        const moduleA = courseState.modules.find(m => m.id === a.moduleId);
        const moduleB = courseState.modules.find(m => m.id === b.moduleId);
        return (moduleA?.orderIndex || 0) - (moduleB?.orderIndex || 0);
      }
      return a.orderIndex - b.orderIndex;
    });
    
    const currentIndex = allActivities.findIndex(a => a.id === currentActivity.id);
    return currentIndex < allActivities.length - 1;
  };

  const getNextActivityTitle = () => {
    if (!currentActivity || !currentModule) return '';
    
    const moduleActivities = courseState.activities
      .filter(a => a.moduleId === currentModule.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    const currentIndex = moduleActivities.findIndex(a => a.id === currentActivity.id);
    
    if (currentIndex < moduleActivities.length - 1) {
      return moduleActivities[currentIndex + 1].title;
    } else {
      const currentModuleIndex = courseState.modules
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .findIndex(m => m.id === currentModule.id);
      
      const sortedModules = courseState.modules.sort((a, b) => a.orderIndex - b.orderIndex);
      if (currentModuleIndex < sortedModules.length - 1) {
        const nextModule = sortedModules[currentModuleIndex + 1];
        const nextModuleActivities = courseState.activities
          .filter(a => a.moduleId === nextModule.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        
        if (nextModuleActivities.length > 0) {
          return nextModuleActivities[0].title;
        }
      }
    }
    return '';
  };

  const getPreviousActivityTitle = () => {
    if (!currentActivity || !currentModule) return '';
    
    const moduleActivities = courseState.activities
      .filter(a => a.moduleId === currentModule.id)
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    const currentIndex = moduleActivities.findIndex(a => a.id === currentActivity.id);
    
    if (currentIndex > 0) {
      return moduleActivities[currentIndex - 1].title;
    } else {
      const currentModuleIndex = courseState.modules
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .findIndex(m => m.id === currentModule.id);
      
      if (currentModuleIndex > 0) {
        const previousModule = courseState.modules
          .sort((a, b) => a.orderIndex - b.orderIndex)[currentModuleIndex - 1];
        
        const previousModuleActivities = courseState.activities
          .filter(a => a.moduleId === previousModule.id)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        
        if (previousModuleActivities.length > 0) {
          return previousModuleActivities[previousModuleActivities.length - 1].title;
        }
      }
    }
    return '';
  };

  const isCompleted = currentActivity ? isActivityCompleted(currentActivity.id) : false;

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={!canGoPrevious()}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden md:inline">
            {getPreviousActivityTitle() ? `${t('navigation.previous')}: ${getPreviousActivityTitle()}` : t('navigation.previous')}
          </span>
          <span className="md:hidden">{t('navigation.previous')}</span>
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          {t('course.activity')} {courseState.currentActivity?.orderIndex || 0} {t('quiz.of')}{' '}
          {courseState.activities.filter(a => a.moduleId === currentModule?.id).length || 0}
        </div>

        <Button
          onClick={handleMarkComplete}
          disabled={isCompleted}
          className={`flex items-center space-x-2 ${
            isCompleted 
              ? 'bg-secondary hover:bg-secondary/90' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{isCompleted ? t('navigation.completed') : t('navigation.markComplete')}</span>
        </Button>
      </div>

      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={!canGoNext()}
          className="flex items-center space-x-2"
        >
          <span className="hidden md:inline">
            {getNextActivityTitle() ? `${t('navigation.next')}: ${getNextActivityTitle()}` : t('navigation.next')}
          </span>
          <span className="md:hidden">{t('navigation.next')}</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
