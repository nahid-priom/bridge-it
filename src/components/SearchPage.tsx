import React from 'react';
import { useStore } from '../store/useStore';
import { featuredServices } from '../data/services';
import { categories } from '../data/categories';
import { ArrowLeft, Search, Star, Clock, ShoppingCart, Shield } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { searchQuery, setSearchQuery, setPage, setSelectedService, addToCart } = useStore();

  const results = featuredServices.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setPage('home')}
          className="flex items-center gap-2 text-bridge-gray hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bridge-gray" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for services, products, sellers..."
              className="w-full pl-12 pr-4 py-4 bg-bridge-dark-2 border border-white/10 rounded-2xl text-white placeholder-bridge-gray focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20"
              autoFocus
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-6">
          {searchQuery ? `Results for "${searchQuery}" (${results.length})` : 'Start typing to search...'}
        </h2>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map(service => {
              const cat = categories.find(c => c.id === service.category);
              return (
                <div
                  key={service.id}
                  className="group bg-bridge-dark-2 rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 card-hover cursor-pointer"
                  onClick={() => { setSelectedService(service.id); setPage('service-detail'); }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img src={service.thumbnail} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-bridge-dark-2 via-transparent to-transparent"></div>
                    <div className="absolute top-3 right-3 px-2 py-1 glass-strong text-white text-xs rounded-lg">
                      {cat?.icon} {cat?.name}
                    </div>
                  </div>
                  <div className="p-4">
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
              );
            })}
          </div>
        ) : searchQuery ? (
          <div className="glass rounded-2xl p-16 text-center">
            <Search className="w-16 h-16 text-bridge-gray mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-bridge-gray">Try different keywords or browse our categories</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
