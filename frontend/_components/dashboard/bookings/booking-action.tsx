import React from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  Flag, 
  DollarSign, 
  Star,
  XCircle
} from 'lucide-react';
import { Booking } from '@/lib/types/booking';
import { useCanReview } from '@/lib/hooks/useReviews';

interface BookingActionsProps {
  booking: Booking;
  userRole: 'client' | 'worker';
  showDetails: boolean;
  onToggleDetails: () => void;
  onShowCompletion: () => void;
  onShowCancel: () => void;
  onShowReview: () => void;
  onShowIssue: () => void;
  onStartWork: (id: string) => Promise<void>;
  onPauseWork: (id: string) => Promise<void>;
  onRequestPayment: (id: string) => Promise<void>;
}

const workerActions = {
  startWork: {
    label: 'Start Work',
    description: 'Begin working on this job',
    icon: PlayCircle,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  pauseWork: {
    label: 'Pause Work',
    description: 'Temporarily pause this job',
    icon: PauseCircle,
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  reportIssue: {
    label: 'Report Issue',
    description: 'Report a problem with the job',
    icon: Flag,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  requestPayment: {
    label: 'Request Payment',
    description: 'Submit payment request',
    icon: DollarSign,
    color: 'bg-purple-500 hover:bg-purple-600'
  }
};

export const BookingActions: React.FC<BookingActionsProps> = ({
  booking,
  userRole,
  showDetails,
  onToggleDetails,
  onShowCompletion,
  onShowCancel,
  onShowReview,
  onShowIssue,
  onStartWork,
  onPauseWork,
  onRequestPayment
}) => {
  const { canReview } = useCanReview(booking.id);

  const getWorkerActions = () => {
    const actions = [];
    
    switch (booking.status) {
      case 'active':
        actions.push(
          // {
          //   ...workerActions.pauseWork,
          //   action: () => onPauseWork(booking.id)
          // },
          // {
          //   ...workerActions.reportIssue,
          //   action: () => onShowIssue()
          // },
          {
            ...workerActions.requestPayment,
            action: () => onRequestPayment(booking.id)
          }
        );
        break;
        
      case 'completed':
          actions.push({
            ...workerActions.requestPayment,
            action: () => onRequestPayment(booking.id)
          });
        break;
    }
    
    return actions;
  };

  const workerActionsList = getWorkerActions();

  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleDetails}
          className="text-sm text-gray-600 hover:text-gray-700 flex items-center gap-1 transition-colors"
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showDetails ? 'Less' : 'More'} Details
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Worker Actions */}
        {userRole === 'worker' && workerActionsList.length > 0 && (
          <div className="flex items-center gap-2">
            {workerActionsList.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`text-sm text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg ${action.color} flex items-center gap-2`}
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Client Actions */}
        {userRole === 'client' && booking.status === 'active' && (
          <>
            <button
              onClick={onShowCancel}
              className="text-sm text-red-600 hover:text-red-700 px-4 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-semibold"
            >
              Cancel Booking
            </button>
            <button
              onClick={onShowCompletion}
              className="text-sm bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
            >
              Mark Complete
            </button>
          </>
        )}

        {/* Review Action */}
        {userRole === 'client' && booking.status === 'completed' && canReview && !booking.review && (
          <button
            onClick={onShowReview}
            className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Write Review
          </button>
        )}

        {/* Show existing review */}
        {booking.review && (
          <div className="text-sm text-green-600 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold">Reviewed ({booking.review.rating}/5)</span>
          </div>
        )}
      </div>
    </div>
  );
};