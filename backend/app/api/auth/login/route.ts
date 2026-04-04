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
    
    // Try multiple ways to get user role
    let userRole = 'guest';
    let userName = data.user.user_metadata?.full_name;
    
    // Method 1: Query by auth_id
    const { data: userByAuthId, error: error1 } = await adminClient
      .from('users')
      .select('role, full_name, email')
      .eq('auth_id', data.user.id)
      .single();
    
    if (userByAuthId) {
      userRole = userByAuthId.role || 'guest';
      userName = userByAuthId.full_name || userName;
      console.log('👤 Role found by auth_id:', userRole);
    } else {
      console.log('⚠️ No user found by auth_id, trying by email...');
      
      // Method 2: Query by email
      const { data: userByEmail, error: error2 } = await adminClient
        .from('users')
        .select('role, full_name, email')
        .eq('email', email)
        .single();
      
      if (userByEmail) {
        userRole = userByEmail.role || 'guest';
        userName = userByEmail.full_name || userName;
        console.log('👤 Role found by email:', userRole);
      } else {
        console.log('⚠️ No user found by email, checking auth users metadata...');
        
        // Method 3: Check auth users metadata
        const metadataRole = data.user.user_metadata?.role;
        if (metadataRole === 'staff') {
          userRole = 'staff';
          console.log('👤 Role found in auth metadata:', userRole);
          
          // Create user record if missing
          const { error: insertError } = await adminClient
            .from('users')
            .insert({
              auth_id: data.user.id,
              email: email,
              full_name: userName,
              role: 'staff',
              is_active: true
            });
          
          if (insertError) {
            console.error('❌ Error creating user record:', insertError);
          } else {
            console.log('✅ User record created with role: staff');
          }
        } else {
          console.log('⚠️ No role found, creating guest record...');
          
          // Create guest user record
          const { error: insertError } = await adminClient
            .from('users')
            .insert({
              auth_id: data.user.id,
              email: email,
              full_name: userName,
              role: 'guest',
              is_active: true
            });
          
          if (insertError) {
            console.error('❌ Error creating user record:', insertError);
          }
        }
      }
    }
    
    // Final verification - direct query to see what's actually in the database
    const { data: directCheck } = await adminClient
      .from('users')
      .select('role, email')
      .eq('email', email)
      .single();
    
    console.log('🔍 DIRECT DATABASE CHECK - Email:', email, 'Role:', directCheck?.role);
    
    // Use the direct check result if available
    if (directCheck && directCheck.role === 'staff') {
      userRole = 'staff';
      console.log('✅ Using role from direct database check: staff');
    }
    
    console.log('📤 FINAL user role being sent:', userRole);
    
    // Update user metadata with correct role
    await adminClient.auth.admin.updateUserById(data.user.id, {
      user_metadata: { ...data.user.user_metadata, role: userRole, full_name: userName }
    });
    
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
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
    
  } catch (error) {
    console.error('❌ Server error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}