'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { topSellers } from '@/data/services';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Paperclip, Image, Smile, Search, CheckCheck } from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { goHome } = useAppNavigation();
  const [selectedChat, setSelectedChat] = useState<string | null>('seller1');
  const [newMessage, setNewMessage] = useState('');

  const chatContacts = topSellers.map(seller => ({
    id: seller.id,
    name: seller.name,
    avatar: seller.avatar,
    lastMessage: 'Thank you for your interest! I can help you with that project.',
    time: '2 min ago',
    unread: Math.floor(Math.random() * 5),
    online: Math.random() > 0.5,
  }));

  const messages = [
    { id: 1, sender: 'seller', text: 'Hi! Welcome to our service. How can I help you today?', time: '10:00 AM' },
    { id: 2, sender: 'user', text: 'I need a 2D animation for my brand explainer video.', time: '10:02 AM' },
    { id: 3, sender: 'seller', text: 'Great! I\'d love to help. Can you share more details about your project? Duration, style preference, and any reference videos?', time: '10:03 AM' },
    { id: 4, sender: 'user', text: 'Sure! It should be around 60 seconds, modern flat style. Let me share a reference...', time: '10:05 AM' },
    { id: 5, sender: 'seller', text: 'Perfect! Based on your requirements, I\'d recommend our Standard package. It includes character design, storyboard, animation, and 2 rounds of revisions. Would you like to proceed?', time: '10:08 AM' },
    { id: 6, sender: 'user', text: 'That sounds great! What\'s the timeline and cost?', time: '10:10 AM' },
    { id: 7, sender: 'seller', text: 'For a 60-second animation, it would be ৳15,000 with delivery in 7 business days. I can start right after you place the order through Bridge. Your payment is protected until you approve the final delivery. 🎨', time: '10:12 AM' },
  ];

  const handleSend = () => {
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  const activeContact = chatContacts.find(c => c.id === selectedChat);

  return (
    <div className="min-h-screen pb-4">
      <div className="container  mx-auto px-4 sm:px-6 lg:px-8">
        <section className="glass rounded-2xl overflow-hidden border border-border-subtle" style={{ height: 'calc(100vh - var(--header-offset) - 8rem)' }}>
          <div className="flex h-full">
            {/* Contacts List */}
            <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r border-border-subtle`}>
              {/* Search */}
              <div className="p-4 border-b border-border-subtle">
                <h2 className="text-lg font-bold text-text-primary mb-3">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-bridge-primary"
                  />
                </div>
              </div>

              {/* Contact List */}
              <div className="flex-1 overflow-y-auto">
                {chatContacts.map(contact => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedChat(contact.id)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-background-soft transition-colors cursor-pointer text-left ${
                      selectedChat === contact.id ? 'bg-bridge-primary/10 border-r-2 border-bridge-primary' : ''
                    }`}
                  >
                    <div className="relative">
                      <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-bridge-secondary rounded-full border-2 border-bridge-dark"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-text-primary truncate">{contact.name}</h3>
                        <span className="text-xs text-text-muted">{contact.time}</span>
                      </div>
                      <p className="text-xs text-text-muted truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <span className="w-5 h-5 bg-bridge-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {contact.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            {selectedChat && activeContact ? (
              <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedChat(null)}
                      className="md:hidden p-1 text-text-muted cursor-pointer"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <img src={activeContact.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{activeContact.name}</h3>
                      <p className="text-xs text-bridge-secondary">{activeContact.online ? 'Online' : 'Offline'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <Video className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] md:max-w-[60%] p-3 rounded-2xl ${
                        msg.sender === 'user' 
                          ? 'bg-bridge-primary text-white rounded-br-md' 
                          : 'bg-surface-elevated text-text-primary rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                          <span className="text-xs opacity-60">{msg.time}</span>
                          {msg.sender === 'user' && <CheckCheck className="w-3 h-3 opacity-60" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border-subtle">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <Image className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2.5 bg-surface-elevated border border-border-subtle rounded-xl text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-bridge-primary"
                    />
                    <button className="p-2 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSend}
                      className="p-2.5 bg-bridge-primary text-white rounded-xl hover:bg-bridge-primary-light transition-colors cursor-pointer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">Select a conversation</h3>
                  <p className="text-sm text-text-muted">Choose a contact to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
