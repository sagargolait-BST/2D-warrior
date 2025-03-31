"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface Game2DProps {
  onClose: () => void
}

// Add type declaration for the Game class
declare global {
  interface Window {
    Game: any; // We'll use any for now since we don't have the full type definition
  }
}

export function Game2D({ onClose }: Game2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const gameRef = useRef<any>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx
    ctx.fillStyle = "white"
    ctx.lineWidth = 3
    ctx.font = "40px Bangers"
    ctx.textAlign = "center"

    // Load game assets
    const loadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (error) => {
          console.error(`Failed to load image: ${src}`, error)
          reject(new Error(`Failed to load image: ${src}`))
        }
        img.src = src
      })
    }

    // Game initialization
    const initGame = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Load all game assets
        const assets = {
          bull: await loadImage('/2dGame/bull.png'),
          obstacles: await loadImage('/2dGame/obstacles.png'),
          egg: await loadImage('/2dGame/egg.png'),
          larva: await loadImage('/2dGame/larva.png'),
          toad: await loadImage('/2dGame/toad.png'),
          toads: await loadImage('/2dGame/toads.png'),
          background: await loadImage('/2dGame/background.png'),
          overlay: await loadImage('/2dGame/overlay.png'),
        }

        // Verify all assets are loaded
        const missingAssets = Object.entries(assets)
          .filter(([_, value]) => !value)
          .map(([key]) => key)

        if (missingAssets.length > 0) {
          throw new Error(`Missing assets: ${missingAssets.join(', ')}`)
        }

        // Create game instance
        if (!window.Game) {
          throw new Error('Game class not found. Make sure the script is loaded.')
        }

        const game = new window.Game(canvas, assets)
        gameRef.current = game

        // Start game loop
        const animate = (timestamp: number) => {
          if (!isPlaying || !ctxRef.current) return
          game.render(ctxRef.current, timestamp)
          requestAnimationFrame(animate)
        }

        animate(0)

        // Handle keyboard input
        const handleKeyDown = (e: KeyboardEvent) => {
          if (!isPlaying) return
          game.keys[e.key.toLowerCase()] = true
        }

        const handleKeyUp = (e: KeyboardEvent) => {
          if (!isPlaying) return
          game.keys[e.key.toLowerCase()] = false
        }

        // Handle mouse input
        const handleMouseMove = (e: MouseEvent) => {
          if (!isPlaying) return
          const rect = canvas.getBoundingClientRect()
          game.mouse.x = e.clientX - rect.left
          game.mouse.y = e.clientY - rect.top
        }

        const handleMouseDown = () => {
          if (!isPlaying) return
          game.mouse.pressed = true
        }

        const handleMouseUp = () => {
          if (!isPlaying) return
          game.mouse.pressed = false
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mouseup', handleMouseUp)

        return () => {
          window.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('keyup', handleKeyUp)
          canvas.removeEventListener('mousemove', handleMouseMove)
          canvas.removeEventListener('mousedown', handleMouseDown)
          canvas.removeEventListener('mouseup', handleMouseUp)
        }
      } catch (error) {
        console.error('Failed to initialize game:', error)
        setError(error instanceof Error ? error.message : 'Failed to initialize game')
      } finally {
        setIsLoading(false)
      }
    }

    initGame()
  }, [isPlaying])

  const handleStart = () => {
    setIsPlaying(true)
    if (gameRef.current) {
      gameRef.current.restart()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-12 right-0"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gradient mb-2">2D Adventure Game</h2>
          <p className="text-gray-400">Use WASD or mouse to move</p>
        </div>
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="bg-black border border-gray-800 rounded-lg"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            {isLoading ? (
              <div className="text-white">Loading game assets...</div>
            ) : error ? (
              <div className="text-red-500 text-center">
                <p>Error: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : (
              <Button onClick={handleStart}>Start Game</Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 