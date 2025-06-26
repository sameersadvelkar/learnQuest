import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Course, Module, Activity } from '@shared/schema';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  modules: Module[];
  activities: Activity[];
  currentModule: Module | null;
  currentActivity: Activity | null;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

type CourseAction =
  | { type: 'SET_COURSES'; payload: Course[] }
  | { type: 'SET_COURSE'; payload: Course }
  | { type: 'SET_MODULES'; payload: Module[] }
  | { type: 'SET_ACTIVITIES'; payload: Activity[] }
  | { type: 'SET_CURRENT_MODULE'; payload: Module }
  | { type: 'SET_CURRENT_ACTIVITY'; payload: Activity }
  | { type: 'SET_MODULE'; payload: Module }
  | { type: 'SET_ACTIVITY'; payload: Activity }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CURRENT_COURSE' }
  | { type: 'CLEAR_CURRENT_MODULE' }
  | { type: 'CLEAR_CURRENT_ACTIVITY' }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREVIOUS_PAGE' };

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  modules: [],
  activities: [],
  currentModule: null,
  currentActivity: null,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

function courseReducer(state: CourseState, action: CourseAction): CourseState {
  switch (action.type) {
    case 'SET_COURSES':
      return { ...state, courses: action.payload };
    case 'SET_COURSE':
      return { ...state, currentCourse: action.payload };
    case 'SET_MODULES':
      return { ...state, modules: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'SET_CURRENT_MODULE':
      return { ...state, currentModule: action.payload };
    case 'SET_CURRENT_ACTIVITY':
      return { ...state, currentActivity: action.payload };
    case 'SET_MODULE':
      return { ...state, currentModule: action.payload };
    case 'SET_ACTIVITY':
      return { ...state, currentActivity: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_CURRENT_COURSE':
      return { ...state, currentCourse: null };
    case 'CLEAR_CURRENT_MODULE':
      return { ...state, currentModule: null };
    case 'CLEAR_CURRENT_ACTIVITY':
      return { ...state, currentActivity: null };
    case 'NEXT_PAGE':
      return { 
        ...state, 
        currentPage: Math.min(state.currentPage + 1, state.totalPages) 
      };
    case 'PREVIOUS_PAGE':
      return { 
        ...state, 
        currentPage: Math.max(state.currentPage - 1, 1) 
      };
    default:
      return state;
  }
}

const CourseContext = createContext<{
  state: CourseState;
  dispatch: React.Dispatch<CourseAction>;
} | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}
