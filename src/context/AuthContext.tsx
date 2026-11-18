import { createContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User, UserCredential } from 'firebase/auth'
import {
  registerUser,
  loginUser,
  logoutUser,
  subscribeToAuthChanges,
} from '../services/firebase/auth.service'

/**
 * Contrato de datos y métodos expuestos por el contexto de autenticación.
 */
export interface AuthContextType {
  user: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<UserCredential>
  login: (email: string, password: string) => Promise<UserCredential>
  logout: () => Promise<void>
}

/**
 * Contexto de React para compartir el estado de la sesión de Firebase en toda la app.
 */
// oxlint-disable-next-line react/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Proveedor de autenticación que gestiona la reactividad del usuario y la carga inicial.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Suscripción al observador de Firebase Auth
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Limpieza de la suscripción al desmontar el componente
    return () => {
      unsubscribe()
    }
  }, [])

  const register = (email: string, password: string): Promise<UserCredential> => {
    return registerUser(email, password)
  }

  const login = (email: string, password: string): Promise<UserCredential> => {
    return loginUser(email, password)
  }

  const logout = (): Promise<void> => {
    return logoutUser()
  }

  const value: AuthContextType = {
    user,
    loading,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
