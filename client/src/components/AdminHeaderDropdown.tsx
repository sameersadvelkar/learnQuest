import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, LogOut, User, Settings } from 'lucide-react';

interface AdminHeaderDropdownProps {
  userRole: string;
  username?: string;
}

export function AdminHeaderDropdown({ userRole, username }: AdminHeaderDropdownProps) {
  const { logout } = useAuth();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'SUPER ADMIN';
      case 'admin':
        return 'SCHOOL ADMIN';
      default:
        return role.toUpperCase();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-white/30 text-white border-white/40';
      case 'admin':
        return 'bg-white/20 text-white border-white/30';
      default:
        return 'bg-white/20 text-white border-white/30';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center space-x-2 text-white hover:bg-white/20 border border-white/30 rounded-full px-4"
        >
          <Badge variant="secondary" className={getRoleColor(userRole)}>
            {getRoleDisplay(userRole)}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <div className="px-3 py-2 border-b">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{username || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{getRoleDisplay(userRole)}</p>
            </div>
          </div>
        </div>
        

        <DropdownMenuItem className="flex items-center space-x-2 dropdown-menu-green-hover" style={{ color: '#05aa6d' }}>
          <Settings className="h-4 w-4" style={{ color: '#05aa6d' }} />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={logout}
          className="flex items-center space-x-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}