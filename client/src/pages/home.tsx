import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { sampleCourse, sampleModules, sampleActivities } from '@/data/courseContent';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Play, 
  CheckCircle,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';

export default function Home() {
  const { state: courseState, dispatch } = useCourse();
  const { progressState, getCourseProgress } = useProgressTracking();

  useEffect(() => {
    // Initialize with sample course data
    dispatch({ type: 'SET_COURSE', payload: sampleCourse });
    dispatch({ type: 'SET_MODULES', payload: sampleModules });
    dispatch({ type: 'SET_ACTIVITIES', payload: sampleActivities });
  }, [dispatch]);

  const courseProgress = getCourseProgress();
  const completedActivities = progressState.completedActivities.size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">EduQuest</h1>
              <p className="text-sm text-muted-foreground">Gamified Learning Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground">
                {progressState.totalPoints} pts
              </span>
            </div>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back to your learning journey!
          </h2>
          <p className="text-muted-foreground">
            Continue where you left off and master new skills with our interactive courses.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Course Progress</p>
                  <p className="text-2xl font-bold text-foreground">{courseProgress}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-foreground">{completedActivities}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-2xl font-bold text-foreground">{progressState.totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold text-foreground">{progressState.streak} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Course */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Continue Learning</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=100" 
                      alt="React course"
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-1">
                        {courseState.currentCourse?.title || 'React Mastery Course'}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {courseState.currentCourse?.description || 'Master React development from basics to advanced concepts'}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{Math.floor((courseState.currentCourse?.estimatedDuration || 480) / 60)}h total</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>1,234 students</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-primary">{courseProgress}%</span>
                    </div>
                    <Progress value={courseProgress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{completedActivities} of {courseState.currentCourse?.totalPages || 12} completed</span>
                      <span>~{Math.max(0, Math.ceil(((courseState.currentCourse?.totalPages || 12) - completedActivities) * 15))}min left</span>
                    </div>
                  </div>

                  <Link href="/course">
                    <Button className="w-full flex items-center space-x-2">
                      <Play className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressState.completedActivities.size === 0 ? (
                    <div className="text-center py-6">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No activities completed yet</p>
                      <p className="text-sm text-muted-foreground">Start your first lesson to see your progress here</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/5 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-secondary" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Completed "What is React?"</p>
                          <p className="text-xs text-muted-foreground">Module 1 • 2 hours ago</p>
                        </div>
                        <Badge variant="secondary">+100 pts</Badge>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-accent/5 rounded-lg">
                        <Trophy className="w-5 h-5 text-accent" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">Achievement Unlocked: Getting Started</p>
                          <p className="text-xs text-muted-foreground">First activity completed</p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground">+250 pts</Badge>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {progressState.earnedAchievements.length === 0 ? (
                    <div className="text-center py-4">
                      <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No achievements yet</p>
                      <p className="text-xs text-muted-foreground">Complete activities to earn badges!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {progressState.earnedAchievements.map((achievementId) => (
                        <div
                          key={achievementId}
                          className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center"
                          title="Achievement earned!"
                        >
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5" />
                  <span>Learning Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {progressState.streak}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {progressState.streak === 1 ? 'day' : 'days'} in a row
                  </p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(7)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full ${
                          index < progressState.streak 
                            ? 'bg-orange-500' 
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep learning daily to maintain your streak!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Study Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Study Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This week</span>
                    <span className="font-medium">2h 45m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total time</span>
                    <span className="font-medium">12h 30m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average per day</span>
                    <span className="font-medium">25m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
