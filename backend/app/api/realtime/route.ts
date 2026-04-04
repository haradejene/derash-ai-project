import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`));
      
      // Keep connection alive with periodic pings
      const pingInterval = setInterval(() => {
        controller.enqueue(encoder.encode(`: ping\n\n`));
      }, 30000);
      
      // Clean up on close
      req.signal.addEventListener('abort', () => {
        clearInterval(pingInterval);
        controller.close();
      });
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}