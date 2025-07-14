import mongoose from 'mongoose'

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema)

export default Note
