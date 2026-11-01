import FreeItem from '../models/FreeItem.js';
import Notification from '../models/Notification.js';
import AuditLog from '../models/AuditLog.js';
import { STATUS } from '../config/constants.js';

// @desc    Get all free giveaway items with filters
// @route   GET /api/free-items
export const getFreeItems = async (req, res, next) => {
  try {
    const { keyword, category, location, condition, status, page = 1, limit = 12 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    if (status) {
      query.status = status;
    } else {
      query.status = { $in: [STATUS.FREE_ITEM.AVAILABLE, STATUS.FREE_ITEM.RESERVED] };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await FreeItem.countDocuments(query);

    const items = await FreeItem.find(query)
      .populate('giver', 'name avatar location rating verificationStatus')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: items.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single free item by ID
// @route   GET /api/free-items/:id
export const getFreeItemById = async (req, res, next) => {
  try {
    const item = await FreeItem.findById(req.params.id)
      .populate('giver', 'name email phone avatar location rating verificationStatus joinedAt')
      .populate('requests.user', 'name avatar location rating verificationStatus')
      .populate('recipient', 'name avatar');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Free item listing not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create free item listing
// @route   POST /api/free-items
export const createFreeItem = async (req, res, next) => {
  try {
    const { title, description, category, condition, location, pickupInstructions, availableUntil, images } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const item = await FreeItem.create({
      title,
      description,
      category,
      condition: condition || 'Good',
      location,
      pickupInstructions: pickupInstructions || 'Self pickup required',
      availableUntil: availableUntil ? new Date(availableUntil) : null,
      images: images || [],
      giver: req.user._id,
      status: STATUS.FREE_ITEM.AVAILABLE
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'FREE_ITEM_LISTED',
      entityType: 'FreeItem',
      entityId: item._id.toString(),
      details: { title: item.title, category: item.category }
    });

    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Request a free item
// @route   POST /api/free-items/:id/request
export const requestFreeItem = async (req, res, next) => {
  try {
    const { note } = req.body;
    const item = await FreeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.giver.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot request your own free item' });
    }

    // Check if user already requested
    const alreadyRequested = item.requests?.some(r => r.user.toString() === req.user._id.toString());
    if (alreadyRequested) {
      return res.status(400).json({ success: false, message: 'You have already sent a request for this item' });
    }

    item.requests.push({
      user: req.user._id,
      note: note || 'I would love to collect this item. Thank you!',
      createdAt: new Date()
    });

    await item.save();

    // Notify Giver
    await Notification.create({
      recipient: item.giver,
      sender: req.user._id,
      type: 'system',
      title: 'Free Item Request',
      message: `${req.user.name} requested your giveaway item "${item.title}"`,
      link: `/free-stuff/${item._id}`
    });

    res.json({ success: true, message: 'Request sent to giver successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update free item status (Available -> Reserved -> Collected)
// @route   PATCH /api/free-items/:id/status
export const updateFreeItemStatus = async (req, res, next) => {
  try {
    const { status, recipientId } = req.body;
    const item = await FreeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.giver.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the giver or admin can update status' });
    }

    item.status = status;
    if (recipientId) item.recipient = recipientId;

    await item.save();
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's free items
// @route   GET /api/free-items/my
export const getMyFreeItems = async (req, res, next) => {
  try {
    const items = await FreeItem.find({ giver: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    next(error);
  }
};
