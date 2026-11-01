import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Share2,
  Copy,
  Check,
  X,
  MessageCircle,
  Facebook,
  Send,
  Smartphone,
  ExternalLink
} from 'lucide-react';

const ShareModal = ({
  isOpen,
  onClose,
  title = 'Share this Listing',
  postTitle = '',
  postType = 'Listing',
  postUrl = ''
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use passed postUrl or current window URL fallback
  const shareUrl = postUrl
    ? (postUrl.startsWith('http') ? postUrl : `${window.location.origin}${postUrl}`)
    : window.location.href;

  const shareText = `Check out this ${postType} on SERVA: "${postTitle || 'Local Opportunity'}" — ${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API denied
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle || 'SERVA Listing',
          text: `Check out this ${postType} on SERVA: "${postTitle}"`,
          url: shareUrl
        });
        onClose();
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Native share error:', err);
        }
      }
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      badge: 'Chat',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      badge: 'Feed',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      badge: 'Channel',
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(postTitle || 'SERVA Opportunity')}`
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E3EAE7] p-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E3EAE7]">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center shadow-xs">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#17211F] font-display">
                  {title}
                </h3>
                <p className="text-xs text-[#64716D] truncate max-w-[240px]">
                  {postTitle || 'Share with your network or friends'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-[#17211F] hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Social Channels Grid */}
          <div className="py-5 space-y-4">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Share directly to:
            </span>

            <div className="grid grid-cols-3 gap-3">
              {shareOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <a
                    key={opt.name}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-3.5 rounded-2xl border border-[#E3EAE7] hover:border-transparent hover:shadow-card-hover group transition-all text-center"
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${opt.color} transition-transform group-hover:scale-110`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#17211F]">{opt.name}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{opt.badge}</span>
                  </a>
                );
              })}
            </div>

            {/* Native device share if supported */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#17211F] transition-colors"
              >
                <Smartphone className="w-4 h-4 text-[#0F766E]" />
                Share via Mobile Device Apps...
              </button>
            )}

            {/* Copy Link input box */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Or copy post link:
              </span>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-[#E3EAE7] bg-[#F7F9F8] focus-within:border-[#0F766E]">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 px-3 py-1.5 text-xs text-gray-700 bg-transparent focus:outline-none font-mono truncate"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                    copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0F766E] text-white hover:bg-[#134E4A]'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-[#E3EAE7] text-center">
            <p className="text-[11px] text-gray-400">
              Anyone with this link can view the verified SERVA listing details.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareModal;

