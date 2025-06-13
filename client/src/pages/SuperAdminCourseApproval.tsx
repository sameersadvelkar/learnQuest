import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Eye, FileText, Users, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  estimatedDuration: number;
  difficulty: string;
  category: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived';
  sourceType: 'database' | 'file_based';
  sourceIdentifier?: string;
  createdAt: string;
  approvedBy?: number;
  approvedAt?: string;
  publishedAt?: string;
}

interface School {
  id: number;
  name: string;
  studentsCount: number;
  isActive: boolean;
}

export default function SuperAdminCourseApproval() {
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assignmentMode, setAssignmentMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCourseData();
    loadSchoolData();
  }, []);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      // Simulate different course statuses
      const mockPendingCourses: Course[] = [
        {
          id: 101,
          title: "React Fundamentals",
          description: "Master React components, props, state, and hooks",
          totalModules: 4,
          estimatedDuration: 360,
          difficulty: "Beginner",
          category: "Frontend Development",
          status: "pending_approval",
          sourceType: "file_based",
          sourceIdentifier: "react-fundamentals",
          createdAt: "2024-01-15T00:00:00.000Z"
        },
        {
          id: 102,
          title: "JavaScript Essentials",
          description: "JavaScript fundamentals and modern ES6+ features",
          totalModules: 3,
          estimatedDuration: 240,
          difficulty: "Beginner",
          category: "Programming",
          status: "pending_approval",
          sourceType: "file_based",
          sourceIdentifier: "javascript-essentials",
          createdAt: "2024-01-20T00:00:00.000Z"
        }
      ];

      const mockApprovedCourses: Course[] = [
        {
          id: 1,
          title: "Introduction to Web Development",
          description: "Learn HTML, CSS, and JavaScript basics",
          totalModules: 3,
          estimatedDuration: 180,
          difficulty: "Beginner",
          category: "Frontend",
          status: "approved",
          sourceType: "database",
          createdAt: "2024-01-10T00:00:00.000Z",
          approvedBy: 1,
          approvedAt: "2024-01-12T00:00:00.000Z"
        }
      ];

      const mockPublishedCourses: Course[] = [
        {
          id: 2,
          title: "Python Programming Fundamentals",
          description: "Master Python basics and build applications",
          totalModules: 4,
          estimatedDuration: 240,
          difficulty: "Beginner",
          category: "Backend",
          status: "published",
          sourceType: "database",
          createdAt: "2024-01-05T00:00:00.000Z",
          approvedBy: 1,
          approvedAt: "2024-01-07T00:00:00.000Z",
          publishedAt: "2024-01-08T00:00:00.000Z"
        }
      ];

      setPendingCourses(mockPendingCourses);
      setApprovedCourses(mockApprovedCourses);
      setPublishedCourses(mockPublishedCourses);
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: "Error",
        description: "Failed to load course data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSchoolData = async () => {
    const mockSchools: School[] = [
      { id: 1, name: "Tech High School", studentsCount: 850, isActive: true },
      { id: 2, name: "Innovation Academy", studentsCount: 1200, isActive: true },
      { id: 3, name: "Digital Learning Center", studentsCount: 600, isActive: true },
      { id: 4, name: "Future Skills Institute", studentsCount: 950, isActive: true }
    ];
    setSchools(mockSchools);
  };

  const approveCourse = async (courseId: number) => {
    try {
      // Find course in pending list
      const course = pendingCourses.find(c => c.id === courseId);
      if (!course) return;

      // Move to approved list
      const approvedCourse = {
        ...course,
        status: 'approved' as const,
        approvedBy: 1,
        approvedAt: new Date().toISOString()
      };

      setPendingCourses(prev => prev.filter(c => c.id !== courseId));
      setApprovedCourses(prev => [...prev, approvedCourse]);

      toast({
        title: "Course Approved",
        description: `${course.title} has been approved and is ready for publication.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve course",
        variant: "destructive"
      });
    }
  };

  const publishCourse = async (courseId: number) => {
    try {
      // Find course in approved list
      const course = approvedCourses.find(c => c.id === courseId);
      if (!course) return;

      // Move to published list
      const publishedCourse = {
        ...course,
        status: 'published' as const,
        publishedAt: new Date().toISOString()
      };

      setApprovedCourses(prev => prev.filter(c => c.id !== courseId));
      setPublishedCourses(prev => [...prev, publishedCourse]);

      toast({
        title: "Course Published",
        description: `${course.title} is now available for assignment to schools.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish course",
        variant: "destructive"
      });
    }
  };

  const rejectCourse = async (courseId: number) => {
    try {
      const course = pendingCourses.find(c => c.id === courseId);
      if (!course) return;

      setPendingCourses(prev => prev.filter(c => c.id !== courseId));

      toast({
        title: "Course Rejected",
        description: `${course.title} has been rejected and returned to developers.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject course",
        variant: "destructive"
      });
    }
  };

  const assignCourseToSchool = async (courseId: number, schoolId: number) => {
    try {
      const course = publishedCourses.find(c => c.id === courseId);
      const school = schools.find(s => s.id === schoolId);
      
      if (!course || !school) return;

      toast({
        title: "Course Assigned",
        description: `${course.title} has been assigned to ${school.name}.`
      });
      
      setAssignmentMode(false);
      setSelectedCourse(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign course to school",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'published':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Eye className="w-3 h-3 mr-1" />Published</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSourceTypeBadge = (sourceType: string) => {
    return sourceType === 'file_based' 
      ? <Badge variant="secondary"><FileText className="w-3 h-3 mr-1" />File-Based</Badge>
      : <Badge variant="outline">Database</Badge>;
  };

  const CourseCard = ({ course, actions }: { course: Course; actions: React.ReactNode }) => (
    <Card className="border-2 hover:border-emerald-200 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {course.title}
              {getStatusBadge(course.status)}
              {getSourceTypeBadge(course.sourceType)}
            </CardTitle>
            <CardDescription className="mt-2">{course.description}</CardDescription>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
          <span>{course.totalModules} modules</span>
          <span>{course.estimatedDuration} min</span>
          <span>{course.difficulty}</span>
          <Badge variant="outline">{course.category}</Badge>
        </div>

        {course.sourceType === 'file_based' && course.sourceIdentifier && (
          <div className="mt-2 text-xs text-gray-500">
            Source: /courses/{course.sourceIdentifier}/
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created: {new Date(course.createdAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            {actions}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-2">Loading course data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Approval & Management</h1>
          <p className="text-gray-600 mt-2">Review and approve courses from developers, then assign to schools</p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending Review ({pendingCourses.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Approved ({approvedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="published" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Published ({publishedCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Alert>
            <Clock className="w-4 h-4" />
            <AlertDescription>
              These courses are waiting for your approval. Review content and approve for publication.
            </AlertDescription>
          </Alert>
          
          {pendingCourses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No courses pending approval
              </CardContent>
            </Card>
          ) : (
            pendingCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                actions={
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(`/file-based-courses`, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => approveCourse(course.id)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => rejectCourse(course.id)}
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </>
                }
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Approved courses ready for publication. Publish to make them available for school assignment.
            </AlertDescription>
          </Alert>
          
          {approvedCourses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No approved courses waiting for publication
              </CardContent>
            </Card>
          ) : (
            approvedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                actions={
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => publishCourse(course.id)}
                    className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Publish
                  </Button>
                }
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <Alert>
            <Eye className="w-4 h-4" />
            <AlertDescription>
              Published courses available for assignment to schools. School admins can assign these to their students.
            </AlertDescription>
          </Alert>
          
          {assignmentMode && selectedCourse && (
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle>Assign "{selectedCourse.title}" to Schools</CardTitle>
                <CardDescription>Select schools to assign this course to their students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {schools.map(school => (
                    <div key={school.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{school.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {school.studentsCount} students
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => assignCourseToSchool(selectedCourse.id, school.id)}
                      >
                        Assign Course
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => setAssignmentMode(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {publishedCourses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No published courses available
              </CardContent>
            </Card>
          ) : (
            publishedCourses.map(course => (
              <CourseCard
                key={course.id}
                course={course}
                actions={
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course);
                      setAssignmentMode(true);
                    }}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Building className="w-4 h-4 mr-1" />
                    Assign to Schools
                  </Button>
                }
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}