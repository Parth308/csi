// lib/models/Event.ts

import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an event name'],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide an event date'],
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  teamSize: {
    type: Number,
    default: 1, // Default to individual registration
    min: 1,
    max: 10, // Set reasonable limit
  },
}, {
  timestamps: true,
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)