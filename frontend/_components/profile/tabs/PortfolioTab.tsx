import React from 'react';
import { Briefcase, Image, File, Video, Plus, Heart, Share2, ExternalLink, Eye } from 'lucide-react';

interface PortfolioTabProps {
  profile: any;
  isOwnProfile?: boolean;
}

export default function PortfolioTab({ profile, isOwnProfile = false }: PortfolioTabProps) {
  // Mock portfolio data - replace with actual API data
  const portfolioItems = [
    {
      id: 1,
      title: 'Modern Kitchen Renovation',
      description: 'Complete kitchen remodel with custom cabinetry and quartz countertops',
      category: 'Renovation',
      date: '2024-01-15',
      images: 3,
      type: 'image',
      likes: 12,
      views: 45
    },
    {
      id: 2,
      title: 'Office Electrical Installation',
      description: 'Commercial electrical wiring for new office space with smart lighting system',
      category: 'Electrical',
      date: '2024-01-10',
      images: 2,
      type: 'image',
      likes: 8,
      views: 32
    },
    {
      id: 3,
      title: 'Bathroom Plumbing System',
      description: 'Complete bathroom plumbing installation with modern fixtures and water-efficient systems',
      category: 'Plumbing',
      date: '2024-01-05',
      images: 4,
      type: 'image',
      likes: 15,
      views: 67
    }
  ];

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
            <div className="text-2xl font-bold text-blue-700">{portfolioItems.length}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {portfolioItems.reduce((sum, item) => sum + item.views, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {portfolioItems.reduce((sum, item) => sum + item.likes, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Likes</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-700">
              {portfolioItems.filter(item => item.type === 'image').length}
            </div>
            <div className="text-sm text-gray-600">Photo Projects</div>
          </div>
        </div>
      </div>

      {/* Portfolio Grid */}
      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
              {/* Project Image/Media */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
                {item.type === 'video' && <Video className="h-12 w-12" />}
                {item.type === 'document' && <File className="h-12 w-12" />}
                {item.type === 'image' && <Image className="h-12 w-12" />}
                
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
                {item.images > 1 && (
                  <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
                    {item.images} photos
                  </div>
                )}

                {/* Category badge */}
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {item.category}
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
                  <span>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{item.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                  <button className="flex-1 flex items-center justify-center gap-1 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
      {isOwnProfile && portfolioItems.length === 0 && (
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