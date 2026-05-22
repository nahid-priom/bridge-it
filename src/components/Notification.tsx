import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle, X } from 'lucide-react';

export const Notification: React.FC = () => {
  const { notification, setNotification } = useStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  return (
    <div className="fixed top-24 right-4 z-[100] animate-slide-up">
      <div className="glass-strong rounded-xl p-4 flex items-center gap-3 border border-bridge-secondary/30 shadow-2xl shadow-bridge-secondary/10 max-w-sm">
        <CheckCircle className="w-5 h-5 text-bridge-secondary flex-shrink-0" />
        <p className="text-sm text-white flex-1">{notification}</p>
        <button 
          onClick={() => setNotification(null)}
          className="p-1 text-bridge-gray hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
