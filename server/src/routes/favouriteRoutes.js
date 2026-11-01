import express from 'express';
import {
  toggleFavourite,
  getMyFavourites,
  getMyFavouriteIds,
  removeFavourite
} from '../controllers/favouriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/toggle', toggleFavourite);
router.get('/', getMyFavourites);
router.get('/ids', getMyFavouriteIds);
router.delete('/:id', removeFavourite);

export default router;

