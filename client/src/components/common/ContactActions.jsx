import React, { useState } from 'react';
import { Phone, Check, Copy, MessageCircle, ExternalLink } from 'lucide-react';
import { ServaMessengerIcon } from './FloatingMessenger';

// Custom WhatsApp SVG Icon
export const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.507 14.307l-.009.075c-.239.789-1.396 1.487-1.956 1.554-.56.067-1.12.067-1.78-.134-2.126-.642-3.844-2.126-5.068-4.225-.335-.575-.52-1.218-.52-1.898 0-1.144.57-1.734.985-2.149.19-.19.42-.295.69-.295.12 0 .24.015.35.045.31.075.49.33.64.6l.87 1.95c.13.29.1.61-.09.85l-.47.58c-.14.18-.18.39-.09.6.53 1.25 1.55 2.27 2.8 2.8.21.09.42.05.6-.09l.58-.47c.24-.19.56-.22.85-.09l1.95.87c.27.15.525.33.6.64.03.11.045.23.045.35 0 .27-.105.5-.295.69zm-5.507-12.307c-5.523 0-10 4.477-10 10 0 1.77.46 3.45 1.29 4.93l-1.29 4.71 4.86-1.27c1.43.78 3.06 1.23 4.78 1.23 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.25c-1.57 0-3.07-.43-4.37-1.19l-.31-.18-2.88.76.77-2.81-.2-.32c-.84-1.34-1.31-2.9-1.31-4.51 0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z" />
  </svg>
);

const ContactActions = ({
  person, // { name, phone, whatsapp, avatar, _id }
  itemTitle = 'Listing',
  itemType = 'Opportunity',
  onOpenMessenger,
  layout = 'stack' // 'stack' | 'row' | 'grid'
}) => {
  const [copied, setCopied] = useState(false);

  const rawPhone = person?.phone || person?.whatsapp || '+880 1715 998877';
  const rawWhatsapp = person?.whatsapp || person?.phone || '+880 1715 998877';

  // Format clean international numbers for WhatsApp
  const cleanPhoneForWa = (num) => {
    let cleaned = num.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('01') && cleaned.length === 11) {
      cleaned = '88' + cleaned;
    }
    return cleaned;
  };

  // WhatsApp click handler
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const cleanNumber = cleanPhoneForWa(rawWhatsapp);
    const text = encodeURIComponent(
      `Hello ${person?.name || 'there'}, I found your ${itemType} "${itemTitle}" on SERVA and would like to get in touch!`
    );
    const waUrl = `https://wa.me/${cleanNumber}?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Call click handler (Mobile: dialer, Laptop/PC: copy to clipboard)
  const handleCallClick = (e) => {
    e.preventDefault();
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    if (isMobile) {
      const dialNumber = rawPhone.replace(/\s+/g, '');
      window.location.href = `tel:${dialNumber}`;
    } else {
      navigator.clipboard.writeText(rawPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-2.5 w-full">
      {/* Visual Feedback Banner when copied */}
      {copied && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in zoom-in-95">
          <span className="flex items-center gap-1.5 truncate">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Phone number copied to clipboard!</span>
          </span>
          <span className="text-[10px] bg-emerald-200/60 px-2 py-0.5 rounded text-emerald-900 font-bold">
            Ready to paste
          </span>
        </div>
      )}

      {/* Button Group */}
      <div
        className={
          layout === 'row'
            ? 'flex flex-wrap sm:flex-nowrap items-center gap-2'
            : layout === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-3 gap-2'
            : 'space-y-2'
        }
      >
        {/* 1. SERVA / Bazaraki Platform Messenger Button */}
        <button
          type="button"
          onClick={onOpenMessenger}
          className="w-full flex-1 group relative overflow-hidden py-3 px-4 rounded-2xl bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#14B8A6] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-glow-teal hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
          title="Chat directly on SERVA Messenger"
        >
          <div className="w-6 h-6 rounded-lg bg-white/15 backdrop-blur-xs flex items-center justify-center group-hover:scale-110 transition-transform">
            <ServaMessengerIcon className="w-4 h-4" />
          </div>
          <span className="truncate">SERVA Messenger</span>
          <span className="text-[10px] bg-[#C7F36B] text-[#134E4A] px-1.5 py-0.5 rounded font-black uppercase tracking-wider ml-auto sm:ml-0">
            Instant
          </span>
        </button>

        {/* 2. WhatsApp Button */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          className="w-full flex-1 py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-[1.01] transition-all flex items-center justify-center gap-2.5 active:scale-[0.98]"
          title={`Open WhatsApp chat with ${person?.name || 'poster'}`}
        >
          <WhatsAppIcon className="w-4 h-4 shrink-0 fill-current" />
          <span className="truncate">WhatsApp Chat</span>
        </button>

        {/* 3. Call Button (Number Hidden - Auto copies on PC, dials on Mobile) */}
        <button
          type="button"
          onClick={handleCallClick}
          className={`w-full flex-1 py-3 px-4 rounded-2xl border font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-[0.98] ${
            copied
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'bg-white border-[#E3EAE7] text-[#17211F] hover:bg-[#F7F9F8] hover:border-[#0F766E]/40 hover:text-[#0F766E]'
          }`}
          title="Click to copy number on PC, or call directly on mobile"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white shrink-0" />
              <span className="truncate">Number Copied!</span>
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 text-[#0F766E] shrink-0" />
              <span className="truncate">Call / Phone</span>
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-[#64716D] pt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Direct Verified Contact • Free & Instant Communication</span>
      </div>
    </div>
  );
};

export default ContactActions;

