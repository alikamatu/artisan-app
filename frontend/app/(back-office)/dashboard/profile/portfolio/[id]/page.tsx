"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePortfolioActions } from '@/lib/hooks/usePortfolio';
import { PortfolioApi } from '@/lib/api/portfolio';
import { PortfolioItem } from '@/lib/types/portfolio';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Eye, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  Building,
  Tag,
  Loader2,
  Edit,
  Trash2,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import img from 'next/image';

export default function PortfolioDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { likePortfolio, deletePortfolio, isLoading } = usePortfolioActions();
  
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const portfolioId = params.id as string;

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      if (!portfolioId) return;

      try {
        const item = await PortfolioApi.getPortfolioItem(portfolioId);
        setPortfolioItem(item);
      } catch (err) {
        toast.error('Failed to load portfolio item');
        router.push('/dashboard/profile?tab=portfolio');
      } finally {
        setIsLoadingItem(false);
      }
    };

    fetchPortfolioItem();
  }, [portfolioId, router]);

  const handleLike = async () => {
    if (!portfolioItem || !user) {
      toast.error('You must be logged in to like portfolio items');
      return;
    }

    try {
      const result = await likePortfolio(portfolioItem.id);
      setPortfolioItem(prev => prev ? {
        ...prev,
        likes_count: result.likes_count,
        has_liked: result.has_liked
      } : null);
    } catch (error) {
      console.error('Failed to like portfolio item:', error);
    }
  };

  const handleShare = async () => {
    if (!portfolioItem) return;

    const shareUrl = `${window.location.origin}/portfolio/${portfolioItem.id}`;
    const shareText = `Check out this portfolio item: ${portfolioItem.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: portfolioItem.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Share was cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link to clipboard');
      }
    }
  };

  const handleDelete = async () => {
    if (!portfolioItem) return;

    try {
      await deletePortfolio(portfolioItem.id);
      toast.success('Portfolio item deleted successfully');
      router.push('/dashboard/profile?tab=portfolio');
    } catch (error) {
      toast.error('Failed to delete portfolio item');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  if (isLoadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!portfolioItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Item Not Found</h2>
          <Link
            href="/dashboard/profile?tab=portfolio"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === portfolioItem.worker_id;
  const currentImage = portfolioItem.media_urls[currentImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white -b -gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{portfolioItem.title}</h1>
                <p className="text-gray-600 text-sm">
                  by {portfolioItem.worker?.display_name || portfolioItem.worker?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2  -gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={!user || isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  portfolioItem.has_liked
                    ? 'bg-red-50 text-red-600  -red-200'
                    : ' -gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart className={`h-4 w-4 ${portfolioItem.has_liked ? 'fill-current' : ''}`} />
                <span>{portfolioItem.likes_count}</span>
              </button>

              {/* Owner Actions */}
              {isOwner && (
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href={`/dashboard/profile/portfolio/edit/${portfolioItem.id}`}
                    className="flex items-center gap-2 px-4 py-2  -gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2  -red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* img Gallery */}
            <div className="bg-white rounded-lg  overflow-hidden">
              {portfolioItem.media_urls.length > 0 ? (
                <div className="relative">
                  {/* Main img */}
                  <div className="aspect-video bg-gray-100 relative">
                    {currentImage.match(/\.(mp4|mov|avi|mkv)$/i) ? (
                      <video
                        src={currentImage}
                        controls
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={currentImage}
                        alt={portfolioItem.title}
                        className="object-cover"
                      />
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {portfolioItem.media_urls.length > 1 && (
                    <div className="p-4 -t">
                      <div className="flex gap-2 overflow-x-auto">
                        {portfolioItem.media_urls.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 -2 rounded-lg overflow-hidden ${
                              currentImageIndex === index
                                ? '-blue-500'
                                : '-gray-200'
                            }`}
                          >
                            <img
                              src={url}
                              alt={`Thumbnail ${index + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm">No media available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Project Description */}
            <div className="bg-white rounded-lg  p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {portfolioItem.description}
                </p>
              </div>
            </div>

            
            {/* Testimonial */}
            {portfolioItem.testimonials && (
              <div className="bg-blue-50 rounded-lg  -blue-200 p-6">
                <h3 className="font-semibold text-blue-900 mb-3">Client Testimonial</h3>
                <blockquote className="text-blue-800 italic">
                  &quot;{portfolioItem.testimonials}&quot;
                </blockquote>
                {portfolioItem.client_name && (
                  <p className="text-blue-700 text-sm mt-3">— {portfolioItem.client_name}</p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-white rounded-lg  p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
              
              <div className="space-y-4">
                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCategory(portfolioItem.category)}
                  </span>
                </div>

                {/* Project Date */}
                {portfolioItem.project_date && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Project Date</span>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {new Date(portfolioItem.project_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                {/* Location */}
                {portfolioItem.location && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Location</span>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <MapPin className="h-4 w-4" />
                      {portfolioItem.location}
                    </div>
                  </div>
                )}

                {/* Duration */}
                {portfolioItem.duration && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Duration</span>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Clock className="h-4 w-4" />
                      {portfolioItem.duration}
                    </div>
                  </div>
                )}

                {/* Budget */}
                {portfolioItem.project_budget > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget</span>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <DollarSign className="h-4 w-4" />
                      {formatCurrency(portfolioItem.project_budget)}
                    </div>
                  </div>
                )}

                {/* Client */}
                {portfolioItem.client_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Client</span>
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <User className="h-4 w-4" />
                      {portfolioItem.client_name}
                    </div>
                  </div>
                )}

                {/* Views */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <div className="flex items-center gap-1 text-sm text-gray-900">
                    <Eye className="h-4 w-4" />
                    {portfolioItem.views_count}
                  </div>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="text-sm text-gray-900">
                    {new Date(portfolioItem.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {portfolioItem.tags.length > 0 && (
              <div className="bg-white rounded-lg  p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Skills & Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {portfolioItem.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Worker Info */}
            {portfolioItem.worker && (
              <div className="bg-white rounded-lg  p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  About the Worker
                </h3>
                <div className="flex items-center gap-3">
                  {portfolioItem.worker.profile_photo ? (
                    <img
                      src={portfolioItem.worker.profile_photo}
                      alt={portfolioItem.worker.display_name || portfolioItem.worker.name}
                      width={48}
                      height={48}
                      className="rounded-full w-16 h-16 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {portfolioItem.worker.display_name || portfolioItem.worker.name}
                    </p>
                    <Link
                      href={`/dashboard/profile/${portfolioItem.worker.id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Portfolio Item
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{portfolioItem.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}