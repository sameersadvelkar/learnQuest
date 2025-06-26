import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { ProgressProvider } from "@/contexts/ProgressContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { AchievementNotification, useAchievementNotification } from "@/components/AchievementNotification";
import { useProgress } from "@/contexts/ProgressContext";
import { useEffect } from "react";
import { LoginForm } from "@/components/LoginForm";

import { SuperAdminDashboard } from "@/pages/SuperAdminDashboard";
import { FlipCardDemo } from "@/components/FlipCardDemo";
import { SchoolAdminDashboard } from "@/pages/SchoolAdminDashboard";
import { StudentDashboard } from "@/pages/StudentDashboard";
import { CoursePreview } from "@/pages/CoursePreview";
import FileBasedCourses from "@/pages/FileBasedCourses";
import SuperAdminCourseApproval from "@/pages/SuperAdminCourseApproval";

import Home from "@/pages/home";
import Course from "@/pages/course";
import CourseComplete from "@/pages/course-complete";
import { CourseIntroPage } from "@/pages/CourseIntroPage";
import { CourseExitPage } from "@/pages/CourseExitPage";
import { InteractiveDemo } from "@/pages/InteractiveDemo";
import NotFound from "@/pages/not-found";

function AchievementManager() {
  // Achievement notifications disabled to prevent automatic popups on page load
  return null;
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
      <Route path="/file-based-courses" component={FileBasedCourses} />
      <Route path="/admin/course-approval" component={SuperAdminCourseApproval} />
      <Route path="/interactive-demo" component={InteractiveDemo} />
      <Route path="*">
        {/* Role-based routing for main dashboard */}
        {state.user?.role === 'super_admin' && <SuperAdminDashboard />}
        {state.user?.role === 'admin' && <SchoolAdminDashboard />}
        {state.user?.role === 'student' && (
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/course/:courseId/intro" component={CourseIntroPage} />
            <Route path="/course/:courseId/complete" component={CourseExitPage} />
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
        <AuthProvider>
          <LanguageProvider>
            <AudioProvider>
              <SettingsProvider>
                <CourseProvider>
                  <ProgressProvider>
                    <Toaster />
                    <AchievementManager />
                    <Router />
                  </ProgressProvider>
                </CourseProvider>
              </SettingsProvider>
            </AudioProvider>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
