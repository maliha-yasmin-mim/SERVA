import mongoose from 'mongoose';
import { STATUS } from '../config/constants.js';

const packageTierSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Basic Cleaning", "Deep Clean"
  description: { type: String, required: true },
  price: { type: Number, required: true },
  deliveryTime: { type: String, default: '1 Day' },
  features: { type: [String], default: [] }
});

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please describe your service'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select a category']
    },
    startingPrice: {
      type: Number,
      required: [true, 'Please provide starting price']
    },
    pricingModel: {
      type: String,
      enum: ['Hourly', 'Fixed Package', 'Per Job', 'Custom Quote'],
      default: 'Hourly'
    },
    location: {
      type: String,
      required: [true, 'Please specify your service area or location']
    },
    availability: {
      type: String,
      default: 'Mon - Sat (9 AM - 7 PM)'
    },
    skills: {
      type: [String],
      default: []
    },
    portfolioImages: {
      type: [String],
      default: []
    },
    packages: [packageTierSchema],
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      default: 5.0
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: Object.values(STATUS.SERVICE),
      default: STATUS.SERVICE.ACTIVE
    }
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, location: 1, status: 1 });
serviceSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Service', serviceSchema);
