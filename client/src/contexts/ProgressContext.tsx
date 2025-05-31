import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState, useCallback } from 'react';
import { UserProgress, Achievement } from '@shared/schema';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ProgressState {
  userProgress: UserProgress[];
  achievements: Achievement[];
  earnedAchievements: number[];
  courseProgress: number;
  moduleProgress: Record<number, number>;
  completedActivities: Set<number>;
  totalPoints: number;
  streak: number;
  lastActivity: Date | null;
}

type ProgressAction =
  | { type: 'LOAD_PROGRESS'; payload: Partial<ProgressState> }
  | { type: 'COMPLETE_ACTIVITY'; payload: { activityId: number; moduleId: number } }
  | { type: 'UPDATE_PROGRESS'; payload: { activityId: number; percentage: number } }
  | { type: 'EARN_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_COURSE_PROGRESS'; payload: number }
  | { type: 'SET_MODULE_PROGRESS'; payload: { moduleId: number; progress: number } }
  | { type: 'RESET_PROGRESS' };

const initialState: ProgressState = {
  userProgress: [],
  achievements: [],
  earnedAchievements: [],
  courseProgress: 0,
  moduleProgress: {},
  completedActivities: new Set(),
  totalPoints: 0,
  streak: 0,
  lastActivity: null,
};

function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return { ...state, ...action.payload };
    
    case 'COMPLETE_ACTIVITY': {
      const { activityId, moduleId } = action.payload;
      const newCompletedActivities = new Set(state.completedActivities);
      newCompletedActivities.add(activityId);
      
      // Calculate new streak
      const today = new Date();
      const isConsecutiveDay = state.lastActivity && 
        (today.getTime() - state.lastActivity.getTime()) <= 24 * 60 * 60 * 1000;
      
      return {
        ...state,
        completedActivities: newCompletedActivities,
        totalPoints: state.totalPoints + 100, // 100 points per completed activity
        streak: isConsecutiveDay ? state.streak + 1 : 1,
        lastActivity: today,
      };
    }
    
    case 'UPDATE_PROGRESS': {
      const { activityId, percentage } = action.payload;
      const existingProgress = state.userProgress.find(p => p.activityId === activityId);
      
      if (existingProgress) {
        const updatedProgress = state.userProgress.map(p =>
          p.activityId === activityId ? { ...p, progressPercentage: percentage } : p
        );
        return { ...state, userProgress: updatedProgress };
      }
      
      return state;
    }
    
    case 'EARN_ACHIEVEMENT': {
      const achievement = action.payload;
      if (!state.earnedAchievements.includes(achievement.id)) {
        return {
          ...state,
          earnedAchievements: [...state.earnedAchievements, achievement.id],
          totalPoints: state.totalPoints + 250, // 250 points per achievement
        };
      }
      return state;
    }
    
    case 'SET_COURSE_PROGRESS':
      return { ...state, courseProgress: action.payload };
    
    case 'SET_MODULE_PROGRESS':
      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.payload.moduleId]: action.payload.progress,
        },
      };
    
    case 'RESET_PROGRESS':
      return {
        ...initialState,
        achievements: state.achievements, // Keep achievements definitions
      };
    
    default:
      return state;
  }
}

const ProgressContext = createContext<{
  state: ProgressState;
  dispatch: React.Dispatch<ProgressAction>;
} | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('course-progress');
      if (stored) {
        const progressData = JSON.parse(stored);
        dispatch({ 
          type: 'LOAD_PROGRESS', 
          payload: {
            ...progressData,
            completedActivities: new Set(progressData.completedActivities || []),
            lastActivity: progressData.lastActivity ? new Date(progressData.lastActivity) : null,
          }
        });
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save progress to localStorage when state changes
  useEffect(() => {
    if (isInitialized) {
      try {
        const progressToSave = {
          ...state,
          completedActivities: Array.from(state.completedActivities),
        };
        localStorage.setItem('course-progress', JSON.stringify(progressToSave));
      } catch (error) {
        console.error('Error saving progress to localStorage:', error);
      }
    }
  }, [state, isInitialized]);

  // Method to clear all progress (for testing)
  const clearProgress = useCallback(() => {
    localStorage.removeItem('course-progress');
    dispatch({ type: 'RESET_PROGRESS' });
  }, [dispatch]);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

// Helper functions
export function calculateCourseProgress(
  completedActivities: Set<number>,
  totalActivities: number
): number {
  return Math.round((completedActivities.size / totalActivities) * 100);
}

export function calculateModuleProgress(
  completedActivities: Set<number>,
  moduleActivities: number[]
): number {
  const completedInModule = moduleActivities.filter(id => completedActivities.has(id)).length;
  return Math.round((completedInModule / moduleActivities.length) * 100);
}
