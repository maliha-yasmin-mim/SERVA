import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import RatingStars from '../common/RatingStars';
import VerificationBadge from '../common/VerificationBadge';
import FavouriteButton from '../common/FavouriteButton';
import ShareModal from '../common/ShareModal';
import { MapPin, Clock, ArrowRight, ShieldCheck, CreditCard, Share2 } from 'lucide-react';

const ServiceCard = ({ service, onSaveToggle, isSaved = false }) => {
  const [shareOpen, setShareOpen] = useState(false);

  if (!service) return null;

  const coverImage =
    service.portfolioImages && service.portfolioImages.length > 0
      ? service.portfolioImages[0]
      : 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-2xl border border-[#E3EAE7] overflow-hidden hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group shadow-card">
      <div>
        {/* Cover Image & Category Pill */}
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img
            src={coverImage}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md">
              {service.category}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareOpen(true);
              }}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-gray-600 hover:text-[#0F766E] hover:bg-white transition-all"
              title="Share Service"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <FavouriteButton
              postId={service._id}
              postType="Service"
              initialSaved={isSaved}
              size="sm"
              className="bg-white/90 backdrop-blur-md hover:bg-white shadow-xs"
              onToggle={(saved) => onSaveToggle && onSaveToggle(service._id, saved)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Provider row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Avatar
                src={service.provider?.avatar}
                size="sm"
                isOnline={service.provider?.isAvailableNow}
              />
              <div>
                <h4 className="text-xs font-bold text-[#17211F] leading-tight">
                  {service.provider?.name}
                </h4>
                <div className="mt-0.5">
                  <VerificationBadge
                    status={service.provider?.verificationStatus}
                    size="sm"
                    showText={false}
                  />
                </div>
              </div>
            </div>

            <RatingStars rating={service.rating} count={service.reviewCount} size="sm" />
          </div>

          {/* Title */}
          <Link to={`/services/${service._id}`}>
            <h3 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-2 font-display mb-2 leading-snug">
              {service.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-[#64716D] line-clamp-2 leading-relaxed mb-3">
            {service.description}
          </p>

          {/* Location & Availability */}
          <div className="flex items-center justify-between text-[11px] text-[#64716D] pt-2 border-t border-[#E3EAE7]/60">
            <div className="flex items-center gap-1 truncate max-w-[50%]">
              <MapPin className="w-3 h-3 text-[#0F766E] shrink-0" />
              <span className="truncate">{service.location || 'Dhaka'}</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Pricing & CTA */}
      <div className="px-5 py-3.5 bg-[#F7F9F8] border-t border-[#E3EAE7] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#64716D] block">Starts at</span>
          <span className="text-base font-extrabold text-[#0F766E] font-mono">
            ৳{Number(service.startingPrice || 0).toLocaleString()}
            <span className="text-[10px] font-sans text-gray-500 font-normal ml-1">BDT</span>
          </span>
        </div>

        <Link
          to={`/services/${service._id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F766E] bg-[#E6F4F2] group-hover:bg-[#0F766E] group-hover:text-white transition-all shadow-xs"
        >
          Book & Pay
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        postTitle={service.title}
        postType="Service"
        postUrl={`/services/${service._id}`}
      />
    </div>
  );
};

export default ServiceCard;
