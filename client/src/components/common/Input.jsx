import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-[#17211F] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64716D]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`w-full rounded-xl border transition-all text-sm px-3.5 py-2.5 bg-white text-[#17211F] placeholder-[#64716D]/60 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E] disabled:bg-gray-50 disabled:cursor-not-allowed ${
            Icon ? 'pl-10' : ''
          } ${
            error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-red-100' : 'border-[#E3EAE7]'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#DC2626] mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#64716D] mt-1">{helperText}</p>}
    </div>
  );
};

export default Input;
