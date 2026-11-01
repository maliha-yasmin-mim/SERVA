import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const freeItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide item title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please describe the item you want to give away'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category']
    },
    condition: {
      type: String,
      enum: ['Like New', 'Good', 'Fair', 'Needs TLC'],
      default: 'Good'
    },
    location: {
      type: String,
      required: [true, 'Please provide pickup location']
    },
    pickupInstructions: {
      type: String,
      default: 'Self pickup required'
    },
    availableUntil: {
      type: Date
    },
    images: {
      type: [String],
      default: []
    },
    giver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(STATUS.FREE_ITEM),
      default: STATUS.FREE_ITEM.AVAILABLE
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        note: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

freeItemSchema.index({ category: 1, location: 1, status: 1 });
freeItemSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('FreeItem', freeItemSchema);
