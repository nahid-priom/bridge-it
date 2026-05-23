'use client';

import React from 'react';
import Link from 'next/link';
import { categories } from '@/data/categories';
import { productsUrl } from '@/lib/routes';
import { ArrowRight } from 'lucide-react';

export const CategoriesPage: React.FC = () => {

  return (
    <div className="min-h-screen pb-20">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-black font-display text-text-primary mb-4">
            All <span className="gradient-text">Categories</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Explore every zone of our Smart Virtual IT Park
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={productsUrl(category.id)}
              className="group relative overflow-hidden rounded-2xl p-8 glass border border-border-subtle hover:border-border-subtle card-hover text-left cursor-pointer block"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: category.color }}></div>
              
              <div className="relative">
                <span className="text-5xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl font-bold text-text-primary mb-1">{category.name}</h3>
                <p className="text-sm text-bridge-primary-light font-medium mb-3">{category.nameBn}</p>
                <p className="text-sm text-text-muted mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">
                    <strong className="text-text-primary">{category.count}</strong> services
                  </span>
                  <span className="flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform" style={{ color: category.color }}>
                    Explore <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
