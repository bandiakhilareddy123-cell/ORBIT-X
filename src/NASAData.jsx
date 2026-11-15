
import React, { useEffect, useState } from 'react'

export default function NASAData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://science.nasa.gov/wp-json/wp/v2/apod-basic')
      .then(response => {
        if (!response.ok) throw new Error('NASA request failed')
        return response.json()
      })
      .then(result => {
        const item = Array.isArray(result) ? result[0] : result
        setData(item)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{
      background: '#0f172a',
      padding: '22px',
      borderRadius: '16px',
      margin: '20px 0',
      color: '#e2e8f0'
    }}>
      <h2 style={{ color: '#67e8f9' }}>
        🌌 NASA Astronomy Picture of the Day
      </h2>

      {loading && <p>Loading NASA astronomy data...</p>}

      {error && (
        <p>NASA data unavailable. Please check your internet connection.</p>
      )}

      {data && (
        <>
          <h3>{data.title}</h3>

          {data.hdurl && (
            <img
              src={data.hdurl}
              alt={data.alt || data.title}
              style={{
                width: '100%',
                maxHeight: '450px',
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          )}

          <p>{data.explanation}</p>
          <p>📅 Date: {data.date}</p>

          <a
            href={data.permalink}
            target="_blank"
            rel="noreferrer"
            style={{ color: '#67e8f9' }}
          >
            View on NASA →
          </a>
        </>
      )}
    </div>
  )
}
