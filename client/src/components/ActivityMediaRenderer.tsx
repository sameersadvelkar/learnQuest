import React, { useState } from 'react';
import { Activity } from '@shared/schema';
import { parseActivityMedia, getAllActivityImages, getActivityVideos, isValidImageFormat, createFallbackImageUrl } from '@/utils/activityMediaUtils';

interface ActivityMediaRendererProps {
  activity: Activity;
  showType?: 'hero' | 'banner' | 'thumbnail' | 'all' | 'videos';
  className?: string;
  maxImages?: number;
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = "",
  onError 
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      onError?.();
    }
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <div className="text-center text-gray-500 p-4">
          <div className="text-2xl mb-2">📷</div>
          <p className="text-xs">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export const ActivityMediaRenderer: React.FC<ActivityMediaRendererProps> = ({
  activity,
  showType = 'all',
  className = "",
  maxImages
}) => {
  const media = parseActivityMedia(activity);
  
  if (!media) {
    return null;
  }

  const renderHeroImage = () => {
    if (!media.hero) return null;
    
    return (
      <ImageWithFallback
        src={media.hero}
        alt={`${activity.title} Hero Image`}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  };

  const renderBannerImage = () => {
    if (!media.banner) return null;
    
    return (
      <div className="activity-banner-container mb-4">
        <ImageWithFallback
          src={media.banner}
          alt={`${activity.title} Banner`}
          className={`w-full h-32 object-cover rounded-md ${className}`}
        />
      </div>
    );
  };

  const renderThumbnailImage = () => {
    if (!media.thumbnail) return null;
    
    return (
      <div className="activity-thumbnail-container">
        <ImageWithFallback
          src={media.thumbnail}
          alt={`${activity.title} Thumbnail`}
          className={`w-24 h-24 object-cover rounded-md ${className}`}
        />
      </div>
    );
  };

  const renderImageGallery = () => {
    // Only show images array, not hero/banner to avoid duplication
    if (!media.images || media.images.length === 0) return null;

    const imagesToShow = maxImages ? media.images.slice(0, maxImages) : media.images;

    return (
      <div className="activity-image-gallery mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {imagesToShow.map((imageUrl, index) => {
            if (!isValidImageFormat(imageUrl)) return null;
            
            return (
              <div key={index} className="image-item">
                <ImageWithFallback
                  src={imageUrl}
                  alt={`${activity.title} Image ${index + 1}`}
                  className={`w-full h-48 object-cover rounded-md hover:scale-105 transition-transform duration-200 ${className}`}
                />
              </div>
            );
          })}
        </div>
        {maxImages && media.images.length > maxImages && (
          <p className="text-sm text-gray-600 mt-2">
            +{media.images.length - maxImages} more images
          </p>
        )}
      </div>
    );
  };

  const renderVideos = () => {
    const videos = getActivityVideos(activity);
    if (videos.length === 0) return null;

    return (
      <div className="activity-videos mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((videoUrl, index) => (
            <div key={index} className="video-item">
              <video 
                controls 
                className={`w-full h-48 object-cover rounded-md ${className}`}
                preload="metadata"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDiagrams = () => {
    if (!media.diagrams || media.diagrams.length === 0) return null;

    return (
      <div className="activity-diagrams mb-6">
        <h4 className="text-lg font-semibold mb-3">Diagrams & Illustrations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {media.diagrams.map((diagramUrl, index) => (
            <div key={index} className="diagram-item">
              <ImageWithFallback
                src={diagramUrl}
                alt={`${activity.title} Diagram ${index + 1}`}
                className={`w-full h-auto object-contain rounded-md border ${className}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render based on showType
  switch (showType) {
    case 'hero':
      return renderHeroImage();
    case 'banner':
      return renderBannerImage();
    case 'thumbnail':
      return renderThumbnailImage();
    case 'videos':
      return renderVideos();
    case 'all':
    default:
      return (
        <div className="activity-media-container">
          {/* Priority: Hero > Banner > First Image from Gallery */}
          {media.hero ? renderHeroImage() : media.banner ? renderBannerImage() : null}
          
          {/* Only show image gallery if no hero/banner, or if it has additional images */}
          {(!media.hero && !media.banner) || (media.images && media.images.length > 0) ? renderImageGallery() : null}
          
          {renderDiagrams()}
          {renderVideos()}
        </div>
      );
  }
};

export default ActivityMediaRenderer;