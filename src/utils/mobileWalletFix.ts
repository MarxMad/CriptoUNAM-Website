// Utilidades para corregir el comportamiento del modal de wallet en móviles

let originalBodyOverflow = '';
let originalBodyPosition = '';
let originalBodyTop = '';

// Función para detectar si estamos en móvil
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         window.innerWidth <= 768;
};

// Función para obtener la altura real del viewport en móviles
export const getViewportHeight = (): number => {
  // Para iOS Safari, usar visualViewport si está disponible
  if (window.visualViewport) {
    return window.visualViewport.height;
  }
  
  // Para otros navegadores, usar window.innerHeight
  return window.innerHeight;
};

// Función para prevenir el scroll del body cuando el modal está abierto
export const preventBodyScroll = (): void => {
  if (isMobile()) {
    const scrollY = window.scrollY;
    originalBodyOverflow = document.body.style.overflow;
    originalBodyPosition = document.body.style.position;
    originalBodyTop = document.body.style.top;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
  }
};

// Función para restaurar el scroll del body
export const restoreBodyScroll = (): void => {
  if (isMobile()) {
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.position = originalBodyPosition;
    document.body.style.top = originalBodyTop;
    document.body.style.width = '';
    
    // Restaurar la posición del scroll
    const scrollY = parseInt(originalBodyTop || '0') * -1;
    window.scrollTo(0, scrollY);
  }
};

// Función para ajustar el z-index del modal
export const adjustModalZIndex = (): void => {
  const modal = document.querySelector('w3m-modal');
  if (modal && isMobile()) {
    (modal as HTMLElement).style.zIndex = '2147483647';
    (modal as HTMLElement).style.position = 'fixed';
    (modal as HTMLElement).style.inset = '0';
  }
};

// Función para centrar el modal en pantalla
export const centerModal = (): void => {
  const modal = document.querySelector('w3m-modal');
  if (modal && isMobile()) {
    const modalElement = modal as HTMLElement;
    const viewportHeight = getViewportHeight();
    const safeAreaTop = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0;
    const safeAreaBottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)')) || 0;
    
    // Calcular altura disponible considerando safe areas
    const availableHeight = viewportHeight - safeAreaTop - safeAreaBottom;
    
    modalElement.style.display = 'flex';
    modalElement.style.alignItems = 'center';
    modalElement.style.justifyContent = 'center';
    modalElement.style.padding = '5vh 1rem';
    modalElement.style.boxSizing = 'border-box';
    modalElement.style.height = `${availableHeight}px`;
    modalElement.style.minHeight = `${Math.min(400, availableHeight * 0.8)}px`;
    modalElement.style.maxHeight = `${availableHeight}px`;
    
    // Ajustar el contenido del modal
    const modalContainer = modal.shadowRoot?.querySelector('[part="container"]') as HTMLElement;
    if (modalContainer) {
      modalContainer.style.maxHeight = `${availableHeight * 0.8}px`;
      modalContainer.style.overflow = 'hidden';
    }
  }
};

// Función para aplicar todas las correcciones
export const applyMobileWalletFixes = (): void => {
  if (!isMobile()) return;

  // Observer para detectar cuando el modal se abre
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
        const modal = mutation.target as HTMLElement;
        if (modal && modal.tagName === 'W3M-MODAL') {
          if (modal.hasAttribute('open')) {
            // Modal se abrió
            setTimeout(() => {
              preventBodyScroll();
              adjustModalZIndex();
              centerModal();
            }, 50);
          } else {
            // Modal se cerró
            restoreBodyScroll();
          }
        }
      }
    });
  });

  // Observar cambios en el DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['open']
  });

  // También aplicar fixes cuando el modal ya existe
  const checkExistingModal = () => {
    const modal = document.querySelector('w3m-modal');
    if (modal) {
      adjustModalZIndex();
      if (modal.hasAttribute('open')) {
        preventBodyScroll();
        centerModal();
      }
    }
  };

  // Verificar periódicamente si existe el modal
  const interval = setInterval(() => {
    checkExistingModal();
    // Detener después de 10 segundos
    setTimeout(() => clearInterval(interval), 10000);
  }, 500);
};

// Función para limpiar event listeners
export const cleanupMobileWalletFixes = (): void => {
  restoreBodyScroll();
};

// Inicializar automáticamente cuando se carga el DOM
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyMobileWalletFixes);
  } else {
    applyMobileWalletFixes();
  }
}

// Limpiar cuando se descarga la página
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', cleanupMobileWalletFixes);
} 