"use client";

import React, { useState, useCallback } from 'react';
import { PortfolioItem } from '@/lib/types/portfolio';
import { MediaCarousel } from './MediaCarousel';
import { FeedItemActions } from './FeedItemActions';
import { FeedItemInfo } from './FeedItemInfo';
import { usePortfolioActions } from '@/lib/hooks/usePortfolio';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface PortfolioFeedItemProps {
  item: PortfolioItem;
  onNext: () => void;
  onPrevious: () => void;
  onLikeUpdate: (itemId: string, likesCount: number, hasLiked: boolean) => void;
  isCurrent: boolean;
}

export function PortfolioFeedItem({ 
  item, 
  onNext, 
  onPrevious, 
  onLikeUpdate,
  isCurrent 
}: PortfolioFeedItemProps) {
  const { user } = useAuth();
  const { likePortfolio } = usePortfolioActions();
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like portfolio items');
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    const previousLikes = item.likes_count;
    const previousLiked = item.has_liked ?? false;

    // Optimistic update
    onLikeUpdate(item.id, previousLiked ? previousLikes - 1 : previousLikes + 1, !previousLiked);

    try {
      const result = await likePortfolio(item.id);
      onLikeUpdate(item.id, result.likes_count, result.has_liked);
    } catch (error) {
      // Revert on error
      onLikeUpdate(item.id, previousLikes, previousLiked);
      console.error('Failed to like portfolio item:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDoubleTap = useCallback(() => {
    if (!isLiking && (!item.has_liked || !user)) {
      handleLike();
    }
  }, [isLiking, item.has_liked, user]);

  if (!item) return null;

  return (
    <div className="h-full w-full relative bg-white">
      {/* Media Carousel */}
      <MediaCarousel
        mediaUrls={item.media_urls}
        itemId={item.id}
        onNext={onNext}
        onPrevious={onPrevious}
        onDoubleTap={handleDoubleTap}
        isCurrent={isCurrent}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full flex">
          {/* Left: Info Section */}
          <div className="flex-1 flex flex-col justify-end p-4 pb-24 sm:pb-20">
            <FeedItemInfo item={item} />
          </div>

          {/* Right: Actions Section */}
          <div className="w-16 sm:w-20 flex flex-col justify-end items-center pb-24 sm:pb-20 pr-2">
            <FeedItemActions
              item={item}
              onLike={handleLike}
              isLiking={isLiking}
            />
          </div>
        </div>
      </div>
    </div>
  );
}