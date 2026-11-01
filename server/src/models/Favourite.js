import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'postType'
    },
    postType: {
      type: String,
      required: true,
      enum: ['Job', 'Service', 'Product', 'FreeItem']
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate favourites for the same user and post
favouriteSchema.index({ user: 1, post: 1, postType: 1 }, { unique: true });

export default mongoose.model('Favourite', favouriteSchema);

