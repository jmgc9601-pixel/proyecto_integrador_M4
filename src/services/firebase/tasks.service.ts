import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import type { Unsubscribe, DocumentData, QuerySnapshot } from 'firebase/firestore'
import { auth, db } from './config'
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../../types/task.types'

const TASKS_COLLECTION = 'tasks'

/**
 * Suscribe a las tareas del usuario autenticado en tiempo real.
 * La consulta incluye `where('userId', '==', userId)`, lo cual coincide exactamente
 * con la regla de seguridad de Firestore `resource.data.userId == request.auth.uid`.
 */
export const subscribeToUserTasks = (
  userId: string,
  onSuccess: (tasks: Task[]) => void,
  onError: (error: Error) => void
): Unsubscribe => {
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    onSuccess([])
    return () => {}
  }

  const tasksRef = collection(db, TASKS_COLLECTION)
  const q = query(tasksRef, where('userId', '==', userId))

  let isSubscribed = true
  let currentUnsubscribe: (() => void) | null = null

  const attachListener = (isRetry = false) => {
    currentUnsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        if (!isSubscribed) return

        const tasks: Task[] = snapshot.docs.map((document) => {
          const data = document.data()
          return {
            id: document.id,
            title: (data.title as string) || '',
            description: (data.description as string) || '',
            status: (data.status as TaskStatus) || 'pending',
            priority: data.priority || 'medium',
            userId: (data.userId as string) || userId,
            dueDate: (data.dueDate as string) || '',
            createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
            updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
          }
        })

        // Ordenar cronológicamente descendente en memoria para evitar requerir índices compuestos en Firestore
        tasks.sort((a, b) => b.createdAt - a.createdAt)
        onSuccess(tasks)
      },
      (error) => {
        if (!isSubscribed) return

        // Si se produce un permission-denied justo al cambiar de ruta, puede haber un retraso
        // de milisegundos en la propagación del token de autenticación hacia el cliente de Firestore.
        // Hacemos un único reintento tras 600ms antes de emitir el error definitivo.
        if (!isRetry && error.code === 'permission-denied' && auth.currentUser) {
          setTimeout(() => {
            if (isSubscribed) {
              attachListener(true)
            }
          }, 600)
          return
        }

        if (error.code === 'permission-denied') {
          onError(
            new Error(
              'Permisos insuficientes en Cloud Firestore. Verifica haber publicado las reglas de seguridad en Firebase Console para la colección "tasks".'
            )
          )
        } else {
          onError(error)
        }
      }
    )
  }

  attachListener()

  return () => {
    isSubscribed = false
    if (currentUnsubscribe) {
      currentUnsubscribe()
    }
  }
}

/**
 * Crea una nueva tarea asociada al ID del usuario autenticado en Cloud Firestore.
 */
export const createTask = async (userId: string, data: CreateTaskDTO): Promise<string> => {
  if (!userId) {
    throw new Error('No se puede crear una tarea sin un usuario autenticado.')
  }

  const tasksRef = collection(db, TASKS_COLLECTION)
  const now = Date.now()

  const newTaskPayload = {
    title: data.title.trim(),
    description: data.description?.trim() || '',
    status: data.status || 'pending',
    priority: data.priority || 'medium',
    dueDate: data.dueDate || '',
    userId,
    createdAt: now,
    updatedAt: now,
  }

  const docRef = await addDoc(tasksRef, newTaskPayload)
  return docRef.id
}

/**
 * Actualiza una tarea existente asegurando que pertenezca al usuario.
 */
export const updateTask = async (taskId: string, data: UpdateTaskDTO): Promise<void> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)

  const payload: Record<string, unknown> = {
    updatedAt: Date.now(),
  }

  if (data.title !== undefined) payload.title = data.title.trim()
  if (data.description !== undefined) payload.description = data.description.trim()
  if (data.status !== undefined) payload.status = data.status
  if (data.priority !== undefined) payload.priority = data.priority
  if (data.dueDate !== undefined) payload.dueDate = data.dueDate

  await updateDoc(taskRef, payload)
}

/**
 * Elimina una tarea de Cloud Firestore.
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const taskRef = doc(db, TASKS_COLLECTION, taskId)
  await deleteDoc(taskRef)
}

/**
 * Conmuta el estado de completada de una tarea.
 */
export const toggleTaskCompleted = async (
  taskId: string,
  currentStatus: TaskStatus
): Promise<TaskStatus> => {
  const newStatus: TaskStatus = currentStatus === 'completed' ? 'pending' : 'completed'
  await updateTask(taskId, { status: newStatus })
  return newStatus
}
