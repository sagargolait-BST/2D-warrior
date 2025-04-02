'use client';

import { useEffect, useState } from 'react';

export default function SMSGamePage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-4xl h-[80vh] rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
        <iframe
          src="http://sms-game.vercel.app/"
          className="w-full h-full"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen"
          title="SMS Game"
        />
      </div>
    </div>
  );
} 