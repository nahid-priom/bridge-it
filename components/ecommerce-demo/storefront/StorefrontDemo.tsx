'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, Heart, User, LayoutDashboard } from 'lucide-react';
import type { DemoFeatureFlags, DemoStoreProduct, EcommerceDemoConfig } from '@/types/bitp';
import { formatBdt } from '@/lib/format/currency';
import { useDemoCart } from '@/lib/ecommerce-demo/cart-store';
import { hasFeature } from '@/lib/ecommerce-demo/feature-flags';
import { DemoCheckout } from '@/components/ecommerce-demo/checkout/DemoCheckout';
import { DemoAdminPreview } from '@/components/ecommerce-demo/admin-preview/DemoAdminPreview';
import { DemoCustomerAccount } from '@/components/ecommerce-demo/customer/DemoCustomerAccount';

type StorefrontDemoProps = {
  config: EcommerceDemoConfig;
  demoSlug: string;
};

type View = 'store' | 'product' | 'cart' | 'checkout' | 'success' | 'admin' | 'account';

function productEmoji(vertical: string | null): string {
  if (vertical === 'fashion') return '👗';
  if (vertical === 'gadget') return '📱';
  if (vertical === 'cosmetics') return '💄';
  return '🏠';
}

function ProductImage({ product, size = 'grid' }: { product: DemoStoreProduct; size?: 'grid' | 'detail' }) {
  if (product.image_url) {
    return (
      <Image
        src={product.image_url}
        alt={product.name}
        fill
        className="object-cover"
        sizes={size === 'detail' ? '600px' : '200px'}
      />
    );
  }
  return (
    <span className={size === 'detail' ? 'text-8xl' : 'text-4xl'} aria-hidden>
      {productEmoji(product.vertical)}
    </span>
  );
}

export function StorefrontDemo({ config, demoSlug }: StorefrontDemoProps) {
  const flags = config.feature_flags;
  const [view, setView] = useState<View>('store');
  const [selectedProduct, setSelectedProduct] = useState<DemoStoreProduct | null>(null);
  const [search, setSearch] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orderNumber, setOrderNumber] = useState('');
  const cart = useDemoCart();

  useEffect(() => {
    cart.setDemoSlug(demoSlug);
  }, [demoSlug, cart]);

  const products = (config.products ?? []).filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !category || p.category_id === category;
    return matchSearch && matchCat;
  });

  const toggleWishlist = (id: string) => {
    if (!hasFeature(flags, 'wishlist')) return;
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const openProduct = (p: DemoStoreProduct) => {
    setSelectedProduct(p);
    setView('product');
  };

  if (view === 'checkout') {
    return (
      <DemoCheckout
        flags={flags}
        demoSlug={demoSlug}
        onBack={() => setView('cart')}
        onSuccess={(num) => { setOrderNumber(num); setView('success'); cart.clearCart(); }}
      />
    );
  }

  if (view === 'success') {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-black mb-2">Demo Order Confirmed!</h2>
        <p className="font-mono text-emerald-600 mb-2">#{orderNumber}</p>
        <p className="text-sm text-amber-600 font-semibold mb-6">Demo only — no real purchase.</p>
        {hasFeature(flags, 'customerAccount') && (
          <button type="button" onClick={() => setView('account')} className="deshi-btn-primary px-6 py-3 mr-3">
            View Demo Orders
          </button>
        )}
        <button type="button" onClick={() => setView('store')} className="deshi-btn-outline px-6 py-3">
          Continue Shopping
        </button>
      </div>
    );
  }

  if (view === 'admin' && hasFeature(flags, 'adminPreview')) {
    return <DemoAdminPreview config={config} demoSlug={demoSlug} onBack={() => setView('store')} />;
  }

  if (view === 'account' && hasFeature(flags, 'customerAccount')) {
    return (
      <DemoCustomerAccount config={config} demoSlug={demoSlug} onBack={() => setView('store')} />
    );
  }

  if (view === 'product' && selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        flags={flags}
        inWishlist={wishlist.includes(selectedProduct.id)}
        onToggleWishlist={() => toggleWishlist(selectedProduct.id)}
        onAddToCart={() => {
          cart.addItem(selectedProduct);
          setView('cart');
        }}
        onBack={() => setView('store')}
      />
    );
  }

  if (view === 'cart') {
    return (
      <CartView
        flags={flags}
        onBack={() => setView('store')}
        onCheckout={() => setView('checkout')}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-[#0f1424] min-h-[80vh]">
      {/* Store header */}
      <header className="border-b border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f1424] sticky top-[var(--demo-bar-height,88px)] z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <span className="font-black text-lg text-emerald-600 truncate">DemoStore</span>
          <div className="flex items-center gap-2">
            {hasFeature(flags, 'search') && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileSearchOpen((v) => !v)}
                  className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
                <div className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-2 py-1">
                  <Search className="w-4 h-4 text-text-secondary" aria-hidden />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="text-sm bg-transparent outline-none w-32 lg:w-48"
                  />
                </div>
              </>
            )}
            {hasFeature(flags, 'customerAccount') && (
              <button type="button" onClick={() => setView('account')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Account">
                <User className="w-5 h-5" />
              </button>
            )}
            {hasFeature(flags, 'adminPreview') && (
              <button type="button" onClick={() => setView('admin')} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Admin">
                <LayoutDashboard className="w-5 h-5" />
              </button>
            )}
            {hasFeature(flags, 'cart') && (
              <button type="button" onClick={() => setView('cart')} className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {cart.itemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                    {cart.itemCount()}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
        {mobileSearchOpen && hasFeature(flags, 'search') && (
          <div className="sm:hidden px-4 pb-3">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 px-2 py-2">
              <Search className="w-4 h-4 text-text-secondary" aria-hidden />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="text-sm bg-transparent outline-none flex-1"
                autoFocus
              />
            </div>
          </div>
        )}
        {config.categories && config.categories.length > 0 && (
          <div className="container mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${!category ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/10'}`}
            >
              All
            </button>
            {config.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${category === c.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-white/10'}`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Product grid */}
      <div className="container mx-auto px-4 py-6">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-2">No products found</p>
            <p className="text-sm text-text-secondary">
              {search ? 'Try a different search term.' : 'No demo products available.'}
            </p>
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-emerald-500/40 transition-colors cursor-pointer group"
              onClick={() => openProduct(p)}
              onKeyDown={(e) => e.key === 'Enter' && openProduct(p)}
              role="button"
              tabIndex={0}
            >
              <div className="relative aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center overflow-hidden">
                <ProductImage product={p} />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-bold line-clamp-2">{p.name}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-emerald-600 font-black">{formatBdt(Number(p.price))}</p>
                  {p.compare_at_price && Number(p.compare_at_price) > Number(p.price) && (
                    <p className="text-xs text-text-secondary line-through">{formatBdt(Number(p.compare_at_price))}</p>
                  )}
                </div>
                {hasFeature(flags, 'stock') && (
                  <p className="text-xs text-text-secondary">{p.stock} in stock (Demo)</p>
                )}
              </div>
            </article>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

function ProductDetail({
  product,
  flags,
  inWishlist,
  onToggleWishlist,
  onAddToCart,
  onBack,
}: {
  product: DemoStoreProduct;
  flags: DemoFeatureFlags;
  inWishlist: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
  onBack: () => void;
}) {
  const dbVariants = product.variants?.length
    ? product.variants
    : [{ id: 'default', label: 'Default' }];
  const variants = hasFeature(flags, 'variants') ? dbVariants : [{ id: 'default', label: 'Default' }];
  const [variant, setVariant] = useState(variants[0]?.label ?? 'Default');
  const [qty, setQty] = useState(1);
  const cart = useDemoCart();

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <button type="button" onClick={onBack} className="text-sm text-emerald-600 font-semibold mb-4">← Back to store</button>
      <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 flex items-center justify-center overflow-hidden mb-6">
        <ProductImage product={product} size="detail" />
      </div>
      <h1 className="text-2xl font-black mb-2">{product.name}</h1>
      <p className="text-text-secondary mb-4">{product.description}</p>
      <p className="text-2xl font-black text-emerald-600 mb-4">{formatBdt(Number(product.price))}</p>
      {hasFeature(flags, 'variants') && variants.length > 1 && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Variant</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariant(v.label)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${variant === v.label ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-white/10'}`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {hasFeature(flags, 'cart') && (
        <div className="mb-4 flex items-center gap-3">
          <p className="text-sm font-semibold">Quantity</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-8 h-8 rounded border border-slate-200 dark:border-white/10 font-bold">−</button>
            <span className="w-8 text-center font-semibold">{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)} className="w-8 h-8 rounded border border-slate-200 dark:border-white/10 font-bold">+</button>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        {hasFeature(flags, 'cart') && (
          <button
            type="button"
            onClick={() => {
              cart.addItem(product, qty, variant);
              onAddToCart();
            }}
            className="deshi-btn-primary flex-1 py-3 font-bold"
          >
            Add to Cart
          </button>
        )}
        {hasFeature(flags, 'wishlist') && (
          <button type="button" onClick={onToggleWishlist} className="deshi-btn-outline px-4 py-3" aria-label="Wishlist">
            <Heart className={`w-5 h-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}

function CartView({
  flags,
  onBack,
  onCheckout,
}: {
  flags: DemoFeatureFlags;
  onBack: () => void;
  onCheckout: () => void;
}) {
  const cart = useDemoCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const applyCoupon = () => {
    if (cart.applyCoupon(couponInput)) {
      setCouponMsg('Coupon applied (Demo)!');
    } else {
      setCouponMsg('Invalid coupon. Try DEMO10 or SAVE500');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-lg">
      <button type="button" onClick={onBack} className="text-sm text-emerald-600 font-semibold mb-4">← Continue shopping</button>
      <h2 className="text-xl font-black mb-4">Cart</h2>
      {cart.items.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
          <p className="text-text-secondary mb-4">Your cart is empty.</p>
          <button type="button" onClick={onBack} className="deshi-btn-outline px-6 py-2 text-sm">Browse products</button>
        </div>
      ) : (
        <>
          <ul className="space-y-3 mb-6">
            {cart.items.map((item) => (
              <li key={item.product.id} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5">
                <div>
                  <p className="font-semibold text-sm">{item.product.name}</p>
                  <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{formatBdt(Number(item.product.price) * item.quantity)}</span>
                  <button type="button" onClick={() => cart.removeItem(item.product.id)} className="text-red-500 text-xs">Remove</button>
                </div>
              </li>
            ))}
          </ul>
          {hasFeature(flags, 'coupon') && (
            <div className="flex gap-2 mb-4">
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-sm"
              />
              <button type="button" onClick={applyCoupon} className="deshi-btn-outline px-4 py-2 text-sm">Apply</button>
            </div>
          )}
          {couponMsg && <p className="text-xs text-emerald-600 mb-2">{couponMsg}</p>}
          <div className="flex justify-between font-black text-lg mb-4">
            <span>Total</span>
            <span>{formatBdt(cart.total())}</span>
          </div>
          {hasFeature(flags, 'checkout') && (
            <button type="button" onClick={onCheckout} className="deshi-btn-primary w-full py-3.5 font-bold">
              Proceed to Checkout
            </button>
          )}
        </>
      )}
    </div>
  );
}
