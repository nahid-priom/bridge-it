import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { categories } from '../data/categories';
import { featuredServices } from '../data/services';
import { PageFallback } from './PageFallback';
import { ArrowLeft, Star, Clock, ShoppingCart, Filter, Grid3X3, List, Shield } from 'lucide-react';

export const CategoryDetail: React.FC = () => {
  const { selectedCategory, setPage, setSelectedService, addToCart } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  const category = categories.find(c => c.id === selectedCategory);

  const services = useMemo(() => {
    if (!category) return [];
    const filtered = featuredServices.filter(s => s.category === category.id);
    const sorted = [...filtered];
    switch (sortBy) {
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.reverse();
        break;
      default:
        sorted.sort((a, b) => Number(b.popular) - Number(a.popular) || b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [category, sortBy]);

  if (!category) {
    return (
      <PageFallback
        title="Category not found"
        message="Choose a category from the home page or categories list."
        backLabel="All Categories"
        onBack={() => setPage('categories')}
      />
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setPage('categories')}
          className="flex items-center gap-2 text-bridge-gray hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> All Categories
        </button>

        {/* Category Header */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8 border border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{category.icon}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{category.name}</h1>
              <p className="text-bridge-primary-light text-sm">{category.nameBn}</p>
              <p className="text-bridge-gray mt-1">{category.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm text-bridge-gray">
            <span><strong className="text-white">{category.count}</strong> services available</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 glass border border-white/10 rounded-xl text-sm text-white cursor-pointer">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-bridge-dark-2 border border-white/10 rounded-xl text-sm text-white focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg cursor-pointer ${viewMode === 'grid' ? 'bg-bridge-primary text-white' : 'text-bridge-gray'}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg cursor-pointer ${viewMode === 'list' ? 'bg-bridge-primary text-white' : 'text-bridge-gray'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Services */}
        {services.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-white/10">
            <p className="text-bridge-gray text-sm">No services in this category yet. Check back soon or browse other categories.</p>
            <button
              onClick={() => setPage('categories')}
              className="mt-4 px-6 py-2.5 bg-bridge-primary hover:bg-bridge-primary-light rounded-xl text-sm text-white transition-colors cursor-pointer"
            >
              Browse Categories
            </button>
          </div>
        ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
          {services.map(service => (
            <div
              key={service.id}
              className={`group bg-bridge-dark-2 rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 card-hover cursor-pointer ${
                viewMode === 'list' ? 'flex gap-4' : ''
              }`}
              onClick={() => { setSelectedService(service.id); setPage('service-detail'); }}
            >
              <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-video'}`}>
                <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-bridge-dark-2 via-transparent to-transparent"></div>
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img src={service.sellerAvatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-xs text-bridge-gray">{service.sellerName}</span>
                  <Shield className="w-3 h-3 text-bridge-secondary" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{service.title}</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-bridge-gold fill-bridge-gold" />
                    <span className="text-xs font-bold text-white">{service.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-bridge-gray">
                    <Clock className="w-3 h-3" /> {service.deliveryTime}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="text-lg font-bold text-white">৳{service.price.toLocaleString()}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(service); }}
                    className="p-2 bg-bridge-primary hover:bg-bridge-primary-light rounded-xl text-white transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
