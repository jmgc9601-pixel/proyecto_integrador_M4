import { useContext } from 'react'
import { ThemeContext } from '../context/ThemeContext'
import type { ThemeContextType } from '../context/ThemeContext'

/**
 * Hook para acceder y conmutar el tema visual activo en MateCode.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (context === null) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider')
  }

  return context
}

