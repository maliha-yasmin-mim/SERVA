import WebsiteSettings from '../models/WebsiteSettings.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';

/**
 * @desc Get public website settings (Branding, Colors, Content)
 * @route GET /api/settings/public
 * @access Public
 */
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    res.json({
      success: true,
      settings: {
        general: settings.general,
        theme: settings.theme,
        content: settings.content
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get full website settings for administrator
 * @route GET /api/admin/website-settings
 * @access Private (Admin Only)
 */
export const getAdminSettings = async (req, res, next) => {
  try {
    const settings = await WebsiteSettings.getSettings();
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Upload logo or favicon
 * @route POST /api/admin/website-settings/upload
 * @access Private (Admin Only)
 */
export const uploadBrandingAsset = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      fileUrl,
      fileName: req.file.filename,
      message: 'Asset uploaded successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verify admin password and save website customization
 * @route POST /api/admin/website-settings/verify-and-save
 * @access Private (Admin Only)
 */
export const verifyAndSaveSettings = async (req, res, next) => {
  try {
    const { password, settingsData } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Administrator password confirmation is required to save changes.'
      });
    }

    if (!settingsData) {
      return res.status(400).json({
        success: false,
        message: 'No settings data provided for update.'
      });
    }

    // Explicitly select password field to verify against bcrypt
    const adminUser = await User.findById(req.user._id).select('+password');

    if (!adminUser) {
      return res.status(401).json({
        success: false,
        message: 'Administrator account not found.'
      });
    }

    // Verify admin role strictly
    if (adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not possess administrator authority.'
      });
    }

    // Verify password using User model bcrypt helper
    const isMatch = await adminUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password. Website customization was not applied.'
      });
    }

    // Retrieve or initialize settings
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = new WebsiteSettings();
    }

    // Helper to safely convert subdoc or object
    const toPlain = (val) => (val && typeof val.toObject === 'function' ? val.toObject() : (val || {}));

    // Sanitize & apply General settings if provided
    if (settingsData.general) {
      settings.general = {
        ...toPlain(settings.general),
        ...settingsData.general
      };
    }

    // Apply Theme settings if provided
    if (settingsData.theme) {
      settings.theme = {
        ...toPlain(settings.theme),
        ...settingsData.theme
      };
    }

    // Apply Content settings if provided
    if (settingsData.content) {
      settings.content = {
        homepage: {
          ...toPlain(settings.content?.homepage),
          ...(settingsData.content.homepage || {})
        },
        about: {
          ...toPlain(settings.content?.about),
          ...(settingsData.content.about || {})
        },
        footer: {
          ...toPlain(settings.content?.footer),
          ...(settingsData.content.footer || {})
        },
        contact: {
          ...toPlain(settings.content?.contact),
          ...(settingsData.content.contact || {})
        }
      };
    }

    settings.lastUpdatedBy = req.user._id;
    await settings.save();

    // Record audit log
    await AuditLog.create({
      action: 'UPDATE_WEBSITE_CUSTOMIZATION',
      performedBy: req.user._id,
      details: {
        preset: settings.theme.activePreset,
        updatedFields: Object.keys(settingsData)
      }
    }).catch(() => {});

    res.json({
      success: true,
      message: 'Website customization verified and saved successfully!',
      settings
    });
  } catch (error) {
    next(error);
  }
};
