import React from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Activity } from '@shared/schema';

interface TwoColumnLayoutProps {
  activity: Activity;
  children: React.ReactNode;
}

export function TwoColumnLayout({ activity, children }: TwoColumnLayoutProps) {
  return (
    <div className="flex-1 flex">
      {/* Video Section */}
      <div className="flex-1 bg-black relative">
        {activity.videoUrl ? (
          <VideoPlayer 
            url={activity.videoUrl}
            title={activity.title}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <i className="fas fa-video text-2xl"></i>
              </div>
              <p>No video available for this activity</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {children}
      </div>
    </div>
  );
}
