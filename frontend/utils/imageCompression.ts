export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 800,
      maxHeight = 800,
      quality = 0.8,
      maxSizeKB = 500
    } = options;

    // Create canvas and context
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

       URL.revokeObjectURL(img.src);

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to blob with quality compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // Check if size is acceptable
          const sizeKB = blob.size / 1024;
          
          if (sizeKB <= maxSizeKB) {
            // Create new File object
            const compressedFile = new File([blob], file.name, {
              type: blob.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else if (quality > 0.1) {
            // If still too large, try with lower quality
            const lowerQuality = Math.max(0.1, quality - 0.1);
            compressImage(file, { ...options, quality: lowerQuality })
              .then(resolve)
              .catch(reject);
          } else {
            reject(new Error(`Image too large: ${sizeKB.toFixed(1)}KB (max: ${maxSizeKB}KB)`));
          }
        },
        file.type.startsWith('image/png') ? 'image/png' : 'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image'));
    }
    img.src = URL.createObjectURL(file);
  });
};

// Helper to get file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};