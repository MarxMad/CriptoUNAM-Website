// Servicio para manejo de likes
import { createClient } from '@supabase/supabase-js'
import { ValidationUtils } from '../utils/validation.utils'
import { ENV_CONFIG } from '../config/env'

const supabase = createClient(
  ENV_CONFIG.SUPABASE_URL,
  ENV_CONFIG.SUPABASE_ANON_KEY
)

export class LikesService {
  // Agregar like
  static async addLike(userId: string, newsletterId: string): Promise<boolean> {
    try {
      // Validar datos
      const likeValidation = ValidationUtils.validateLike({
        userId,
        newsletterId
      })

      if (!likeValidation.isValid) {
        throw new Error(likeValidation.error)
      }

      // Verificar si ya existe el like
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('newsletter_id', newsletterId)
        .single()

      if (existingLike) {
        throw new Error('Ya has dado like a esta newsletter')
      }

      // Insertar like
      const { error } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          newsletter_id: newsletterId,
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error insertando like:', error)
        return false
      }

      // Actualizar contador de likes en la newsletter
      await this.updateNewsletterLikeCount(newsletterId, 1)

      return true
    } catch (error) {
      console.error('Error en addLike:', error)
      return false
    }
  }

  // Remover like
  static async removeLike(userId: string, newsletterId: string): Promise<boolean> {
    try {
      // Eliminar like
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('user_id', userId)
        .eq('newsletter_id', newsletterId)

      if (error) {
        console.error('Error removiendo like:', error)
        return false
      }

      // Actualizar contador de likes en la newsletter
      await this.updateNewsletterLikeCount(newsletterId, -1)

      return true
    } catch (error) {
      console.error('Error en removeLike:', error)
      return false
    }
  }

  // Verificar si el usuario dio like
  static async hasUserLiked(userId: string, newsletterId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('newsletter_id', newsletterId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error verificando like:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error en hasUserLiked:', error)
      return false
    }
  }

  // Obtener likes de una newsletter
  static async getNewsletterLikes(newsletterId: string): Promise<any> {
    try {
      const { data: likes, error } = await supabase
        .from('likes')
        .select('*')
        .eq('newsletter_id', newsletterId)

      if (error) {
        console.error('Error obteniendo likes:', error)
        return null
      }

      const totalLikes = likes?.length || 0
      const uniqueUsers = new Set(likes?.map(like => like.user_id)).size

      // Obtener estadísticas adicionales
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const likesToday = likes?.filter(like => 
        new Date(like.created_at) >= new Date(today.setHours(0, 0, 0, 0))
      ).length || 0

      const likesThisWeek = likes?.filter(like => 
        new Date(like.created_at) >= weekAgo
      ).length || 0

      const likesThisMonth = likes?.filter(like => 
        new Date(like.created_at) >= monthAgo
      ).length || 0

      return {
        newsletterId,
        totalLikes,
        uniqueUsers,
        likesToday,
        likesThisWeek,
        likesThisMonth,
        averageRating: 4.5 // Simulado
      }
    } catch (error) {
      console.error('Error en getNewsletterLikes:', error)
      return null
    }
  }

  // Obtener likes del usuario
  static async getUserLikes(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select(`
          *,
          newsletters (
            id,
            title,
            author,
            published_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error obteniendo likes del usuario:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error en getUserLikes:', error)
      return []
    }
  }

  // Obtener newsletters trending
  static async getTrendingNewsletters(limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .select(`
          *,
          likes (id)
        `)
        .order('published_at', { ascending: false })
        .limit(limit * 2) // Obtener más para filtrar

      if (error) {
        console.error('Error obteniendo newsletters:', error)
        return []
      }

      // Calcular trending score basado en likes y tiempo
      const trending = data?.map(newsletter => {
        const likeCount = newsletter.likes?.length || 0
        const daysSincePublished = Math.max(1, 
          (Date.now() - new Date(newsletter.published_at).getTime()) / (24 * 60 * 60 * 1000)
        )
        const trendingScore = likeCount / Math.log(daysSincePublished + 1)

        return {
          ...newsletter,
          likes: likeCount,
          trendingScore
        }
      }).sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, limit)

      return trending
    } catch (error) {
      console.error('Error en getTrendingNewsletters:', error)
      return []
    }
  }

  // Obtener historial de likes del usuario
  static async getUserLikeHistory(userId: string): Promise<any> {
    try {
      const { data: likes, error } = await supabase
        .from('likes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error obteniendo historial:', error)
        return null
      }

      const totalLikes = likes?.length || 0
      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      const likesToday = likes?.filter(like => 
        new Date(like.created_at) >= new Date(today.setHours(0, 0, 0, 0))
      ).length || 0

      const likesThisWeek = likes?.filter(like => 
        new Date(like.created_at) >= weekAgo
      ).length || 0

      const likesThisMonth = likes?.filter(like => 
        new Date(like.created_at) >= monthAgo
      ).length || 0

      // Obtener categorías favoritas
      const { data: newsletters, error: newsletterError } = await supabase
        .from('newsletters')
        .select('category')
        .in('id', likes?.map(like => like.newsletter_id) || [])

      if (newsletterError) {
        console.error('Error obteniendo categorías:', newsletterError)
      }

      const categoryCount = newsletters?.reduce((acc, newsletter) => {
        acc[newsletter.category] = (acc[newsletter.category] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      const favoriteCategories = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([category]) => category)

      return {
        userId,
        totalLikes,
        likesToday,
        likesThisWeek,
        likesThisMonth,
        favoriteCategories,
        lastLikeAt: likes?.[0]?.created_at || null
      }
    } catch (error) {
      console.error('Error en getUserLikeHistory:', error)
      return null
    }
  }

  // Actualizar contador de likes en newsletter
  static async updateNewsletterLikeCount(newsletterId: string, increment: number): Promise<void> {
    try {
      // Obtener contador actual
      const { data: newsletter, error: fetchError } = await supabase
        .from('newsletters')
        .select('like_count')
        .eq('id', newsletterId)
        .single()

      if (fetchError) {
        console.error('Error obteniendo newsletter:', fetchError)
        return
      }

      const newCount = Math.max(0, (newsletter.like_count || 0) + increment)

      // Actualizar contador
      const { error: updateError } = await supabase
        .from('newsletters')
        .update({ like_count: newCount })
        .eq('id', newsletterId)

      if (updateError) {
        console.error('Error actualizando contador:', updateError)
      }
    } catch (error) {
      console.error('Error en updateNewsletterLikeCount:', error)
    }
  }

  // Obtener estadísticas globales de likes
  static async getGlobalLikeStats(): Promise<any> {
    try {
      const { data: likes, error } = await supabase
        .from('likes')
        .select('*')

      if (error) {
        console.error('Error obteniendo estadísticas:', error)
        return null
      }

      const totalLikes = likes?.length || 0
      const uniqueUsers = new Set(likes?.map(like => like.user_id)).size
      const uniqueNewsletters = new Set(likes?.map(like => like.newsletter_id)).size

      const today = new Date()
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

      const likesToday = likes?.filter(like => 
        new Date(like.created_at) >= new Date(today.setHours(0, 0, 0, 0))
      ).length || 0

      const likesThisWeek = likes?.filter(like => 
        new Date(like.created_at) >= weekAgo
      ).length || 0

      return {
        totalLikes,
        uniqueUsers,
        uniqueNewsletters,
        likesToday,
        likesThisWeek,
        averageLikesPerUser: totalLikes / Math.max(1, uniqueUsers),
        averageLikesPerNewsletter: totalLikes / Math.max(1, uniqueNewsletters)
      }
    } catch (error) {
      console.error('Error en getGlobalLikeStats:', error)
      return null
    }
  }
}
