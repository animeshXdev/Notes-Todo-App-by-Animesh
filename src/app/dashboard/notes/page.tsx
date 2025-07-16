'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch('/api/notes', {
          credentials: 'include',
        })
        const data = await res.json()
        setNotes(data)
      } catch (err) {
        toast.error('Failed to fetch notes')
        console.error(err)
      }
    }
    fetchNotes()
  }, [])

  const handleSaveNote = async () => {
    if (!title || !content) return toast.error('Title & content required')

    try {
      if (editingId) {
        const res = await fetch(`/api/notes/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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
          credentials: 'include',
          body: JSON.stringify({ title, content }),
        })

        if (!res.ok) return toast.error('Failed to create note')

        const newNote = await res.json()
        setNotes([newNote, ...notes])
        toast.success('Note added!')
      }

      setTitle('')
      setContent('')
    } catch (err) {
      toast.error('Error saving note')
      console.error(err)
    }
  }

  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setEditingId(note._id)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!res.ok) return toast.error('Delete failed')

      setNotes(notes.filter((note) => note._id !== id))
      toast.success('Note deleted!')
    } catch (err) {
      toast.error('Error deleting note')
      console.error(err)
    }
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

        <Button
          onClick={handleSaveNote}
          className="w-full"
          disabled={!title || !content}
        >
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

      {/* 🧾 Notes Grid */}
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
              <p className="mt-2 text-muted-foreground text-sm line-clamp-3">
                {note.content}
              </p>
              <p className="text-xs mt-3 text-muted-foreground">
                {new Date(note.createdAt).toLocaleString()}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" onClick={() => handleEdit(note)}>
                  📝 Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(note._id)}>
                  🗑 Delete
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedNote(note)}>
                  👁 View More
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 📄 Modal for full note view */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedNote?.title}</DialogTitle>
          </DialogHeader>
          <p className="whitespace-pre-wrap mt-2 text-muted-foreground">
            {selectedNote?.content}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
