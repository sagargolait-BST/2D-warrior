"use client"

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface GameInterfaceProps {
  title: string
  onClose: () => void
}

export function GameInterface({ title, onClose }: GameInterfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Game state
    let playerX = canvas.width / 2
    let playerY = canvas.height - 50
    let playerSpeed = 5
    let obstacles: { x: number; y: number; width: number; height: number }[] = []
    let gameLoop: number

    // Game controls
    const keys: { [key: string]: boolean } = {}
    window.addEventListener('keydown', (e) => (keys[e.key] = true))
    window.addEventListener('keyup', (e) => (keys[e.key] = false))

    // Game loop
    const update = () => {
      if (!isPlaying) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw player
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(playerX - 20, playerY - 20, 40, 40)

      // Move player
      if (keys['ArrowLeft']) playerX -= playerSpeed
      if (keys['ArrowRight']) playerX += playerSpeed

      // Keep player in bounds
      playerX = Math.max(20, Math.min(canvas.width - 20, playerX))

      // Generate obstacles
      if (Math.random() < 0.02) {
        obstacles.push({
          x: Math.random() * (canvas.width - 30),
          y: -30,
          width: 30,
          height: 30,
        })
      }

      // Update and draw obstacles
      obstacles = obstacles.filter((obstacle) => {
        obstacle.y += 2
        ctx.fillStyle = '#ff0000'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        return obstacle.y < canvas.height
      })

      // Check collisions
      obstacles.forEach((obstacle) => {
        if (
          playerX + 20 > obstacle.x &&
          playerX - 20 < obstacle.x + obstacle.width &&
          playerY + 20 > obstacle.y &&
          playerY - 20 < obstacle.y + obstacle.height
        ) {
          setIsPlaying(false)
          setScore(0)
        }
      })

      // Update score
      setScore((prev) => prev + 1)

      gameLoop = requestAnimationFrame(update)
    }

    // Start game loop
    update()

    // Cleanup
    return () => {
      cancelAnimationFrame(gameLoop)
      window.removeEventListener('keydown', (e) => (keys[e.key] = true))
      window.removeEventListener('keyup', (e) => (keys[e.key] = false))
    }
  }, [isPlaying])

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
          <h2 className="text-2xl font-bold text-gradient mb-2">{title}</h2>
          <p className="text-gray-400">Score: {score}</p>
        </div>
        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="bg-black border border-gray-800 rounded-lg"
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <Button onClick={() => setIsPlaying(true)}>Start Game</Button>
          </div>
        )}
      </div>
    </div>
  )
} 