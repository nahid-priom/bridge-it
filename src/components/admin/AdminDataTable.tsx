import React from 'react';
import { cn } from '../../utils/cn';

export interface AdminColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  mobileCardRender?: (row: T) => React.ReactNode;
}

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-white/5">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 bg-white/10 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function AdminDataTable<T>({
  columns,
  data,
  keyExtractor,
  loading,
  emptyMessage = 'No data found',
  mobileCardRender,
}: AdminDataTableProps<T>) {
  if (!loading && data.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center text-bridge-gray text-sm border border-white/8">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block glass-card rounded-2xl border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-left text-xs font-semibold text-bridge-gray uppercase tracking-wider',
                      col.className
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={columns.length} />
              ) : (
                data.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className={cn('px-4 py-3.5 text-white', col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {loading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-4 border border-white/8 animate-pulse">
                <div className="h-4 w-1/2 bg-white/10 rounded mb-3" />
                <div className="h-3 w-full bg-white/10 rounded mb-2" />
                <div className="h-3 w-2/3 bg-white/10 rounded" />
              </div>
            ))
          : data.map((row) =>
              mobileCardRender ? (
                <div key={keyExtractor(row)}>{mobileCardRender(row)}</div>
              ) : (
                <div
                  key={keyExtractor(row)}
                  className="glass-card rounded-2xl p-4 border border-white/8 space-y-2"
                >
                  {columns
                    .filter((c) => !c.hideOnMobile)
                    .map((col) => (
                      <div key={col.key} className="flex justify-between gap-2 text-sm">
                        <span className="text-bridge-gray shrink-0">{col.header}</span>
                        <span className="text-white text-right">{col.render(row)}</span>
                      </div>
                    ))}
                </div>
              )
            )}
      </div>
    </>
  );
}
