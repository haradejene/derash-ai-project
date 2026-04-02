"use client";

import { useState } from 'react';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  senderName?: string;
  isSystem?: boolean;
  bookingDetails?: {
    service: string;
    guests: number;
    time: string;
    imageUrl?: string;
  };
}

export default function MessageBubble({ 
  message, 
  isUser, 
  timestamp, 
  senderName = "Derash Concierge",
  isSystem,
  bookingDetails
}: MessageBubbleProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
          {message}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 max-w-[85%] ${isUser ? 'self-end' : 'self-start'}`}>
      {!isUser && (
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">{senderName}</span>
        </div>
      )}
      
      <div className={`p-5 rounded-xl shadow-lg ${
        isUser 
          ? 'bg-primary-container text-on-primary-container rounded-tr-none' 
          : 'bg-surface-container-lowest rounded-tl-none shadow-sm border border-outline-variant/10'
      }`}>
        <p className="leading-relaxed whitespace-pre-wrap">{message}</p>
        
        {bookingDetails && !isUser && (
          <div className="mt-6 p-4 rounded-lg bg-surface-container-low flex items-center justify-between group cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-4">
              {bookingDetails.imageUrl && (
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img src={bookingDetails.imageUrl} alt={bookingDetails.service} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-primary">Reservation Confirmed</p>
                <p className="text-xs text-on-surface-variant">
                  {bookingDetails.service} • {bookingDetails.guests} Guests • {bookingDetails.time}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-secondary hover:underline text-sm font-bold"
            >
              View Details
            </button>
          </div>
        )}
      </div>
      
      <div className={`flex items-center gap-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <span className="text-[10px] text-on-surface-variant font-medium">{timestamp}</span>
        {isUser && (
          <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            done_all
          </span>
        )}
      </div>
    </div>
  );
}