// src/models/todo.model.ts
import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema)
export default Todo
