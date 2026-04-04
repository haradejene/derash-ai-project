const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

console.log('🔵 Backend URL:', BACKEND_URL);

export const api = {
  async sendMessage(message: string, userId?: string) {
    console.log('🔵 Sending message to:', `${BACKEND_URL}/api/chat`);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, userId }),
      });
      
      console.log('🔵 Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Error response:', errorText);
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🟢 Response data:', data);
      return data;
    } catch (error) {
      console.error('🔴 Fetch error:', error);
      throw new Error('Cannot connect to backend. Make sure it\'s running on port 3001');
    }
  },
  
  async getBookings(userId?: string) {
    const url = userId ? `${BACKEND_URL}/api/bookings?userId=${userId}` : `${BACKEND_URL}/api/bookings`;
    const response = await fetch(url);
    return response.json();
  },
  
  async getComplaints() {
    const response = await fetch(`${BACKEND_URL}/api/complaints`);
    return response.json();
  },
  
  async getDashboardStats() {
    const response = await fetch(`${BACKEND_URL}/api/dashboard`);
    return response.json();
  },
  
  async updateComplaintStatus(complaintId: string, status: string, resolutionNotes?: string) {
    const response = await fetch(`${BACKEND_URL}/api/complaints`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ complaintId, status, resolutionNotes }),
    });
    return response.json();
  },
  
  async updateBookingStatus(bookingId: string, status: string) {
    const response = await fetch(`${BACKEND_URL}/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return response.json();
  }
};