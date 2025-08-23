import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import RoomModel from './Room'

const GameExperience = ({ duplicateBookRef }) => {
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' })
  const roomModelRef = useRef()

  useEffect(() => {
    if (duplicateBookRef) {
      duplicateBookRef.current = () => {
        roomModelRef.current?.duplicateBook()
      }
    }
  }, [duplicateBookRef])

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
      <ambientLight intensity={0.2} color="#1a3e2b" />
      <directionalLight position={[5, 5, 5]} intensity={5} />
      <OrbitControls
        enablePan={false}
        enableZoom={!isTablet}
        maxDistance={20}
        minDistance={5}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2}
      />
      <mesh scale={[1.6, 1.6, 1.6]} position={[-3, -3, 0]}>
        <RoomModel ref={roomModelRef} />
      </mesh>
    </Canvas>
  )
}

export default GameExperience
