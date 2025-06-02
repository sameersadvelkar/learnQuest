import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, state } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const demoAccounts = [
    { username: 'student', role: 'Student' },
    { username: 'admin', role: 'Admin' },
    { username: 'superadmin', role: 'Super Admin' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>LearnQuest Login</CardTitle>
          <CardDescription>
            Access your learning management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full"
              disabled={state.loading}
            >
              {state.loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3">Demo Accounts:</h3>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <div key={account.username} className="flex justify-between text-sm">
                  <span className="font-mono">{account.username}</span>
                  <span className="text-gray-500">{account.role}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Password: Use any password (demo mode)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}