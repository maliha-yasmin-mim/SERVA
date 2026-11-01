import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    introduction: {
      type: String,
      required: [true, 'Please introduce yourself and explain your capability for this job'],
      trim: true
    },
    skills: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: ''
    },
    availability: {
      type: String,
      default: 'Available immediately'
    },
    proposedPayment: {
      type: Number
    },
    cvPath: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: Object.values(STATUS.APPLICATION),
      default: STATUS.APPLICATION.APPLIED
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
