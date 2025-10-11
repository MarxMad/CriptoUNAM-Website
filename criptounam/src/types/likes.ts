// Tipos para el sistema de likes
export interface Like {
  id: string
  userId: string
  newsletterId: string
  createdAt: string
  updatedAt: string
}

export interface LikeStats {
  newsletterId: string
  totalLikes: number
  uniqueUsers: number
  likesToday: number
  likesThisWeek: number
  likesThisMonth: number
  averageRating: number
}

export interface UserLikeHistory {
  userId: string
  totalLikes: number
  likesThisWeek: number
  likesThisMonth: number
  favoriteCategories: string[]
  lastLikeAt: string
}

export interface LikeAnalytics {
  id: string
  newsletterId: string
  userId: string
  action: 'like' | 'unlike'
  timestamp: string
  userAgent?: string
  ipAddress?: string
}

export interface TrendingNewsletter {
  id: string
  title: string
  author: string
  likes: number
  views: number
  publishedAt: string
  category: string
  trendingScore: number
}

export interface LikeService {
  addLike(userId: string, newsletterId: string): Promise<boolean>
  removeLike(userId: string, newsletterId: string): Promise<boolean>
  getLikes(newsletterId: string): Promise<Like[]>
  getUserLikes(userId: string): Promise<Like[]>
  getLikeStats(newsletterId: string): Promise<LikeStats>
  getTrendingNewsletters(limit: number): Promise<TrendingNewsletter[]>
  getUserLikeHistory(userId: string): Promise<UserLikeHistory>
  isLikedByUser(userId: string, newsletterId: string): Promise<boolean>
}
