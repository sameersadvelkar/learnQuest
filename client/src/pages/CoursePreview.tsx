import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Clock, Users, PlayCircle, FileText, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';

interface Module {
  id: number;
  title: string;
  description: string;
  duration: number;
  activities: Activity[];
  isLocked: boolean;
}

interface Activity {
  id: number;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: number;
  description: string;
}

interface CourseData {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  estimatedDuration: number;
  difficulty: string;
  prerequisites: string[];
  learningObjectives: string[];
  modules: Module[];
}

export function CoursePreview() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const courseId = params.courseId;

  // Fetch course data from API
  const { data: courseData, isLoading, error } = useQuery({
    queryKey: ['/api/courses', courseId, 'preview'],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseId}/preview`);
      if (!response.ok) {
        throw new Error('Failed to fetch course data');
      }
      return response.json();
    },
    enabled: !!courseId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p>Failed to load course data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-4 h-4" />;
      case 'reading': return <FileText className="w-4 h-4" />;
      case 'quiz': return <CheckCircle className="w-4 h-4" />;
      case 'assignment': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'reading': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'assignment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.close()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Close Preview
          </Button>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{courseData.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">
                    {courseData.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {courseData.difficulty}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">{courseData.totalModules} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">{courseData.estimatedDuration} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-sm">Self-paced learning</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Course Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {courseData.description} This course is designed for absolute beginners 
                      and will take you from having no programming knowledge to being able to 
                      write simple but functional programs. You'll learn through a combination 
                      of video lectures, reading materials, hands-on exercises, and quizzes.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Prerequisites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {courseData.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Duration</span>
                      <span className="text-sm font-medium">{courseData.estimatedDuration} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Modules</span>
                      <span className="text-sm font-medium">{courseData.totalModules}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Difficulty</span>
                      <span className="text-sm font-medium">{courseData.difficulty}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum">
            <Card>
              <CardHeader>
                <CardTitle>Course Curriculum</CardTitle>
                <CardDescription>
                  Explore the modules and activities in this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {courseData.modules.map((module) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div>
                            <h3 className="font-medium">{module.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{module.activities.length} activities</span>
                            <span>{module.duration} min</span>
                            {module.isLocked && (
                              <Badge variant="outline" className="text-xs">Locked</Badge>
                            )}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {module.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <div className={`p-2 rounded ${getActivityTypeColor(activity.type)}`}>
                                {getActivityIcon(activity.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{activity.title}</h4>
                                <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
                              </div>
                              <div className="text-xs text-gray-500">
                                {activity.duration} min
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Learning Objectives Tab */}
          <TabsContent value="objectives">
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>
                  What you'll be able to do after completing this course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseData.learningObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}