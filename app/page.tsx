"use client"

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import { ConsoleModel } from '@/components/console-model'
import { GameCard } from '@/components/game-card'
import { Button } from '@/components/ui/button'
import { TowerControl as GameController, MonitorPlay, Upload } from 'lucide-react'
import Script from 'next/script'

const games = [
  {
    title: "Cyberpunk 2078",
    image: "https://images.unsplash.com/photo-1605899435973-ca2d1a8c7e2d",
    description: "Experience the future of gaming",
  },
  {
    title: "Galaxy Explorer",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679",
    description: "Explore vast cosmic worlds",
  },
  {
    title: "Racing Evolution",
    image: "https://images.unsplash.com/photo-1511882150382-421056c89033",
    description: "Push your limits on the track",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Script 
        src="/2dGame/script.js" 
        strategy="beforeInteractive"
        onError={(e) => console.error('Error loading game script:', e)}
        onLoad={() => console.log('Game script loaded successfully')}
      />
      <div className="hero-background" />
      <div className="hero-overlay" />
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <ConsoleModel />
            <Environment preset="city" />
            <OrbitControls enableZoom={false} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-20">
        <section className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-6">
              Gaming Evolved
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience gaming like never before with our revolutionary console
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" className="gap-2">
                <GameController className="w-5 h-5" />
                Pre-order Now
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <MonitorPlay className="w-5 h-5" />
                Watch Demo
              </Button>
              <Button size="lg" variant="ghost" className="gap-2">
                <Upload className="w-5 h-5" />
                Upload 3D Model
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
            Featured Games
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {games.map((game) => (
              <GameCard key={game.title} {...game} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}