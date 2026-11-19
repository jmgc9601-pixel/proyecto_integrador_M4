import type { IncomingMessage, ServerResponse } from 'node:http'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { adminAuth } from './lib/firebase-admin.js'

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type EmailNotificationType = 'task_created' | 'task_completed'

interface EmailRequestBody {
  type: EmailNotificationType
  taskTitle: string
}

interface EmailContent {
  subject: string
  html: string
  text: string
}

// ---------------------------------------------------------------------------
// Escapar caracteres HTML
// ---------------------------------------------------------------------------

const escapeHtml = (str: string): string =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

// ---------------------------------------------------------------------------
// Construir contenido del correo
// ---------------------------------------------------------------------------

const buildEmailContent = (
  type: EmailNotificationType,
  taskTitle: string
): EmailContent => {
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

// ---------------------------------------------------------------------------
// Helpers HTTP
// ---------------------------------------------------------------------------

const sendJson = (
  res: ServerResponse,
  status: number,
  body: Record<string, unknown>
): void => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
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

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {

  // 1. Validar método HTTP
  if (req.method !== 'POST') {
    sendJson(res, 405, {
      error: 'Método no permitido. Solo se aceptan solicitudes POST.',
    })
    return
  }

  // 2. Leer y parsear el body
  let body: unknown

  try {
    const raw = await readBody(req)
    body = JSON.parse(raw)
  } catch {
    sendJson(res, 400, {
      error: 'El cuerpo de la solicitud no es JSON válido.',
    })
    return
  }

  // 3. Validar estructura del body
  if (
    typeof body !== 'object' ||
    body === null ||
    !('type' in body) ||
    !('taskTitle' in body)
  ) {
    sendJson(res, 400, {
      error: 'Faltan campos obligatorios.',
    })
    return
  }

  const { type, taskTitle } = body as EmailRequestBody

  if (type !== 'task_created' && type !== 'task_completed') {
    sendJson(res, 400, {
      error: 'El campo "type" debe ser "task_created" o "task_completed".',
    })
    return
  }

  if (
    typeof taskTitle !== 'string' ||
    taskTitle.trim() === ''
  ) {
    sendJson(res, 400, {
      error: 'El campo "taskTitle" debe ser una cadena no vacía.',
    })
    return
  }

  // 4. Validar token de Firebase Authentication
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendJson(res, 401, {
      error: 'Token de autenticación requerido.',
    })
    return
  }

  const idToken = authHeader.slice(7)

  let decodedToken: DecodedIdToken

  try {
    decodedToken = await adminAuth.verifyIdToken(idToken)
  } catch {
    sendJson(res, 401, {
      error: 'Token inválido o expirado.',
    })
    return
  }

  // El correo se obtiene exclusivamente del token autenticado
  const userEmail = decodedToken.email

  if (!userEmail) {
    sendJson(res, 401, {
      error: 'El usuario autenticado no tiene un correo asociado.',
    })
    return
  }

  // 5. Verificar configuración de AWS
  const {
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    SES_FROM_EMAIL,
  } = process.env

  if (
    !AWS_REGION ||
    !AWS_ACCESS_KEY_ID ||
    !AWS_SECRET_ACCESS_KEY ||
    !SES_FROM_EMAIL
  ) {
    console.warn(
      '[send-email] Variables de entorno de AWS no configuradas.'
    )

sendJson(res, 503, {
  success: false,
  error: 'El servicio de correo no está configurado.',
})
    return
  }

  // 6. Configurar AWS SES
  const sesClient = new SESClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
  })

  // 7. Construir correo
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

  // 8. Enviar correo
  try {
    await sesClient.send(command)

    sendJson(res, 200, {
      success: true,
      message: 'Correo enviado correctamente.',
    })
  } catch (err) {
    console.error(
      '[send-email] Error al enviar correo con AWS SES:',
      err
    )

    sendJson(res, 500, {
      error: 'No se pudo enviar el correo. Inténtalo de nuevo más tarde.',
    })
  }
}
