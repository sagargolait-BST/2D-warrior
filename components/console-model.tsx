"use client"

import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useScroll } from 'framer-motion'
import * as THREE from 'three'

export function ConsoleModel() {
  const consoleRef = useRef<THREE.Group>(null)
  const { scrollYProgress } = useScroll()
  const [modelError, setModelError] = useState(false)

  try {
    const { scene } = useGLTF('/models/console.glb')

    useFrame((state, delta) => {
      if (!consoleRef.current) return

      // Rotate based on scroll
      const rotation = scrollYProgress.get() * Math.PI * 2
      consoleRef.current.rotation.y = rotation

      // Add floating animation
      consoleRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    })

    if (modelError) return null

    return <primitive ref={consoleRef} object={scene} scale={2} position={[0, 0, 0]} />
  } catch (error) {
    if (!modelError) setModelError(true)
    return null
  }
}