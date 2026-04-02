"use client";

import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
  guestName: string;
  roomNumber: string;
  guestImage?: string;
}

export default function Header({ guestName, roomNumber, guestImage }: HeaderProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  return (
    <header className="bg-surface/70 backdrop-blur-md text-primary dark:text-surface font-headline font-bold tracking-tight sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-black text-primary">Derash AI (ደራሽ)</span>
          <div className="hidden md:flex h-6 w-[1px] bg-outline-variant/30"></div>
          <div className="hidden md:flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full text-xs font-semibold">
            <span className="material-symbols-outlined text-sm">meeting_room</span>
            <span>Room {roomNumber}</span>
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <button 
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="text-on-surface/60 hover:bg-surface-container transition-all duration-300 px-3 py-1 rounded-full text-sm"
          >
            Language
          </button>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">Premium Guest</p>
              <p className="text-sm font-bold">{guestName}</p>
            </div>
            
            <button className="relative hover:bg-surface-container transition-all duration-300 rounded-full p-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/20">
                {guestImage ? (
                  <Image 
                    src={guestImage} 
                    alt={guestName}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">person</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary border-2 border-surface rounded-full"></div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}