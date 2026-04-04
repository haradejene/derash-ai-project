import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get counts
    const [
      { count: pendingComplaints },
      { count: todayBookings },
      { count: activeComplaints },
      { data: recentAlerts }
    ] = await Promise.all([
      supabaseAdmin
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      supabaseAdmin
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString()),
      
      supabaseAdmin
        .from('complaints')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_progress']),
      
      supabaseAdmin
        .from('dashboard_alerts')
        .select('*')
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false })
        .limit(10)
    ]);
    
    // Get high priority complaints
    const { data: highPriorityComplaints } = await supabaseAdmin
      .from('complaints')
      .select('*, users(name, room_number)')
      .eq('priority', 'high')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    return NextResponse.json({
      stats: {
        pendingComplaints: pendingComplaints || 0,
        todayBookings: todayBookings || 0,
        activeComplaints: activeComplaints || 0,
        unreadAlerts: recentAlerts?.length || 0
      },
      highPriorityComplaints: highPriorityComplaints || [],
      recentAlerts: recentAlerts || []
    });
    
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}