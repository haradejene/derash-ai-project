"use client";

import ChatWindow from '../src/components/chat/ChatWindow';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
        }}
      />
      <ChatWindow />
    </>
  );
}