'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Percent,
  CreditCard,
  Unlock,
  Shield,
  MessageSquare,
  UserCheck,
  Headphones,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface SettingCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingCard({ icon: Icon, title, description, children }: SettingCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-white/8">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-xl bg-bridge-primary/15 text-bridge-primary-light">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-bridge-gray mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export const AdminSettingsSection: React.FC = () => {
  const [commission, setCommission] = useState(15);
  const [escrowDays, setEscrowDays] = useState(7);
  const [autoVerify, setAutoVerify] = useState(false);
  const [moderation, setModeration] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SettingCard icon={Percent} title="Commission Percentage" description="Platform fee on each completed order">
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={5}
              max={30}
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              className="flex-1 accent-bridge-primary"
            />
            <span className="text-lg font-bold text-white w-12">{commission}%</span>
          </div>
        </SettingCard>

        <SettingCard icon={CreditCard} title="Payment Gateway" description="bKash, Nagad, Stripe configuration">
          <div className="space-y-2">
            {['bKash', 'Nagad', 'Stripe'].map((gw) => (
              <label key={gw} className="flex items-center justify-between p-3 rounded-xl glass text-sm cursor-pointer">
                <span className="text-white">{gw}</span>
                <input type="checkbox" defaultChecked={gw !== 'Stripe'} className="accent-bridge-primary" />
              </label>
            ))}
          </div>
        </SettingCard>

        <SettingCard icon={Unlock} title="Escrow Release Rules" description="When funds are released to sellers">
          <label className="text-xs text-bridge-gray block mb-2">Auto-release after delivery approval (days)</label>
          <input
            type="number"
            value={escrowDays}
            onChange={(e) => setEscrowDays(Number(e.target.value))}
            className="w-full px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-bridge-primary"
          />
        </SettingCard>

        <SettingCard icon={Shield} title="Anti-Piracy Settings" description="Watermark and preview protection">
          <label className="flex items-center gap-2 text-sm text-bridge-gray cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-bridge-primary" />
            Enable BRIDGE PREVIEW watermark on demos
          </label>
          <label className="flex items-center gap-2 text-sm text-bridge-gray mt-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-bridge-primary" />
            Block right-click on protected galleries
          </label>
        </SettingCard>

        <SettingCard icon={MessageSquare} title="Review Moderation" description="Approve reviews before publishing">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-white">Require admin approval</span>
            <input
              type="checkbox"
              checked={moderation}
              onChange={(e) => setModeration(e.target.checked)}
              className="accent-bridge-primary"
            />
          </label>
        </SettingCard>

        <SettingCard icon={UserCheck} title="Seller Verification Rules" description="Requirements for new sellers">
          <label className="flex items-center justify-between cursor-pointer mb-2">
            <span className="text-sm text-white">Auto-approve low-risk sellers</span>
            <input
              type="checkbox"
              checked={autoVerify}
              onChange={(e) => setAutoVerify(e.target.checked)}
              className="accent-bridge-primary"
            />
          </label>
          <p className="text-xs text-bridge-gray">NID + portfolio required for all sellers</p>
        </SettingCard>

        <SettingCard icon={Headphones} title="Support Settings" description="Support channels and SLA">
          <input
            placeholder="Support email"
            defaultValue="support@bridge.app"
            className="w-full px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-white text-sm mb-2 focus:outline-none focus:border-bridge-primary"
          />
          <input
            placeholder="Response SLA (hours)"
            defaultValue="24"
            className="w-full px-4 py-2.5 bg-bridge-dark-2 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-bridge-primary"
          />
        </SettingCard>
      </div>

      <button
        type="button"
        className="w-full sm:w-auto px-6 py-3 bg-bridge-primary hover:bg-bridge-primary-light text-white font-medium rounded-xl cursor-pointer"
      >
        Save Platform Settings
      </button>
    </motion.div>
  );
};
