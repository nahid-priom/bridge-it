import React from 'react';
import { useStore } from '../store/useStore';
import { topSellers } from '../data/services';
import { Star, MapPin, CheckCircle, Clock, ExternalLink, Copy, ArrowRight, Award } from 'lucide-react';
import { categories } from '../data/categories';

export const TopSellers: React.FC = () => {
  const { setPage, setSelectedSeller, setNotification } = useStore();

  const handleSellerClick = (sellerId: string) => {
    setSelectedSeller(sellerId);
    setPage('seller-profile');
  };

  const copyCustomUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setNotification('Custom URL copied! Share it anywhere.');
      setTimeout(() => setNotification(null), 3000);
    });
  };

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0 hero-gradient opacity-40"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-bridge-secondary/20 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-secondary/10 border border-bridge-secondary/20 rounded-full text-bridge-secondary text-xs font-semibold mb-3 uppercase tracking-wider">
              <Award className="w-3 h-3" /> Verified & Trusted
            </span>
            <h2 className="text-2xl md:text-4xl font-black font-display text-white">
              Top <span className="gradient-text">Sellers</span>
            </h2>
            <p className="text-bridge-gray text-sm mt-1">Each has a unique custom URL — share anywhere to bring customers directly</p>
          </div>
          <button
            onClick={() => setPage('categories')}
            className="mt-3 sm:mt-0 text-bridge-primary-light hover:text-white text-sm font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            See More <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sellers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topSellers.map((seller) => {
            const cat = categories.find(c => c.id === seller.category);
            return (
              <div
                key={seller.id}
                onClick={() => handleSellerClick(seller.id)}
                className="group relative overflow-hidden rounded-2xl bg-bridge-dark-2/60 border border-white/[0.06] hover:border-white/15 card-float cursor-pointer"
              >
                {/* Cover */}
                <div className="relative h-28 md:h-36 overflow-hidden">
                  <img src={seller.coverImage} alt={seller.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bridge-dark-2 via-bridge-dark-2/40 to-transparent"></div>

                  {/* Category */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 glass-strong rounded-lg text-[10px] font-semibold text-white">
                    {cat?.icon} {cat?.name}
                  </div>
                </div>

                {/* Content */}
                <div className="relative px-5 pb-5 -mt-8">
                  <div className="flex items-end gap-3 mb-3">
                    <div className="relative">
                      <img src={seller.avatar} alt={seller.name} className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover border-3 border-bridge-dark-2 shadow-xl" />
                      {seller.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-bridge-secondary rounded-full flex items-center justify-center border-2 border-bridge-dark-2">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <h3 className="text-base font-bold text-white truncate">{seller.name}</h3>
                      <p className="text-xs text-bridge-gray truncate">{seller.tagline}</p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="text-center p-2 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-3 h-3 text-bridge-gold fill-bridge-gold" />
                        <span className="text-xs font-bold text-white">{seller.rating}</span>
                      </div>
                      <span className="text-[9px] text-bridge-gray">{seller.reviewCount} reviews</span>
                    </div>
                    <div className="text-center p-2 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <span className="text-xs font-bold text-white block">{seller.completedProjects}</span>
                      <span className="text-[9px] text-bridge-gray">Projects</span>
                    </div>
                    <div className="text-center p-2 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-bridge-secondary" />
                        <span className="text-[10px] font-bold text-white">{seller.responseTime}</span>
                      </div>
                      <span className="text-[9px] text-bridge-gray">Response</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                    <div className="flex items-center gap-1 text-[10px] text-bridge-gray">
                      <MapPin className="w-3 h-3" />
                      {seller.location}
                    </div>
                    <button
                      onClick={(e) => copyCustomUrl(seller.customUrl, e)}
                      className="flex items-center gap-1.5 text-[10px] text-bridge-primary-light hover:text-white transition-colors px-2.5 py-1.5 bg-bridge-primary/10 hover:bg-bridge-primary/20 rounded-lg cursor-pointer font-medium"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
