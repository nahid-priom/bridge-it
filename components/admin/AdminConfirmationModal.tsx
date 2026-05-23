'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface AdminConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmationModal: React.FC<AdminConfirmationModalProps> = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            className="glass-strong rounded-2xl p-6 max-w-md w-full border border-white/10 shadow-2xl shadow-bridge-primary/20 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl ${
                    variant === 'danger'
                      ? 'bg-bridge-accent/15 text-bridge-accent'
                      : 'bg-bridge-primary/15 text-bridge-primary-light'
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 text-bridge-gray hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-bridge-gray mb-6">{message}</p>
            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-bridge-gray glass border border-white/10 hover:bg-white/5 transition-all cursor-pointer"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all cursor-pointer ${
                  variant === 'danger'
                    ? 'bg-bridge-accent hover:bg-bridge-accent/90'
                    : 'bg-bridge-primary hover:bg-bridge-primary-light'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
