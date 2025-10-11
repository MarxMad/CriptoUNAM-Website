// Servicio para manejo de tokens PUMA
import { createClient } from '@supabase/supabase-js'
import { ValidationUtils } from '../utils/validation.utils'
import { ENV_CONFIG } from '../config/env'

const supabase = createClient(
  ENV_CONFIG.SUPABASE_URL,
  ENV_CONFIG.SUPABASE_ANON_KEY
)

export class PumaService {
  // Obtener balance del usuario
  static async getUserBalance(userId: string): Promise<any> {
    try {
      const { data: user, error } = await supabase
        .from('puma_users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error obteniendo balance:', error)
        return null
      }

      if (!user) {
        // Crear usuario si no existe
        const newUser = await this.createUser(userId)
        return newUser
      }

      return {
        userId: user.user_id,
        balance: user.balance || 0,
        totalEarned: user.total_earned || 0,
        totalSpent: user.total_spent || 0,
        level: user.level || 1,
        badges: user.badges || [],
        experiencePoints: user.experience_points || 0
      }
    } catch (error) {
      console.error('Error en getUserBalance:', error)
      return null
    }
  }

  // Crear usuario en sistema PUMA
  static async createUser(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('puma_users')
        .insert({
          user_id: userId,
          balance: 0,
          total_earned: 0,
          total_spent: 0,
          level: 1,
          badges: [],
          experience_points: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creando usuario:', error)
        return null
      }

      return {
        userId: data.user_id,
        balance: data.balance,
        totalEarned: data.total_earned,
        totalSpent: data.total_spent,
        level: data.level,
        badges: data.badges,
        experiencePoints: data.experience_points
      }
    } catch (error) {
      console.error('Error en createUser:', error)
      return null
    }
  }

  // Agregar recompensa
  static async addReward(userId: string, amount: number, reason: string, category: string): Promise<boolean> {
    try {
      // Validar transacción
      const transactionValidation = ValidationUtils.validatePumaTransaction({
        amount,
        type: 'earn',
        description: reason,
        category
      })

      if (!transactionValidation.isValid) {
        throw new Error(transactionValidation.error)
      }

      // Obtener usuario actual
      const user = await this.getUserBalance(userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      const newBalance = user.balance + amount
      const newTotalEarned = user.totalEarned + amount

      // Actualizar balance
      const { error: updateError } = await supabase
        .from('puma_users')
        .update({
          balance: newBalance,
          total_earned: newTotalEarned,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error actualizando balance:', updateError)
        return false
      }

      // Crear transacción
      await this.createTransaction(userId, 'earn', amount, reason, category)

      // Verificar si subió de nivel
      await this.checkLevelUp(userId, newTotalEarned)

      return true
    } catch (error) {
      console.error('Error en addReward:', error)
      return false
    }
  }

  // Gastar tokens
  static async spendTokens(userId: string, amount: number, description: string): Promise<boolean> {
    try {
      // Validar transacción
      const transactionValidation = ValidationUtils.validatePumaTransaction({
        amount,
        type: 'spend',
        description,
        category: 'purchase'
      })

      if (!transactionValidation.isValid) {
        throw new Error(transactionValidation.error)
      }

      // Obtener usuario actual
      const user = await this.getUserBalance(userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }

      if (user.balance < amount) {
        throw new Error('Saldo insuficiente')
      }

      const newBalance = user.balance - amount
      const newTotalSpent = user.totalSpent + amount

      // Actualizar balance
      const { error: updateError } = await supabase
        .from('puma_users')
        .update({
          balance: newBalance,
          total_spent: newTotalSpent,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Error actualizando balance:', updateError)
        return false
      }

      // Crear transacción
      await this.createTransaction(userId, 'spend', amount, description, 'purchase')

      return true
    } catch (error) {
      console.error('Error en spendTokens:', error)
      return false
    }
  }

  // Crear transacción
  static async createTransaction(
    userId: string, 
    type: string, 
    amount: number, 
    description: string, 
    category: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('puma_transactions')
        .insert({
          user_id: userId,
          type,
          amount,
          description,
          category,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error creando transacción:', error)
      }
    } catch (error) {
      console.error('Error en createTransaction:', error)
    }
  }

  // Obtener historial de transacciones
  static async getUserTransactions(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('puma_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error obteniendo transacciones:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error en getUserTransactions:', error)
      return []
    }
  }

  // Obtener leaderboard
  static async getLeaderboard(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('puma_users')
        .select(`
          user_id,
          total_earned,
          level,
          badges
        `)
        .order('total_earned', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error obteniendo leaderboard:', error)
        return []
      }

      // Obtener información adicional de usuarios
      const leaderboard = await Promise.all(
        (data || []).map(async (user, index) => {
          const { data: userInfo } = await supabase
            .from('users')
            .select('username, avatar')
            .eq('id', user.user_id)
            .single()

          return {
            userId: user.user_id,
            username: userInfo?.username || `Usuario${index + 1}`,
            totalEarned: user.total_earned,
            rank: index + 1,
            level: user.level,
            badges: user.badges || []
          }
        })
      )

      return leaderboard
    } catch (error) {
      console.error('Error en getLeaderboard:', error)
      return []
    }
  }

  // Completar misión
  static async completeMission(userId: string, missionId: string): Promise<any> {
    try {
      // Obtener misión
      const { data: mission, error: missionError } = await supabase
        .from('puma_missions')
        .select('*')
        .eq('id', missionId)
        .single()

      if (missionError || !mission) {
        throw new Error('Misión no encontrada')
      }

      if (!mission.is_active) {
        throw new Error('Misión no disponible')
      }

      // Verificar si ya se completó
      const { data: completion, error: completionError } = await supabase
        .from('puma_mission_completions')
        .select('id')
        .eq('user_id', userId)
        .eq('mission_id', missionId)
        .single()

      if (completion) {
        throw new Error('Misión ya completada')
      }

      // Agregar recompensa
      const rewardAdded = await this.addReward(
        userId, 
        mission.reward, 
        `Misión completada: ${mission.title}`, 
        'mission'
      )

      if (!rewardAdded) {
        throw new Error('Error agregando recompensa')
      }

      // Marcar misión como completada
      const { error: completionInsertError } = await supabase
        .from('puma_mission_completions')
        .insert({
          user_id: userId,
          mission_id: missionId,
          completed_at: new Date().toISOString()
        })

      if (completionInsertError) {
        console.error('Error marcando misión como completada:', completionInsertError)
      }

      // Verificar si desbloquea nueva insignia
      const newBadge = await this.checkBadgeUnlock(userId, missionId)

      return {
        success: true,
        reward: mission.reward,
        newBadge
      }
    } catch (error) {
      console.error('Error en completeMission:', error)
      return { success: false, error: error.message }
    }
  }

  // Obtener misiones disponibles
  static async getAvailableMissions(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('puma_missions')
        .select('*')
        .eq('is_active', true)
        .order('reward', { ascending: false })

      if (error) {
        console.error('Error obteniendo misiones:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error en getAvailableMissions:', error)
      return []
    }
  }

  // Verificar subida de nivel
  static async checkLevelUp(userId: string, totalEarned: number): Promise<void> {
    try {
      const levelThresholds = [0, 1000, 5000, 15000, 30000, 50000, 75000, 100000, 150000, 200000]
      const newLevel = levelThresholds.findIndex(threshold => totalEarned < threshold)

      if (newLevel > 0) {
        const { error } = await supabase
          .from('puma_users')
          .update({
            level: newLevel,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          console.error('Error actualizando nivel:', error)
        }
      }
    } catch (error) {
      console.error('Error en checkLevelUp:', error)
    }
  }

  // Verificar desbloqueo de insignia
  static async checkBadgeUnlock(userId: string, missionId: string): Promise<string | null> {
    try {
      // Lógica para verificar si se desbloquea una nueva insignia
      const badgeMap: Record<string, string> = {
        'mission-1': 'Primer Like',
        'mission-2': 'Newsletter Reader',
        'mission-3': 'Social Butterfly'
      }

      const badge = badgeMap[missionId]
      if (!badge) return null

      // Agregar insignia al usuario
      const { data: user, error: userError } = await supabase
        .from('puma_users')
        .select('badges')
        .eq('user_id', userId)
        .single()

      if (userError) {
        console.error('Error obteniendo usuario:', userError)
        return null
      }

      const currentBadges = user.badges || []
      if (!currentBadges.includes(badge)) {
        const newBadges = [...currentBadges, badge]
        
        const { error: updateError } = await supabase
          .from('puma_users')
          .update({ badges: newBadges })
          .eq('user_id', userId)

        if (updateError) {
          console.error('Error actualizando insignias:', updateError)
          return null
        }

        return badge
      }

      return null
    } catch (error) {
      console.error('Error en checkBadgeUnlock:', error)
      return null
    }
  }

  // Obtener estadísticas globales
  static async getGlobalStats(): Promise<any> {
    try {
      const { data: users, error: usersError } = await supabase
        .from('puma_users')
        .select('*')

      if (usersError) {
        console.error('Error obteniendo usuarios:', usersError)
        return null
      }

      const totalUsers = users?.length || 0
      const totalTokens = users?.reduce((sum, user) => sum + (user.balance || 0), 0) || 0
      const totalEarned = users?.reduce((sum, user) => sum + (user.total_earned || 0), 0) || 0
      const totalSpent = users?.reduce((sum, user) => sum + (user.total_spent || 0), 0) || 0

      const { data: transactions, error: transactionsError } = await supabase
        .from('puma_transactions')
        .select('*')

      if (transactionsError) {
        console.error('Error obteniendo transacciones:', transactionsError)
        return null
      }

      const totalTransactions = transactions?.length || 0
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      const transactionsToday = transactions?.filter(tx => 
        new Date(tx.created_at) >= new Date(today.setHours(0, 0, 0, 0))
      ).length || 0

      const transactionsThisWeek = transactions?.filter(tx => 
        new Date(tx.created_at) >= weekAgo
      ).length || 0

      return {
        totalUsers,
        totalTokens,
        totalEarned,
        totalSpent,
        totalTransactions,
        transactionsToday,
        transactionsThisWeek,
        averageTokensPerUser: totalTokens / Math.max(1, totalUsers),
        averageEarnedPerUser: totalEarned / Math.max(1, totalUsers)
      }
    } catch (error) {
      console.error('Error en getGlobalStats:', error)
      return null
    }
  }
}
