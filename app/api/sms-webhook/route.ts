import { NextRequest, NextResponse } from 'next/server';
import { smsConfig } from '@/lib/sms-config';

export async function POST(req: NextRequest) {
  try {
    // For server-side rendering, redirect to the main handler
    const redirectUrl = new URL(smsConfig.apiEndpoints.proxy, req.url);
    
    try {
      // Try to proxy the request to the main handler
      return NextResponse.redirect(redirectUrl);
    } catch (error) {
      console.error('Failed to redirect to main handler:', error);
      
      // Fall back to static export webhook guide
      const webhookGuide = {
        message: "This is a static export - Twilio Webhook Configuration Guide",
        steps: [
          "1. In your Twilio console, set up your webhook URL to point to the deployed version of this app",
          `2. The webhook URL should be: https://your-deployed-site.com${smsConfig.apiEndpoints.webhook}`,
          "3. Make sure to use HTTP POST as the method",
          "4. Deploy your app to a serverless platform like Vercel, Netlify, or AWS"
        ],
        note: "The SMS gaming server runs locally and must be started manually for development"
      };
      
      return NextResponse.json(webhookGuide);
    }
  } catch (error) {
    console.error('Error in SMS webhook route:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing webhook', error: String(error) },
      { status: 500 }
    );
  }
} 