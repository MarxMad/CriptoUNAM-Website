// Rutas de API para sistema de tokens PUMA
import { Router } from 'express'
import { ValidationUtils } from '../utils/validation.utils'
import { authenticateToken, validatePumaTransaction, AuthenticatedRequest } from '../middleware/auth.middleware'
import { PumaService } from '../services/puma.service'

const router = Router()

// Obtener balance del usuario
router.get('/user/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.id

    if (currentUserId !== userId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Obtener datos del usuario usando PumaService
    const userData = await PumaService.getUserBalance(userId)
    
    if (!userData) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(userData)
  } catch (error) {
    console.error('Error obteniendo datos del usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Agregar recompensa
router.post('/rewards', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { amount, reason, category } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Validar transacción
    const transactionValidation = ValidationUtils.validatePumaTransaction({
      amount,
      type: 'earn',
      description: reason,
      category
    })

    if (!transactionValidation.isValid) {
      return res.status(400).json({ error: transactionValidation.error })
    }

    // Simular agregar recompensa
    const newBalance = Math.floor(Math.random() * 10000) + amount
    const transaction = {
      id: 'tx-' + Date.now(),
      userId,
      type: 'earn',
      amount,
      description: reason,
      category,
      createdAt: new Date().toISOString()
    }

    res.json({
      success: true,
      message: 'Recompensa agregada',
      newBalance,
      totalEarned: Math.floor(Math.random() * 50000) + amount,
      transaction
    })
  } catch (error) {
    console.error('Error agregando recompensa:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Gastar tokens
router.post('/spend', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { amount, description } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Validar transacción
    const transactionValidation = ValidationUtils.validatePumaTransaction({
      amount,
      type: 'spend',
      description,
      category: 'purchase'
    })

    if (!transactionValidation.isValid) {
      return res.status(400).json({ error: transactionValidation.error })
    }

    // Simular gasto
    const currentBalance = Math.floor(Math.random() * 10000)
    if (currentBalance < amount) {
      return res.status(400).json({ error: 'Saldo insuficiente' })
    }

    const newBalance = currentBalance - amount
    const transaction = {
      id: 'tx-' + Date.now(),
      userId,
      type: 'spend',
      amount,
      description,
      category: 'purchase',
      createdAt: new Date().toISOString()
    }

    res.json({
      success: true,
      message: 'Tokens gastados',
      newBalance,
      totalSpent: Math.floor(Math.random() * 10000) + amount,
      transaction
    })
  } catch (error) {
    console.error('Error gastando tokens:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener historial de transacciones
router.get('/transactions/:userId', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.id

    if (currentUserId !== userId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Simular historial de transacciones
    const transactions = Array.from({ length: 10 }, (_, i) => ({
      id: `tx-${i + 1}`,
      userId,
      type: ['earn', 'spend', 'reward'][Math.floor(Math.random() * 3)],
      amount: Math.floor(Math.random() * 1000),
      description: `Transacción ${i + 1}`,
      category: ['like', 'newsletter', 'referral', 'mission'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
    }))

    res.json(transactions)
  } catch (error) {
    console.error('Error obteniendo transacciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query

    // Simular leaderboard
    const leaderboard = Array.from({ length: parseInt(limit as string) }, (_, i) => ({
      userId: `user-${i + 1}`,
      username: `Usuario${i + 1}`,
      totalEarned: Math.floor(Math.random() * 100000),
      rank: i + 1,
      level: Math.floor(Math.random() * 20) + 1,
      badges: ['Top Earner', 'Active User', 'Newsletter Reader'].slice(0, Math.floor(Math.random() * 3) + 1)
    })).sort((a, b) => b.totalEarned - a.totalEarned)

    res.json(leaderboard)
  } catch (error) {
    console.error('Error obteniendo leaderboard:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Completar misión
router.post('/missions/complete', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { missionId } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Simular completar misión
    const reward = Math.floor(Math.random() * 1000) + 100
    const newBalance = Math.floor(Math.random() * 10000) + reward
    const newBadge = Math.random() > 0.7 ? 'Mission Master' : null

    const transaction = {
      id: 'tx-' + Date.now(),
      userId,
      type: 'reward',
      amount: reward,
      description: `Misión completada: ${missionId}`,
      category: 'mission',
      createdAt: new Date().toISOString()
    }

    res.json({
      success: true,
      message: 'Misión completada',
      reward,
      newBalance,
      newBadge,
      transaction
    })
  } catch (error) {
    console.error('Error completando misión:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener misiones disponibles
router.get('/missions', async (req, res) => {
  try {
    // Simular misiones
    const missions = [
      {
        id: 'mission-1',
        title: 'Primer Like',
        description: 'Da tu primer like a una newsletter',
        reward: 50,
        requirements: [
          { type: 'like', target: 1, current: 0, description: 'Dar 1 like' }
        ],
        isActive: true
      },
      {
        id: 'mission-2',
        title: 'Newsletter Reader',
        description: 'Suscríbete al newsletter',
        reward: 100,
        requirements: [
          { type: 'newsletter', target: 1, current: 0, description: 'Suscribirse al newsletter' }
        ],
        isActive: true
      },
      {
        id: 'mission-3',
        title: 'Social Butterfly',
        description: 'Comparte 5 newsletters',
        reward: 200,
        requirements: [
          { type: 'custom', target: 5, current: 0, description: 'Compartir 5 newsletters' }
        ],
        isActive: true
      }
    ]

    res.json(missions)
  } catch (error) {
    console.error('Error obteniendo misiones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
