import React, { memo, useCallback } from 'react';
import { Star, Clock, ShoppingCart, Shield, Zap, Lock, Sparkles } from 'lucide-react';
import { Service } from '../../types';
import { categories } from '../../data/categories';
import { SafeImage } from '../search/SafeImage';
import { cn } from '../../utils/cn';

interface ProductCardProps {
  product: Service;
  viewMode: 'grid' | 'list';
  onViewDetails: (id: string) => void;
  onAddToCart: (product: Service) => void;
}

export const ProductCard = memo(function ProductCard({
  product,
  viewMode,
  onViewDetails,
  onAddToCart,
}: ProductCardProps) {
  const cat = categories.find((c) => c.id === product.category);
  const instant =
    product.instantDelivery || product.deliveryTime.toLowerCase() === 'instant';

  const handleClick = useCallback(() => onViewDetails(product.id), [onViewDetails, product.id]);
  const handleCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart(product);
    },
    [onAddToCart, product]
  );

  return (
    <article
      className={cn(
        'group glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-bridge-primary/30 card-hover cursor-pointer flex flex-col',
        viewMode === 'list' && 'sm:flex-row'
      )}
      onClick={handleClick}
    >
      <div
        className={cn(
          'relative overflow-hidden bg-bridge-dark-3 flex-shrink-0',
          viewMode === 'list' ? 'w-full sm:w-52 aspect-[4/3] sm:aspect-auto sm:min-h-[180px]' : 'aspect-[4/3] w-full'
        )}
      >
        <SafeImage
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          fallbackClassName="w-full h-full min-h-[140px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bridge-dark-2/90 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2 py-1 glass-strong text-white text-[10px] font-medium rounded-lg">
            {cat?.icon} {cat?.name}
          </span>
          {(product.isFeatured || product.popular) && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-bridge-gold/20 border border-bridge-gold/30 text-bridge-gold text-[10px] font-semibold rounded-lg">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
          {product.hasProtectedDemo && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 bg-bridge-cyan/15 border border-bridge-cyan/30 text-bridge-cyan text-[10px] font-semibold rounded-lg">
              <Lock className="w-3 h-3" /> Protected
            </span>
          )}
        </div>
        {instant && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2 py-1 bg-bridge-cyan/20 text-bridge-cyan text-[10px] font-bold rounded-lg border border-bridge-cyan/30">
            <Zap className="w-3 h-3" /> Instant
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <SafeImage
            src={product.sellerAvatar}
            alt={product.sellerName}
            className="w-6 h-6 rounded-full object-cover"
            fallbackClassName="w-6 h-6 rounded-full"
          />
          <span className="text-xs text-bridge-gray truncate">{product.sellerName}</span>
          {product.isVerified && <Shield className="w-3.5 h-3.5 text-bridge-secondary flex-shrink-0" />}
        </div>
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-2 group-hover:text-bridge-primary-light transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-bridge-gray line-clamp-2 mb-3 flex-1">{product.description}</p>
        <div className="flex items-center gap-3 mb-3 text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
            <span className="font-bold text-white">{product.rating}</span>
            <span className="text-bridge-gray">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-bridge-gray">
            <Clock className="w-3 h-3" />
            {product.deliveryTime}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/5 mt-auto">
          <span className="text-lg font-bold text-white">৳{product.price.toLocaleString()}</span>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-2 text-xs font-medium glass border border-white/10 rounded-xl text-white hover:border-bridge-primary/40 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30"
            >
              View Details
            </button>
            <button
              type="button"
              onClick={handleCart}
              className="p-2 bg-bridge-primary hover:bg-bridge-primary-light rounded-xl text-white transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
