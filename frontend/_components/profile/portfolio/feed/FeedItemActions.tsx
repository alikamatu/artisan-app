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
      {/* Worker Profile Button */}
      {item.worker && (
        <Link 
          href={`/dashboard/profile/${item.worker.id}`}
          className={actionButtonClass}
        >
          <div className={iconClass}>
            <User className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold">Profile</span>
        </Link>
      )}

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

      {/* Share Button */}
      <button
        onClick={handleShare}
        className={actionButtonClass}
      >
        <div className={iconClass}>
          <svg 
            className="h-6 w-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
            />
          </svg>
        </div>
        <span className="text-xs font-semibold">Share</span>
      </button>
    </div>
  );
}