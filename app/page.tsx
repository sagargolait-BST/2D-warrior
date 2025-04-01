'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSound from 'use-sound';

export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPoweredOn, setIsPoweredOn] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  // Use the useSound hook for sound playback
  const [playTvSound] = useSound('/television.mp3', {
    volume: 1.0,
    interrupt: true
  });

  const handleZoomToggle = () => {
    // Play TV on/off sound using useSound
    playTvSound();
    
    // First reset animation by removing class, then add it back
    setIsAnimating(false);
    
    // Force a DOM reflow to restart animation
    setTimeout(() => {
      setIsAnimating(true);
    }, 5);
    
    // Toggle power state after animation delay - using shorter durations
    const animationDelay = isPoweredOn ? 400 : 600; // Reduced delays for on/off
    
    setTimeout(() => {
      setIsPoweredOn(!isPoweredOn);
      // Keep animation for a bit shorter time
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, animationDelay);
    
    // Only allow zooming if powering on, with shorter delay
    if (!isPoweredOn) {
      setTimeout(() => {
        setIsZoomed(true);
      }, animationDelay + 100);
    } else {
      setIsZoomed(false);
    }
  };

  const handleInternetClick = () => {
    if (isZoomed && isPoweredOn) {
      router.push('/game');
    }
  };

  return (
    <main className="w-full h-full">
      <div className={`main-app-wrapper ${isZoomed ? 'zoomed-in' : 'zoomed-out'}`}>
        {/* Background Image */}
        <Image
          src="/scene2.jpg"
          alt="Retro computer setup"
          fill
          sizes="100vw"
          priority
          quality={100}
          style={{
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />

        {/* Computer Screen Overlay - only visible when powered on */}
        <div className={`computer-screen ${isPoweredOn ? 'powered-on' : 'powered-off'} ${isAnimating ? 'animating' : ''}`}>
          {isPoweredOn && (
            <div className="screen-content">
              <div className="desktop-icons">
                <button
                  className="icon"
                  onClick={handleInternetClick}
                  disabled={!isZoomed || !isPoweredOn}
                >
                  <Image
                    src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/internet-icon-c90611.png"
                    alt="internet"
                    width={32}
                    height={32}
                  />
                  <span>2D Bull Game</span>
                </button>
                <button
                  className="icon"
                  onClick={() => (isZoomed && isPoweredOn) && router.push('/sms-game')}
                  disabled={!isZoomed || !isPoweredOn}
                >
                  <Image
                    src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/doc-a008ef.png"
                    alt="documents"
                    width={32}
                    height={32}
                  />
                  <span>SMS Warriors</span>
                </button>
                <button className="icon">
                  <Image
                    src="https://de34i7k6qwgwc.cloudfront.net/uploads/img/mail-8fbe8b.png"
                    alt="emails"
                    width={32}
                    height={32}
                  />
                  <span>Home</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* On/Off Buttons */}
        <div className="on-off-buttons" onClick={handleZoomToggle}>
          <Image
            src="/on.jpg"
            alt="On Button"
            width={30}
            height={15}
            className={`computer-btn on ${isPoweredOn ? 'off' : 'on'}`}
          />
          <Image
            src="/off.jpg"
            alt="Off Button"
            width={30}
            height={15}
            className={`computer-btn off ${isPoweredOn ? 'on' : 'off'}`}
          />
        </div>
      </div>
    </main>
  );
}