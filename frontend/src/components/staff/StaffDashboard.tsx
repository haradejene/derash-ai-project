"use client";

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  service: string;
  booking_time: string;
  status: string;
  user_id: string;
  users?: {
    name: string;
    room_number: string;
  };
}

interface Complaint {
  id: string;
  message: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  users?: {
    name: string;
    room_number: string;
  };
}

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingComplaints: 0,
    todayBookings: 0,
    activeComplaints: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsData, complaintsData, statsData] = await Promise.all([
        api.getBookings(),
        api.getComplaints(),
        api.getDashboardStats()
      ]);
      setBookings(bookingsData.bookings || []);
      setComplaints(complaintsData.complaints || []);
      setStats(statsData.stats || {});
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/staff/login');
  };

  const updateComplaintStatus = async (complaintId: string, status: string) => {
    try {
      await api.updateComplaintStatus(complaintId, status);
      toast.success('Complaint updated');
      loadData();
    } catch (error) {
      toast.error('Failed to update complaint');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-green-900 to-green-800 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-semibold">Staff Dashboard</h1>
            <p className="text-sm text-amber-200">Welcome, {user?.full_name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Pending Complaints</p>
          <p className="text-3xl font-bold text-red-600">{stats.pendingComplaints || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Today's Bookings</p>
          <p className="text-3xl font-bold text-green-600">{stats.todayBookings || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Active Complaints</p>
          <p className="text-3xl font-bold text-orange-600">{stats.activeComplaints || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md m-6 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 10).map((booking) => (
              <div key={booking.id} className="border-b pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{booking.service}</p>
                    <p className="text-sm text-gray-600">
                      Guest: {booking.users?.name || 'Unknown'} | Room: {booking.users?.room_number || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.booking_time).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md m-6 p-6">
        <h2 className="text-xl font-bold mb-4">Recent Complaints</h2>
        {complaints.length === 0 ? (
          <p className="text-gray-500">No complaints yet</p>
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 10).map((complaint) => (
              <div key={complaint.id} className={`border-l-4 p-4 rounded ${
                complaint.priority === 'high' ? 'border-red-500 bg-red-50' :
                complaint.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-blue-500 bg-blue-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold capitalize">{complaint.category}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        complaint.priority === 'high' ? 'bg-red-200 text-red-800' :
                        complaint.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {complaint.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        complaint.status === 'resolved' ? 'bg-green-200 text-green-800' :
                        complaint.status === 'in_progress' ? 'bg-blue-200 text-blue-800' :
                        'bg-gray-200 text-gray-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{complaint.message}</p>
                    <p className="text-xs text-gray-500">
                      Guest: {complaint.users?.name || 'Unknown'} | Room: {complaint.users?.room_number || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(complaint.created_at).toLocaleString()}
                    </p>
                  </div>
                  {complaint.status === 'pending' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint.id, 'in_progress')}
                      className="ml-4 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {complaint.status === 'in_progress' && (
                    <button
                      onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                      className="ml-4 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}