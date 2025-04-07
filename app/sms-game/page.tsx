'use client';

import { useEffect, useState } from 'react';

export default function SMSGamePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden shadow-lg">
        {isLoading && !error && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        {error && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-red-500 text-center">
              <p className="text-xl font-semibold mb-2">Failed to load game</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
        <iframe
          src="https://whatsapp-gaming.onrender.com/"
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError('Failed to load the game. Please try again later.');
          }}
          allow="fullscreen"
          title="SMS Game"
        />
      </div>
    </div>
  );
} 