import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageDisplayProps {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  className?: string;
  maxWidth?: string;
  rounded?: boolean;
  shadow?: boolean;
}

export function ImageDisplay({ 
  src, 
  alt, 
  title, 
  caption, 
  className,
  maxWidth = "100%",
  rounded = true,
  shadow = true
}: ImageDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div className={cn(
        "flex items-center justify-center p-8 bg-gray-100 border border-gray-200",
        rounded && "rounded-lg",
        className
      )}>
        <div className="text-center text-gray-500">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="text-sm">Failed to load image</p>
          {title && <p className="text-xs text-gray-400 mt-1">{title}</p>}
        </div>
      </div>
    );
  }

  return (
    <figure className={cn("relative", className)} style={{ maxWidth }}>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse",
          rounded && "rounded-lg"
        )}>
          <div className="text-gray-400">Loading...</div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-auto transition-opacity duration-300",
          rounded && "rounded-lg",
          shadow && "shadow-md",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
      
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}