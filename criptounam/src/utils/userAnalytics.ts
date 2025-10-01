// Utilidades para obtener información detallada del usuario
export interface UserAnalytics {
  // Información básica
  timestamp: string;
  userAgent: string;
  language: string;
  timezone: string;
  
  // Información de red
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  
  // Información del dispositivo
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  screenResolution: string;
  
  // Información de la sesión
  referrer: string;
  currentUrl: string;
  sessionId: string;
  
  // Información de wallet (si está conectada)
  walletAddress?: string;
  walletProvider?: string;
  
  // Información adicional
  isFirstVisit: boolean;
  visitCount: number;
}

// Función para detectar el tipo de dispositivo
const getDeviceType = (userAgent: string): 'desktop' | 'mobile' | 'tablet' => {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const tabletRegex = /iPad|Android(?=.*\bMobile\b)/i;
  
  if (tabletRegex.test(userAgent)) return 'tablet';
  if (mobileRegex.test(userAgent)) return 'mobile';
  return 'desktop';
};

// Función para detectar el navegador
const getBrowser = (userAgent: string): string => {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown';
};

// Función para detectar el sistema operativo
const getOS = (userAgent: string): string => {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown';
};

// Función para obtener la resolución de pantalla
const getScreenResolution = (): string => {
  return `${window.screen.width}x${window.screen.height}`;
};

// Función para generar un ID de sesión único
const generateSessionId = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Función para obtener información de IP y ubicación (usando un servicio gratuito)
const getLocationInfo = async (): Promise<{ip?: string, country?: string, city?: string, region?: string}> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return {
      ip: data.ip,
      country: data.country_name,
      city: data.city,
      region: data.region
    };
  } catch (error) {
    console.error('Error obteniendo información de ubicación:', error);
    return {};
  }
};

// Función principal para obtener analytics del usuario
export const getUserAnalytics = async (walletAddress?: string, walletProvider?: string): Promise<UserAnalytics> => {
  const now = new Date();
  const userAgent = navigator.userAgent;
  
  // Obtener información de ubicación
  const locationInfo = await getLocationInfo();
  
  // Obtener información de la sesión
  const sessionId = sessionStorage.getItem('sessionId') || generateSessionId();
  sessionStorage.setItem('sessionId', sessionId);
  
  // Contar visitas
  const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
  localStorage.setItem('visitCount', visitCount.toString());
  
  // Verificar si es la primera visita
  const isFirstVisit = !localStorage.getItem('hasVisited');
  if (isFirstVisit) {
    localStorage.setItem('hasVisited', 'true');
  }
  
  return {
    // Información básica
    timestamp: now.toISOString(),
    userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Información de red
    ...locationInfo,
    
    // Información del dispositivo
    deviceType: getDeviceType(userAgent),
    browser: getBrowser(userAgent),
    os: getOS(userAgent),
    screenResolution: getScreenResolution(),
    
    // Información de la sesión
    referrer: document.referrer || 'Direct',
    currentUrl: window.location.href,
    sessionId,
    
    // Información de wallet
    walletAddress,
    walletProvider,
    
    // Información adicional
    isFirstVisit,
    visitCount
  };
};

// Función para formatear la información del usuario para Telegram
export const formatUserInfoForTelegram = (analytics: UserAnalytics): string => {
  const lines = [
    `🕐 **Hora:** ${new Date(analytics.timestamp).toLocaleString('es-ES')}`,
    `🌍 **Ubicación:** ${analytics.city || 'N/A'}, ${analytics.region || 'N/A'}, ${analytics.country || 'N/A'}`,
    `🌐 **IP:** ${analytics.ip || 'N/A'}`,
    `📱 **Dispositivo:** ${analytics.deviceType} (${analytics.os})`,
    `🔍 **Navegador:** ${analytics.browser}`,
    `📺 **Resolución:** ${analytics.screenResolution}`,
    `🌐 **Idioma:** ${analytics.language}`,
    `⏰ **Zona Horaria:** ${analytics.timezone}`,
    `🔗 **Referrer:** ${analytics.referrer}`,
    `🆔 **Sesión:** ${analytics.sessionId}`,
    `👤 **Visitas:** ${analytics.visitCount}${analytics.isFirstVisit ? ' (Primera visita)' : ''}`
  ];
  
  if (analytics.walletAddress) {
    lines.push(`💰 **Wallet:** ${analytics.walletAddress}`);
    lines.push(`🔌 **Provider:** ${analytics.walletProvider || 'N/A'}`);
  }
  
  return lines.join('\n');
};
