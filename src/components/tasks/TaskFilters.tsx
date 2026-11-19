import type { TaskStatus, TaskPriority } from '../../types/task.types'

interface TaskFiltersProps {
  searchTerm: string
  onSearchChange: (val: string) => void
  statusFilter: 'all' | TaskStatus
  onStatusFilterChange: (val: 'all' | TaskStatus) => void
  priorityFilter: 'all' | TaskPriority
  onPriorityFilterChange: (val: 'all' | TaskPriority) => void
  onNewTaskClick: () => void
}

export const TaskFilters = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onNewTaskClick,
}: TaskFiltersProps) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Fila 1: Búsqueda y Botón Nueva Tarea */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1', minWidth: '220px' }}>
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="🔍 Buscar por título o descripción..."
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
          type="button"
          onClick={onNewTaskClick}
          className="btn"
          style={{
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          + Nueva Tarea
        </button>
      </div>

      {/* Fila 2: Filtros de Estado y Prioridad */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Selector de Estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Estado:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {(
              [
                { id: 'all', label: 'Todas' },
                { id: 'pending', label: 'Pendientes' },
                { id: 'in_progress', label: 'En Progreso' },
                { id: 'completed', label: 'Completadas' },
              ] as const
            ).map((item) => {
              const active = statusFilter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onStatusFilterChange(item.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid',
                    borderColor: active ? 'var(--primary)' : 'var(--border-color)',
                    backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-muted)',
                    color: active ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selector de Prioridad */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Prioridad:
          </span>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value as 'all' | TaskPriority)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          >
            <option value="all">Todas</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </div>
    </div>
  )
}

