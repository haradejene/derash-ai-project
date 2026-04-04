"use client";

import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ExplorePage() {
  const { user } = useAuth();

  return (
    <>
      <Header 
        guestName={user?.full_name || 'Guest'} 
        roomNumber={user?.room_number || 'Not Assigned'} 
      />
      
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Chat
          </Link>
          
          {/* Coming Soon Card */}
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">🚧</div>
            <h1 className="text-3xl font-serif font-bold text-green-900 mb-4">
              Coming Soon!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              We're working hard to bring you an amazing explore experience.
              <br />
              Discover resort amenities, local attractions, and exclusive offers soon.
            </p>
            <div className="flex justify-center gap-4">
              <div className="bg-amber-100 rounded-full px-4 py-2 text-sm text-amber-800">
                🌊 Pool & Spa
              </div>
              <div className="bg-amber-100 rounded-full px-4 py-2 text-sm text-amber-800">
                🍽️ Restaurants
              </div>
              <div className="bg-amber-100 rounded-full px-4 py-2 text-sm text-amber-800">
                🎉 Events
              </div>
            </div>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-3">🏨</div>
              <h3 className="font-semibold text-gray-800">Amenities</h3>
              <p className="text-sm text-gray-500 mt-1">Explore hotel facilities</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-semibold text-gray-800">Local Attractions</h3>
              <p className="text-sm text-gray-500 mt-1">Things to do nearby</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-semibold text-gray-800">Exclusive Offers</h3>
              <p className="text-sm text-gray-500 mt-1">Special deals for guests</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}