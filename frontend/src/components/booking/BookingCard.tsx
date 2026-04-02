"use client";

import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { BookingDetails } from '../../types';

interface BookingCardProps {
  booking: BookingDetails;
  onConfirm?: () => void;
  onExplore?: () => void;
  onComplain?: () => void;
}

export default function BookingCard({ booking, onConfirm, onExplore, onComplain }: BookingCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-amber-100 overflow-hidden max-w-sm">
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2">
        <h3 className="text-white font-semibold text-sm">Reservation Confirmed</h3>
      </div>
      
      <div className="p-4 space-y-2">
        <p className="font-semibold text-gray-800">{booking.service}</p>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={14} />
          <span>{booking.guests} Guests</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={14} />
          <span>{booking.time}</span>
        </div>
        
        {booking.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>{booking.location}</span>
          </div>
        )}
      </div>
      
      <div className="flex border-t border-gray-100">
        <button 
          onClick={onConfirm}
          className="flex-1 py-2 text-center text-green-700 text-sm font-medium hover:bg-green-50 transition"
        >
          📅 BOOK
        </button>
        <button 
          onClick={onExplore}
          className="flex-1 py-2 text-center text-amber-700 text-sm font-medium hover:bg-amber-50 transition border-l border-gray-100"
        >
          📍 EXPLORE
        </button>
        <button 
          onClick={onComplain}
          className="flex-1 py-2 text-center text-red-600 text-sm font-medium hover:bg-red-50 transition border-l border-gray-100"
        >
          🎁 COMPLAIN
        </button>
      </div>
    </div>
  );
}