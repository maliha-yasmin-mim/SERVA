import Quote from '../models/Quote.js';
import Service from '../models/Service.js';
import Notification from '../models/Notification.js';
import { STATUS } from '../config/constants.js';

// @desc    Request a custom quote for a service
// @route   POST /api/quotes
export const requestQuote = async (req, res, next) => {
  try {
    const { serviceId, requirements, budget, preferredDate } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request a quote from yourself' });
    }

    const quote = await Quote.create({
      service: serviceId,
      provider: service.provider,
      client: req.user._id,
      requirements,
      budget: budget ? Number(budget) : service.startingPrice,
      preferredDate: preferredDate || 'Flexible',
      status: STATUS.QUOTE.PENDING
    });

    // Notify Service Provider
    await Notification.create({
      recipient: service.provider,
      sender: req.user._id,
      type: 'quote',
      title: 'New Service Quote Request',
      message: `${req.user.name} requested a quote for your service "${service.title}"`,
      link: `/dashboard/quotes`
    });

    res.status(201).json({ success: true, quote });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's sent quote requests
// @route   GET /api/quotes/my-requests
export const getMySentQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ client: req.user._id })
      .populate('service', 'title category startingPrice location')
      .populate('provider', 'name avatar rating verificationStatus')
      .sort({ createdAt: -1 });

    res.json({ success: true, quotes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get incoming quotes (for service provider)
// @route   GET /api/quotes/incoming
export const getIncomingQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ provider: req.user._id })
      .populate('service', 'title category startingPrice')
      .populate('client', 'name avatar location')
      .sort({ createdAt: -1 });

    res.json({ success: true, quotes });
  } catch (error) {
    next(error);
  }
};

// @desc    Provider responds to a quote
// @route   PATCH /api/quotes/:id/respond
export const respondQuote = async (req, res, next) => {
  try {
    const { quotedPrice, notes } = req.body;
    const quote = await Quote.findById(req.params.id).populate('client', 'name email');

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote request not found' });
    }

    if (quote.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to respond to this quote' });
    }

    quote.status = STATUS.QUOTE.RESPONDED;
    quote.providerResponse = {
      quotedPrice: Number(quotedPrice),
      notes: notes || 'Proposal ready. Looking forward to assisting you.',
      respondedAt: new Date()
    };

    await quote.save();

    await Notification.create({
      recipient: quote.client._id,
      sender: req.user._id,
      type: 'quote',
      title: 'Quote Offer Received',
      message: `Provider offered BDT ${quotedPrice} for your service request.`,
      link: `/dashboard/quotes`
    });

    res.json({ success: true, quote });
  } catch (error) {
    next(error);
  }
};
