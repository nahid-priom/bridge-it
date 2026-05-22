import { memo, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export const SafeImage = memo(function SafeImage({ src, alt, className, fallbackClassName }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-bridge-dark-3 text-bridge-gray',
          fallbackClassName ?? className
        )}
      >
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
    />
  );
});
