import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SettingsState {
  audioMuted: boolean;
  videoQuality: 'auto' | '1080p' | '720p' | '480p';
  language: string;
  notifications: boolean;
  autoplay: boolean;
  playbackSpeed: number;
}

type SettingsAction =
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'SET_VIDEO_QUALITY'; payload: SettingsState['videoQuality'] }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_AUTOPLAY' }
  | { type: 'SET_PLAYBACK_SPEED'; payload: number }
  | { type: 'LOAD_SETTINGS'; payload: Partial<SettingsState> }
  | { type: 'RESET_SETTINGS' };

const initialState: SettingsState = {
  audioMuted: false,
  videoQuality: 'auto',
  language: 'en',
  notifications: true,
  autoplay: false,
  playbackSpeed: 1.0,

};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'TOGGLE_AUDIO':
      return { ...state, audioMuted: !state.audioMuted };
    
    case 'SET_VIDEO_QUALITY':
      return { ...state, videoQuality: action.payload };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    
    case 'TOGGLE_AUTOPLAY':
      return { ...state, autoplay: !state.autoplay };
    
    case 'SET_PLAYBACK_SPEED':
      return { ...state, playbackSpeed: action.payload };
    

    
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload };
    
    case 'RESET_SETTINGS':
      return initialState;
    
    default:
      return state;
  }
}

const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
} | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('lms-settings');
      if (stored) {
        const settingsData = JSON.parse(stored);
        dispatch({ type: 'LOAD_SETTINGS', payload: settingsData });
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save settings to localStorage when state changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem('lms-settings', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving settings to localStorage:', error);
      }
    }
  }, [state, isInitialized]);



  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
