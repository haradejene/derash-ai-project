
export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: string;
  senderName?: string;  // Add this
  isSystem?: boolean;    // Add this
  bookingDetails?: BookingDetails;
}

export interface BookingDetails {
  service: string;
  guests: number;
  time: string;
  location?: string;
  imageUrl?: string;
}

export interface AIResponse {
  text: string;
  intent: 'booking' | 'complaint' | 'recommendation' | 'question' | 'greeting';
  entities: {
    service?: string;
    time?: string;
    category?: string;
    priority?: string;
  };
  bookingDetails?: BookingDetails;
  suggestions?: string[];
}