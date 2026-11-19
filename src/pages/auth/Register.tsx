import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ThemeToggle } from '../../components/common/ThemeToggle'

/**
 * Traduce códigos de error de Firebase Authentication para el registro de usuarios.
 */
const getRegisterErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Ya existe una cuenta registrada con este correo electrónico.'
      case 'auth/invalid-email':
        return 'El formato del correo electrónico no es válido.'
      case 'auth/weak-password':
        return 'La contraseña es muy débil. Debe tener al menos 6 caracteres.'
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu conexión a internet.'
      default:
        return 'No se pudo crear la cuenta. Por favor, intenta nuevamente.'
    }
  }
  return 'Ocurrió un error inesperado al registrar la cuenta.'
}

/**
 * Vista de registro de nuevos usuarios en MateCode.
 */
export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedEmail = email.trim()

    // 1. Validaciones de campos obligatorios
    if (!trimmedEmail || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Por favor, completa todos los campos obligatorios.')
      return
    }

    // 2. Validación de formato de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Por favor, ingresa un correo electrónico válido (ej. usuario@dominio.com).')
      return
    }

    // 3. Validación de longitud mínima de contraseña (al menos 6 caracteres)
    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    // 4. Validación de coincidencia de contraseñas
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.')
      return
    }

    try {
      setIsSubmitting(true)
      await register(trimmedEmail, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setErrorMessage(getRegisterErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="app-container"
      style={{
        minHeight: '85vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Botón flotante superior de cambio de tema */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <ThemeToggle compact />
      </div>

      <div
        className="card"
        style={{
          maxWidth: '440px',
          width: '100%',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.5px',
              marginBottom: '6px',
            }}
          >
            MateCode
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Crea tu cuenta y organiza tus proyectos de forma inteligente
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
              htmlFor="register-email"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Correo Electrónico
            </label>
            <input
              id="register-email"
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
              htmlFor="register-password"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Contraseña (mínimo 6 caracteres)
            </label>
            <input
              id="register-password"
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="confirm-password"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Confirmar Contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite tu contraseña"
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
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            style={{
              color: 'var(--primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
