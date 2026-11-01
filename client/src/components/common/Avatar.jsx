import React from 'react';

const Avatar = ({ src, alt = 'User Avatar', size = 'md', isOnline, className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-lg'
  };

  const fallback = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={src || fallback}
        alt={alt}
        onError={(e) => { e.target.src = fallback; }}
        className={`${sizes[size] || sizes.md} rounded-full object-cover border border-[#E3EAE7] shadow-sm`}
      />
      {isOnline !== undefined && (
        <span
          className={`absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full ring-2 ring-white ${
            isOnline ? 'bg-emerald-500' : 'bg-gray-400'
          }`}
          title={isOnline ? 'Available Now' : 'Offline'}
        />
      )}
    </div>
  );
};

export default Avatar;
