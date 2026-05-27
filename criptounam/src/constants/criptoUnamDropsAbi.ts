/** ABI de CriptoUNAMDrops: coordina PUMA + Badges con código compartido. */
export const criptoUnamDropsAbi = [
  {
    type: 'function',
    name: 'createDrop',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'code', type: 'string' },
      { name: 'title', type: 'string' },
      { name: 'pumaReward', type: 'uint256' },
      { name: 'badgeKind', type: 'uint8' },
      { name: 'badgeRef', type: 'string' },
      { name: 'badgeUri', type: 'string' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'deactivateDrop',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'code', type: 'string' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'claimDrop',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'code', type: 'string' }],
    outputs: [{ name: 'badgeTokenId', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getDropByCode',
    stateMutability: 'view',
    inputs: [{ name: 'code', type: 'string' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'title', type: 'string' },
          { name: 'pumaReward', type: 'uint256' },
          { name: 'badgeKind', type: 'uint8' },
          { name: 'badgeRef', type: 'string' },
          { name: 'badgeUri', type: 'string' },
          { name: 'deadline', type: 'uint256' },
          { name: 'active', type: 'bool' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getDropByHash',
    stateMutability: 'view',
    inputs: [{ name: 'codeHash', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'title', type: 'string' },
          { name: 'pumaReward', type: 'uint256' },
          { name: 'badgeKind', type: 'uint8' },
          { name: 'badgeRef', type: 'string' },
          { name: 'badgeUri', type: 'string' },
          { name: 'deadline', type: 'uint256' },
          { name: 'active', type: 'bool' },
          { name: 'exists', type: 'bool' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'hasClaimed',
    stateMutability: 'view',
    inputs: [
      { name: 'code', type: 'string' },
      { name: 'user', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'dropHashes',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'dropHashesLength',
    stateMutability: 'view',
    inputs: [],
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
    name: 'DROP_MANAGER_ROLE',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'event',
    name: 'DropCreated',
    inputs: [
      { name: 'codeHash', type: 'bytes32', indexed: true },
      { name: 'code', type: 'string', indexed: false },
      { name: 'title', type: 'string', indexed: false },
      { name: 'pumaReward', type: 'uint256', indexed: false },
      { name: 'badgeKind', type: 'uint8', indexed: false },
      { name: 'badgeRef', type: 'string', indexed: false },
      { name: 'deadline', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'DropClaimed',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'codeHash', type: 'bytes32', indexed: true },
      { name: 'pumaAmount', type: 'uint256', indexed: false },
      { name: 'badgeTokenId', type: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
] as const

export type DropRow = {
  title: string
  pumaReward: bigint
  badgeKind: number
  badgeRef: string
  badgeUri: string
  deadline: bigint
  active: boolean
  exists: boolean
}
