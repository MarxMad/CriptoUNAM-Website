// Tipos para el sistema de recompensas $PUMA
export interface PumaToken {
  id: string
  userId: string
  balance: number
  totalEarned: number
  totalSpent: number
  createdAt: string
  updatedAt: string
}

export interface PumaTransaction {
  id: string
  userId: string
  type: 'earn' | 'spend' | 'transfer' | 'reward'
  amount: number
  description: string
  category: PumaCategory
  metadata?: Record<string, any>
  createdAt: string
}

export interface PumaCategory {
  id: string
  name: string
  description: string
  multiplier: number
  isActive: boolean
}

export interface PumaReward {
  id: string
  userId: string
  amount: number
  reason: string
  category: string
  status: 'pending' | 'approved' | 'rejected' | 'claimed'
  createdAt: string
  claimedAt?: string
}

export interface PumaMission {
  id: string
  title: string
  description: string
  reward: number
  requirements: MissionRequirement[]
  isActive: boolean
  expiresAt?: string
  maxCompletions?: number
}

export interface MissionRequirement {
  type: 'like' | 'newsletter' | 'referral' | 'time' | 'custom'
  target: number
  current: number
  description: string
}

export interface PumaLeaderboard {
  userId: string
  username: string
  totalEarned: number
  rank: number
  level: number
  badges: string[]
}

export interface PumaService {
  getUserBalance(userId: string): Promise<number>
  addReward(userId: string, amount: number, reason: string, category: string): Promise<boolean>
  spendTokens(userId: string, amount: number, description: string): Promise<boolean>
  getTransactionHistory(userId: string, limit?: number): Promise<PumaTransaction[]>
  getLeaderboard(limit: number): Promise<PumaLeaderboard[]>
  completeMission(userId: string, missionId: string): Promise<boolean>
  getAvailableMissions(): Promise<PumaMission[]>
  getUserLevel(userId: string): Promise<number>
  getUserBadges(userId: string): Promise<string[]>
}
