"use client";

import { useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

const quickActions = [
  { icon: "calendar_add_on", label: "Book", type: "booking" },
  { icon: "explore", label: "Explore", type: "explore" },
  { icon: "report_problem", label: "Complain", type: "complaint", isError: true },
];

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleQuickAction = (actionLabel: string) => {
    onSend(actionLabel);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      <div className="flex justify-center mb-4 px-4">
        <div className="bg-surface-container-lowest/80 backdrop-blur-xl px-2 py-2 rounded-full shadow-xl border border-outline-variant/15 flex items-center gap-1">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.label)}
              className={`flex items-center gap-2 px-4 py-2 hover:bg-surface-container transition-colors rounded-full text-xs font-bold uppercase tracking-wider ${
                action.isError ? 'text-error' : 'text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-surface/90 backdrop-blur-xl border-t border-outline-variant/15 shadow-[0_-20px_40px_rgba(27,29,14,0.06)] px-6 pb-8 pt-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">add_circle</span>
          </button>
          
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Derash anything..."
              disabled={disabled}
              className="w-full bg-surface-container-highest border-none rounded-full py-4 px-6 text-on-surface focus:ring-2 focus:ring-secondary/20 placeholder:text-on-surface-variant/50 font-medium"
            />
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className="absolute right-2 top-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                send
              </span>
            </button>
          </form>
          
          <button className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">mic</span>
          </button>
        </div>
      </div>
    </div>
  );
}