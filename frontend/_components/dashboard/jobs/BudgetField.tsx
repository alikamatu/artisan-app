"use client";

import React from 'react';
import { DollarSign } from 'lucide-react';

interface BudgetFieldProps {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  error?: string;
}

const BudgetField: React.FC<BudgetFieldProps> = ({ min, max, onChange, error }) => {
  return (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <span>₵</span>
        Budget Range (GHS)
      </label>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="number"
            min="0"
            step="1"
            value={min || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0, max)}
            placeholder="Minimum"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <input
            type="number"
            min="0"
            step="1"
            value={max || ''}
            onChange={(e) => onChange(min, parseFloat(e.target.value) || 0)}
            placeholder="Maximum"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default BudgetField;