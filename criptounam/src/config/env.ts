// Variables de entorno (Vite). No incluir secretos reales en el repo: usa .env local y Vercel.

function str(v: string | undefined): string {
  return v != null && String(v).trim() !== '' ? String(v).trim() : ''
}

function envStr(key: string): string {
  const v = import.meta.env[key as keyof ImportMetaEnv]
  return str(typeof v === 'string' ? v : undefined)
}

export const ENV_CONFIG = {
  RESEND_API_KEY: envStr('VITE_RESEND_API_KEY') || envStr('RESEND_API_KEY'),
  RESEND_FROM_EMAIL: envStr('VITE_RESEND_FROM_EMAIL') || envStr('RESEND_FROM_EMAIL') || 'noreply@criptounam.com',

  SUPABASE_URL: envStr('VITE_SUPABASE_URL'),
  SUPABASE_ANON_KEY: envStr('VITE_SUPABASE_ANON_KEY') || envStr('VITE_SUPABASE_PUBLISHABLE_KEY'),

  APP_URL: envStr('VITE_API_BASE_URL') || 'https://criptounam.xyz',
  APP_NAME: envStr('VITE_APP_NAME') || 'CriptoUNAM',

  TELEGRAM_BOT_TOKEN: envStr('VITE_TELEGRAM_BOT_TOKEN'),
  TELEGRAM_CHAT_ID: envStr('VITE_TELEGRAM_CHAT_ID'),

  WALLET_CONNECT_PROJECT_ID: envStr('VITE_WALLET_CONNECT_PROJECT_ID'),

  EMAIL_TEMPLATE_WELCOME: 'welcome_template',
  EMAIL_TEMPLATE_NEWSLETTER: 'newsletter_template',
  EMAIL_TEMPLATE_NOTIFICATION: 'notification_template',

  PUMA_TOKEN_ADDRESS: envStr('VITE_PUMA_TOKEN_ADDRESS') || '0x0000000000000000000000000000000000000000',
  BADGES_CONTRACT_ADDRESS: envStr('VITE_BADGES_CONTRACT_ADDRESS') || '0x0000000000000000000000000000000000000000',
  DROPS_CONTRACT_ADDRESS: envStr('VITE_DROPS_CONTRACT_ADDRESS') || '0x0000000000000000000000000000000000000000',
  /** Endpoint serverless que firma mints del Badge desde la wallet MINTER. Vacío = no disponible. */
  BADGES_CLAIM_ENDPOINT: envStr('VITE_BADGES_CLAIM_ENDPOINT'),
  /** Base URL para metadata IPFS/HTTP de los badges (ej. ipfs://CID/ o https://criptounam.xyz/badges/). */
  BADGES_METADATA_BASE: envStr('VITE_BADGES_METADATA_BASE') || '',
  /** Endpoint serverless que ejecuta burnReward para confirmar pago de curso en PUMA. */
  COURSE_PAYMENT_ENDPOINT: envStr('VITE_COURSE_PAYMENT_ENDPOINT'),
  /** @deprecated La UI lista todas las misiones desde el contrato; puedes dejar vacío. */
  PUMA_WELCOME_MISSION_ID: envStr('VITE_PUMA_WELCOME_MISSION_ID'),
  PUMA_TOKEN_DECIMALS: parseInt(envStr('VITE_PUMA_TOKEN_DECIMALS') || '18', 10),
  PUMA_REWARD_RATE: parseInt(envStr('VITE_PUMA_REWARD_RATE') || '100', 10),

  LIKE_COOLDOWN: parseInt(envStr('VITE_LIKE_COOLDOWN') || '5000', 10),
  MAX_LIKES_PER_USER: parseInt(envStr('VITE_MAX_LIKES_PER_USER') || '100', 10),
  LIKE_REWARD_AMOUNT: parseInt(envStr('VITE_LIKE_REWARD_AMOUNT') || '10', 10),

  CHAIN_ID: parseInt(envStr('VITE_CHAIN_ID') || '43114', 10), // Avalanche C-Chain default
  RPC_URL: envStr('VITE_RPC_URL') || 'https://api.avax.network/ext/bc/C/rpc',
  INFURA_ID: envStr('VITE_INFURA_ID'),
  EXPLORER_URL: envStr('VITE_EXPLORER_URL') || 'https://snowtrace.io',
  ADMIN_PRIVATE_KEY: envStr('VITE_ADMIN_PRIVATE_KEY'),
}

export default ENV_CONFIG
