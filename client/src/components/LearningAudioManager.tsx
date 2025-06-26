import { useEffect, useRef, useState } from 'react';

interface AudioTrack {
  name: string;
  url: string;
  componentTypes: string[];
  description: string;
}

const LEARNING_TRACKS: AudioTrack[] = [
  {
    name: 'Focus Flow',
    url: '/audio/learning/focus-flow.mp3',
    componentTypes: ['tabs', 'accordion', 'slider'],
    description: 'Gentle ambient sounds for content exploration'
  },
  {
    name: 'Brain Boost',
    url: '/audio/learning/brain-boost.mp3', 
    componentTypes: ['flipcard', 'flipcards'],
    description: 'Energizing beats for memory activities'
  },
  {
    name: 'Deep Think',
    url: '/audio/learning/deep-think.mp3',
    componentTypes: ['dragdrop', 'multiplechoice'],
    description: 'Concentration music for problem-solving'
  },
  {
    name: 'Calm Study',
    url: '/audio/learning/calm-study.mp3',
    componentTypes: ['all'],
    description: 'Relaxing background for any activity'
  }
];

interface LearningAudioManagerProps {
  activeComponentType?: string;
  isActive: boolean;
  onAudioStateChange?: (isPlaying: boolean) => void;
}

export function LearningAudioManager({ 
  activeComponentType, 
  isActive,
  onAudioStateChange 
}: LearningAudioManagerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);

  // Find appropriate track for current component type
  useEffect(() => {
    if (!activeComponentType) return;

    const track = LEARNING_TRACKS.find(track => 
      track.componentTypes.includes(activeComponentType) || 
      track.componentTypes.includes('all')
    );

    if (track && track !== currentTrack) {
      setCurrentTrack(track);
    }
  }, [activeComponentType, currentTrack]);

  // Auto-play when component becomes active
  useEffect(() => {
    if (isActive && currentTrack && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Auto-play failed, user will need to interact with controls
      });
      onAudioStateChange?.(true);
    } else if (!isActive && audioRef.current) {
      audioRef.current.pause();
      onAudioStateChange?.(false);
    }
  }, [isActive, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <div className="mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Learning Soundtrack: {currentTrack.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {currentTrack.description}
        </p>
      </div>
      
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        controls
        loop
        preload="auto"
        className="w-full h-8"
        style={{ maxHeight: '32px' }}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}