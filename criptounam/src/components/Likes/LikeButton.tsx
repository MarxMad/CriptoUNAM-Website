// Componente de botón de like
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons'
import { useLikesContext } from '../../context/LikesContext'

interface LikeButtonProps {
  newsletterId: string
  initialLikes?: number
  initialIsLiked?: boolean
  showCount?: boolean
  size?: 'small' | 'medium' | 'large'
  onLike?: () => void
  onUnlike?: () => void
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  newsletterId,
  initialLikes = 0,
  initialIsLiked = false,
  showCount = true,
  size = 'medium',
  onLike,
  onUnlike
}) => {
  const { state, toggleLike, isLiked, getLikeCount } = useLikesContext()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const currentLikes = getLikeCount(newsletterId) || initialLikes
  const currentIsLiked = isLiked(newsletterId) || initialIsLiked

  const handleLike = async () => {
    if (state.isLoading) return

    setIsAnimating(true)
    const success = await toggleLike(newsletterId)
    
    if (success) {
      if (currentIsLiked) {
        onUnlike?.()
      } else {
        onLike?.()
      }
    }

    setTimeout(() => setIsAnimating(false), 300)
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          button: 'like-button-small',
          icon: '1rem',
          count: '0.8rem'
        }
      case 'large':
        return {
          button: 'like-button-large',
          icon: '1.5rem',
          count: '1.2rem'
        }
      default:
        return {
          button: 'like-button-medium',
          icon: '1.2rem',
          count: '1rem'
        }
    }
  }

  const sizeStyles = getSizeStyles()

  return (
    <div className="like-button-container">
      <button
        className={`like-button ${sizeStyles.button} ${currentIsLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleLike}
        disabled={state.isLoading}
        title={currentIsLiked ? 'Quitar like' : 'Dar like'}
      >
        <FontAwesomeIcon 
          icon={currentIsLiked ? faHeart : faHeartBroken}
          style={{ fontSize: sizeStyles.icon }}
        />
        {showCount && (
          <span className="like-count" style={{ fontSize: sizeStyles.count }}>
            {currentLikes}
          </span>
        )}
      </button>

      {state.error && (
        <div className="like-error">
          {state.error}
        </div>
      )}

        <style>{`
        .like-button-container {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .like-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(26, 26, 26, 0.8);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          padding: 8px 12px;
          color: #E0E0E0;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .like-button:hover:not(:disabled) {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .like-button.liked {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-color: #ef4444;
          color: #fff;
        }

        .like-button.liked:hover:not(:disabled) {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          transform: translateY(-2px);
        }

        .like-button.animating {
          transform: scale(1.1);
        }

        .like-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .like-button-small {
          padding: 6px 10px;
          font-size: 0.8rem;
        }

        .like-button-medium {
          padding: 8px 12px;
          font-size: 1rem;
        }

        .like-button-large {
          padding: 12px 16px;
          font-size: 1.2rem;
        }

        .like-count {
          font-weight: bold;
          color: inherit;
        }

        .like-error {
          color: #ef4444;
          font-size: 0.8rem;
          text-align: center;
          background: rgba(239, 68, 68, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .like-button.animating {
          animation: pulse 0.3s ease;
        }
      `}</style>
    </div>
  )
}
