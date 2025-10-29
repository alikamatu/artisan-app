import React from 'react';

export function PortfolioFeedSkeleton() {
  return (
    <div className="h-full w-full relative bg-gray-100 animate-pulse">
      {/* Mock Media Area */}
      <div className="h-full w-full bg-gray-200" />
      
      {/* Mock Content */}
      <div className="absolute inset-0">
        <div className="h-full flex">
          {/* Left Info */}
          <div className="flex-1 flex flex-col justify-end p-4 pb-20">
            <div className="bg-white/95 rounded-2xl p-4 space-y-4 shadow-lg">
              {/* Worker Info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                </div>
              </div>
              
              {/* Title & Description */}
              <div className="space-y-2">
                <div className="h-6 w-3/4 bg-gray-300 rounded" />
                <div className="h-4 w-full bg-gray-300 rounded" />
                <div className="h-4 w-2/3 bg-gray-300 rounded" />
              </div>
              
              {/* Details */}
              <div className="flex gap-3 flex-wrap">
                <div className="h-6 w-20 bg-gray-300 rounded-full" />
                <div className="h-6 w-16 bg-gray-300 rounded-full" />
                <div className="h-6 w-24 bg-gray-300 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="w-20 flex flex-col justify-end items-center pb-20 space-y-4 pr-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 bg-white/90 rounded-full shadow-lg" />
                <div className="h-3 w-8 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}