
import React, { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, useTexture } from '@react-three/drei'

// 🌍 ROTATING EARTH
function Earth() {
  const earth = useRef()

  const earthTexture = useTexture(
    'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
  )

  useFrame(() => {
    if (earth.current) {
      earth.current.rotation.y += 0.002
    }
  })

  return (
    <group position={[5, 1, -8]}>
      <mesh ref={earth}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.9}
        />
      </mesh>

      {/* Earth atmosphere */}
      <mesh>
        <sphereGeometry args={[2.08, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// 🛰️ ORBITING SATELLITES
function Satellite({ radius, speed, color }) {
  const satellite = useRef()

  useFrame(({ clock }) => {
    if (satellite.current) {
      const angle = clock.elapsedTime * speed

      satellite.current.position.set(
        5 + Math.cos(angle) * radius,
        1 + Math.sin(angle) * radius,
        -8
      )

      satellite.current.rotation.y = clock.elapsedTime
    }
  })

  return (
    <mesh ref={satellite}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
      />
    </mesh>
  )
}

// ☄️ SHOOTING STAR
function ShootingStar() {
  const star = useRef()

  useFrame(({ clock }) => {
    if (star.current) {
      const t = clock.elapsedTime * 2

      star.current.position.set(
        (t % 20) - 10,
        5 - (t % 10),
        -5
      )
    }
  })

  return (
    <mesh ref={star}>
      <boxGeometry args={[1.2, 0.025, 0.025]} />
      <meshBasicMaterial color="white" />
    </mesh>
  )
}

function Sun() {
  const sun = useRef()

  useFrame(() => {
    if (sun.current) {
      sun.current.rotation.y += 0.003
    }
  })

  return (
    <group position={[-5, 2, -10]}>
      <mesh ref={sun}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          color="#ff8c00"
          emissive="#ff4500"
          emissiveIntensity={3}
        />
      </mesh>

      {/* Sun glow */}
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.15}
        />
      </mesh>

      <pointLight
        color="#ff9900"
        intensity={40}
        distance={30}
      />
    </group>
  )
}

function Asteroids() {
  const asteroid1 = useRef()
  const asteroid2 = useRef()
  const asteroid3 = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (asteroid1.current) {
      asteroid1.current.position.x = Math.sin(t * 0.4) * 4
      asteroid1.current.rotation.x += 0.01
    }

    if (asteroid2.current) {
      asteroid2.current.position.y = Math.cos(t * 0.3) * 3
      asteroid2.current.rotation.y += 0.02
    }

    if (asteroid3.current) {
      asteroid3.current.position.x = Math.cos(t * 0.5) * 6
      asteroid3.current.rotation.z += 0.01
    }
  })

  return (
    <>
      <mesh ref={asteroid1} position={[-4, 2, -6]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>

      <mesh ref={asteroid2} position={[3, -2, -7]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>

      <mesh ref={asteroid3} position={[0, 4, -9]}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#57534e" />
      </mesh>
    </>
  )
}

function Astronaut() {
  const astronaut = useRef()

  useFrame(({ clock }) => {
    if (astronaut.current) {
      astronaut.current.position.y =
        2 + Math.sin(clock.elapsedTime) * 0.4

      astronaut.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group ref={astronaut} position={[-5, 2, -6]}>

      {/* Helmet */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Helmet glass */}
      <mesh position={[0, 0.6, 0.32]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#0ea5e9"
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[0.65, 0.9, 0.4]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.5, -0.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <mesh position={[0.5, -0.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, -0.9, 0]}>
        <boxGeometry args={[0.22, 0.55, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>

      <mesh position={[0.2, -0.9, 0]}>
        <boxGeometry args={[0.22, 0.55, 0.25]} />
        <meshStandardMaterial color="white" />
      </mesh>

    </group>
  )
}

function SpaceStation() {
  const station = useRef()

  useFrame(({ clock }) => {
    if (station.current) {
      station.current.rotation.z = clock.elapsedTime * 0.3
      station.current.rotation.y = clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={station} position={[0, -3, -8]}>

      {/* Central module */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 1, 16]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
      </mesh>

      {/* Solar panels */}
      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[1.8, 0.08, 0.7]} />
        <meshStandardMaterial color="#2563eb" metalness={0.5} />
      </mesh>

      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[1.8, 0.08, 0.7]} />
        <meshStandardMaterial color="#2563eb" metalness={0.5} />
      </mesh>

      {/* Connecting arms */}
      <mesh>
        <boxGeometry args={[3.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

    </group>
  )
}

// 🌌 SPACE SCENE
function SpaceScene() {
  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={3}
      />

      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={6000}
        factor={5}
        fade
        speed={2}
      />

      {/* Earth */}
      <Earth />
      <Sun />

      {/* Satellites */}
      <Satellite
        radius={3}
        speed={0.5}
        color="#22d3ee"
      />

      <Satellite
        radius={4}
        speed={0.3}
        color="#facc15"
      />
      

      {/* Shooting star */}
      <ShootingStar />
      <Asteroids />
      <Astronaut />
      <SpaceStation />
    </>
  )
}

// 🚀 MAIN SPACE BACKGROUND
export default function SpaceBackground() {
  return (
    <div className="space-background">
      <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
        <SpaceScene />
      </Canvas>
    </div>
  )
}
