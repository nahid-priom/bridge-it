'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, X } from 'lucide-react';
import {
  getSoftwareDemoConfigAction,
  listSoftwareDemoConfigsAction,
  toggleSoftwareDemoModuleAction,
  updateSoftwareDemoConfigAction,
} from '@/app/actions/bitp-admin-software-demo';
import type { SoftwareDemoConfig, SoftwareDemoModule, SoftwareFeatureFlags } from '@/types/bitp';
import { cn } from '@/lib/cn';

const FLAG_KEYS: (keyof SoftwareFeatureFlags)[] = [
  'dashboard', 'products', 'purchase', 'sales', 'stock', 'reports',
  'parties', 'ledger', 'payments', 'expenses', 'transfer', 'returns',
  'accounts', 'employees', 'roles', 'bom', 'production', 'costing', 'wastage',
  'requisition', 'approval', 'salesOrders', 'delivery', 'audit',
];

export function BitpSoftwareDemoEditor() {
  const [configs, setConfigs] = useState<SoftwareDemoConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<SoftwareDemoConfig | null>(null);
  const [flagsJson, setFlagsJson] = useState('');
  const [workflowText, setWorkflowText] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await listSoftwareDemoConfigsAction();
    setLoading(false);
    if (result.error) setError(result.error);
    else setConfigs(result.configs ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = async (id: string) => {
    setEditingId(id);
    setError(null);
    const result = await getSoftwareDemoConfigAction(id);
    if (result.error || !result.config) {
      setError(result.error ?? 'Failed to load config');
      return;
    }
    setEditConfig(result.config);
    setFlagsJson(JSON.stringify(result.config.feature_flags ?? {}, null, 2));
    setWorkflowText((result.config.workflow_config ?? []).join('\n'));
  };

  const save = async () => {
    if (!editConfig) return;
    setSaving(true);
    setError(null);
    let feature_flags: SoftwareFeatureFlags;
    try {
      feature_flags = JSON.parse(flagsJson) as SoftwareFeatureFlags;
    } catch {
      setSaving(false);
      setError('Invalid feature_flags JSON');
      return;
    }
    const result = await updateSoftwareDemoConfigAction({
      id: editConfig.id,
      demo_title: editConfig.demo_title,
      demo_description: editConfig.demo_description,
      business_type: editConfig.business_type,
      active: editConfig.active,
      feature_flags,
      workflow_config: workflowText.split('\n').map((s) => s.trim()).filter(Boolean),
    });
    setSaving(false);
    if (result.error) setError(result.error);
    else {
      setEditingId(null);
      setEditConfig(null);
      load();
    }
  };

  const toggleModule = async (mod: SoftwareDemoModule) => {
    const result = await toggleSoftwareDemoModuleAction(mod.id, !mod.active);
    if (result.error) setError(result.error);
    else if (editingId) openEdit(editingId);
  };

  if (loading) return <p className="text-text-secondary">Loading software demo configs...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Software Demo Configurations</h2>
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white/5 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Demo slug</th>
              <th className="p-3">Level</th>
              <th className="p-3">Active</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {configs.map((cfg) => (
              <tr key={cfg.id} className="border-t border-white/5">
                <td className="p-3 text-white">{cfg.product?.name ?? cfg.demo_title}</td>
                <td className="p-3 font-mono text-xs text-white/70">{cfg.internal_demo_slug}</td>
                <td className="p-3">{cfg.package_level}</td>
                <td className="p-3">{cfg.active ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <button type="button" onClick={() => openEdit(cfg.id)} className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-semibold">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && editConfig && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 pt-10 pb-10">
          <button type="button" className="fixed inset-0 bg-black/60" onClick={() => { setEditingId(null); setEditConfig(null); }} aria-label="Close" />
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-bridge-dark shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Edit Demo: {editConfig.demo_title}</h3>
              <button type="button" onClick={() => { setEditingId(null); setEditConfig(null); }} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <label className="block text-xs text-white/60">
              Demo title
              <input className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white" value={editConfig.demo_title} onChange={(e) => setEditConfig({ ...editConfig, demo_title: e.target.value })} />
            </label>
            <label className="block text-xs text-white/60">
              Description
              <textarea className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white min-h-[60px]" value={editConfig.demo_description ?? ''} onChange={(e) => setEditConfig({ ...editConfig, demo_description: e.target.value })} />
            </label>
            <label className="block text-xs text-white/60">
              Business type
              <input className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white font-mono text-sm" value={editConfig.business_type} onChange={(e) => setEditConfig({ ...editConfig, business_type: e.target.value })} />
            </label>
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input type="checkbox" checked={editConfig.active} onChange={(e) => setEditConfig({ ...editConfig, active: e.target.checked })} />
              Active
            </label>
            <label className="block text-xs text-white/60">
              Feature flags (JSON)
              <textarea className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white font-mono text-xs min-h-[160px]" value={flagsJson} onChange={(e) => setFlagsJson(e.target.value)} />
            </label>
            <div className="flex flex-wrap gap-1">
              {FLAG_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    try {
                      const flags = JSON.parse(flagsJson) as SoftwareFeatureFlags;
                      flags[key] = !flags[key];
                      setFlagsJson(JSON.stringify(flags, null, 2));
                    } catch { /* ignore */ }
                  }}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-white/70 hover:bg-emerald-600/20"
                >
                  {key}
                </button>
              ))}
            </div>
            <label className="block text-xs text-white/60">
              Workflow steps (one per line)
              <textarea className="mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white min-h-[80px]" value={workflowText} onChange={(e) => setWorkflowText(e.target.value)} />
            </label>
            {(editConfig.modules ?? []).length > 0 && (
              <div>
                <p className="text-xs text-white/60 mb-2">Modules</p>
                <ul className="space-y-1">
                  {(editConfig.modules ?? []).map((mod) => (
                    <li key={mod.id} className="flex items-center justify-between text-sm py-1 border-b border-white/5">
                      <span className={cn(!mod.active && 'text-white/40 line-through')}>{mod.icon} {mod.label}</span>
                      <button type="button" onClick={() => toggleModule(mod)} className="text-xs text-emerald-400">{mod.active ? 'Disable' : 'Enable'}</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <button type="button" disabled={saving} onClick={save} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50">Save</button>
              <button type="button" onClick={() => { setEditingId(null); setEditConfig(null); }} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
