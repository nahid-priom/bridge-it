'use client';

import { Check, Circle, Clock } from 'lucide-react';
import type { BitpProjectStage } from '@/types/bitp';
import { cn } from '@/lib/cn';

type ProjectStageTimelineProps = {
  stages: BitpProjectStage[];
};

export function ProjectStageTimeline({ stages }: ProjectStageTimelineProps) {
  if (stages.length === 0) {
    return <p className="text-sm text-text-secondary">Project stages will appear here once your project starts.</p>;
  }

  const currentIndex = stages.findIndex((s) => s.status === 'in_progress');
  const activeIndex = currentIndex >= 0 ? currentIndex : stages.findIndex((s) => s.status === 'pending');

  return (
    <div className="space-y-0">
      {stages.map((stage, index) => {
        const isCompleted = stage.status === 'completed';
        const isCurrent = stage.status === 'in_progress' || (activeIndex === index && !isCompleted);
        const isUpcoming = !isCompleted && !isCurrent;

        return (
          <div key={stage.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                  isCompleted && 'bg-emerald-500 text-white',
                  isCurrent && 'bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600',
                  isUpcoming && 'bg-slate-100 dark:bg-white/10 text-slate-400'
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" aria-hidden />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" aria-hidden />
                ) : (
                  <Circle className="w-3 h-3" aria-hidden />
                )}
              </div>
              {index < stages.length - 1 && (
                <div className={cn('w-0.5 flex-1 min-h-[2rem]', isCompleted ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10')} />
              )}
            </div>
            <div className="pb-6 flex-1">
              <div className="flex items-center gap-2">
                <h3 className={cn('font-semibold text-sm', isCurrent && 'text-emerald-600')}>{stage.title}</h3>
                {isCurrent && (
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30">
                    Current
                  </span>
                )}
                {isCompleted && (
                  <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Completed</span>
                )}
              </div>
              {stage.description && (
                <p className="text-xs text-text-secondary mt-1">{stage.description}</p>
              )}
              {stage.admin_note && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 italic">Note: {stage.admin_note}</p>
              )}
              {stage.completed_at && (
                <p className="text-xs text-text-secondary mt-1">
                  Completed {new Date(stage.completed_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
