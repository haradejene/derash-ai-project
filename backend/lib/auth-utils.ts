import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from './supabase';
import { User, Session, AuthResponse } from './auth-types';

const SALT_ROUNDS = 10;
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<Session> {
  const token = uuidv4();
  const expires_at = new Date(Date.now() + SESSION_DURATION).toISOString();
  
  const { data, error } = await supabaseAdmin
    .from('sessions')
    .insert({
      user_id: userId,
      token,
      expires_at
    })
    .select()
    .single();
  
  if (error) throw new Error('Failed to create session');
  return data;
}

export async function validateSession(token: string): Promise<User | null> {
  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select('*, users(*)')
    .eq('token', token)
    .single();
  
  if (error || !session) return null;
  
  if (new Date(session.expires_at) < new Date()) {
    // Session expired
    await supabaseAdmin.from('sessions').delete().eq('token', token);
    return null;
  }
  
  // Update last activity
  await supabaseAdmin
    .from('sessions')
    .update({ last_activity: new Date().toISOString() })
    .eq('token', token);
  
  return session.users as User;
}

export async function logoutSession(token: string): Promise<void> {
  await supabaseAdmin.from('sessions').delete().eq('token', token);
}

export async function getUserPermissions(userId: string): Promise<string[]> {
  // First get user role
  const { data: user, error: userError } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (userError || !user) return [];
  
  // Guest permissions
  if (user.role === 'guest') {
    return ['view_services', 'create_bookings', 'view_own_bookings'];
  }
  
  // Get staff permissions
  const { data: staff, error: staffError } = await supabaseAdmin
    .from('staff')
    .select(`
      permissions,
      staff_roles (
        permissions
      )
    `)
    .eq('user_id', userId)
    .single();
  
  if (staffError || !staff) return [];
  
  let permissions: string[] = [];
  
  // Add staff's individual permissions
  if (staff.permissions && Array.isArray(staff.permissions)) {
    permissions = [...permissions, ...staff.permissions];
  }
  
  // Add role-based permissions
  if (staff.staff_roles && (staff.staff_roles as any).permissions) {
    const rolePermissions = (staff.staff_roles as any).permissions;
    if (Array.isArray(rolePermissions)) {
      permissions = [...permissions, ...rolePermissions];
    }
  }
  
  // Remove duplicates
  return [...new Set(permissions)];
}

// Helper function to check if user has specific permission
export async function hasPermission(userId: string, requiredPermission: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(requiredPermission);
}

// Helper function to check if user is staff
export async function isStaff(userId: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  return user?.role === 'staff' || user?.role === 'admin';
}

// Helper function to check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  return user?.role === 'admin';
}