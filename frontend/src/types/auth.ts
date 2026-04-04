export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'guest' | 'staff' | 'admin';
  room_number?: string;
  phone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  room_number?: string;
  phone?: string;
  role?: string;
  staff_role?: string;
  department?: string;
}

export interface AuthResponse {
  user: User;
  session: any;
}