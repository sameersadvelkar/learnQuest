import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, CheckCircle, Home, Award, Book } from 'lucide-react';
import { useCourse } from '@/contexts/CourseContext';

export function CourseExitPage() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/course/:courseId/complete');
  const { state: courseState } = useCourse();

  const courseId = params?.courseId;
  const currentCourse = courseState.courses.find(c => c.id === Number(courseId));

  useEffect(() => {
    // Ensure we're only on this page if the course is actually completed
    if (!currentCourse) {
      setLocation('/');
    }
  }, [currentCourse, setLocation]);

  if (!currentCourse) {
    return null;
  }

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <Book className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">
                  {currentCourse.title}
                </h1>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoHome}
              className="flex items-center space-x-2 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="w-12 h-12 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Congratulations! 🎉
            </h1>
            
            <p className="text-xl text-gray-700 mb-2">
              You have successfully completed the
            </p>
            
            <h2 className="text-3xl font-bold text-green-600 mb-6">
              {currentCourse.title}
            </h2>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              You've demonstrated excellent commitment to digital wellness and safety. 
              The knowledge and skills you've gained will help you navigate the digital world more confidently.
            </p>
          </div>

          {/* Progress Summary Card */}
          <Card className="mb-8 shadow-lg border-green-200">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Course Progress Summary
                </h3>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Course Completion</span>
                  <span className="text-sm font-bold text-green-600">100%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-1000 animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {currentCourse.totalModules || 5}
                  </div>
                  <div className="text-sm text-gray-600">Modules Completed</div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {currentCourse.estimatedDuration || 75}
                  </div>
                  <div className="text-sm text-gray-600">Minutes of Learning</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    Expert
                  </div>
                  <div className="text-sm text-gray-600">Skill Level Achieved</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Your Achievements
              </h3>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-green-100 text-green-800 border-green-200">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Course Completed
                </Badge>
                
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-blue-100 text-blue-800 border-blue-200">
                  <Award className="w-4 h-4 mr-2" />
                  Digital Safety Expert
                </Badge>
                
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-purple-100 text-purple-800 border-purple-200">
                  <Star className="w-4 h-4 mr-2" />
                  Knowledge Master
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="shadow-lg border-green-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  What's Next?
                </h3>
                
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Continue your learning journey by exploring more courses or practicing 
                  what you've learned in real-world scenarios.
                </p>

                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Use the Dashboard button in the top navigation to explore more learning opportunities
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-10 opacity-20">
            <Star className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-40 right-20 opacity-20">
            <Trophy className="w-8 h-8 text-green-400" />
          </div>
          <div className="absolute bottom-40 left-20 opacity-20">
            <Award className="w-7 h-7 text-blue-400" />
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}