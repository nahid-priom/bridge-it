'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, X } from 'lucide-react';
import { initialAdminCategories, type AdminCategory } from '@/data/adminData';

export const AdminCategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState(initialAdminCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm] = useState({ icon: '', nameEn: '', nameBn: '' });

  const openAdd = () => {
    setEditing(null);
    setForm({ icon: '📦', nameEn: '', nameBn: '' });
    setModalOpen(true);
  };

  const openEdit = (cat: AdminCategory) => {
    setEditing(cat);
    setForm({ icon: cat.icon, nameEn: cat.nameEn, nameBn: cat.nameBn });
    setModalOpen(true);
  };

  const saveCategory = () => {
    if (!form.nameEn.trim()) return;
    if (editing) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editing.id ? { ...c, icon: form.icon, nameEn: form.nameEn, nameBn: form.nameBn } : c
        )
      );
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          icon: form.icon,
          nameEn: form.nameEn,
          nameBn: form.nameBn,
          serviceCount: 0,
          sellerCount: 0,
          featured: false,
        },
      ]);
    }
    setModalOpen(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-bridge-primary hover:bg-bridge-primary-light text-white text-sm font-medium rounded-xl cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="glass-card rounded-2xl p-5 border border-white/8 hover:border-bridge-primary/25 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-3xl">{cat.icon}</span>
              <button
                type="button"
                onClick={() =>
                  setCategories((prev) =>
                    prev.map((c) => (c.id === cat.id ? { ...c, featured: !c.featured } : c))
                  )
                }
                className={`text-xs px-2 py-1 rounded-full border cursor-pointer ${
                  cat.featured
                    ? 'bg-bridge-gold/15 text-bridge-gold border-bridge-gold/30'
                    : 'bg-white/5 text-bridge-gray border-white/10'
                }`}
              >
                {cat.featured ? 'Featured' : 'Not Featured'}
              </button>
            </div>
            <h3 className="text-lg font-semibold text-white mt-3">{cat.nameEn}</h3>
            {cat.nameBn && <p className="text-sm text-bridge-gray">{cat.nameBn}</p>}
            <div className="flex gap-4 mt-4 text-xs text-bridge-gray">
              <span>{cat.serviceCount} services</span>
              <span>{cat.sellerCount} sellers</span>
            </div>
            <button
              type="button"
              onClick={() => openEdit(cat)}
              className="mt-4 flex items-center gap-1 text-sm text-bridge-primary-light hover:text-white cursor-pointer"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="glass-strong rounded-2xl p-6 max-w-md w-full border border-white/10 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">{editing ? 'Edit Category' : 'Add Category'}</h3>
                  <button type="button" onClick={() => setModalOpen(false)} className="text-bridge-gray hover:text-white cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    placeholder="Icon (emoji)"
                    className="w-full px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-bridge-primary"
                  />
                  <input
                    value={form.nameEn}
                    onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                    placeholder="English name"
                    className="w-full px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-bridge-primary"
                  />
                  <input
                    value={form.nameBn}
                    onChange={(e) => setForm({ ...form, nameBn: e.target.value })}
                    placeholder="Bengali name (optional)"
                    className="w-full px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-bridge-primary"
                  />
                </div>
                <div className="flex gap-2 mt-6 justify-end">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl text-sm text-bridge-gray glass border border-white/10 cursor-pointer">
                    Cancel
                  </button>
                  <button type="button" onClick={saveCategory} className="px-4 py-2 rounded-xl text-sm bg-bridge-primary text-white cursor-pointer">
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
