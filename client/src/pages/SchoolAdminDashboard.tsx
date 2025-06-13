import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, Users, BookOpen, Clock, TrendingUp, Download, MessageCircle, LogOut, Building2, Activity, Award, Star, Plus } from 'lucide-react';
import { ContactSupportDialog } from '@/components/ContactSupportDialog';

import { AnimatedStats, ProgressRing } from '@/components/AnimatedStats';
import { InteractiveCard } from '@/components/InteractiveCard';
import { AdminHeaderDropdown } from '@/components/AdminHeaderDropdown';
import { SkeletonStats } from '@/components/LoadingStates';

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  enrolledCourses: Course[];
  completionRate: number;
  timeSpent: number; // in hours
  lastActive: string;
  status: 'active' | 'inactive';
}

interface Course {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  estimatedDuration: number;
  isAssigned: boolean;
}

interface ProgressData {
  studentId: number;
  courseId: number;
  completionRate: number;
  timeSpent: number;
  lastAccessed: string;
}

export function SchoolAdminDashboard() {
  const { state, logout, hasRole } = useAuth();
  const [filterName, setFilterName] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Mock school data - in real app this would come from API
  const schoolData = {
    name: "Greenwood High School",
    logo: null,
    isWhiteLabelEnabled: true
  };

  const [students] = useState<Student[]>([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@greenwood.edu",
      grade: "Grade 10",
      enrolledCourses: [
        { id: 1, title: "Introduction to Computer Science", description: "", totalModules: 8, estimatedDuration: 120, isAssigned: true },
        { id: 2, title: "Digital Marketing Basics", description: "", totalModules: 6, estimatedDuration: 90, isAssigned: true }
      ],
      completionRate: 85,
      timeSpent: 45,
      lastActive: "2024-05-30",
      status: 'active'
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@greenwood.edu", 
      grade: "Grade 11",
      enrolledCourses: [
        { id: 1, title: "Introduction to Computer Science", description: "", totalModules: 8, estimatedDuration: 120, isAssigned: true }
      ],
      completionRate: 92,
      timeSpent: 38,
      lastActive: "2024-05-31",
      status: 'active'
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@greenwood.edu",
      grade: "Grade 9",
      enrolledCourses: [
        { id: 2, title: "Digital Marketing Basics", description: "", totalModules: 6, estimatedDuration: 90, isAssigned: true }
      ],
      completionRate: 67,
      timeSpent: 22,
      lastActive: "2024-05-28",
      status: 'inactive'
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@greenwood.edu",
      grade: "Grade 12",
      enrolledCourses: [
        { id: 1, title: "Introduction to Computer Science", description: "", totalModules: 8, estimatedDuration: 120, isAssigned: true },
        { id: 3, title: "Data Science Fundamentals", description: "", totalModules: 10, estimatedDuration: 150, isAssigned: true }
      ],
      completionRate: 78,
      timeSpent: 56,
      lastActive: "2024-05-31",
      status: 'active'
    }
  ]);

  const [availableCourses] = useState<Course[]>([
    { id: 1, title: "Introduction to Computer Science", description: "Fundamental concepts of programming", totalModules: 8, estimatedDuration: 120, isAssigned: true },
    { id: 2, title: "Digital Marketing Basics", description: "Learn digital marketing fundamentals", totalModules: 6, estimatedDuration: 90, isAssigned: true },
    { id: 3, title: "Data Science Fundamentals", description: "Introduction to data analysis", totalModules: 10, estimatedDuration: 150, isAssigned: true },
    { id: 4, title: "Web Development Basics", description: "HTML, CSS, and JavaScript fundamentals", totalModules: 12, estimatedDuration: 180, isAssigned: false }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [coursesToAssign, setCoursesToAssign] = useState<number[]>([]);

  if (!hasRole('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p>Access denied. School Admin privileges required.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredStudents = students.filter(student => {
    const nameMatch = student.name.toLowerCase().includes(filterName.toLowerCase());
    const courseMatch = filterCourse === '' || student.enrolledCourses.some(course => 
      course.title.toLowerCase().includes(filterCourse.toLowerCase())
    );
    const statusMatch = filterStatus === '' || filterStatus === 'all' || student.status === filterStatus;
    return nameMatch && courseMatch && statusMatch;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Grade', 'Completion Rate', 'Time Spent (hrs)', 'Last Active', 'Status'];
    const csvData = filteredStudents.map(student => [
      student.name,
      student.email,
      student.grade,
      `${student.completionRate}%`,
      student.timeSpent,
      student.lastActive,
      student.status
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_progress.csv';
    a.click();
  };

  const assignCoursesToStudent = (studentId: number) => {
    console.log(`Assigning courses ${coursesToAssign} to student ${studentId}`);
    setCoursesToAssign([]);
    setSelectedStudent(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm border-b" style={{ background: 'linear-gradient(135deg, #0097b2 0%, #7bbe84 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {schoolData.isWhiteLabelEnabled && schoolData.logo && (
                <img src={schoolData.logo} alt="School Logo" className="h-10 w-10 rounded-full bg-white/20 p-1" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {schoolData.isWhiteLabelEnabled ? schoolData.name : "School Admin Dashboard"}
                </h1>
                <p className="text-white/80">Manage students and track their progress</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ContactSupportDialog />
              <AdminHeaderDropdown 
                userRole="admin" 
                username="School Admin"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Courses</p>
                  <p className="text-2xl font-bold">{availableCourses.filter(c => c.isAssigned).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Completion</p>
                  <p className="text-2xl font-bold">
                    {Math.round(students.reduce((sum, s) => sum + s.completionRate, 0) / students.length)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Time Spent</p>
                  <p className="text-2xl font-bold">{students.reduce((sum, s) => sum + s.timeSpent, 0)}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3" style={{ backgroundColor: '#05aa6d' }}>
            <TabsTrigger value="students" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/20">Student Management</TabsTrigger>
            <TabsTrigger value="courses" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/20">Course Assignment</TabsTrigger>
            <TabsTrigger value="progress" className="text-white data-[state=active]:text-white data-[state=active]:bg-white/20">Progress Tracking</TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Student Management</CardTitle>
                    <CardDescription>View and manage all students in your school</CardDescription>
                  </div>
                  <Button onClick={exportToCSV} className="text-white btn-green-hover" style={{ backgroundColor: '#05aa6d' }}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="filterName">Filter by Name</Label>
                    <Input
                      id="filterName"
                      placeholder="Search student name..."
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="filterCourse">Filter by Course</Label>
                    <Input
                      id="filterCourse"
                      placeholder="Search course name..."
                      value={filterCourse}
                      onChange={(e) => setFilterCourse(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="filterStatus">Filter by Status</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Student Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Enrolled Courses</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Time Spent</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.grade}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            {student.enrolledCourses.map((course) => (
                              <Badge key={course.id} variant="outline" className="text-xs">
                                {course.title}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${student.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm">{student.completionRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.timeSpent}h</TableCell>
                        <TableCell>{student.lastActive}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-2 hover:bg-green-50"
                                style={{ borderColor: '#05aa6d', color: '#05aa6d' }}
                                onClick={() => setSelectedStudent(student)}
                              >
                                Assign Courses
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Assign Courses to {student.name}</DialogTitle>
                                <DialogDescription>Select courses to assign to this student</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {availableCourses.filter(c => c.isAssigned).map((course) => (
                                  <div key={course.id} className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      id={`assign-course-${course.id}`}
                                      checked={coursesToAssign.includes(course.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setCoursesToAssign([...coursesToAssign, course.id]);
                                        } else {
                                          setCoursesToAssign(coursesToAssign.filter(id => id !== course.id));
                                        }
                                      }}
                                    />
                                    <label htmlFor={`assign-course-${course.id}`} className="text-sm">
                                      {course.title}
                                    </label>
                                  </div>
                                ))}
                                <Button 
                                  onClick={() => assignCoursesToStudent(student.id)}
                                  disabled={coursesToAssign.length === 0}
                                  className="w-full text-white btn-green-hover"
                                  style={{ backgroundColor: '#05aa6d' }}
                                >
                                  Assign Selected Courses
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Available Courses</CardTitle>
                <CardDescription>Courses assigned to your school</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Enrolled Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableCourses.filter(c => c.isAssigned).map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.description}</TableCell>
                        <TableCell>{course.totalModules}</TableCell>
                        <TableCell>{course.estimatedDuration} min</TableCell>
                        <TableCell>
                          {students.filter(s => 
                            s.enrolledCourses.some(c => c.id === course.id)
                          ).length}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-2 hover:bg-green-50"
                            style={{ borderColor: '#05aa6d', color: '#05aa6d' }}
                            onClick={() => window.open(`/course-preview/${course.id}`, '_blank')}
                          >
                            Preview Course
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Class Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Students Above 80% Completion</span>
                      <span className="font-bold">
                        {students.filter(s => s.completionRate >= 80).length} / {students.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Time per Student</span>
                      <span className="font-bold">
                        {Math.round(students.reduce((sum, s) => sum + s.timeSpent, 0) / students.length)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Most Popular Course</span>
                      <span className="font-bold">Computer Science</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Students This Week</span>
                      <span className="font-bold">
                        {students.filter(s => s.status === 'active').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Alice Johnson</p>
                        <p className="text-sm text-gray-500">Completed Module 3</p>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Bob Smith</p>
                        <p className="text-sm text-gray-500">Started new course</p>
                      </div>
                      <span className="text-sm text-gray-500">4 hours ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">David Wilson</p>
                        <p className="text-sm text-gray-500">Submitted assignment</p>
                      </div>
                      <span className="text-sm text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}