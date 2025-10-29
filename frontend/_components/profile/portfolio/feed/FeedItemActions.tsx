import React from 'react';
import { Heart, User } from 'lucide-react';
import { PortfolioItem } from '@/lib/types/portfolio';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { toast } from 'sonner';

interface FeedItemActionsProps {
  item: PortfolioItem;
  onLike: () => void;
  isLiking: boolean;
}

export function FeedItemActions({ item, onLike, isLiking }: FeedItemActionsProps) {
  const { user } = useAuth();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/portfolio/${item.id}`;
    const shareText = `Check out this work by ${item.worker?.display_name || item.worker?.name}: ${item.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  const actionButtonClass = "flex flex-col items-center gap-1 text-gray-800 pointer-events-auto";
  const iconClass = "p-3 bg-white/90 rounded-full hover:bg-white shadow-lg transition-colors";

  return (
    <div className="space-y-4">
      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={!user || isLiking}
        className={actionButtonClass}
      >
        <div className={iconClass}>
          <Heart 
            className={`h-6 w-6 ${item.has_liked ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} 
          />
        </div>
        <span className="text-xs font-semibold">{item.likes_count}</span>
      </button>
    </div>
  );
}