import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCourse } from '@/contexts/CourseContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { 
  Trophy, 
  Star, 
  CheckCircle, 
  Home, 
  Download, 
  Share2,
  Award
} from 'lucide-react';

export default function CourseComplete() {
  const [location, setLocation] = useLocation();
  const { state: courseState } = useCourse();
  const { progressState } = useProgressTracking();

  const handleGoHome = () => {
    setLocation('/');
  };

  const handleDownloadCertificate = () => {
    // Add certificate download logic here
    console.log('Download certificate');
  };

  const handleShareAchievement = () => {
    // Add share functionality here
    console.log('Share achievement');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Congratulations Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-600">
            You've successfully completed the course
          </p>
          <h2 className="text-2xl font-semibold text-blue-600 mt-2">
            {courseState.currentCourse?.title || 'React Fundamentals'}
          </h2>
        </div>

        {/* Achievement Stats */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Your Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{progressState.completedActivities.size}</div>
                <div className="text-sm text-gray-600">Activities Completed</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{progressState.totalPoints}</div>
                <div className="text-sm text-gray-600">Points Earned</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{progressState.earnedAchievements.length}</div>
                <div className="text-sm text-gray-600">Badges Earned</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Course Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Download Your Certificate</div>
                  <div className="text-sm text-gray-600">Get your completion certificate to showcase your achievement</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Explore More Courses</div>
                  <div className="text-sm text-gray-600">Continue your learning journey with advanced topics</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Join Our Community</div>
                  <div className="text-sm text-gray-600">Connect with other learners and share your experience</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadCertificate}
            className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </Button>
          <Button
            onClick={handleShareAchievement}
            variant="outline"
            className="flex items-center justify-center"
            size="lg"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share Achievement
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex items-center justify-center"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Motivational Message */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-lg">
          <p className="text-gray-700 italic">
            "The beautiful thing about learning is that no one can take it away from you."
          </p>
          <p className="text-sm text-gray-500 mt-2">- B.B. King</p>
        </div>
      </div>
    </div>
  );
}