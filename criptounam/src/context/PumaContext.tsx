// Contexto para manejo de estado de tokens PUMA
import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface PumaState {
  balance: number
  totalEarned: number
  totalSpent: number
  level: number
  badges: string[]
  transactions: any[]
  missions: any[]
  leaderboard: any[]
  isLoading: boolean
  error: string | null
}

interface PumaAction {
  type: 'SET_LOADING' | 'SET_ERROR' | 'SET_BALANCE' | 'SET_LEVEL' | 'SET_BADGES' | 'SET_TRANSACTIONS' | 'SET_MISSIONS' | 'SET_LEADERBOARD' | 'ADD_TRANSACTION' | 'UPDATE_BALANCE' | 'CLEAR_ERROR'
  payload?: any
}

const initialState: PumaState = {
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  level: 1,
  badges: [],
  transactions: [],
  missions: [],
  leaderboard: [],
  isLoading: false,
  error: null
}

const pumaReducer = (state: PumaState, action: PumaAction): PumaState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_BALANCE':
      return { ...state, balance: action.payload }
    case 'SET_LEVEL':
      return { ...state, level: action.payload }
    case 'SET_BADGES':
      return { ...state, badges: action.payload }
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload }
    case 'SET_MISSIONS':
      return { ...state, missions: action.payload }
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload }
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] }
    case 'UPDATE_BALANCE':
      return { 
        ...state, 
        balance: action.payload.balance,
        totalEarned: action.payload.totalEarned,
        totalSpent: action.payload.totalSpent
      }
    default:
      return state
  }
}

interface PumaContextType {
  state: PumaState
  dispatch: React.Dispatch<PumaAction>
  addReward: (amount: number, reason: string, category: string) => Promise<boolean>
  spendTokens: (amount: number, description: string) => Promise<boolean>
  completeMission: (missionId: string) => Promise<boolean>
  getTransactionHistory: () => Promise<any[]>
  getLeaderboard: () => Promise<any[]>
  getAvailableMissions: () => Promise<any[]>
  getUserLevel: () => number
  getUserBadges: () => string[]
}

const PumaContext = createContext<PumaContextType | undefined>(undefined)

export const PumaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pumaReducer, initialState)

  const addReward = async (amount: number, reason: string, category: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/puma/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, reason, category })
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'UPDATE_BALANCE', payload: data })
        dispatch({ type: 'ADD_TRANSACTION', payload: data.transaction })
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

  const spendTokens = async (amount: number, description: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/puma/spend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description })
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'UPDATE_BALANCE', payload: data })
        dispatch({ type: 'ADD_TRANSACTION', payload: data.transaction })
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

  const completeMission = async (missionId: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/puma/missions/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ missionId })
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'UPDATE_BALANCE', payload: data })
        dispatch({ type: 'ADD_TRANSACTION', payload: data.transaction })
        if (data.newBadge) {
          dispatch({ type: 'SET_BADGES', payload: [...state.badges, data.newBadge] })
        }
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

  const getTransactionHistory = async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/puma/transactions')
      if (response.ok) {
        const transactions = await response.json()
        dispatch({ type: 'SET_TRANSACTIONS', payload: transactions })
        return transactions
      }
      return []
    } catch (err) {
      console.error('Error obteniendo transacciones:', err)
      return []
    }
  }

  const getLeaderboard = async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/puma/leaderboard')
      if (response.ok) {
        const leaderboard = await response.json()
        dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard })
        return leaderboard
      }
      return []
    } catch (err) {
      console.error('Error obteniendo leaderboard:', err)
      return []
    }
  }

  const getAvailableMissions = async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/puma/missions')
      if (response.ok) {
        const missions = await response.json()
        dispatch({ type: 'SET_MISSIONS', payload: missions })
        return missions
      }
      return []
    } catch (err) {
      console.error('Error obteniendo misiones:', err)
      return []
    }
  }

  const getUserLevel = (): number => {
    return state.level
  }

  const getUserBadges = (): string[] => {
    return state.badges
  }

  return (
    <PumaContext.Provider value={{
      state,
      dispatch,
      addReward,
      spendTokens,
      completeMission,
      getTransactionHistory,
      getLeaderboard,
      getAvailableMissions,
      getUserLevel,
      getUserBadges
    }}>
      {children}
    </PumaContext.Provider>
  )
}

export const usePumaContext = (): PumaContextType => {
  const context = useContext(PumaContext)
  if (!context) {
    throw new Error('usePumaContext debe ser usado dentro de PumaProvider')
  }
  return context
}
