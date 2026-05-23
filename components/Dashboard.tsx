'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { ArrowLeft, Package, Star, DollarSign, BarChart3, TrendingUp, ShoppingBag, CheckCircle, AlertCircle, Eye, Settings, Bell, Plus, ExternalLink, Copy } from 'lucide-react';
import type { DashboardOrderView, DashboardPageData } from '@/types/dashboard';

const STAT_ICONS = [
  <DollarSign key="rev" className="w-5 h-5" />,
  <Package key="ord" className="w-5 h-5" />,
  <Star key="rev2" className="w-5 h-5" />,
  <Eye key="eye" className="w-5 h-5" />,
];

const STAT_COLORS = [
  'from-green-400 to-emerald-500',
  'from-bridge-primary to-purple-500',
  'from-bridge-gold to-orange-500',
  'from-bridge-cyan to-blue-500',
];

const FALLBACK_STATS = [
  { label: 'Total Revenue', value: '৳0', change: '—' },
  { label: 'Active Orders', value: '0', change: '—' },
  { label: 'Total Reviews', value: '0', change: '—' },
  { label: 'Completed Projects', value: '0', change: '—' },
];

const FALLBACK_ORDERS: DashboardOrderView[] = [];

interface DashboardProps {
  data?: DashboardPageData | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { setNotification } = useStore();
  const { goHome } = useAppNavigation();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'services' | 'analytics'>('overview');

  const stats = (data?.stats ?? FALLBACK_STATS).map((stat, i) => ({
    ...stat,
    icon: STAT_ICONS[i],
    color: STAT_COLORS[i],
  }));

  const recentOrders = data?.recentOrders?.length ? data.recentOrders : FALLBACK_ORDERS;
  const customUrl = data?.customUrl ?? 'bridge.app/s/your-shop';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-bridge-secondary bg-bridge-secondary/10';
      case 'in-progress': return 'text-bridge-cyan bg-bridge-cyan/10';
      case 'review': return 'text-bridge-gold bg-bridge-gold/10';
      case 'pending': return 'text-text-muted bg-background-soft';
      default: return 'text-text-muted bg-background-soft';
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-1">Dashboard</h1>
            <p className="text-text-muted">Manage your services, orders, and analytics</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="px-4 py-2 glass border border-border-subtle text-text-primary text-sm font-medium rounded-xl hover:bg-background-soft transition-all flex items-center gap-2 cursor-pointer">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button className="px-4 py-2 bg-bridge-primary text-white text-sm font-medium rounded-xl hover:bg-bridge-primary-light transition-all flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
        </header>

        {/* Custom URL Banner */}
        <div className="glass rounded-2xl p-4 md:p-6 border border-bridge-primary/20 mb-8 bg-gradient-to-r from-bridge-primary/5 to-bridge-secondary/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ExternalLink className="w-6 h-6 text-bridge-primary" />
              <div>
                <h3 className="text-sm font-bold text-text-primary">Your Custom URL</h3>
                <p className="text-xs text-text-muted">Share this link anywhere to bring customers directly to your profile</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <code className="px-3 py-2 bg-surface-elevated rounded-lg text-sm text-bridge-primary-light font-mono">
                {customUrl}
              </code>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(customUrl);
                  setNotification('URL copied! Share it on Facebook, Instagram, or anywhere.');
                  setTimeout(() => setNotification(null), 3000);
                }}
                className="p-2 bg-bridge-primary/20 text-bridge-primary-light rounded-lg cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="glass rounded-2xl p-5 border border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                <span className="text-xs font-medium text-bridge-secondary flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-surface rounded-xl mb-6 max-w-md">
          {(['overview', 'orders', 'services', 'analytics'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${
                activeTab === tab ? 'bg-bridge-primary text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-bridge-primary" /> Recent Orders
              </h3>
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex items-center gap-3 p-3 bg-background-soft rounded-xl">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-text-primary truncate">{order.service}</h4>
                      <p className="text-xs text-text-muted">{order.buyer} • {order.date}</p>
                    </div>
                    <span className="text-sm font-bold text-text-primary">{order.amount}</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-bridge-secondary" /> Performance
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">Response Rate</span>
                      <span className="text-text-primary font-medium">98%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-bridge-secondary to-emerald-400 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">Order Completion</span>
                      <span className="text-text-primary font-medium">95%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-bridge-primary to-purple-400 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">Customer Satisfaction</span>
                      <span className="text-text-primary font-medium">4.9/5</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-bridge-gold to-orange-400 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-bridge-gold" /> Notifications
                </h3>
                <div className="space-y-3">
                  {[
                    { text: 'New order received for "2D Animation"', time: '5 min ago', type: 'success' },
                    { text: 'Review request from Rahim Ahmed', time: '1 hour ago', type: 'info' },
                    { text: 'Payment of ৳8,000 released', time: '3 hours ago', type: 'success' },
                  ].map((notif, i) => (
                    <div key={i} className="flex items-start gap-3 p-2">
                      {notif.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-bridge-secondary mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-bridge-cyan mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="text-xs text-text-primary">{notif.text}</p>
                        <p className="text-xs text-text-muted">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase">Order ID</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase">Service</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase">Buyer</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase">Amount</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase">Status</th>
                    <th className="text-left p-4 text-xs font-medium text-text-muted uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-border-subtle hover:bg-background-soft transition-colors">
                      <td className="p-4 text-sm font-mono text-bridge-primary-light">{order.id}</td>
                      <td className="p-4 text-sm text-text-primary">{order.service}</td>
                      <td className="p-4 text-sm text-text-muted">{order.buyer}</td>
                      <td className="p-4 text-sm font-bold text-text-primary">{order.amount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-text-muted">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="glass rounded-2xl p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-text-primary mb-2">Manage Your Services</h3>
            <p className="text-text-muted mb-6">Add, edit, and manage your digital service offerings</p>
            <button className="px-6 py-3 bg-bridge-primary text-white font-medium rounded-xl hover:bg-bridge-primary-light transition-colors flex items-center gap-2 mx-auto cursor-pointer">
              <Plus className="w-4 h-4" /> Add New Service
            </button>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-6">Revenue Overview</h3>
              <div className="space-y-3">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
                  const width = [45, 62, 78, 55, 88, 95][i];
                  return (
                    <div key={month} className="flex items-center gap-3">
                      <span className="text-xs text-text-muted w-8">{month}</span>
                      <div className="flex-1 h-6 bg-surface-elevated rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-bridge-primary to-bridge-primary-light rounded-lg transition-all duration-1000"
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-text-primary font-medium w-16 text-right">৳{(width * 200).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-bold text-text-primary mb-6">Traffic Sources</h3>
              <div className="space-y-4">
                {[
                  { source: 'Facebook Ads', value: 42, color: 'from-blue-500 to-blue-600' },
                  { source: 'Direct / Custom URL', value: 28, color: 'from-bridge-primary to-purple-500' },
                  { source: 'Instagram', value: 18, color: 'from-pink-500 to-rose-500' },
                  { source: 'Google Search', value: 8, color: 'from-bridge-secondary to-emerald-500' },
                  { source: 'Other', value: 4, color: 'from-bridge-gray to-gray-500' },
                ].map(item => (
                  <div key={item.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted">{item.source}</span>
                      <span className="text-text-primary font-medium">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
