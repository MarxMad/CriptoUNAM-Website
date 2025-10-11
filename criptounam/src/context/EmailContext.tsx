// Contexto para manejo de estado de emails
import React, { createContext, useContext, useReducer, ReactNode } from 'react'

interface EmailState {
  subscriptions: any[]
  templates: any[]
  queue: any[]
  analytics: any[]
  isLoading: boolean
  error: string | null
  success: boolean
}

interface EmailAction {
  type: 'SET_LOADING' | 'SET_ERROR' | 'SET_SUBSCRIPTIONS' | 'SET_TEMPLATES' | 'SET_QUEUE' | 'SET_ANALYTICS' | 'ADD_TO_QUEUE' | 'REMOVE_FROM_QUEUE' | 'CLEAR_ERROR'
  payload?: any
}

const initialState: EmailState = {
  subscriptions: [],
  templates: [],
  queue: [],
  analytics: [],
  isLoading: false,
  error: null,
  success: false
}

const emailReducer = (state: EmailState, action: EmailAction): EmailState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'SET_SUBSCRIPTIONS':
      return { ...state, subscriptions: action.payload }
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload }
    case 'SET_QUEUE':
      return { ...state, queue: action.payload }
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] }
    case 'REMOVE_FROM_QUEUE':
      return { ...state, queue: state.queue.filter(item => item.id !== action.payload) }
    default:
      return state
  }
}

interface EmailContextType {
  state: EmailState
  dispatch: React.Dispatch<EmailAction>
  addSubscription: (email: string, preferences: any) => Promise<boolean>
  removeSubscription: (email: string) => Promise<boolean>
  sendNewsletter: (newsletter: any) => Promise<boolean>
  getAnalytics: (emailId: string) => Promise<any[]>
}

const EmailContext = createContext<EmailContextType | undefined>(undefined)

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(emailReducer, initialState)

  const addSubscription = async (email: string, preferences: any): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, preferences })
      })

      if (response.ok) {
        const newSubscription = await response.json()
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: [...state.subscriptions, newSubscription] })
        return true
      } else {
        const error = await response.json()
        dispatch({ type: 'SET_ERROR', payload: error.message })
        return false
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeSubscription = async (email: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        dispatch({ type: 'SET_SUBSCRIPTIONS', payload: state.subscriptions.filter(sub => sub.email !== email) })
        return true
      } else {
        const error = await response.json()
        dispatch({ type: 'SET_ERROR', payload: error.message })
        return false
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const sendNewsletter = async (newsletter: any): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/email/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newsletter)
      })

      if (response.ok) {
        return true
      } else {
        const error = await response.json()
        dispatch({ type: 'SET_ERROR', payload: error.message })
        return false
      }
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Error de conexión' })
      return false
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const getAnalytics = async (emailId: string): Promise<any[]> => {
    try {
      const response = await fetch(`/api/email/analytics/${emailId}`)
      if (response.ok) {
        const analytics = await response.json()
        dispatch({ type: 'SET_ANALYTICS', payload: analytics })
        return analytics
      }
      return []
    } catch (err) {
      console.error('Error obteniendo analytics:', err)
      return []
    }
  }

  return (
    <EmailContext.Provider value={{
      state,
      dispatch,
      addSubscription,
      removeSubscription,
      sendNewsletter,
      getAnalytics
    }}>
      {children}
    </EmailContext.Provider>
  )
}

export const useEmailContext = (): EmailContextType => {
  const context = useContext(EmailContext)
  if (!context) {
    throw new Error('useEmailContext debe ser usado dentro de EmailProvider')
  }
  return context
}
