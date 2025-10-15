"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { JobUrgency } from '@/lib/types/jobs';
import { URGENCY_OPTIONS } from '@/constants/jobConstants';

interface PriorityFieldProps {
  value: JobUrgency;
  onChange: (urgency: JobUrgency) => void;
}

const PriorityField: React.FC<PriorityFieldProps> = ({ value, onChange }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <AlertTriangle className="h-4 w-4" />
        Priority Level
      </label>
      <div className="grid grid-cols-2 gap-2">
        {URGENCY_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-3 border rounded-lg text-sm text-left transition-colors ${
              value === option.value
                ? option.color + ' border-blue-500'
                : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-xs opacity-75 mt-1">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriorityField;