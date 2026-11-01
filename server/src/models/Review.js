import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please provide review comments'],
      trim: true
    }
  },
  { timestamps: true }
);

// Prevent multiple reviews on the same job by the same reviewer
reviewSchema.index(
  { reviewer: 1, job: 1 },
  { unique: true, partialFilterExpression: { job: { $type: 'objectId' } } }
);

export default mongoose.model('Review', reviewSchema);
