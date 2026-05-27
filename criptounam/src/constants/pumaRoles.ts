import { keccak256, stringToBytes } from 'viem'

/** Debe coincidir con `PUMAToken.sol` / OpenZeppelin AccessControl. */
export const PUMA_REWARD_MANAGER_ROLE = keccak256(stringToBytes('REWARD_MANAGER_ROLE'))
export const PUMA_MISSION_MANAGER_ROLE = keccak256(stringToBytes('MISSION_MANAGER_ROLE'))
export const PUMA_DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000' as const
