
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'

function Spacecraft() {
  return (
    <group>
      {/* Main spacecraft body */}
      <mesh>
        <cylinderGeometry args={[0.4, 0.5, 2, 16]} />
        <meshStandardMaterial color="silver" />
      </mesh>

      {/* Spacecraft nose */}
      <mesh position={[0, 1.3, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshStandardMaterial color="cyan" />
      </mesh>

      {/* Solar panels */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    </group>
  )
}

export default function Spacecraft3D() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [5, 3, 6], fov: 45 }}>
        <ambientLight intensity={2} />
        <Stars />
        <Spacecraft />
        <OrbitControls />
      </Canvas>
    </div>
  )
}


