import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Zap, Target, Award, Medal } from 'lucide-react';
import { Achievement } from '@shared/schema';

interface AchievementNotificationProps {
  achievement: Achievement;
  isVisible: boolean;
  onClose: () => void;
}

export function AchievementNotification({ 
  achievement, 
  isVisible, 
  onClose 
}: AchievementNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className="w-6 h-6" />;
      case 'star':
        return <Star className="w-6 h-6" />;
      case 'bolt':
      case 'fire':
        return <Zap className="w-6 h-6" />;
      case 'target':
        return <Target className="w-6 h-6" />;
      case 'medal':
        return <Medal className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getBadgeColor = (color: string) => {
    const colorMap: Record<string, string> = {
      gold: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      silver: 'bg-gradient-to-r from-gray-300 to-gray-500',
      bronze: 'bg-gradient-to-r from-orange-400 to-orange-600',
      blue: 'bg-gradient-to-r from-blue-400 to-blue-600',
      green: 'bg-gradient-to-r from-green-400 to-green-600',
      purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
      orange: 'bg-gradient-to-r from-orange-400 to-orange-600',
    };
    return colorMap[color] || 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-500">
      <Card className="w-80 border-2 border-accent/20 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${getBadgeColor(achievement.badgeColor)} animate-pulse`}>
              {getIcon(achievement.iconType)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-gray-900">Achievement Unlocked!</h3>
                <Badge variant="secondary" className="text-xs">
                  +250 pts
                </Badge>
              </div>
              <h4 className="font-medium text-gray-800">{achievement.title}</h4>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing achievement notifications
export function useAchievementNotification() {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAchievement = (achievement: Achievement) => {
    setCurrentAchievement(achievement);
    setIsVisible(true);
  };

  const hideAchievement = () => {
    setIsVisible(false);
    setTimeout(() => setCurrentAchievement(null), 300);
  };

  return {
    currentAchievement,
    isVisible,
    showAchievement,
    hideAchievement,
  };
}
