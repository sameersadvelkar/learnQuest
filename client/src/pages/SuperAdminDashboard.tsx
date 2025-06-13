import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Building2, Users, BookOpen, BarChart3, Plus, LogOut, Upload, MessageSquare, Clock, CheckCircle, XCircle, FileText, Edit, TrendingUp, Activity, Phone, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { AnimatedStats, ProgressRing } from '@/components/AnimatedStats';
import { InteractiveCard } from '@/components/InteractiveCard';
import { AdminHeaderDropdown } from '@/components/AdminHeaderDropdown';

interface School {
  id: number;
  name: string;
  email: string;
  adminName: string;
  adminUsername: string;
  adminPassword: string;
  adminPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  studentsCount: number;
  coursesCount: number;
  isWhiteLabelEnabled: boolean;
  isActive: boolean;
  status: 'active' | 'suspended';
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
  difficulty: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  reviewNotes: string;
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
  response?: string;
}

export function SuperAdminDashboard() {
  const { state, logout, hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState('schools');
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [reviewingCourse, setReviewingCourse] = useState<Course | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [supportResponse, setSupportResponse] = useState('');
  const [respondingToTicket, setRespondingToTicket] = useState<SupportRequest | null>(null);
  const [assigningCourse, setAssigningCourse] = useState<Course | null>(null);
  const [selectedSchoolsForCourse, setSelectedSchoolsForCourse] = useState<number[]>([]);
  const [schoolFilter, setSchoolFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [schoolStatusFilter, setSchoolStatusFilter] = useState('all');
  const [courseStatusFilter, setCourseStatusFilter] = useState('all');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const [newSchool, setNewSchool] = useState({
    name: '',
    email: '',
    adminName: '',
    adminPhone: '',
    adminPassword: '',
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
      adminUsername: "sarah.johnson",
      adminPassword: "GHS@2024$secure",
      adminPhone: "+1-555-0123",
      address: "123 Education Street",
      city: "Springfield",
      state: "California", 
      pincode: "90210",
      studentsCount: 1250,
      coursesCount: 8,
      isWhiteLabelEnabled: true,
      isActive: true,
      status: "active",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      name: "Tech Academy",
      email: "admin@techacademy.edu",
      adminName: "Michael Chen",
      adminUsername: "michael.chen",
      adminPassword: "TechAdmin@2024",
      adminPhone: "+1-555-0456",
      address: "456 Innovation Drive",
      city: "San Jose",
      state: "California",
      pincode: "95110",
      studentsCount: 890,
      coursesCount: 12,
      isWhiteLabelEnabled: false,
      isActive: true,
      status: "active",
      createdAt: "2024-02-20"
    },
    {
      id: 3,
      name: "Riverside School",
      email: "admin@riverside.edu",
      adminName: "Emily Davis",
      adminUsername: "emily.davis",
      adminPassword: "Riverside#2024",
      adminPhone: "+1-555-0789",
      address: "789 Academic Lane",
      city: "Austin",
      state: "Texas",
      pincode: "73301",
      studentsCount: 650,
      coursesCount: 6,
      isWhiteLabelEnabled: true,
      isActive: true,
      status: "suspended",
      createdAt: "2024-03-10"
    }
  ]);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Computer Science Fundamentals",
      description: "Learn the basics of programming and computer science",
      totalModules: 8,
      estimatedDuration: 120,
      assignedSchools: 15,
      difficulty: "Beginner",
      status: "review",
      reviewNotes: "Need to update module 3 content"
    },
    {
      id: 2,
      title: "Digital Marketing Basics",
      description: "Learn the fundamentals of digital marketing",
      totalModules: 6,
      estimatedDuration: 90,
      assignedSchools: 12,
      difficulty: "Beginner",
      status: "approved",
      reviewNotes: ""
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      description: "Introduction to data analysis and visualization",
      totalModules: 10,
      estimatedDuration: 150,
      assignedSchools: 8,
      difficulty: "Intermediate",
      status: "published",
      reviewNotes: ""
    }
  ]);

  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([
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
      updatedAt: "2024-05-30T10:30:00Z",
      response: "We have added Excel export functionality to the next release."
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

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchool.name || !newSchool.email || !newSchool.adminName || !newSchool.adminPhone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreatingSchool(true);
    
    try {
      const adminUsername = newSchool.adminName.toLowerCase().replace(/\s+/g, '.');
      const password = newSchool.adminPassword || generatePassword();
      
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSchool,
          adminUsername,
          adminPassword: password
        }),
      });

      if (response.ok) {
        const { school } = await response.json();
        const newSchoolData: School = {
          ...school,
          id: schools.length + 1,
          adminUsername,
          adminPassword: password,
          studentsCount: 0,
          coursesCount: 0,
          isActive: true,
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        setSchools([...schools, newSchoolData]);
        setNewSchool({
          name: '',
          email: '',
          adminName: '',
          adminPhone: '',
          adminPassword: '',
          address: '',
          city: '',
          state: '',
          pincode: '',
          isWhiteLabelEnabled: false
        });
        setIsCreatingSchool(false);
        setShowCreateDialog(false);
        
        alert(`School created successfully!\n\nAdmin Credentials:\nUsername: ${adminUsername}\nPassword: ${password}\n\nPlease save these credentials safely.`);
      } else {
        const error = await response.json();
        alert(`Failed to create school: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating school:', error);
      alert('Failed to create school. Please try again.');
    } finally {
      setIsCreatingSchool(false);
    }
  };

  const toggleSchoolStatus = (schoolId: number) => {
    setSchools(schools.map(school => 
      school.id === schoolId 
        ? { ...school, status: school.status === 'active' ? 'suspended' : 'active' }
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

  const approveCourse = (courseId: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: 'approved' }
        : course
    ));
  };

  const publishCourse = (courseId: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { ...course, status: 'published' }
        : course
    ));
  };

  const handleReviewCourse = (course: Course) => {
    setReviewingCourse(course);
    setReviewNotes(course.reviewNotes);
  };

  const submitReview = () => {
    if (reviewingCourse) {
      setCourses(courses.map(course => 
        course.id === reviewingCourse.id 
          ? { ...course, status: 'review', reviewNotes }
          : course
      ));
      setReviewingCourse(null);
      setReviewNotes('');
    }
  };

  const handleSupportResponse = (request: SupportRequest) => {
    setRespondingToTicket(request);
    setSupportResponse(request.response || '');
  };

  const submitSupportResponse = () => {
    if (respondingToTicket) {
      setSupportRequests(supportRequests.map(request => 
        request.id === respondingToTicket.id 
          ? { ...request, response: supportResponse, status: 'resolved', updatedAt: new Date().toISOString() }
          : request
      ));
      setRespondingToTicket(null);
      setSupportResponse('');
    }
  };

  const handleAssignCourse = (course: Course) => {
    setAssigningCourse(course);
    setSelectedSchoolsForCourse([]);
  };

  const toggleSchoolSelection = (schoolId: number) => {
    setSelectedSchoolsForCourse(prev => 
      prev.includes(schoolId) 
        ? prev.filter(id => id !== schoolId)
        : [...prev, schoolId]
    );
  };

  const submitCourseAssignment = () => {
    if (assigningCourse && selectedSchoolsForCourse.length > 0) {
      // Update the course with new assignment count
      setCourses(courses.map(course => 
        course.id === assigningCourse.id 
          ? { ...course, assignedSchools: course.assignedSchools + selectedSchoolsForCourse.length }
          : course
      ));
      
      // Update schools with new course count
      setSchools(schools.map(school => 
        selectedSchoolsForCourse.includes(school.id)
          ? { ...school, coursesCount: school.coursesCount + 1 }
          : school
      ));
      
      setAssigningCourse(null);
      setSelectedSchoolsForCourse([]);
      alert(`Course "${assigningCourse.title}" has been assigned to ${selectedSchoolsForCourse.length} school(s).`);
    }
  };

  // Filter functions
  const filteredSchools = schools.filter(school => {
    const matchesText = school.name.toLowerCase().includes(schoolFilter.toLowerCase()) ||
      school.adminName.toLowerCase().includes(schoolFilter.toLowerCase()) ||
      school.city.toLowerCase().includes(schoolFilter.toLowerCase()) ||
      school.state.toLowerCase().includes(schoolFilter.toLowerCase());
    
    const matchesStatus = schoolStatusFilter === 'all' || school.status === schoolStatusFilter;
    
    return matchesText && matchesStatus;
  });

  const filteredCourses = courses.filter(course => {
    const matchesText = course.title.toLowerCase().includes(courseFilter.toLowerCase()) ||
      course.description.toLowerCase().includes(courseFilter.toLowerCase()) ||
      course.status.toLowerCase().includes(courseFilter.toLowerCase());
    
    const matchesStatus = courseStatusFilter === 'all' || course.status === courseStatusFilter;
    
    return matchesText && matchesStatus;
  });

  const sidebarItems = [
    { id: 'schools', label: 'School Management', icon: Building2 },
    { id: 'courses', label: 'Course Assignment', icon: BookOpen },
    { id: 'approval', label: 'Course Approval', icon: CheckCircle },
    { id: 'support', label: 'Support Requests', icon: MessageSquare },
    { id: 'onboarding', label: 'School Onboarding Process', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

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
              <span className="font-semibold">{schools.filter(s => s.status === 'active').length}/{schools.length}</span>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>School Management</CardTitle>
              <CardDescription>Manage schools and their administrators</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search schools..."
                  value={schoolFilter}
                  onChange={(e) => setSchoolFilter(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Select value={schoolStatusFilter} onValueChange={setSchoolStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              {(schoolFilter || schoolStatusFilter !== 'all') && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSchoolFilter('');
                    setSchoolStatusFilter('all');
                  }}
                  className="text-gray-500"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>School Details</TableHead>
                <TableHead>Admin Contact</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>White Label</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-sm text-gray-500">{school.city}, {school.state}</p>
                      <p className="text-xs text-gray-400">{school.address}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{school.adminName}</p>
                      <p className="text-sm text-gray-500">{school.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{school.adminPhone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-semibold text-lg">{school.studentsCount}</p>
                      <p className="text-xs text-gray-500">enrolled</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <p className="font-semibold text-lg">{school.coursesCount}</p>
                      <p className="text-xs text-gray-500">assigned</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={school.status === 'active'}
                      onCheckedChange={() => toggleSchoolStatus(school.id)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {school.status === 'active' ? 'Active' : 'Suspended'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={school.isWhiteLabelEnabled}
                      onCheckedChange={() => toggleWhiteLabel(school.id)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {school.isWhiteLabelEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="btn-interactive border-2 hover:bg-green-50" style={{ borderColor: '#05aa6d', color: '#05aa6d' }}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit School Admin</DialogTitle>
                            <DialogDescription>Update username and password for {school.name}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Username</Label>
                              <Input value={school.adminUsername} readOnly />
                            </div>
                            <div>
                              <Label>Current Password</Label>
                              <Input type="password" value={school.adminPassword} readOnly />
                            </div>
                            <div>
                              <Label>New Password</Label>
                              <Input type="password" placeholder="Enter new password" />
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => setEditingSchool(null)}>Cancel</Button>
                              <Button className="bg-green-600 hover:bg-green-700">Update</Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Course Assignment</CardTitle>
            <CardDescription>View schools assigned to each course</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            <Select value={courseStatusFilter} onValueChange={setCourseStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            {(courseFilter || courseStatusFilter !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCourseFilter('');
                  setCourseStatusFilter('all');
                }}
                className="text-gray-500"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course Title</TableHead>
              <TableHead>Modules</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned Schools</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-gray-500">{course.description}</p>
                  </div>
                </TableCell>
                <TableCell>{course.totalModules}</TableCell>
                <TableCell>{course.estimatedDuration} min</TableCell>
                <TableCell>
                  <Badge variant={
                    course.status === 'published' ? 'default' :
                    course.status === 'approved' ? 'secondary' :
                    course.status === 'review' ? 'destructive' : 'outline'
                  }>
                    {course.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{course.assignedSchools} schools</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-2 hover:bg-green-50" style={{ borderColor: '#05aa6d', color: '#05aa6d' }}>
                          View Schools
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{course.title} - Assigned Schools</DialogTitle>
                          <DialogDescription>Schools that have access to this course</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
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
                                    <p className={`text-xs ${school.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                      {school.status === 'active' ? 'Active' : 'Suspended'}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {course.status === 'published' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAssignCourse(course)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Assign Schools
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Course Assignment Dialog */}
        <Dialog open={!!assigningCourse} onOpenChange={() => setAssigningCourse(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Assign Course to Schools</DialogTitle>
              <DialogDescription>
                Select schools to assign "{assigningCourse?.title}" course
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Available Schools</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {schools.filter(school => school.status === 'active').map((school) => (
                    <div key={school.id} className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50">
                      <input
                        type="checkbox"
                        id={`school-${school.id}`}
                        checked={selectedSchoolsForCourse.includes(school.id)}
                        onChange={() => toggleSchoolSelection(school.id)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`school-${school.id}`} className="flex-1 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{school.name}</p>
                            <p className="text-sm text-gray-500">{school.adminName} • {school.city}, {school.state}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">{school.studentsCount} students</p>
                            <p className="text-xs text-gray-400">{school.coursesCount} courses assigned</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
                {selectedSchoolsForCourse.length > 0 && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      {selectedSchoolsForCourse.length} school(s) selected for assignment
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setAssigningCourse(null)}>
                  Cancel
                </Button>
                <Button 
                  onClick={submitCourseAssignment}
                  disabled={selectedSchoolsForCourse.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Assign Course ({selectedSchoolsForCourse.length})
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                    <Badge variant={
                      course.status === 'published' ? 'default' :
                      course.status === 'approved' ? 'secondary' :
                      course.status === 'review' ? 'destructive' : 'outline'
                    }>
                      {course.status.toUpperCase()}
                    </Badge>
                  </div>
                  {course.reviewNotes && (
                    <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      <strong>Review Notes:</strong> {course.reviewNotes}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {course.status !== 'approved' && course.status !== 'published' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => approveCourse(course.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleReviewCourse(course)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Review Content
                  </Button>
                  {course.status === 'approved' && (
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => publishCourse(course.id)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Course Dialog */}
        <Dialog open={!!reviewingCourse} onOpenChange={() => setReviewingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Course Content</DialogTitle>
              <DialogDescription>Add notes for the development team</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Course: {reviewingCourse?.title}</Label>
              </div>
              <div>
                <Label>Review Notes</Label>
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter review notes and required changes..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setReviewingCourse(null)}>Cancel</Button>
                <Button onClick={submitReview} className="bg-orange-600 hover:bg-orange-700">Submit Review</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
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
                    {request.response && (
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <strong>Response:</strong> {request.response}
                      </div>
                    )}
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
                    <Button size="sm" variant="outline" onClick={() => handleSupportResponse(request)}>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Respond
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Support Response Dialog */}
        <Dialog open={!!respondingToTicket} onOpenChange={() => setRespondingToTicket(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Support Request</DialogTitle>
              <DialogDescription>Subject: {respondingToTicket?.subject}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-sm font-medium">Original Message:</p>
                <p className="text-sm text-gray-600 mt-1">{respondingToTicket?.message}</p>
              </div>
              <div>
                <Label>Response</Label>
                <Textarea
                  value={supportResponse}
                  onChange={(e) => setSupportResponse(e.target.value)}
                  placeholder="Enter your response..."
                  rows={4}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setRespondingToTicket(null)}>Cancel</Button>
                <Button onClick={submitSupportResponse} className="bg-green-600 hover:bg-green-700">Send Response</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  const renderOnboardingContent = () => (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>School Onboarding Process</CardTitle>
              <CardDescription>Create new school accounts and guide them through setup</CardDescription>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button 
                  className="text-white btn-green-hover" 
                  style={{ backgroundColor: '#05aa6d' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New School
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Create New School</DialogTitle>
                  <DialogDescription>Add a new school to the platform with admin credentials</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSchool} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="orgName">Organisation Name *</Label>
                      <Input
                        id="orgName"
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                        placeholder="Enter organisation name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminName">Admin Name *</Label>
                      <Input
                        id="adminName"
                        value={newSchool.adminName}
                        onChange={(e) => setNewSchool({...newSchool, adminName: e.target.value})}
                        placeholder="Administrator full name"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminEmail">Admin Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={newSchool.email}
                        onChange={(e) => setNewSchool({...newSchool, email: e.target.value})}
                        placeholder="admin@school.edu"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="adminPhone">Admin Phone Number *</Label>
                      <Input
                        id="adminPhone"
                        type="tel"
                        value={newSchool.adminPhone}
                        onChange={(e) => setNewSchool({...newSchool, adminPhone: e.target.value})}
                        placeholder="+1-555-0123"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="adminPassword">Admin Password</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={newSchool.adminPassword}
                      onChange={(e) => setNewSchool({...newSchool, adminPassword: e.target.value})}
                      placeholder="Leave empty to auto-generate"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newSchool.address}
                        onChange={(e) => setNewSchool({...newSchool, address: e.target.value})}
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={newSchool.city}
                        onChange={(e) => setNewSchool({...newSchool, city: e.target.value})}
                        placeholder="City"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={newSchool.state}
                        onChange={(e) => setNewSchool({...newSchool, state: e.target.value})}
                        placeholder="State"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={newSchool.pincode}
                        onChange={(e) => setNewSchool({...newSchool, pincode: e.target.value})}
                        placeholder="ZIP/Pincode"
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
                    <Label htmlFor="whiteLabel">Enable White Label Features (School can customize logo and branding)</Label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={() => {
                      setIsCreatingSchool(false);
                      setShowCreateDialog(false);
                      setNewSchool({
                        name: '',
                        email: '',
                        adminName: '',
                        adminPhone: '',
                        adminPassword: '',
                        address: '',
                        city: '',
                        state: '',
                        pincode: '',
                        isWhiteLabelEnabled: false
                      });
                    }}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isCreatingSchool}
                      className="text-white btn-green-hover" 
                      style={{ backgroundColor: '#05aa6d' }}
                    >
                      {isCreatingSchool ? 'Creating...' : 'Create School'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-medium">School Registration</h4>
                <p className="text-sm text-gray-600">Basic information and admin account setup with credentials</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Admin Dashboard Access</h4>
                <p className="text-sm text-gray-600">School admin can login with provided credentials</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Course Assignment & Student Management</h4>
                <p className="text-sm text-gray-600">Assign courses and import students through admin dashboard</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
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
              <h4 className="font-medium">Course Status Distribution</h4>
              {courses.map((course) => {
                const enrollmentRate = (course.assignedSchools / 20) * 100;
                return (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{course.title}</span>
                      <span>{course.status}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          course.status === 'published' ? 'bg-green-500' :
                          course.status === 'approved' ? 'bg-blue-500' :
                          course.status === 'review' ? 'bg-orange-500' : 'bg-gray-400'
                        }`}
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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{state.user?.username || 'Super Admin'}</p>
                <p className="text-xs text-gray-500">Platform Administrator</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogoutDialog(true)}
                className="flex items-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-600" />
              Confirm Logout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from the Super Admin dashboard? You will need to login again to access the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setShowLogoutDialog(false);
                logout();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}