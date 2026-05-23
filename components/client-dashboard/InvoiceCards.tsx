'use client';

import { useState } from 'react';
import { Download, Eye, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { StatusBadge } from '@/components/client-dashboard/ui/StatusBadge';
import type { ClientInvoice } from '@/types/client-dashboard';

export function InvoiceCards({ invoices }: { invoices: ClientInvoice[] }) {
  const [preview, setPreview] = useState<ClientInvoice | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {invoices.map((inv) => (
          <DashboardCard key={inv.id} hover className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center">
                <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <StatusBadge status={inv.status} />
            </div>
            <p className="text-xs text-text-muted mb-0.5">{inv.invoiceNumber}</p>
            <h3 className="font-semibold text-text-primary mb-1">{inv.sellerName}</h3>
            <p className="text-2xl font-bold text-text-primary tabular-nums mb-4">
              ৳{inv.amount.toLocaleString()}
            </p>
            <p className="text-xs text-text-muted mb-4">
              Issued {inv.issuedAt} · Due {inv.dueAt}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreview(inv)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-deshi-green/10 text-deshi-green text-xs font-semibold hover:bg-deshi-green/15"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </DashboardCard>
        ))}
      </div>

      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl p-6"
            >
              <p className="text-xs font-bold uppercase text-deshi-green mb-2">Invoice Preview</p>
              <h2 className="text-xl font-bold mb-1">{preview.invoiceNumber}</h2>
              <p className="text-text-muted text-sm mb-6">{preview.sellerName}</p>
              <div className="space-y-2 text-sm border-t border-b border-slate-100 dark:border-white/10 py-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-text-muted">Amount</span>
                  <span className="font-bold">৳{preview.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <StatusBadge status={preview.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Due date</span>
                  <span>{preview.dueAt}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 font-semibold text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
