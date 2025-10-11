// Hook personalizado para manejo de tokens PUMA
import { useState, useEffect, useCallback } from 'react'

export interface UsePumaReturn {
  balance: number
  totalEarned: number
  totalSpent: number
  level: number
  badges: string[]
  experiencePoints: number
  isLoading: boolean
  error: string | null
  addReward: (amount: number, reason: string, category: string) => Promise<boolean>
  spendTokens: (amount: number, description: string) => Promise<boolean>
  getTransactionHistory: () => Promise<any[]>
  getLeaderboard: () => Promise<any[]>
  completeMission: (missionId: string) => Promise<boolean>
  getAvailableMissions: () => Promise<any[]>
}

export const usePuma = (userId?: string): UsePumaReturn => {
  const [balance, setBalance] = useState(0)
  const [totalEarned, setTotalEarned] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [level, setLevel] = useState(1)
  const [badges, setBadges] = useState<string[]>([])
  const [experiencePoints, setExperiencePoints] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/puma/user/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setBalance(data.balance)
          setTotalEarned(data.totalEarned)
          setTotalSpent(data.totalSpent)
          setLevel(data.level)
          setBadges(data.badges || [])
          setExperiencePoints(data.experiencePoints || 0)
        }
      } catch (err) {
        console.error('Error cargando datos PUMA:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [userId])

  const addReward = useCallback(async (
    amount: number, 
    reason: string, 
    category: string
  ): Promise<boolean> => {
    if (!userId) {
      setError('Debes estar autenticado')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/puma/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          reason,
          category
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBalance(data.newBalance)
        setTotalEarned(prev => prev + amount)
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al agregar recompensa')
        return false
      }
    } catch (err) {
      setError('Error de conexión')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const spendTokens = useCallback(async (
    amount: number, 
    description: string
  ): Promise<boolean> => {
    if (!userId) {
      setError('Debes estar autenticado')
      return false
    }

    if (amount > balance) {
      setError('Saldo insuficiente')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/puma/spend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          amount,
          description
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBalance(data.newBalance)
        setTotalSpent(prev => prev + amount)
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al gastar tokens')
        return false
      }
    } catch (err) {
      setError('Error de conexión')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userId, balance])

  const getTransactionHistory = useCallback(async (): Promise<any[]> => {
    if (!userId) return []

    try {
      const response = await fetch(`/api/puma/transactions/${userId}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (err) {
      console.error('Error cargando historial:', err)
    }
    return []
  }, [userId])

  const getLeaderboard = useCallback(async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/puma/leaderboard')
      if (response.ok) {
        return await response.json()
      }
    } catch (err) {
      console.error('Error cargando leaderboard:', err)
    }
    return []
  }, [])

  const completeMission = useCallback(async (missionId: string): Promise<boolean> => {
    if (!userId) {
      setError('Debes estar autenticado')
      return false
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/puma/missions/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          missionId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setBalance(data.newBalance)
        setTotalEarned(prev => prev + data.reward)
        return true
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Error al completar misión')
        return false
      }
    } catch (err) {
      setError('Error de conexión')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const getAvailableMissions = useCallback(async (): Promise<any[]> => {
    try {
      const response = await fetch('/api/puma/missions')
      if (response.ok) {
        return await response.json()
      }
    } catch (err) {
      console.error('Error cargando misiones:', err)
    }
    return []
  }, [])

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
    balance,
    totalEarned,
    totalSpent,
    level,
    badges,
    experiencePoints,
    isLoading,
    error,
    addReward,
    spendTokens,
    getTransactionHistory,
    getLeaderboard,
    completeMission,
    getAvailableMissions
  }
}
