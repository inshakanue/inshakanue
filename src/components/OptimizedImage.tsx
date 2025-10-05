import { useState } from 'react';
import { ImageProps, generateSrcSet } from '@/utils/imageOptimization';

interface OptimizedImageProps extends ImageProps {
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component with lazy loading and error handling
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  className = '',
  fallback = '/placeholder.svg',
  onLoad,
  onError,
}: OptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImgSrc(fallback);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        className="w-full h-full object-cover"
      />
    </div>
  );
};
