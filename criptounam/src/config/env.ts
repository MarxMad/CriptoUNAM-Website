// Configuración de variables de entorno
export const ENV_CONFIG = {
  // Resend Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY || 're_62kZTkv6_FUSP3ajUPGoZwrt5EzMett5X',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'noreply@criptounam.com',
  
  // Database Configuration
  SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://shccrrwnmogswspvlakf.supabase.co',
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoY2NycndubW9nc3dzcHZsYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyODYwNzcsImV4cCI6MjA3NDg2MjA3N30.heVBb4qhASOv6UZlfrTkZpoiQbva3JXFynn2AhO6_oM',
  
  // App Configuration
  APP_URL: process.env.VITE_API_BASE_URL || 'https://api.criptounam.xyz',
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'CriptoUNAM',
  
  // Telegram Configuration
  TELEGRAM_BOT_TOKEN: process.env.VITE_TELEGRAM_BOT_TOKEN || '7988985791:AAGEvzxwgDa0ERXoKS1G6J5s8XIhxcywYYM',
  TELEGRAM_CHAT_ID: process.env.VITE_TELEGRAM_CHAT_ID || '1608242541',
  
  // WalletConnect Configuration
  WALLET_CONNECT_PROJECT_ID: process.env.VITE_WALLET_CONNECT_PROJECT_ID || '4d100a6eb76b812745208d28235dd59c',
  
  // Email Templates
  EMAIL_TEMPLATE_WELCOME: 'welcome_template',
  EMAIL_TEMPLATE_NEWSLETTER: 'newsletter_template',
  EMAIL_TEMPLATE_NOTIFICATION: 'notification_template',
  
  // PUMA Token Configuration
  PUMA_TOKEN_ADDRESS: process.env.PUMA_TOKEN_ADDRESS || '0x1234567890abcdef',
  PUMA_TOKEN_DECIMALS: parseInt(process.env.PUMA_TOKEN_DECIMALS || '18'),
  PUMA_REWARD_RATE: parseInt(process.env.PUMA_REWARD_RATE || '100'),
  
  // Like System Configuration
  LIKE_COOLDOWN: parseInt(process.env.LIKE_COOLDOWN || '5000'),
  MAX_LIKES_PER_USER: parseInt(process.env.MAX_LIKES_PER_USER || '100'),
  LIKE_REWARD_AMOUNT: parseInt(process.env.LIKE_REWARD_AMOUNT || '10'),

  // Blockchain Configuration
  CHAIN_ID: parseInt(process.env.CHAIN_ID || '1'),
  RPC_URL: process.env.RPC_URL || '',
  INFURA_ID: process.env.INFURA_ID || '',
  EXPLORER_URL: process.env.EXPLORER_URL || 'https://etherscan.io',
  ADMIN_PRIVATE_KEY: process.env.ADMIN_PRIVATE_KEY || ''
}

export default ENV_CONFIG
