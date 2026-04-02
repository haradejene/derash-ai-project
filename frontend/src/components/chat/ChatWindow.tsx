"use client";

import { useState, useRef, useEffect } from 'react';
import Header from '../../components/layout/Header';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ChatInput from './ChatInput';
import { sendMessage } from '../../services/mockApi';
import { Message } from '../../types';
import toast from 'react-hot-toast';

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Good evening, Ms. Selassie. Welcome back to the Royal Suite.\n\nI noticed you've just checked in. How may I make your stay exceptional tonight? I can assist with dining reservations, spa treatments, or local excursions.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderName: "Derash Concierge"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [guestName] = useState("Abeba Selassie");
  const [roomNumber] = useState("402");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addSystemMessage = (text: string) => {
    const systemMessage: Message = {
      id: messages.length + 1,
      text: text,
      isUser: false,
      isSystem: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: text,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsTyping(true);
    
    try {
      const response = await sendMessage(text);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response.text,
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
      }
      
      if (response.intent === 'booking') {
        toast.success('Reservation confirmed! ✨');
      }
      
    } catch (error) {
      toast.error('Unable to process request. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Header guestName={guestName} roomNumber={roomNumber} />
      
      <main className="flex-1 overflow-y-auto relative px-4 md:px-20 lg:px-64 py-8 flex flex-col gap-8 scroll-smooth">
        <div className="heritage-pattern"></div>
        
        <div className="flex justify-center">
          <span className="bg-surface-container text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
            Today
          </span>
        </div>
        
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
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
      
      <ChatInput onSend={handleSend} disabled={isTyping} />
    </>
  );
}