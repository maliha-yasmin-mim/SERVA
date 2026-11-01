import Favourite from '../models/Favourite.js';
import Job from '../models/Job.js';
import Service from '../models/Service.js';
import Product from '../models/Product.js';
import FreeItem from '../models/FreeItem.js';
import User from '../models/User.js';

/**
 * @desc Toggle favourite status for a post
 * @route POST /api/favourites/toggle
 * @access Private
 */
export const toggleFavourite = async (req, res, next) => {
  try {
    const { postId, postType } = req.body;

    if (!postId || !postType) {
      return res.status(400).json({ success: false, message: 'postId and postType are required' });
    }

    const validTypes = ['Job', 'Service', 'Product', 'FreeItem'];
    if (!validTypes.includes(postType)) {
      return res.status(400).json({ success: false, message: 'Invalid postType' });
    }

    // Verify post exists
    let postExists = false;
    if (postType === 'Job') postExists = await Job.exists({ _id: postId });
    else if (postType === 'Service') postExists = await Service.exists({ _id: postId });
    else if (postType === 'Product') postExists = await Product.exists({ _id: postId });
    else if (postType === 'FreeItem') postExists = await FreeItem.exists({ _id: postId });

    if (!postExists) {
      return res.status(404).json({ success: false, message: `${postType} not found` });
    }

    const existing = await Favourite.findOne({
      user: req.user._id,
      post: postId,
      postType
    });

    if (existing) {
      await Favourite.deleteOne({ _id: existing._id });

      // Keep User model arrays synced
      const pullUpdate = {};
      if (postType === 'Job') pullUpdate.savedJobs = postId;
      if (postType === 'Service') pullUpdate.savedServices = postId;
      if (postType === 'Product') pullUpdate.savedProducts = postId;
      if (Object.keys(pullUpdate).length > 0) {
        await User.findByIdAndUpdate(req.user._id, { $pull: pullUpdate });
      }

      return res.json({
        success: true,
        isSaved: false,
        message: 'Removed from favourites'
      });
    }

    const newFav = await Favourite.create({
      user: req.user._id,
      post: postId,
      postType
    });

    // Keep User model arrays synced
    if (postType === 'Job') {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedJobs: postId } });
    } else if (postType === 'Service') {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedServices: postId } });
    } else if (postType === 'Product') {
      await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedProducts: postId } });
    }

    res.status(201).json({
      success: true,
      isSaved: true,
      favourite: newFav,
      message: 'Saved to favourites'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all saved items for authenticated user
 * @route GET /api/favourites
 * @access Private
 */
export const getMyFavourites = async (req, res, next) => {
  try {
    const { type, search, sort = 'newest' } = req.query;

    const query = { user: req.user._id };
    if (type && type !== 'All') {
      query.postType = type;
    }

    const sortOptions = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const favourites = await Favourite.find(query)
      .populate({
        path: 'post',
        populate: [
          { path: 'poster', select: 'name avatar location rating verificationStatus' },
          { path: 'provider', select: 'name avatar location rating verificationStatus' },
          { path: 'seller', select: 'name avatar location verificationStatus' },
          { path: 'creator', select: 'name avatar location' }
        ]
      })
      .sort(sortOptions);

    // Filter out any dangling references if original item was deleted
    let validFavourites = favourites.filter(f => f.post !== null && f.post !== undefined);

    // If search keyword provided, filter by title/location
    if (search && search.trim()) {
      const keyword = search.trim().toLowerCase();
      validFavourites = validFavourites.filter(f => {
        const title = f.post?.title?.toLowerCase() || '';
        const loc = f.post?.location?.toLowerCase() || '';
        const cat = f.post?.category?.toLowerCase() || '';
        return title.includes(keyword) || loc.includes(keyword) || cat.includes(keyword);
      });
    }

    res.json({
      success: true,
      count: validFavourites.length,
      favourites: validFavourites
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get set of favorited post IDs for quick frontend badge synchronization
 * @route GET /api/favourites/ids
 * @access Private
 */
export const getMyFavouriteIds = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ user: req.user._id }).select('post postType');
    const ids = {};
    favourites.forEach(f => {
      ids[f.post.toString()] = f.postType;
    });

    res.json({
      success: true,
      ids
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete favourite by ID
 * @route DELETE /api/favourites/:id
 * @access Private
 */
export const removeFavourite = async (req, res, next) => {
  try {
    const fav = await Favourite.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!fav) {
      return res.status(404).json({ success: false, message: 'Favourite item not found' });
    }

    await fav.deleteOne();

    // Pull from user model
    if (fav.postType === 'Job') {
      await User.findByIdAndUpdate(req.user._id, { $pull: { savedJobs: fav.post } });
    } else if (fav.postType === 'Service') {
      await User.findByIdAndUpdate(req.user._id, { $pull: { savedServices: fav.post } });
    } else if (fav.postType === 'Product') {
      await User.findByIdAndUpdate(req.user._id, { $pull: { savedProducts: fav.post } });
    }

    res.json({ success: true, message: 'Removed from favourites' });
  } catch (error) {
    next(error);
  }
};
