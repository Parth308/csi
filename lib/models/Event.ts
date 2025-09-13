// lib/models/Event.ts

import mongoose from 'mongoose'

// Define question schema
const QuestionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['mcq', 'text', 'textarea', 'number'],
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: true,
  },
  // For MCQ questions
  options: [{
    type: String,
  }],
  // For text validation
  maxLength: Number,
  minLength: Number,
  placeholder: String,
})

// Define team schema for recruitment events
const TeamSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  maxMembers: {
    type: Number,
    default: null, // null means unlimited
  },
  questions: [QuestionSchema], // Team-specific questions
})

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
  eventType: {
    type: String,
    enum: ['team_registration', 'recruitment'],
    default: 'team_registration',
  },
  // For team registration events
  teamSize: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  // For recruitment events
  teams: [TeamSchema], // Available teams to choose from
  commonQuestions: [QuestionSchema], // Questions shown to all participants before team selection
  allowMultipleTeamSelection: {
    type: Boolean,
    default: false, // Can user apply to multiple teams
  },
}, {
  timestamps: true,
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)