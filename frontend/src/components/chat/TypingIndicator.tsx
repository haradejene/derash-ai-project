"use client";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 self-start opacity-70">
      <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center">
        <span className="material-symbols-outlined text-[14px] text-primary">smart_toy</span>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  );
}