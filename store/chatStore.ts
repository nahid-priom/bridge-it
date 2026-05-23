'use client';

import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: 'buyer' | 'seller' | 'admin' | 'support';
  content: string;
  createdAt: string;
  read?: boolean;
}

interface ChatState {
  activeConversationId: string | null;
  messages: ChatMessage[];
  isLoading: boolean;
  setActiveConversation: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  messages: [],
  isLoading: false,
  setActiveConversation: (activeConversationId) => set({ activeConversationId }),
  setMessages: (messages) => set({ messages, isLoading: false }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
