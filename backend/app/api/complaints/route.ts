import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  
  let query = supabaseAdmin
    .from('complaints')
    .select('*, users(name, room_number)')
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  if (priority) {
    query = query.eq('priority', priority);
  }
  
  const { data, error } = await query;
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ complaints: data });
}

export async function PATCH(req: NextRequest) {
  try {
    const { complaintId, status, resolutionNotes } = await req.json();
    
    const updateData: any = { status };
    if (resolutionNotes) {
      updateData.resolution_notes = resolutionNotes;
      updateData.resolved_at = new Date().toISOString();
    }
    
    const { data, error } = await supabaseAdmin
      .from('complaints')
      .update(updateData)
      .eq('id', complaintId)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ complaint: data });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}