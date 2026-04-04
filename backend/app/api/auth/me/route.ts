import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      const response = NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
      response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
      return response;
    }
    
    const response = NextResponse.json({ user });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
    
  } catch (error) {
    const response = NextResponse.json({ error: 'Auth failed' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }
}