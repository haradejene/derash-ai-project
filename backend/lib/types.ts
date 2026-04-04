export interface User {
  id: string;
  email: string;
  full_name: string;
  room_number: string;
  preferences: any;
}

export interface Booking {
  id: string;
  user_id: string;
  service: string;
  booking_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at: string;
}

export interface Complaint {
  id: string;
  user_id: string;
  message: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
}

export interface DashboardAlert {
  id: string;
  type: string;
  priority: string;
  message: string;
  is_acknowledged: boolean;
  created_at: string;
}

// Add Message type
export interface Message {
  id: string;
  user_id: string;
  session_id: string;
  message: string;
  response: string;
  intent: string;
  entities: any;
  created_at: string;
}