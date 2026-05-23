'use client';

import Image from 'next/image';
import { memo, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface BridgeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export const BridgeImage = memo(function BridgeImage({
  src,
  alt,
  className,
  fallbackClassName,
  width = 800,
  height = 600,
  fill,
  priority = false,
  sizes,
  style,
}: BridgeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-surface-elevated text-text-muted',
          fallbackClassName ?? className
        )}
      >
        <ImageIcon className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={style}
        sizes={sizes ?? '100vw'}
        priority={priority}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  );
});
