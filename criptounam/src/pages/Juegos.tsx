import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGamepad, 
  faTrophy, 
  faPlay, 
  faPause, 
  faRedo,
  faDice,
  faBrain,
  faRocket,
  faCoins,
  faGamepad2
} from '@fortawesome/free-solid-svg-icons'

// Componente del juego de memoria
const MemoryGame = () => {
  const [cards, setCards] = useState<number[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedCards, setMatchedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const symbols = ['🎯', '🚀', '💎', '⚡', '🔥', '🌟', '🎮', '🏆']

  const initializeGame = () => {
    const gameCards = [...symbols, ...symbols].map((_, index) => index).sort(() => Math.random() - 0.5)
    setCards(gameCards)
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setGameComplete(false)
    setGameStarted(true)
  }

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return
    }

    const newFlippedCards = [...flippedCards, index]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlippedCards
      
      if (cards[first] === cards[second]) {
        setMatchedCards([...matchedCards, first, second])
        setFlippedCards([])
        
        if (matchedCards.length + 2 === cards.length) {
          setGameComplete(true)
        }
      } else {
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '16px',
      padding: '2rem',
      border: '2px solid #D4AF37',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FontAwesomeIcon icon={faBrain} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }} />
        <h3 style={{ color: '#D4AF37', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Juego de Memoria</h3>
        <p style={{ color: '#fff', margin: '0 0 1rem 0' }}>Encuentra las parejas de símbolos</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Movimientos: {moves}</span>
          <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Parejas: {matchedCards.length / 2}</span>
        </div>
        <button
          onClick={initializeGame}
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {gameStarted ? 'Reiniciar' : 'Comenzar'}
        </button>
      </div>

      {gameComplete && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          color: '#000',
          padding: '2rem',
          borderRadius: '16px',
          textAlign: 'center',
          zIndex: 1000,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '3rem', marginBottom: '1rem' }} />
          <h2 style={{ margin: '0 0 1rem 0' }}>¡Felicidades!</h2>
          <p style={{ margin: '0 0 1rem 0' }}>Completaste el juego en {moves} movimientos</p>
          <button
            onClick={initializeGame}
            style={{
              background: '#000',
              color: '#D4AF37',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Jugar de nuevo
          </button>
        </div>
      )}

      {gameStarted && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(index)}
              style={{
                aspectRatio: '1',
                background: flippedCards.includes(index) || matchedCards.includes(index)
                  ? 'linear-gradient(135deg, #D4AF37, #FFD700)'
                  : 'linear-gradient(135deg, #2a2a3e, #3a3a4e)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '2rem',
                color: flippedCards.includes(index) || matchedCards.includes(index) ? '#000' : '#D4AF37',
                border: '2px solid #D4AF37',
                transition: 'all 0.3s ease',
                transform: flippedCards.includes(index) || matchedCards.includes(index) ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {flippedCards.includes(index) || matchedCards.includes(index) ? card : '?'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente del juego de adivinanza de números
const NumberGuessingGame = () => {
  const [number, setNumber] = useState<number>(0)
  const [guess, setGuess] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [attempts, setAttempts] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameWon, setGameWon] = useState(false)

  const startGame = () => {
    const randomNumber = Math.floor(Math.random() * 100) + 1
    setNumber(randomNumber)
    setGuess('')
    setMessage('')
    setAttempts(0)
    setGameStarted(true)
    setGameWon(false)
  }

  const handleGuess = () => {
    const guessNum = parseInt(guess)
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      setMessage('Por favor, ingresa un número entre 1 y 100')
      return
    }

    setAttempts(attempts + 1)

    if (guessNum === number) {
      setMessage('¡Correcto! ¡Has ganado!')
      setGameWon(true)
    } else if (guessNum < number) {
      setMessage('El número es mayor')
    } else {
      setMessage('El número es menor')
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '16px',
      padding: '2rem',
      border: '2px solid #D4AF37',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FontAwesomeIcon icon={faDice} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }} />
        <h3 style={{ color: '#D4AF37', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Adivina el Número</h3>
        <p style={{ color: '#fff', margin: '0 0 1rem 0' }}>Adivina un número entre 1 y 100</p>
        {gameStarted && (
          <p style={{ color: '#D4AF37', margin: '0 0 1rem 0', fontWeight: 'bold' }}>
            Intentos: {attempts}
          </p>
        )}
        <button
          onClick={startGame}
          style={{
            background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            color: '#000',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {gameStarted ? 'Nuevo Juego' : 'Comenzar'}
        </button>
      </div>

      {gameStarted && !gameWon && (
        <div style={{ textAlign: 'center' }}>
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Ingresa tu número"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #D4AF37',
              background: '#2a2a3e',
              color: '#fff',
              fontSize: '1rem',
              marginRight: '1rem',
              width: '200px'
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
          />
          <button
            onClick={handleGuess}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Adivinar
          </button>
        </div>
      )}

      {message && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          padding: '1rem',
          background: gameWon ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 175, 55, 0.2)',
          borderRadius: '8px',
          border: `1px solid ${gameWon ? '#22c55e' : '#D4AF37'}`,
          color: gameWon ? '#22c55e' : '#D4AF37',
          fontWeight: 'bold'
        }}>
          {message}
        </div>
      )}
    </div>
  )
}

// Componente del juego de reacción
const ReactionGame = () => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'go' | 'too-early' | 'finished'>('waiting')
  const [startTime, setStartTime] = useState<number>(0)
  const [reactionTime, setReactionTime] = useState<number>(0)
  const [bestTime, setBestTime] = useState<number>(0)

  const startGame = () => {
    setGameState('waiting')
    setReactionTime(0)
    
    // Esperar un tiempo aleatorio entre 1-5 segundos
    const waitTime = Math.random() * 4000 + 1000
    setTimeout(() => {
      setGameState('ready')
      setTimeout(() => {
        setGameState('go')
        setStartTime(Date.now())
      }, 100)
    }, waitTime)
  }

  const handleClick = () => {
    if (gameState === 'go') {
      const time = Date.now() - startTime
      setReactionTime(time)
      setGameState('finished')
      
      if (bestTime === 0 || time < bestTime) {
        setBestTime(time)
      }
    } else if (gameState === 'waiting' || gameState === 'ready') {
      setGameState('too-early')
      setTimeout(() => {
        setGameState('waiting')
      }, 1000)
    }
  }

  const getButtonStyle = () => {
    const baseStyle = {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      margin: '0 auto',
      display: 'block'
    }

    switch (gameState) {
      case 'waiting':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #2a2a3e, #3a3a4e)',
          color: '#D4AF37'
        }
      case 'ready':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          color: '#000'
        }
      case 'go':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
          color: '#fff'
        }
      case 'too-early':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: '#fff'
        }
      case 'finished':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
          color: '#000'
        }
      default:
        return baseStyle
    }
  }

  const getButtonText = () => {
    switch (gameState) {
      case 'waiting':
        return 'Espera...'
      case 'ready':
        return '¡AHORA!'
      case 'go':
        return '¡CLICK!'
      case 'too-early':
        return 'Muy temprano'
      case 'finished':
        return 'Jugar de nuevo'
      default:
        return 'Comenzar'
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '16px',
      padding: '2rem',
      border: '2px solid #D4AF37',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FontAwesomeIcon icon={faRocket} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }} />
        <h3 style={{ color: '#D4AF37', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Juego de Reacción</h3>
        <p style={{ color: '#fff', margin: '0 0 1rem 0' }}>Haz click cuando el botón se ponga verde</p>
        
        {reactionTime > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.2rem' }}>
              Tiempo de reacción: {reactionTime}ms
            </p>
            {bestTime > 0 && (
              <p style={{ color: '#22c55e', fontWeight: 'bold' }}>
                Mejor tiempo: {bestTime}ms
              </p>
            )}
          </div>
        )}
      </div>

      <button
        onClick={gameState === 'finished' ? startGame : handleClick}
        style={getButtonStyle()}
      >
        {getButtonText()}
      </button>

      {gameState === 'waiting' && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Comenzar
          </button>
        </div>
      )}
    </div>
  )
}

// Componente del juego de Serpiente (Snake)
const SnakeGame = () => {
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameOver'>('waiting')
  const [snake, setSnake] = useState<{x: number, y: number}[]>([{x: 10, y: 10}])
  const [direction, setDirection] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [food, setFood] = useState<{x: number, y: number}>({x: 15, y: 15})
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameSpeed, setGameSpeed] = useState(150)

  const BOARD_SIZE = 20

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE)
    }
    setFood(newFood)
  }

  const startGame = () => {
    setSnake([{x: 10, y: 10}])
    setDirection({x: 0, y: 0})
    setScore(0)
    setGameState('playing')
    generateFood()
  }

  const endGame = () => {
    setGameState('gameOver')
    if (score > highScore) {
      setHighScore(score)
    }
  }

  const moveSnake = () => {
    if (gameState !== 'playing') return

    setSnake(prevSnake => {
      const newSnake = [...prevSnake]
      const head = { ...newSnake[0] }
      
      head.x += direction.x
      head.y += direction.y

      // Verificar colisiones con bordes
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        endGame()
        return prevSnake
      }

      // Verificar colisión consigo misma
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame()
        return prevSnake
      }

      newSnake.unshift(head)

      // Verificar si comió la comida
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10)
        generateFood()
        // Aumentar velocidad gradualmente
        if (score > 0 && score % 50 === 0) {
          setGameSpeed(prev => Math.max(80, prev - 10))
        }
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }

  useEffect(() => {
    if (gameState === 'playing') {
      const interval = setInterval(moveSnake, gameSpeed)
      return () => clearInterval(interval)
    }
  }, [gameState, direction, food, score, gameSpeed])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({x: 0, y: -1})
          break
        case 'ArrowDown':
          if (direction.y === 0) setDirection({x: 0, y: 1})
          break
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({x: -1, y: 0})
          break
        case 'ArrowRight':
          if (direction.x === 0) setDirection({x: 1, y: 0})
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, direction])

  const getDirectionButtons = () => {
    const buttonStyle = {
      background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 12px',
      color: '#000',
      fontWeight: 'bold',
      cursor: 'pointer',
      fontSize: '1rem',
      margin: '2px'
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => direction.y === 0 && setDirection({x: 0, y: -1})}
          style={buttonStyle}
        >
          ↑
        </button>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => direction.x === 0 && setDirection({x: -1, y: 0})}
            style={buttonStyle}
          >
            ←
          </button>
          <button
            onClick={() => direction.x === 0 && setDirection({x: 1, y: 0})}
            style={buttonStyle}
          >
            →
          </button>
        </div>
        <button
          onClick={() => direction.y === 0 && setDirection({x: 0, y: 1})}
          style={buttonStyle}
        >
          ↓
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '16px',
      padding: '2rem',
      border: '2px solid #D4AF37',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <FontAwesomeIcon icon={faGamepad2} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }} />
        <h3 style={{ color: '#D4AF37', margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Juego de Serpiente</h3>
        <p style={{ color: '#fff', margin: '0 0 1rem 0' }}>Usa las flechas para controlar la serpiente</p>
        
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Puntuación: {score}</span>
          <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Mejor: {highScore}</span>
        </div>

        {gameState === 'waiting' && (
          <button
            onClick={startGame}
            style={{
              background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Comenzar
          </button>
        )}

        {gameState === 'gameOver' && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>¡Game Over!</p>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #D4AF37, #FFD700)',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#000',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'flex-start' }}>
          {/* Tablero de juego */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 15px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 15px)`,
            gap: '1px',
            background: '#2a2a3e',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #D4AF37'
          }}>
            {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
              const x = index % BOARD_SIZE
              const y = Math.floor(index / BOARD_SIZE)
              const isSnake = snake.some(segment => segment.x === x && segment.y === y)
              const isFood = food.x === x && food.y === y
              
              return (
                <div
                  key={index}
                  style={{
                    width: '15px',
                    height: '15px',
                    background: isSnake 
                      ? 'linear-gradient(135deg, #D4AF37, #FFD700)' 
                      : isFood 
                        ? '#22c55e' 
                        : '#1a1a2e',
                    borderRadius: isSnake ? '50%' : isFood ? '50%' : '2px',
                    border: isSnake ? '1px solid #000' : 'none'
                  }}
                />
              )
            })}
          </div>

          {/* Controles */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{ color: '#D4AF37', margin: '0 0 1rem 0' }}>Controles</h4>
            {getDirectionButtons()}
            <p style={{ color: '#fff', fontSize: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
              También puedes usar<br/>las flechas del teclado
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const Juegos = () => {
  const [activeGame, setActiveGame] = useState<string>('memory')

  const games = [
    {
      id: 'memory',
      name: 'Memoria',
      icon: faBrain
    },
    {
      id: 'guessing',
      name: 'Adivinanza',
      icon: faDice
    },
    {
      id: 'reaction',
      name: 'Reacción',
      icon: faRocket
    },
    {
      id: 'snake',
      name: 'Serpiente',
      icon: faGamepad2
    }
  ]

  return (
    <>
      <Helmet>
        <title>Juegos - CriptoUNAM</title>
        <meta name="description" content="Diviértete con nuestros minijuegos interactivos en CriptoUNAM" />
      </Helmet>
      
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
        padding: '2rem 1rem',
        paddingTop: '6rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header simplificado */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <FontAwesomeIcon 
              icon={faGamepad} 
              style={{ 
                fontSize: '3rem', 
                color: '#D4AF37', 
                marginBottom: '1rem' 
              }} 
            />
            <h1 style={{ 
              color: '#D4AF37', 
              fontSize: '2.5rem', 
              margin: '0 0 0.5rem 0',
              fontFamily: 'Orbitron',
              fontWeight: 'bold'
            }}>
              Juegos
            </h1>
            <p style={{ 
              color: '#fff', 
              fontSize: '1rem', 
              margin: '0',
              opacity: 0.8
            }}>
              Diviértete con nuestros minijuegos
            </p>
          </div>

          {/* Selector de juegos simplificado */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id)}
                style={{
                  background: activeGame === game.id 
                    ? 'linear-gradient(135deg, #D4AF37, #FFD700)' 
                    : 'rgba(212, 175, 55, 0.1)',
                  border: `2px solid ${activeGame === game.id ? '#D4AF37' : 'rgba(212, 175, 55, 0.3)'}`,
                  borderRadius: '8px',
                  padding: '0.8rem 1.5rem',
                  color: activeGame === game.id ? '#000' : '#D4AF37',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                <FontAwesomeIcon icon={game.icon} style={{ fontSize: '1.2rem' }} />
                {game.name}
              </button>
            ))}
          </div>

          {/* Juego activo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {activeGame === 'memory' && <MemoryGame />}
            {activeGame === 'guessing' && <NumberGuessingGame />}
            {activeGame === 'reaction' && <ReactionGame />}
            {activeGame === 'snake' && <SnakeGame />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Juegos
