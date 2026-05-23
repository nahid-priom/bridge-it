'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, Check, X, ShieldCheck } from 'lucide-react';
import { AdminFilterBar } from '../../../components/admin/AdminFilterBar';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { AdminEmptyState } from '../../../components/admin/AdminEmptyState';
import { AdminConfirmationModal } from '../../../components/admin/AdminConfirmationModal';
import type { VerificationRequest } from '@/types/admin';
import { useAdminData } from '@/components/admin/AdminDataContext';
import { useStore } from '@/store/useStore';
import { verifyMarketplaceSellerAction } from '@/app/actions/admin-marketplace';

export const AdminVerificationSection: React.FC = () => {
  const router = useRouter();
  const { setNotification } = useStore();
  const { verificationQueue } = useAdminData();
  const [queue, setQueue] = useState(verificationQueue);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState<{ open: boolean; action: 'approve' | 'reject'; id: string } | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return queue.filter((v) => {
      const matchSearch =
        v.sellerName.toLowerCase().includes(search.toLowerCase()) ||
        v.company.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || v.status === filter;
      return matchSearch && matchFilter;
    });
  }, [queue, search, filter]);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    const result = await verifyMarketplaceSellerAction({
      sellerId: id,
      verified: status === 'approved',
    });
    setLoadingId(null);
    if (result && 'error' in result) {
      setNotification(result.error ?? 'Action failed');
      return;
    }
    setQueue((prev) => prev.filter((v) => v.id !== id));
    setNotification(
      status === 'approved'
        ? 'Seller verified on marketplace'
        : 'Verification declined — seller remains unverified'
    );
    setModal(null);
    router.refresh();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AdminFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search verification queue..."
        filterValue={filter}
        onFilterChange={setFilter}
        filterOptions={[
          { value: 'all', label: 'All Status' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />

      {filtered.length === 0 ? (
        <AdminEmptyState
          icon={ShieldCheck}
          title="Queue is clear"
          description="No verification requests match your filters."
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <VerificationCard
              key={item.id}
              item={item}
              onApprove={() => setModal({ open: true, action: 'approve', id: item.id })}
              onReject={() => setModal({ open: true, action: 'reject', id: item.id })}
            />
          ))}
        </div>
      )}

      {modal && (
        <AdminConfirmationModal
          open={modal.open}
          title={modal.action === 'approve' ? 'Approve Seller' : 'Reject Application'}
          message={
            modal.action === 'approve'
              ? 'This seller will gain verified status and can start receiving orders.'
              : 'This application will be rejected. The seller will be notified.'
          }
          confirmLabel={modal.action === 'approve' ? 'Approve' : 'Reject'}
          variant={modal.action === 'reject' ? 'danger' : 'primary'}
          onConfirm={() => void handleAction(modal.id, modal.action === 'approve' ? 'approved' : 'rejected')}
          onCancel={() => setModal(null)}
        />
      )}
    </motion.div>
  );
};

function VerificationCard({
  item,
  onApprove,
  onReject,
}: {
  item: VerificationRequest;
  onApprove: () => void;
  onReject: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/8 hover:border-bridge-primary/20 transition-all">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="min-w-0 flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <p className="text-xs text-bridge-gray">Seller / Company</p>
            <p className="text-sm font-semibold text-white">{item.sellerName}</p>
            <p className="text-xs text-bridge-gray">{item.company}</p>
          </div>
          <div>
            <p className="text-xs text-bridge-gray">Category</p>
            <p className="text-sm text-white">{item.category}</p>
          </div>
          <div>
            <p className="text-xs text-bridge-gray mb-1">Documents</p>
            <AdminStatusBadge status={item.documentsStatus} />
          </div>
          <div>
            <p className="text-xs text-bridge-gray mb-1">Risk / Status</p>
            <div className="flex flex-wrap gap-2">
              <AdminStatusBadge status={item.riskLevel} />
              <AdminStatusBadge status={item.status} />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="text-xs text-bridge-gray mr-2">
            Profile {item.profileCompletion}% · {item.submittedDate}
          </div>
          <button type="button" className="px-3 py-2 rounded-xl glass border border-white/10 text-sm text-bridge-gray hover:text-white flex items-center gap-1 cursor-pointer">
            <Eye className="w-4 h-4" /> Details
          </button>
          {item.status === 'pending' && (
            <>
              <button type="button" onClick={onApprove} className="px-3 py-2 rounded-xl bg-bridge-secondary/20 text-bridge-secondary text-sm font-medium flex items-center gap-1 hover:bg-bridge-secondary/30 cursor-pointer">
                <Check className="w-4 h-4" /> Approve
              </button>
              <button type="button" onClick={onReject} className="px-3 py-2 rounded-xl bg-bridge-accent/20 text-bridge-accent text-sm font-medium flex items-center gap-1 hover:bg-bridge-accent/30 cursor-pointer">
                <X className="w-4 h-4" /> Reject
              </button>
            </>
          )}
        </div>
      </div>
      <div className="mt-3 h-1.5 rounded-full bg-bridge-dark-3 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-bridge-primary to-bridge-secondary" style={{ width: `${item.profileCompletion}%` }} />
      </div>
    </div>
  );
}
