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
    const body = await req.json();
    const { email, password, full_name, role, department } = body;
    
    console.log('📝 Staff registration attempt:', { email, full_name });
    
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
      // Try to login instead
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (!loginError && loginData.user) {
        // Update role to staff if needed
        await adminClient
          .from('users')
          .update({ role: 'staff' })
          .eq('email', email);
        
        return NextResponse.json({
          user: loginData.user,
          session: loginData.session
        });
      }
      
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name, 
          role: 'staff',
        }
      }
    });
    
    if (authError) {
      console.error('❌ Auth error:', authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }
    
    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
    
    console.log('✅ Auth user created:', authData.user.id);
    
    // Insert into users table with staff role
    const { error: userError } = await adminClient
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: email,
        full_name: full_name,
        role: 'staff',
        is_active: true
      });
    
    if (userError) {
      console.error('❌ User insert error:', userError);
      // Don't fail, continue anyway
    } else {
      console.log('✅ User inserted with role: staff');
    }
    
    // Update the user role directly in auth.users metadata
    await adminClient.auth.admin.updateUserById(authData.user.id, {
      user_metadata: { full_name, role: 'staff' }
    });
    
    // Get role_id from staff_roles
    const { data: roleData } = await adminClient
      .from('staff_roles')
      .select('id')
      .eq('role_name', role || 'front_desk')
      .single();
    
    // Create staff record (use upsert to avoid duplicates)
    const { error: staffError } = await adminClient
      .from('staff')
      .upsert({
        user_id: authData.user.id,
        role_id: roleData?.id,
        department: department || 'General',
      }, { onConflict: 'user_id' });
    
    if (staffError) {
      console.error('❌ Staff record error:', staffError);
    } else {
      console.log('✅ Staff record created');
    }
    
    const response = NextResponse.json({
      user: authData.user,
      session: authData.session
    });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
    
  } catch (error) {
    console.error('❌ Staff registration error:', error);
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}