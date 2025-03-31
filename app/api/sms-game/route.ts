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

  // Ensure the .env file has the correct WEBHOOK_URL and PORT
  try {
    await updateEnvFile();
  } catch (error) {
    console.error('Error updating .env file:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update .env configuration', error: String(error) },
      { status: 500 }
    );
  }

  // Start the SMS gaming server
  const smsGamingPath = path.join(process.cwd(), 'sms-gaming');
  
  try {
    // Start the server process
    serverProcess = exec('npm start', { cwd: smsGamingPath });
    
    let errorOutput = '';
    let startupOutput = '';
    
    // Log stdout and stderr
    serverProcess.stdout.on('data', (data: any) => {
      console.log(`SMS Gaming Server stdout: ${data}`);
      startupOutput += data.toString();
      
      // If we see the server started message, we're good
      if (data.toString().includes('Server started on port')) {
        console.log('SMS Gaming Server started successfully!');
        serverStartAttempts = 0; // Reset attempts on successful start
      }
    });
    
    serverProcess.stderr.on('data', (data: any) => {
      console.error(`SMS Gaming Server stderr: ${data}`);
      errorOutput += data.toString();
      
      // Check for specific errors
      if (data.toString().includes('EADDRINUSE')) {
        console.error('Port already in use, trying again with a different port');
        smsConfig.server.port = 4501; // Try a different port
        serverProcess.kill(); // Kill the current process
      }
    });
    
    serverProcess.on('close', (code: any) => {
      console.log(`SMS Gaming Server process exited with code ${code}`);
      serverProcess = null;
      
      // If the server crashed with an error code, try to restart
      if (code !== 0 && serverStartAttempts < MAX_START_ATTEMPTS) {
        console.log('Server crashed, attempting to restart...');
        setTimeout(() => {
          handleStartServer();
        }, 1000);
      }
    });
    
    // Wait a bit for the server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Check if we have error output that indicates a problem
    if (errorOutput.includes('EADDRINUSE') || errorOutput.includes('Error:')) {
      if (serverProcess) {
        serverProcess.kill();
        serverProcess = null;
      }
      
      return NextResponse.json(
        { success: false, message: 'Server failed to start due to errors', error: errorOutput },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Server started successfully' });
  } catch (error) {
    console.error('Failed to start SMS gaming server:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to start server', error: String(error) },
      { status: 500 }
    );
  }
}

async function updateEnvFile() {
  const envFilePath = path.join(process.cwd(), 'sms-gaming', '.env');
  
  try {
    // Read the current .env file
    let envContent = await fs.promises.readFile(envFilePath, 'utf8');
    
    // Update or add the PORT line
    if (envContent.includes('PORT=')) {
      envContent = envContent.replace(/PORT=\d+/g, `PORT=${smsConfig.server.port}`);
    } else {
      envContent += `\nPORT=${smsConfig.server.port}`;
    }
    
    // Update or add the WEBHOOK_URL line
    const webhookUrl = smsConfig.webhook.url;
    if (envContent.includes('WEBHOOK_URL=')) {
      envContent = envContent.replace(/WEBHOOK_URL=.*/g, `WEBHOOK_URL=${webhookUrl}`);
    } else {
      envContent += `\nWEBHOOK_URL=${webhookUrl}`;
    }
    
    // Write the updated .env file
    await fs.promises.writeFile(envFilePath, envContent, 'utf8');
    console.log('Updated .env file successfully');
    
  } catch (error) {
    console.error('Error updating .env file:', error);
    throw error;
  }
}

// Create a specific route for checking server status
export async function GET(req: NextRequest) {
  try {
    // Check server status
    const isRunning = !!serverProcess;
    
    return NextResponse.json({ 
      success: true, 
      status: isRunning ? 'running' : 'stopped' 
    });
  } catch (error) {
    console.error('Error checking server status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check server status', error: String(error) },
      { status: 500 }
    );
  }
} 