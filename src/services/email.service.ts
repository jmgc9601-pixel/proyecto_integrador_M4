import { auth } from './firebase/config'

/**
 * Tipos de notificación soportados por el endpoint serverless.
 */
export type EmailNotificationType = 'task_created' | 'task_completed'

/**
 * Envía una notificación al usuario autenticado.
 * No bloquea el CRUD si falla el envío.
 */
export const sendTaskEmail = async (
  type: EmailNotificationType,
  taskTitle: string
): Promise<void> => {
  const user = auth.currentUser
  if (!user) return

  let token: string

  try {
    token = await user.getIdToken()
  } catch {
    console.warn('[email.service] No se pudo obtener el token de autenticación.')
    return
  }

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ type, taskTitle }),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      console.warn(
        '[email.service] El servidor rechazó el correo:',
        data.error ?? response.status
      )
    }
  } catch (err) {
    console.warn('[email.service] No se pudo enviar la notificación por correo:', err)
  }
}

