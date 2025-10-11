// Rutas de API para sistema de likes
import { Router } from 'express'
import { ValidationUtils } from '../utils/validation.utils'
import { authenticateToken, validateLike } from '../middleware/auth.middleware'

const router = Router()

// Dar like
router.post('/', authenticateToken, validateLike, async (req, res) => {
  try {
    const { newsletterId } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Validar datos
    const likeValidation = ValidationUtils.validateLike({
      userId,
      newsletterId
    })

    if (!likeValidation.isValid) {
      return res.status(400).json({ error: likeValidation.error })
    }

    // Aquí se guardaría en la base de datos
    // const like = await likesService.addLike(userId, newsletterId)

    // Simular respuesta
    const like = {
      id: 'like-id',
      userId,
      newsletterId,
      createdAt: new Date().toISOString()
    }

    res.json({ 
      success: true, 
      message: 'Like agregado',
      like 
    })
  } catch (error) {
    console.error('Error agregando like:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Quitar like
router.delete('/', authenticateToken, validateLike, async (req, res) => {
  try {
    const { newsletterId } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Aquí se eliminaría de la base de datos
    // await likesService.removeLike(userId, newsletterId)

    res.json({ 
      success: true, 
      message: 'Like removido' 
    })
  } catch (error) {
    console.error('Error removiendo like:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener likes de una newsletter
router.get('/:newsletterId', async (req, res) => {
  try {
    const { newsletterId } = req.params

    // Simular estadísticas de likes
    const stats = {
      newsletterId,
      totalLikes: Math.floor(Math.random() * 100),
      uniqueUsers: Math.floor(Math.random() * 50),
      likesToday: Math.floor(Math.random() * 10),
      likesThisWeek: Math.floor(Math.random() * 30),
      likesThisMonth: Math.floor(Math.random() * 80),
      averageRating: 4.5
    }

    res.json(stats)
  } catch (error) {
    console.error('Error obteniendo likes:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener likes del usuario
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.id

    if (currentUserId !== userId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Simular likes del usuario
    const userLikes = [
      {
        id: 'like-1',
        userId,
        newsletterId: 'newsletter-1',
        createdAt: new Date().toISOString()
      },
      {
        id: 'like-2',
        userId,
        newsletterId: 'newsletter-2',
        createdAt: new Date().toISOString()
      }
    ]

    res.json(userLikes)
  } catch (error) {
    console.error('Error obteniendo likes del usuario:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener newsletters trending
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query

    // Simular newsletters trending
    const trending = Array.from({ length: parseInt(limit as string) }, (_, i) => ({
      id: `newsletter-${i + 1}`,
      title: `Newsletter Trending ${i + 1}`,
      author: `Autor ${i + 1}`,
      likes: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 500),
      publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: ['Blockchain', 'Web3', 'DeFi', 'NFT'][Math.floor(Math.random() * 4)],
      trendingScore: Math.random() * 100
    })).sort((a, b) => b.trendingScore - a.trendingScore)

    res.json(trending)
  } catch (error) {
    console.error('Error obteniendo trending:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener historial de likes del usuario
router.get('/history/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const currentUserId = req.user?.id

    if (currentUserId !== userId) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    // Simular historial
    const history = {
      userId,
      totalLikes: Math.floor(Math.random() * 50),
      likesThisWeek: Math.floor(Math.random() * 10),
      likesThisMonth: Math.floor(Math.random() * 30),
      favoriteCategories: ['Blockchain', 'Web3', 'DeFi'],
      lastLikeAt: new Date().toISOString()
    }

    res.json(history)
  } catch (error) {
    console.error('Error obteniendo historial:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Verificar si el usuario dio like
router.get('/check/:newsletterId', authenticateToken, async (req, res) => {
  try {
    const { newsletterId } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    // Simular verificación
    const isLiked = Math.random() > 0.5

    res.json({ 
      isLiked,
      newsletterId,
      userId 
    })
  } catch (error) {
    console.error('Error verificando like:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
