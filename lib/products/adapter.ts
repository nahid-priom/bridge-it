import type { Product } from '@/types/product';
import type { Service } from '@/types';

const AVATAR =
  'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100';

/** Map marketplace product to cart-compatible Service shape */
export function productToService(product: Product): Service {
  return {
    id: product.id,
    title: product.title,
    description: product.shortDescription,
    price: product.price,
    currency: 'USD',
    deliveryTime: product.deliveryTime,
    thumbnail: product.image,
    category: 'digital-products',
    subcategory: product.categoryLabel,
    rating: product.rating,
    reviewCount: product.reviews,
    sellerId: product.sellerSlug,
    sellerName: product.sellerName,
    sellerAvatar: AVATAR,
    features: product.tags,
    demoItems: [],
    tags: product.tags,
    popular: Boolean(product.isPromoted),
    isVerified: product.sellerLevel === 'Top Rated',
    isFeatured: product.isFeatured,
    instantDelivery: product.deliveryTime.toLowerCase().includes('instant'),
    resultType: 'service',
  };
}
