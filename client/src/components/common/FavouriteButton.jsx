import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import favouriteService from '../../services/favouriteService';

const FavouriteButton = ({
  postId,
  postType = 'Job',
  initialSaved = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  showText = false,
  className = '',
  onToggle
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  // Sync state if initialSaved changes from props or user's saved lists
  useEffect(() => {
    if (initialSaved) {
      setIsSaved(true);
      return;
    }
    if (user && postId) {
      const idStr = postId.toString();
      let matched = false;
      if (postType === 'Job' && Array.isArray(user.savedJobs)) {
        matched = user.savedJobs.some(id => (id._id || id).toString() === idStr);
      } else if (postType === 'Service' && Array.isArray(user.savedServices)) {
        matched = user.savedServices.some(id => (id._id || id).toString() === idStr);
      } else if (postType === 'Product' && Array.isArray(user.savedProducts)) {
        matched = user.savedProducts.some(id => (id._id || id).toString() === idStr);
      }
      if (matched) {
        setIsSaved(true);
      }
    }
  }, [initialSaved, user, postId, postType]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (window.confirm('Please sign in to save this post to your favourites! Would you like to log in now?')) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    const previousState = isSaved;
    setIsSaved(!previousState);

    try {
      const res = await favouriteService.toggleFavourite(postId, postType);
      setIsSaved(res.isSaved);
      if (onToggle) onToggle(res.isSaved);
    } catch (err) {
      // Revert on error
      setIsSaved(previousState);
      console.error('Failed to toggle favourite:', err);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      onClick={handleToggle}
      disabled={loading}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-200 select-none ${
        showText
          ? 'px-3.5 py-1.5 gap-1.5 rounded-xl border ' +
            (isSaved
              ? 'bg-rose-50 border-rose-200 text-rose-600 font-bold'
              : 'bg-white border-[#E3EAE7] text-[#64716D] hover:bg-gray-50 hover:text-rose-500')
          : sizeClasses[size] +
            ' ' +
            (isSaved
              ? 'bg-rose-500 text-white shadow-sm ring-2 ring-rose-200'
              : 'bg-black/30 backdrop-blur-md text-white hover:bg-black/50 hover:text-rose-300')
      } ${className}`}
      title={isSaved ? 'Remove from favourites' : 'Save to favourites'}
      aria-label={isSaved ? 'Remove from favourites' : 'Save to favourites'}
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-200 ${
          isSaved
            ? showText
              ? 'fill-current text-rose-600 scale-110'
              : 'fill-white text-white scale-110'
            : 'text-current'
        }`}
      />
      {showText && (
        <span className="text-xs font-semibold">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </motion.button>
  );
};

export default FavouriteButton;
