"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/lib/hooks/usePortfolio';
import { PortfolioItem } from '@/lib/types/portfolio';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { FeedHeader } from '@/_components/profile/portfolio/feed/FeedHeader';
import { PortfolioFeedSkeleton } from '@/_components/profile/portfolio/feed/PortfolioFeedSkeleton';
import { PortfolioFeedItem } from '@/_components/profile/portfolio/feed/PortfolioFeedItem';
import { FeedFilters } from '@/_components/profile/portfolio/feed/FeedFilters';

export default function PortfolioFeedPage() {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [items, setItems] = useState<PortfolioItem[]>([]);

  const {
    items: portfolioItems,
    total,
    isLoading,
    error,
    refetch
  } = usePortfolio({
    is_published: true,
    category: selectedCategory === 'all' ? undefined : selectedCategory as any,
    sort_by: 'created_at',
    sort_order: 'DESC',
    limit: 20
  });

  // Update local items when portfolio data changes
  useEffect(() => {
    if (portfolioItems.length > 0) {
      setItems(portfolioItems);
      // Reset to first item when items change
      setCurrentIndex(0);
    } else {
      setItems([]);
      setCurrentIndex(0);
    }
  }, [portfolioItems]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= items.length - 1) {
        // Optional: Loop back to first item
        // return 0;
        
        // Or stay on last item and show message
        if (items.length > 0) {
          toast.info('You\'ve reached the end of the feed');
        }
        return prev;
      }
      return Math.min(prev + 1, items.length - 1);
    });
  }, [items.length]);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev <= 0) {
        // Optional: Loop to last item
        // return items.length - 1;
        
        // Or stay on first item and show message
        if (items.length > 0) {
          toast.info('You\'re at the beginning of the feed');
        }
        return prev;
      }
      return Math.max(prev - 1, 0);
    });
  }, [items.length]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  const handleLikeUpdate = (itemId: string, likesCount: number, hasLiked: boolean) => {
    setItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, likes_count: likesCount, has_liked: hasLiked }
        : item
    ));
  };

  // Keyboard navigation - Up/Down for posts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default only for up/down arrows to avoid page scroll
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
      }

      if (e.key === 'ArrowDown' || e.key === ' ') {
        handleNext();
      } else if (e.key === 'ArrowUp') {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrevious]);

  // Mouse wheel navigation for posts
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      // Prevent default to avoid page scroll
      e.preventDefault();
      
      // Clear previous timeout
      clearTimeout(wheelTimeout);
      
      // Debounce wheel events to prevent too rapid scrolling
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 30) {
          handleNext();
        } else if (e.deltaY < -30) {
          handlePrevious();
        }
      }, 150);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      clearTimeout(wheelTimeout);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleNext, handlePrevious]);

  // Reset index when items become empty
  useEffect(() => {
    if (items.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= items.length) {
      setCurrentIndex(items.length - 1);
    }
  }, [items, currentIndex]);

  if (error && items.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">Failed to Load Feed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white overflow-hidden select-none">
      {/* Header */}
      <FeedHeader 
        currentIndex={currentIndex}
        totalItems={items.length}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main Feed - Add top padding for header */}
      <div className="h-full pt-32 sm:pt-28 relative">
        {isLoading && items.length === 0 ? (
          <PortfolioFeedSkeleton />
        ) : items.length > 0 && items[currentIndex] ? (
          <>
            {/* Current Item */}
            <PortfolioFeedItem
              item={items[currentIndex]}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onLikeUpdate={handleLikeUpdate}
              isCurrent={true}
            />

            {/* Next Item (preload) */}
            {items[currentIndex + 1] && (
              <div className="absolute inset-0 opacity-0 pointer-events-none">
                <PortfolioFeedItem
                  item={items[currentIndex + 1]}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  onLikeUpdate={handleLikeUpdate}
                  isCurrent={false}
                />
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2 text-gray-900">No Portfolio Items</h2>
              <p className="text-gray-600">
                {selectedCategory === 'all' 
                  ? "No published portfolio items found." 
                  : `No ${selectedCategory} portfolio items found.`
                }
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <FeedFilters
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}