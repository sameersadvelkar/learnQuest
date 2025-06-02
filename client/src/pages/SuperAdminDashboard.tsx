import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Building2, Users, BookOpen, BarChart3, Plus, Settings, LogOut, Upload, MessageSquare, Clock, CheckCircle, XCircle, Key, FileText, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseManagement } from '@/components/CourseManagement';
import { ThemeToggle } from '@/components/ThemeToggle';

interface School {
  id: number;
  name: string;
  email: string;
  adminName: string;
  adminPassword?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  studentsCount: number;
  coursesCount: number;
  isWhiteLabelEnabled: boolean;
  isActive: boolean;
  logo?: string;
  createdAt: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  estimatedDuration: number;
  assignedSchools: number;
}

interface SupportRequest {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  schoolName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export function SuperAdminDashboard() {
  const { state, logout, hasRole } = useAuth();
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [newSchool, setNewSchool] = useState({
    name: '',
    email: '',
    adminName: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isWhiteLabelEnabled: false
  });
  const [schools, setSchools] = useState<School[]>([
    {
      id: 1,
      name: "Greenwood High School",
      email: "admin@greenwood.edu",
      adminName: "Sarah Johnson",
      adminPassword: "GHS@2024$secure",
      address: "123 Education Street",
      city: "Springfield",
      state: "California", 
      pincode: "90210",
      studentsCount: 1250,
      coursesCount: 8,
      isWhiteLabelEnabled: true,
      isActive: true,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Tech Academy",
      email: "admin@techacademy.edu",
      adminName: "Michael Chen",
      adminPassword: "TA@2024$secure",
      address: "456 Innovation Drive",
      city: "San Francisco",
      state: "California",
      pincode: "94102",
      studentsCount: 850,
      coursesCount: 12,
      isWhiteLabelEnabled: false,
      isActive: true,
      createdAt: "2024-02-20"
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: "Introduction to Computer Science",
      description: "Fundamental concepts of programming and computer science",
      totalModules: 8,
      estimatedDuration: 120,
      assignedSchools: 15
    },
    {
      id: 2,
      title: "Digital Marketing Basics",
      description: "Learn the fundamentals of digital marketing",
      totalModules: 6,
      estimatedDuration: 90,
      assignedSchools: 12
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis and visualization",
      totalModules: 10,
      estimatedDuration: 150,
      assignedSchools: 8
    }
  ]);



  const [supportRequests] = useState<SupportRequest[]>([
    {
      id: 1,
      userId: 2,
      userName: "Sarah Johnson",
      userEmail: "admin@greenwood.edu",
      schoolName: "Greenwood High School",
      subject: "Student enrollment issue",
      message: "We're having trouble enrolling new students in the Computer Science course. The assignment button seems to be unresponsive.",
      priority: "high",
      status: "open",
      createdAt: "2024-05-30T14:30:00Z",
      updatedAt: "2024-05-30T14:30:00Z"
    },
    {
      id: 2,
      userId: 3,
      userName: "Michael Chen",
      userEmail: "admin@techacademy.edu",
      schoolName: "Tech Academy",
      subject: "Course progress not updating",
      message: "Several students have completed modules but their progress isn't showing in the dashboard. This is affecting our reporting.",
      priority: "urgent",
      status: "in_progress",
      createdAt: "2024-05-30T09:15:00Z",
      updatedAt: "2024-05-30T16:45:00Z"
    },
    {
      id: 3,
      userId: 2,
      userName: "Sarah Johnson", 
      userEmail: "admin@greenwood.edu",
      schoolName: "Greenwood High School",
      subject: "Export functionality request",
      message: "Could we get an option to export student progress data in Excel format? Currently only CSV is available.",
      priority: "low",
      status: "resolved",
      createdAt: "2024-05-29T11:20:00Z",
      updatedAt: "2024-05-30T10:30:00Z"
    }
  ]);

  if (!hasRole('super_admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p>Access denied. Super Admin privileges required.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateSchool = async () => {
    if (newSchool.name && newSchool.email && newSchool.adminName && newSchool.address && newSchool.city && newSchool.state && newSchool.pincode) {
      try {
        const generatedPassword = generatePassword();
        
        const response = await fetch('/api/schools', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newSchool.name,
            email: newSchool.email,
            adminName: newSchool.adminName,
            address: newSchool.address,
            city: newSchool.city,
            state: newSchool.state,
            pincode: newSchool.pincode,
            isWhiteLabelEnabled: newSchool.isWhiteLabelEnabled,
            adminPassword: generatedPassword
          }),
        });

        if (response.ok) {
          const { school } = await response.json();
          // Add the school to our local state for immediate display
          const displaySchool: School = {
            ...school,
            adminPassword: generatedPassword,
            createdAt: new Date().toISOString().split('T')[0]
          };
          setSchools([...schools, displaySchool]);
          
          setNewSchool({ 
            name: '', 
            email: '', 
            adminName: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            isWhiteLabelEnabled: false
          });
          setIsCreatingSchool(false);
          
          const adminUsername = newSchool.adminName.toLowerCase().replace(/\s+/g, '');
          alert(`School created successfully!\n\nAdmin Credentials:\nUsername: ${adminUsername}\nPassword: ${generatedPassword}\n\nPlease save these credentials safely.`);
        } else {
          const error = await response.json();
          alert(`Failed to create school: ${error.message}`);
        }
      } catch (error) {
        console.error('Error creating school:', error);
        alert('Failed to create school. Please try again.');
      }
    }
  };

  const toggleSchoolStatus = (schoolId: number) => {
    setSchools(schools.map(school => 
      school.id === schoolId 
        ? { ...school, isActive: !school.isActive }
        : school
    ));
  };

  const toggleWhiteLabel = (schoolId: number) => {
    setSchools(schools.map(school => 
      school.id === schoolId 
        ? { ...school, isWhiteLabelEnabled: !school.isWhiteLabelEnabled }
        : school
    ));
  };

  const assignCoursesToSchool = (schoolId: number) => {
    // Logic to assign selected courses to school
    console.log(`Assigning courses ${selectedCourses} to school ${schoolId}`);
    setSelectedCourses([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Super Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage schools, courses, and platform settings</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant="default">SUPER ADMIN</Badge>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
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
                <Building2 className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Schools</p>
                  <p className="text-2xl font-bold">{schools.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{schools.reduce((sum, school) => sum + school.studentsCount, 0).toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Courses</p>
                  <p className="text-2xl font-bold">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                  <p className="text-2xl font-bold">{courses.reduce((sum, course) => sum + course.assignedSchools, 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="schools" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="schools">School Management</TabsTrigger>
            <TabsTrigger value="courses">Course Assignment</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
            <TabsTrigger value="support">Support Requests</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Schools Tab */}
          <TabsContent value="schools">
            <Card>
              <CardHeader>
                <CardTitle>School Management</CardTitle>
                <CardDescription>Manage schools and their administrators</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School Name</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schools.map((school) => (
                      <TableRow key={school.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{school.name}</p>
                            <p className="text-sm text-gray-500">{school.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{school.adminName}</p>
                            <p className="text-sm text-gray-500">{school.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{school.studentsCount.toLocaleString()}</TableCell>
                        <TableCell>{school.coursesCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={school.isActive}
                                onCheckedChange={() => toggleSchoolStatus(school.id)}
                              />
                              <span className={`text-sm font-medium ${school.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                {school.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            {school.isWhiteLabelEnabled && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                White Label
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit School Admin</DialogTitle>
                                  <DialogDescription>
                                    Update admin information for {school.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="editAdminName">Admin Name</Label>
                                    <Input
                                      id="editAdminName"
                                      defaultValue={school.adminName}
                                      placeholder="Enter admin full name"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="editAdminEmail">Admin Email</Label>
                                    <Input
                                      id="editAdminEmail"
                                      type="email"
                                      defaultValue={school.email}
                                      placeholder="admin@school.edu"
                                    />
                                  </div>
                                  <div className="flex justify-end space-x-2">
                                    <Button variant="outline">Cancel</Button>
                                    <Button>Save Changes</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-1" />
                              Import Students
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Course Assignment Tab */}
          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Assignment</CardTitle>
                <CardDescription>View course assignments and assigned schools</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Modules</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Assigned Schools</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-gray-500">{course.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>{course.totalModules}</TableCell>
                        <TableCell>{course.estimatedDuration} min</TableCell>
                        <TableCell>{course.assignedSchools} schools</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{course.title} - School Assignments</DialogTitle>
                                <DialogDescription>
                                  Schools that have been assigned this course
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4">
                                  <div className="border rounded-lg p-4">
                                    <h4 className="font-medium">Course Information</h4>
                                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                                      <div>
                                        <span className="text-gray-500">Modules:</span> {course.totalModules}
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Duration:</span> {course.estimatedDuration} min
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Difficulty:</span> {course.difficulty || 'Not set'}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-3">Assigned Schools</h4>
                                    <div className="space-y-2">
                                      {schools.filter(school => school.id <= 3).map((school) => (
                                        <div key={school.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                          <div>
                                            <p className="font-medium">{school.name}</p>
                                            <p className="text-sm text-gray-500">{school.adminName}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-sm text-gray-500">{school.studentsCount} students</p>
                                            <p className="text-xs text-green-600">Active</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
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

          {/* Course Content Management Tab */}
          <TabsContent value="content">
            <CourseManagement />
          </TabsContent>

          {/* Support Requests Tab */}
          <TabsContent value="support">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Support Requests</span>
                </CardTitle>
                <CardDescription>Manage and respond to support requests from school admins</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.subject}</p>
                            <p className="text-sm text-gray-500">From: {request.userName}</p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{request.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.schoolName}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              request.priority === 'urgent' ? 'destructive' :
                              request.priority === 'high' ? 'default' :
                              request.priority === 'medium' ? 'secondary' : 'outline'
                            }
                          >
                            {request.priority.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {request.status === 'open' && <Clock className="w-4 h-4 text-yellow-500" />}
                            {request.status === 'in_progress' && <div className="w-4 h-4 rounded-full bg-blue-500" />}
                            {request.status === 'resolved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                            {request.status === 'closed' && <XCircle className="w-4 h-4 text-gray-500" />}
                            <span className="text-sm capitalize">{request.status.replace('_', ' ')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                            <div className="text-xs text-gray-500">
                              {new Date(request.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Support Request #{request.id}</DialogTitle>
                                  <DialogDescription>
                                    From {request.userName} at {request.schoolName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Priority</Label>
                                      <Badge 
                                        variant={
                                          request.priority === 'urgent' ? 'destructive' :
                                          request.priority === 'high' ? 'default' :
                                          request.priority === 'medium' ? 'secondary' : 'outline'
                                        }
                                        className="ml-2"
                                      >
                                        {request.priority.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <div className="flex items-center space-x-2 mt-1">
                                        {request.status === 'open' && <Clock className="w-4 h-4 text-yellow-500" />}
                                        {request.status === 'in_progress' && <div className="w-4 h-4 rounded-full bg-blue-500" />}
                                        {request.status === 'resolved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        {request.status === 'closed' && <XCircle className="w-4 h-4 text-gray-500" />}
                                        <span className="text-sm capitalize">{request.status.replace('_', ' ')}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Subject</Label>
                                    <p className="mt-1 font-medium">{request.subject}</p>
                                  </div>
                                  
                                  <div>
                                    <Label>Message</Label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                      <p className="whitespace-pre-wrap">{request.message}</p>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label>Request Details</Label>
                                    <div className="mt-1 text-sm text-gray-600">
                                      <p>Created: {new Date(request.createdAt).toLocaleString()}</p>
                                      <p>School: {request.schoolName}</p>
                                      <p>Contact: {request.userName}</p>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            {request.status !== 'resolved' && request.status !== 'closed' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    Update Status
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Update Request Status</DialogTitle>
                                    <DialogDescription>
                                      Change the status for request #{request.id}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Current Status: {request.status.replace('_', ' ')}</Label>
                                    </div>
                                    <div>
                                      <Label htmlFor="newStatus">New Status</Label>
                                      <Select defaultValue={request.status}>
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="open">Open</SelectItem>
                                          <SelectItem value="in_progress">In Progress</SelectItem>
                                          <SelectItem value="resolved">Resolved</SelectItem>
                                          <SelectItem value="closed">Closed</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                      <Button variant="outline">Cancel</Button>
                                      <Button onClick={() => {
                                        // Handle status update
                                        console.log(`Update request ${request.id} status`);
                                      }}>
                                        Update Status
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onboarding Tab */}
          <TabsContent value="onboarding">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New School</CardTitle>
                  <CardDescription>Set up a new school with admin account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isCreatingSchool} onOpenChange={setIsCreatingSchool}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New School
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New School</DialogTitle>
                        <DialogDescription>Add a new school and create an admin account</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="schoolName">School Name *</Label>
                            <Input
                              id="schoolName"
                              value={newSchool.name}
                              onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                              placeholder="Enter school name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="adminEmail">Admin Email *</Label>
                            <Input
                              id="adminEmail"
                              type="email"
                              value={newSchool.email}
                              onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                              placeholder="admin@school.edu"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="adminName">Admin Name *</Label>
                          <Input
                            id="adminName"
                            value={newSchool.adminName}
                            onChange={(e) => setNewSchool({...newSchool, adminName: e.target.value})}
                            placeholder="Enter admin full name"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address">School Address *</Label>
                          <Input
                            id="address"
                            value={newSchool.address}
                            onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                            placeholder="Street address"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                              id="city"
                              value={newSchool.city}
                              onChange={(e) => setNewSchool({...newSchool, city: e.target.value})}
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                              id="state"
                              value={newSchool.state}
                              onChange={(e) => setNewSchool({...newSchool, state: e.target.value})}
                              placeholder="State"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pincode">Pincode *</Label>
                            <Input
                              id="pincode"
                              value={newSchool.pincode}
                              onChange={(e) => setNewSchool({...newSchool, pincode: e.target.value})}
                              placeholder="123456"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="whiteLabel"
                            checked={newSchool.isWhiteLabelEnabled}
                            onCheckedChange={(checked) => setNewSchool({...newSchool, isWhiteLabelEnabled: checked})}
                          />
                          <Label htmlFor="whiteLabel">Enable White Label Branding</Label>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Key className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">Admin Account</span>
                          </div>
                          <p className="text-xs text-blue-700">
                            A secure password will be automatically generated for the admin account.
                            You'll receive the credentials after creating the school.
                          </p>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsCreatingSchool(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateSchool}>
                            Create School & Admin Account
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <div className="mt-4 text-sm text-gray-500">
                    <p>• Creates school with admin account</p>
                    <p>• Generates secure credentials</p>
                    <p>• Automatically appears in School Management</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bulk Student Import</CardTitle>
                  <CardDescription>Import students from CSV file for any school</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="schoolSelect">Select School</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a school" />
                        </SelectTrigger>
                        <SelectContent>
                          {schools.filter(school => school.isActive).map((school) => (
                            <SelectItem key={school.id} value={school.id.toString()}>
                              {school.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="csvFile">CSV File</Label>
                      <Input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        className="cursor-pointer"
                      />
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">CSV Format Required</span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Columns:</strong> firstName, lastName, email, grade (optional)</p>
                        <p><strong>Example:</strong></p>
                        <div className="bg-white p-2 rounded text-xs font-mono">
                          firstName,lastName,email,grade<br/>
                          John,Smith,john.smith@email.com,10<br/>
                          Jane,Doe,jane.doe@email.com,11
                        </div>
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Students
                    </Button>
                    
                    <div className="text-xs text-gray-500">
                      <p>• Students will be isolated to the selected school</p>
                      <p>• Automatic password generation for all accounts</p>
                      <p>• Email notifications sent to new students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Active Users</span>
                      <span className="font-bold">2,456</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Course Completions</span>
                      <span className="font-bold">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Session Time</span>
                      <span className="font-bold">45 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Uptime</span>
                      <span className="font-bold text-green-600">99.9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>School Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schools.map((school) => (
                      <div key={school.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{school.name}</p>
                          <p className="text-sm text-gray-500">{school.studentsCount} students</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">85%</p>
                          <p className="text-sm text-gray-500">completion</p>
                        </div>
                      </div>
                    ))}
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