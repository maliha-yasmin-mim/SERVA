import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';

// Generate mock secure transaction ID (e.g. TXN-SRV-987214)
const generateTxnId = (method) => {
  const prefix = method.slice(0, 3).toUpperCase();
  const rand = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now().toString().slice(-4);
  return `SRV-${prefix}-${timestamp}${rand}`;
};

/**
 * @desc Initiate a new online payment (bKash / Nagad / Rocket / SSLCommerz / COD)
 * @route POST /api/payments/initiate
 * @access Private
 */
export const initiatePayment = async (req, res) => {
  try {
    const {
      amount,
      paymentMethod,
      purpose,
      relatedJobId,
      relatedServiceId,
      relatedProductId,
      receiverId,
      payerPhone,
      notes
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method is required' });
    }

    const transactionId = generateTxnId(paymentMethod);
    const isInstantMethod = ['bKash', 'Nagad', 'Rocket', 'SSLCommerz', 'Card'].includes(paymentMethod);

    // Initial status: For simulated online payment it can be immediately 'Completed' or 'In Escrow'
    const status = purpose === 'Job Escrow' ? 'In Escrow' : (isInstantMethod ? 'Completed' : 'Pending');

    const payment = await Payment.create({
      payer: req.user._id,
      receiver: receiverId || null,
      amount,
      currency: 'BDT',
      paymentMethod,
      status,
      transactionId,
      purpose: purpose || 'Service Booking',
      relatedJob: relatedJobId || null,
      relatedService: relatedServiceId || null,
      relatedProduct: relatedProductId || null,
      paymentDetails: {
        payerPhone: payerPhone || req.user.phone || '',
        notes: notes || '',
        gatewayResponse: {
          gateway: paymentMethod,
          verified: true,
          timestamp: new Date().toISOString()
        }
      }
    });

    // Create notification for payer
    await Notification.create({
      recipient: req.user._id,
      title: 'Payment Successful',
      message: `Your payment of ৳${amount} via ${paymentMethod} (${transactionId}) was recorded successfully.`,
      type: 'system',
      link: '/dashboard/payments'
    });

    // If receiver specified, notify receiver
    if (receiverId) {
      await Notification.create({
        recipient: receiverId,
        title: 'Payment Received',
        message: `You received a payment of ৳${amount} for ${purpose} (${transactionId}).`,
        type: 'system',
        link: '/dashboard/payments'
      });
    }

    res.status(201).json({
      success: true,
      message: `Payment initiated successfully via ${paymentMethod}`,
      payment
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment initiation failed' });
  }
};

/**
 * @desc Get user's payment history
 * @route GET /api/payments/my-payments
 * @access Private
 */
export const getMyPayments = async (req, res) => {
  try {
    const { status, purpose, page = 1, limit = 15 } = req.query;
    const query = {
      $or: [{ payer: req.user._id }, { receiver: req.user._id }]
    };

    if (status && status !== 'All') {
      query.status = status;
    }
    if (purpose && purpose !== 'All') {
      query.purpose = purpose;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('payer', 'name email avatar phone')
        .populate('receiver', 'name email avatar phone')
        .populate('relatedJob', 'title category budget location')
        .populate('relatedService', 'title category startingPrice')
        .populate('relatedProduct', 'title price condition')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Payment.countDocuments(query)
    ]);

    // Calculate quick stats for user
    const stats = await Payment.aggregate([
      { $match: { payer: req.user._id, status: { $in: ['Completed', 'In Escrow'] } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const receivedStats = await Payment.aggregate([
      { $match: { receiver: req.user._id, status: 'Completed' } },
      { $group: { _id: null, totalEarned: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      payments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      },
      summary: {
        totalSpent: stats[0]?.totalSpent || 0,
        totalEarned: receivedStats[0]?.totalEarned || 0,
        totalTransactions: total
      }
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch payments' });
  }
};

/**
 * @desc Get single payment by transaction ID or ID
 * @route GET /api/payments/:id
 * @access Private
 */
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('payer', 'name email phone avatar')
      .populate('receiver', 'name email phone avatar')
      .populate('relatedJob')
      .populate('relatedService')
      .populate('relatedProduct');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    // Authorization: User must be payer, receiver, or admin
    const isAuthorized =
      payment.payer._id.toString() === req.user._id.toString() ||
      (payment.receiver && payment.receiver._id.toString() === req.user._id.toString()) ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this payment' });
    }

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/**
 * @desc Release escrow payment to receiver
 * @route POST /api/payments/:id/release-escrow
 * @access Private
 */
export const releaseEscrow = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (payment.payer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the payer can release escrow funds' });
    }

    if (payment.status !== 'In Escrow') {
      return res.status(400).json({ success: false, message: 'Payment is not in escrow status' });
    }

    payment.status = 'Completed';
    payment.paymentDetails.escrowReleasedAt = new Date();
    await payment.save();

    if (payment.receiver) {
      await Notification.create({
        recipient: payment.receiver,
        title: 'Escrow Released!',
        message: `৳${payment.amount} has been released to your account for completion of work.`,
        type: 'system',
        link: '/dashboard/payments'
      });
    }

    res.json({
      success: true,
      message: 'Escrow payment released successfully to provider',
      payment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

