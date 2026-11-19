import { auth } from './firebase/config'

/**
 * Tipos de notificación soportados por el endpoint serverless.
 */
export type EmailNotificationType = 'task_created' | 'task_completed'

/**
 * Envía una notificación por correo electrónico al usuario autenticado
 * llamando a la función serverless de Vercel /api/send-email.
 *
 * Esta función es "fire-and-forget": no bloquea la UI si falla.
 * Los errores se registran en consola pero no se propagan.
 *
 * @param type - Tipo de evento que dispara el correo.
 * @param taskTitle - Título de la tarea relacionada.
 */
export const sendTaskEmail = async (
  type: EmailNotificationType,
  taskTitle: string
): Promise<void> => {
  const user = auth.currentUser
  if (!user) return

  const userEmail = user.email
  if (!userEmail) return

  let token: string
  try {
    token = await user.getIdToken()
  } catch {
    // Si no se puede obtener el token, no bloqueamos la UI
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
      body: JSON.stringify({ type, taskTitle, userEmail }),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string }
      console.warn('[email.service] El servidor rechazó el correo:', data.error ?? response.status)
    }
  } catch (err) {
    // Error de red: no interrumpimos el flujo principal
    console.warn('[email.service] No se pudo enviar la notificación por correo:', err)
  }
}

