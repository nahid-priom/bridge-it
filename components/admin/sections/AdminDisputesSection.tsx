'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, RotateCcw, Unlock, UserCheck, Store } from 'lucide-react';
import { AdminFilterBar } from '../../../components/admin/AdminFilterBar';
import { AdminStatusBadge } from '../../../components/admin/AdminStatusBadge';
import { AdminConfirmationModal } from '../../../components/admin/AdminConfirmationModal';
import { AdminEmptyState } from '../../../components/admin/AdminEmptyState';
import { initialAdminDisputes, formatCurrency, type AdminDispute } from '@/data/adminData';
import { useStore } from '@/store/useStore';
import { Scale } from 'lucide-react';

type DisputeAction = 'refund' | 'release' | 'customer' | 'seller';

export const AdminDisputesSection: React.FC = () => {
  const { setNotification } = useStore();
  const [disputes, setDisputes] = useState(initialAdminDisputes);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<{ open: boolean; action: DisputeAction; id: string } | null>(null);

  const filtered = disputes.filter(
    (d) =>
      d.orderId.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase())
  );

  const actionLabels: Record<DisputeAction, { title: string; message: string; label: string }> = {
    refund: { title: 'Issue Refund', message: 'Full refund will be issued to the customer from escrow.', label: 'Confirm Refund' },
    release: { title: 'Release Payment', message: 'Escrow funds will be released to the seller.', label: 'Release Payment' },
    customer: { title: 'Resolve for Customer', message: 'Dispute will be closed in favor of the customer.', label: 'Resolve for Customer' },
    seller: { title: 'Resolve for Seller', message: 'Dispute will be closed in favor of the seller.', label: 'Resolve for Seller' },
  };

  const handleConfirm = () => {
    if (!modal) return;
    setDisputes((prev) =>
      prev.map((d) => (d.id === modal.id ? { ...d, status: 'resolved' as const } : d))
    );
    setNotification(`Dispute action completed: ${modal.action}`);
    setModal(null);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <AdminFilterBar searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search disputes..." />

      {filtered.length === 0 ? (
        <AdminEmptyState icon={Scale} title="No disputes" description="All disputes have been resolved." />
      ) : (
        <div className="space-y-4">
          {filtered.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} onAction={(action) => setModal({ open: true, action, id: dispute.id })} />
          ))}
        </div>
      )}

      {modal && (
        <AdminConfirmationModal
          open={modal.open}
          title={actionLabels[modal.action].title}
          message={actionLabels[modal.action].message}
          confirmLabel={actionLabels[modal.action].label}
          variant={modal.action === 'refund' ? 'danger' : 'primary'}
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
        />
      )}
    </motion.div>
  );
};

function DisputeCard({
  dispute,
  onAction,
}: {
  dispute: AdminDispute;
  onAction: (action: DisputeAction) => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-bridge-primary-light">{dispute.orderId}</span>
            <AdminStatusBadge status={dispute.status} />
          </div>
          <p className="text-sm text-white mt-1">{dispute.service}</p>
          <p className="text-xs text-bridge-gray">
            {dispute.customer} vs {dispute.seller} · {formatCurrency(dispute.amount)} · {dispute.openedDate}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-bridge-dark-3/50 border border-white/5">
          <p className="text-xs font-semibold text-bridge-accent mb-2">Customer Complaint</p>
          <p className="text-sm text-bridge-gray">{dispute.customerComplaint}</p>
        </div>
        <div className="p-4 rounded-xl bg-bridge-dark-3/50 border border-white/5">
          <p className="text-xs font-semibold text-bridge-secondary mb-2">Seller Response</p>
          <p className="text-sm text-bridge-gray">{dispute.sellerResponse}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl glass border border-dashed border-white/10 text-sm text-bridge-gray">
        <FileText className="w-4 h-4 shrink-0" />
        Evidence files placeholder — screenshots, delivery files, chat logs
      </div>

      {dispute.status !== 'resolved' && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          <button type="button" onClick={() => onAction('refund')} className="px-3 py-2 rounded-xl text-sm bg-bridge-accent/15 text-bridge-accent hover:bg-bridge-accent/25 flex items-center gap-1 cursor-pointer">
            <RotateCcw className="w-4 h-4" /> Refund
          </button>
          <button type="button" onClick={() => onAction('release')} className="px-3 py-2 rounded-xl text-sm bg-bridge-cyan/15 text-bridge-cyan hover:bg-bridge-cyan/25 flex items-center gap-1 cursor-pointer">
            <Unlock className="w-4 h-4" /> Release Payment
          </button>
          <button type="button" onClick={() => onAction('customer')} className="px-3 py-2 rounded-xl text-sm glass border border-white/10 hover:border-bridge-primary/30 flex items-center gap-1 cursor-pointer">
            <UserCheck className="w-4 h-4" /> Favor Customer
          </button>
          <button type="button" onClick={() => onAction('seller')} className="px-3 py-2 rounded-xl text-sm glass border border-white/10 hover:border-bridge-secondary/30 flex items-center gap-1 cursor-pointer">
            <Store className="w-4 h-4" /> Favor Seller
          </button>
        </div>
      )}
    </div>
  );
}
