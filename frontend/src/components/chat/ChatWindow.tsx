"use client";

import { useState, useRef, useEffect } from 'react';
import Header from '../layout/Header';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import QuickActions from './QuickActions';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ChatWindow() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>(() => [
    {
      id: Date.now(),
      text: `Good ${getTimeOfDay()}, ${user?.full_name || 'Guest'}. Welcome to ${user?.room_number ? `Room ${user.room_number}` : 'Derash AI'}.\n\nHow may I make your stay exceptional today? I can assist with dining reservations, spa treatments, or local excursions.`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: "Derash Concierge"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function getTimeOfDay() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addSystemMessage = (text: string) => {
    const systemMessage = {
      id: Date.now() + Math.random(),
      text: text,
      isUser: false,
      isSystem: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSend = async (text: string) => {
    const userMessage = {
      id: Date.now(),
      text: text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    try {
      const response = await api.sendMessage(text, user?.id);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: response.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderName: "Derash Concierge",
        bookingDetails: response.bookingDetails
      };
      setMessages(prev => [...prev, aiMessage]);
      
      if (response.intent === 'complaint') {
        setTimeout(() => {
          addSystemMessage("✓ Staff has been notified and will assist you shortly");
        }, 500);
        toast.success('Complaint sent to staff!');
      }
      
      if (response.intent === 'booking') {
        toast.success('Booking request sent to staff! ✨');
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Unable to process request. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Header 
        guestName={user?.full_name || 'Guest'} 
        roomNumber={user?.room_number || 'Not Assigned'} 
      />
      
      <main className="flex-1 overflow-y-auto relative px-4 md:px-20 lg:px-64 py-8 flex flex-col gap-8 scroll-smooth">
        <div className="heritage-pattern"></div>
        
        <div className="flex justify-center">
          <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            Today
          </span>
        </div>
        
        {messages.map((msg, index) => (
          <MessageBubble
            key={msg.id || index}
            message={msg.text}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
            senderName={msg.senderName}
            isSystem={msg.isSystem}
            bookingDetails={msg.bookingDetails}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} className="h-32" />
      </main>
      
      <QuickActions onSelect={handleSend} />
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </>
  );
}