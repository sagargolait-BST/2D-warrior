'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { smsConfig } from '@/lib/sms-config';

export default function SMSGamePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState<'running' | 'stopped' | 'error'>('stopped');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Start the SMS gaming server when the component mounts
  useEffect(() => {
    const startServer = async () => {
      try {
        // Make a request to start the SMS gaming server
        const response = await fetch(smsConfig.apiEndpoints.start, {
          method: 'POST',
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to start SMS gaming server');
          setServerStatus('error');
        } else {
          setServerStatus('running');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error starting SMS gaming server:', error);
        setErrorMessage('Could not connect to server. This may be because you are using a static export.');
        setServerStatus('error');
        setIsLoading(false);
      }
    };
    
    startServer();
  }, []);
  
  const handleBackClick = () => {
    router.push('/desktop');
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-xl bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">SMS Warriors</h1>
          <button 
            onClick={handleBackClick}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            Back to Desktop
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p>Starting SMS gaming server...</p>
          </div>
        ) : serverStatus === 'error' ? (
          <div className="flex flex-col items-center text-center p-4 bg-red-900 rounded mb-6">
            <p className="mb-2">{errorMessage || 'An error occurred while starting the server'}</p>
            <p>You can still scan the QR code below to join the WhatsApp game!</p>
          </div>
        ) : null}
        
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded mb-6">
            <Image 
              src={smsConfig.whatsapp.qrCodeUrl}
              alt="Scan to join WhatsApp game"
              width={250}
              height={250}
              className="mx-auto"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">How to Play:</h2>
            <ol className="text-left list-decimal pl-6 space-y-2">
              <li>Scan the QR code with your phone camera</li>
              <li>It will open WhatsApp with a pre-filled message</li>
              <li>Send the message to join the gaming platform</li>
              <li>Follow the instructions sent to you on WhatsApp</li>
              <li>Use commands like <code>/h</code> for help at any time</li>
            </ol>
            
            <div className="mt-6 p-4 bg-gray-700 rounded text-sm">
              <p>Alternatively, send "{smsConfig.whatsapp.joinCode}" to: <strong>{smsConfig.twilioPhone}</strong> on WhatsApp</p>
            </div>
            
            {serverStatus === 'error' && (
              <div className="mt-4 p-4 bg-yellow-900 rounded text-sm">
                <p className="font-bold">Note for Developers:</p>
                <p>The SMS gaming server requires server-side functionality. If you're using a static export, you'll need to:</p>
                <ol className="text-left list-decimal pl-6 mt-2 space-y-1">
                  <li>Deploy the app to a platform with serverless functions (Vercel, Netlify)</li>
                  <li>Configure the SMS-gaming service separately</li>
                  <li>Update the Twilio webhook URL in your Twilio console</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 