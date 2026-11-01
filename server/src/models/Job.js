import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please describe the job'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category']
    },
    location: {
      type: String,
      required: [true, 'Please provide the job location']
    },
    budget: {
      type: Number,
      required: [true, 'Please provide budget or payment amount']
    },
    paymentType: {
      type: String,
      enum: ['Fixed', 'Hourly', 'Negotiable'],
      default: 'Fixed'
    },
    workDate: {
      type: String,
      default: 'Flexible'
    },
    startTime: {
      type: String,
      default: 'Morning'
    },
    expectedDuration: {
      type: String,
      default: '1-2 Days'
    },
    workersNeeded: {
      type: Number,
      default: 1
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    requirements: {
      type: [String],
      default: []
    },
    urgency: {
      type: String,
      enum: ['Low', 'Normal', 'Urgent'],
      default: 'Normal'
    },
    contactPreference: {
      type: String,
      enum: ['In-App Chat', 'Phone Call', 'Either'],
      default: 'In-App Chat'
    },
    images: {
      type: [String],
      default: []
    },
    poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(STATUS.JOB),
      default: STATUS.JOB.OPEN
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    applicationsCount: {
      type: Number,
      default: 0
    },
    deadline: {
      type: Date
    }
  },
  { timestamps: true }
);

jobSchema.index({ category: 1, location: 1, status: 1 });
jobSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Job', jobSchema);
