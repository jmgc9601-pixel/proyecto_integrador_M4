import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

/**
 * Vista principal de MateCode para usuarios autenticados.
 */
export const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      navigate('/login')
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="app-container">
      {/* Barra de navegación superior */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.5px',
            }}
          >
            MateCode
          </span>
          <span
            className="badge"
            style={{
              marginLeft: '10px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              color: 'var(--primary)',
              fontSize: '11px',
            }}
          >
            Workspace
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sesión activa</span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-primary)',
              }}
            >
              {user?.email ?? 'Usuario'}
            </span>
          </div>

          <button
            type="button"
            className="btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--danger)',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              padding: '8px 14px',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              opacity: isLoggingOut ? 0.6 : 1,
            }}
          >
            {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </button>
        </div>
      </header>

      {/* Tarjeta de Bienvenida */}
      <section
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-muted) 100%)',
          borderColor: 'var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span
            className="badge"
            style={{ backgroundColor: 'var(--accent-pink)', color: '#ffffff' }}
          >
            Panel Principal
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Autenticación verificada
          </span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '6px' }}>
          ¡Bienvenido/a a tu gestor de tareas!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '650px', lineHeight: 1.5 }}>
          Has iniciado sesión correctamente en MateCode. Desde aquí podrás organizar tus proyectos,
          seguir tus entregas y colaborar con tu equipo en tiempo real.
        </p>
      </section>

      {/* Resumen de Métricas (Previsualización) */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total de Tareas
          </span>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            0
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            En Progreso
          </span>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
            0
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Completadas
          </span>
          <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            0
          </p>
        </div>
      </section>

      {/* Espacio reservado para la futura gestión de tareas */}
      <section
        className="card"
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          borderStyle: 'dashed',
          borderWidth: '2px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 16px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          📋
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
          Módulo de Tareas en Preparación
        </h2>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '14px',
            maxWidth: '480px',
            margin: '0 auto 20px',
            lineHeight: 1.5,
          }}
        >
          En el próximo paso conectaremos <strong>Cloud Firestore</strong> para permitirte crear,
          editar, filtrar y marcar tus tareas como completadas en tiempo real.
        </p>
        <button
          type="button"
          className="btn"
          disabled
          style={{
            backgroundColor: 'var(--bg-muted)',
            color: 'var(--text-muted)',
            borderColor: 'var(--border-color)',
            cursor: 'not-allowed',
          }}
        >
          + Nueva Tarea (Próximamente)
        </button>
      </section>
    </div>
  )
}

