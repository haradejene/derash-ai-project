"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface HeaderProps {
  guestName: string;
  roomNumber: string;
  guestImage?: string;
}

export default function Header({ guestName, roomNumber, guestImage }: HeaderProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <header className="bg-surface/70 backdrop-blur-md text-primary font-headline font-bold tracking-tight sticky top-0 z-50">
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
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-2 text-on-surface/60 hover:bg-red-50 hover:text-red-600 transition-all duration-300 px-3 py-1 rounded-full text-sm"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
          
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">
              {user?.role === 'staff' ? 'Staff Member' : 'Premium Guest'}
            </p>
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
        </nav>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Logout?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}