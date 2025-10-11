// Interfaces para el sistema de likes
export interface ILikeService {
  addLike(userId: string, newsletterId: string): Promise<boolean>
  removeLike(userId: string, newsletterId: string): Promise<boolean>
  getLikes(newsletterId: string): Promise<ILike[]>
  getUserLikes(userId: string): Promise<ILike[]>
  getLikeStats(newsletterId: string): Promise<ILikeStats>
  getTrendingNewsletters(limit: number): Promise<ITrendingNewsletter[]>
  getUserLikeHistory(userId: string): Promise<IUserLikeHistory>
  isLikedByUser(userId: string, newsletterId: string): Promise<boolean>
}

export interface ILike {
  id: string
  userId: string
  newsletterId: string
  createdAt: string
  updatedAt: string
}

export interface ILikeStats {
  newsletterId: string
  totalLikes: number
  uniqueUsers: number
  likesToday: number
  likesThisWeek: number
  likesThisMonth: number
  averageRating: number
}

export interface IUserLikeHistory {
  userId: string
  totalLikes: number
  likesThisWeek: number
  likesThisMonth: number
  favoriteCategories: string[]
  lastLikeAt: string
}

export interface ILikeAnalytics {
  id: string
  newsletterId: string
  userId: string
  action: 'like' | 'unlike'
  timestamp: string
  userAgent?: string
  ipAddress?: string
}

export interface ITrendingNewsletter {
  id: string
  title: string
  author: string
  likes: number
  views: number
  publishedAt: string
  category: string
  trendingScore: number
}

export interface ILikeValidator {
  canUserLike(userId: string, newsletterId: string): Promise<boolean>
  validateLikeData(like: Partial<ILike>): boolean
  checkLikeCooldown(userId: string): Promise<boolean>
}

export interface ILikeAnalyticsService {
  trackLike(userId: string, newsletterId: string, action: 'like' | 'unlike'): Promise<void>
  getLikeAnalytics(newsletterId: string, timeframe: string): Promise<ILikeAnalytics[]>
  getTrendingData(timeframe: string): Promise<ITrendingNewsletter[]>
  getUserLikePattern(userId: string): Promise<any>
}

export interface ILikeNotificationService {
  notifyNewLike(newsletterId: string, userId: string): Promise<void>
  notifyLikeMilestone(newsletterId: string, milestone: number): Promise<void>
  notifyTrendingNewsletter(newsletterId: string): Promise<void>
}

export interface ILikeCacheService {
  getLikeCount(newsletterId: string): Promise<number>
  setLikeCount(newsletterId: string, count: number): Promise<void>
  getUserLikes(userId: string): Promise<string[]>
  setUserLikes(userId: string, likes: string[]): Promise<void>
  invalidateCache(newsletterId: string): Promise<void>
  invalidateUserCache(userId: string): Promise<void>
}

export interface ILikeModerationService {
  moderateLike(userId: string, newsletterId: string): Promise<boolean>
  reportLike(likeId: string, reason: string): Promise<void>
  getReportedLikes(): Promise<any[]>
  approveLike(likeId: string): Promise<void>
  rejectLike(likeId: string, reason: string): Promise<void>
}
