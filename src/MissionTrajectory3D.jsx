
import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import './MissionTrajectory3D.css'

function Planet({ position, color, size }) {
  const ref = useRef()

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.003
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.12}
      />
    </mesh>
  )
}

function MissionPath({ destination }) {
  const pathRef = useRef()
  const spacecraftRef = useRef()

  const radius =
    destination === 'Earth' ? 1.8 :
    destination === 'Moon' ? 3.2 : 4.5

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    if (spacecraftRef.current) {
      spacecraftRef.current.position.x = Math.cos(t) * radius
      spacecraftRef.current.position.z = Math.sin(t) * radius
      spacecraftRef.current.position.y = Math.sin(t * 2) * 0.3
    }
  })

  const points = []

  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2

    points.push(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    )
  }

  return (
    <>
      <line ref={pathRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(points), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={
            destination === 'Earth' ? '#38bdf8' :
            destination === 'Moon' ? '#a78bfa' :
            '#f97316'
          }
        />
      </line>

      <mesh ref={spacecraftRef}>
        <octahedronGeometry args={[0.18]} />
        <meshStandardMaterial
          color="white"
          emissive="#38bdf8"
          emissiveIntensity={3}
        />
      </mesh>
    </>
  )
}

function Scene({ destination }) {
  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[5, 5, 5]} intensity={2} />
      <Stars count={350} />

      <Planet position={[0, 0, 0]} color="#2563eb" size={1} />

      <Planet
        position={[3.5, 0, 0]}
        color="#94a3b8"
        size={0.35}
      />

      <Planet
        position={[-4, 0, 0]}
        color="#ef4444"
        size={0.55}
      />

      <MissionPath destination={destination} />

      <OrbitControls enableZoom />
    </>
  )
}

export default function MissionTrajectory3D({
  destination = 'Earth'
}) {
  return (
    <div className="trajectory-scene">
      <Canvas
        camera={{ position: [0, 5, 9], fov: 50 }}
        dpr={[1, 1.25]}
      >
        <Scene destination={destination} />
      </Canvas>

      <div className="trajectory-label">
        🚀 DESTINATION: {destination.toUpperCase()}
      </div>
    </div>
  )
}
