import { useState, useEffect } from 'react'

import MissionTelemetry from './MissionTelemetry'
import NASAData from './NASAData'
import SpaceBackground from './SpaceBackground'
import MissionOptimizer from './MissionOptimizer'
import MissionAdvisor from './MissionAdvisor'
import { jsPDF } from 'jspdf'
import SpacePilotGame from './SpacePilotGame'
import LaunchAnimation3D from './LaunchAnimation3D'
import MissionTrajectory3D from './MissionTrajectory3D'
import Spacecraft3D from './Spacecraft3D'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import './App.css'

// DESTINATION REQUIREMENTS
const destinations = {
  Earth: {
    distance: '400 km',
    time: '90 minutes per orbit',
    difficulty: 'Easy',
    fuelRequired: 30,
    maxMass: 3500,
    recommendedEngine: 'Chemical'
  },
  Moon: {
    distance: '384,400 km',
    time: '3 days',
    difficulty: 'Medium',
    fuelRequired: 60,
    maxMass: 2500,
    recommendedEngine: 'Chemical'
  },
  Mars: {
    distance: '225 million km',
    time: '7 months',
    difficulty: 'Hard',
    fuelRequired: 85,
    maxMass: 1800,
    recommendedEngine: 'Nuclear'
  }
}

const engines = {
  Chemical: 1,
  Ion: 0.6,
  Nuclear: 1.5
}

const buttonStyle = {
  padding: '12px 18px',
  margin: '8px',
  border: 'none',
  borderRadius: '8px',
  background: '#2563eb',
  color: 'white',
  cursor: 'pointer',
  fontWeight: 'bold'
}

const cardStyle = {
  background: '#0f172a',
  padding: '20px',
  borderRadius: '14px',
  border: '1px solid #1e293b',
  marginBottom: '15px'
}

function Panel({ title, children }) {
  return(

   <div style={cardStyle}>
    
      <h3 style={{ color: '#38bdf8' }}>{title}</h3>
      {children}
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('Dashboard')
  const [destination, setDestination] = useState('Earth')
  const [engine, setEngine] = useState('Chemical')
  const [fuel, setFuel] = useState(50)
  const [mass, setMass] = useState(1000)
  const [launchStatus, setLaunchStatus] = useState('Standby')
  const [countdown, setCountdown] = useState(null)
  const [failureReason, setFailureReason] = useState('')

  // MISSION HISTORY
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('orbitXHistory')) || []
    } catch {
      return []
    }
  })

  // MISSION INTELLIGENCE
  const requirement = destinations[destination]

  const fuelScore = Math.min(
    100,
    (fuel / requirement.fuelRequired) * 100
  )

  const massScore = Math.min(
    100,
    (requirement.maxMass / mass) * 100
  )

  const engineScore =
    engine === requirement.recommendedEngine ? 100 : 70

  const score = Math.round(
    fuelScore * 0.45 +
    massScore * 0.35 +
    engineScore * 0.20
  )

  const missionReady =
    fuel >= requirement.fuelRequired &&
    mass <= requirement.maxMass &&
    score >= 75

  // MISSION RECOMMENDATIONS
  const recommendations = []

  if (fuel < requirement.fuelRequired) {
    recommendations.push(
      `Increase fuel to at least ${requirement.fuelRequired}%.`
    )
  }

  if (mass > requirement.maxMass) {
    recommendations.push(
      `Reduce mass below ${requirement.maxMass} kg.`
    )
  }

  if (engine !== requirement.recommendedEngine) {
    recommendations.push(
      `Consider ${requirement.recommendedEngine} engine.`
    )
  }

  if (missionReady) {
    recommendations.push(
      'Spacecraft configuration meets mission requirements!'
    )
  }

  // SAVE MISSION RESULT
  function saveMission(result, reason = '') {
    const record = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      destination,
      engine,
      fuel,
      mass,
      score,
      result,
      reason
    }

    const updated = [record, ...history]

    setHistory(updated)

    localStorage.setItem(
      'orbitXHistory',
      JSON.stringify(updated)
    )
  }

  // LAUNCH EVALUATION
  function launchMission() {
    if (!missionReady) {
      const reason = recommendations
        .filter(item => !item.includes('meets mission requirements'))
        .join(' ')

      setFailureReason(
        reason || 'Mission configuration does not meet requirements.'
      )

      setLaunchStatus('MISSION FAILURE')
      saveMission('FAILURE', reason)
      return
    }

    setFailureReason('')
    setLaunchStatus('MISSION SUCCESS')
    saveMission('SUCCESS')
  }

  // COUNTDOWN
  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      setCountdown(null)
      launchMission()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(value => value - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  // RESET LAUNCH
  function resetLaunch() {
    setCountdown(null)
    setLaunchStatus('Standby')
    setFailureReason('')
  }

  // DOWNLOAD MISSION CERTIFICATE PDF
  function downloadCertificate() {
    const doc = new jsPDF()

    doc.setFillColor(2, 6, 23)
    doc.rect(0, 0, 210, 297, 'F')

    doc.setDrawColor(250, 204, 21)
    doc.setLineWidth(2)
    doc.rect(10, 10, 190, 277)

    doc.setTextColor(250, 204, 21)
    doc.setFontSize(30)
    doc.text('ORBIT-X', 105, 40, { align: 'center' })

    doc.setTextColor(56, 189, 248)
    doc.setFontSize(18)
    doc.text('MISSION ACHIEVEMENT CERTIFICATE', 105, 60, {
      align: 'center'
    })

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text('This certifies successful completion of', 105, 90, {
      align: 'center'
    })

    doc.setTextColor(250, 204, 21)
    doc.setFontSize(26)
    doc.text(`${destination} Mission`, 105, 115, {
      align: 'center'
    })

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(14)
    doc.text(`Engine: ${engine}`, 30, 145)
    doc.text(`Fuel: ${fuel}%`, 30, 160)
    doc.text(`Mass: ${mass} kg`, 30, 175)
    doc.text(`Mission Score: ${score}/100`, 30, 190)

    doc.setTextColor(74, 222, 128)
    doc.setFontSize(24)
    doc.text('MISSION SUCCESS!', 105, 225, {
      align: 'center'
    })

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 250, {
      align: 'center'
    })

    doc.save(`ORBIT-X_${destination}_Certificate.pdf`)
  }

  // ANALYTICS DATA
  const successfulMissions = history.filter(
    item => item.result === 'SUCCESS'
  )

  const failedMissions = history.filter(
    item => item.result === 'FAILURE'
  )

  const successRate = history.length
    ? Math.round(
        successfulMissions.length / history.length * 100
      )
    : 0

  const averageFuel = history.length
    ? Math.round(
        history.reduce((sum, item) => sum + item.fuel, 0) /
        history.length
      )
    : 0

  const averageScore = history.length
    ? Math.round(
        history.reduce((sum, item) => sum + item.score, 0) /
        history.length
      )
    : 0

  const destinationData = ['Earth', 'Moon', 'Mars'].map(name => ({
    name,
    missions: history.filter(
      item => item.destination === name
    ).length
  }))

  const resultData = [
    { name: 'Success', value: successfulMissions.length },
    { name: 'Failure', value: failedMissions.length }
  ]

  const colors = ['#22c55e', '#ef4444']
 
 
     // MAIN APPLICATION
  return (
    <>
      <SpaceBackground />

      <div style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#e2e8f0',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        position: 'relative',
        zIndex: 1
      }}></div>

    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      color: '#e2e8f0',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      position: 'relative',
      zIndex: 1
    }}>


  
      
      {/* SIDEBAR */}
      <aside style={{
        width: '220px',
        background: '#0f172a',
        padding: '20px',
        borderRight: '1px solid #1e293b'
      }}>
        <h2 style={{ color: '#38bdf8' }}>🚀 ORBIT-X</h2>
        <p style={{ color: '#94a3b8' }}>MISSION CONTROL</p>

        
{[
  'Dashboard',
  'Mission Design',
  'Launch Control',
  'Spacecraft',
  'Analytics',
  'Mission History',
  'Play Game'
].map(item => (

          <button
            key={item}
            style={{
              ...buttonStyle,
              width: '100%',
              background: page === item ? '#1d4ed8' : '#1e293b',
              textAlign: 'left'
            }}
            onClick={() => setPage(item)}
          >
            {item}
          </button>
        ))}
      </aside>

      {/* MAIN CONTENT */}
      <main style={{
        flex: 1,
        padding: '30px',
        minWidth: 0
      }}>

        {/* DASHBOARD */}
        {page === 'Dashboard' && (
          <section>
            <NASAData />
            <MissionTelemetry
  fuel={fuel}
  destination={destination}
  engine={engine}
  mass={mass}
/>
            <h1>🌌 Mission Dashboard</h1>
            <p>Explore Beyond The Impossible</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))',
              gap: '15px'
            }}>
              <Panel title="Destination">
                <h2>{destination}</h2>
              </Panel>

              <Panel title="Spacecraft Engine">
                <h2>{engine}</h2>
              </Panel>

              <Panel title="Fuel Level">
                <h2>{fuel}%</h2>
              </Panel>

              <Panel title="Mission Status">
                <h2>{launchStatus}</h2>
              </Panel>
            </div>

            {/* MISSION RISK METER */}
            <Panel title="⚠️ Mission Risk Meter">
              <h2 style={{
                color: !missionReady
                  ? '#ff4d4f'
                  : score >= 90
                  ? '#00ff99'
                  : '#ffc107',
                fontSize: '28px'
              }}>
                {!missionReady
                  ? '🔴 HIGH RISK'
                  : score >= 90
                  ? '🟢 LOW RISK'
                  : '🟡 MEDIUM RISK'}
              </h2>

              <p>Mission Score: {score}/100</p>

              <div style={{
                background: '#333',
                height: '18px',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${score}%`,
                  height: '100%',
                  background: !missionReady
                    ? '#ff4d4f'
                    : score >= 90
                    ? '#00ff99'
                    : '#ffc107',
                  transition: 'width 0.5s'
                }} />
              </div>

              <p>
                {!missionReady
                  ? '⚠️ Improve your spacecraft configuration!'
                  : score >= 90
                  ? '🚀 Excellent mission configuration!'
                  : '🛰️ Mission is ready. Consider improving it.'}
              </p>
            </Panel>

            {/* EARTH ORBIT */}
            <Panel title="🌍 Earth Orbit Visualization">
              <Spacecraft3D />
            </Panel>

            {/* TRAJECTORY */}
            <Panel title="🌌 Mission Trajectory">
              <MissionTrajectory3D destination={destination} />
            </Panel>

            {/* MISSION CONFIGURATION */}
            <Panel title="Mission Configuration">
              <p>Destination: {destination}</p>
              <p>Engine: {engine}</p>
              <p>Fuel: {fuel}%</p>
              <p>Mass: {mass} kg</p>
              <p>Mission Score: {score}/100</p>
              <p>Status: {missionReady ? 'READY' : 'NEEDS IMPROVEMENT'}</p>

              <button
                style={buttonStyle}
                onClick={() => setPage('Mission Design')}
              >
                Configure Mission →
              </button>

              <button
                style={buttonStyle}
                onClick={() => setPage('Launch Control')}
              >
                Launch Mission →
              </button>
            </Panel>
          </section>
        )}

        {/* MISSION DESIGN */}
        {page === 'Mission Design' && (
          <section>
            <h1>🛰️ Mission Design Lab</h1>

            <Panel title="Select Destination">
              <select
                value={destination}
                onChange={e => {
                  setDestination(e.target.value)
                  resetLaunch()
                }}
                style={{
                  padding: '12px',
                  width: '100%',
                  background: '#020617',
                  color: 'white'
                }}
              >
                {Object.keys(destinations).map(item => (
                  <option key={item}>{item}</option>
                ))}
              </select>

              <p>Distance: {requirement.distance}</p>
              <p>Travel Time: {requirement.time}</p>
              <p>Difficulty: {requirement.difficulty}</p>
            </Panel>

            {/* ENGINE */}
            <Panel title="Choose Engine">
              {Object.keys(engines).map(item => (
                <button
                  key={item}
                  style={{
                    ...buttonStyle,
                    background: engine === item ? '#0284c7' : '#334155'
                  }}
                  onClick={() => {
                    setEngine(item)
                    resetLaunch()
                  }}
                >
                  {item} Engine
                </button>
              ))}
            </Panel>

            {/* FUEL */}
            <Panel title="Fuel Configuration">
              <h3>Fuel: {fuel}%</h3>

              <input
                type="range"
                min="10"
                max="100"
                value={fuel}
                onChange={e => {
                  setFuel(Number(e.target.value))
                  resetLaunch()
                }}
                style={{ width: '100%' }}
              />
            </Panel>

            {/* MASS */}
            <Panel title="Spacecraft Mass">
              <h3>{mass} kg</h3>

              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={mass}
                onChange={e => {
                  setMass(Number(e.target.value))
                  resetLaunch()
                }}
                style={{ width: '100%' }}
              />
            </Panel>

            {/* MISSION INTELLIGENCE */}
            <Panel title="🧠 Mission Intelligence">
              <h2 style={{
                color: missionReady ? '#4ade80' : '#f87171'
              }}>
                {missionReady
                  ? '✅ MISSION READY'
                  : '⚠️ NEEDS IMPROVEMENT'}
              </h2>

              <h2>Mission Score: {score}/100</h2>
              <p>Required Fuel: {requirement.fuelRequired}%</p>
              <p>Maximum Mass: {requirement.maxMass} kg</p>
              <p>Recommended Engine: {requirement.recommendedEngine}</p>

              <h3>💡 Mission Recommendations</h3>

              {recommendations.map((item, index) => (
                <p key={index}>• {item}</p>
              ))}

              <button
                style={buttonStyle}
                onClick={() => setPage('Launch Control')}
              >
                Proceed to Launch →
              </button>
            </Panel>
           
             

            {/* ADVANCED MISSION ADVISOR */}
            <MissionAdvisor
              destination={destination}
              engine={engine}
              fuel={fuel}
              mass={mass}
              requirement={requirement}
              missionScore={score}
              missionReady={missionReady}
            />
            {/* MISSION OPTIMIZER */}
<MissionOptimizer
  destination={destination}
  requirement={requirement}
  engines={engines}
  setEngine={setEngine}
  setFuel={setFuel}
  setMass={setMass}
  resetLaunch={resetLaunch}
/>

          </section>
        
        )}

        {/* LAUNCH CONTROL */}
        {page === 'Launch Control' && (
          <section>
            <h1>🚀 Launch Control</h1>

            <Panel title="Launch Sequence">
              <p>Destination: {destination}</p>
              <p>Engine: {engine}</p>
              <p>Fuel: {fuel}%</p>
              <p>Spacecraft Mass: {mass} kg</p>
              <p>Mission Score: {score}/100</p>

              <h3 style={{
                color: missionReady ? '#4ade80' : '#f87171'
              }}>
                {missionReady
                  ? 'Configuration READY'
                  : 'Configuration NOT READY'}
              </h3>

              {/* COUNTDOWN */}
              {countdown !== null && (
                <div style={{
                  textAlign: 'center',
                  padding: '25px',
                  background: '#020617',
                  borderRadius: '12px',
                  margin: '20px 0'
                }}>
                  <h2 style={{ color: '#38bdf8' }}>
                    🚀 LAUNCHING IN
                  </h2>

                  <h1 style={{
                    fontSize: '70px',
                    color: '#facc15'
                  }}>
                    {countdown}
                  </h1>

                  <p>Mission sequence initiated</p>
                </div>
              )}

              {/* LAUNCH STATUS */}
              {countdown === null && (
                <h1 style={{
                  color:
                    launchStatus === 'MISSION SUCCESS'
                      ? '#4ade80'
                      : launchStatus === 'MISSION FAILURE'
                      ? '#f87171'
                      : '#38bdf8'
                }}>
                  {launchStatus}
                </h1>
              )}

              {/* START */}
              <button
                style={buttonStyle}
                disabled={
                  countdown !== null ||
                  launchStatus === 'MISSION SUCCESS' ||
                  launchStatus === 'MISSION FAILURE'
                }
                onClick={() => {
                  setFailureReason('')
                  setLaunchStatus('COUNTDOWN')
                  setCountdown(10)
                }}
              >
                🚀 Start Launch Countdown
              </button>

              {/* ABORT */}
              <button
                style={{ ...buttonStyle, background: '#dc2626' }}
                onClick={resetLaunch}
              >
                ✖ Abort / Reset Launch
              </button>

              {/* SUCCESS CERTIFICATE */}
              {launchStatus === 'MISSION SUCCESS' && (
                <Panel title="🏆 Mission Achievement Certificate">
                  <div style={{
                    textAlign: 'center',
                    padding: '25px',
                    border: '2px solid #facc15',
                    borderRadius: '15px',
                    background: '#111827'
                  }}>
                    <h1 style={{ color: '#facc15' }}>
                      🏆 MISSION ACCOMPLISHED
                    </h1>

                    <h2 style={{ color: '#38bdf8' }}>
                      ORBIT-X SPACE PROGRAM
                    </h2>

                    <p>This certifies successful completion of</p>
                    <h2>{destination} Mission</h2>

                    <p>Spacecraft Engine: {engine}</p>
                    <p>Fuel Configuration: {fuel}%</p>
                    <p>Spacecraft Mass: {mass} kg</p>
                    <p>Mission Score: {score}/100</p>

                    <h2 style={{ color: '#4ade80' }}>
                      🚀 SUCCESS
                    </h2>

                    <p style={{ color: '#facc15' }}>
                      Achievement Unlocked!
                    </p>

                    <button
                      style={{
                        ...buttonStyle,
                        background: '#facc15',
                        color: '#020617'
                      }}
                      onClick={downloadCertificate}
                    >
                      📄 Download Certificate PDF
                    </button>
                  </div>
                </Panel>
              )}

              {/* MISSION FAILURE ANALYSIS */}
              {launchStatus === 'MISSION FAILURE' && (
                <Panel title="🔍 Mission Failure Analysis">
                  <h2 style={{ color: '#f87171' }}>
                    ❌ Mission Failed
                  </h2>

                  <p style={{ color: '#fca5a5' }}>
                    {failureReason}
                  </p>

                  <h3>🛠️ Corrective Actions</h3>

                  {fuel < requirement.fuelRequired && (
                    <p>
                      ⛽ Increase fuel to at least {requirement.fuelRequired}%.
                    </p>
                  )}

                  {mass > requirement.maxMass && (
                    <p>
                      ⚖️ Reduce spacecraft mass below {requirement.maxMass} kg.
                    </p>
                  )}

                  {engine !== requirement.recommendedEngine && (
                    <p>
                      🛰️ Switch to {requirement.recommendedEngine} engine.
                    </p>
                  )}

                  <button
                    style={buttonStyle}
                    onClick={() => setPage('Mission Design')}
                  >
                    🔧 Repair Mission Configuration
                  </button>
                </Panel>
              )}
            </Panel>

            {/* ROCKET VISUALIZATION */}
            <Panel title="🚀 Rocket Launch Visualization">
              <LaunchAnimation3D
                outcome={
                  launchStatus === 'MISSION SUCCESS'
                    ? 'success'
                    : launchStatus === 'MISSION FAILURE'
                    ? 'failed'
                    : 'idle'
                }
              />
            </Panel>
          </section>
        )}

        {/* SPACECRAFT */}
        {page === 'Spacecraft' && (
          <section>
            <h1>🛰️ Spacecraft Monitoring</h1>

            <Panel title="3D Spacecraft">
              <Spacecraft3D />
            </Panel>

            <Panel title="Telemetry">
              <p>Destination: {destination}</p>
              <p>Engine: {engine}</p>
              <p>Fuel: {fuel}%</p>
              <p>Mass: {mass} kg</p>
              <p>Status: {launchStatus}</p>
              <p>Mission Score: {score}/100</p>
            </Panel>
          </section>
        )}

        {/* ANALYTICS */}
        {page === 'Analytics' && (
          <section>
            <h1>📊 Mission Analytics</h1>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
              gap: '15px'
            }}>
              <Panel title="Total Missions">
                <h2>{history.length}</h2>
              </Panel>

              <Panel title="Success Rate">
                <h2>{successRate}%</h2>
              </Panel>

              <Panel title="Average Fuel">
                <h2>{averageFuel}%</h2>
              </Panel>

              <Panel title="Average Score">
                <h2>{averageScore}</h2>
              </Panel>
            </div>

            {/* DESTINATION CHART */}
            <Panel title="Missions by Destination">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={destinationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="missions" fill="#38bdf8" />
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            {/* RESULTS CHART */}
            <Panel title="Mission Results">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={resultData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {resultData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={colors[index]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Panel>
          </section>
        )}

        {/* MISSION HISTORY */}
        {page === 'Mission History' && (
          <section>
            <h1>📜 Mission History</h1>

            <Panel title="Recorded Missions">
              {history.length === 0 ? (
                <p>No missions yet. Complete your first launch!</p>
              ) : (
                history.map(item => (
                  <div
                    key={item.id}
                    style={{
                      borderBottom: '1px solid #334155',
                      padding: '15px 0'
                    }}
                  >
                    <h3 style={{
                      color: item.result === 'SUCCESS'
                        ? '#4ade80'
                        : '#f87171'
                    }}>
                      {item.result === 'SUCCESS'
                        ? '🟢 MISSION SUCCESS'
                        : '🔴 MISSION FAILURE'}
                    </h3>

                    <p>Destination: {item.destination}</p>
                    <p>Engine: {item.engine}</p>
                    <p>Fuel: {item.fuel}%</p>
                    <p>Mass: {item.mass} kg</p>
                    <p>Score: {item.score}</p>

                    {item.reason && (
                      <p>Reason: {item.reason}</p>
                    )}

                    <small>{item.date}</small>
                  </div>
                ))
              )}

              {history.length > 0 && (
                <button
                  style={{
                    ...buttonStyle,
                    background: '#dc2626'
                  }}
                  onClick={() => {
                    if (window.confirm('Delete all mission history?')) {
                      setHistory([])
                      localStorage.removeItem('orbitXHistory')
                    }
                  }}
                >
                  Clear Mission History
                </button>
              )}
            </Panel>
          </section>
        )}

{/* PLAY GAME */}
{page === 'Play Game' && (
  <SpacePilotGame
    destination={destination}
    onExit={() => setPage('Dashboard')}
  />
)}

        {/* FOOTER */}
        <footer style={{
          textAlign: 'center',
          color: '#64748b',
          padding: '25px'
        }}>
          ORBIT-X © 2026 | SPACE ENGINEERING SIMULATOR
        </footer>
      </main>
    </div>
    </>
  )
}
