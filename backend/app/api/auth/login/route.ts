import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
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
    const { email, password } = await req.json();
    
    console.log('📝 Login attempt for:', email);
    
    const supabase = await createClient();
    const adminClient = supabaseAdmin;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('❌ Login error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    if (!data.user) {
      console.error('❌ No user returned');
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }
    
    console.log('✅ Auth success:', data.user.id);
    
    // Try to get user role from database using admin client (bypasses RLS)
    const { data: userData, error: userError } = await adminClient
      .from('users')
      .select('role, full_name, room_number')
      .eq('auth_id', data.user.id)
      .maybeSingle();
    
    if (userError) {
      console.error('❌ Error fetching user role:', userError);
    }
    
    // Also try by email as fallback
    let userRole = 'guest';
    let userName = data.user.user_metadata?.full_name;
    
    if (userData) {
      userRole = userData.role || 'guest';
      userName = userData.full_name || userName;
      console.log('👤 User role from database (by auth_id):', userRole);
    } else {
      // Fallback: try to get by email
      const { data: userByEmail } = await adminClient
        .from('users')
        .select('role, full_name')
        .eq('email', email)
        .maybeSingle();
      
      if (userByEmail) {
        userRole = userByEmail.role || 'guest';
        userName = userByEmail.full_name || userName;
        console.log('👤 User role from database (by email):', userRole);
      } else {
        console.log('⚠️ No user found in database, using guest role');
      }
    }
    
    console.log('📤 Sending user response with role:', userRole);
    
    // Return user with role
    const userResponse = {
      id: data.user.id,
      email: data.user.email,
      role: userRole,
      user_metadata: {
        ...data.user.user_metadata,
        role: userRole,
        full_name: userName
      }
    };
    
    const response = NextResponse.json({
      user: userResponse,
      session: data.session
    });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
    
  } catch (error) {
    console.error('❌ Server error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    return response;
  }
}