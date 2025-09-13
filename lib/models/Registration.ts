// lib/models/Registration.ts

import mongoose from 'mongoose';

// Answer schema for questions
const AnswerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: {
    type: mongoose.Schema.Types.Mixed, // Can be string, number, or array for multiple selections
    required: true,
  },
}, { _id: false });

// Member schema for team registration events
const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  section: { type: String },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  officialEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
}, { _id: false });

// Participant schema for recruitment events
const ParticipantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  section: { type: String },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  officialEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  selectedTeams: [{ type: String }], // Array of team IDs
  commonAnswers: [AnswerSchema], // Answers to common questions
  teamAnswers: [{
    teamId: { type: String, required: true },
    answers: [AnswerSchema],
  }], // Answers specific to each team
}, { _id: false });

const RegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  eventType: {
    type: String,
    enum: ['team_registration', 'recruitment'],
    required: true,
  },
  // For team registration events
  members: {
    type: [MemberSchema],
    validate: {
      validator: function(this: { eventType: string }, arr: mongoose.Types.Array<unknown>) {
        // Only validate if this is a team registration
        if (this.eventType === 'team_registration') {
          return arr && arr.length >= 1;
        }
        return true;
      },
      message: 'At least one member is required for team registration.',
    },
  },
  // For recruitment events
  participant: ParticipantSchema,
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
RegistrationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Registration ||
  mongoose.model('Registration', RegistrationSchema);