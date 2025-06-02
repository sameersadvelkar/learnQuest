import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import {
  AchievementNotification,
  useAchievementNotification,
} from "@/components/AchievementNotification";
import { useProgress } from "@/contexts/ProgressContext";
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";
import { SuperAdminDashboard } from "@/pages/SuperAdminDashboard";
import { SchoolAdminDashboard } from "@/pages/SchoolAdminDashboard";
import { CoursePreview } from "@/pages/CoursePreview";
import Home from "@/pages/home";
import Course from "@/pages/course";
import CourseComplete from "@/pages/course-complete";
import NotFound from "@/pages/not-found";

function AchievementManager() {
  const { state: progressState } = useProgress();
  const { currentAchievement, isVisible, showAchievement, hideAchievement } =
    useAchievementNotification();

  useEffect(() => {
    // Show achievement notification when a new achievement is earned
    if (progressState.earnedAchievements.length > 0) {
      const latestAchievementId =
        progressState.earnedAchievements[
          progressState.earnedAchievements.length - 1
        ];

      // Check if this is a new achievement (simple check - in a real app you'd track this better)
      const achievements = [
        {
          id: 1,
          title: "Getting Started",
          description: "Complete your first activity",
          iconType: "star",
          badgeColor: "blue",
          criteria: null,
        },
        {
          id: 2,
          title: "Module Master",
          description: "Complete your first module",
          iconType: "trophy",
          badgeColor: "gold",
          criteria: null,
        },
        {
          id: 3,
          title: "Streak Master",
          description: "Complete activities 3 days in a row",
          iconType: "fire",
          badgeColor: "orange",
          criteria: null,
        },
        {
          id: 4,
          title: "Speed Learner",
          description: "Complete 10 activities",
          iconType: "bolt",
          badgeColor: "purple",
          criteria: null,
        },
      ];

      const achievement = achievements.find(
        (a) => a.id === latestAchievementId
      );
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
  const { state } = useAuth();

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!state.isAuthenticated) {
    return <LoginForm />;
  }

  // Course preview route - accessible to all authenticated users
  return (
    <Switch>
      <Route path="/course-preview/:courseId" component={CoursePreview} />
      <Route path="*">
        {/* Role-based routing for main dashboard */}
        {state.user?.role === "super_admin" && <SuperAdminDashboard />}
        {state.user?.role === "admin" && <SchoolAdminDashboard />}
        {state.user?.role === "student" && (
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/course/:courseId?" component={Course} />
            <Route path="/course-complete" component={CourseComplete} />
            <Route component={NotFound} />
          </Switch>
        )}
        {!state.user?.role && <NotFound />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <SettingsProvider>
              <CourseProvider>
                <ProgressProvider>
                  <Toaster />
                  <AchievementManager />
                  <Router />
                </ProgressProvider>
              </CourseProvider>
            </SettingsProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
