import { useState } from 'react'

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  return (
    <div className="app-container">
      {/* Encabezado Provisional */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.5px',
            }}
          >
            MateCode
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Gestión moderna e inteligente de tareas
          </p>
        </div>

        <button
          type="button"
          className="btn"
          onClick={toggleTheme}
          style={{
            backgroundColor: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </header>

      {/* Tarjeta de Estado del Proyecto */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span
            className="badge"
            style={{ backgroundColor: 'var(--primary)', color: 'hsl(0, 0%, 100%)' }}
          >
            Fase 1 Completada
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Entorno limpio y preparado
          </span>
        </div>

        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
          Arquitectura Base Lista
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '15px' }}>
          La plantilla demo de Vite ha sido limpiada con éxito. El sistema de variables
          CSS reactivo está activo y listo para soportar la paleta de colores de MateCode.
        </p>
      </section>

      {/* Muestra Visual de la Paleta de Colores */}
      <section className="card">
        <h3 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          Paleta de Colores Semántica
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
          }}
        >
          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: 'hsl(0, 0%, 100%)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Índigo (Principal)
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-pink)',
              color: 'hsl(0, 0%, 100%)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Rosa (Acento)
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent-cyan)',
              color: 'hsl(222, 47%, 11%)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Cian (Detalles)
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success)',
              color: 'hsl(0, 0%, 100%)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Verde (Éxito)
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning)',
              color: 'hsl(222, 47%, 11%)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Ámbar (Pendiente)
          </div>

          <div
            style={{
              padding: '14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--danger)',
              color: 'hsl(0, 0%, 100%)',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '13px',
            }}
          >
            Rojo (Urgente)
          </div>
        </div>
      </section>

      {/* Ejemplo de Tarjeta de Tarea Provisional */}
      <section className="card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <span
            className="badge"
            style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--warning)' }}
          >
            ● En Progreso
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Entrega: Hoy
          </span>
        </div>

        <h4 style={{ fontSize: '17px', marginBottom: '6px' }}>
          Configurar Firebase Authentication y Firestore
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          Esta tarjeta demuestra el comportamiento de las superficies, bordes y contrastes
          en ambos temas visuales.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'hsl(0, 0%, 100%)',
            }}
          >
            Completar Tarea
          </button>
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--danger)',
              borderColor: 'var(--border-color)',
            }}
          >
            Eliminar
          </button>
        </div>
      </section>
    </div>
  )
}

export default App
