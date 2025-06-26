import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Lock, AlertCircle } from 'lucide-react';
import { getCourseImage } from '@/utils/mediaUtils';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-500 to-green-400 flex items-center justify-center p-2 sm:p-4" style={{ background: 'linear-gradient(135deg, #0097b2 0%, #7bbe84 100%)' }}>
      
      <div className="relative w-full max-w-4xl h-auto sm:h-[500px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col sm:flex-row">
        {/* Left Side - Clean White Design - Responsive */}
        <div className="relative w-full sm:w-3/5 flex-1 bg-white overflow-hidden order-2 sm:order-1 hidden sm:block" style={{ flexBasis: '60%' }}>
          {/* Educational themed background */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Floating books */}
            <div className="absolute top-16 right-16 transform rotate-12">
              <div className="w-8 h-10 bg-emerald-200 rounded-sm shadow-sm opacity-60"></div>
              <div className="w-6 h-8 bg-green-300 rounded-sm shadow-sm opacity-50 mt-1 ml-2"></div>
            </div>
            
            <div className="absolute bottom-20 left-8 transform -rotate-6">
              <div className="w-10 h-12 bg-teal-200 rounded-sm shadow-sm opacity-50"></div>
              <div className="w-8 h-10 bg-emerald-300 rounded-sm shadow-sm opacity-40 mt-1 ml-1"></div>
            </div>
            
            {/* Mathematical formulas */}
            <div className="absolute top-20 left-32 text-emerald-300 opacity-30 font-mono text-sm transform rotate-3">
              E = mc²
            </div>
            
            <div className="absolute bottom-32 right-32 text-green-300 opacity-25 font-mono text-xs transform -rotate-12">
              ∫ f(x)dx
            </div>
            
            {/* Graduation cap */}
            <svg className="absolute top-32 right-40 w-12 h-12 text-emerald-200 opacity-40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zM18.82 9L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
            </svg>
            
            {/* Learning path visualization */}
            <svg className="absolute top-40 left-8 w-32 h-24 opacity-20" viewBox="0 0 120 80">
              <circle cx="15" cy="40" r="4" fill="#10b981"/>
              <circle cx="45" cy="25" r="3" fill="#059669"/>
              <circle cx="75" cy="50" r="3" fill="#047857"/>
              <circle cx="105" cy="35" r="3" fill="#065f46"/>
              <path d="M15,40 Q30,30 45,25 Q60,35 75,50 Q90,40 105,35" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="2,2"/>
            </svg>
            
            {/* Trophy/achievement icon */}
            <svg className="absolute bottom-16 right-8 w-10 h-10 text-emerald-300 opacity-30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14S5 11.8 5 9V7L3 7V9C3 12.2 5.3 14.9 8.4 15.8L8 18H6V20H18V18H16L15.6 15.8C18.7 14.9 21 12.2 21 9Z"/>
            </svg>
            
            {/* Lightbulb for ideas */}
            <svg className="absolute top-60 right-12 w-8 h-8 text-green-300 opacity-35" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A7,7 0 0,0 5,9C5,11.38 6.19,13.47 8,14.74V17A1,1 0 0,0 9,18H15A1,1 0 0,0 16,17V14.74C17.81,13.47 19,11.38 19,9A7,7 0 0,0 12,2M9,21V20H15V21A1,1 0 0,1 14,22H10A1,1 0 0,1 9,21M12,4A5,5 0 0,1 17,9C17,10.64 16.05,12.1 14.59,12.9L14,13.25V16H10V13.25L9.41,12.9C7.95,12.1 7,10.64 7,9A5,5 0 0,1 12,4Z"/>
            </svg>
            
            {/* Abstract learning network */}
            <div className="absolute bottom-40 left-20 opacity-15">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 ml-3"></div>
              <div className="w-2 h-2 bg-teal-400 rounded-full mt-1 ml-1"></div>
              <svg className="absolute top-0 left-0 w-8 h-8" viewBox="0 0 32 32">
                <line x1="4" y1="4" x2="12" y2="8" stroke="#10b981" strokeWidth="1"/>
                <line x1="12" y1="8" x2="8" y2="16" stroke="#10b981" strokeWidth="1"/>
              </svg>
            </div>
            
            {/* Subtle grid pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="grid grid-cols-12 grid-rows-8 h-full gap-4">
                {[...Array(96)].map((_, i) => (
                  <div key={i} className="border border-emerald-200"></div>
                ))}
              </div>
            </div>
            
            {/* Floating particles */}
            <div className="absolute top-24 left-40 w-1 h-1 bg-emerald-300 rounded-full opacity-40 animate-pulse"></div>
            <div className="absolute top-48 left-24 w-1.5 h-1.5 bg-green-300 rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute bottom-28 right-20 w-1 h-1 bg-teal-300 rounded-full opacity-50 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>
          
          {/* Logo aligned with welcome text - Responsive */}
          <div className="absolute top-8 sm:top-16 left-8 sm:left-16 z-10">
            <img 
              src={getCourseImage(1, 'coursewing.png')} 
              alt="CourseWind" 
              className="h-12 sm:h-16 mb-4 sm:mb-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getCourseImage(1, 'coursewindLogo.png');
              }}
            />
          </div>
          
          {/* Welcome text - Responsive */}
          <div className="absolute top-1/2 left-8 sm:left-16 transform -translate-y-1/2 z-10 hidden sm:block">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">Welcome back!</h1>
            <p className="text-gray-600 text-base sm:text-lg max-w-sm">
              You can sign in to access with your existing account.
            </p>
          </div>
        </div>

        {/* Right Side - Sign In Form - Responsive */}
        <div className="relative w-full sm:w-2/5 flex-1 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4 sm:px-6 sm:py-2 md:px-8 md:py-2 sm:border-l-4 sm:border-emerald-500 order-1 sm:order-2" style={{ flexBasis: '40%' }}>
          <div className="w-full max-w-xs">
            {/* Mobile Logo */}
            <div className="flex justify-center mb-6 sm:hidden">
              <img 
                src={getCourseImage(1, 'coursewing.png')} 
                alt="CourseWind" 
                className="h-12"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getCourseImage(1, 'coursewindLogo.png');
                }}
              />
            </div>
            
            <div className="text-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Sign In</h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">Access your learning dashboard</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500" />
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 h-12 bg-white/80 border-2 border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 text-sm focus:border-emerald-500 focus:ring-0 focus:outline-none shadow-sm"
                  placeholder="Username or email"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-emerald-500" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/80 border-2 border-emerald-200 rounded-xl text-gray-800 placeholder-gray-500 text-sm focus:border-emerald-500 focus:ring-0 focus:outline-none shadow-sm"
                  placeholder="Password"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-emerald-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <label htmlFor="remember" className="text-gray-600">Remember me</label>
                </div>
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                disabled={state.loading}
              >
                {state.loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              New here?{' '}
              <a href="#" className="font-medium text-emerald-600 hover:text-emerald-700">
                Create an Account
              </a>
            </div>

            {/* Demo accounts section - positioned at bottom */}
            <div className="mt-4 pt-3 border-t border-emerald-100">
              <h3 className="text-xs font-medium mb-2 text-emerald-700">Demo Accounts:</h3>
              <div className="grid grid-cols-3 gap-1 text-xs">
                {demoAccounts.map((account) => (
                  <div key={account.username} className="text-center">
                    <div className="font-mono text-gray-700">{account.username}</div>
                    <div className="text-gray-500">{account.role}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                Password: Use any password (demo mode)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}