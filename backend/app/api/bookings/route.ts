import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const status = searchParams.get('status');
  
  let query = supabaseAdmin
    .from('bookings')
    .select('*, users(name, room_number)');
  
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('booking_time', { ascending: true });
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ bookings: data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, service, bookingTime, guests, specialRequests } = body;
    
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        user_id: userId,
        service: service,
        booking_time: bookingTime,
        guests: guests || 1,
        special_requests: specialRequests,
        status: 'confirmed'
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ booking: data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}