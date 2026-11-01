import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-[#0F766E] text-white hover:bg-[#134E4A] focus:ring-[#0F766E] shadow-sm',
    lime: 'bg-[#C7F36B] text-[#134E4A] font-semibold hover:bg-[#b8eb54] focus:ring-[#C7F36B] shadow-sm',
    secondary: 'bg-[#E6F4F2] text-[#0F766E] hover:bg-[#d0ece8] focus:ring-[#0F766E]',
    outline: 'border border-[#E3EAE7] bg-white text-[#17211F] hover:bg-[#F7F9F8] hover:border-[#CBD5D1] focus:ring-[#0F766E]',
    ghost: 'text-[#64716D] hover:text-[#17211F] hover:bg-[#E3EAE7]/50 focus:ring-gray-300',
    danger: 'bg-[#DC2626] text-white hover:bg-red-700 focus:ring-red-500 shadow-sm'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold'
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
};

export default Button;
