import type { IncomingMessage, ServerResponse } from 'node:http'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type EmailNotificationType = 'task_created' | 'task_completed'

interface EmailRequestBody {
  type: EmailNotificationType
  taskTitle: string
  userEmail: string
}

interface TokenInfoResponse {
  email?: string
  error?: string
  error_description?: string
}

// ---------------------------------------------------------------------------
// Validación del token de Firebase (mediante Google tokeninfo REST endpoint)
// ---------------------------------------------------------------------------

/**
 * Valida el ID token de Firebase usando la API pública de Google.
 * Devuelve el email del usuario si el token es válido, o lanza un error.
 */
const verifyFirebaseToken = async (idToken: string): Promise<string> => {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`

  const res = await fetch(url)
  const data = (await res.json()) as TokenInfoResponse

  if (!res.ok || data.error) {
    throw new Error(data.error_description ?? 'Token inválido o expirado.')
  }

  if (!data.email) {
    throw new Error('No se pudo extraer el email del token.')
  }

  return data.email
}

// ---------------------------------------------------------------------------
// Contenido del correo según el tipo de evento
// ---------------------------------------------------------------------------

interface EmailContent {
  subject: string
  html: string
  text: string
}

const buildEmailContent = (type: EmailNotificationType, taskTitle: string): EmailContent => {
  if (type === 'task_created') {
    return {
      subject: `📝 Nueva tarea creada: "${taskTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #6c63ff;">MateCode — Nueva tarea creada</h2>
          <p>Has creado una nueva tarea en tu tablero:</p>
          <div style="background: #f4f4f8; border-left: 4px solid #6c63ff; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
            <strong style="font-size: 1.1em;">${escapeHtml(taskTitle)}</strong>
          </div>
          <p style="color: #666;">Accede a tu Dashboard para gestionarla.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <small style="color: #999;">Este correo fue enviado automáticamente por MateCode.</small>
        </div>
      `,
      text: `MateCode — Nueva tarea creada\n\nHas creado la tarea: "${taskTitle}"\n\nAccede a tu Dashboard para gestionarla.`,
    }
  }

  // task_completed
  return {
    subject: `✅ Tarea completada: "${taskTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #22c55e;">MateCode — ¡Tarea completada!</h2>
        <p>¡Excelente trabajo! Has marcado una tarea como completada:</p>
        <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
          <strong style="font-size: 1.1em;">✓ ${escapeHtml(taskTitle)}</strong>
        </div>
        <p style="color: #666;">Sigue así. Accede a tu Dashboard para ver tus tareas pendientes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <small style="color: #999;">Este correo fue enviado automáticamente por MateCode.</small>
      </div>
    `,
    text: `MateCode — ¡Tarea completada!\n\nHas completado la tarea: "${taskTitle}"\n\n¡Sigue así!`,
  }
}

/** Escapa caracteres HTML para evitar inyecciones en el cuerpo del correo. */
const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

// ---------------------------------------------------------------------------
// Helpers HTTP
// ---------------------------------------------------------------------------

const sendJson = (res: ServerResponse, status: number, body: Record<string, unknown>): void => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = status
  res.end(JSON.stringify(body))
}

const readBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    req.on('error', reject)
  })

// ---------------------------------------------------------------------------
// Handler principal — Vercel Serverless Function
// ---------------------------------------------------------------------------

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  // 1. Solo aceptamos POST
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Método no permitido. Solo se aceptan solicitudes POST.' })
    return
  }

  // 2. Leer y parsear el cuerpo de la solicitud
  let body: EmailRequestBody
  try {
    const raw = await readBody(req)
    body = JSON.parse(raw) as EmailRequestBody
  } catch {
    sendJson(res, 400, { error: 'El cuerpo de la solicitud no es JSON válido.' })
    return
  }

  // 3. Validar campos obligatorios
  const { type, taskTitle, userEmail } = body

  if (!type || !taskTitle || !userEmail) {
    sendJson(res, 400, { error: 'Faltan campos obligatorios: type, taskTitle, userEmail.' })
    return
  }

  if (type !== 'task_created' && type !== 'task_completed') {
    sendJson(res, 400, { error: 'El campo "type" debe ser "task_created" o "task_completed".' })
    return
  }

  if (typeof taskTitle !== 'string' || taskTitle.trim() === '') {
    sendJson(res, 400, { error: 'El campo "taskTitle" debe ser una cadena no vacía.' })
    return
  }

  if (typeof userEmail !== 'string' || !userEmail.includes('@')) {
    sendJson(res, 400, { error: 'El campo "userEmail" no es un email válido.' })
    return
  }

  // 4. Validar token de Firebase Authentication
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendJson(res, 401, { error: 'Token de autenticación requerido.' })
    return
  }

  const idToken = authHeader.slice(7)

  try {
    await verifyFirebaseToken(idToken)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token inválido.'
    sendJson(res, 401, { error: `Autenticación fallida: ${message}` })
    return
  }

  // 5. Verificar que las credenciales de AWS estén configuradas
  const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SES_FROM_EMAIL } = process.env

  if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !SES_FROM_EMAIL) {
    // Degradación elegante: logueamos pero no bloqueamos al usuario
    console.warn(
      '[send-email] Variables de entorno de AWS no configuradas. El correo no se enviará.'
    )
    sendJson(res, 200, {
      success: true,
      message: 'Notificación registrada (AWS SES no está configurado en este entorno).',
    })
    return
  }

  // 6. Construir y enviar el correo mediante AWS SES
  const sesClient = new SESClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  })

  const emailContent = buildEmailContent(type, taskTitle.trim())

  const command = new SendEmailCommand({
    Source: SES_FROM_EMAIL,
    Destination: {
      ToAddresses: [userEmail],
    },
    Message: {
      Subject: {
        Data: emailContent.subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: emailContent.html,
          Charset: 'UTF-8',
        },
        Text: {
          Data: emailContent.text,
          Charset: 'UTF-8',
        },
      },
    },
  })

  try {
    await sesClient.send(command)
    sendJson(res, 200, { success: true, message: 'Correo enviado correctamente.' })
  } catch (err) {
    // No exponemos detalles internos del error al cliente
    console.error('[send-email] Error al enviar correo con AWS SES:', err)
    sendJson(res, 500, {
      error: 'No se pudo enviar el correo. Inténtalo de nuevo más tarde.',
    })
  }
}

