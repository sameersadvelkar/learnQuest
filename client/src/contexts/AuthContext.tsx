import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export type UserRole = 'student' | 'admin' | 'super_admin';

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Demo users for testing
  const demoUsers: User[] = [
    { id: 1, username: 'student', email: 'student@example.com', role: 'student' },
    { id: 2, username: 'admin', email: 'admin@example.com', role: 'admin' },
    { id: 3, username: 'superadmin', email: 'superadmin@example.com', role: 'super_admin' },
  ];

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        localStorage.removeItem('auth-user');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // First check demo users for backwards compatibility
      const demoUser = demoUsers.find(u => u.username === username);
      if (demoUser) {
        localStorage.setItem('auth-user', JSON.stringify(demoUser));
        dispatch({ type: 'SET_USER', payload: demoUser });
        return true;
      }

      // Try to authenticate with the backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('auth-user', JSON.stringify(user));
        dispatch({ type: 'SET_USER', payload: user });
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    dispatch({ type: 'SET_LOADING', payload: false });
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth-user');
    dispatch({ type: 'LOGOUT' });
  };

  const hasRole = (role: UserRole): boolean => {
    return state.user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return state.user ? roles.includes(state.user.role) : false;
  };

  return (
    <AuthContext.Provider value={{ state, login, logout, hasRole, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}