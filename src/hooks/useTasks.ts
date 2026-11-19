import { useEffect, useMemo, useState } from 'react'
import { useAuth } from './useAuth'
import {
  subscribeToUserTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  toggleTaskCompleted as apiToggleTaskCompleted,
} from '../services/firebase/tasks.service'
import { sendTaskEmail } from '../services/email.service'
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus, TaskPriority } from '../types/task.types'

const EMPTY_TASKS: Task[] = []

/**
 * Hook para gestionar el ciclo de vida de las tareas del usuario activo con Cloud Firestore.
 */
export const useTasks = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filtros locales
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TaskPriority>('all')

  useEffect(() => {
    // Si no hay usuario activo, la sincronización externa no se inicia
    if (!user) return

    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (updatedTasks) => {
        setTasks(updatedTasks)
        setLoading(false)
      },
      (err: Error) => {
        setError('Error al sincronizar las tareas: ' + err.message)
        setLoading(false)
      }
    )

    return () => {
      unsubscribe()
    }
  }, [user])

  const handleCreateTask = async (data: CreateTaskDTO): Promise<void> => {
    if (!user) throw new Error('Usuario no autenticado.')
    await apiCreateTask(user.uid, data)
    // Notificación fire-and-forget: no bloquea la UI si falla
    void sendTaskEmail('task_created', data.title)
  }

  const handleUpdateTask = async (taskId: string, data: UpdateTaskDTO): Promise<void> => {
    await apiUpdateTask(taskId, data)
  }

  const handleDeleteTask = async (taskId: string): Promise<void> => {
    await apiDeleteTask(taskId)
  }

  const handleToggleComplete = async (taskId: string, currentStatus: TaskStatus): Promise<void> => {
    const newStatus = await apiToggleTaskCompleted(taskId, currentStatus)
    // Notificación solo cuando la tarea pasa a "completada"
    if (newStatus === 'completed') {
      const task = tasks.find((t) => t.id === taskId)
      if (task) {
        void sendTaskEmail('task_completed', task.title)
      }
    }
  }

  // Si no hay usuario, usamos la constante estática inmutable
  const activeTasks = user ? tasks : EMPTY_TASKS
  const currentLoading = user ? loading : false

  // Filtrado reactivo en memoria
  const filteredTasks = useMemo(() => {
    if (!user) return EMPTY_TASKS

    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [user, tasks, searchTerm, statusFilter, priorityFilter])

  // Métricas para los contadores del Dashboard
  const stats = useMemo(() => {
    if (!user) return { total: 0, pending: 0, inProgress: 0, completed: 0 }

    const total = tasks.length
    const pending = tasks.filter((t) => t.status === 'pending').length
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length
    const completed = tasks.filter((t) => t.status === 'completed').length

    return { total, pending, inProgress, completed }
  }, [user, tasks])

  return {
    tasks: activeTasks,
    filteredTasks,
    loading: currentLoading,
    error,
    stats,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    toggleComplete: handleToggleComplete,
  }
}
