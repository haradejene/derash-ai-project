import { AIResponse } from '../types';

export async function sendMessage(message: string): Promise<AIResponse> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const msg = message.toLowerCase();
  
  if (msg.includes('dinner') || msg.includes('table') || msg.includes('restaurant') || msg.includes("what's for dinner")) {
    return {
      text: "Excellent choices. I have secured a prime window table at **The Sky Lounge** for 8:00 PM. Our finest Sidama coffee service is being prepared and will be delivered to Room 402 within 15 minutes.",
      intent: 'booking',
      entities: { service: 'dinner', time: '20:00' },
      bookingDetails: {
        service: "Sky Lounge • 2 Guests • 20:00",
        guests: 2,
        time: "8:00 PM",
        location: "The Sky Lounge, Rooftop",
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_BPWJa_SDZbtGkQXxyLYfjlktRTUvs8dtjjpRvuiRNJHILpR3zLah8Sum_mZ9A_mGscgLcnR8Y7xgfBvEKLkZgm3tkpwGux_DzNGHZWzGlWtt5P0k0ymnOW0PUJqcIhRSuock3UHWS-Vzk81pKLu824u8u2l0ehPSyvkCeDZu3WmBlMZ2PVX6RmynB3Gi5cP1cSrOqFlxntikbrWFI_Sh-_gegAcMlWs1exQ80WV_Njs9-bpMo8T2E95K6kLlLYG-lDoOOjO1Dbs"
      }
    };
  }
  
  if (msg.includes('spa') || msg.includes('massage')) {
    return {
      text: "I've reserved the traditional Ethiopian massage for you at 7:00 PM in the Spa Garden. Would you like to add the coffee scrub upgrade for an additional 300 ETB?",
      intent: 'booking',
      entities: { service: 'spa', time: '19:00' },
      bookingDetails: {
        service: "Traditional Spa • 1 Guest • 19:00",
        guests: 1,
        time: "7:00 PM",
        location: "Spa Garden, Building B",
        imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=200"
      }
    };
  }
  
  if (msg.includes('complain') || msg.includes('issue') || msg.includes('problem')) {
    return {
      text: "I apologize for the inconvenience, Ms. Selassie. I've notified our guest relations manager immediately. They will be at your suite within 10 minutes with a resolution and a complimentary Ethiopian honey wine.",
      intent: 'complaint',
      entities: { category: 'service', priority: 'high' }
    };
  }
  
  if (msg.includes('amenities')) {
    return {
      text: "Our Royal Suite amenities include: 24/7 butler service, infinity pool access, traditional coffee ceremony upon request, and complimentary spa access. Would you like me to arrange any of these for you?",
      intent: 'recommendation',
      entities: {}
    };
  }
  
  return {
    text: "Good evening, Ms. Selassie. How may I make your stay exceptional tonight? I can assist with dining reservations, spa treatments, or local excursions.",
    intent: 'greeting',
    entities: {}
  };
}