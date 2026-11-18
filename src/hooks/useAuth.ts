import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import type { AuthContextType } from '../context/AuthContext'

/**
 * Hook personalizado para acceder de forma sencilla y segura al estado de autenticación.
 * Lanza un error descriptivo si se intenta invocar fuera del árbol de un AuthProvider.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === null) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }

  return context
}

