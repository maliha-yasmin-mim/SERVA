import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import FavouriteButton from '../common/FavouriteButton';
import ShareModal from '../common/ShareModal';
import { MapPin, ArrowRight, Heart, Share2 } from 'lucide-react';

const ProductCard = ({ product, onSaveToggle, isSaved = false }) => {
  const [shareOpen, setShareOpen] = useState(false);

  if (!product) return null;

  const image =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-2xl border border-[#E3EAE7] overflow-hidden hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group shadow-card">
      <div>
        {/* Cover Photo */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md">
              {product.category}
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
            <span className="text-[10px] font-bold bg-white/90 backdrop-blur-md text-[#17211F] px-2 py-0.5 rounded-md shadow-xs">
              {product.condition}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareOpen(true);
              }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-gray-700 hover:text-[#0F766E] hover:bg-white transition-all"
              title="Share Item"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <FavouriteButton
              postId={product._id}
              postType="Product"
              initialSaved={isSaved}
              size="sm"
              className="bg-white/90 backdrop-blur-md hover:bg-white shadow-xs"
              onToggle={(saved) => onSaveToggle && onSaveToggle(product._id, saved)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Price (Prominent Bazaraki style) */}
          <div className="text-lg font-black text-[#17211F] font-mono">
            ৳{Number(product.price || 0).toLocaleString()}
            <span className="text-xs text-gray-500 font-normal ml-1">BDT</span>
          </div>

          <Link to={`/marketplace/${product._id}`}>
            <h3 className="font-bold text-xs sm:text-sm text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-1 font-display">
              {product.title}
            </h3>
          </Link>

          <p className="text-xs text-[#64716D] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-[#64716D] pt-1">
            <MapPin className="w-3 h-3 text-[#0F766E] shrink-0" />
            <span className="truncate">{product.location}</span>
          </div>
        </div>
      </div>

      {/* Footer Price & Details */}
      <div className="px-4 py-3 bg-[#F7F9F8] border-t border-[#E3EAE7] flex items-center justify-between">
        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold uppercase">
          Escrow Available
        </span>

        <Link
          to={`/marketplace/${product._id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F766E] bg-[#E6F4F2] group-hover:bg-[#0F766E] group-hover:text-white transition-all shadow-xs"
        >
          View Item
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        postTitle={product.title}
        postType="Product"
        postUrl={`/marketplace/${product._id}`}
      />
    </div>
  );
};

export default ProductCard;
