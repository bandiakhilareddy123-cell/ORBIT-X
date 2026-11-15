
 
import { useEffect, useRef, useState } from 'react'

export default function SpacePilotGame({ destination = 'Earth', onExit }) {
  const canvasRef = useRef(null)
  const gameRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [difficulty, setDifficulty] = useState('Easy')
  const [score, setScore] = useState(0)
  const [credits, setCredits] = useState(
    Number(localStorage.getItem('orbitCredits') || 0)
  )
  const [fuel, setFuel] = useState(100)
  const [lives, setLives] = useState(3)
  const [result, setResult] = useState('')

  // GAME DRAWING
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    let animationId

    const draw = () => {
      ctx.fillStyle = '#020617'
      ctx.fillRect(0, 0, width, height)

      for (let i = 0; i < 70; i++) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect((i * 137) % width, (i * 83) % height, 2, 2)
      }

      const state = gameRef.current

      if (state) {
        ctx.font = '30px Arial'
        ctx.fillText('🚀', state.x - 15, state.y + 10)

        state.fuels.forEach(item => {
          ctx.font = '23px Arial'
          ctx.fillText('💎', item.x, item.y)
        })

        state.asteroids.forEach(item => {
          ctx.font = '27px Arial'
          ctx.fillText('☄️', item.x, item.y)
        })
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationId)
  }, [])

  function startGame() {
    gameRef.current = {
      x: 350,
      y: 350,
      score: 0,
      fuel: 100,
      lives: 3,
      fuels: [],
      asteroids: [],
      running: true,
      time: 0
    }

    setScore(0)
    setFuel(100)
    setLives(3)
    setResult('')
    setPlaying(true)
  }

  // WIN REWARD
  function finish(message) {
    const state = gameRef.current
    if (!state || !state.running) return

    state.running = false
    setPlaying(false)
    setResult(message)

    if (message === 'MISSION SUCCESS') {
      setCredits(prev => {
        const updated = prev + 100
        localStorage.setItem('orbitCredits', updated)
        return updated
      })
    }
  }

  // GAME LOOP
  useEffect(() => {
    if (!playing) return

    const state = gameRef.current
    const canvas = canvasRef.current
    if (!state || !canvas) return

    let frame
    let lastTime = performance.now()

    const difficultySpeed = {
      Easy: 2,
      Medium: 3.5,
      Hard: 5
    }

    const speed = difficultySpeed[difficulty]

    function update() {
      if (!state.running) return

      const now = performance.now()
      const delta = Math.min((now - lastTime) / 16, 2)
      lastTime = now

      state.time += delta

      if (Math.random() < 0.025) {
        state.fuels.push({
          x: Math.random() * 680 + 10,
          y: -20
        })
      }

      if (Math.random() < 0.035) {
        state.asteroids.push({
          x: Math.random() * 680 + 10,
          y: -20
        })
      }

      state.fuels.forEach(item => {
        item.y += speed * delta
      })

      state.asteroids.forEach(item => {
        item.y += (speed + 2) * delta
      })

      state.fuels = state.fuels.filter(item => {
        const hit =
          Math.abs(item.x - state.x) < 30 &&
          Math.abs(item.y - state.y) < 30

        if (hit) {
          state.score += 10
          state.fuel = Math.min(100, state.fuel + 15)
          setScore(state.score)
          setFuel(state.fuel)
        }

        return !hit && item.y < 730
      })

      state.asteroids = state.asteroids.filter(item => {
        const hit =
          Math.abs(item.x - state.x) < 30 &&
          Math.abs(item.y - state.y) < 30

        if (hit) {
          state.lives -= 1
          state.fuel = Math.max(0, state.fuel - 15)

          setLives(state.lives)
          setFuel(state.fuel)

          if (state.lives <= 0) {
            finish('MISSION FAILED')
          }
        }

        return !hit && item.y < 730
      })

      if (state.score >= 100) {
        finish('MISSION SUCCESS')
        return
      }

      if (state.time >= 3600) {
        finish(state.score >= 50 ? 'MISSION SUCCESS' : 'MISSION FAILED')
        return
      }

      frame = requestAnimationFrame(update)
    }

    frame = requestAnimationFrame(update)

    return () => cancelAnimationFrame(frame)
  }, [playing, difficulty])

  // MOVEMENT
  function move(direction) {
    const state = gameRef.current
    if (!state || !state.running) return

    const movement = 30

    if (direction === 'left') state.x -= movement
    if (direction === 'right') state.x += movement
    if (direction === 'up') state.y -= movement
    if (direction === 'down') state.y += movement

    state.x = Math.max(20, Math.min(680, state.x))
    state.y = Math.max(30, Math.min(680, state.y))
  }

  function boost() {
    const state = gameRef.current
    if (!state || !state.running || state.fuel <= 0) return

    state.fuel = Math.max(0, state.fuel - 10)
    state.y = Math.max(30, state.y - 60)
    setFuel(state.fuel)
  }

  return (
    <div style={{
      background: '#020617',
      color: '#e2e8f0',
      padding: 20,
      borderRadius: 16,
      textAlign: 'center'
    }}>
      <h1>🚀 Space Pilot Game</h1>

      <p>Destination: {destination}</p>

      <h3 style={{ color: '#facc15' }}>
        🏆 Space Credits: {credits}
      </h3>

      <p>Collect 💎 crystals and avoid ☄️ asteroids. Collect 100 points to win!</p>

      <canvas
        ref={canvasRef}
        width={700}
        height={700}
        style={{
          width: '100%',
          maxWidth: 700,
          border: '2px solid #38bdf8',
          borderRadius: 12,
          background: '#020617'
        }}
      />

      {!playing && (
        <div style={{ marginTop: 15 }}>
          <label>Difficulty: </label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            style={{ padding: 8, borderRadius: 6 }}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 20,
        flexWrap: 'wrap',
        marginTop: 15
      }}>
        <span>⭐ Score: {score}</span>
        <span>⛽ Fuel: {fuel}%</span>
        <span>❤️ Lives: {lives}</span>
      </div>

      {!playing && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{
            color: result === 'MISSION SUCCESS' ? '#22c55e' : '#facc15'
          }}>
            {result || 'Ready for launch?'}
          </h2>

          {result === 'MISSION SUCCESS' && (
            <div style={{
              background: '#422006',
              border: '2px solid #facc15',
              padding: 20,
              borderRadius: 12,
              margin: '15px auto',
              maxWidth: 350
            }}>
              <h1>🏆 YOU WON!</h1>
              <h2 style={{ color: '#facc15' }}>🥇 GOLD MEDAL</h2>
              <h2>+100 SPACE CREDITS</h2>
              <p>Excellent piloting! Mission completed successfully.</p>
              <p>🎉 Reward saved permanently!</p>
            </div>
          )}

          {result === 'MISSION FAILED' && (
            <h3>💥 Try again, Space Pilot!</h3>
          )}

          <button
            onClick={startGame}
            style={{
              padding: '12px 25px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16
            }}
          >
            {result ? '🔁 Play Again' : '🚀 Start Game'}
          </button>
        </div>
      )}

      {playing && (
        <div style={{ marginTop: 20 }}>
          <div>
            <button onClick={() => move('up')}>⬆️</button>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 15,
            margin: 8
          }}>
            <button onClick={() => move('left')}>⬅️</button>
            <button onClick={() => move('down')}>⬇️</button>
            <button onClick={() => move('right')}>➡️</button>
          </div>

          <button
            onClick={boost}
            style={{
              padding: 10,
              background: '#ea580c',
              color: 'white',
              border: 'none',
              borderRadius: 8
            }}
          >
            ⚡ BOOST
          </button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={onExit}
          style={{
            padding: '10px 16px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Exit Game
        </button>
      </div>
    </div>
  )
}
