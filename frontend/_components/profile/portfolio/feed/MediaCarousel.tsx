"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';

interface MediaCarouselProps {
  mediaUrls: string[];
  itemId: string;
  onNext: () => void;
  onPrevious: () => void;
  onDoubleTap: () => void;
  isCurrent: boolean;
}

export function MediaCarousel({ 
  mediaUrls, 
  itemId, 
  onNext, 
  onPrevious, 
  onDoubleTap,
  isCurrent 
}: MediaCarouselProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null);
  const [lastTap, setLastTap] = useState(0);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [singleTapTimeout, setSingleTapTimeout] = useState<NodeJS.Timeout | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMedia = mediaUrls[currentMediaIndex];
  const isVideo = currentMedia?.match(/\.(mp4|mov|avi|mkv|webm)$/i);
  const hasMultipleMedia = mediaUrls.length > 1;

  // Handle video playback
  useEffect(() => {
    if (!isCurrent || !isVideo || !videoRef.current) return;

    const video = videoRef.current;
    
    const handlePlay = async () => {
      try {
        if (isPlaying) {
          await video.play();
        } else {
          video.pause();
        }
      } catch (err) {
        console.error('Video playback error:', err);
      }
    };

    handlePlay();
  }, [isCurrent, isPlaying, isVideo]);

  // Reset state when item changes
  useEffect(() => {
    setCurrentMediaIndex(0);
    setIsPlaying(true);
    setIsMuted(true);
  }, [itemId]);

  const handleNextMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentMediaIndex < mediaUrls.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    } else {
      // If last media, go to next post
      onNext();
    }
  }, [currentMediaIndex, mediaUrls.length, onNext]);

  const handlePreviousMedia = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    } else {
      // If first media, go to previous post
      onPrevious();
    }
  }, [currentMediaIndex, onPrevious]);

  // NEW: Handle click/tap based on position
  const handlePositionBasedTap = useCallback((clientY: number) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const relativeY = clientY - containerRect.top;
    const percentageY = (relativeY / containerHeight) * 100;

    // Define zones
    const topZonePercentage = 20;    // Top 20% - Previous post
    const bottomZonePercentage = 20; // Bottom 20% - Next post
    const middleZonePercentage = 60; // Middle 60% - Next media

    if (percentageY < topZonePercentage) {
      // Top zone - Previous post
      onPrevious();
    } else if (percentageY > (100 - bottomZonePercentage)) {
      // Bottom zone - Next post
      onNext();
    } else {
      // Middle zone - Next media
      handleNextMedia();
    }
  }, [onPrevious, onNext, handleNextMedia]);

  const handleTap = useCallback((clientY?: number) => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTap;

    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
      // Double tap detected
      if (singleTapTimeout) {
        clearTimeout(singleTapTimeout);
        setSingleTapTimeout(null);
      }
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 600);
      onDoubleTap();
      setLastTap(0);
    } else {
      // Single tap - set timeout to handle after double tap window
      setLastTap(now);
      const timeout = setTimeout(() => {
        if (clientY !== undefined) {
          handlePositionBasedTap(clientY);
        } else {
          handleNextMedia();
        }
        setSingleTapTimeout(null);
      }, 300);
      setSingleTapTimeout(timeout);
    }
  }, [lastTap, singleTapTimeout, handlePositionBasedTap, handleNextMedia, onDoubleTap]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    const distanceX = touchEnd.x - touchStart.x;
    const distanceY = touchEnd.y - touchStart.y;
    const timeDiff = touchEnd.time - touchStart.time;
    
    // Increased sensitivity for better UX
    const minSwipeDistance = 30;
    const maxSwipeTime = 300;

    // Check for tap (minimal movement)
    const isTap = Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10 && timeDiff < 200;
    
    if (isTap) {
      handleTap(touchEnd.y);
      setTouchStart(null);
      return;
    }

    // Check if swipe is valid (within time and distance constraints)
    if (timeDiff > maxSwipeTime) {
      setTouchStart(null);
      return;
    }

    // Determine if swipe is more horizontal or vertical
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    
    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      // Horizontal swipe - navigate media
      if (distanceX > 0) {
        handlePreviousMedia();
      } else {
        handleNextMedia();
      }
    } else if (!isHorizontalSwipe && Math.abs(distanceY) > minSwipeDistance) {
      // Vertical swipe - navigate posts
      if (distanceY > 0) {
        onPrevious(); // Swipe down - previous post
      } else {
        onNext(); // Swipe up - next post
      }
    }

    setTouchStart(null);
  };

  // NEW: Handle click for desktop users with position detection
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on controls or navigation arrows
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('.media-control') ||
      target.closest('.navigation-arrow')
    ) {
      return;
    }
    
    handleTap(e.clientY);
  };

  const togglePlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (singleTapTimeout) {
        clearTimeout(singleTapTimeout);
      }
    };
  }, [singleTapTimeout]);

  if (!currentMedia) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-600">
        No media available
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-full w-full relative bg-gray-100 flex items-center justify-center overflow-hidden touch-pan-y cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Media Display - Centered and Responsive */}
      <div className="relative w-full h-full flex items-center justify-center">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentMedia}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
            onError={(e) => console.error('Video loading error:', e)}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={currentMedia}
              alt="Portfolio media"
              fill
              className="object-contain"
              priority={isCurrent}
              sizes="100vw"
              onError={(e) => {
                console.error('Image loading error:', e);
                // You can set a fallback image here
              }}
            />
          </div>
        )}
      </div>

      {/* NEW: Visual zone indicators (optional - for debugging/UX) */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top zone - Previous post */}
        <div className="absolute top-0 left-0 right-0 h-1/5 bg-transparent border-b border-transparent flex items-center justify-center">
          <span className="text-transparent text-xs font-semibold bg-transparent px-2 py-1 rounded-full">
          </span>
        </div>
        {/* Bottom zone - Next post */}
        <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-transparent border-t border-transparent flex items-center justify-center">
          <span className="text-transparent text-xs font-semibold bg-transparent px-2 py-1 rounded-full">
          </span>
        </div>
      </div>

      {/* Media Controls for Video */}
      {isVideo && (
        <div className="media-control absolute bottom-4 left-4 flex items-center gap-3 pointer-events-auto z-20">
          <button
            onClick={togglePlayback}
            className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white shadow-lg transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-2 bg-white/90 text-gray-800 rounded-full hover:bg-white shadow-lg transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      )}

      {/* Navigation Arrows - Only show if multiple media */}
      {hasMultipleMedia && (
        <>
          <button
            onClick={handlePreviousMedia}
            className={`navigation-arrow absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 text-gray-800 rounded-full hover:bg-white shadow-lg transition-all pointer-events-auto z-20 ${
              currentMediaIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentMediaIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleNextMedia}
            className={`navigation-arrow absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 text-gray-800 rounded-full hover:bg-white shadow-lg transition-all pointer-events-auto z-20 ${
              currentMediaIndex === mediaUrls.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentMediaIndex === mediaUrls.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Media Indicators */}
      {hasMultipleMedia && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 pointer-events-none z-20">
          {mediaUrls.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentMediaIndex 
                  ? 'bg-gray-800 w-6' 
                  : 'bg-gray-400 w-1.5'
              }`}
            />
          ))}
        </div>
      )}

      {/* Double Tap Like Animation */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="text-red-500 text-6xl animate-ping">
            ❤️
          </div>
        </div>
      )}
    </div>
  );
}