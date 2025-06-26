/**
 * Utility functions for accessing course-specific media files
 */
import { CourseUtils } from './courseUtils';

export const getCourseImage = (courseId: number, imageName: string): string => {
  // For now, use direct path - this will be enhanced with dynamic discovery
  return `/courses/digital-wellness-safety/assets/images/${imageName}`;
};

export const getCourseVideo = (courseId: number, videoName: string): string => {
  return `/courses/digital-wellness-safety/assets/videos/${videoName}`;
};

export const getCourseAudio = (courseId: number, language: string, audioName: string): string => {
  return `/courses/digital-wellness-safety/assets/audio/${language}/${audioName}`;
};

export const getCourseAssetPath = (courseId: number, assetType: 'images' | 'videos' | 'audio', fileName: string, language?: string): string => {
  if (assetType === 'audio' && language) {
    return `/courses/digital-wellness-safety/assets/${assetType}/${language}/${fileName}`;
  }
  
  return `/courses/digital-wellness-safety/assets/${assetType}/${fileName}`;
};

// Enhanced image functions for specific use cases
export const getCourseHeroImage = (courseId: number, imageName?: string): string => {
  const defaultName = imageName || 'hero.jpg';
  return getCourseImage(courseId, defaultName);
};

export const getActivityImage = (courseId: number, activityId: number, imageName: string): string => {
  return getCourseImage(courseId, `activity-${activityId}-${imageName}`);
};

export const getModuleImage = (courseId: number, moduleId: number, imageName: string): string => {
  return getCourseImage(courseId, `module-${moduleId}-${imageName}`);
};

// JSON-based image loading functions
export const getCourseImageFromJSON = (course: any, imageType: 'hero' | 'logo' | 'banner' | 'thumbnail'): string => {
  if (course.media && typeof course.media === 'string') {
    try {
      const media = JSON.parse(course.media);
      if (media[imageType]) {
        return media[imageType];
      }
    } catch (error) {
      console.warn('Failed to parse course media JSON:', error);
    }
  }

  // Fallback to standard naming convention
  const fallbackMap = {
    hero: 'hero.jpg',
    logo: 'logo.png',
    banner: 'banner.jpg',
    thumbnail: 'thumbnail.jpg'
  };

  return getCourseImage(course.id, fallbackMap[imageType]);
};

export const getActivityImageFromJSON = (activity: any, courseId: number, imageType: string): string => {
  if (!activity.images || !activity.images[imageType]) {
    return '';
  }
  
  const imageName = activity.images[imageType];
  return getCourseImage(courseId, imageName);
};

export const getCourseImageByType = (courseId: number, imageType: 'hero' | 'thumbnail' | 'logo' | 'banner', customName?: string): string => {
  if (customName) {
    return getCourseImage(courseId, customName);
  }
  
  const typeMap = {
    hero: 'hero.jpg',
    thumbnail: 'thumbnail.jpg',
    logo: 'logo.png',
    banner: 'banner.jpg'
  };
  
  return getCourseImage(courseId, typeMap[imageType]);
};