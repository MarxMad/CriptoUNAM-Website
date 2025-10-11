// Utilidades para testing
import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { BrowserRouter } from 'react-router-dom'

// Mock de wallet para testing
export const mockWallet = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  isConnected: true,
  connect: jest.fn(),
  disconnect: jest.fn(),
  signMessage: jest.fn(),
  sendTransaction: jest.fn()
}

// Mock de admin para testing
export const mockAdmin = {
  isAdmin: true,
  canCreateCourse: true,
  canDeleteCourse: true,
  canManageUsers: true
}

// Mock de datos de prueba
export const mockData = {
  cursos: [
    {
      id: '1',
      titulo: 'Curso de Blockchain',
      descripcion: 'Aprende los fundamentos de blockchain',
      nivel: 'Principiante',
      duracion: '4 semanas',
      instructor: 'Dr. Juan Pérez',
      precio: 100,
      imagen: 'https://example.com/curso1.jpg',
      enlace: 'https://example.com/curso1',
      fechaInicio: '2024-01-15',
      fechaFin: '2024-02-15',
      cupo: 50
    }
  ],
  eventos: [
    {
      id: '1',
      titulo: 'Conferencia Blockchain 2024',
      descripcion: 'La conferencia más importante del año',
      fecha: '2024-03-15',
      lugar: 'Auditorio Principal',
      imagen: 'https://example.com/evento1.jpg',
      enlace: 'https://example.com/evento1',
      cupo: 200
    }
  ],
  newsletters: [
    {
      id: '1',
      titulo: 'Noticias de CriptoUNAM',
      contenido: 'Contenido de la newsletter',
      autor: 'Equipo CriptoUNAM',
      fecha: '2024-01-01',
      imagen: 'https://example.com/newsletter1.jpg'
    }
  ]
}

// Wrapper personalizado para testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

// Función de render personalizada
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock de fetch
export const mockFetch = (data: any, status: number = 200) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data))
    })
  ) as jest.Mock
}

// Mock de localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}

// Mock de sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    })
  }
}

// Mock de window.ethereum
export const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn(),
  isMetaMask: true
}

// Mock de ResizeObserver
export const mockResizeObserver = () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
}

// Mock de IntersectionObserver
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
}

// Utilidades para testing de formularios
export const formTestUtils = {
  // Simular cambio en input
  changeInput: (element: HTMLElement, value: string) => {
    const input = element as HTMLInputElement
    input.value = value
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  },

  // Simular envío de formulario
  submitForm: (form: HTMLElement) => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  },

  // Simular click en botón
  clickButton: (button: HTMLElement) => {
    button.dispatchEvent(new Event('click', { bubbles: true }))
  }
}

// Utilidades para testing de API
export const apiTestUtils = {
  // Mock de respuesta exitosa
  mockSuccessResponse: (data: any) => ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(data)
  }),

  // Mock de respuesta de error
  mockErrorResponse: (status: number, message: string) => ({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message })
  }),

  // Mock de timeout
  mockTimeoutResponse: () => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 100)
    })
  }
}

// Utilidades para testing de componentes
export const componentTestUtils = {
  // Simular scroll
  simulateScroll: (element: HTMLElement, scrollTop: number) => {
    Object.defineProperty(element, 'scrollTop', {
      writable: true,
      value: scrollTop
    })
    element.dispatchEvent(new Event('scroll', { bubbles: true }))
  },

  // Simular resize
  simulateResize: (width: number, height: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height
    })
    window.dispatchEvent(new Event('resize'))
  },

  // Simular focus/blur
  simulateFocus: (element: HTMLElement) => {
    element.dispatchEvent(new Event('focus', { bubbles: true }))
  },

  simulateBlur: (element: HTMLElement) => {
    element.dispatchEvent(new Event('blur', { bubbles: true }))
  }
}

// Utilidades para testing de validación
export const validationTestUtils = {
  // Datos válidos para testing
  validEmail: 'test@example.com',
  validUrl: 'https://example.com',
  validWalletAddress: '0x1234567890abcdef1234567890abcdef12345678',
  validPhone: '+1234567890',

  // Datos inválidos para testing
  invalidEmail: 'invalid-email',
  invalidUrl: 'not-a-url',
  invalidWalletAddress: '0xinvalid',
  invalidPhone: '123',

  // Generar datos de prueba
  generateTestData: (count: number) => {
    return Array.from({ length: count }, (_, index) => ({
      id: `test-${index}`,
      name: `Test Item ${index}`,
      value: Math.random() * 100
    }))
  }
}

// Utilidades para testing de performance
export const performanceTestUtils = {
  // Medir tiempo de ejecución
  measureExecutionTime: async (fn: () => Promise<any>): Promise<number> => {
    const start = performance.now()
    await fn()
    const end = performance.now()
    return end - start
  },

  // Simular carga pesada
  simulateHeavyLoad: (duration: number = 1000) => {
    return new Promise(resolve => {
      setTimeout(resolve, duration)
    })
  },

  // Mock de métricas de performance
  mockPerformanceMetrics: () => {
    const mockMetrics = {
      loadTime: 1000,
      domContentLoaded: 500,
      firstPaint: 200,
      firstContentfulPaint: 300
    }

    Object.defineProperty(performance, 'getEntriesByType', {
      writable: true,
      value: jest.fn().mockReturnValue([mockMetrics])
    })
  }
}

// Configuración de testing
export const testConfig = {
  timeout: 10000,
  retries: 3,
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

// Re-exportar render personalizado
export * from '@testing-library/react'
export { customRender as render }
