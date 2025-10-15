"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CreateJobData, JobUrgency, JobCategory, GhanaRegion } from '@/lib/types/jobs';
import { useCreateJob } from '@/lib/hooks/useJob';
import CategorySelector from './CategorySelector';
import LocationSelector from './LocationSelector';
import BudgetField from './BudgetField';
import SkillsField from './SkillsField';
import PriorityField from './PriorityField';
import DateTimeFields from './DateTimeFields';

interface CreateJobFormData {
  title: string;
  description: string;
  location: {
    region: GhanaRegion | '';
    city: string;
    specific_address?: string;
  };
  category: JobCategory | '';
  region: GhanaRegion | '';
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  urgency: JobUrgency;
  start_date: string;
  estimated_duration: string;
}

interface CreateJobFormProps {
  onSuccess?: (jobId: string) => void;
  onCancel?: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onSuccess, onCancel }) => {
  const router = useRouter();
  const { createJob, isLoading: isSubmitting } = useCreateJob();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateJobFormData>({
    title: '',
    description: '',
    location: {
      region: '',
      city: '',
      specific_address: ''
    },
    category: '',
    region: '',
    budget_min: 0,
    budget_max: 0,
    required_skills: [],
    urgency: JobUrgency.MEDIUM,
    start_date: '',
    estimated_duration: ''
  });

  const handleInputChange = (field: keyof CreateJobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (location: CreateJobFormData['location']) => {
    setFormData(prev => ({ ...prev, location, region: location.region }));
    if (errors['location.region'] || errors['location.city'] || errors['region']) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['location.region'];
        delete newErrors['location.city'];
        delete newErrors['region'];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.location.region) {
      newErrors['location.region'] = 'Region is required';
    }

    if (!formData.location.city) {
      newErrors['location.city'] = 'City is required';
    }

    if (formData.budget_max < formData.budget_min) {
      newErrors.budget_max = 'Maximum budget must be greater than minimum budget';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const jobData: CreateJobData = {
        title: formData.title,
        description: formData.description,
        location: {
          region: formData.location.region as GhanaRegion,
          city: formData.location.city,
          ...(formData.location.specific_address && { 
            specific_address: formData.location.specific_address 
          })
        },
        category: formData.category as JobCategory,
        region: formData.location.region as GhanaRegion,
        budget_min: formData.budget_min,
        budget_max: formData.budget_max,
        required_skills: formData.required_skills,
        urgency: formData.urgency,
        ...(formData.start_date && { start_date: formData.start_date }),
        ...(formData.estimated_duration && { estimated_duration: formData.estimated_duration })
      };

      const result = await createJob(jobData);
      
      if (onSuccess) {
        onSuccess(result.id);
      } else {
        router.push(`/jobs/${result.id}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Job Details</h2>
        <p className="text-sm text-gray-500">Fill in the job information</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., Need a plumber for bathroom repair"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
        </div>

        {/* Category */}
        <CategorySelector
          value={formData.category}
          onChange={(category) => handleInputChange('category', category)}
          error={errors.category}
        />

        {/* Location */}
        <LocationSelector
          value={formData.location}
          onChange={handleLocationChange}
          error={errors['location.region'] || errors['location.city']}
        />

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the job requirements, timeline, and any specific details..."
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
        </div>

        {/* Budget */}
        <BudgetField
          min={formData.budget_min}
          max={formData.budget_max}
          onChange={(min, max) => {
            handleInputChange('budget_min', min);
            handleInputChange('budget_max', max);
          }}
          error={errors.budget_max}
        />

        {/* Skills */}
        <SkillsField
          skills={formData.required_skills}
          onChange={(skills) => handleInputChange('required_skills', skills)}
        />

        {/* Priority & Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PriorityField
            value={formData.urgency}
            onChange={(urgency) => handleInputChange('urgency', urgency)}
          />

          <DateTimeFields
            startDate={formData.start_date}
            duration={formData.estimated_duration}
            onStartDateChange={(date) => handleInputChange('start_date', date)}
            onDurationChange={(duration) => handleInputChange('estimated_duration', duration)}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Job'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobForm;