import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    phone: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    },
    bio: {
      type: String,
      default: 'Community member on SERVA.'
    },
    location: {
      type: String,
      default: 'Dhaka - Dhanmondi'
    },
    skills: {
      type: [String],
      default: []
    },
    servicesOffered: {
      type: [String],
      default: []
    },
    hourlyRate: {
      type: Number,
      default: 0
    },
    isAvailableNow: {
      type: Boolean,
      default: true
    },
    availabilitySchedule: {
      weekdays: { type: Boolean, default: true },
      weekends: { type: Boolean, default: true },
      evenings: { type: Boolean, default: false }
    },
    verificationStatus: {
      type: String,
      enum: ['Not Started', 'Submitted', 'Under Review', 'Verified', 'Rejected', 'Resubmission Required'],
      default: 'Not Started'
    },
    verificationDetails: {
      nidNumber: { type: String, default: '' },
      submittedAt: { type: Date },
      documentPath: { type: String, default: '' },
      reviewerNotes: { type: String, default: '' }
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    completedJobsCount: {
      type: Number,
      default: 0
    },
    cancellationCount: {
      type: Number,
      default: 0
    },
    responseTimeMinutes: {
      type: Number,
      default: 15
    },
    reliabilityScore: {
      type: Number,
      default: 95
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    savedServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    savedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
