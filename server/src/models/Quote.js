import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const quoteSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
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
    requirements: {
      type: String,
      required: [true, 'Please provide details of what you need']
    },
    budget: {
      type: Number
    },
    preferredDate: {
      type: String,
      default: 'Flexible'
    },
    status: {
      type: String,
      enum: Object.values(STATUS.QUOTE),
      default: STATUS.QUOTE.PENDING
    },
    providerResponse: {
      quotedPrice: Number,
      notes: String,
      respondedAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model('Quote', quoteSchema);
