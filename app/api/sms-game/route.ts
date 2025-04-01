import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { smsConfig } from '@/lib/sms-config';
import fs from 'fs';

const execAsync = promisify(exec);
let serverProcess: any = null;
let serverStartAttempts = 0;
const MAX_START_ATTEMPTS = 2;

// Environment variables that should be available to the SMS server
const SMS_SERVER_ENV = {
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  SESSION_SECRET: process.env.SESSION_SECRET,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '4500'
};

export async function POST(req: NextRequest) {
  try {
    // Parse the URL to get query parameters
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    // If this is a webhook request (no action specified), proxy it directly
    if (!action) {
      return handleWebhook(req);
    }
    
    // Handle explicit actions
    if (action === 'start') {
      return handleStartServer();
    }
    
    // Default fallback - proxy to SMS server
    return handleWebhook(req);
  } catch (error) {
    console.error('Unexpected error in SMS gaming API route:', error);
    return NextResponse.json(
      { success: false, message: 'Unexpected error', error: String(error) },
      { status: 500 }
    );
  }
}

// Handle Twilio webhook requests by proxying to SMS gaming server
async function handleWebhook(req: NextRequest) {
  const body = await req.text();
  
  try {
    // Make sure server is running
    if (!serverProcess) {
      const startResponse = await handleStartServer();
      if (!startResponse.ok) {
        // If we couldn't start the server, return the error
        return startResponse;
      }
    }
    
    const serverUrl = `http://${smsConfig.server.host}:${smsConfig.server.port}`;
    const response = await fetch(serverUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    
    const responseText = await response.text();
    return new NextResponse(responseText, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error proxying request to SMS gaming server:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to proxy request', error: String(error) },
      { status: 500 }
    );
  }
}

// Start the SMS gaming server
async function handleStartServer() {
  // If server already running, return success
  if (serverProcess) {
    return NextResponse.json({ success: true, message: 'Server already running' });
  }

  // If we've tried too many times, give up
  if (serverStartAttempts >= MAX_START_ATTEMPTS) {
    return NextResponse.json(
      { success: false, message: 'Failed to start server after multiple attempts' },
      { status: 500 }
    );
  }

  serverStartAttempts++;

  try {
    // Start the server with environment variables
    const serverPath = path.join(process.cwd(), 'sms-gaming', 'lib', 'app.js');
    const env = { ...process.env, ...SMS_SERVER_ENV };
    
    serverProcess = exec(`node ${serverPath}`, { env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Server error: ${error}`);
        serverProcess = null;
      }
      if (stdout) console.log(`Server stdout: ${stdout}`);
      if (stderr) console.error(`Server stderr: ${stderr}`);
    });

    // Wait a bit to see if the server starts successfully
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return NextResponse.json({ success: true, message: 'Server started successfully' });
  } catch (error) {
    console.error('Error starting server:', error);
    serverProcess = null;
    return NextResponse.json(
      { success: false, message: 'Failed to start server', error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ status: 'ok', serverRunning: !!serverProcess });
} 