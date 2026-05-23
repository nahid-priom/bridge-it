'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { X, Send, Headphones, MessageCircle, Bot } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const { isChatOpen, toggleChat } = useStore();
  const { goToCategories, goToMessages, goToDashboard, goToAbout } = useAppNavigation();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'Welcome to Bridge! 👋 How can I help you today?', time: 'Just now' },
  ]);

  const quickActions = [
    { label: '🔍 Find a Service', action: () => { toggleChat(); goToCategories(); } },
    { label: '💬 Message Seller', action: () => { toggleChat(); goToMessages(); } },
    { label: '📦 Track Order', action: () => { toggleChat(); goToDashboard(); } },
    { label: '❓ How It Works', action: () => { toggleChat(); goToAbout(); } },
  ];

  const handleSend = () => {
    if (!message.trim()) return;
    setChatMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: message, time: 'Just now' }]);
    setMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: 'Thank you for reaching out! Our support team will get back to you shortly. In the meantime, you can browse our services or check the FAQ.',
        time: 'Just now',
      }]);
    }, 1000);
  };

  if (!isChatOpen) {
    return (
      <button
        type="button"
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-bridge-primary to-bridge-primary-light text-white rounded-full shadow-2xl shadow-bridge-primary/30 flex items-center justify-center hover:scale-110 transition-transform z-50 animate-pulse-glow cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/50"
        aria-label="Open chat support"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] max-w-[calc(100vw-2rem)] glass-strong rounded-2xl shadow-2xl shadow-bridge-primary/20 z-50 overflow-hidden border border-border-subtle flex flex-col" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-bridge-primary to-bridge-primary-light p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" aria-hidden />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Bridge Support</h3>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-bridge-secondary rounded-full" aria-hidden />
              Online
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleChat}
          className="p-1 text-white/80 hover:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/40 rounded-lg"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '300px' }}>
        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-bridge-primary text-white rounded-br-md'
                  : 'bg-background-soft border border-border-subtle text-text-primary rounded-bl-md'
              }`}
            >
              {msg.sender === 'bot' && (
                <div className="flex items-center gap-1 mb-1">
                  <Bot className="w-3 h-3 text-bridge-primary" aria-hidden />
                  <span className="text-xs text-text-muted font-medium">Bridge Bot</span>
                </div>
              )}
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-white/70' : 'text-text-muted'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-border-subtle flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickActions.map((action, i) => (
            <button
              key={i}
              type="button"
              onClick={action.action}
              className="px-3 py-1.5 bg-background-soft border border-border-subtle text-xs text-text-secondary rounded-full whitespace-nowrap hover:bg-bridge-primary/10 hover:text-text-primary hover:border-bridge-primary/30 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/30"
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border-subtle flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-background-soft border border-border-subtle rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-bridge-primary focus:ring-2 focus:ring-bridge-primary/20"
          />
          <button
            type="button"
            onClick={handleSend}
            className="p-2.5 bg-bridge-primary text-white rounded-xl hover:bg-bridge-primary-light transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-bridge-primary/40"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
