import React from 'react';

const Badge = ({ children, variant = 'neutral', size = 'sm', className = '' }) => {
  const variants = {
    teal: 'bg-[#E6F4F2] text-[#0F766E] border border-[#0F766E]/20',
    lime: 'bg-[#C7F36B]/20 text-[#134E4A] border border-[#C7F36B]',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-rose-50 text-rose-700 border border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border border-gray-200',
    dark: 'bg-[#134E4A] text-white'
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 font-medium rounded-md',
    sm: 'text-xs px-2.5 py-1 font-medium rounded-lg',
    md: 'text-sm px-3 py-1.5 font-semibold rounded-lg'
  };

  return (
    <span className={`inline-flex items-center gap-1 leading-none ${variants[variant] || variants.neutral} ${sizes[size] || sizes.sm} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
