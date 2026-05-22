import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoRow } from '@/features/todos/components/TodoRow'
import type { Todo } from '@/features/todos/types/todo.types'

const mockTodo: Todo = {
  id: 'todo-1',
  text: 'Write enterprise tests',
  completed: false,
  priority: 'high',
  createdAt: new Date().toISOString(),
  userId: 'user-1',
}

describe('TodoRow', () => {
  it('renders the todo text', () => {
    render(
      <TodoRow
        todo={mockTodo}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Write enterprise tests')).toBeInTheDocument()
  })

  it('applies line-through style when completed', () => {
    render(
      <TodoRow
        todo={{ ...mockTodo, completed: true }}
        onToggle={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    const text = screen.getByText('Write enterprise tests')
    expect(text).toHaveClass('line-through')
  })

  it('calls onToggle with correct args when checkbox is clicked', async () => {
    const onToggle = vi.fn()
    const { container } = render(
      <TodoRow todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />,
    )
    const checkbox = container.querySelector(`#todo-check-${mockTodo.id}`)
    expect(checkbox).toBeInTheDocument()
    ;(checkbox as HTMLElement).click()
    expect(onToggle).toHaveBeenCalledWith({ id: 'todo-1', completed: true })
  })

  it('calls onDelete when delete button is clicked', () => {
    const onDelete = vi.fn()
    render(<TodoRow todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />)
    const deleteBtn = screen.getByLabelText(`Delete "${mockTodo.text}"`)
    deleteBtn.click()
    expect(onDelete).toHaveBeenCalledWith('todo-1')
  })

  it('shows Done badge only when completed', () => {
    const { rerender } = render(
      <TodoRow todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.queryByText('Done')).not.toBeInTheDocument()

    rerender(
      <TodoRow todo={{ ...mockTodo, completed: true }} onToggle={vi.fn()} onDelete={vi.fn()} />,
    )
    expect(screen.getByText('Done')).toBeInTheDocument()
  })
})
