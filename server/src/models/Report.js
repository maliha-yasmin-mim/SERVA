import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    targetType: {
      type: String,
      enum: ['job', 'service', 'product', 'free-item', 'user'],
      required: true
    },
    targetId: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: [true, 'Please provide the reason for reporting']
    },
    details: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Dismissed', 'Action Taken'],
      default: 'Pending'
    },
    adminNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.model('Report', reportSchema);
