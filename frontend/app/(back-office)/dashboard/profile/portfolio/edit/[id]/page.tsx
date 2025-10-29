"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { usePortfolioActions } from '@/lib/hooks/usePortfolio';
import { PortfolioApi } from '@/lib/api/portfolio';
import { UpdatePortfolioDto, PortfolioItem } from '@/lib/types/portfolio';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PortfolioForm } from '@/_components/profile/portfolio/PortfolioForm';

export default function EditPortfolioPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const { updatePortfolio, isLoading, error } = usePortfolioActions();
  const [portfolioItem, setPortfolioItem] = useState<PortfolioItem | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const portfolioId = params.id as string;

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      if (!portfolioId) return;

      try {
        const item = await PortfolioApi.getPortfolioItem(portfolioId);
        
        // Check if the current user owns this portfolio item
        if (item.worker_id !== user?.id) {
          toast.error('You can only edit your own portfolio items');
          router.push('/dashboard/profile?tab=portfolio');
          return;
        }
        
        setPortfolioItem(item);
      } catch (err) {
        toast.error('Failed to load portfolio item');
        router.push('/dashboard/profile?tab=portfolio');
      } finally {
        setIsLoadingItem(false);
      }
    };

    fetchPortfolioItem();
  }, [portfolioId, user, router]);

  const handleSubmit = async (data: UpdatePortfolioDto) => {
    if (!user || !portfolioItem) return;

    setIsSubmitting(true);
    
    try {
      await updatePortfolio(portfolioItem.id, data);
      toast.success('Portfolio item updated successfully!');
      router.push('/dashboard/profile?tab=portfolio');
    } catch (err) {
      toast.error(error || 'Failed to update portfolio item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!portfolioItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Portfolio Item Not Found</h2>
          <Link
            href="/dashboard/profile?tab=portfolio"
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/profile?tab=portfolio"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Save className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Portfolio Item</h1>
                <p className="text-gray-600 mt-1">
                  Update your project details and media
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          {error && (
            <div className="p-4 border-b border-red-200 bg-red-50">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <PortfolioForm
            defaultValues={portfolioItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isSubmitting || isLoading}
            submitLabel={
              isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Portfolio Item
                </>
              )
            }
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
}