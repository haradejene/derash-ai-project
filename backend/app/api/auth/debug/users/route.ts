import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('email, role, auth_id');
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ users });
}