// Configuración de administradores
export const ADMIN_WALLETS = [
  '0x04BEf5bF293BB01d4946dBCfaaeC9a5140316217'.toLowerCase(),
  // Agregar más wallets de admin aquí si es necesario
];

// Función para verificar si una wallet es admin
export const isAdminWallet = (walletAddress: string): boolean => {
  if (!walletAddress) return false;
  
  const normalizedAddress = walletAddress.toLowerCase();
  return ADMIN_WALLETS.includes(normalizedAddress);
};

// Configuración de permisos de admin
export const ADMIN_PERMISSIONS = {
  CREATE_COURSE: true,
  EDIT_COURSE: true,
  DELETE_COURSE: true,
  CREATE_NEWSLETTER: true,
  EDIT_NEWSLETTER: true,
  DELETE_NEWSLETTER: true,
  CREATE_EVENT: true,
  EDIT_EVENT: true,
  DELETE_EVENT: true,
  CREATE_NOTIFICATION: true,
  EDIT_NOTIFICATION: true,
  DELETE_NOTIFICATION: true,
} as const;

// Tipos de permisos
export type AdminPermission = keyof typeof ADMIN_PERMISSIONS; 