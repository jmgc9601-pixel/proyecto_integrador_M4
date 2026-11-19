import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTasks } from '../../hooks/useTasks'
import { TaskCard } from '../../components/tasks/TaskCard'
import { TaskModal } from '../../components/tasks/TaskModal'
import { TaskFilters } from '../../components/tasks/TaskFilters'
import { ThemeToggle } from '../../components/common/ThemeToggle'
import type { Task, CreateTaskDTO, TaskStatus } from '../../types/task.types'

/**
 * Vista principal de MateCode para usuarios autenticados.
 * Integra métricas en tiempo real, gestión completa de tareas con Cloud Firestore y cambio de tema.
 */
export const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const {
    filteredTasks,
    loading: tasksLoading,
    error: tasksError,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks()

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      navigate('/login')
    } catch {
      setIsLoggingOut(false)
    }
  }

  const handleOpenCreate = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleSubmitTask = async (data: CreateTaskDTO) => {
    if (selectedTask) {
      await updateTask(selectedTask.id, data)
    } else {
      await createTask(data)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      await deleteTask(taskId)
    }
  }

  const handleToggleComplete = async (taskId: string, currentStatus: TaskStatus) => {
    await toggleComplete(taskId, currentStatus)
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
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--primary)',
              fontSize: '11px',
            }}
          >
            Workspace
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Selector de tema global */}
          <ThemeToggle compact />

          {/* Información del usuario */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sesión activa</span>
            <span
              style={{
                fontSize: '13px',
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
              padding: '6px 12px',
              cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              opacity: isLoggingOut ? 0.6 : 1,
            }}
          >
            {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
          </button>
        </div>
      </header>

      {/* Tarjeta de Bienvenida */}
      <section
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-muted) 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span
            className="badge"
            style={{ backgroundColor: 'var(--accent-pink)', color: '#ffffff', fontSize: '11px' }}
          >
            Panel Principal
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Cloud Firestore Sincronizado
          </span>
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>
          ¡Bienvenido/a a tu gestor de tareas!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '650px', lineHeight: 1.5 }}>
          Gestiona, prioriza y mantén al día tus objetivos. Las tareas se actualizan en tiempo real
          y están vinculadas de forma privada y segura a tu cuenta.
        </p>
      </section>

      {/* Resumen de Métricas */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
        }}
      >
        <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total de Tareas
          </span>
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {stats.total}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--warning)', padding: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Pendientes
          </span>
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
            {stats.pending}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)', padding: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            En Progreso
          </span>
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
            {stats.inProgress}
          </p>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--success)', padding: '16px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Completadas
          </span>
          <p style={{ fontSize: '26px', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
            {stats.completed}
          </p>
        </div>
      </section>

      {/* Barra de Filtros, Búsqueda y Crear Tarea */}
      <TaskFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        onNewTaskClick={handleOpenCreate}
      />

      {/* Manejo de errores de Firestore */}
      {tasksError && (
        <div
          role="alert"
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '13px',
          }}
        >
          {tasksError}
        </div>
      )}

      {/* Listado de Tareas */}
      <main>
        {tasksLoading ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <span style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              Cargando tus tareas desde Firestore...
            </span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              borderStyle: 'dashed',
              borderWidth: '2px',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                margin: '0 auto 12px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(99, 102, 241, 0.12)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
              }}
            >
              📝
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '6px' }}>
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No se encontraron tareas con estos filtros'
                : 'Aún no tienes tareas registradas'}
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                maxWidth: '420px',
                margin: '0 auto 18px',
                lineHeight: 1.5,
              }}
            >
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Prueba a cambiar tus criterios de búsqueda o restablecer los filtros.'
                : 'Comienza creando tu primera tarea para organizar tus proyectos de forma visual y eficiente.'}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="btn"
              style={{
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                margin: '0 auto',
              }}
            >
              + Crear mi primera tarea
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal para Crear y Editar Tareas */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        initialTask={selectedTask}
      />
    </div>
  )
}
