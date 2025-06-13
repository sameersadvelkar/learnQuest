import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function SkeletonCard({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Card key={index} className={`${className} animate-pulse`}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg skeleton"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded skeleton w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded skeleton w-1/2"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded skeleton"></div>
              <div className="h-3 bg-gray-200 rounded skeleton w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded skeleton w-4/6"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {[...Array(columns)].map((_, index) => (
          <div key={index} className="h-8 bg-gray-200 rounded skeleton flex-1"></div>
        ))}
      </div>
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {[...Array(columns)].map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 rounded skeleton flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded skeleton w-24"></div>
            <div className="w-8 h-8 bg-gray-200 rounded-lg skeleton"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded skeleton w-20 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded-full skeleton"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Spinner({ size = 'medium', className = '' }: SpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary ${sizeClasses[size]} ${className}`}></div>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white bg-gray-800 rounded-lg p-6 flex flex-col items-center space-y-4">
        <Spinner size="large" />
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}

export function InlineLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center space-x-3 py-8">
      <Spinner />
      <span className="text-muted-foreground">{message}</span>
    </div>
  );
}