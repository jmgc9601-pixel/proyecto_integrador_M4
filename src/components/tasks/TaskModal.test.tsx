
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { TaskModal } from './TaskModal'

describe('TaskModal', () => {
  it('debe impedir crear una tarea sin título', () => {
    const onSubmit = vi.fn()
    const onClose = vi.fn()

    const { container } = render(
      <TaskModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialTask={null}
      />
    )

    const form = container.querySelector('form')
    expect(form).not.toBeNull()

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: '   ' },
    })

    fireEvent.submit(form as HTMLFormElement)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('debe enviar los datos cuando el título es válido', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onClose = vi.fn()

    const { container } = render(
      <TaskModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialTask={null}
      />
    )

    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: '  Repasar React  ' },
    })

    const form = container.querySelector('form')
    expect(form).not.toBeNull()

    fireEvent.submit(form as HTMLFormElement)

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Repasar React',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      })
    })

    expect(onClose).toHaveBeenCalled()
  })
})
