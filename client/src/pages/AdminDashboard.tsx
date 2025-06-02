import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, Settings, BarChart3, Shield, LogOut } from 'lucide-react';

export function AdminDashboard() {
  const { state, logout, hasAnyRole } = useAuth();

  if (!hasAnyRole(['admin', 'super_admin'])) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p>Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminFeatures = [
    {
      title: 'User Management',
      description: 'Manage students, instructors, and other users',
      icon: Users,
      color: 'bg-blue-500',
      available: true,
    },
    {
      title: 'Course Management',
      description: 'Create, edit, and organize learning content',
      icon: BookOpen,
      color: 'bg-green-500',
      available: true,
    },
    {
      title: 'Analytics & Reports',
      description: 'View learning progress and system analytics',
      icon: BarChart3,
      color: 'bg-purple-500',
      available: true,
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and preferences',
      icon: Settings,
      color: 'bg-orange-500',
      available: state.user?.role === 'super_admin',
    },
    {
      title: 'Security Management',
      description: 'Manage permissions and security settings',
      icon: Shield,
      color: 'bg-red-500',
      available: state.user?.role === 'super_admin',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {state.user?.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={state.user?.role === 'super_admin' ? 'default' : 'secondary'}>
                {state.user?.role?.replace('_', ' ').toUpperCase()}
              </Badge>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">1,234</p>
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
                  <p className="text-2xl font-bold">45</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <BarChart3 className="w-8 h-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminFeatures.map((feature) => (
            <Card 
              key={feature.title}
              className={`transition-all duration-200 ${
                feature.available 
                  ? 'hover:shadow-lg cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    {!feature.available && (
                      <Badge variant="outline" className="text-xs">
                        Super Admin Only
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                {feature.available && (
                  <Button className="mt-4 w-full" variant="outline">
                    Open {feature.title}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system activities and user actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New user registration', user: 'john.doe@example.com', time: '2 minutes ago' },
                { action: 'Course completed', user: 'jane.smith@example.com', time: '15 minutes ago' },
                { action: 'Module updated', user: 'instructor@example.com', time: '1 hour ago' },
                { action: 'System backup completed', user: 'System', time: '2 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}