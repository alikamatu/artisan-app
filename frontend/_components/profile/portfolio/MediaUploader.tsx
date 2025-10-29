import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePortfolioActions } from '@/lib/hooks/usePortfolio';
import { Upload, X, Image, Video, File, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MediaUploaderProps {
  existingUrls: string[];
  onUrlsChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function MediaUploader({ existingUrls, onUrlsChange, maxFiles = 10 }: MediaUploaderProps) {
  const { uploadMedia, isLoading } = usePortfolioActions();
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (existingUrls.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newUploadingFiles = acceptedFiles.map(file => file.name);
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    try {
      const uploadPromises = acceptedFiles.map(file => uploadMedia(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.filter(url => url) as string[];
      
      onUrlsChange([...existingUrls, ...newUrls]);
      toast.success(`Successfully uploaded ${newUrls.length} files`);
    } catch (error) {
      toast.error('Failed to upload some files');
    } finally {
      setUploadingFiles(prev => prev.filter(name => !newUploadingFiles.includes(name)));
    }
  }, [existingUrls, maxFiles, uploadMedia, onUrlsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.mkv'],
      'application/*': ['.pdf', '.doc', '.docx']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const removeMedia = (index: number) => {
    const newUrls = existingUrls.filter((_, i) => i !== index);
    onUrlsChange(newUrls);
  };

  const getFileIcon = (url: string) => {
    if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      return <Image className="h-8 w-8 text-blue-500" />;
    } else if (url.match(/\.(mp4|mov|avi|mkv)$/i)) {
      return <Video className="h-8 w-8 text-purple-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600 mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500">
          Supports images, videos, and documents (max 50MB per file)
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {existingUrls.length}/{maxFiles} files uploaded
        </p>
      </div>

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Uploading files...</p>
          {uploadingFiles.map((fileName, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
              <span className="text-sm text-yellow-800 flex-1">{fileName}</span>
            </div>
          ))}
        </div>
      )}

      {/* Existing Files */}
      {existingUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {existingUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                {url.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(url)
                )}
              </div>
              <button
                type="button"
                onClick={() => removeMedia(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}