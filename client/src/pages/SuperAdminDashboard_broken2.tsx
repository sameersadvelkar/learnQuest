import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Building2, Users, BookOpen, BarChart3, Plus, Settings, LogOut, Upload, MessageSquare, Clock, CheckCircle, XCircle, Key, FileText, Edit, TrendingUp, Star, Award, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { AnimatedStats, ProgressRing } from '@/components/AnimatedStats';
import { InteractiveCard, StatsGrid } from '@/components/InteractiveCard';
import { AdminHeaderDropdown } from '@/components/AdminHeaderDropdown';
import { SkeletonStats, SkeletonCard } from '@/components/LoadingStates';

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
  difficulty?: string;
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
  const [activeTab, setActiveTab] = useState('schools');
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
      adminPassword: "TechAdmin@2024",
      address: "456 Innovation Drive",
      city: "San Jose",
      state: "California",
      pincode: "95110",
      studentsCount: 890,
      coursesCount: 12,
      isWhiteLabelEnabled: false,
      isActive: true,
      createdAt: "2024-02-20"
    },
    {
      id: 3,
      name: "Riverside School",
      email: "admin@riverside.edu",
      adminName: "Emily Davis",
      adminPassword: "Riverside#2024",
      address: "789 Academic Lane",
      city: "Austin",
      state: "Texas",
      pincode: "73301",
      studentsCount: 650,
      coursesCount: 6,
      isWhiteLabelEnabled: true,
      isActive: true,
      createdAt: "2024-03-10"
    }
  ]);

  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: "Computer Science Fundamentals",
      description: "Learn the basics of programming and computer science",
      totalModules: 8,
      estimatedDuration: 120,
      assignedSchools: 15,
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Digital Marketing Basics",
      description: "Learn the fundamentals of digital marketing",
      totalModules: 6,
      estimatedDuration: 90,
      assignedSchools: 12,
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis and visualization",
      totalModules: 10,
      estimatedDuration: 150,
      assignedSchools: 8,
      difficulty: "Intermediate"
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
      userId: 4,
      userName: "Emily Davis",
      userEmail: "admin@riverside.edu",
      schoolName: "Riverside School",
      subject: "White label customization",
      message: "We would like to customize our school's branding and colors. Could you guide us through the white label setup process?",
      priority: "medium",
      status: "resolved",
      createdAt: "2024-05-29T11:20:00Z",
      updatedAt: "2024-05-30T10:30:00Z"
    }
  ]);

  const sidebarItems = [
    { id: 'schools', label: 'School Management', icon: Building2 },
    { id: 'courses', label: 'Course Assignment', icon: BookOpen },
    { id: 'approval', label: 'Course Approval', icon: CheckCircle },
    { id: 'content', label: 'Course Content', icon: FileText },
    { id: 'support', label: 'Support Requests', icon: MessageSquare },
    { id: 'onboarding', label: 'Onboarding', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingSchool(true);
    
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchool)
      });

      if (response.ok) {
        const school = await response.json();
        setNewSchool({
          name: '',
          email: '',
          adminName: '',
          location: '',
          studentsCount: 0,
          address: '',
          phone: '',
          city: '',
          state: '',
          pincode: '',
          isWhiteLabelEnabled: false
        });
        setIsCreatingSchool(false);
      }
    } catch (error) {
      console.error('Error creating school:', error);
    }
  };

  const renderSchoolsContent = () => (
    <div>
      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <InteractiveCard
          title="System Performance"
          description="Real-time system metrics"
          icon={Activity}
          variant="default"
          className="fade-in-up"
        >
          <div className="flex items-center justify-center">
            <ProgressRing
              progress={98.5}
              size={120}
              color="#10b981"
              label="Performance"
            />
          </div>
        </InteractiveCard>

        <InteractiveCard
          title="Platform Overview"
          description="Key platform statistics"
          icon={TrendingUp}
          variant="gradient"
          className="fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Active Schools</span>
              <span className="font-semibold">{schools.filter(s => s.isActive).length}/{schools.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">White Label</span>
              <span className="font-semibold">{schools.filter(s => s.isWhiteLabelEnabled).length} enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Students/School</span>
              <span className="font-semibold">{Math.round(schools.reduce((sum, s) => sum + s.studentsCount, 0) / schools.length)}</span>
            </div>
          </div>
        </InteractiveCard>

        <InteractiveCard
          title="Recent Activity"
          description="Latest platform updates"
          icon={Clock}
          className="fade-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">New school registered</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Course assignment updated</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">System maintenance completed</span>
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* School Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>School Management</CardTitle>
              <CardDescription>Manage schools and their administrators</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add School
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New School</DialogTitle>
                  <DialogDescription>Add a new school to the platform</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSchool} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">School Name</Label>
                      <Input
                        id="name"
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">School Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newSchool.email}
                        onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminName">Admin Name</Label>
                      <Input
                        id="adminName"
                        value={newSchool.adminName}
                        onChange={(e) => setNewSchool({...newSchool, adminName: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newSchool.location}
                        onChange={(e) => setNewSchool({...newSchool, location: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="whiteLabel"
                      checked={newSchool.isWhiteLabelEnabled}
                      onCheckedChange={(checked) => 
                        setNewSchool({...newSchool, isWhiteLabelEnabled: checked})
                      }
                    />
                    <Label htmlFor="whiteLabel">Enable White Label</Label>
                  </div>
                  <Button type="submit" disabled={isCreatingSchool} className="bg-green-600 hover:bg-green-700">
                    {isCreatingSchool ? 'Creating...' : 'Create School'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
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
                <TableHead>White Label</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-gray-500">{school.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{school.adminName}</p>
                      <p className="text-sm text-gray-500">{school.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{school.studentsCount}</TableCell>
                  <TableCell>{school.coursesCount}</TableCell>
                  <TableCell>
                    <Badge variant={school.isActive ? "default" : "secondary"}>
                      {school.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={school.isWhiteLabelEnabled}
                      onCheckedChange={() => {}}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderCoursesContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Course Assignment</CardTitle>
        <CardDescription>Assign courses to schools and manage course distribution</CardDescription>
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
                      <Button variant="outline" size="sm" className="border-2 hover:bg-green-50" style={{ borderColor: '#05aa6d', color: '#05aa6d' }}>
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
                                <span className="text-gray-500">Difficulty:</span> {course.difficulty}
                              </div>
                            </div>
                          </div>
                          
                          <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">Assigned Schools</h4>
                            <div className="space-y-2">
                              {schools.slice(0, 3).map((school) => (
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
  );

  const renderApprovalContent = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Course Approval & Management
        </CardTitle>
        <CardDescription>
          Review, approve, and publish courses from content developers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-emerald-800">File-Based Course System</span>
          </div>
          <p className="text-sm text-emerald-700">
            Courses are developed as JSON files with YAML content and stored in the /courses directory. 
            The system automatically detects new courses and presents them here for approval.
          </p>
        </div>

        <div className="grid gap-4">
          {courses.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-gray-600 mb-3">{course.description}</p>
                  <div className="flex gap-4 text-sm text-gray-500 mb-3">
                    <span>{course.totalModules} modules</span>
                    <span>{course.estimatedDuration} minutes</span>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Review Content
                  </Button>
                  <Button size="sm" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Publish
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderContentContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <InteractiveCard
          key={course.id}
          title={course.title}
          description={course.description}
          icon={BookOpen}
          variant="default"
          expandable={true}
          rating={4.5}
          progress={(course.assignedSchools / 20) * 100}
          className="slide-in-left"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>{course.estimatedDuration} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Assigned Schools:</span>
              <span>{course.assignedSchools}</span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" className="btn-interactive text-white btn-green-hover" style={{ backgroundColor: '#05aa6d' }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Content
              </Button>
              <Button size="sm" variant="outline" className="btn-interactive border-2 hover:bg-green-50" style={{ borderColor: '#05aa6d', color: '#05aa6d' }}>
                <Users className="w-4 h-4 mr-2" />
                Assign Schools
              </Button>
            </div>
          </div>
        </InteractiveCard>
      ))}
      
      <InteractiveCard
        title="Create New Course"
        description="Design a new course with modules and activities"
        icon={Plus}
        variant="gradient"
        className="card-hover"
        onClick={() => console.log('Create new course clicked')}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Click to create a new course</p>
          </div>
        </div>
      </InteractiveCard>
    </div>
  );

  const renderSupportContent = () => (
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
                    <p>{new Date(request.createdAt).toLocaleDateString()}</p>
                    <p className="text-gray-500">{new Date(request.createdAt).toLocaleTimeString()}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderOnboardingContent = () => (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>School Onboarding Process</CardTitle>
          <CardDescription>Guide new schools through the setup process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium">School Registration</h4>
                <p className="text-sm text-gray-600">Basic information and admin account setup</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Course Assignment</h4>
                <p className="text-sm text-gray-600">Select and assign relevant courses</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Student Import</h4>
                <p className="text-sm text-gray-600">Bulk import students and create accounts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
      {/* Enhanced Animated Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatedStats
          title="Total Schools"
          value={schools.length}
          icon={Building2}
          color="bg-blue-500"
          trend={12}
          delay={0}
        />
        <AnimatedStats
          title="Total Students"
          value={schools.reduce((sum, school) => sum + school.studentsCount, 0)}
          icon={Users}
          color="bg-green-500"
          trend={8}
          delay={100}
        />
        <AnimatedStats
          title="Available Courses"
          value={courses.length}
          icon={BookOpen}
          color="bg-purple-500"
          trend={15}
          delay={200}
        />
        <AnimatedStats
          title="Active Assignments"
          value={courses.reduce((sum, course) => sum + course.assignedSchools, 0)}
          icon={BarChart3}
          color="bg-orange-500"
          trend={5}
          delay={300}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>Comprehensive platform usage statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">School Performance</h4>
              {schools.map((school) => {
                const completionRate = Math.random() * 100;
                return (
                  <div key={school.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{school.name}</span>
                      <span>{completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Course Enrollment</h4>
              {courses.map((course) => {
                const enrollmentRate = (course.assignedSchools / 20) * 100;
                return (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{course.title}</span>
                      <span>{enrollmentRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${enrollmentRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'schools':
        return renderSchoolsContent();
      case 'courses':
        return renderCoursesContent();
      case 'approval':
        return renderApprovalContent();
      case 'content':
        return renderContentContent();
      case 'support':
        return renderSupportContent();
      case 'onboarding':
        return renderOnboardingContent();
      case 'analytics':
        return renderAnalyticsContent();
      default:
        return renderSchoolsContent();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r flex flex-col">
        <div className="p-6 border-b" style={{ background: 'linear-gradient(135deg, #0097b2 0%, #7bbe84 100%)' }}>
          <h1 className="text-xl font-bold text-white">Super Admin</h1>
          <p className="text-white/80 text-sm">Platform Management</p>
        </div>
        
        <nav className="flex-1 mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors",
                  activeTab === item.id 
                    ? "bg-green-50 text-green-700 border-r-2 border-green-500" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <AdminHeaderDropdown 
            userRole="super_admin" 
            username="Super Admin"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600">Manage and configure platform settings</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}