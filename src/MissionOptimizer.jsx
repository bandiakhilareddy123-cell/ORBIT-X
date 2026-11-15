
import React from 'react'

export default function MissionOptimizer({
  destination,
  requirement,
  engines,
  setEngine,
  setFuel,
  setMass,
  resetLaunch
}) {
  const recommendedEngine = requirement.recommendedEngine

  const recommendedFuel = requirement.fuelRequired

  const recommendedMass = Math.min(
    1000,
    requirement.maxMass
  )

  function applyOptimization() {
    setEngine(recommendedEngine)
    setFuel(recommendedFuel)
    setMass(recommendedMass)
    resetLaunch()
  }

  return (
    <div style={{
      background: '#0f172a',
      border: '1px solid #334155',
      borderRadius: '16px',
      padding: '22px',
      margin: '20px 0',
      color: '#e2e8f0'
    }}>
      <h2 style={{ color: '#a78bfa' }}>
        🚀 Mission Optimization Engine
      </h2>

      <p>Destination: {destination}</p>

      <h3 style={{ color: '#67e8f9' }}>
        Recommended Configuration
      </h3>

      <p>Engine: {recommendedEngine}</p>
      <p>Fuel: {recommendedFuel}%</p>
      <p>Spacecraft Mass: {recommendedMass} kg</p>

      <p>
        This configuration follows the simplified
        mission requirements.
      </p>

      <button
        onClick={applyOptimization}
        style={{
          background: '#7c3aed',
          color: 'white',
          padding: '12px 20px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Apply Optimization →
      </button>
    </div>
  )
}
