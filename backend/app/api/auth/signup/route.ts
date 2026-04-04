import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
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
      console.log('⚠️ User already exists:', email);
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }
    
    // Create user in Supabase Auth with auto-confirm
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name, 
          room_number, 
          phone,
          role: role || 'guest',
        },
        // Fix: Use a valid URL or remove this line since we auto-confirm below
        emailRedirectTo: process.env.NODE_ENV === 'production' 
          ? 'https://derash-ai-project-2.onrender.com/login' 
          : 'http://localhost:3000/login'
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
    
    // Auto-confirm the user using admin API (bypasses email confirmation)
    const { error: confirmError } = await adminClient.auth.admin.updateUserById(
      authData.user.id,
      { email_confirm: true }
    );
    
    if (confirmError) {
      console.error('❌ Error confirming user:', confirmError);
    } else {
      console.log('✅ User auto-confirmed');
    }
    
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
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
    
    console.log('✅ User inserted with role:', role || 'guest');
    
    // Create a session for the user (auto-login)
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    const response = NextResponse.json({
      user: authData.user,
      session: sessionData?.session || authData.session
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
    
  } catch (error) {
    console.error('❌ Server error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}