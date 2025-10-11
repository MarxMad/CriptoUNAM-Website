// Contexto para manejo de estado de likes
import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface LikesState {
  userLikes: string[]
  newsletterStats: Record<string, any>
  trendingNewsletters: any[]
  isLoading: boolean
  error: string | null
}

interface LikesAction {
  type: 'SET_LOADING' | 'SET_ERROR' | 'SET_USER_LIKES' | 'SET_NEWSLETTER_STATS' | 'SET_TRENDING' | 'ADD_LIKE' | 'REMOVE_LIKE' | 'CLEAR_ERROR'
  payload?: any
}

const initialState: LikesState = {
  userLikes: [],
  newsletterStats: {},
  trendingNewsletters: [],
  isLoading: false,
  error: null
}

const likesReducer = (state: LikesState, action: LikesAction): LikesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_USER_LIKES':
      return { ...state, userLikes: action.payload }
    case 'SET_NEWSLETTER_STATS':
      return { ...state, newsletterStats: action.payload }
    case 'SET_TRENDING':
      return { ...state, trendingNewsletters: action.payload }
    case 'ADD_LIKE':
      return { 
        ...state, 
        userLikes: [...state.userLikes, action.payload],
        newsletterStats: {
          ...state.newsletterStats,
          [action.payload]: {
            ...state.newsletterStats[action.payload],
            totalLikes: (state.newsletterStats[action.payload]?.totalLikes || 0) + 1
          }
        }
      }
    case 'REMOVE_LIKE':
      return { 
        ...state, 
        userLikes: state.userLikes.filter(id => id !== action.payload),
        newsletterStats: {
          ...state.newsletterStats,
          [action.payload]: {
            ...state.newsletterStats[action.payload],
            totalLikes: Math.max(0, (state.newsletterStats[action.payload]?.totalLikes || 0) - 1)
          }
        }
      }
    default:
      return state
  }
}

interface LikesContextType {
  state: LikesState
  dispatch: React.Dispatch<LikesAction>
  addLike: (newsletterId: string) => Promise<boolean>
  removeLike: (newsletterId: string) => Promise<boolean>
  toggleLike: (newsletterId: string) => Promise<boolean>
  isLiked: (newsletterId: string) => boolean
  getLikeCount: (newsletterId: string) => number
  getTrendingNewsletters: () => Promise<any[]>
  getUserLikeHistory: () => Promise<any>
}

const LikesContext = createContext<LikesContextType | undefined>(undefined)

export const LikesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(likesReducer, initialState)

  const addLike = async (newsletterId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterId })
      })

      if (response.ok) {
        dispatch({ type: 'ADD_LIKE', payload: newsletterId })
        return true
      } else {
        const error = await response.json()
        dispatch({ type: 'SET_ERROR', payload: error.message })
        return false
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeLike = async (newsletterId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/likes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletterId })
      })

      if (response.ok) {
        dispatch({ type: 'REMOVE_LIKE', payload: newsletterId })
        return true
      } else {
        const error = await response.json()
        dispatch({ type: 'SET_ERROR', payload: error.message })
        return false
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const toggleLike = async (newsletterId: string): Promise<boolean> => {
    if (state.userLikes.includes(newsletterId)) {
      return await removeLike(newsletterId)
    } else {
      return await addLike(newsletterId)
    }
  }

  const isLiked = (newsletterId: string): boolean => {
    return state.userLikes.includes(newsletterId)
  }

  const getLikeCount = (newsletterId: string): number => {
    return state.newsletterStats[newsletterId]?.totalLikes || 0
  }

  const getTrendingNewsletters = async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/likes/trending')
      if (response.ok) {
        const trending = await response.json()
        dispatch({ type: 'SET_TRENDING', payload: trending })
        return trending
      }
      return []
    } catch (err) {
      console.error('Error obteniendo trending:', err)
      return []
    }
  }

  const getUserLikeHistory = async (): Promise<any> => {
    try {
      const response = await fetch('/api/likes/history')
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (err) {
      console.error('Error obteniendo historial:', err)
      return null
    }
  }

  return (
    <LikesContext.Provider value={{
      state,
      dispatch,
      addLike,
      removeLike,
      toggleLike,
      isLiked,
      getLikeCount,
      getTrendingNewsletters,
      getUserLikeHistory
    }}>
      {children}
    </LikesContext.Provider>
  )
}

export const useLikesContext = (): LikesContextType => {
  const context = useContext(LikesContext)
  if (!context) {
    throw new Error('useLikesContext debe ser usado dentro de LikesProvider')
  }
  return context
}
