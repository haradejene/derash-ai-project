import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      const response = NextResponse.json({ error: error.message }, { status: 500 });
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      return response;
    }
    
    const response = NextResponse.json({ success: true });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
    
  } catch (error) {
    const response = NextResponse.json({ error: 'Logout failed' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }
}