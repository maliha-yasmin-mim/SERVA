import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

const VerificationBadge = ({ status = 'Verified', showText = true, size = 'sm' }) => {
  if (status === 'Verified') {
    return (
      <span
        title="SERVA Verified: Identity & National ID document confirmed by platform moderation."
        className="inline-flex items-center gap-1 text-[#0F766E] font-medium text-xs bg-[#E6F4F2] px-2 py-0.5 rounded-full border border-[#0F766E]/20"
      >
        <ShieldCheck className={size === 'sm' ? 'w-3.5 h-3.5 text-[#0F766E]' : 'w-4 h-4 text-[#0F766E]'} />
        {showText && <span>Verified</span>}
      </span>
    );
  }

  if (status === 'Submitted' || status === 'Under Review') {
    return (
      <span
        title="Verification pending: Documents submitted and awaiting administrative review."
        className="inline-flex items-center gap-1 text-amber-700 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        {showText && <span>In Review</span>}
      </span>
    );
  }

  return null;
};

export default VerificationBadge;
