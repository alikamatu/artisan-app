import React, { useState } from 'react';
import { Briefcase, Image, File, Video, Plus, Heart, Share2, ExternalLink, Eye, Loader2 } from 'lucide-react';
import { usePortfolio, usePortfolioActions } from '@/lib/hooks/usePortfolio';

interface PortfolioTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

export default function PortfolioTab({ profile, isOwnProfile = false }: PortfolioTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch portfolio data
  const { 
    items, 
    total, 
    page, 
    totalPages, 
    categories, 
    isLoading, 
    error, 
    refetch 
  } = usePortfolio({
    worker_id: profile.id,
    page: currentPage,
    limit: 12,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    sort_by: 'created_at',
    sort_order: 'DESC'
  });

  const { likePortfolio, deletePortfolio, uploadMedia } = usePortfolioActions();

  // Handle like action
  const handleLike = async (itemId: string) => {
    try {
      await likePortfolio(itemId);
      refetch(); // Refresh the list to get updated like counts
    } catch (error) {
      console.error('Failed to like portfolio item:', error);
    }
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Calculate stats from real data
  const portfolioStats = {
    totalProjects: total || 0,
    totalViews: items.reduce((sum, item) => sum + item.views_count, 0),
    totalLikes: items.reduce((sum, item) => sum + item.likes_count, 0),
    photoProjects: items.filter(item => item.type === 'image').length,
  };

  // Format category for display
  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get media icon based on type
  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-12 w-12" />;
      case 'document': return <File className="h-12 w-12" />;
      default: return <Image className="h-12 w-12" />;
    }
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                Portfolio
              </h2>
              <p className="text-gray-600 mt-1">Loading portfolio...</p>
            </div>
          </div>
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border p-6">
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Portfolio</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              Portfolio
            </h2>
            <p className="text-gray-600 mt-1">
              {isOwnProfile 
                ? 'Showcase your best work to attract more clients'
                : `View ${profile.name}'s completed projects and work samples`
              }
            </p>
          </div>
          
          {isOwnProfile && (
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Project
            </button>
          )}
        </div>

        {/* Portfolio Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{portfolioStats.totalProjects}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{portfolioStats.totalViews}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{portfolioStats.totalLikes}</div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">{portfolioStats.photoProjects}</div>
            <div className="text-sm text-gray-600">Photo Projects</div>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatCategory(category)} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio Grid */}
      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                {/* Project Image/Media */}
                <div 
                  className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white bg-cover bg-center"
                  style={{ 
                    backgroundImage: item.media_urls?.[0] ? `url(${item.media_urls[0]})` : undefined 
                  }}
                >
                  {!item.media_urls?.[0] && getMediaIcon(item.type)}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-3">
                      <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                        <Eye className="h-5 w-5 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
                        <ExternalLink className="h-5 w-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Image count badge */}
                  {item.media_urls && item.media_urls.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                      {item.media_urls.length} photos
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {formatCategory(item.category)}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Project Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {item.project_date 
                        ? new Date(item.project_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                      }
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{item.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{item.views_count}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <button 
                      onClick={() => handleLike(item.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">Like</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    
                    {isOwnProfile && (
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Plus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg border p-12 text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {isOwnProfile ? 'No Portfolio Items Yet' : 'No Portfolio Items'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {isOwnProfile 
              ? 'Showcase your best work to attract more clients. Add your first project to get started.'
              : 'This user hasn\'t added any portfolio items yet.'
            }
          </p>
          {isOwnProfile && (
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <Plus className="h-5 w-5" />
              Add Your First Project
            </button>
          )}
        </div>
      )}

      {/* Portfolio Tips for Owners */}
      {isOwnProfile && items.length === 0 && (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h4 className="font-semibold text-blue-900 mb-3">Tips for a Great Portfolio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">1</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Show your best work</p>
                <p className="text-blue-700">Highlight projects that demonstrate your skills and expertise</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">2</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Include detailed descriptions</p>
                <p className="text-blue-700">Explain the scope, challenges, and solutions for each project</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">3</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Use high-quality images</p>
                <p className="text-blue-700">Clear, well-lit photos make your work more appealing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-blue-600">4</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Update regularly</p>
                <p className="text-blue-700">Keep your portfolio fresh with recent projects</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}