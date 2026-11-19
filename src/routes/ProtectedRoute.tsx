import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Guardián de navegación para proteger rutas privadas.
 * Permite el acceso únicamente a usuarios autenticados con Firebase.
 */
export const ProtectedRoute = () => {
  const { user, loading } = useAuth()

  // Estado de espera mientras Firebase comprueba o restaura el token de sesión
  if (loading) {
    return (
      <div
        className="app-container"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="card" style={{ textAlign: 'center', padding: '32px 48px' }}>
          <div
            style={{
              fontSize: '24px',
              marginBottom: '12px',
              animation: 'pulse 1.5s infinite',
            }}
          >
            ⏳
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 600 }}>
            Verificando sesión en MateCode...
          </p>
        </div>
      </div>
    )
  }

  // Redirección si la comprobación terminó y no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Renderiza los componentes hijos de la ruta protegida
  return <Outlet />
}
