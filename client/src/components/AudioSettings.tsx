import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, Settings } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface AudioSettingsProps {
  className?: string;
  compact?: boolean;
}

export function AudioSettings({ className = '', compact = false }: AudioSettingsProps) {
  const { settings, toggleAutoPlay } = useAudio();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Volume2 className="h-4 w-4 text-muted-foreground" />
        <Switch
          id="autoplay-toggle"
          checked={settings.autoPlay}
          onCheckedChange={toggleAutoPlay}
        />
        <Label htmlFor="autoplay-toggle" className="text-sm">
          Auto-play audio
        </Label>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoplay-setting" className="text-sm font-medium">
                  Auto-play audio for all course pages
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Automatically start audio narration when entering course pages
                </p>
              </div>
              <Switch
                id="autoplay-setting"
                checked={settings.autoPlay}
                onCheckedChange={toggleAutoPlay}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}