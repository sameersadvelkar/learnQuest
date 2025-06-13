import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Folder, FileText, Play, BookOpen, Clock, Users } from 'lucide-react';
import { fileContentLoader } from '@/data/fileContentLoader';

interface CourseData {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  totalPages: number;
  estimatedDuration: number;
  difficulty?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  category?: string;
  modules: string[];
}

interface ModuleData {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  totalActivities: number;
  activities: string[];
}

interface ActivityData {
  id: number;
  moduleId: number;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'quiz' | 'interactive';
  orderIndex: number;
  estimatedDuration: number;
}

export default function FileBasedCourses() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  useEffect(() => {
    loadFileBasedContent();
  }, []);

  const loadFileBasedContent = async () => {
    try {
      setLoading(true);
      const content = await fileContentLoader.loadAllContent();
      setCourses(content.courses);
      setModules(content.modules);
      setActivities(content.activities);
    } catch (error) {
      console.error('Error loading file-based content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCourseModules = (courseId: number) => {
    return modules.filter(module => module.courseId === courseId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const getModuleActivities = (moduleId: number) => {
    return activities.filter(activity => activity.moduleId === moduleId)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'reading': return <BookOpen className="w-4 h-4" />;
      case 'quiz': return <FileText className="w-4 h-4" />;
      case 'interactive': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'reading': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-yellow-100 text-yellow-800';
      case 'interactive': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-2">Loading file-based courses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File-Based Course Management</h1>
          <p className="text-gray-600 mt-2">Manage complex courses with structured modules and activities</p>
        </div>
        <Button onClick={loadFileBasedContent} variant="outline">
          <Folder className="w-4 h-4 mr-2" />
          Refresh Content
        </Button>
      </div>

      {courses.length === 0 && (
        <Alert>
          <Folder className="w-4 h-4" />
          <AlertDescription>
            No file-based courses found. Create course folders in the /courses directory to get started.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {courses.map((course) => {
          const courseModules = getCourseModules(course.id);
          const isSelected = selectedCourse === course.id;

          return (
            <Card key={course.id} className="border-2 hover:border-emerald-200 transition-colors">
              <CardHeader className="cursor-pointer" onClick={() => setSelectedCourse(isSelected ? null : course.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {course.title}
                      {course.difficulty && (
                        <Badge variant="secondary">{course.difficulty}</Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-2">{course.description}</CardDescription>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Folder className="w-4 h-4" />
                        {course.totalModules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.estimatedDuration} min
                      </span>
                      {course.category && (
                        <Badge variant="outline">{course.category}</Badge>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {isSelected ? 'Collapse' : 'Expand'}
                  </Button>
                </div>
              </CardHeader>

              {isSelected && (
                <CardContent className="pt-0">
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline">{prereq}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {course.learningObjectives && course.learningObjectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Learning Objectives:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {course.learningObjectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="font-medium">Course Structure:</h4>
                    {courseModules.map((module) => {
                      const moduleActivities = getModuleActivities(module.id);
                      
                      return (
                        <div key={module.id} className="border rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{module.title}</h5>
                            <Badge variant="secondary">{moduleActivities.length} activities</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                          
                          <div className="grid gap-2">
                            {moduleActivities.map((activity) => (
                              <div key={activity.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center gap-2">
                                  {getActivityTypeIcon(activity.type)}
                                  <span className="text-sm font-medium">{activity.title}</span>
                                  <Badge className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                                    {activity.type}
                                  </Badge>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {activity.estimatedDuration}m
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}