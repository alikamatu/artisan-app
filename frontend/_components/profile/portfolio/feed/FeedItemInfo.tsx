import React from 'react';
import { MapPin, Calendar, Clock, DollarSign, Tag } from 'lucide-react';
import { PortfolioItem } from '@/lib/types/portfolio';
import Link from 'next/link';

interface FeedItemInfoProps {
  item: PortfolioItem;
}

export function FeedItemInfo({ item }: FeedItemInfoProps) {
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

  return (
    <div className="absolute bottom-0 text-white pointer-events-auto space-y-3 bg-black/25 rounded-2xl p-4 shadow-lg">
      {/* Worker Info */}
      {item.worker && (
        <Link 
          href={`/dashboard/profile/${item.worker.id}`}
          className="flex items-center gap-3 hover:opacity-70 transition-opacity"
        >
          {item.worker.profile_photo ? (
            <img
              src={item.worker.profile_photo}
              alt={item.worker.display_name || item.worker.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-gray-200">
              <span className="text-white font-semibold text-sm">
                {(item.worker.display_name || item.worker.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base">
              {item.worker.display_name || item.worker.name}
            </h3>
            <p className="text-gray-600 text-xs">Professional Worker</p>
          </div>
        </Link>
      )}

      {/* Title & Description */}
      <div>
        <h2 className="font-bold text-lg mb-1">{item.title}</h2>
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>

      {/* Project Details */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        {/* Category */}
        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
          <Tag className="h-3 w-3" />
          <span>{formatCategory(item.category)}</span>
        </div>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
          </div>
        )}

        {/* Project Date */}
        {item.project_date && (
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(item.project_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        )}

        {/* Duration */}
        {item.duration && (
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            <span>{item.duration}</span>
          </div>
        )}

        {/* Budget */}
        {item.project_budget > 0 && (
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
            <DollarSign className="h-3 w-3" />
            <span>{formatCurrency(item.project_budget)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}