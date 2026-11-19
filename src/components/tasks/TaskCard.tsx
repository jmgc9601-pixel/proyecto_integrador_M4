import type { Task, TaskStatus } from '../../types/task.types'

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string, currentStatus: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const getStatusBadge = (status: TaskStatus) => {
  switch (status) {
    case 'completed':
      return {
        label: '✓ Completada',
        bg: 'rgba(16, 185, 129, 0.15)',
        color: 'var(--success)',
      }
    case 'in_progress':
      return {
        label: '● En Progreso',
        bg: 'rgba(6, 182, 212, 0.15)',
        color: 'var(--accent-cyan)',
      }
    case 'pending':
    default:
      return {
        label: '○ Pendiente',
        bg: 'rgba(245, 158, 11, 0.15)',
        color: 'var(--warning)',
      }
  }
}

const getPriorityBadge = (priority: Task['priority']) => {
  switch (priority) {
    case 'high':
      return { label: 'Alta', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' }
    case 'medium':
      return { label: 'Media', color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' }
    case 'low':
    default:
      return { label: 'Baja', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' }
  }
}

export const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) => {
  const statusInfo = getStatusBadge(task.status)
  const priorityInfo = getPriorityBadge(task.priority)
  const isCompleted = task.status === 'completed'

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        opacity: isCompleted ? 0.75 : 1,
        transition: 'opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
        borderLeft: `4px solid ${statusInfo.color}`,
      }}
    >
      <div>
        {/* Metadatos superiores */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span
              className="badge"
              style={{
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                fontSize: '11px',
                padding: '3px 8px',
              }}
            >
              {statusInfo.label}
            </span>
            <span
              className="badge"
              style={{
                backgroundColor: priorityInfo.bg,
                color: priorityInfo.color,
                fontSize: '11px',
                padding: '3px 8px',
              }}
            >
              Prioridad: {priorityInfo.label}
            </span>
          </div>

          {task.dueDate && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              📅 {task.dueDate}
            </span>
          )}
        </div>

        {/* Título y descripción */}
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 700,
            marginBottom: '6px',
            color: 'var(--text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            wordBreak: 'break-word',
          }}
        >
          {task.title}
        </h3>

        {task.description && (
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {task.description}
          </p>
        )}
      </div>

      {/* Botones de acción */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <button
          type="button"
          onClick={() => onToggleComplete(task.id, task.status)}
          className="btn"
          style={{
            backgroundColor: isCompleted ? 'var(--bg-muted)' : 'var(--primary)',
            color: isCompleted ? 'var(--text-secondary)' : '#ffffff',
            fontSize: '12px',
            padding: '6px 12px',
          }}
        >
          {isCompleted ? 'Desmarcar' : '✓ Completar'}
        </button>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="btn"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              padding: '6px 10px',
            }}
            title="Editar tarea"
          >
            ✏️ Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            className="btn"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              fontSize: '12px',
              padding: '6px 10px',
            }}
            title="Eliminar tarea"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}

