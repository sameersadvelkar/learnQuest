import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AudioSettings {
  autoPlay: boolean;
  volume: number;
  isEnabled: boolean;
  language: string;
}

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (updates: Partial<AudioSettings>) => void;
  toggleAutoPlay: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

const DEFAULT_SETTINGS: AudioSettings = {
  autoPlay: false,
  volume: 0.7,
  isEnabled: true,
  language: 'en',
};

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(DEFAULT_SETTINGS);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('courseAudioSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn('Failed to load audio settings:', error);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('courseAudioSettings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save audio settings:', error);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const toggleAutoPlay = () => {
    setSettings(prev => ({ ...prev, autoPlay: !prev.autoPlay }));
  };

  return (
    <AudioContext.Provider value={{ settings, updateSettings, toggleAutoPlay }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}