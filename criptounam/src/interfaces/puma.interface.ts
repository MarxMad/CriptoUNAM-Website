// Interfaces para el sistema de recompensas $PUMA
export interface IPumaService {
  getUserBalance(userId: string): Promise<number>
  addReward(userId: string, amount: number, reason: string, category: string): Promise<boolean>
  spendTokens(userId: string, amount: number, description: string): Promise<boolean>
  getTransactionHistory(userId: string, limit?: number): Promise<IPumaTransaction[]>
  getLeaderboard(limit: number): Promise<IPumaLeaderboard[]>
  completeMission(userId: string, missionId: string): Promise<boolean>
  getAvailableMissions(): Promise<IPumaMission[]>
  getUserLevel(userId: string): Promise<number>
  getUserBadges(userId: string): Promise<string[]>
}

export interface IPumaToken {
  id: string
  userId: string
  balance: number
  totalEarned: number
  totalSpent: number
  createdAt: string
  updatedAt: string
}

export interface IPumaTransaction {
  id: string
  userId: string
  type: 'earn' | 'spend' | 'transfer' | 'reward'
  amount: number
  description: string
  category: string
  metadata?: Record<string, any>
  createdAt: string
}

export interface IPumaCategory {
  id: string
  name: string
  description: string
  multiplier: number
  isActive: boolean
}

export interface IPumaReward {
  id: string
  userId: string
  amount: number
  reason: string
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'claimed'
  createdAt: string
  claimedAt?: string
}

export interface IPumaMission {
  id: string
  title: string
  description: string
  reward: number
  requirements: IMissionRequirement[]
  isActive: boolean
  expiresAt?: string
  maxCompletions?: number
}

export interface IMissionRequirement {
  type: 'like' | 'newsletter' | 'referral' | 'time' | 'custom'
  target: number
  current: number
  description: string
}

export interface IPumaLeaderboard {
  userId: string
  username: string
  totalEarned: number
  rank: number
  level: number
  badges: string[]
}

export interface IPumaUserLevel {
  id: string
  userId: string
  level: number
  experiencePoints: number
  totalEarned: number
  badges: string[]
  achievements: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface IPumaReferral {
  id: string
  referrerId: string
  referredId: string
  rewardAmount: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  approvedAt?: string
}

export interface IPumaValidator {
  validateTransaction(transaction: Partial<IPumaTransaction>): boolean
  validateReward(reward: Partial<IPumaReward>): boolean
  validateMission(mission: Partial<IPumaMission>): boolean
  canUserCompleteMission(userId: string, missionId: string): Promise<boolean>
}

export interface IPumaAnalyticsService {
  getTransactionAnalytics(userId: string, timeframe: string): Promise<any>
  getRewardAnalytics(category: string, timeframe: string): Promise<any>
  getMissionCompletionRate(missionId: string): Promise<number>
  getUserEngagement(userId: string): Promise<any>
}

export interface IPumaNotificationService {
  notifyRewardEarned(userId: string, amount: number, reason: string): Promise<void>
  notifyMissionCompleted(userId: string, missionId: string, reward: number): Promise<void>
  notifyLevelUp(userId: string, newLevel: number): Promise<void>
  notifyBadgeEarned(userId: string, badge: string): Promise<void>
}

export interface IPumaCacheService {
  getUserBalance(userId: string): Promise<number>
  setUserBalance(userId: string, balance: number): Promise<void>
  getLeaderboard(limit: number): Promise<IPumaLeaderboard[]>
  setLeaderboard(leaderboard: IPumaLeaderboard[]): Promise<void>
  invalidateUserCache(userId: string): Promise<void>
  invalidateLeaderboardCache(): Promise<void>
}

export interface IPumaModerationService {
  moderateReward(rewardId: string): Promise<boolean>
  approveReward(rewardId: string): Promise<void>
  rejectReward(rewardId: string, reason: string): Promise<void>
  getPendingRewards(): Promise<IPumaReward[]>
  getSuspiciousTransactions(): Promise<IPumaTransaction[]>
}
