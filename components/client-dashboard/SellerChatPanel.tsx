'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Paperclip, Send } from 'lucide-react';
import { DashboardCard } from '@/components/client-dashboard/ui/DashboardCard';
import { sendMarketplaceMessageAction } from '@/app/actions/client-dashboard';
import type { ClientChatMessage, ClientMessage } from '@/types/client-dashboard';
import { cn } from '@/lib/cn';

export function SellerChatPanel({
  conversations,
  messagesByConversation,
}: {
  conversations: ClientMessage[];
  messagesByConversation: Record<string, ClientChatMessage[]>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [draft, setDraft] = useState('');
  const [activeId, setActiveId] = useState(conversations[0]?.id ?? '');
  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const thread = active ? (messagesByConversation[active.id] ?? []) : [];

  const send = () => {
    if (!active || !draft.trim()) return;
    startTransition(async () => {
      await sendMarketplaceMessageAction({
        conversationId: active.id,
        content: draft,
      });
      setDraft('');
      router.refresh();
    });
  };

  return (
    <DashboardCard className="overflow-hidden min-h-[480px] lg:min-h-[560px] flex flex-col lg:flex-row">
      <div className="lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-white/10 shrink-0">
        <div className="p-4 border-b border-slate-100 dark:border-white/10">
          <h2 className="font-bold text-text-primary">Messages</h2>
        </div>
        <ul className="max-h-[200px] lg:max-h-none overflow-y-auto">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <button
                type="button"
                onClick={() => setActiveId(conv.id)}
                className={cn(
                  'w-full text-left px-4 py-3 flex gap-3 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors',
                  activeId === conv.id && 'bg-emerald-50/50 dark:bg-emerald-500/10'
                )}
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-deshi-green to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {conv.sellerName.charAt(0)}
                  </div>
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-1">
                    <span className="text-sm font-semibold truncate">{conv.sellerName}</span>
                    {conv.unread > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-deshi-green text-white text-[10px] font-bold flex items-center justify-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-muted truncate">{conv.lastMessage}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {active && (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-deshi-green to-violet-500 flex items-center justify-center text-white text-sm font-bold">
              {active.sellerName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{active.sellerName}</p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                {active.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {thread.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">No messages yet. Say hello!</p>
            ) : (
              thread.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm',
                    msg.from === 'client'
                      ? 'ml-auto bg-deshi-green text-white'
                      : 'bg-slate-100 dark:bg-white/10 text-text-primary'
                  )}
                >
                  {msg.text}
                  <p
                    className={cn(
                      'text-[10px] mt-1',
                      msg.from === 'client' ? 'text-white/70' : 'text-text-muted'
                    )}
                  >
                    {msg.time}
                  </p>
                </motion.div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-slate-100 dark:border-white/10 flex gap-2">
            <button
              type="button"
              className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10"
              aria-label="Attach file"
            >
              <Paperclip className="w-5 h-5 text-text-muted" />
            </button>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Type a message…"
              disabled={pending}
              className="flex-1 h-11 px-4 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-sm focus:outline-none focus:border-deshi-green/40"
            />
            <button
              type="button"
              disabled={pending}
              onClick={send}
              className="p-2.5 rounded-xl bg-deshi-green text-white hover:brightness-105 disabled:opacity-60"
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
