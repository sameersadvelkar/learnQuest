import { useCallback } from 'react';
import { useProgress, calculateCourseProgress, calculateModuleProgress } from '@/contexts/ProgressContext';
import { useCourse } from '@/contexts/CourseContext';

export function useProgressTracking() {
  const { state: progressState, dispatch: progressDispatch } = useProgress();
  const { state: courseState } = useCourse();

  const completeActivity = useCallback((activityId: number, moduleId: number) => {
    progressDispatch({
      type: 'COMPLETE_ACTIVITY',
      payload: { activityId, moduleId }
    });

    // Check for achievements
    checkAchievements(progressState.completedActivities.size + 1, progressState.streak + 1);
  }, [progressDispatch, progressState.completedActivities.size, progressState.streak]);

  const updateActivityProgress = useCallback((activityId: number, percentage: number) => {
    progressDispatch({
      type: 'UPDATE_PROGRESS',
      payload: { activityId, percentage }
    });
  }, [progressDispatch]);

  const checkAchievements = useCallback((completedCount: number, streak: number) => {
    // First completion achievement
    if (completedCount === 1 && !progressState.earnedAchievements.includes(1)) {
      progressDispatch({
        type: 'EARN_ACHIEVEMENT',
        payload: {
          id: 1,
          title: 'Getting Started',
          description: 'Complete your first activity',
          iconType: 'star',
          badgeColor: 'blue',
          criteria: null
        }
      });
    }

    // First module completion
    if (completedCount >= 5 && !progressState.earnedAchievements.includes(2)) {
      progressDispatch({
        type: 'EARN_ACHIEVEMENT',
        payload: {
          id: 2,
          title: 'Module Master',
          description: 'Complete your first module',
          iconType: 'trophy',
          badgeColor: 'gold',
          criteria: null
        }
      });
    }

    // Streak achievements
    if (streak >= 3 && !progressState.earnedAchievements.includes(3)) {
      progressDispatch({
        type: 'EARN_ACHIEVEMENT',
        payload: {
          id: 3,
          title: 'Streak Master',
          description: 'Complete activities 3 days in a row',
          iconType: 'fire',
          badgeColor: 'orange',
          criteria: null
        }
      });
    }

    // Speed learner
    if (completedCount >= 10 && !progressState.earnedAchievements.includes(4)) {
      progressDispatch({
        type: 'EARN_ACHIEVEMENT',
        payload: {
          id: 4,
          title: 'Speed Learner',
          description: 'Complete 10 activities',
          iconType: 'bolt',
          badgeColor: 'purple',
          criteria: null
        }
      });
    }
  }, [progressState.earnedAchievements, progressDispatch]);

  const getCourseProgress = useCallback(() => {
    if (!courseState.currentCourse) return 0;
    return calculateCourseProgress(
      progressState.completedActivities,
      courseState.currentCourse.totalPages
    );
  }, [progressState.completedActivities, courseState.currentCourse]);

  const getModuleProgress = useCallback((moduleId: number) => {
    const moduleActivities = courseState.activities
      .filter(activity => activity.moduleId === moduleId)
      .map(activity => activity.id);
    
    return calculateModuleProgress(progressState.completedActivities, moduleActivities);
  }, [progressState.completedActivities, courseState.activities]);

  const isActivityCompleted = useCallback((activityId: number) => {
    return progressState.completedActivities.has(activityId);
  }, [progressState.completedActivities]);

  const isModuleLocked = useCallback((moduleId: number, orderIndex: number) => {
    if (orderIndex === 0) return false; // First module is always unlocked
    
    // Check if previous module is completed
    const previousModule = courseState.modules.find(m => m.orderIndex === orderIndex - 1);
    if (!previousModule) return false;
    
    const previousModuleProgress = getModuleProgress(previousModule.id);
    return previousModuleProgress < 100;
  }, [courseState.modules, getModuleProgress]);

  return {
    progressState,
    completeActivity,
    updateActivityProgress,
    getCourseProgress,
    getModuleProgress,
    isActivityCompleted,
    isModuleLocked,
    checkAchievements,
  };
}
