import User from '../models/User.js';
import Job from '../models/Job.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import FreeItem from '../models/FreeItem.js';
import Review from '../models/Review.js';
import { generateToken } from '../utils/token.js';
import AuditLog from '../models/AuditLog.js';

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api',
  maxAge: 30 * 24 * 60 * 60 * 1000
};

const setAuthCookie = (res, userId) => {
  res.cookie('serva_token', generateToken(userId), authCookieOptions);
};

const serializeUser = (user) => {
  const serialized = user.toObject();
  if (serialized.verificationDetails) {
    serialized.verificationDetails = {
      submittedAt: serialized.verificationDetails.submittedAt,
      reviewerNotes: serialized.verificationDetails.reviewerNotes
    };
  }
  return serialized;
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, location, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      location: location || 'Dhaka - Dhanmondi',
      phone: phone || ''
    });

    await AuditLog.create({
      user: user._id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { email: user.email, name: user.name }
    });

    setAuthCookie(res, user._id);

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        verificationStatus: user.verificationStatus,
        rating: user.rating
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    await AuditLog.create({
      user: user._id,
      action: 'USER_LOGIN',
      entityType: 'User',
      entityId: user._id.toString()
    });

    setAuthCookie(res, user._id);

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        location: user.location,
        verificationStatus: user.verificationStatus,
        rating: user.rating,
        skills: user.skills,
        servicesOffered: user.servicesOffered,
        isAvailableNow: user.isAvailableNow
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.clearCookie('serva_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api'
  });
  res.json({ success: true });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, bio, phone, location, skills, servicesOffered, hourlyRate, avatar } = req.body;

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (location) user.location = location;
    if (skills) user.skills = skills;
    if (servicesOffered) user.servicesOffered = servicesOffered;
    if (hourlyRate !== undefined) user.hourlyRate = Number(hourlyRate);
    if (avatar) user.avatar = avatar;

    const updatedUser = await user.save();

    res.json({ success: true, user: serializeUser(updatedUser) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user availability
// @route   PUT /api/auth/availability
export const updateAvailability = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.isAvailableNow !== undefined) {
      user.isAvailableNow = Boolean(req.body.isAvailableNow);
    }
    if (req.body.availabilitySchedule) {
      user.availabilitySchedule = {
        ...user.availabilitySchedule,
        ...req.body.availabilitySchedule
      };
    }

    await user.save();
    res.json({ success: true, isAvailableNow: user.isAvailableNow, availabilitySchedule: user.availabilitySchedule });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit verification request
// @route   POST /api/auth/verify-submit
export const submitVerification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { nidNumber } = req.body;
    let documentPath = '';

    if (req.file) {
      documentPath = req.file.filename;
    }

    user.verificationStatus = 'Submitted';
    user.verificationDetails = {
      nidNumber: nidNumber || 'NID-PENDING',
      submittedAt: new Date(),
      documentPath: documentPath || user.verificationDetails?.documentPath || '',
      reviewerNotes: 'Under initial document review by SERVA compliance desk'
    };

    await user.save();

    await AuditLog.create({
      user: user._id,
      action: 'VERIFICATION_SUBMITTED',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { nidSubmitted: Boolean(nidNumber) }
    });

    res.json({
      success: true,
      message: 'Verification request submitted successfully for administrative review.',
      verificationStatus: user.verificationStatus,
      verificationDetails: {
        submittedAt: user.verificationDetails.submittedAt,
        reviewerNotes: user.verificationDetails.reviewerNotes
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's public profile and listings
// @route   GET /api/auth/users/:id
export const getUserPublicProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password -savedJobs -savedServices -savedProducts');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const [jobs, services, products, freeItems, reviews] = await Promise.all([
      Job.find({ poster: id }).sort({ createdAt: -1 }),
      Service.find({ provider: id, isActive: true }).sort({ createdAt: -1 }),
      Product.find({ seller: id }).sort({ createdAt: -1 }),
      FreeItem.find({ giver: id }).sort({ createdAt: -1 }),
      Review.find({ recipient: id }).populate('reviewer', 'name avatar').sort({ createdAt: -1 })
    ]);

    res.json({
      success: true,
      user: serializeUser(user),
      posts: {
        jobs,
        services,
        products,
        freeItems
      },
      reviews
    });
  } catch (error) {
    next(error);
  }
};
