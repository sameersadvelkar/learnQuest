import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CourseProvider } from "@/contexts/CourseContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AchievementNotification, useAchievementNotification } from "@/components/AchievementNotification";
import { useProgress } from "@/contexts/ProgressContext";
import { useEffect } from "react";
import Home from "@/pages/home";
import Course from "@/pages/course";
import NotFound from "@/pages/not-found";

function AchievementManager() {
  const { state: progressState } = useProgress();
  const { currentAchievement, isVisible, showAchievement, hideAchievement } = useAchievementNotification();

  useEffect(() => {
    // Show achievement notification when a new achievement is earned
    if (progressState.earnedAchievements.length > 0) {
      const latestAchievementId = progressState.earnedAchievements[progressState.earnedAchievements.length - 1];
      
      // Check if this is a new achievement (simple check - in a real app you'd track this better)
      const achievements = [
        {
          id: 1,
          title: 'Getting Started',
          description: 'Complete your first activity',
          iconType: 'star',
          badgeColor: 'blue',
          criteria: null
        },
        {
          id: 2,
          title: 'Module Master',
          description: 'Complete your first module',
          iconType: 'trophy',
          badgeColor: 'gold',
          criteria: null
        },
        {
          id: 3,
          title: 'Streak Master',
          description: 'Complete activities 3 days in a row',
          iconType: 'fire',
          badgeColor: 'orange',
          criteria: null
        },
        {
          id: 4,
          title: 'Speed Learner',
          description: 'Complete 10 activities',
          iconType: 'bolt',
          badgeColor: 'purple',
          criteria: null
        }
      ];

      const achievement = achievements.find(a => a.id === latestAchievementId);
      if (achievement && !isVisible) {
        showAchievement(achievement);
      }
    }
  }, [progressState.earnedAchievements, showAchievement, isVisible]);

  return currentAchievement ? (
    <AchievementNotification
      achievement={currentAchievement}
      isVisible={isVisible}
      onClose={hideAchievement}
    />
  ) : null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/course/:courseId?" component={Course} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SettingsProvider>
          <CourseProvider>
            <ProgressProvider>
              <Toaster />
              <AchievementManager />
              <Router />
            </ProgressProvider>
          </CourseProvider>
        </SettingsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
