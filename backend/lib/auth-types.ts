export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'guest' | 'staff' | 'admin';
  room_number?: string;
  phone?: string;
  is_active: boolean;
  last_login?: string;
}

export interface StaffMember extends User {
  role_id: string;
  permissions: string[];
  department: string;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  room_number?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}