import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PageFallbackProps {
  title: string;
  message: string;
  backLabel: string;
  onBack: () => void;
}

export const PageFallback: React.FC<PageFallbackProps> = ({
  title,
  message,
  backLabel,
  onBack,
}) => (
  <div className="min-h-screen pt-20 pb-20">
    <div className="max-w-lg mx-auto px-4 text-center">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-bridge-gray hover:text-white transition-colors mb-8 mx-auto cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </button>
      <div className="glass rounded-2xl p-10 border border-white/10">
        <h1 className="text-xl font-bold text-white mb-2">{title}</h1>
        <p className="text-sm text-bridge-gray">{message}</p>
      </div>
    </div>
  </div>
);
