import React from 'react';
import { MapPin, Calendar, Clock, DollarSign, Tag } from 'lucide-react';
import { PortfolioItem } from '@/lib/types/portfolio';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface FeedItemInfoProps {
  item: PortfolioItem;
}

export function FeedItemInfo({ item }: FeedItemInfoProps) {
  const router = useRouter();


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
    <div className="text-white pointer-events-auto space-y-3">
      {/* Worker Info */}
      {item.worker && (
        <Link 
          href={`/dashboard/profile/${item.worker.id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {item.worker.profile_photo ? (
            <img
              src={item.worker.profile_photo}
              alt={item.worker.display_name || item.worker.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-xs">
                {(item.worker.display_name || item.worker.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-md">
              {item.worker.display_name || item.worker.name}
            </h3>
            <p className="text-gray-300 text-xs">Professional Worker</p>
          </div>
        </Link>
      )}

      {/* Title & Description */}
      <div onClick={() => router.push(`dashboard/profile/portfolio/${item.id}`)} className="cursor-pointer">
        <h2 className="font-bold text-xs mb-2">{item.title}</h2>
        <p className="text-gray-200 leading-relaxed line-clamp-3">
          {item.description}
        </p>
      </div>

      {/* Project Details */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-300">
        {/* Category */}
        <div className="flex items-center gap-1">
          <Tag className="h-4 w-4" />
          <span>{formatCategory(item.category)}</span>
        </div>

        {/* Location */}
        {item.location && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{item.location}</span>
          </div>
        )}

        {/* Project Date */}
        {item.project_date && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
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
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{item.duration}</span>
          </div>
        )}

        {/* Budget */}
        {item.project_budget > 0 && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>{formatCurrency(item.project_budget)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-white/10 text-white text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}