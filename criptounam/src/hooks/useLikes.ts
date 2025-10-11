// Hook personalizado para manejo de likes
import { useState, useEffect, useCallback } from 'react'

export interface UseLikesReturn {
  likes: number
  isLiked: boolean
  isLoading: boolean
  error: string | null
  addLike: () => Promise<void>
  removeLike: () => Promise<void>
  toggleLike: () => Promise<void>
}

export const useLikes = (newsletterId: string, userId?: string): UseLikesReturn => {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar estado inicial de likes
  useEffect(() => {
    const loadLikes = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/likes/${newsletterId}`)
        if (response.ok) {
          const data = await response.json()
          setLikes(data.totalLikes)
          setIsLiked(data.isLikedByUser)
        }
      } catch (err) {
        console.error('Error cargando likes:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (newsletterId) {
      loadLikes()
    }
  }, [newsletterId])

  const addLike = useCallback(async () => {
    if (!userId) {
      setError('Debes estar autenticado para dar like')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newsletterId
        })
      })

      if (response.ok) {
        setLikes(prev => prev + 1)
        setIsLiked(true)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al dar like')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }, [userId, newsletterId])

  const removeLike = useCallback(async () => {
    if (!userId) {
      setError('Debes estar autenticado para quitar like')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/likes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newsletterId
        })
      })

      if (response.ok) {
        setLikes(prev => Math.max(0, prev - 1))
        setIsLiked(false)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al quitar like')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }, [userId, newsletterId])

  const toggleLike = useCallback(async () => {
    if (isLiked) {
      await removeLike()
    } else {
      await addLike()
    }
  }, [isLiked, addLike, removeLike])

  // Limpiar error después de un tiempo
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [error])

  return {
    likes,
    isLiked,
    isLoading,
    error,
    addLike,
    removeLike,
    toggleLike
  }
}
