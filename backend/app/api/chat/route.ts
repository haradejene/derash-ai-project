
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { message, userId } = await req.json();
    
    console.log('📝 Chat request:', { message, userId });
    
    // Call AI service
    const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://derash-ai-project.onrender.com';
    
    let aiData;
    let useFallback = false;
    
    try {
      const aiResponse = await fetch(`${AI_SERVICE_URL}/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      // Handle rate limiting
      if (aiResponse.status === 429) {
        console.log('⚠️ Rate limited by AI service');
        useFallback = true;
      } else {
        const responseText = await aiResponse.text();
        try {
          aiData = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ Failed to parse AI response:', responseText);
          useFallback = true;
        }
      }
    } catch (fetchError) {
      console.error('❌ AI service fetch error:', fetchError);
      useFallback = true;
    }
    
    // Use fallback if AI service failed
    if (useFallback || !aiData) {
      const msg = message.toLowerCase();
      let response = "How can I help you today? You can ask about bookings, spa services, or dining options.";
      let intent = 'fallback';
      let entities = {};
      
      if (msg.includes('book') || msg.includes('spa') || msg.includes('dinner') || msg.includes('restaurant')) {
        response = "I'd be happy to help you book that! Please let me know what time works best for you (6PM, 7PM, or 8PM).";
        intent = 'booking';
        entities = { service: msg.includes('spa') ? 'spa' : 'dinner' };
      } else if (msg.includes('complaint') || msg.includes('issue') || msg.includes('broken') || msg.includes('not working')) {
        response = "I'm sorry to hear that. I've notified our staff and they'll assist you shortly. Would you like a complimentary drink while you wait?";
        intent = 'complaint';
        entities = { category: 'general', priority: 'high' };
      } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        response = "Hello! Welcome to Derash AI. How can I make your stay exceptional today?";
        intent = 'greeting';
      }
      
      aiData = {
        response: response,
        intent: intent,
        entities: entities,
        text: response
      };
    }
    
    console.log('🤖 AI Response:', aiData);
    
    const supabase = await createClient();
    
    // Save message to database
    if (userId) {
      await supabase
        .from('messages')
        .insert({
          user_id: userId,
          message: message,
          response: aiData.response || aiData.text,
          intent: aiData.intent,
          entities: aiData.entities || {}
        });
      
      // If booking intent, create booking record
      if (aiData.intent === 'booking' && aiData.entities?.service) {
        await supabase
          .from('bookings')
          .insert({
            user_id: userId,
            service: aiData.entities.service,
            booking_time: aiData.entities.time || new Date().toISOString(),
            status: 'pending',
            special_requests: message
          });
        console.log('📅 Booking saved to database');
      }
      
      // If complaint intent, create complaint record
      if (aiData.intent === 'complaint') {
        await supabase
          .from('complaints')
          .insert({
            user_id: userId,
            message: message,
            category: aiData.entities?.category || 'general',
            priority: aiData.entities?.priority || 'medium',
            status: 'pending'
          });
        console.log('⚠️ Complaint saved to database');
      }
    }
    
    const response = NextResponse.json({
      response: aiData.response || aiData.text,
      intent: aiData.intent,
      entities: aiData.entities || {},
      bookingDetails: aiData.bookingDetails
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
    
  } catch (error) {
    console.error('Chat API error:', error);
    const response = NextResponse.json({ 
      response: "I'm having trouble connecting right now. Please try again.",
      intent: 'error',
      entities: {}
    }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}