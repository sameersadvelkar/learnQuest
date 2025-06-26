import React from 'react';
import { getCourseImageFromJSON, getActivityImageFromJSON } from '@/utils/mediaUtils';

interface JSONImageRendererProps {
  course?: any;
  activity?: any;
  courseId: number;
  imageType: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function JSONImageRenderer({ 
  course, 
  activity, 
  courseId, 
  imageType, 
  alt, 
  className = '', 
  fallbackSrc 
}: JSONImageRendererProps) {
  const getImageSrc = () => {
    if (activity) {
      return getActivityImageFromJSON(activity, courseId, imageType);
    }
    if (course) {
      return getCourseImageFromJSON(course, imageType as 'hero' | 'logo' | 'banner' | 'thumbnail');
    }
    return '';
  };

  const imageSrc = getImageSrc();

  if (!imageSrc) {
    return fallbackSrc ? (
      <img 
        src={fallbackSrc} 
        alt={alt} 
        className={className}
      />
    ) : null;
  }

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className}
      onError={(e) => {
        if (fallbackSrc) {
          const target = e.target as HTMLImageElement;
          target.src = fallbackSrc;
        }
      }}
    />
  );
}

// Helper component for course images
interface CourseImageProps {
  course: any;
  imageType: 'hero' | 'logo' | 'banner' | 'thumbnail';
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function CourseImage({ course, imageType, alt, className, fallbackSrc }: CourseImageProps) {
  return (
    <JSONImageRenderer 
      course={course}
      courseId={course.id}
      imageType={imageType}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
    />
  );
}

// Helper component for activity images
interface ActivityImageProps {
  activity: any;
  courseId: number;
  imageType: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function ActivityImage({ activity, courseId, imageType, alt, className, fallbackSrc }: ActivityImageProps) {
  return (
    <JSONImageRenderer 
      activity={activity}
      courseId={courseId}
      imageType={imageType}
      alt={alt}
      className={className}
      fallbackSrc={fallbackSrc}
    />
  );
}