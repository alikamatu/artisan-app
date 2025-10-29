"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CreatePortfolioDto, UpdatePortfolioDto, PortfolioCategory, PortfolioItemType } from '@/lib/types/portfolio';
import { MediaUploader } from './MediaUploader';
import { TagInput } from './TagInput';
import { X, Save, Loader2 } from 'lucide-react';

interface PortfolioFormProps {
  defaultValues: Partial<CreatePortfolioDto>;
  onSubmit: (data: CreatePortfolioDto) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: React.ReactNode;
  isEdit?: boolean;
}

const categoryOptions = [
  { value: PortfolioCategory.RENOVATION, label: 'Renovation' },
  { value: PortfolioCategory.ELECTRICAL, label: 'Electrical' },
  { value: PortfolioCategory.PLUMBING, label: 'Plumbing' },
  { value: PortfolioCategory.CARPENTRY, label: 'Carpentry' },
  { value: PortfolioCategory.PAINTING, label: 'Painting' },
  { value: PortfolioCategory.CLEANING, label: 'Cleaning' },
  { value: PortfolioCategory.GARDENING, label: 'Gardening' },
  { value: PortfolioCategory.REPAIRS, label: 'Repairs' },
  { value: PortfolioCategory.OTHER, label: 'Other' }
];

const typeOptions = [
  { value: PortfolioItemType.IMAGE, label: 'Image' },
  { value: PortfolioItemType.VIDEO, label: 'Video' },
  { value: PortfolioItemType.DOCUMENT, label: 'Document' },
  { value: PortfolioItemType.LINK, label: 'Link' }
];

export function PortfolioForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = 'Save',
  isEdit = false
}: PortfolioFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm<CreatePortfolioDto>({
    defaultValues: {
      is_published: true,
      media_urls: [],
      tags: [],
      ...defaultValues
    }
  });

  const [currentChallenge, setCurrentChallenge] = useState('');
  const [currentSolution, setCurrentSolution] = useState('');

  const watchedMediaUrls = watch('media_urls') || [];
  const watchedTags = watch('tags') || [];

  const handleMediaUpload = (urls: string[]) => {
    setValue('media_urls', urls, { shouldValidate: true });
  };

  const handleTagsChange = (tags: string[]) => {
    setValue('tags', tags, { shouldValidate: true });
  };

  const onFormSubmit = (data: CreatePortfolioDto) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Project Title *
          </label>
          <input
            type="text"
            id="title"
            {...register('title', { required: 'Project title is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Modern Kitchen Renovation"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Project Description *
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'Project description is required' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the project scope, your role, and the outcome..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Media Type *
            </label>
            <select
              id="type"
              {...register('type', { required: 'Media type is required' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Media Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Media *
        </label>
        <MediaUploader
          existingUrls={watchedMediaUrls}
          onUrlsChange={handleMediaUpload}
          maxFiles={10}
        />
        {errors.media_urls && (
          <p className="mt-1 text-sm text-red-600">{errors.media_urls.message}</p>
        )}
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            {...register('location')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Accra, Ghana"
          />
        </div>

        <div>
          <label htmlFor="project_date" className="block text-sm font-medium text-gray-700 mb-2">
            Project Date
          </label>
          <input
            type="date"
            id="project_date"
            {...register('project_date')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="project_budget" className="block text-sm font-medium text-gray-700 mb-2">
            Project Budget (GHS)
          </label>
          <input
            type="number"
            id="project_budget"
            step="0.01"
            {...register('project_budget', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            {...register('duration')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 2 weeks, 1 month"
          />
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Tags
        </label>
        <TagInput
          tags={watchedTags}
          onTagsChange={handleTagsChange}
          placeholder="Add skills and tags (press Enter to add)"
        />
      </div>

      {/* Client Information */}
      <div>
        <label htmlFor="client_name" className="block text-sm font-medium text-gray-700 mb-2">
          Client Name (Optional)
        </label>
        <input
          type="text"
          id="client_name"
          {...register('client_name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Client name for reference"
        />
      </div>

      {/* Testimonial */}
      <div>
        <label htmlFor="testimonials" className="block text-sm font-medium text-gray-700 mb-2">
          Client Testimonial (Optional)
        </label>
        <textarea
          id="testimonials"
          rows={3}
          {...register('testimonials')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="What did the client say about your work?"
        />
      </div>

      {/* Publication Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_published"
          {...register('is_published')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
          Publish this portfolio item immediately
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}