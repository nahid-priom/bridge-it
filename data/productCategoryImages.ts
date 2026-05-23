import type { ProductCategoryKey } from '@/types/product';

const CROP = '?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

/** Pexels product-card image (landscape, compressed). */
export function pexelsProductImage(photoId: number): string {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg${CROP}`;
}

const A = pexelsProductImage(8833485);
const B = pexelsProductImage(8833486);
const C = pexelsProductImage(13420510);
const D = pexelsProductImage(7988745);
const E = pexelsProductImage(7991579);
const F = pexelsProductImage(270694);
const G = pexelsProductImage(1350461);
const H = pexelsProductImage(67112);
const I = pexelsProductImage(291777);
const J = pexelsProductImage(20043053);
const K = pexelsProductImage(8728284);
const L = pexelsProductImage(29506609);
const M = pexelsProductImage(1181675);
const N = pexelsProductImage(1181677);
const O = pexelsProductImage(196644);
const P = pexelsProductImage(5212345);
const Q = pexelsProductImage(265087);
const R =
  'https://images.pexels.com/photos/3243/pen-calendar-to-do-checklist.jpg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

/** Themed image pools — each product in a category gets a different showcase image. */
export const PRODUCT_CATEGORY_IMAGES: Record<ProductCategoryKey, readonly string[]> = {
  '2d-animation': [A, B, D, J, L, G, E, K, H, I],
  '3d-animation': [C, K, L, J, N, E, A, G, I, F],
  'video-advertising': [E, D, A, K, L, J, H, G, B, M],
  'software-company': [N, F, O, I, M, G, K, P, H, A],
  'digital-products': [O, G, F, N, I, Q, P, H, B, D],
  'online-courses': [P, O, F, M, I, G, Q, K, J, N],
  'boosting-agency': [Q, O, F, G, I, N, D, K, H, L],
  'editing-services': [R, E, D, A, K, G, H, J, L, B],
};

/** Stable varied pick (SSR-safe): each product index maps to a different pool image. */
export function pickProductImage(
  categoryKey: ProductCategoryKey,
  productIndex: number,
  globalIndex: number,
  title: string
): string {
  const pool = PRODUCT_CATEGORY_IMAGES[categoryKey];
  let hash = 0;
  for (let c = 0; c < title.length; c++) {
    hash = (hash * 31 + title.charCodeAt(c)) | 0;
  }
  const jitter = Math.abs(hash + globalIndex) % pool.length;
  const idx = (productIndex + jitter) % pool.length;
  return pool[idx];
}
