import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, User, Target, CheckCircle, PlayCircle } from 'lucide-react';
import { SimpleAudioPlayer } from '@/components/SimpleAudioPlayer';
import { CourseImage } from '@/components/JSONImageRenderer';



interface CourseIntroSectionProps {
  course: {
    id: number;
    title: string;
    description: string;
    instructorName?: string | null;
    estimatedDuration: number;
    difficulty?: string | null;
    prerequisites?: string[] | null;
    learningObjectives?: string[] | null;
    totalModules: number;
    totalPages: number;
  };
  modules?: Array<{
    id: number;
    title: string;
    totalActivities?: number;
  }>;
  onStartCourse: () => void;
  className?: string;
}

export function CourseIntroSection({ 
  course, 
  modules = [], 
  onStartCourse, 
  className = '' 
}: CourseIntroSectionProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 ${className}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Audio Player Section - Top of Media */}
        <div className="flex justify-end mb-6">
          <div className="p-2">
            <SimpleAudioPlayer 
              courseId={course.id} 
              pageType="intro" 
            />
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative w-full h-80 md:h-96 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 rounded-3xl overflow-hidden shadow-2xl mb-12">
          <CourseImage 
            course={course}
            imageType="hero"
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          
          {/* Fallback placeholder (hidden by default) */}
          <div className="hero-placeholder absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-indigo-600/20 backdrop-blur-sm items-center justify-center hidden">
            <div className="text-center text-white">
              <BookOpen className="h-24 w-24 mx-auto mb-4 opacity-60" />
              <p className="text-xl font-semibold opacity-80">Course Hero Image</p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <PlayCircle className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Course Header */}
        <div className="text-center space-y-8">



          {/* Course Title and Description */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              {course.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium">
              {course.description}
            </p>
          </div>
        </div>

        {/* Course Metadata Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-2xl text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Instructor</h3>
              <p className="text-emerald-100 text-lg font-medium">
                {course.instructorName || 'Course Instructor'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Duration</h3>
              <p className="text-blue-100 text-lg font-medium">{course.estimatedDuration} minutes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 border-0 shadow-2xl text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Difficulty</h3>
              <Badge className="bg-white/20 text-white hover:bg-white/30 text-lg px-4 py-2 font-semibold">
                {course.difficulty || 'Intermediate'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Course Structure */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Course Structure</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-8">
              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{course.totalModules}</div>
                  <div className="text-purple-800 font-semibold">Total Modules</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">{course.totalPages}</div>
                  <div className="text-indigo-800 font-semibold">Total Activities</div>
                </div>
              </div>
              
              {/* Module Preview */}
              {modules.length > 0 && (
                <div className="space-y-6">
                  <h4 className="text-2xl font-bold text-center text-gray-800">Module Preview</h4>
                  <div className="grid gap-4">
                    {modules.slice(0, 3).map((module, index) => (
                      <div key={module.id} className="flex items-center gap-4 p-6 bg-gradient-to-r from-white to-gray-50 rounded-2xl border-l-4 border-gradient-to-b from-emerald-500 to-blue-500 shadow-lg transform hover:scale-102 transition-all duration-300">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-800 mb-1">{module.title}</p>
                          <p className="text-sm text-gray-600 font-medium">
                            {module.totalActivities || 0} activities
                          </p>
                        </div>
                        <CheckCircle className="h-6 w-6 text-emerald-500" />
                      </div>
                    ))}
                    {modules.length > 3 && (
                      <div className="text-center py-4 px-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                        <p className="text-lg font-semibold text-gray-600">
                          +{modules.length - 3} more modules to discover
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Start Course Button */}
        <div className="flex justify-center pt-8">
          <Button
            size="lg"
            onClick={onStartCourse}
            className="min-w-[300px] h-16 bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 hover:from-emerald-700 hover:via-blue-700 hover:to-indigo-700 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 text-xl font-bold rounded-2xl"
          >
            <PlayCircle className="h-8 w-8 mr-3" />
            Start Your Journey
          </Button>
        </div>
      </div>
    </div>
  );
}