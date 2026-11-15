
import React from 'react'

export default function MissionAdvisor({
  destination,
  engine,
  fuel,
  mass,
  requirement,
  missionScore,
  missionReady
}) {
  const issues = []
  const suggestions = []

  if (fuel < requirement.fuelRequired) {
    issues.push('Insufficient fuel for the selected destination.')
    suggestions.push(
      `Increase fuel to at least ${requirement.fuelRequired}%.`
    )
  }

  if (mass > requirement.maxMass) {
    issues.push('Spacecraft mass exceeds the recommended limit.')
    suggestions.push(
      `Reduce mass below ${requirement.maxMass} kg.`
    )
  }

  if (
    requirement.engine &&
    engine !== requirement.engine
  ) {
    issues.push('Your engine differs from the recommended engine.')
    suggestions.push(
      `Consider selecting ${requirement.engine} engine.`
    )
  }

  if (issues.length === 0) {
    suggestions.push(
      'Your configuration meets the simplified mission requirements.'
    )
  }

  return (
    <div className="mission-advisor">
      <h2>🧠 Mission Intelligence</h2>

      <p>
        <strong>Destination:</strong> {destination}
      </p>

      <p>
        <strong>Mission Score:</strong> {missionScore}%
      </p>

      <h3>
        {missionReady
          ? '🟢 Mission Ready'
          : '🔴 Mission Needs Improvement'}
      </h3>

      <h3>Analysis</h3>

      {issues.length === 0 ? (
        <p>✅ No configuration issues detected.</p>
      ) : (
        issues.map((issue, index) => (
          <p key={index}>⚠️ {issue}</p>
        ))
      )}

      <h3>Recommendations</h3>

      {suggestions.map((suggestion, index) => (
        <p key={index}>💡 {suggestion}</p>
      ))}
    </div>
  )
}
