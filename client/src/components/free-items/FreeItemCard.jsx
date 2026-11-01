import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import FavouriteButton from '../common/FavouriteButton';
import ShareModal from '../common/ShareModal';
import { MapPin, Gift, ArrowRight, Share2 } from 'lucide-react';

const FreeItemCard = ({ item, onSaveToggle, isSaved = false }) => {
  const [shareOpen, setShareOpen] = useState(false);

  if (!item) return null;

  const image =
    item.images && item.images.length > 0
      ? item.images[0]
      : 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-100 overflow-hidden hover:border-emerald-400 hover:shadow-premium transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Cover Photo */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* FREE Badge distinct highlight */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="text-xs font-black bg-[#C7F36B] text-[#134E4A] px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" />
              100% Free
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareOpen(true);
              }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-gray-700 hover:text-emerald-700 hover:bg-white transition-all"
              title="Share Free Item"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <FavouriteButton
              postId={item._id}
              postType="FreeItem"
              initialSaved={isSaved}
              size="sm"
              className="bg-white/90 backdrop-blur-md hover:bg-white shadow-xs"
              onToggle={(saved) => onSaveToggle && onSaveToggle(item._id, saved)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link to={`/free-stuff/${item._id}`}>
            <h3 className="font-bold text-sm text-[#17211F] group-hover:text-emerald-700 transition-colors line-clamp-1 font-display mb-1.5">
              {item.title}
            </h3>
          </Link>

          <p className="text-xs text-[#64716D] line-clamp-2 leading-relaxed mb-3">
            {item.description}
          </p>

          <div className="space-y-1 text-[11px] text-[#64716D]">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="truncate text-[10px] text-gray-500 italic">
              Pickup: {item.pickupInstructions || 'Self pickup required'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-4 py-3 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
          Community Gift
        </span>

        <Link
          to={`/free-stuff/${item._id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-all"
        >
          Request Item
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        postTitle={item.title}
        postType="Free Item"
        postUrl={`/free-stuff/${item._id}`}
      />
    </div>
  );
};

export default FreeItemCard;
