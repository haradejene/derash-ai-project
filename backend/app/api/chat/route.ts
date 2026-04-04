import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
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
    const aiResponse = await fetch(`${AI_SERVICE_URL}/ai/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    
    const aiData = await aiResponse.json();
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
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
    
  } catch (error) {
    console.error('Chat API error:', error);
    const response = NextResponse.json({ 
      response: "I'm having trouble connecting right now. Please try again.",
      intent: 'error',
      entities: {}
    }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }
}