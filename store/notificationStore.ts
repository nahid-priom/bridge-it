'use client';

import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  setItems: (items: NotificationItem[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  prepend: (item: NotificationItem) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  unreadCount: 0,
  setItems: (items) =>
    set({
      items,
      unreadCount: items.filter((i) => !i.read).length,
    }),
  markRead: (id) =>
    set((state) => {
      const items = state.items.map((i) => (i.id === id ? { ...i, read: true } : i));
      return { items, unreadCount: items.filter((i) => !i.read).length };
    }),
  markAllRead: () =>
    set((state) => ({
      items: state.items.map((i) => ({ ...i, read: true })),
      unreadCount: 0,
    })),
  prepend: (item) =>
    set((state) => {
      const items = [item, ...state.items.filter((i) => i.id !== item.id)];
      return { items, unreadCount: items.filter((i) => !i.read).length };
    }),
}));
