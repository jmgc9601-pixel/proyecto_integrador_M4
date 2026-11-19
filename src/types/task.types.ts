/**
 * Estados posibles de una tarea en MateCode
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed'

/**
 * Niveles de prioridad disponibles para una tarea
 */
export type TaskPriority = 'low' | 'medium' | 'high'

/**
 * Modelo de datos de una tarea almacenada en Cloud Firestore
 */
export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  userId: string
  dueDate?: string
  createdAt: number
  updatedAt: number
}

/**
 * Datos requeridos para crear una nueva tarea
 */
export interface CreateTaskDTO {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

/**
 * Datos opcionales para actualizar una tarea existente
 */
export interface UpdateTaskDTO {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

