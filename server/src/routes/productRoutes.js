import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductStatus,
  deleteProduct,
  getMyProducts
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.get('/my', protect, getMyProducts);

router.route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct);

router.patch('/:id/status', protect, updateProductStatus);

export default router;
