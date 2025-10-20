import React, { useState, useEffect } from 'react';
import { Star, Briefcase, Users, ThumbsUp, MessageCircle, Loader2 } from 'lucide-react';
import { useReviews, useCanReview } from '@/lib/hooks/useReviews';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReviewsTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

export default function ReviewsTab({ profile, isOwnProfile = false }: ReviewsTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const router = useRouter();

  // Fetch reviews for this worker
  const { 
    reviews, 
    total, 
    page, 
    totalPages, 
    averageRating, 
    ratingDistribution, 
    isLoading, 
    error, 
    refetch 
  } = useReviews({
    reviewee_id: profile.id,
    page: currentPage,
    limit: limit,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });

  // Handle pagination
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to page 1 when profile changes
  useEffect(() => {
    setCurrentPage(1);
  }, [profile.id]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Render stars helper
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-6 w-6'
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`${sizeClasses[size]} ${
              star <= rating 
                ? 'text-yellow-500 fill-current' 
                : 'text-gray-300'
            }`} 
          />
        ))}
      </div>
    );
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="bg-white p-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error && reviews.length === 0) {
    return (
      <div className="bg-white p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <MessageCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load reviews</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayRating = averageRating ? averageRating.toFixed(1) : '0.0';
  const totalReviews = total || reviews.length;

  // Calculate rating distribution from API data or calculate locally
  const calculatedRatingDistribution = Array.isArray(ratingDistribution) ? ratingDistribution : 
    [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter((r: any) => Math.round(r.rating) === rating).length,
      percentage: reviews.length ? 
        (reviews.filter((r: any) => Math.round(r.rating) === rating).length / reviews.length) * 100 
        : 0
    }));

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <div className="text-5xl font-bold text-gray-900 mb-2">{displayRating}</div>
            <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
              {renderStars(Math.round(parseFloat(displayRating)), 'lg')}
            </div>
            <div className="text-gray-600">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</div>
          </div>
          
          {/* Rating Breakdown */}
          <div className="flex-1 max-w-md space-y-2">
            {calculatedRatingDistribution.map(({ rating, count, percentage }: { rating: number; count: number; percentage: number; }) => (
              <div key={rating} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>

          {/* Review Actions */}
          {isOwnProfile && (
            <div className="text-center lg:text-right">
              <div className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium">
                Reviews are submitted by clients
              </div>
              <p className="text-sm text-gray-600 mt-2">After completing bookings</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y">
        {reviews.map((review: any) => (
          <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              {/* Reviewer Avatar */}
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {review.reviewer?.profile_photo ? (
                  <img 
                    src={review.reviewer.profile_photo} 
                    alt={review.reviewer.display_name || review.reviewer.name} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (review.reviewer?.display_name || review.reviewer?.name || 'U').charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/dashboard/profile/${review.reviewer?.id}`} className="font-semibold text-gray-900">
                        {review.reviewer?.display_name || review.reviewer?.name || 'Anonymous User'}
                      </Link>
                      {review.reviewer?.verification_status === 'verified' && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {renderStars(review.rating)}
                      <span>{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                {/* Job Reference */}
                {review.booking?.job_title && (
                  <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg font-medium mb-3">
                    <Briefcase className="h-3 w-3" />
                    {review.booking.job_title}
                  </div>
                )}

                {/* Review Categories */}
                {review.categories && review.categories.length > 0 && (
                  <div className="flex flex-wrap gap-4 mb-3">
                    {review.categories.map((category: any, index: number) => (
                      <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                        <span className="font-medium capitalize">{category.category}:</span>
                        {renderStars(category.rating, 'sm')}
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Actions */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful (0)
                  </button>
                  
                  {isOwnProfile && (
                    <button className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {reviews.length === 0 && !isLoading && (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isOwnProfile ? 'No Reviews Yet' : 'No Reviews'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isOwnProfile 
                ? 'Complete your first booking to receive reviews from clients.'
                : 'This user hasn\'t received any reviews yet.'
              }
            </p>
            {isOwnProfile && (
              <Link 
                href="/jobs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Find Your First Job
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {reviews.length > 0 && currentPage < totalPages && (
        <div className="text-center">
          <button 
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Reviews'
            )}
          </button>
        </div>
      )}

      {/* Showing X of Y reviews */}
      {reviews.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {reviews.length} of {total} review{total !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}