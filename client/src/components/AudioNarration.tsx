import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Square, Volume2, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface AudioNarrationProps {
  text: string;
  language?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

export function AudioNarration({ 
  text, 
  language = 'en-US', 
  autoPlay = false,
  showControls = true,
  className = ''
}: AudioNarrationProps) {
  const {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
    currentVoice,
    setVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
  } = useTextToSpeech();

  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);

  // Filter voices by language
  const availableVoices = voices.filter(voice => 
    voice.lang.startsWith(language.split('-')[0])
  );

  useEffect(() => {
    if (availableVoices.length > 0 && !selectedVoice) {
      const preferredVoice = availableVoices.find(v => v.default) || availableVoices[0];
      setSelectedVoice(preferredVoice.name);
      setVoice(preferredVoice);
    }
  }, [availableVoices, selectedVoice, setVoice]);

  useEffect(() => {
    if (autoPlay && text && isSupported) {
      handlePlay();
    }
  }, [autoPlay, text, isSupported]);

  const handlePlay = () => {
    if (isPaused) {
      resume();
    } else {
      speak(text, { 
        voice: currentVoice || undefined,
        rate,
        pitch,
        volume
      });
    }
  };

  const handlePause = () => {
    pause();
  };

  const handleStop = () => {
    stop();
  };

  const handleVoiceChange = (voiceName: string) => {
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voiceName);
      setVoice(voice);
    }
  };

  if (!isSupported) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Volume2 className="h-4 w-4" />
          <span className="text-sm">Audio narration not supported in this browser</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          <span className="font-medium">Audio Narration</span>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            {/* Play/Pause/Stop Controls */}
            <div className="flex items-center gap-1">
              {!isSpeaking ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlay}
                  disabled={!text}
                >
                  <Play className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isPaused ? handlePlay : handlePause}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStop}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Settings */}
            <Popover open={showSettings} onOpenChange={setShowSettings}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voice-select">Voice</Label>
                    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} {voice.default && '(Default)'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Speed: {rate.toFixed(1)}x</Label>
                    <Slider
                      value={[rate]}
                      onValueChange={([value]) => setRate(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pitch: {pitch.toFixed(1)}</Label>
                    <Slider
                      value={[pitch]}
                      onValueChange={([value]) => setPitch(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Volume: {Math.round(volume * 100)}%</Label>
                    <Slider
                      value={[volume]}
                      onValueChange={([value]) => setVolume(value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Status Indicator */}
      {isSpeaking && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span>{isPaused ? 'Paused' : 'Playing...'}</span>
        </div>
      )}
    </Card>
  );
}