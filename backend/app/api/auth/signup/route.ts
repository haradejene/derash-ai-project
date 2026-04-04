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
    const { email, password, full_name, room_number, phone, role } = await req.json();
    
    console.log('📝 Signup attempt:', { email, full_name, role: role || 'guest' });
    
    const supabase = await createClient();
    const adminClient = supabaseAdmin;
    
    // Check if user already exists
    const { data: existingUser } = await adminClient
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already registered' }, { status: 400 });
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name, 
          room_number, 
          phone,
          role: role || 'guest',
        }
      }
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError.message);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    
    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Insert into users table
    const { error: insertError } = await adminClient
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: email,
        full_name: full_name,
        room_number: room_number || null,
        phone: phone || null,
        role: role || 'guest',
        is_active: true
      });
    
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      // Rollback - delete the auth user
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    
    console.log('✅ User inserted with role:', role || 'guest');
    
    const response = NextResponse.json({
      user: authData.user,
      session: authData.session
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