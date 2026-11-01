import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    payer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [1, 'Amount must be at least 1 BDT']
    },
    currency: {
      type: String,
      default: 'BDT'
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'Nagad', 'Rocket', 'SSLCommerz', 'Card', 'Bank Transfer', 'Cash on Delivery'],
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Failed', 'Refunded', 'In Escrow'],
      default: 'Pending'
    },
    transactionId: {
      type: String,
      unique: true,
      required: true
    },
    purpose: {
      type: String,
      enum: ['Job Escrow', 'Service Booking', 'Marketplace Purchase', 'Verification Fee', 'Platform Service'],
      required: true
    },
    relatedJob: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    relatedService: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service'
    },
    relatedProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    paymentDetails: {
      accountNumber: String,
      gatewayResponse: Object,
      payerPhone: String,
      escrowReleasedAt: Date,
      notes: String
    }
  },
  { timestamps: true }
);

// Index for quick queries
paymentSchema.index({ payer: 1, createdAt: -1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });

export default mongoose.model('Payment', paymentSchema);

