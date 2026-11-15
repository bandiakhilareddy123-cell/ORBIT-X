
import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import './LaunchAnimation3D.css'

// ROTATING EARTH
function Earth() {
  const earth = useRef()

  useFrame(() => {
    if (earth.current) earth.current.rotation.y += 0.003
  })

  return (
    <mesh ref={earth} position={[0, -3, -2]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial
        color="#1261c9"
        emissive="#062b70"
      />
    </mesh>
  )
}

// ROCKET + FLAMES
function Rocket({ outcome }) {
  const rocket = useRef()
  const flame = useRef()
  const smoke = useRef()

  const startTime = useRef(Date.now())

  useEffect(() => {
    startTime.current = Date.now()
  }, [outcome])

  useFrame(() => {
    if (!rocket.current) return

    const elapsed = (Date.now() - startTime.current) / 1000

    if (outcome === 'success') {
      rocket.current.position.y = -1.2 + elapsed * 1.5
    } else if (outcome === 'failed') {
      rocket.current.position.y = 0.5 - Math.min(elapsed * 0.5, 1.7)
      rocket.current.rotation.z = Math.sin(elapsed * 8) * 0.15
    } else {
      rocket.current.position.y = -1.2 + Math.sin(elapsed * 2) * 0.08
    }

    if (flame.current) {
      flame.current.scale.y = 0.8 + Math.sin(elapsed * 20) * 0.4
    }

    if (smoke.current) {
      smoke.current.children.forEach((particle, index) => {
        particle.position.y =
          -0.9 - ((elapsed * 1.5 + index * 0.35) % 2)

        particle.position.x =
          Math.sin(elapsed * 3 + index) * 0.35

        const size = 0.08 + (index % 4) * 0.025
        particle.scale.setScalar(size)
      })
    }
  })

  return (
    <group ref={rocket} position={[0, -1.2, 0]}>

      {/* ROCKET BODY */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.28, 1.2, 16]} />
        <meshStandardMaterial
          color="#f8fafc"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* ROCKET NOSE */}
      <mesh position={[0, 0.8, 0]}>
        <coneGeometry args={[0.2, 0.5, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* WINDOWS */}
      <mesh position={[0, 0.25, 0.2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
        />
      </mesh>

      {/* FINS */}
      <mesh position={[0.28, -0.45, 0]}>
        <boxGeometry args={[0.18, 0.4, 0.15]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      <mesh position={[-0.28, -0.45, 0]}>
        <boxGeometry args={[0.18, 0.4, 0.15]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* MAIN FLAME */}
      <mesh ref={flame} position={[0, -1, 0]}>
        <coneGeometry args={[0.22, 1.2, 16]} />
        <meshStandardMaterial
          color={outcome === 'failed' ? '#ef4444' : '#ff6b00'}
          emissive="#ff4500"
          emissiveIntensity={2}
        />
      </mesh>

      {/* INNER FIRE */}
      <mesh position={[0, -1.05, 0]}>
        <coneGeometry args={[0.12, 0.7, 12]} />
        <meshStandardMaterial
          color="#facc15"
          emissive="#facc15"
          emissiveIntensity={3}
        />
      </mesh>

      {/* SMOKE PARTICLES */}
      <group ref={smoke}>
        {Array.from({ length: 14 }, (_, i) => (
          <mesh key={i} position={[0, -1, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshStandardMaterial
              color="#94a3b8"
              transparent
              opacity={0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

// COMPLETE SCENE
function Scene({ outcome }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[0, 3, 3]} intensity={2} />
      <Stars count={500} />

      <Earth />
      <Rocket outcome={outcome} />

      <OrbitControls enableZoom={false} />
    </>
  )
}

// MAIN COMPONENT
export default function LaunchAnimation3D({ outcome = 'idle' }) {
  return (
    <div style={{ position: 'relative', height: '450px' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.25]}
      >
        <Scene outcome={outcome} />
      </Canvas>

      <div style={{
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '22px',
        pointerEvents: 'none',
        color:
          outcome === 'success'
            ? '#4ade80'
            : outcome === 'failed'
            ? '#f87171'
            : '#38bdf8'
      }}>
        {outcome === 'success'
          ? '🚀 ROCKET LAUNCH SUCCESS'
          : outcome === 'failed'
          ? '🔥 ROCKET MISSION FAILED'
          : '🚀 READY FOR LAUNCH'}
      </div>
    </div>
  )
}
