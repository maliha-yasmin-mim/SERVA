import User from '../models/User.js';
import Job from '../models/Job.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import FreeItem from '../models/FreeItem.js';
import ProofRecord from '../models/ProofRecord.js';
import Report from '../models/Report.js';
import AuditLog from '../models/AuditLog.js';
import Notification from '../models/Notification.js';
import { privateVerificationDirectory, uploadDirectory } from '../config/storage.js';
import path from 'path';

// @desc    Get Admin Overview Statistics
// @route   GET /api/admin/overview
export const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ verificationStatus: 'Verified' });
    const pendingVerifications = await User.countDocuments({ verificationStatus: { $in: ['Submitted', 'Under Review'] } });
    const activeJobs = await Job.countDocuments({ status: { $in: ['Open', 'Assigned', 'In Progress'] } });
    const completedJobs = await Job.countDocuments({ status: 'Completed' });
    const activeServices = await Service.countDocuments({ status: 'Active' });
    const marketplaceProducts = await Product.countDocuments({ status: 'Available' });
    const freeItems = await FreeItem.countDocuments({ status: 'Available' });
    const pendingReports = await Report.countDocuments({ status: 'Pending' });
    const approvedProofs = await ProofRecord.countDocuments({ status: 'Approved' });

    const recentAudits = await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({
      success: true,
      stats: {
        totalUsers,
        verifiedUsers,
        pendingVerifications,
        activeJobs,
        completedJobs,
        activeServices,
        marketplaceProducts,
        freeItems,
        pendingReports,
        approvedProofs
      },
      recentAudits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user list with filters & pagination
// @route   GET /api/admin/users
export const getUsersList = async (req, res, next) => {
  try {
    const { role, verificationStatus, keyword, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('name email role location avatar verificationStatus createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending verification applications
// @route   GET /api/admin/verifications
export const getPendingVerifications = async (req, res, next) => {
  try {
    const users = await User.find({
      verificationStatus: { $in: ['Submitted', 'Under Review'] }
    })
      .select('name email location avatar verificationStatus verificationDetails')
      .sort({ 'verificationDetails.submittedAt': -1 });

    const verificationRequests = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      avatar: user.avatar,
      verificationStatus: user.verificationStatus,
      verificationDetails: {
        nidNumber: user.verificationDetails?.nidNumber || '',
        submittedAt: user.verificationDetails?.submittedAt,
        hasDocument: Boolean(user.verificationDetails?.documentPath)
      }
    }));

    res.json({ success: true, count: verificationRequests.length, users: verificationRequests });
  } catch (error) {
    next(error);
  }
};

export const getVerificationDocument = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('verificationDetails.documentPath');
    const documentPath = user?.verificationDetails?.documentPath || '';
    const legacyPrefix = '/uploads/';
    const isLegacyDocument = documentPath.startsWith(legacyPrefix)
      && path.basename(documentPath) === documentPath.slice(legacyPrefix.length);
    const documentName = isLegacyDocument ? documentPath.slice(legacyPrefix.length) : path.basename(documentPath);
    const documentRoot = isLegacyDocument ? uploadDirectory : privateVerificationDirectory;

    if (!documentName || (!isLegacyDocument && documentName !== documentPath)) {
      return res.status(404).json({ success: false, message: 'Verification document not found' });
    }

    res.set('Cache-Control', 'no-store');
    res.set('X-Content-Type-Options', 'nosniff');
    res.download(documentName, { root: documentRoot }, (error) => {
      if (error && !res.headersSent) next(error);
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Review and approve / reject user verification
// @route   PATCH /api/admin/verifications/:userId
export const reviewUserVerification = async (req, res, next) => {
  try {
    const { status, reviewerNotes } = req.body; // 'Verified' | 'Rejected' | 'Resubmission Required'
    if (!['Verified', 'Rejected', 'Resubmission Required'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid verification review status' });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.verificationStatus = status;
    user.verificationDetails.reviewerNotes = reviewerNotes || `Status updated to ${status} by admin`;
    await user.save();

    await Notification.create({
      recipient: user._id,
      sender: req.user._id,
      type: 'verification',
      title: `Verification Update: ${status}`,
      message: `Your SERVA verification status has been updated to "${status}". Notes: ${user.verificationDetails.reviewerNotes}`,
      link: `/dashboard/verification`
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'ADMIN_VERIFICATION_REVIEW',
      entityType: 'User',
      entityId: user._id.toString(),
      details: { newStatus: status, reviewerNotes }
    });

    res.json({
      success: true,
      user: { _id: user._id, verificationStatus: user.verificationStatus }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reported content
// @route   GET /api/admin/reports
export const getReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve or dismiss report
// @route   PATCH /api/admin/reports/:id
export const resolveReport = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body; // 'Reviewed' | 'Dismissed' | 'Action Taken'
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    report.status = status;
    report.adminNotes = adminNotes || '';
    await report.save();

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform audit logs
// @route   GET /api/admin/audit-logs
export const getAuditLogs = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    next(error);
  }
};
