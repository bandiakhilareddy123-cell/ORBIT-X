
import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import './Spacecraft3D.css'

// EARTH
function Earth() {
  const earthRef = useRef()

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#1261b5"
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0.2, 0.5, 1.35]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial color="#38a169" />
      </mesh>

      <mesh position={[-0.7, 0.2, 1.15]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>

      <mesh position={[0.6, -0.6, 1.1]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#2e8b57" />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.54, 24, 24]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

// SPACECRAFT
function OrbitalSpacecraft({ running, resetKey }) {
  const shipRef = useRef()
  const angleRef = useRef(0)

  useEffect(() => {
    angleRef.current = 0
  }, [resetKey])

  useFrame((_, delta) => {
    if (!shipRef.current) return

    if (running) {
      angleRef.current += delta * 0.35
    }

    const angle = angleRef.current
    const radius = 2.2

    shipRef.current.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 0.5) * 0.45,
      Math.sin(angle) * radius
    )

    shipRef.current.rotation.y = -angle
  })

  return (
    <group ref={shipRef}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.55, 12]} />
        <meshStandardMaterial
          color="#dbeafe"
          metalness={0.5}
        />
      </mesh>

      <mesh
        position={[0.35, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[0.12, 0.3, 12]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>

      <mesh position={[0, 0, 0.3]}>
        <boxGeometry args={[0.35, 0.05, 0.5]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      <mesh position={[0, 0, -0.3]}>
        <boxGeometry args={[0.35, 0.05, 0.5]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
    </group>
  )
}

// ORBIT
function OrbitPath() {
  return (
    <mesh rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[2.2, 0.012, 6, 80]} />
      <meshBasicMaterial color="#38bdf8" />
    </mesh>
  )
}

// TELEMETRY
function TelemetryEngine({
  running,
  resetKey,
  onTelemetry
}) {
  const elapsedRef = useRef(0)
  const updateRef = useRef(0)

  useEffect(() => {
    elapsedRef.current = 0
    updateRef.current = 0

    onTelemetry({
      altitude: 400,
      velocity: 7.8,
      temperature: 25,
      fuel: 100,
      progress: 0
    })
  }, [resetKey, onTelemetry])

  useFrame((_, delta) => {
    if (!running) return

    elapsedRef.current += delta
    updateRef.current += delta

    if (updateRef.current >= 1) {
      const elapsed = elapsedRef.current

      onTelemetry({
        altitude: Math.round(400 + Math.sin(elapsed) * 10),
        velocity: Number(
          (7.8 + Math.sin(elapsed * 0.5) * 0.2).toFixed(2)
        ),
        temperature: Math.round(25 + (elapsed % 20) * 2),
        fuel: Math.max(0, Math.round(100 - elapsed * 0.5)),
        progress: Math.round((elapsed % 60) / 60 * 100)
      })

      updateRef.current = 0
    }
  })

  return null
}

// 3D SCENE
function Scene({ running, resetKey, onTelemetry }) {
  return (
    <>
      <color attach="background" args={['#020617']} />

      <Stars
        radius={60}
        depth={40}
        count={600}
        factor={3}
        saturation={0}
        fade
        speed={0.15}
      />

      <ambientLight intensity={1} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
      />

      <Earth />
      <OrbitPath />

      <OrbitalSpacecraft
        running={running}
        resetKey={resetKey}
      />

      <TelemetryEngine
        running={running}
        resetKey={resetKey}
        onTelemetry={onTelemetry}
      />

      <OrbitControls
        enablePan={false}
        minDistance={4}
        maxDistance={12}
      />
    </>
  )
}

// MAIN COMPONENT
export default function Spacecraft3D() {
  const [running, setRunning] = useState(true)
  const [resetKey, setResetKey] = useState(0)

  const [telemetry, setTelemetry] = useState({
    altitude: 400,
    velocity: 7.8,
    temperature: 25,
    fuel: 100,
    progress: 0
  })

  // Stable callback prevents unnecessary telemetry resets
  const handleTelemetry = useCallback((data) => {
    setTelemetry(data)
  }, [])

  return (
    <div className="orbit-scene">

      {/* OPTIMIZED 3D EARTH */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 45 }}
        dpr={[1, 1.25]}
        gl={{
          antialias: false,
          powerPreference: 'low-power'
        }}
      >
        <Scene
          running={running}
          resetKey={resetKey}
          onTelemetry={handleTelemetry}
        />
      </Canvas>

      {/* TITLE */}
      <div className="orbit-label">
        🌍 EARTH ORBIT SIMULATION
      </div>

      {/* ORBIT CONTROLS */}
      <div className="orbit-controls-panel">
        <button onClick={() => setRunning(value => !value)}>
          {running ? '⏸ Pause Orbit' : '▶ Resume Orbit'}
        </button>

        <button
          onClick={() => {
            setRunning(true)
            setResetKey(value => value + 1)
          }}
        >
          ↻ Reset Orbit
        </button>
      </div>

      {/* TELEMETRY */}
      <div style={{
        position: 'absolute',
        left: '15px',
        top: '15px',
        width: '180px',
        padding: '14px',
        background: 'rgba(2, 6, 23, 0.88)',
        border: '1px solid #1e40af',
        borderRadius: '12px',
        color: '#e2e8f0',
        fontSize: '12px',
        zIndex: 2
      }}>

        <div style={{
          color: '#38bdf8',
          fontWeight: 'bold',
          marginBottom: '12px',
          letterSpacing: '1px'
        }}>
          📡 MISSION TELEMETRY
        </div>

        <div style={{ marginBottom: '8px' }}>
          STATUS:
          <span style={{
            color: running ? '#4ade80' : '#facc15',
            marginLeft: '6px'
          }}>
            {running ? 'ORBITING' : 'PAUSED'}
          </span>
        </div>

        <div style={{ marginBottom: '8px' }}>
          ALTITUDE: {telemetry.altitude} km
        </div>

        <div style={{ marginBottom: '8px' }}>
          VELOCITY: {telemetry.velocity} km/s
        </div>

        <div style={{ marginBottom: '8px' }}>
          TEMP: {telemetry.temperature} °C
        </div>

        <div style={{ marginBottom: '6px' }}>
          FUEL: {telemetry.fuel}%
        </div>

        {/* FUEL BAR */}
        <div style={{
          height: '6px',
          background: '#1e293b',
          borderRadius: '5px',
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          <div style={{
            width: `${telemetry.fuel}%`,
            height: '100%',
            background: '#38bdf8'
          }} />
        </div>

        <div style={{ marginBottom: '6px' }}>
          ORBIT PROGRESS: {telemetry.progress}%
        </div>

        {/* PROGRESS BAR */}
        <div style={{
          height: '6px',
          background: '#1e293b',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${telemetry.progress}%`,
            height: '100%',
            background: '#4ade80'
          }} />
        </div>

      </div>

    </div>
  )
}
