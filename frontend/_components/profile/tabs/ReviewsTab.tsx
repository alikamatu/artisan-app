import React from 'react';
import { Star, Briefcase, Users, ThumbsUp, MessageCircle } from 'lucide-react';

interface ReviewsTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

export default function ReviewsTab({ profile, isOwnProfile = false }: ReviewsTabProps) {
  // Mock reviews data - replace with actual API call
  const reviews = [
    {
      id: 1,
      reviewer: { 
        name: 'John Doe', 
        photo: null,
        rating: 4.8
      },
      rating: 5,
      comment: 'Excellent work! Very professional and delivered on time. Would definitely hire again for future projects. The attention to detail was impressive.',
      date: '2024-01-15',
      job: 'Plumbing Repair',
      helpful: 12,
      replies: 1
    },
    {
      id: 2,
      reviewer: { 
        name: 'Sarah Smith', 
        photo: null,
        rating: 4.5
      },
      rating: 4,
      comment: 'Good quality work, communication could be better but overall satisfied with the results. Would recommend for similar projects.',
      date: '2024-01-10',
      job: 'Electrical Installation',
      helpful: 8,
      replies: 0
    },
    {
      id: 3,
      reviewer: { 
        name: 'Michael Brown', 
        photo: null,
        rating: 4.9
      },
      rating: 5,
      comment: 'Outstanding service! Went above and beyond to ensure everything was perfect. Very knowledgeable and professional.',
      date: '2024-01-08',
      job: 'Kitchen Renovation',
      helpful: 15,
      replies: 1
    }
  ];

  const averageRating = reviews.length 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
            <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-6 w-6 ${
                    parseFloat(averageRating) >= star 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            <div className="text-gray-600">{reviews.length} reviews</div>
          </div>
          
          {/* Rating Breakdown */}
          <div className="flex-1 max-w-md space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
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
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Request Review
              </button>
              <p className="text-sm text-gray-600 mt-2">Ask satisfied clients for feedback</p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg border divide-y">
        {reviews.map((review) => (
          <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              {/* Reviewer Avatar */}
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {review.reviewer.photo ? (
                  <img src={review.reviewer.photo} alt={review.reviewer.name} className="w-full h-full rounded-full" />
                ) : (
                  review.reviewer.name.charAt(0)
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Review Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{review.reviewer.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span>{review.reviewer.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`h-4 w-4 ${
                              star <= review.rating 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                      <span>
                        {new Date(review.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Comment */}
                <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                {/* Job Reference */}
                <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg font-medium mb-3">
                  <Briefcase className="h-3 w-3" />
                  {review.job}
                </div>

                {/* Review Actions */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    Helpful ({review.helpful})
                  </button>
                  
                  {review.replies > 0 && (
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      {review.replies} {review.replies === 1 ? 'reply' : 'replies'}
                    </button>
                  )}

                  {isOwnProfile && (
                    <button className="ml-auto text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Reply
                    </button>
                  )}
                </div>

                {/* Owner Reply Section */}
                {isOwnProfile && review.replies === 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <button className="w-full text-left p-3 border border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-600">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Reply to this review</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {reviews.length === 0 && (
          <div className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isOwnProfile ? 'No Reviews Yet' : 'No Reviews'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isOwnProfile 
                ? 'Complete your first job to receive reviews from clients.'
                : 'This user hasn\'t received any reviews yet.'
              }
            </p>
            {isOwnProfile && (
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Get Your First Client
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {reviews.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}