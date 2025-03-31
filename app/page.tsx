'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isZoomed, setIsZoomed] = useState(false);
  const router = useRouter();

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleInternetClick = () => {
    if (isZoomed) {
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
        
        {/* Computer Screen Overlay */}
        <div className="computer-screen">
          <div className="screen-content">
            <div className="desktop-icons">
              <button 
                className="icon"
                onClick={handleInternetClick}
                disabled={!isZoomed}
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
                onClick={() => isZoomed && router.push('/sms-game')}
                disabled={!isZoomed}
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
        </div>

        {/* On/Off Buttons */}
        <div className="on-off-buttons" onClick={handleZoomToggle}>
          <Image
            src="/on.jpg"
            alt="On Button"
            width={30}
            height={15}
            className={`computer-btn on ${isZoomed ? 'off' : 'on'}`}
          />
          <Image
            src="/off.jpg"
            alt="Off Button"
            width={30}
            height={15}
            className={`computer-btn off ${isZoomed ? 'on' : 'off'}`}
          />
        </div>
      </div>
    </main>
  );
}