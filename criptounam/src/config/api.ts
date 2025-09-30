// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // Cursos
  CURSOS: `${API_BASE_URL}/cursos`,
  CURSO: (id: string) => `${API_BASE_URL}/curso/${id}`,
  
  // Eventos
  EVENTOS: `${API_BASE_URL}/eventos`,
  EVENTO: (id: string) => `${API_BASE_URL}/evento/${id}`,
  
  // Newsletter
  NEWSLETTER: `${API_BASE_URL}/newsletter`,
  NEWSLETTER_ENTRY: (id: string) => `${API_BASE_URL}/newsletter/${id}`,
  
  // Upload
  UPLOAD: `${API_BASE_URL}/upload`,
  UPLOAD_MULTIPLE: `${API_BASE_URL}/upload-multiple`,
  
  // Notificaciones
  NOTIFICACIONES: `${API_BASE_URL}/notificaciones`,
};

export default API_BASE_URL;
