import { User, LoginCredentials, SignupData } from '../types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const authService = {
  async signup(data: SignupData): Promise<User> {
    console.log('🔵 Signup request for:', data.email);
    
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    console.log('🔵 Signup response status:', response.status);
    
    if (!response.ok) {
      console.error('🔴 Signup failed:', result);
      throw new Error(result.error || 'Signup failed');
    }
    
    if (result.session) {
      localStorage.setItem('auth_token', result.session.access_token);
      
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        full_name: data.full_name,
        role: data.role === 'staff' ? 'staff' : 'guest',
        room_number: data.room_number,
        phone: data.phone,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      console.log('🟢 Signup successful for:', user.email, 'Role:', user.role);
      return user;
    }
    
    throw new Error('No session returned');
  },

  async login(credentials: LoginCredentials): Promise<User> {
    console.log('🔵 Login attempt for:', credentials.email);
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    console.log('🔵 Login response status:', response.status);
    console.log('🔵 Login response role:', result.user?.role);
    
    if (!response.ok) {
      console.error('🔴 Login failed:', result);
      throw new Error(result.error || 'Login failed');
    }
    
    if (result.session) {
      localStorage.setItem('auth_token', result.session.access_token);
      
      let userRole: 'guest' | 'staff' | 'admin' = 'guest';
      if (result.user.role === 'staff') {
        userRole = 'staff';
      } else if (result.user.role === 'admin') {
        userRole = 'admin';
      }
      
      const user: User = {
        id: result.user.id,
        email: result.user.email,
        full_name: result.user.user_metadata?.full_name || credentials.email.split('@')[0],
        role: userRole,
        room_number: result.user.user_metadata?.room_number,
        phone: result.user.user_metadata?.phone,
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      console.log('🟢 Login successful for:', user.email, 'Role:', user.role);
      return user;
    }
    
    throw new Error('Login failed');
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    console.log('🔵 Logging out...');
    
    if (token) {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    console.log('🟢 Logout successful');
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};