const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'https://derash-ai-project.onrender.com';

export interface AIResponse {
  text: string;
  intent: 'booking' | 'complaint' | 'recommendation' | 'question' | 'greeting' | 'error';  // Add 'error' here
  entities: {
    service?: string;
    time?: string;
    category?: string;
    priority?: string;
  };
  bookingDetails?: {
    service: string;
    guests: number;
    time: string;
    location?: string;
  };
}

export const aiClient = {
  async processMessage(message: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${AI_SERVICE_URL}/ai/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error(`AI service error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('AI service call failed:', error);
      return {
        text: "I apologize, but I'm having trouble connecting. Please try again or contact the front desk.",
        intent: 'error',  // Now this is valid
        entities: {}
      };
    }
  },
  
  async classifyComplaint(message: string) {
    const response = await fetch(`${AI_SERVICE_URL}/ai/complaint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return response.json();
  },
  
  async getRecommendations(params: { time_of_day?: string; mood?: string }) {
    const response = await fetch(`${AI_SERVICE_URL}/ai/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  },
  
  async getUpsell(serviceId: string) {
    const response = await fetch(`${AI_SERVICE_URL}/ai/upsell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: serviceId }),
    });
    return response.json();
  }
};