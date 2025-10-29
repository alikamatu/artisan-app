"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePortfolioActions } from '@/lib/hooks/usePortfolio';
import { CreatePortfolioDto, PortfolioCategory, PortfolioItemType } from '@/lib/types/portfolio';
import { ArrowLeft, Plus, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PortfolioForm } from '@/_components/profile/portfolio/PortfolioForm';

export default function AddPortfolioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { createPortfolio, isLoading, error } = usePortfolioActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreatePortfolioDto) => {
    if (!user) {
      toast.error('You must be logged in to create a portfolio item');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure 'title' is a string before passing to createPortfolio
      const createData: CreatePortfolioDto = {
        ...data,
        title: data.title ?? '',
      };
      await createPortfolio(createData);
      toast.success('Portfolio item created successfully!');
      router.push('/dashboard/profile?tab=portfolio');
    } catch (err) {
      toast.error(error || 'Failed to create portfolio item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const defaultValues: Partial<CreatePortfolioDto> = {
    title: '',
    description: '',
    category: PortfolioCategory.OTHER,
    type: PortfolioItemType.IMAGE,
    media_urls: [],
    tags: [],
    is_published: true,
    project_budget: 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile?tab=portfolio"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm  p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add Portfolio Item</h1>
                <p className="text-gray-600 mt-1">
                  Showcase your best work to attract more clients
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm ">
          {error && (
            <div className="p-4 -b -red-200 bg-red-50">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <PortfolioForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting || isLoading}
            submitLabel={
              isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Portfolio Item
                </>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}