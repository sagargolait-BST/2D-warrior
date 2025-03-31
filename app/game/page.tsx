'use client';

import { useRouter } from 'next/navigation';
import { Game2D } from '@/components/2d-game';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function GamePage() {
  const router = useRouter();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExit = () => {
    router.push('/desktop');
  };

  const handleScriptLoad = () => {
    console.log('Script loaded, checking Game class...');
    // Check if Game class is available
    if (typeof window !== 'undefined' && window.Game) {
      console.log('Game class found');
      setIsScriptLoaded(true);
    } else {
      console.error('Game class not found after script load');
      setError('Game initialization failed');
    }
  };

  const handleScriptError = (e: Error) => {
    console.error('Script failed to load:', e);
    setError('Failed to load game script');
  };

  return (
    <main className="w-full h-full relative bg-black">
      <Script 
        src="/2dGame/script.js"
        onLoad={handleScriptLoad}
        onError={handleScriptError}
      />
      
      {!isScriptLoaded && !error && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-white text-xl">Loading game...</div>
        </div>
      )}
      
      {error && (
        <div className="fixed inset-0 flex items-center justify-center flex-col gap-4">
          <div className="text-red-500 text-xl">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      )}
      
      {isScriptLoaded && <Game2D onClose={handleExit} />}
      <div className="fixed top-4 right-4 text-white text-sm">
        Press ESC to exit
      </div>
    </main>
  );
} 