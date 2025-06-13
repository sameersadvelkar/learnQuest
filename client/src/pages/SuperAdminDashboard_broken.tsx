import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Building2, Users, BookOpen, BarChart3, Plus, Settings, LogOut, Upload, MessageSquare, Clock, CheckCircle, XCircle, Key, FileText, Edit, TrendingUp, Star, Award, Activity } from 'lucide-react';
import { AnimatedStats, ProgressRing } from '@/components/AnimatedStats';
import { InteractiveCard, StatsGrid } from '@/components/InteractiveCard';
import { AdminHeaderDropdown } from '@/components/AdminHeaderDropdown';
import { SkeletonStats, SkeletonCard } from '@/components/LoadingStates';

interface School {
  id: number;
  name: string;
  email: string;
  adminName: string;
  studentsCount: number;
  coursesCount: number;
  isActive: boolean;
  isWhiteLabelEnabled: boolean;
  createdAt: string;
  location: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  totalModules: number;
  estimatedDuration: number;
  assignedSchools: number;
  difficulty: string;
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
  const [activeTab, setActiveTab] = useState('schools');
  const [isCreatingSchool, setIsCreatingSchool] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  
  const [newSchool, setNewSchool] = useState({
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

  const [schools] = useState<School[]>([
    {
      id: 1,
      name: "Greenwood High School",
      email: "admin@greenwood.edu",
      adminName: "Sarah Johnson",
      studentsCount: 450,
      coursesCount: 8,
      isActive: true,
      isWhiteLabelEnabled: true,
      createdAt: "2024-05-15",
      location: "New York, NY"
    },
    {
      id: 2,
      name: "Tech Academy",
      email: "admin@techacademy.edu",
      adminName: "Michael Chen",
      studentsCount: 320,
      coursesCount: 12,
      isActive: true,
      isWhiteLabelEnabled: false,
      createdAt: "2024-05-20",
      location: "San Francisco, CA"
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
      message: "We're having trouble enrolling new students in the Computer Science course.",
      priority: "high",
      status: "open",
      createdAt: "2024-05-30T14:30:00Z",
      updatedAt: "2024-05-30T14:30:00Z"
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
                      onCheckedChange={() => {/* toggleWhiteLabel(school.id) */}}
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
        <CardDescription>Assign courses to schools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>
                  <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                    <span>{course.totalModules} modules</span>
                    <span>{course.estimatedDuration} min</span>
                    <Badge variant="outline">{course.difficulty}</Badge>
                  </div>
                </div>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Assign to Schools
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSupportContent = () => (
    <Card>
      <CardHeader>
        <CardTitle>Support Requests</CardTitle>
        <CardDescription>Manage support tickets from schools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {supportRequests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.subject}</h3>
                  <p className="text-sm text-gray-600">{request.schoolName} - {request.userName}</p>
                  <p className="mt-2">{request.message}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge variant={request.priority === 'urgent' ? 'destructive' : 'default'}>
                    {request.priority}
                  </Badge>
                  <Badge variant="outline">{request.status}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'schools':
        return renderSchoolsContent();
      case 'courses':
        return renderCoursesContent();
      case 'support':
        return renderSupportContent();
      case 'approval':
        return <Card><CardContent><p>Course Approval content will be displayed here</p></CardContent></Card>;
      case 'content':
        return <Card><CardContent><p>Course Content management will be displayed here</p></CardContent></Card>;
      case 'onboarding':
        return <Card><CardContent><p>Onboarding content will be displayed here</p></CardContent></Card>;
      case 'analytics':
        return <Card><CardContent><p>Analytics dashboard will be displayed here</p></CardContent></Card>;
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