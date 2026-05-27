/** ABI mínima de CriptoUNAMBadges (ERC-721 POAP + certificados soulbound). */
export const criptoUnamBadgesAbi = [
  {
    type: 'function',
    name: 'mint',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'kind', type: 'uint8' },
      { name: 'ref', type: 'string' },
      { name: 'uri', type: 'string' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
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
    name: 'MINTER_ROLE',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bytes32' }],
  },
  {
    type: 'function',
    name: 'ownerOf',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'tokenURI',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'tokenKind',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    type: 'function',
    name: 'tokenRef',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    type: 'function',
    name: 'isSoulbound',
    stateMutability: 'view',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'event',
    name: 'BadgeMinted',
    inputs: [
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true },
      { name: 'kind', type: 'uint8', indexed: true },
      { name: 'ref', type: 'string', indexed: false },
    ],
    anonymous: false,
  },
] as const

/** Coincide con CriptoUNAMBadges.BadgeKind on-chain. */
export enum BadgeKind {
  CourseCompletion = 0,
  EventAttendance = 1,
  Ambassador = 2,
  Certification = 3,
}

export const BADGE_KIND_LABEL: Record<BadgeKind, string> = {
  [BadgeKind.CourseCompletion]: 'Certificado de curso',
  [BadgeKind.EventAttendance]: 'POAP de evento',
  [BadgeKind.Ambassador]: 'Badge de embajador',
  [BadgeKind.Certification]: 'Certificación',
}

export const BADGE_KIND_DESCRIPTION: Record<BadgeKind, string> = {
  [BadgeKind.CourseCompletion]: 'Credencial soulbound al completar un curso de CriptoUNAM.',
  [BadgeKind.EventAttendance]: 'POAP transferible por asistir a un evento o sesión.',
  [BadgeKind.Ambassador]: 'Reconocimiento a embajadores activos de la comunidad.',
  [BadgeKind.Certification]: 'Certificación oficial soulbound (no transferible).',
}

export const BADGE_KIND_SOULBOUND: Record<BadgeKind, boolean> = {
  [BadgeKind.CourseCompletion]: true,
  [BadgeKind.EventAttendance]: false,
  [BadgeKind.Ambassador]: false,
  [BadgeKind.Certification]: true,
}

export type BadgeMetadata = {
  name?: string
  description?: string
  image?: string
  external_url?: string
  attributes?: Array<{ trait_type: string; value: string | number }>
}
