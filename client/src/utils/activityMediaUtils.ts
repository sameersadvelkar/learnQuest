import { Activity } from '@shared/schema';

export interface ActivityMediaAssets {
  hero?: string;
  banner?: string;
  thumbnail?: string;
  images?: string[];
  videos?: string[];
  diagrams?: string[];
}

/**
 * Parse activity media from JSON string and validate module scope
 */
export function parseActivityMedia(activity: Activity): ActivityMediaAssets | null {
  if (!activity.media) return null;
  
  try {
    const media = JSON.parse(activity.media) as ActivityMediaAssets;
    return validateModuleScope(media, activity.moduleId);
  } catch (error) {
    console.warn('Failed to parse activity media:', error);
    return null;
  }
}

/**
 * Validate that all media URLs belong to the correct module scope
 */
function validateModuleScope(media: ActivityMediaAssets, moduleId: number): ActivityMediaAssets {
  const modulePattern = `/modules/module-${moduleId}/assets/media/`;
  
  const validateUrl = (url: string): string | null => {
    if (!url.includes(modulePattern)) {
      console.warn(`Media URL ${url} does not belong to module ${moduleId} scope - access denied`);
      return null;
    }
    return url;
  };
  
  const validatedMedia: ActivityMediaAssets = {};
  
  if (media.hero) {
    const validated = validateUrl(media.hero);
    if (validated) validatedMedia.hero = validated;
  }
  
  if (media.banner) {
    const validated = validateUrl(media.banner);
    if (validated) validatedMedia.banner = validated;
  }
  
  if (media.thumbnail) {
    const validated = validateUrl(media.thumbnail);
    if (validated) validatedMedia.thumbnail = validated;
  }
  
  if (media.images) {
    validatedMedia.images = media.images
      .map(validateUrl)
      .filter((url): url is string => url !== null);
  }
  
  if (media.videos) {
    validatedMedia.videos = media.videos
      .map(validateUrl)
      .filter((url): url is string => url !== null);
  }
  
  if (media.diagrams) {
    validatedMedia.diagrams = media.diagrams
      .map(validateUrl)
      .filter((url): url is string => url !== null);
  }
  
  return validatedMedia;
}

/**
 * Get the primary image for an activity (hero, banner, or first image)
 */
export function getActivityPrimaryImage(activity: Activity): string | null {
  const media = parseActivityMedia(activity);
  if (!media) return null;
  
  return media.hero || media.banner || (media.images && media.images[0]) || null;
}

/**
 * Get all images from an activity (including hero, banner, and image arrays)
 */
export function getAllActivityImages(activity: Activity): string[] {
  const media = parseActivityMedia(activity);
  if (!media) return [];
  
  const images: string[] = [];
  
  if (media.hero) images.push(media.hero);
  if (media.banner) images.push(media.banner);
  if (media.thumbnail) images.push(media.thumbnail);
  if (media.images) images.push(...media.images);
  if (media.diagrams) images.push(...media.diagrams);
  
  return images;
}

/**
 * Get videos from an activity
 */
export function getActivityVideos(activity: Activity): string[] {
  const media = parseActivityMedia(activity);
  if (!media || !media.videos) return [];
  
  return media.videos;
}

/**
 * Check if an image URL is valid (supports various formats)
 */
export function isValidImageFormat(url: string): boolean {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i;
  return imageExtensions.test(url);
}

/**
 * Get image file extension
 */
export function getImageExtension(url: string): string {
  const match = url.match(/\.([^.]+)$/);
  return match ? match[1].toLowerCase() : '';
}

/**
 * Create fallback image URL if original fails to load
 */
export function createFallbackImageUrl(originalUrl: string): string {
  // Don't use fallback - let the component handle missing images appropriately
  return originalUrl;
}