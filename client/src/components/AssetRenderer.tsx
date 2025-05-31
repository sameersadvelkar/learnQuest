import React, { useState, useEffect } from 'react';
import { ImageDisplay } from '@/components/ImageDisplay';
import { VideoPlayer } from '@/components/VideoPlayer';
import { createAssetUrl, detectAssetType } from '@/lib/assets';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Music, Video, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetRendererProps {
  content: {
    type: string;
    src: string;
    alt?: string;
    title?: string;
    caption?: string;
    width?: string | number;
    height?: string | number;
    autoplay?: boolean;
    controls?: boolean;
    loop?: boolean;
    muted?: boolean;
    downloadable?: boolean;
    description?: string;
  };
  className?: string;
  onComplete?: () => void;
}

export function AssetRenderer({ content, className, onComplete }: AssetRendererProps) {
  const [assetUrl, setAssetUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (content.src.startsWith('@/assets/')) {
          // Extract the path and filename from the asset reference
          const pathParts = content.src.replace('@/assets/', '').split('/');
          const filename = pathParts[pathParts.length - 1];
          const assetType = detectAssetType(filename);
          
          if (assetType) {
            const url = await createAssetUrl(assetType, filename);
            setAssetUrl(url);
          } else {
            setError('Unsupported asset type');
          }
        } else {
          // Direct URL
          setAssetUrl(content.src);
        }
      } catch (err) {
        setError('Failed to load asset');
        console.error('Asset loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAsset();
  }, [content.src]);

  const renderContent = () => {
    if (loading) {
      return (
        <Card className={className}>
          <CardContent className="p-6 text-center">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="text-gray-500">Loading asset...</div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (error || !assetUrl) {
      return (
        <Card className={className}>
          <CardContent className="p-6 text-center">
            <div className="text-red-500">
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p>{error || 'Asset not found'}</p>
              <p className="text-sm text-gray-500 mt-1">{content.src}</p>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (content.type) {
      case 'image':
        return (
          <Card className={className}>
            <CardContent className="p-6">
              {content.title && (
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  {content.title}
                </h3>
              )}
              <ImageDisplay
                src={assetUrl}
                alt={content.alt || 'Image'}
                title={content.title}
                caption={content.caption}
                maxWidth={content.width ? String(content.width) : undefined}
              />
            </CardContent>
          </Card>
        );

      case 'video':
        return (
          <Card className={className}>
            <CardContent className="p-6">
              {content.title && (
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Video className="w-5 h-5 mr-2" />
                  {content.title}
                </h3>
              )}
              <VideoPlayer
                url={assetUrl}
                title={content.title || 'Video'}
                onComplete={onComplete}
              />
              {content.description && (
                <p className="text-gray-600 mt-4">{content.description}</p>
              )}
            </CardContent>
          </Card>
        );

      case 'audio':
        return (
          <Card className={className}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Music className="w-5 h-5 mr-2" />
                {content.title || 'Audio'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <audio
                  src={assetUrl}
                  controls={content.controls !== false}
                  autoPlay={content.autoplay || false}
                  loop={content.loop || false}
                  muted={content.muted || false}
                  className="w-full"
                  onEnded={onComplete}
                >
                  Your browser does not support the audio element.
                </audio>
                {content.description && (
                  <p className="text-gray-600 mt-2 text-sm">{content.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 'document':
        return (
          <Card className={className}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {content.title || 'Document'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {content.description && (
                  <p className="text-gray-600 mb-4">{content.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Click to view document
                  </span>
                  <div className="space-x-2">
                    <Button
                      onClick={() => window.open(assetUrl, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      View
                    </Button>
                    {content.downloadable !== false && (
                      <Button
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = assetUrl;
                          a.download = content.title || 'document';
                          a.click();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className={className}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {content.title || 'File'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600 mb-4">
                  {content.description || 'Click to view or download this file'}
                </p>
                <Button
                  onClick={() => window.open(assetUrl, '_blank')}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Open File
                </Button>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return renderContent();
}

// Asset gallery component for displaying multiple assets
interface AssetGalleryProps {
  assets: Array<{
    type: string;
    src: string;
    alt?: string;
    title?: string;
    caption?: string;
  }>;
  className?: string;
  columns?: number;
}

export function AssetGallery({ assets, className, columns = 3 }: AssetGalleryProps) {
  return (
    <div className={cn("grid gap-4", className)} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {assets.map((asset, index) => (
        <AssetRenderer key={index} content={asset} />
      ))}
    </div>
  );
}