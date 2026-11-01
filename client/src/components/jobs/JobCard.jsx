import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import VerificationBadge from '../common/VerificationBadge';
import FavouriteButton from '../common/FavouriteButton';
import ShareModal from '../common/ShareModal';
import { MapPin, Calendar, Users, Heart, ArrowRight, ShieldCheck, Star, Share2 } from 'lucide-react';

const JobCard = ({ job, onSaveToggle, isSaved: initialSaved = false }) => {
  const [shareOpen, setShareOpen] = useState(false);

  if (!job) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E3EAE7] p-5 hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group shadow-card relative">
      <div>
        {/* Top Badges & Heart Save */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#0F766E] px-2.5 py-0.5 rounded-md">
              {job.category}
            </span>
            {job.urgency === 'Urgent' && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded-md">
                Urgent
              </span>
            )}
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Escrow
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareOpen(true);
              }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0F766E] hover:bg-teal-50 transition-colors"
              title="Share Job"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <FavouriteButton
              postId={job._id}
              postType="Job"
              initialSaved={initialSaved}
              size="sm"
              onToggle={(saved) => onSaveToggle && onSaveToggle(job._id, saved)}
            />
          </div>
        </div>

        {/* Title */}
        <Link to={`/jobs/${job._id}`}>
          <h3 className="font-bold text-sm sm:text-base text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-2 font-display mb-2 leading-snug">
            {job.title}
          </h3>
        </Link>

        {/* Description snippet */}
        <p className="text-xs text-[#64716D] line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Metadata row */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#64716D] mb-4 bg-[#F7F9F8] p-2.5 rounded-xl border border-[#E3EAE7]/60">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
            <span className="truncate">{job.workDate || 'Flexible'}</span>
          </div>
        </div>

        {/* Required skills chips */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.requiredSkills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] bg-gray-100 text-[#17211F] px-2 py-0.5 rounded-md font-medium"
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 3 && (
              <span className="text-[10px] text-[#64716D] self-center">
                +{job.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Budget in ৳ & View Details */}
      <div className="pt-3.5 border-t border-[#E3EAE7] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#64716D] block">
            Budget ({job.paymentType || 'Fixed'})
          </span>
          <span className="text-base font-extrabold text-[#0F766E] font-mono">
            ৳{Number(job.budget || 0).toLocaleString()}
            <span className="text-[10px] font-sans text-gray-500 font-normal ml-1">BDT</span>
          </span>
        </div>

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F766E] bg-[#E6F4F2] group-hover:bg-[#0F766E] group-hover:text-white transition-all shadow-xs"
        >
          Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        postTitle={job.title}
        postType="Job"
        postUrl={`/jobs/${job._id}`}
      />
    </div>
  );
};

export default JobCard;
