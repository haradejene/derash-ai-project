"use client";

import ChatWindow from '../src/components/chat/ChatWindow';
import ProtectedRoute from '../src/components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <ProtectedRoute allowedRoles={['guest']}>
      <Toaster position="top-right" />
      <ChatWindow />
    </ProtectedRoute>
  );
}