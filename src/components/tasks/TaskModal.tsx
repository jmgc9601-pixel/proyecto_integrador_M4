import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Task, CreateTaskDTO, TaskStatus, TaskPriority } from '../../types/task.types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTaskDTO) => Promise<void>
  initialTask: Task | null
}

interface TaskModalFormProps {
  initialTask: Task | null
  onClose: () => void
  onSubmit: (data: CreateTaskDTO) => Promise<void>
}

/**
 * Formulario interno con estado derivado por clave (key) para evitar sincronizaciones innecesarias con useEffect.
 */
const TaskModalForm = ({ initialTask, onClose, onSubmit }: TaskModalFormProps) => {
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || 'pending')
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título de la tarea es obligatorio.')
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate,
      })
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la tarea.'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {initialTask ? 'Editar Tarea' : 'Nueva Tarea'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="btn"
          style={{
            padding: '4px 10px',
            backgroundColor: 'transparent',
            fontSize: '16px',
            color: 'var(--text-secondary)',
          }}
        >
          ✕
        </button>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Título */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="task-title"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Título *
          </label>
          <input
            id="task-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Diseñar la vista de tareas"
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Descripción */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="task-desc"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Descripción
          </label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles adicionales, enlaces o notas..."
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* Fila: Estado y Prioridad */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="task-status"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Estado
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En Progreso</option>
              <option value="completed">Completada</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label
              htmlFor="task-priority"
              style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
            >
              Prioridad
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        {/* Fecha límite */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label
            htmlFor="task-duedate"
            style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Fecha de entrega
          </label>
          <input
            id="task-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Botones de acción */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '12px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="btn"
            style={{
              backgroundColor: 'var(--bg-muted)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-color)',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn"
            style={{
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? 'Guardando...' : initialTask ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </>
  )
}

export const TaskModal = ({ isOpen, onClose, onSubmit, initialTask }: TaskModalProps) => {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <TaskModalForm
          key={initialTask ? initialTask.id : 'create-new-task'}
          initialTask={initialTask}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}
