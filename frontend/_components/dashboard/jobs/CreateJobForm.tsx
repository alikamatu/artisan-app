"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Users, 
  FileText, 
  Loader2, 
  X,
  Settings,
  Navigation2,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { CreateJobData, JobUrgency, JobCategory, GhanaRegion } from '@/lib/types/jobs';
import { useCreateJob } from '@/lib/hooks/useJob';
import { URGENCY_OPTIONS, DURATION_OPTIONS, AVAILABILITY_FILTERS } from '@/constants/jobConstants';
import CategorySelector from './CategorySelector';
import LocationSelector from './LocationSelector';

interface CreateJobFormData {
  title: string;
  description: string;
  location: {
    region: GhanaRegion | '';
    city: string;
    specific_address?: string;
  };
  category: JobCategory | '';
  subcategory?: string;
  budget_min: number;
  budget_max: number;
  required_skills: string[];
  urgency: JobUrgency;
  start_date: string;
  estimated_duration: string;
  availability_requirement: {
    immediate: boolean;
    flexible_timing: boolean;
    specific_times: string[];
  };
  distance_preference: {
    max_distance_km?: number;
    travel_compensation: boolean;
  };
}

interface CreateJobFormProps {
  onSuccess?: (jobId: string) => void;
  onCancel?: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onSuccess, onCancel }) => {
  const router = useRouter();
  const { createJob, isLoading: isSubmitting, error: apiError } = useCreateJob();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skillInput, setSkillInput] = useState('');
  const [specificTimeInput, setSpecificTimeInput] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const [formData, setFormData] = useState<CreateJobFormData>({
    title: '',
    description: '',
    location: {
      region: '',
      city: '',
      specific_address: ''
    },
    category: '',
    subcategory: '',
    budget_min: 0,
    budget_max: 0,
    required_skills: [],
    urgency: JobUrgency.MEDIUM,
    start_date: '',
    estimated_duration: '',
    availability_requirement: {
      immediate: false,
      flexible_timing: true,
      specific_times: []
    },
    distance_preference: {
      max_distance_km: 25,
      travel_compensation: false
    }
  });

  const handleInputChange = (field: keyof CreateJobFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...((typeof prev[parentField as keyof CreateJobFormData] === 'object' && prev[parentField as keyof CreateJobFormData] !== null)
          ? prev[parentField as keyof CreateJobFormData] as Record<string, any>
          : {}),
        [field]: value
      }
    }));
    
    // Clear nested field errors
    const errorKey = `${parentField}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !formData.required_skills.includes(skill)) {
      handleInputChange('required_skills', [...formData.required_skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleInputChange('required_skills', formData.required_skills.filter(skill => skill !== skillToRemove));
  };

  const addSpecificTime = () => {
    const time = specificTimeInput.trim();
    if (time && !formData.availability_requirement.specific_times.includes(time)) {
      handleNestedInputChange('availability_requirement', 'specific_times', 
        [...formData.availability_requirement.specific_times, time]);
      setSpecificTimeInput('');
    }
  };

  const removeSpecificTime = (timeToRemove: string) => {
    handleNestedInputChange('availability_requirement', 'specific_times',
      formData.availability_requirement.specific_times.filter(time => time !== timeToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description cannot exceed 2000 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    // Location validation
    if (!formData.location.region) {
      newErrors['location.region'] = 'Region is required';
    }
    if (!formData.location.city) {
      newErrors['location.city'] = 'City is required';
    }

    // Budget validation
    if (formData.budget_min <= 0) {
      newErrors.budget_min = 'Minimum budget must be greater than 0';
    }
    if (formData.budget_max <= 0) {
      newErrors.budget_max = 'Maximum budget must be greater than 0';
    }
    if (formData.budget_max < formData.budget_min) {
      newErrors.budget_max = 'Maximum budget must be greater than or equal to minimum budget';
    }

    // Start date validation
    if (formData.start_date) {
      const startDate = new Date(formData.start_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.start_date = 'Start date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for API
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
        ...(formData.subcategory && { subcategory: formData.subcategory }),
        budget_min: formData.budget_min,
        budget_max: formData.budget_max,
        required_skills: formData.required_skills,
        urgency: formData.urgency,
        ...(formData.start_date && { start_date: formData.start_date }),
        ...(formData.estimated_duration && { estimated_duration: formData.estimated_duration }),
        availability_requirement: formData.availability_requirement,
        distance_preference: formData.distance_preference
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

  const displayError = apiError || errors.submit;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create New Job</h2>
                <p className="text-sm text-gray-500">Post a job to find skilled professionals in Ghana</p>
              </div>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <p className="text-sm text-red-600">{String(displayError)}</p>


          {/* Job Title */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4" />
              Job Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Need a plumber for bathroom renovation in East Legon"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Category Selector */}
          <CategorySelector
            value={formData.category}
            onChange={(category) => handleInputChange('category', category)}
            error={errors.category}
          />

          {/* Subcategory (Optional) */}
          {formData.category && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Subcategory (Optional)
              </label>
              <input
                type="text"
                value={formData.subcategory || ''}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
                placeholder="e.g., Bathroom plumbing, Kitchen renovation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          )}

          {/* Location Selector */}
          <LocationSelector
            value={formData.location}
            onChange={(location) => handleInputChange('location', location)}
            error={errors['location.region'] || errors['location.city']}
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="h-4 w-4" />
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what you need done, include specific requirements, materials needed, timeline, etc."
              rows={5}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{formData.description.length}/2000 characters</span>
              {errors.description && <span className="text-red-600">{errors.description}</span>}
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="h-4 w-4" />
              Budget Range (GHS) *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget_min || ''}
                  onChange={(e) => handleInputChange('budget_min', parseFloat(e.target.value) || 0)}
                  placeholder="Minimum budget"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.budget_min ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.budget_min && <p className="text-sm text-red-600 mt-1">{errors.budget_min}</p>}
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget_max || ''}
                  onChange={(e) => handleInputChange('budget_max', parseFloat(e.target.value) || 0)}
                  placeholder="Maximum budget"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                    errors.budget_max ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {errors.budget_max && <p className="text-sm text-red-600 mt-1">{errors.budget_max}</p>}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users className="h-4 w-4" />
              Required Skills
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, addSkill)}
                  placeholder="e.g., Plumbing, Electrical work"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority Level */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <AlertTriangle className="h-4 w-4" />
              Priority Level *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {URGENCY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('urgency', option.value)}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    formData.urgency === option.value
                      ? option.color
                      : 'text-gray-600 bg-white border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div>{option.label}</div>
                  <div className="text-xs opacity-75 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Start Date and Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Preferred Start Date
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.start_date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.start_date && <p className="text-sm text-red-600">{errors.start_date}</p>}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Clock className="h-4 w-4" />
                Estimated Duration
              </label>
              <select
                value={formData.estimated_duration}
                onChange={(e) => handleInputChange('estimated_duration', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select duration</option>
                {DURATION_OPTIONS.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Options Toggle */}
          <div className="border-t pt-6">
            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <Settings className="h-4 w-4" />
              Advanced Options
              {showAdvancedOptions ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </button>
          </div>

          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="space-y-6 bg-gray-50 p-4 rounded-lg">
              {/* Availability Requirements */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Availability Requirements</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.availability_requirement.immediate}
                      onChange={(e) => handleNestedInputChange('availability_requirement', 'immediate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Immediate availability required</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.availability_requirement.flexible_timing}
                      onChange={(e) => handleNestedInputChange('availability_requirement', 'flexible_timing', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Flexible timing acceptable</span>
                  </label>
                </div>

                {/* Specific Times */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Specific Times (Optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={specificTimeInput}
                      onChange={(e) => setSpecificTimeInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, addSpecificTime)}
                      placeholder="e.g., Weekends only, 9AM-5PM"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addSpecificTime}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {formData.availability_requirement.specific_times.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.availability_requirement.specific_times.map((time, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm"
                        >
                          {time}
                          <button
                            type="button"
                            onClick={() => removeSpecificTime(time)}
                            className="ml-1 text-gray-600 hover:text-gray-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Distance Preferences */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Distance Preferences</h4>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Maximum distance (km)
                    </label>
                    <select
                      value={formData.distance_preference.max_distance_km || ''}
                      onChange={(e) => handleNestedInputChange('distance_preference', 'max_distance_km', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="">No preference</option>
                      <option value="5">Within 5km</option>
                      <option value="10">Within 10km</option>
                      <option value="25">Within 25km</option>
                      <option value="50">Within 50km</option>
                      <option value="100">Within 100km</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.distance_preference.travel_compensation}
                      onChange={(e) => handleNestedInputChange('distance_preference', 'travel_compensation', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm">Willing to pay travel compensation</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Job...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" />
                  Create Job
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobForm;