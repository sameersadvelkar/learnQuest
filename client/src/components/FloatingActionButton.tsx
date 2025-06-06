import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, Users, BookOpen, Building2, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FloatingAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="floating-action">
      <div className={`flex flex-col space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4 pointer-events-none'
      }`}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 transition-all duration-300`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {action.label}
            </span>
            <Button
              size="sm"
              className={`w-12 h-12 rounded-full ${action.color} shadow-lg hover:scale-110 transition-all duration-200`}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
            >
              {action.icon}
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        size="lg"
        className={`w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>
    </div>
  );
}

export function SuperAdminFloatingActions() {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  const actions: FloatingAction[] = [
    {
      icon: <Building2 className="h-4 w-4" />,
      label: "Add School",
      onClick: () => setDialogOpen('school'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Create Course",
      onClick: () => setDialogOpen('course'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Bulk Import",
      onClick: () => setDialogOpen('import'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Support Center",
      onClick: () => setDialogOpen('support'),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <>
      <FloatingActionButton actions={actions} />
      
      <Dialog open={dialogOpen === 'school'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New School</DialogTitle>
            <DialogDescription>
              Create a new school account with admin credentials.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-muted-foreground py-4">
            School creation form would be implemented here.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === 'course'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Design a new course with modules and activities.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-muted-foreground py-4">
            Course creation form would be implemented here.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === 'import'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Import</DialogTitle>
            <DialogDescription>
              Import schools, users, or course data from CSV files.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-muted-foreground py-4">
            Bulk import interface would be implemented here.
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen === 'support'} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Support Center</DialogTitle>
            <DialogDescription>
              Manage support requests and system announcements.
            </DialogDescription>
          </DialogHeader>
          <p className="text-center text-muted-foreground py-4">
            Support management interface would be implemented here.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}