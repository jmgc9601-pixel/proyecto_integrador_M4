import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Traduce códigos de error de Firebase Authentication a mensajes comprensibles para el usuario.
 */
const getAuthErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'El correo electrónico o la contraseña son incorrectos.'
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.'
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.'
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a internet.'
      default:
        return 'No se pudo iniciar sesión. Verifica tus datos e intenta nuevamente.'
    }
  }
  return 'Ocurrió un error inesperado. Por favor, intenta más tarde.'
}

/**
 * Vista de inicio de sesión de MateCode.
 */
export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    // Validación de campos vacíos
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, completa todos los campos.')
      return
    }

    try {
      setIsSubmitting(true)
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setErrorMessage(getAuthErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="app-container" style={{ minHeight: '80vh', justifyContent: 'center' }}>
      <div
        className="card"
        style={{
          maxWidth: '440px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.5px',
              marginBottom: '6px',
            }}
          >
            MateCode
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Inicia sesión para gestionar tus tareas
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              fontSize: '13px',
              marginBottom: '18px',
              lineHeight: 1.4,
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="email"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              disabled={isSubmitting}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="password"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            className="btn"
            disabled={isSubmitting}
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              padding: '12px',
              marginTop: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          ¿No tienes una cuenta?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

