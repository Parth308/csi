// lib/models/Registration.ts

import mongoose from 'mongoose';

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  year: { type: String, required: true },
  branch: { type: String, required: true },
  officialEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const RegistrationSchema = new mongoose.Schema({
  members: {
    type: [MemberSchema],
    validate: {
      validator: function (arr: any[]) {
        return arr.length >= 1; // At least one member required
      },
      message: 'At least one member is required.',
    },
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Registration ||
  mongoose.model('Registration', RegistrationSchema);