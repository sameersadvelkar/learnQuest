/**
 * Asset management utilities for the educational LMS
 * Provides easy access to images, audio, video, and documents
 */

// Asset type definitions
export type AssetType = 'image' | 'audio' | 'video' | 'document';

export interface AssetInfo {
  name: string;
  path: string;
  type: AssetType;
  size?: number;
  lastModified?: Date;
}

// Asset path helpers
export const getAssetPath = (type: AssetType, filename: string): string => {
  return `/src/assets/${type}s/${filename}`;
};

export const getImagePath = (filename: string): string => {
  return getAssetPath('image', filename);
};

export const getAudioPath = (filename: string): string => {
  return getAssetPath('audio', filename);
};

export const getVideoPath = (filename: string): string => {
  return getAssetPath('video', filename);
};

export const getDocumentPath = (filename: string): string => {
  return getAssetPath('document', filename);
};

// Asset URL generator for dynamic imports
export const createAssetUrl = async (type: AssetType, filename: string): Promise<string> => {
  try {
    // Use Vite's glob import for better support
    const modules = import.meta.glob('/src/assets/**/*', { query: '?url', import: 'default', eager: false });
    const assetPath = `/src/assets/${type}s/${filename}`;
    
    if (modules[assetPath]) {
      const url = await modules[assetPath]();
      return url;
    }
    
    // Fallback to direct path
    return `/src/assets/${type}s/${filename}`;
  } catch (error) {
    console.warn(`Asset not found: ${type}s/${filename}`);
    return `/src/assets/${type}s/${filename}`;
  }
};

// Bulk asset loader
export const loadAssets = async (assets: Array<{type: AssetType, filename: string}>): Promise<Record<string, string>> => {
  const assetUrls: Record<string, string> = {};
  
  await Promise.all(
    assets.map(async ({ type, filename }) => {
      const key = `${type}_${filename.split('.')[0]}`;
      assetUrls[key] = await createAssetUrl(type, filename);
    })
  );
  
  return assetUrls;
};

// Asset validation helpers
export const isValidImageFormat = (filename: string): boolean => {
  const validFormats = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  return validFormats.some(format => filename.toLowerCase().endsWith(format));
};

export const isValidAudioFormat = (filename: string): boolean => {
  const validFormats = ['.mp3', '.wav', '.ogg', '.m4a'];
  return validFormats.some(format => filename.toLowerCase().endsWith(format));
};

export const isValidVideoFormat = (filename: string): boolean => {
  const validFormats = ['.mp4', '.webm', '.mov', '.avi'];
  return validFormats.some(format => filename.toLowerCase().endsWith(format));
};

export const isValidDocumentFormat = (filename: string): boolean => {
  const validFormats = ['.pdf', '.doc', '.docx', '.txt', '.md'];
  return validFormats.some(format => filename.toLowerCase().endsWith(format));
};

// Asset type detector
export const detectAssetType = (filename: string): AssetType | null => {
  if (isValidImageFormat(filename)) return 'image';
  if (isValidAudioFormat(filename)) return 'audio';
  if (isValidVideoFormat(filename)) return 'video';
  if (isValidDocumentFormat(filename)) return 'document';
  return null;
};

// Content JSON helper for assets
export const createAssetContent = (type: AssetType, filename: string, options: any = {}) => {
  const basePath = `@/assets/${type}s/${filename}`;
  
  switch (type) {
    case 'image':
      return {
        type: 'image',
        src: basePath,
        alt: options.alt || filename.split('.')[0],
        caption: options.caption,
        width: options.width,
        height: options.height,
        ...options
      };
      
    case 'video':
      return {
        type: 'video',
        src: basePath,
        title: options.title || filename.split('.')[0],
        autoplay: options.autoplay || false,
        controls: options.controls !== false,
        loop: options.loop || false,
        muted: options.muted || false,
        ...options
      };
      
    case 'audio':
      return {
        type: 'audio',
        src: basePath,
        title: options.title || filename.split('.')[0],
        autoplay: options.autoplay || false,
        controls: options.controls !== false,
        loop: options.loop || false,
        ...options
      };
      
    case 'document':
      return {
        type: 'document',
        src: basePath,
        title: options.title || filename.split('.')[0],
        description: options.description,
        downloadable: options.downloadable !== false,
        ...options
      };
      
    default:
      return {
        type: 'file',
        src: basePath,
        filename,
        ...options
      };
  }
};

// Predefined asset collections for common use cases
export const AssetCollections = {
  // Common UI assets
  ui: {
    logo: () => createAssetContent('image', 'logo.png', { alt: 'Logo' }),
    favicon: () => createAssetContent('image', 'favicon.ico', { alt: 'Favicon' }),
    defaultAvatar: () => createAssetContent('image', 'default-avatar.png', { alt: 'Default Avatar' })
  },
  
  // Course-specific assets
  course: {
    heroImage: (filename: string) => createAssetContent('image', filename, { alt: 'Course Hero Image' }),
    introVideo: (filename: string) => createAssetContent('video', filename, { title: 'Course Introduction' }),
    backgroundMusic: (filename: string) => createAssetContent('audio', filename, { loop: true, autoplay: false })
  },
  
  // Interactive elements
  interactive: {
    successSound: () => createAssetContent('audio', 'success.mp3', { title: 'Success Sound' }),
    errorSound: () => createAssetContent('audio', 'error.mp3', { title: 'Error Sound' }),
    clickSound: () => createAssetContent('audio', 'click.mp3', { title: 'Click Sound' }),
    notificationSound: () => createAssetContent('audio', 'notification.mp3', { title: 'Notification Sound' })
  }
};

// Asset preloader for performance
export class AssetPreloader {
  private loadedAssets: Set<string> = new Set();
  
  async preloadImage(src: string): Promise<void> {
    if (this.loadedAssets.has(src)) return;
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedAssets.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }
  
  async preloadAudio(src: string): Promise<void> {
    if (this.loadedAssets.has(src)) return;
    
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.loadedAssets.add(src);
        resolve();
      };
      audio.onerror = reject;
      audio.src = src;
    });
  }
  
  async preloadVideo(src: string): Promise<void> {
    if (this.loadedAssets.has(src)) return;
    
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.oncanplaythrough = () => {
        this.loadedAssets.add(src);
        resolve();
      };
      video.onerror = reject;
      video.src = src;
    });
  }
  
  async preloadAssets(assets: Array<{type: AssetType, src: string}>): Promise<void> {
    await Promise.all(
      assets.map(async ({ type, src }) => {
        switch (type) {
          case 'image':
            return this.preloadImage(src);
          case 'audio':
            return this.preloadAudio(src);
          case 'video':
            return this.preloadVideo(src);
          default:
            return Promise.resolve();
        }
      })
    );
  }
  
  isLoaded(src: string): boolean {
    return this.loadedAssets.has(src);
  }
  
  clear(): void {
    this.loadedAssets.clear();
  }
}

// Export singleton preloader instance
export const assetPreloader = new AssetPreloader();