"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  useEffect(() => {
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      window.location.href = '/staff/dashboard';
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const loggedInUser = await login(email, password);
      console.log('Logged in user role:', loggedInUser.role);
      
      if (loggedInUser.role === 'staff' || loggedInUser.role === 'admin') {
        toast.success('Welcome staff!');
        window.location.href = '/staff/dashboard';
      } else {
        toast.error('You do not have staff privileges. Use email ending with @staff.com');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-green-900">Staff Portal</h1>
          <p className="text-amber-600 mt-2">Staff Login</p>
          <p className="text-xs text-gray-500 mt-2">Use email ending with @staff.com or @admin.com</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Staff Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="staff@staff.com"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="••••••••"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white py-3 rounded-xl font-semibold hover:from-green-800 hover:to-green-900 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Staff Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            Need staff access?{' '}
            <Link href="/staff/signup" className="text-amber-600 hover:text-amber-700 font-semibold">
              Register as Staff
            </Link>
          </p>
          <p className="text-sm text-gray-500">
            Guest?{' '}
            <Link href="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Guest Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}