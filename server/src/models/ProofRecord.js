import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const proofRecordSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(STATUS.PROOFBOX),
      default: STATUS.PROOFBOX.IN_PROGRESS
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    beforeImages: [
      {
        url: { type: String, required: true },
        note: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    afterImages: [
      {
        url: { type: String, required: true },
        note: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    checklist: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        isRequired: { type: Boolean, default: true },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date },
        completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    progressUpdates: [
      {
        text: { type: String, required: true },
        imageUrl: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    approvalHistory: [
      {
        action: { type: String, enum: ['Approved', 'Corrections Requested'] },
        reason: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    clientFeedback: {
      type: String,
      default: ''
    },
    completionReportId: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  { timestamps: true }
);

proofRecordSchema.index({ job: 1, provider: 1 });
proofRecordSchema.index({ client: 1 });

export default mongoose.model('ProofRecord', proofRecordSchema);
