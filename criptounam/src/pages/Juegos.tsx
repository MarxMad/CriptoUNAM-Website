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
  faCoins
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
    const gameCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5)
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

const Juegos = () => {
  const [activeGame, setActiveGame] = useState<string>('memory')

  const games = [
    {
      id: 'memory',
      name: 'Memoria',
      icon: faBrain,
      description: 'Encuentra las parejas de símbolos'
    },
    {
      id: 'guessing',
      name: 'Adivinanza',
      icon: faDice,
      description: 'Adivina el número correcto'
    },
    {
      id: 'reaction',
      name: 'Reacción',
      icon: faRocket,
      description: 'Pon a prueba tus reflejos'
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
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <FontAwesomeIcon 
              icon={faGamepad} 
              style={{ 
                fontSize: '4rem', 
                color: '#D4AF37', 
                marginBottom: '1rem' 
              }} 
            />
            <h1 style={{ 
              color: '#D4AF37', 
              fontSize: '3rem', 
              margin: '0 0 1rem 0',
              fontFamily: 'Orbitron',
              fontWeight: 'bold'
            }}>
              Zona de Juegos
            </h1>
            <p style={{ 
              color: '#fff', 
              fontSize: '1.2rem', 
              margin: '0',
              opacity: 0.9
            }}>
              Diviértete con nuestros minijuegos interactivos
            </p>
          </div>

          {/* Selector de juegos */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
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
                  borderRadius: '12px',
                  padding: '1rem 2rem',
                  color: activeGame === game.id ? '#000' : '#D4AF37',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '150px'
                }}
              >
                <FontAwesomeIcon icon={game.icon} style={{ fontSize: '1.5rem' }} />
                <span style={{ fontWeight: 'bold' }}>{game.name}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{game.description}</span>
              </button>
            ))}
          </div>

          {/* Juego activo */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {activeGame === 'memory' && <MemoryGame />}
            {activeGame === 'guessing' && <NumberGuessingGame />}
            {activeGame === 'reaction' && <ReactionGame />}
          </div>

          {/* Estadísticas */}
          <div style={{
            marginTop: '3rem',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            textAlign: 'center'
          }}>
            <FontAwesomeIcon icon={faTrophy} style={{ fontSize: '2rem', color: '#D4AF37', marginBottom: '1rem' }} />
            <h3 style={{ color: '#D4AF37', margin: '0 0 1rem 0' }}>¡Sigue jugando!</h3>
            <p style={{ color: '#fff', margin: '0' }}>
              Completa todos los juegos y mejora tus habilidades. ¡La diversión no tiene límites!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Juegos
