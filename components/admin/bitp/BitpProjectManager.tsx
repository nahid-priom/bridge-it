'use client';

import { useState } from 'react';
import { formatBdt } from '@/lib/format/currency';
import { adminUpdateProjectStageAction } from '@/app/actions/bitp-admin-orders';
import type { BitpProject, BitpProjectStage } from '@/types/bitp';
import { cn } from '@/lib/cn';

type BitpProjectManagerProps = {
  projects: BitpProject[];
  onRefresh: () => void;
};

const STAGE_STATUSES: BitpProjectStage['status'][] = ['pending', 'in_progress', 'completed', 'skipped'];

export function BitpProjectManager({ projects, onRefresh }: BitpProjectManagerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const updateStage = async (stageId: string) => {
    setPending(stageId);
    const result = await adminUpdateProjectStageAction(stageId, 'completed');
    setPending(null);
    if (result.error) alert(result.error);
    else onRefresh();
  };

  if (projects.length === 0) {
    return <p className="text-text-secondary">No projects yet.</p>;
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <div key={project.id} className="rounded-xl border border-white/10 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpanded(expanded === project.id ? null : project.id)}
            className="w-full p-4 flex justify-between items-start gap-4 text-left hover:bg-white/[0.02]"
          >
            <div>
              <p className="font-medium text-white">{project.title}</p>
              <p className="text-sm text-white/60 capitalize">{project.status.replace(/_/g, ' ')}</p>
              {project.expected_delivery_date && (
                <p className="text-xs text-white/50 mt-1">Expected: {project.expected_delivery_date}</p>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-emerald-400">{project.progress_percent}%</p>
            </div>
          </button>

          {expanded === project.id && (
            <div className="border-t border-white/10 p-4 bg-black/20 space-y-3">
              {(project.stages ?? []).length === 0 ? (
                <p className="text-sm text-white/50">No stages defined.</p>
              ) : (
                <ol className="space-y-2">
                  {(project.stages ?? []).map((stage) => (
                    <li key={stage.id} className="flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="text-white font-medium">{stage.title}</p>
                        <p className={cn('text-xs capitalize', stage.status === 'completed' ? 'text-emerald-400' : 'text-white/50')}>
                          {stage.status.replace(/_/g, ' ')}
                        </p>
                      </div>
                      {stage.status !== 'completed' && stage.status !== 'skipped' && (
                        <button
                          type="button"
                          disabled={pending === stage.id}
                          onClick={() => updateStage(stage.id)}
                          className="px-2 py-1 rounded text-[10px] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          Mark complete
                        </button>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
