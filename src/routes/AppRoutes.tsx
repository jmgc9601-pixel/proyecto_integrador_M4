import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { Login } from '../pages/auth/Login'
import { Register } from '../pages/auth/Register'
import { Dashboard } from '../pages/dashboard/Dashboard'

/**
 * Enrutador principal de la aplicación MateCode.
 * Define la navegación entre rutas públicas de autenticación y rutas protegidas.
 */
export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirección inicial hacia el panel principal */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Rutas públicas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas mediante ProtectedRoute */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Ruta comodín para capturar cualquier URL desconocida */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

