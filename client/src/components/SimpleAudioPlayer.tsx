import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Play, Pause, Volume2 } from 'lucide-react';
import { getAudioFile } from '@/utils/audioUtils';

interface SimpleAudioPlayerProps {
  courseId: string | number;
  pageType: 'intro' | 'activity';
  activityId?: string | number;
  className?: string;
}

export function SimpleAudioPlayer({ courseId, pageType, activityId, className = '' }: SimpleAudioPlayerProps) {
  const { t, currentLanguage } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Get language-specific audio file path
  const [audioFile, setAudioFile] = useState('');
  
  useEffect(() => {
    getAudioFile(courseId, pageType, activityId, currentLanguage).then(file => {
      setAudioFile(file || '');
    });
  }, [courseId, pageType, activityId, currentLanguage]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Audio play failed:', error);
      setIsLoading(false);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Auto-start audio when component loads
  useEffect(() => {
    if (audioFile && audioRef.current) {
      const audio = audioRef.current;
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        // Autoplay was prevented by browser policy - this is normal
        console.log('Audio autoplay prevented by browser');
      });
    }
  }, [audioFile]);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <audio
        ref={audioRef}
        src={audioFile}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={togglePlay}
        disabled={isLoading}
        className="flex items-center space-x-2 bg-white shadow-lg border-gray-200 text-gray-700 hover:bg-gray-50"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <Volume2 className="w-4 h-4" />
        <span>{isPlaying ? t('buttons.pause') : t('buttons.listen')}</span>
      </Button>
    </div>
  );
}