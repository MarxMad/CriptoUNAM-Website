// Middleware de autenticación para el sistema
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
    permissions: string[]
  }
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'Token de acceso requerido' })
    }

    // Verificar token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' })
    }

    // Obtener información adicional del usuario
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role, permissions')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      return res.status(401).json({ error: 'Perfil de usuario no encontrado' })
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: userProfile.role || 'user',
      permissions: userProfile.permissions || []
    }

    next()
  } catch (error) {
    console.error('Error en autenticación:', error)
    return res.status(401).json({ error: 'Error en autenticación' })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permisos insuficientes' })
    }

    next()
  }
}

export const requirePermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuario no autenticado' })
    }

    const hasPermission = permissions.some(permission => 
      req.user!.permissions.includes(permission)
    )

    if (!hasPermission) {
      return res.status(403).json({ error: 'Permisos insuficientes' })
    }

    next()
  }
}

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token)
      
      if (!error && user) {
        const { data: userProfile } = await supabase
          .from('user_profiles')
          .select('role, permissions')
          .eq('user_id', user.id)
          .single()

        req.user = {
          id: user.id,
          email: user.email!,
          role: userProfile?.role || 'user',
          permissions: userProfile?.permissions || []
        }
      }
    }

    next()
  } catch (error) {
    console.error('Error en autenticación opcional:', error)
    next()
  }
}

export const rateLimit = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || req.connection.remoteAddress || 'unknown'
    const now = Date.now()
    const windowStart = now - windowMs

    // Limpiar requests antiguos
    for (const [key, value] of requests.entries()) {
      if (value.resetTime < windowStart) {
        requests.delete(key)
      }
    }

    const clientRequests = requests.get(clientId)
    
    if (!clientRequests) {
      requests.set(clientId, { count: 1, resetTime: now + windowMs })
      return next()
    }

    if (clientRequests.count >= maxRequests) {
      return res.status(429).json({ 
        error: 'Demasiadas solicitudes', 
        retryAfter: Math.ceil((clientRequests.resetTime - now) / 1000)
      })
    }

    clientRequests.count++
    next()
  }
}

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body
  
  if (!email) {
    return res.status(400).json({ error: 'Email es requerido' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' })
  }

  next()
}

export const validatePumaTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { amount, type, description, category } = req.body

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Cantidad inválida' })
  }

  if (!type || !['earn', 'spend', 'transfer', 'reward'].includes(type)) {
    return res.status(400).json({ error: 'Tipo de transacción inválido' })
  }

  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: 'Descripción es requerida' })
  }

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Categoría es requerida' })
  }

  next()
}

export const validateLike = (req: Request, res: Response, next: NextFunction) => {
  const { newsletterId } = req.body

  if (!newsletterId || typeof newsletterId !== 'string') {
    return res.status(400).json({ error: 'ID de newsletter inválido' })
  }

  next()
}
