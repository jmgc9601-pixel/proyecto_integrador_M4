import { useTheme } from '../../hooks/useTheme'

interface ThemeToggleProps {
  className?: string
  compact?: boolean
}

/**
 * Botón accesible para alternar entre tema claro y oscuro en cualquier pantalla de MateCode.
 */
export const ThemeToggle = ({ className = '', compact = false }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`btn ${className}`}
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
      aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
      style={{
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        borderColor: 'var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        fontSize: compact ? '13px' : '14px',
        padding: compact ? '6px 12px' : '8px 14px',
        cursor: 'pointer',
      }}
    >
      {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
    </button>
  )
}

