
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { sendTaskEmail } from './email.service'

vi.mock('./firebase/config', () => ({
  auth: {
    currentUser: {
      getIdToken: vi.fn().mockResolvedValue('token-de-prueba'),
    },
  },
}))

describe('email.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('fetch', vi.fn())
  })

  it('debe manejar un error del servidor sin interrumpir la aplicación', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ error: 'Error simulado' }),
    } as unknown as Response)

    await expect(
      sendTaskEmail('task_created', 'Tarea de prueba')
    ).resolves.toBeUndefined()

    expect(fetch).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('debe manejar un fallo de conexión sin interrumpir la aplicación', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    vi.mocked(fetch).mockRejectedValue(new Error('Error de conexión'))

    await expect(
      sendTaskEmail('task_created', 'Tarea de prueba')
    ).resolves.toBeUndefined()

    expect(fetch).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
