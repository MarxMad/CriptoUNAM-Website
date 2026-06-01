/** ABI de PUMAToken + vista AccessControl.hasRole para el panel y recompensas. */
export const pumaTokenAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'hasRole',
    stateMutability: 'view',
    inputs: [
      { name: 'role', type: 'bytes32' },
      { name: 'account', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'missionIds',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'missionIdsLength',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'missions',
    stateMutability: 'view',
    inputs: [{ name: 'missionId', type: 'string' }],
    outputs: [
      { name: 'title', type: 'string' },
      { name: 'reward', type: 'uint256' },
      { name: 'active', type: 'bool' },
      { name: 'deadline', type: 'uint256' },
      { name: 'exists', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'missionCompletedBy',
    stateMutability: 'view',
    inputs: [
      { name: 'missionId', type: 'string' },
      { name: 'user', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'completeMission',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'missionId', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'createMission',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'missionId', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'reward', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'deactivateMission',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'missionId', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'mintReward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'grantBadge',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'badge', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setUserLevel',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'newLevel', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getTokenStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'supplyTotal', type: 'uint256' },
      { name: 'rewardsTotal', type: 'uint256' },
      { name: 'burnedTotal', type: 'uint256' },
      { name: 'missionsCount', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getUserInfo',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      { name: 'balance', type: 'uint256' },
      { name: 'level', type: 'uint256' },
      { name: 'experience', type: 'uint256' },
      { name: 'badgeCount', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getUserRewards',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'amount', type: 'uint256' },
          { name: 'reason', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getUserBadges',
    stateMutability: 'view',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: '', type: 'string[]' }],
  },
  {
    type: 'function',
    name: 'xpPerTokenWei',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'MAX_SUPPLY',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'paused',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'transferReward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'burnReward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'setXpPerTokenWei',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'newXpPerWei', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'pause',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'unpause',
    stateMutability: 'nonpayable',
    inputs: [],
    outputs: [],
  },
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export type PumaMissionRow = {
  missionId: string
  title: string
  reward: bigint
  active: boolean
  deadline: bigint
  exists: boolean
}

/** Solo `completeMission` — tipado estable para escrituras mínimas. */
export const pumaCompleteMissionAbi = [
  {
    type: 'function',
    name: 'completeMission',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'missionId', type: 'string' }],
    outputs: [],
  },
] as const

/** Pago de curso público — cualquier wallet quema su propio PUMA. */
export const pumaPayCourseAbi = [
  {
    type: 'function',
    name: 'payCourse',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'cursoId', type: 'string' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

/** Enviar PUMA acreditados a otra wallet (mismo contrato). */
export const pumaTransferRewardAbi = [
  {
    type: 'function',
    name: 'transferReward',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

export type PumaRewardRecord = {
  amount: bigint
  reason: string
  timestamp: bigint
}
