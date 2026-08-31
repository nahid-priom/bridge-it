'use client';

import { Headphones, ShieldCheck, Truck, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { BRANDING } from '@/lib/config/branding';

const BENEFITS = [
  {
    title: 'Verified Freelancers',
    description: 'All freelancers are verified with skills tests and portfolio reviews.',
    icon: UserCheck,
    color: '#10B981',
  },
  {
    title: 'Secure Payment',
    description: '100% secure payment. Pay only when you are satisfied with the work.',
    icon: ShieldCheck,
    color: '#7C3AED',
  },
  {
    title: 'Fast Delivery',
    description: 'Get your work delivered on time with clear milestones and updates.',
    icon: Truck,
    color: '#F59E0B',
  },
  {
    title: '24/7 Support',
    description: 'Our support team is always ready to help you with any questions.',
    icon: Headphones,
    color: '#38BDF8',
  },
] as const;

export function WhyChooseSection() {
  return (
    <section className="py-12 md:py-20 bg-white dark:bg-background" aria-labelledby="why-choose-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="why-choose-heading"
          className="text-2xl md:text-3xl font-black font-display text-text-primary text-center mb-10 md:mb-12"
        >
          Why Choose <span className="text-deshi-green">{BRANDING.appName}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {BENEFITS.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.article
                key={benefit.title}
                className="text-center rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${benefit.color}18` }}
                >
                  <Icon className="w-7 h-7" style={{ color: benefit.color }} aria-hidden />
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
