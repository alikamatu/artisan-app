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
    <div className="absolute bottom-0 left-0 right-0 text-white pointer-events-auto space-y-2 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
      {/* Worker Info */}
      {item.worker && (
        <Link 
          href={`/dashboard/profile/${item.worker.id}`}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity mb-2"
        >
          {item.worker.profile_photo ? (
            <img
              src={item.worker.profile_photo}
              alt={item.worker.display_name || item.worker.name}
              className="h-8 w-8 rounded-full object-cover ring-2 ring-white/50"
            />
          ) : (
            <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white/50">
              <span className="text-white font-semibold text-xs">
                {(item.worker.display_name || item.worker.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">
              {item.worker.display_name || item.worker.name}
            </h3>
            <p className="text-white/70 text-xs">Professional Worker</p>
          </div>
        </Link>
      )}

      {/* Title & Description */}
      <div className="space-y-1">
        <h2 className="font-bold text-sm leading-tight">{item.title}</h2>
        {item.description && (
          <p className="text-white/90 text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      {/* Project Details */}
      <div className="flex flex-wrap gap-1.5">
        {/* Category */}
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
          <Tag className="h-3 w-3 text-white" />
          <span className="text-white text-xs">{formatCategory(item.category)}</span>
        </div>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            <MapPin className="h-3 w-3 text-white" />
            <span className="text-white text-xs">{item.location}</span>
          </div>
        )}

        {/* Project Date */}
        {item.project_date && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            <Calendar className="h-3 w-3 text-white" />
            <span className="text-white text-xs">
              {new Date(item.project_date).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>
        )}

        {/* Duration */}
        {item.duration && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 text-white" />
            <span className="text-white text-xs">{item.duration}</span>
          </div>
        )}

        {/* Budget */}
        {item.project_budget > 0 && (
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
            <DollarSign className="h-3 w-3 text-white" />
            <span className="text-white text-xs">{formatCurrency(item.project_budget)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}