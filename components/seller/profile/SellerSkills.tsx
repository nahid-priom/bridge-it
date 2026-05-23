'use client';

import type { MarketplaceSellerSkill } from '@/types/marketplaceSeller';

type SellerSkillsProps = {
  skills: MarketplaceSellerSkill[];
};

export function SellerSkills({ skills }: SellerSkillsProps) {
  if (skills.length === 0) return null;

  return (
    <div className="space-y-3">
      {skills.map((skill) => (
        <div key={skill.id}>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-semibold text-text-primary">{skill.skillName}</span>
            <span className="text-text-muted">{skill.skillPercentage}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-deshi-green to-emerald-400 transition-all duration-700"
              style={{ width: `${skill.skillPercentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
