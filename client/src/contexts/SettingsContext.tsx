import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SettingsState {
  audioMuted: boolean;
  videoQuality: 'auto' | '1080p' | '720p' | '480p';
  language: string;
  notifications: boolean;
  autoplay: boolean;
  playbackSpeed: number;
  theme: 'light' | 'dark' | 'system';
}

type SettingsAction =
  | { type: 'TOGGLE_AUDIO' }
  | { type: 'SET_VIDEO_QUALITY'; payload: SettingsState['videoQuality'] }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_AUTOPLAY' }
  | { type: 'SET_PLAYBACK_SPEED'; payload: number }
  | { type: 'SET_THEME'; payload: SettingsState['theme'] }
  | { type: 'LOAD_SETTINGS'; payload: Partial<SettingsState> }
  | { type: 'RESET_SETTINGS' };

const initialState: SettingsState = {
  audioMuted: false,
  videoQuality: 'auto',
  language: 'en',
  notifications: true,
  autoplay: false,
  playbackSpeed: 1.0,
  theme: 'system',
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
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
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
  const [storedSettings, setStoredSettings] = useLocalStorage('lms-settings', {});

  // Load settings from localStorage on mount
  useEffect(() => {
    if (storedSettings && Object.keys(storedSettings).length > 0) {
      dispatch({ type: 'LOAD_SETTINGS', payload: storedSettings });
    }
  }, [storedSettings]);

  // Save settings to localStorage when state changes
  useEffect(() => {
    setStoredSettings(state);
  }, [state, setStoredSettings]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else if (state.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [state.theme]);

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
