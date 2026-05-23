'use client';

import React from 'react';
import Link from 'next/link';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { categories } from '@/data/categories';
import { productsUrl } from '@/lib/routes';
import { ArrowRight } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { goToCategories } = useAppNavigation();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-60"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-bridge-primary/5 rounded-full blur-[150px]"></div>

      <div className="relative container  mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-bridge-primary/10 border border-bridge-primary/20 rounded-full text-bridge-primary-light text-xs font-semibold mb-3 uppercase tracking-wider">
              🏢 IT Park Zones
            </span>
            <h2 className="text-2xl md:text-4xl font-black font-display text-text-primary">
              Service <span className="gradient-text">Categories</span>
            </h2>
          </div>
          <button
            onClick={goToCategories}
            className="mt-3 sm:mt-0 text-bridge-primary-light hover:text-text-primary text-sm font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Iconic Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={productsUrl(category.id)}
              className="group relative cursor-pointer card-float block"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-surface/80 border border-border-subtle hover:border-border-subtle p-4 md:p-5 text-center transition-all duration-500">
                {/* Hover Glow */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{ backgroundColor: category.color }}
                ></div>
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${category.color}, transparent)` }}
                ></div>

                {/* Icon */}
                <div className="relative mx-auto w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                  style={{ background: `linear-gradient(135deg, ${category.color}15, ${category.color}08)`, border: `1px solid ${category.color}20` }}
                >
                  <span className="text-2xl md:text-3xl">{category.icon}</span>
                </div>

                {/* Name */}
                <h3 className="text-xs md:text-sm font-bold text-text-primary group-hover:text-text-primary transition-colors mb-0.5 truncate">
                  {category.name}
                </h3>
                <p className="text-[10px] text-text-muted font-medium truncate">{category.nameBn}</p>

                {/* Count */}
                <div className="mt-2 text-[10px] text-text-muted">
                  <span className="font-bold text-text-primary">{category.count}</span> services
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
