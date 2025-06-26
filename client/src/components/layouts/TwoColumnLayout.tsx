import React from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { SimpleAudioPlayer } from '@/components/SimpleAudioPlayer';
import { Button } from '@/components/ui/button';
import { Activity } from '@shared/schema';
import { CheckCircle, BookOpen } from 'lucide-react';


interface TwoColumnLayoutProps {
  activity: Activity;
  children: React.ReactNode;
  onVideoProgress?: (progress: number) => void;
  onVideoComplete?: () => void;
  showCompletionMessage?: boolean;
  redirectCountdown?: number;
  onCancelRedirect?: () => void;
}

export function TwoColumnLayout({ 
  activity, 
  children, 
  onVideoProgress, 
  onVideoComplete, 
  showCompletionMessage, 
  redirectCountdown, 
  onCancelRedirect 
}: TwoColumnLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Video Section */}
      <div className="w-full bg-black relative" style={{ height: '60vh' }}>
        {/* Audio Player - Only show on non-video pages */}
        {!activity.videoUrl && (
          <div className="absolute top-4 right-4 z-10">
            <SimpleAudioPlayer 
              courseId={1} 
              pageType="activity"
              activityId={activity.id}
              className="bg-white/90 backdrop-blur-sm"
            />
          </div>
        )}
        
        {activity.videoUrl ? (
          <VideoPlayer 
            url={activity.videoUrl}
            title={activity.title}
            onProgress={onVideoProgress}
            onComplete={onVideoComplete}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-600 max-w-md px-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to Learn</h3>
              <p className="text-gray-500">
                Content for this activity is available below
              </p>
            </div>
          </div>
        )}
        
        {/* Video Completion Overlay - Positioned on top of video */}
        {showCompletionMessage && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center shadow-xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Video completed
              </h3>
              <p className="text-gray-600 mb-3 text-sm">
                Proceed to the next page.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-blue-800 text-sm">
                  Next activity in <span className="font-bold text-blue-900">{redirectCountdown}</span>s
                </p>
                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${((5 - (redirectCountdown || 0)) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <Button 
                onClick={onCancelRedirect}
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                Stay here
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section Below Video */}
      <div className="flex-1 bg-white overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
