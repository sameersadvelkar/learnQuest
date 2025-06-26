import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SimpleAudioPlayer } from '@/components/SimpleAudioPlayer';
import { 
  Clock, 
  BookOpen, 
  Users, 
  Target, 
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';
import type { Course, Module } from '@shared/schema';

export function CourseIntroPage() {
  const { courseId } = useParams<{ courseId: string }>();

  // Fetch course data
  const { data: course, isLoading } = useQuery<Course & { modules: Module[] }>({
    queryKey: ['/api/courses', courseId, 'preview'],
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Course not found</p>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">{course.title}</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Course Introduction
          </p>
        </div>
        <div className="flex-shrink-0">
          <SimpleAudioPlayer 
            courseId={course.id} 
            pageType="intro" 
          />
        </div>
      </div>

      {/* Course Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>Course Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-semibold">{course.estimatedDuration} min</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <BookOpen className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-sm text-muted-foreground">Modules</p>
              <p className="font-semibold">{course.totalModules}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Users className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <p className="text-sm text-muted-foreground">Difficulty</p>
              <p className="font-semibold">{course.difficulty || 'Beginner'}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Target className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <p className="text-sm text-muted-foreground">Instructor</p>
              <p className="font-semibold">{course.instructorName || 'Instructor'}</p>
            </div>
          </div>

          {/* Course Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About This Course</h3>
            <p className="text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </div>


        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle>Prerequisites</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(course.prerequisites || ['Basic computer skills', 'Basic internet knowledge']).map((prerequisite, index) => (
              <li key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>{prerequisite}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {(course.learningObjectives || [
              'Understand digital wellness fundamentals',
              'Learn screen time management techniques',
              'Implement online safety best practices',
              'Develop healthy digital habits'
            ]).map((objective, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">
                  {index + 1}
                </Badge>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Course Modules Preview */}
      {course.modules && course.modules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {course.modules.map((module, index) => (
                <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Learn essential concepts and skills
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Module</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start Course Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Link href={`/course/${courseId}`}>
              <Button size="lg" className="w-full sm:w-auto">
                <Play className="h-5 w-5 mr-2" />
                Start Course
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}