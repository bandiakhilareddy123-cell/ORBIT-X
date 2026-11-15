 
import React, { useState, useEffect } from 'react'

export default function MissionTelemetry({ fuel, destination, engine, mass }) {
  const [telemetry, setTelemetry] = useState({
    velocity: 7.8,
    altitude: 400,
    temperature: 24,
    signal: 98
  })
  useEffect(() => {
    const missionData = {
      Earth: { velocity: 7.8, distance: 400 },
      Moon: { velocity: 10.9, distance: 384400 },
      Mars: { velocity: 24.1, distance: 225000000 }
    }

    const selected = missionData[destination] || missionData.Earth

    const interval = setInterval(() => {
      setTelemetry({
        velocity: +(selected.velocity + Math.random() * 0.2).toFixed(2),
        altitude: Math.round(selected.distance),
        temperature: Math.round(24 + Math.random() * 3),
        signal: Math.round(90 + Math.random() * 10)
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [destination])

  const items = [
    ['VELOCITY', telemetry.velocity, 'km/s'],
    ['MISSION DISTANCE', telemetry.altitude, 'km'],
    ['TEMPERATURE', telemetry.temperature, '°C'],
    ['SIGNAL', telemetry.signal, '%'],
    ['FUEL', fuel, '%'],
    ['SPACECRAFT MASS', mass, 'kg'],
    ['DESTINATION', destination, ''],
    ['ENGINE', engine, '']
  ]

  const healthColor =
    fuel >= 30 ? '#22c55e' : fuel > 10 ? '#f59e0b' : '#ef4444'

  const healthStatus =
    fuel >= 30 ? '● NOMINAL' : fuel > 10 ? '● WARNING' : '● CRITICAL'

  return (
    <section style={{
      background: 'rgba(15,23,42,0.85)',
      border: '1px solid #334155',
      borderRadius: '16px',
      padding: '20px',
      margin: '20px 0',
      color: '#e2e8f0'
    }}>

      {/* HEADER */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ color: '#38bdf8', margin: 0 }}>
          📡 LIVE MISSION TELEMETRY
        </h2>

        <span style={{
          color: '#22c55e',
          background: 'rgba(34,197,94,0.1)',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          ● SYSTEM ONLINE
        </span>
      </div>

      {/* TELEMETRY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))',
        gap: '12px',
        marginTop: '18px'
      }}>
        {items.map(([name, value, unit]) => (
          <div key={name} style={{
            background: '#020617',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #1e293b'
          }}>
            <div style={{ color: '#94a3b8', fontSize: '12px' }}>
              {name}
            </div>

            <h2 style={{
              color: '#22d3ee',
              fontSize: '18px',
              overflowWrap: 'anywhere'
            }}>
              {value} <small>{unit}</small>
            </h2>
          </div>
        ))}
      </div>

      {/* FUEL PROGRESS */}
      <div style={{ marginTop: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span>⛽ FUEL LEVEL</span>
          <span>{fuel}%</span>
        </div>

        <div style={{
          height: '12px',
          background: '#1e293b',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${Math.max(0, Math.min(100, fuel))}%`,
            height: '100%',
            background: 'linear-gradient(90deg,#06b6d4,#22c55e)',
            borderRadius: '20px',
            transition: 'width 0.5s'
          }} />
        </div>
      </div>

      {/* MISSION HEALTH */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        background: 'rgba(34,197,94,0.08)',
        border: `1px solid ${healthColor}`,
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>🛰️ MISSION HEALTH</span>

        <span style={{
          color: healthColor,
          fontWeight: 'bold'
        }}>
          {healthStatus}
        </span>
      </div>

      {/* SIGNAL STRENGTH */}
      <div style={{ marginTop: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span>📡 SIGNAL STRENGTH</span>
          <span>{telemetry.signal}%</span>
        </div>

        <div style={{
          height: '10px',
          background: '#1e293b',
          borderRadius: '20px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${telemetry.signal}%`,
            height: '100%',
            background: '#38bdf8',
            transition: 'width 0.5s'
          }} />
        </div>
      </div>

      {/* STREAM STATUS */}
      <p style={{
        color: '#22c55e',
        fontSize: '12px',
        marginTop: '18px'
      }}>
        ● SIMULATED TELEMETRY STREAM ACTIVE
      </p>

    </section>
  )
}
