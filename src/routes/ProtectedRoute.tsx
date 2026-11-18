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
    return <div>Verificando sesión...</div>
  }

  // Redirección si la comprobación terminó y no hay usuario autenticado
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Renderiza los componentes hijos de la ruta protegida
  return <Outlet />
}

