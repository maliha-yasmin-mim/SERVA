import React from 'react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-t-[#0F766E] border-r-transparent border-b-[#0F766E] border-l-transparent ${sizes[size] || sizes.md} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E3EAE7] p-5 shadow-soft animate-pulse space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <div className="w-2/3 h-4 bg-gray-200 rounded" />
          <div className="w-1/3 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-4/5 h-3 bg-gray-200 rounded" />
      </div>
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="w-20 h-5 bg-gray-200 rounded" />
        <div className="w-24 h-8 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

export default Spinner;
