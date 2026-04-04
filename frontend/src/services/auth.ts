import { User, LoginCredentials, SignupData } from '../types/auth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export const authService = {
  async signup(data: SignupData): Promise<User> {
    const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
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
      return user;
    }
    
    throw new Error('No session returned');
  },

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
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
      return user;
    }
    
    throw new Error('Login failed');
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    }
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
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