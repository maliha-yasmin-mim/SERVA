import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide item title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category']
    },
    price: {
      type: Number,
      required: [true, 'Please set a price (in BDT)']
    },
    condition: {
      type: String,
      enum: ['Brand New', 'Like New', 'Gently Used', 'Fair Condition'],
      default: 'Gently Used'
    },
    location: {
      type: String,
      required: [true, 'Please provide item location']
    },
    images: {
      type: [String],
      default: []
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: Object.values(STATUS.PRODUCT),
      default: STATUS.PRODUCT.AVAILABLE
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

productSchema.index({ category: 1, location: 1, status: 1 });
productSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
