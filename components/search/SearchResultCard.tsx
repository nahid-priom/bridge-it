'use client';

import { memo, useCallback } from 'react';
import {
  Star,
  Clock,
  ShoppingCart,
  Shield,
  Zap,
  Lock,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { SearchCatalogItem } from '@/types';
import type { Category } from '@/types';
import { SafeImage } from './SafeImage';
import { cn } from '@/lib/cn';

interface SearchResultCardProps {
  item: SearchCatalogItem;
  categories: Category[];
  viewMode: 'grid' | 'list';
  onViewDetails: (item: SearchCatalogItem) => void;
  onAddToCart?: (serviceId: string) => void;
}

const RESULT_TYPE_LABELS: Record<string, string> = {
  service: 'Service',
  'digital-product': 'Digital Product',
  course: 'Course',
  seller: 'Seller',
};

export const SearchResultCard = memo(function SearchResultCard({
  item,
  categories,
  viewMode,
  onViewDetails,
  onAddToCart,
}: SearchResultCardProps) {
  const isSeller = item.kind === 'seller';
  const service = item.kind === 'listing' ? item.service : null;
  const cat = categories.find((c) =>
    c.id === (isSeller ? item.category : service?.category)
  );

  const title = isSeller ? item.title : service!.title;
  const description = isSeller ? item.description : service!.description;
  const thumbnail = isSeller ? item.thumbnail : service!.thumbnail;
  const sellerName = isSeller ? item.sellerName : service!.sellerName;
  const sellerAvatar = isSeller ? item.sellerAvatar : service!.sellerAvatar;
  const rating = isSeller ? item.rating : service!.rating;
  const reviewCount = isSeller ? item.reviewCount : service!.reviewCount;
  const isVerified = isSeller ? item.isVerified : service!.isVerified;
  const isFeatured = isSeller ? item.isFeatured : service!.isFeatured || service!.popular;
  const hasProtected = service?.hasProtectedDemo;
  const price = service?.price;
  const deliveryTime = service?.deliveryTime;
  const instant = service?.instantDelivery || deliveryTime?.toLowerCase() === 'instant';
  const resultType = isSeller
    ? 'seller'
    : service!.resultType ??
      (service!.category === 'courses'
        ? 'course'
        : service!.category === 'digital-products'
          ? 'digital-product'
          : 'service');

  const handleClick = useCallback(() => onViewDetails(item), [onViewDetails, item]);

  return (
    <article
      className={cn(
        'group glass-card rounded-2xl overflow-hidden border border-border-subtle hover:border-bridge-primary/30 card-hover cursor-pointer flex flex-col',
        viewMode === 'list' && 'sm:flex-row'
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-surface-elevated flex-shrink-0',
          viewMode === 'list' ? 'w-full sm:w-52 aspect-[4/3] sm:aspect-auto sm:min-h-[180px]' : 'aspect-[4/3] w-full'
        )}
      >
        <SafeImage
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackClassName="w-full h-full min-h-[140px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
          <span className="px-2 py-1 glass-strong text-text-primary text-[10px] font-medium rounded-lg">
            {cat?.icon} {cat?.name ?? 'Marketplace'}
          </span>
          {isFeatured && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-bridge-gold/20 border border-bridge-gold/30 text-bridge-gold text-[10px] font-semibold rounded-lg">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {hasProtected && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-bridge-cyan/15 border border-bridge-cyan/30 text-bridge-cyan text-[10px] font-semibold rounded-lg">
              <Lock className="w-3 h-3" /> Demo
            </span>
          )}
        </div>

        <span className="absolute top-3 right-3 px-2 py-1 bg-background/80 text-text-muted text-[10px] rounded-lg border border-border-subtle">
          {RESULT_TYPE_LABELS[resultType] ?? resultType}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <SafeImage
            src={sellerAvatar}
            alt={sellerName}
            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            fallbackClassName="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-text-muted truncate">{sellerName}</span>
          {isVerified && <Shield className="w-3.5 h-3.5 text-bridge-secondary flex-shrink-0" />}
        </div>

        <h3 className="text-sm font-bold text-text-primary mb-1.5 line-clamp-2 group-hover:text-bridge-primary-light transition-colors">
          {title}
        </h3>
        <p className="text-xs text-text-muted line-clamp-2 mb-3 flex-1">{description}</p>

        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
            <span className="font-bold text-text-primary">{rating}</span>
            <span className="text-text-muted">({reviewCount})</span>
          </div>
          {!isSeller && deliveryTime && (
            <div className="flex items-center gap-1 text-text-muted">
              {instant ? (
                <>
                  <Zap className="w-3 h-3 text-bridge-cyan" />
                  <span className="text-bridge-cyan">Instant</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  {deliveryTime}
                </>
              )}
            </div>
          )}
          {isSeller && (
            <div className="flex items-center gap-1 text-text-muted">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{item.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border-subtle mt-auto">
          {isSeller ? (
            <span className="text-sm text-text-muted">View seller profile</span>
          ) : (
            <span className="text-lg font-bold text-text-primary">
              ৳{price!.toLocaleString()}
              <span className="text-[10px] font-normal text-text-muted ml-1">starting</span>
            </span>
          )}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-2 text-xs font-medium glass border border-border-subtle rounded-xl text-text-primary hover:border-bridge-primary/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30"
            >
              View Details
            </button>
            {!isSeller && onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(service!.id)}
                className="p-2 bg-bridge-primary hover:bg-bridge-primary-light rounded-xl text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
                aria-label="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});
