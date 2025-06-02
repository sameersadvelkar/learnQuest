import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface CourseFormData {
  title: string;
  description: string;
  difficulty: string;
  estimatedDuration: number;
  prerequisites: string[];
  learningObjectives: string[];
}

export function CourseManagement() {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    difficulty: 'Beginner',
    estimatedDuration: 60,
    prerequisites: [],
    learningObjectives: []
  });
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: async (courseData: CourseFormData) => {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courseData,
          totalModules: 0,
          totalPages: 0
        })
      });
      if (!response.ok) throw new Error('Failed to create course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      resetForm();
      setIsCreating(false);
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'Beginner',
      estimatedDuration: 60,
      prerequisites: [],
      learningObjectives: []
    });
    setNewPrerequisite('');
    setNewObjective('');
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index)
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, newObjective.trim()]
      }));
      setNewObjective('');
    }
  };

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourseMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Data Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Course</CardTitle>
            <CardDescription>Add course information that will appear in the preview</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Course Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                  min="1"
                  required
                />
              </div>

              <div>
                <Label>Prerequisites</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Add a prerequisite"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                  />
                  <Button type="button" onClick={addPrerequisite}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {prereq}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removePrerequisite(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Learning Objectives</Label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add a learning objective"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" onClick={addObjective}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.learningObjectives.map((objective, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {objective}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => removeObjective(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={createCourseMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {createCourseMutation.isPending ? 'Creating...' : 'Create Course'}
                </Button>
                <Button type="button" variant="outline" onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Existing Courses</CardTitle>
          <CardDescription>Manage course information for previews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courses.map((course: any) => (
              <div key={course.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Duration: {course.estimatedDuration} min</span>
                      <span>Difficulty: {course.difficulty || 'Not set'}</span>
                      <span>Prerequisites: {course.prerequisites?.length || 0}</span>
                      <span>Objectives: {course.learningObjectives?.length || 0}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/course-preview/${course.id}`, '_blank')}
                    >
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {courses.length === 0 && (
              <p className="text-center text-gray-500 py-8">No courses created yet. Add your first course above.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}