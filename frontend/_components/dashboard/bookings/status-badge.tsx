import React from 'react';
import { LucideIcon } from 'lucide-react';
import { BookingStatus } from '@/lib/types/booking';

interface StatusConfig {
  color: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

interface StatusBadgeProps {
  status: BookingStatus;
  config: StatusConfig;
  showDescription?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  config, 
  showDescription = false 
}) => {
  const { color, icon: Icon, label, description } = config;

  return (
    <div className="inline-flex flex-col gap-1">
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border ${color}`}>
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {showDescription && (
        <p className="text-xs text-gray-600">{description}</p>
      )}
    </div>
  );
};