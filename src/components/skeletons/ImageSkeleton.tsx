import { cn } from '@/lib/cn';
import { Skeleton } from './Skeleton';

export function ImageSkeleton({
  aspectRatio = '16 / 10',
  className,
  rounded = 'none',
}: {
  aspectRatio?: string;
  className?: string;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}) {
  return (
    <Skeleton
      rounded={rounded}
      className={cn('w-full', className)}
      style={{ aspectRatio }}
    />
  );
}
