'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import LogoutButton from '@/components/LogoutButton'
import DashboardToggle from '@/components/DashboardToggle'

type Todo = {
  _id: string
  text: string
  completed: boolean
  createdAt: string
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch('/api/todos')
      if (!res.ok) return toast.error('Failed to load todos')
      const data = await res.json()
      setTodos(data)
    }
    fetchTodos()
  }, [])

  const handleSave = async () => {
    if (!text.trim()) return toast.error('Text required')

    if (editingId) {
      const res = await fetch(`/api/todos/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) return toast.error('Update failed')

      const updated = await res.json()
      setTodos(todos.map((todo) => (todo._id === editingId ? updated : todo)))
      toast.success('Todo updated!')
      setEditingId(null)
    } else {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (!res.ok) return toast.error('Add failed')
      const newTodo = await res.json()
      setTodos([newTodo, ...todos])
      toast.success('Todo added!')
    }

    setText('')
  }

  const toggleCompleted = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed }),
    })

    if (!res.ok) return toast.error('Toggle failed')

    const updated = await res.json()
    setTodos(todos.map((todo) => (todo._id === id ? updated : todo)))
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (!res.ok) return toast.error('Delete failed')
    setTodos(todos.filter((todo) => todo._id !== id))
    toast.success('Todo deleted!')
  }

  const handleEdit = (todo: Todo) => {
    setEditingId(todo._id)
    setText(todo.text)
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ✅ Dashboard - ToDos App by <span className="text-primary">Animesh</span>
      </h1>

      <div className="text-center mb-4">
        <LogoutButton />
      </div>

      <div className="p-4">
        <DashboardToggle />
      </div>

      <div className="max-w-xl mx-auto mb-6 space-y-4">
        <Input
          placeholder="Enter a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleSave} className="w-full">
          {editingId ? '✅ Update ToDo' : '➕ Add ToDo'}
        </Button>
        {editingId && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setEditingId(null)
              setText('')
            }}
          >
            ❌ Cancel Edit
          </Button>
        )}
      </div>

      <div className="grid gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3">
        {todos.map((todo) => (
          <Card key={todo._id} className="p-4 bg-card text-card-foreground shadow space-y-2 transition-colors">
            <p className={`${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
              {todo.text}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(todo.createdAt).toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button size="sm" onClick={() => toggleCompleted(todo._id, todo.completed)}>
                {todo.completed ? '🔄 Mark Incomplete' : '✅ Mark Complete'}
              </Button>
              <Button size="sm" onClick={() => handleEdit(todo)}>✏️ Edit</Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(todo._id)}>
                🗑 Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
