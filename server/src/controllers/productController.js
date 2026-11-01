import Product from '../models/Product.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { STATUS } from '../config/constants.js';

// @desc    Get all marketplace products with filters
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, location, minPrice, maxPrice, condition, status, sort, page = 1, limit = 12 } = req.query;

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
      query.status = { $in: [STATUS.PRODUCT.AVAILABLE, STATUS.PRODUCT.RESERVED] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_low') sortOption = { price: 1 };
    if (sort === 'price_high') sortOption = { price: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('seller', 'name avatar location rating verificationStatus')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone avatar location rating verificationStatus joinedAt');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product listing not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product listing
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price, condition, location, images } = req.body;

    if (!title || !description || !category || price === undefined || !location) {
      return res.status(400).json({ success: false, message: 'Please provide all required product fields' });
    }

    const product = await Product.create({
      title,
      description,
      category,
      price: Number(price),
      condition: condition || 'Gently Used',
      location,
      images: images || [],
      seller: req.user._id,
      status: STATUS.PRODUCT.AVAILABLE
    });

    await AuditLog.create({
      user: req.user._id,
      action: 'PRODUCT_LISTED',
      entityType: 'Product',
      entityId: product._id.toString(),
      details: { title: product.title, price: product.price }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product status (Available -> Reserved -> Sold)
// @route   PATCH /api/products/:id/status
export const updateProductStatus = async (req, res, next) => {
  try {
    const { status, buyerId } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only the seller or admin can change status' });
    }

    product.status = status;
    if (buyerId) product.buyer = buyerId;

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product listing
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's products
// @route   GET /api/products/my
export const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
