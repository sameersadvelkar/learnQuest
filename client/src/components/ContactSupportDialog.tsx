import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Send, CheckCircle, Headphones } from 'lucide-react';

interface ContactSupportDialogProps {
  trigger?: React.ReactNode;
}

export function ContactSupportDialog({ trigger }: ContactSupportDialogProps) {
  const { state: authState } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'medium'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call - in real app this would call your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create support request object
      const supportRequest = {
        userId: authState.user?.id,
        schoolId: 1, // In real app, get from user's school
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        status: 'open'
      };

      console.log('Support request submitted:', supportRequest);
      
      setIsSubmitted(true);
      
      // Reset form after delay
      setTimeout(() => {
        setIsSubmitted(false);
        setIsOpen(false);
        setFormData({ subject: '', message: '', priority: 'medium' });
      }, 2000);

    } catch (error) {
      console.error('Error submitting support request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl px-4 py-2 font-medium">
      <Headphones className="w-4 h-4 mr-2" />
      Contact Support
    </Button>
  );

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
        <DialogContent>
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Request Submitted Successfully</h3>
            <p className="text-gray-600 text-center">
              Your support request has been sent to our team. We'll get back to you within 24 hours.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Contact Support</DialogTitle>
          <DialogDescription>
            Need help? Send us a message and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your issue"
              required
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General inquiry</SelectItem>
                <SelectItem value="medium">Medium - Need assistance</SelectItem>
                <SelectItem value="high">High - Issue affecting work</SelectItem>
                <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your issue or question in detail..."
              rows={4}
              required
            />
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              <strong>User:</strong> {authState.user?.username}<br />
              <strong>Email:</strong> {authState.user?.email}<br />
              <strong>Role:</strong> {authState.user?.role}
            </AlertDescription>
          </Alert>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              className="border-2 hover:bg-green-50"
              style={{ borderColor: '#05aa6d', color: '#05aa6d' }}
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="text-white btn-green-hover" style={{ backgroundColor: '#05aa6d' }}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}