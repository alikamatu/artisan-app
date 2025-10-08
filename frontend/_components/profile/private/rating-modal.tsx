"use client";

import React, { useState } from 'react';
import { X, Star, Loader2, ThumbsUp, ThumbsDown, AlertCircle } from 'lucide-react';

interface RatingModalProps {
  worker: any;
  jobTitle: string;
  onClose: () => void;
  onSubmit: (rating: number, review: string, categories?: any[]) => void;
  isLoading: boolean;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  worker,
  jobTitle,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [categories, setCategories] = useState([
    { category: 'Quality of Work', rating: 0 },
    { category: 'Professionalism', rating: 0 },
    { category: 'Communication', rating: 0 },
    { category: 'Timeliness', rating: 0 }
  ]);

  const handleCategoryRating = (index: number, categoryRating: number) => {
    const newCategories = [...categories];
    newCategories[index].rating = categoryRating;
    setCategories(newCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      return;
    }
    onSubmit(rating, review, categories);
  };

  const isFormValid = rating > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 p-6 border-b border-gray-200">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Star className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Rate Your Experience</h3>
            <p className="text-gray-600 text-sm">
              How was your experience with {worker?.display_name || worker?.name}?
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-1">{jobTitle}</h4>
            <p className="text-sm text-gray-600">
              Worker: {worker?.display_name || worker?.name}
            </p>
          </div>

          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Overall Rating *
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Category Ratings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate Specific Areas
            </label>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex-1">{category.category}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleCategoryRating(index, star)}
                        className="p-1 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= category.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
              Your Review (Optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share details about your experience. What did you like? What could be improved?"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              Submit Review
            </button>
          </div>

          {!isFormValid && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              Please select an overall rating to submit your review
            </div>
          )}
        </form>
      </div>
    </div>
  );
};