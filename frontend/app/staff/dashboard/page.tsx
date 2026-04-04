"use client";

import { useEffect } from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import StaffDashboard from '../../../src/components/staff/StaffDashboard';
import { Toaster } from 'react-hot-toast';

export default function StaffDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/staff/login');
      } else if (user.role !== 'staff' && user.role !== 'admin') {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!user || (user.role !== 'staff' && user.role !== 'admin')) {
    return null;
  }

  return (
    <>
      <Toaster position="top-right" />
      <StaffDashboard />
    </>
  );
}