'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { motion } from 'framer-motion'
import LogoutButton from '@/components/LogoutButton'
import DashboardToggle from '@/components/DashboardToggle'






type Note = {
  _id: string
  title: string
  content: string
  createdAt: string
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await fetch('/api/notes')
      const data = await res.json()
      setNotes(data)
    }
    fetchNotes()
  }, [])

  const handleSaveNote = async () => {
    if (!title || !content) return toast.error('Title & content required')

    if (editingId) {
      const res = await fetch(`/api/notes/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) return toast.error('Update failed')

      const updated = await res.json()
      setNotes(notes.map((note) => (note._id === editingId ? updated : note)))
      toast.success('Note updated!')
      setEditingId(null)
    } else {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      })

      if (!res.ok) return toast.error('Failed to create note')

      const newNote = await res.json()
      setNotes([newNote, ...notes])
      toast.success('Note added!')
    }

    setTitle('')
    setContent('')
  }

  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditingId(note._id)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' })
    if (!res.ok) return toast.error('Delete failed')

    setNotes(notes.filter((note) => note._id !== id))
    toast.success('Note deleted!')
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📝 Dashboard - Notes App by <span className="text-primary">Animesh</span>
      </h1>

      <div className="text-center mb-4">
        <LogoutButton />
      </div>

      <div className="p-4">
        <DashboardToggle />
      </div>

      <div className="max-w-xl mx-auto mb-6 space-y-4">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />

        <Button onClick={handleSaveNote} className="w-full">
          {editingId ? '✅ Update Note' : '➕ Add Note'}
        </Button>

        {editingId && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setEditingId(null)
              setTitle('')
              setContent('')
            }}
          >
            ❌ Cancel Edit
          </Button>
        )}
      </div>

      <div className="grid gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3">
        {notes.map((note) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-4 bg-card text-card-foreground shadow transition-colors">
              <h2 className="font-bold text-lg">{note.title}</h2>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                {note.content}
              </p>
              <p className="text-xs mt-3 text-muted-foreground">
                {new Date(note.createdAt).toLocaleString()}
              </p>

              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={() => handleEdit(note)}>
                  📝 Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(note._id)}
                >
                  🗑 Delete
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
