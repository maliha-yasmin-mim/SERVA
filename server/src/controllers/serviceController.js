import Service from '../models/Service.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { STATUS } from '../config/constants.js';

// @desc    Get all services with filters
// @route   GET /api/services
export const getServices = async (req, res, next) => {
  try {
    const { keyword, category, location, minPrice, maxPrice, pricingModel, sort, page = 1, limit = 12 } = req.query;

    const query = { status: STATUS.SERVICE.ACTIVE };

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location && location !== 'All') {
      query.location = { $regex: location, $options: 'i' };
    }

    if (pricingModel && pricingModel !== 'All') {
      query.pricingModel = pricingModel;
    }

    if (minPrice || maxPrice) {
      query.startingPrice = {};
      if (minPrice) query.startingPrice.$gte = Number(minPrice);
      if (maxPrice) query.startingPrice.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'price_low') sortOption = { startingPrice: 1 };
    if (sort === 'price_high') sortOption = { startingPrice: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Service.countDocuments(query);

    const services = await Service.find(query)
      .populate('provider', 'name avatar location rating reviewCount verificationStatus isAvailableNow hourlyRate')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: services.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name email phone avatar bio location rating reviewCount completedJobsCount verificationStatus isAvailableNow availabilitySchedule joinedAt');

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service offering
// @route   POST /api/services
export const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      startingPrice,
      pricingModel,
      location,
      availability,
      skills,
      portfolioImages,
      packages
    } = req.body;

    if (!title || !description || !category || !startingPrice || !location) {
      return res.status(400).json({ success: false, message: 'Please provide all required service fields' });
    }

    const service = await Service.create({
      title,
      description,
      category,
      startingPrice: Number(startingPrice),
      pricingModel: pricingModel || 'Hourly',
      location,
      availability: availability || 'Mon - Sat (9 AM - 7 PM)',
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      portfolioImages: portfolioImages || [],
      packages: packages || [
        { name: 'Standard Package', description: 'Standard professional service package', price: Number(startingPrice), deliveryTime: '1 Day', features: ['Complete service', 'Safety equipment', 'Basic guarantee'] }
      ],
      provider: req.user._id,
      status: STATUS.SERVICE.ACTIVE
    });

    // Update user services offered
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { servicesOffered: category }
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'SERVICE_CREATED',
      entityType: 'Service',
      entityId: service._id.toString(),
      details: { title: service.title, category: service.category }
    });

    res.status(201).json({ success: true, service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service offering
// @route   PUT /api/services/:id
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this service' });
    }

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, service: updatedService });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (service.provider.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this service' });
    }

    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's services
// @route   GET /api/services/my
export const getMyServices = async (req, res, next) => {
  try {
    const services = await Service.find({ provider: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    next(error);
  }
};
