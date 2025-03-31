"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { useState } from 'react'
import { Game2D } from './2d-game'

interface GameCardProps {
  title: string
  image: string
  description: string
}

export function GameCard({ title, image, description }: GameCardProps) {
  const [isGameOpen, setIsGameOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="hover-card-animation cursor-pointer"
        onClick={() => setIsGameOpen(true)}
      >
        <Card className="glass-panel overflow-hidden">
          <div className="relative h-48">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-gradient">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400">{description}</p>
          </CardContent>
        </Card>
      </motion.div>

      {isGameOpen && (
        <Game2D onClose={() => setIsGameOpen(false)} />
      )}
    </>
  )
}