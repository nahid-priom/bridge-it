import React from 'react';
import { useStore } from '../store/useStore';
import { categories } from '../data/categories';
import { CategoryType } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { setPage, setCategory } = useStore();

  const handleCategoryClick = (categoryId: CategoryType) => {
    setCategory(categoryId);
    setPage('category-detail');
  };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setPage('home')}
          className="flex items-center gap-2 text-bridge-gray hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black font-display text-white mb-4">
            All <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-bridge-gray text-lg max-w-2xl mx-auto">
            Explore every zone of our Smart Virtual IT Park
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative overflow-hidden rounded-2xl p-8 glass border border-white/5 hover:border-white/20 card-hover text-left cursor-pointer"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: category.color }}></div>
              
              <div className="relative">
                <span className="text-5xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                <p className="text-sm text-bridge-primary-light font-medium mb-3">{category.nameBn}</p>
                <p className="text-sm text-bridge-gray mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-bridge-gray">
                    <strong className="text-white">{category.count}</strong> services
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: category.color }}>
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
