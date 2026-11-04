import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import Avatar from './Avatar';
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Send,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  CheckCheck,
  CheckCircle2,
  User
} from 'lucide-react';

// Custom branded SERVA / Bazaraki Messenger Icon
export const ServaMessengerIcon = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="servaMsgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0F766E" />
        <stop offset="50%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C7F36B" />
        <stop offset="100%" stopColor="#FACC15" />
      </linearGradient>
    </defs>
    {/* Chat bubble body */}
    <path
      d="M16 2.5C8.544 2.5 2.5 7.918 2.5 14.606C2.5 18.423 4.417 21.802 7.42 24.032V29.5L12.568 26.685C13.67 26.98 14.818 27.135 16 27.135C23.456 27.135 29.5 21.717 29.5 15.029C29.5 8.341 23.456 2.5 16 2.5Z"
      fill="url(#servaMsgGrad)"
    />
    {/* Lightning / Speed bolt motif inside bubble */}
    <path
      d="M17.5 7.5L10.5 16.5H15.5L14.5 23.5L21.5 14.5H16.5L17.5 7.5Z"
      fill="url(#boltGrad)"
    />
  </svg>
);

const FloatingMessenger = ({
  isOpen,
  onClose,
  recipient,
  itemContext = null // { title, type, budget, id }
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize conversation and sample messages
  useEffect(() => {
    if (!isOpen || !recipient) return;

    const loadConversation = async () => {
      if (isAuthenticated) {
        try {
          const res = await apiClient.get('/messages/conversations');
          const convs = res.data.conversations || [];
          const found = convs.find(c =>
            c.participants?.some(p => (p._id || p).toString() === recipient._id?.toString())
          );

          if (found) {
            setActiveConversationId(found._id);
            const msgRes = await apiClient.get(`/messages/${found._id}`);
            setMessages(msgRes.data.messages || []);
            if (msgRes.data.isTyping !== undefined) {
              setIsOtherTyping(msgRes.data.isTyping);
            }
            return;
          }
        } catch (err) {
          console.warn('Could not fetch existing conversation:', err);
        }
      }

      // Default welcome context message
      setMessages([
        {
          _id: 'welcome_1',
          sender: { _id: recipient._id, name: recipient.name, avatar: recipient.avatar },
          text: `Hello! Thanks for your interest in "${itemContext?.title || 'my listing'}". Feel free to ask any questions!`,
          createdAt: new Date().toISOString()
        }
      ]);
    };

    loadConversation();
  }, [isOpen, recipient, isAuthenticated, itemContext?.title]);

  // Track active floating conversation globally to suppress duplicate notification toasts
  useEffect(() => {
    if (isOpen) {
      if (activeConversationId) {
        window.__activeServaFloatingConversationId = activeConversationId.toString();
      }
      if (recipient?._id) {
        window.__activeServaRecipientId = (recipient._id || recipient).toString();
      }
    } else {
      window.__activeServaFloatingConversationId = null;
    }

    return () => {
      window.__activeServaFloatingConversationId = null;
    };
  }, [isOpen, activeConversationId, recipient?._id]);

  // Real-time polling every 2 seconds to synchronize messages and typing indicator
  useEffect(() => {
    if (!isOpen || !activeConversationId || !isAuthenticated) return;

    const pollMessages = async () => {
      try {
        const res = await apiClient.get(`/messages/${activeConversationId}`);
        if (res.data?.messages) {
          setMessages(res.data.messages);
        }
        if (res.data?.isTyping !== undefined) {
          setIsOtherTyping(res.data.isTyping);
        }
        if (res.data?.isOtherOnline !== undefined) {
          setIsOtherOnline(res.data.isOtherOnline);
        }
      } catch (err) {
        // silent fallback for polling
      }
    };

    const intervalId = setInterval(pollMessages, 2000);
    return () => clearInterval(intervalId);
  }, [isOpen, activeConversationId, isAuthenticated]);

  // Helper to check if a sent message was seen by other participant
  const isMessageReadByOther = (msg, otherUserId) => {
    if (!msg || !otherUserId) return false;
    if (!msg.readBy || !Array.isArray(msg.readBy)) return false;
    const targetId = otherUserId.toString();
    return msg.readBy.some(r => (r._id || r).toString() === targetId);
  };

  // Cross-tab immediate sync via BroadcastChannel
  useEffect(() => {
    let ch;
    try {
      ch = new BroadcastChannel('serva_chat_events');
      ch.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'NEW_MESSAGE' && data.conversationId === activeConversationId) {
          setMessages(prev => {
            if (prev.some(m => m._id === data.message?._id)) return prev;
            return [...prev, data.message];
          });
        } else if (data.type === 'TYPING' && data.conversationId === activeConversationId) {
          if (data.senderId !== user?._id) {
            setIsOtherTyping(data.isTyping);
          }
        } else if (data.type === 'MESSAGES_READ' && data.conversationId === activeConversationId) {
          if (data.readerId !== user?._id) {
            setMessages(prev =>
              prev.map(m => {
                const readSet = new Set((m.readBy || []).map(r => (r._id || r).toString()));
                readSet.add(data.readerId.toString());
                return { ...m, readBy: Array.from(readSet) };
              })
            );
          }
        }
      };
    } catch (err) {}

    return () => {
      if (ch) ch.close();
    };
  }, [activeConversationId, user?._id]);

  // Scroll to bottom on message or typing change
  useEffect(() => {
    if (!isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOtherTyping, isMinimized, workscreenFullscreen => isFullscreen]);

  // Handle typing change
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (!isAuthenticated || !activeConversationId) return;

    // 1. Broadcast locally
    try {
      const ch = new BroadcastChannel('serva_chat_events');
      ch.postMessage({
        type: 'TYPING',
        conversationId: activeConversationId,
        senderId: user?._id,
        isTyping: true
      });
      ch.close();
    } catch (err) {}

    // 2. Server typing update
    apiClient.post(`/messages/${activeConversationId}/typing`, { isTyping: true }).catch(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      try {
        const ch = new BroadcastChannel('serva_chat_events');
        ch.postMessage({
          type: 'TYPING',
          conversationId: activeConversationId,
          senderId: user?._id,
          isTyping: false
        });
        ch.close();
      } catch (err) {}
      apiClient.post(`/messages/${activeConversationId}/typing`, { isTyping: false }).catch(() => {});
    }, 2500);
  };

  const handleSend = async (eOrText = null) => {
    if (eOrText && typeof eOrText.preventDefault === 'function') {
      eOrText.preventDefault();
    }
    const text = (typeof eOrText === 'string' ? eOrText : inputText);
    if (!text || !text.trim()) return;

    if (!isAuthenticated) {
      if (window.confirm('Please sign in to send messages on SERVA. Sign in now?')) {
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
      return;
    }

    const trimmed = text.trim();
    const tempId = 'temp_' + Date.now();
    const newMsg = {
      _id: tempId,
      sender: { _id: user?._id, name: user?.name, avatar: user?.avatar },
      text: trimmed,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setSending(true);

    try {
      const payload = activeConversationId
        ? { conversationId: activeConversationId, text: trimmed }
        : { recipientId: recipient._id, text: trimmed };

      const res = await apiClient.post('/messages', payload);
      const convId = res.data.conversationId || res.data.conversation?._id;
      if (convId && !activeConversationId) {
        setActiveConversationId(convId);
      }

      // Replace temp message with server saved message
      if (res.data.message) {
        setMessages(prev => prev.map(m => (m._id === tempId ? res.data.message : m)));

        // Broadcast to other tabs immediately
        try {
          const ch = new BroadcastChannel('serva_chat_events');
          ch.postMessage({
            type: 'NEW_MESSAGE',
            conversationId: convId || activeConversationId,
            message: res.data.message
          });
          ch.close();
        } catch (err) {}
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const quickChips = [
    'Is this opportunity still open?',
    'What is your expected timeline?',
    'I can start work tomorrow morning.',
    'Can we negotiate the budget?'
  ];

  if (!isOpen || !recipient) return null;

  // Render Messenger Content Body
  const renderMessengerContent = () => (
    <>
      {/* Top Branded Messenger Header */}
      <div className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#134E4A] text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between shadow-md shrink-0">
        {/* Recipient Profile Info (Clicking navigates to his public profile) */}
        <div
          onClick={() => {
            if (recipient?._id) {
              navigate(`/users/${recipient._id}`);
            }
          }}
          className="flex items-center gap-3 min-w-0 cursor-pointer group"
          title={`Click to view ${recipient.name}'s public profile & all posts`}
        >
          <div className="relative shrink-0 group-hover:scale-105 transition-transform">
            <Avatar src={recipient.avatar} size="sm" isOnline={recipient.isAvailableNow} />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#C7F36B] rounded-full border-2 border-[#0F766E]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-extrabold truncate text-white group-hover:underline">
                {recipient.name}
              </h3>
              <ServaMessengerIcon className="w-4 h-4 shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-teal-100">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C7F36B] animate-pulse" />
              <span>SERVA Verified • View Profile & Posts →</span>
            </div>
          </div>
        </div>

        {/* Action Controls with Prominent Minimize & Zoom Buttons */}
        <div className="flex items-center gap-1.5 text-white shrink-0 ml-2">
          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => {
              setIsFullscreen(false);
              setIsMinimized(true);
            }}
            className="p-1.5 bg-white/10 hover:bg-white/25 rounded-xl transition-colors text-white"
            title="Minimize to corner"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Fullscreen / Restore Toggle Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-white/10 hover:bg-white/25 rounded-xl transition-colors text-white"
            title={isFullscreen ? 'Restore to compact floating window' : 'Zoom to full screen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 bg-white/10 hover:bg-red-500/80 rounded-xl transition-colors text-white"
            title="Close messenger"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Context Item Bar */}
      {itemContext && (
        <div className="bg-[#E6F4F2] px-4 py-2 border-b border-[#E3EAE7] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-[#0F766E] uppercase text-[10px] bg-teal-100 px-2 py-0.5 rounded">
              {itemContext.type || 'Listing'}
            </span>
            <span className="truncate font-semibold text-[#17211F]">{itemContext.title}</span>
          </div>
          {itemContext.budget !== undefined && itemContext.budget !== null && (
            <span className="text-[#0F766E] font-black shrink-0 font-mono text-xs">
              BDT {Number(itemContext.budget).toLocaleString()}
            </span>
          )}
        </div>
      )}

      {/* Message Stream (100% Solid background to prevent footer bleed) */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAF9]">
        {messages.map((msg, i) => {
          const isMe = msg.sender?._id?.toString() === user?._id?.toString();
          const isRead = isMessageReadByOther(msg, recipient?._id);
          const isOtherUserOnline = isOtherOnline || Boolean(recipient?.isOnline) || Boolean(recipient?.isAvailableNow);

          return (
            <div
              key={msg._id || i}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div
                  onClick={() => recipient?._id && navigate(`/users/${recipient._id}`)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  title={`View ${msg.sender?.name}'s profile`}
                >
                  <Avatar src={msg.sender?.avatar} size="xs" />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isMe
                    ? 'bg-[#0F766E] text-white rounded-br-xs'
                    : 'bg-white text-[#17211F] border border-[#E3EAE7] rounded-bl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span
                    className={`text-[9px] ${
                      isMe ? 'text-teal-100/90' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {/* WhatsApp-Style Double Checkmark: Only show if other user is online. White if unread, Blue if seen */}
                  {isMe && isOtherUserOnline && (
                    <CheckCheck
                      className={`w-3.5 h-3.5 ${
                        isRead ? 'text-[#53BDEB]' : 'text-white drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.45)]'
                      }`}
                      title={isRead ? 'Seen by recipient' : 'Delivered (recipient online, unread)'}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* WhatsApp-Style 3-Dot Floating Typing Indicator */}
        {isOtherTyping && (
          <div className="flex items-end gap-2 justify-start animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div
              onClick={() => recipient?._id && navigate(`/users/${recipient._id}`)}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              title={`View ${recipient?.name}'s profile`}
            >
              <Avatar src={recipient?.avatar} size="xs" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-xs border border-[#E3EAE7] shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '160ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '320ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-white border-t border-[#E3EAE7]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full bg-gray-100 hover:bg-[#E6F4F2] hover:text-[#0F766E] text-[#64716D] font-medium transition-colors shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-[#E3EAE7] shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E] bg-gray-50 focus:bg-white transition-colors"
          />
          <button
            type="submit"
            disabled={sending || !inputText.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 shadow-sm"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* View Full Chat in Dashboard Link */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-[#64716D]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
            Protected by SERVA Escrow
          </span>
          <button
            onClick={() => navigate(`/dashboard/messages?recipientId=${recipient._id}`)}
            className="text-[#0F766E] hover:underline font-semibold flex items-center gap-0.5"
          >
            Open Full Inbox <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>
    </>
  );

  const modalContent = (
    <AnimatePresence>
      {/* 1. Zoomed / Fullscreen Overlay View (z-[99999] to prevent any footer or element overlap) */}
      {isFullscreen && !isMinimized && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border border-[#E3EAE7] flex flex-col overflow-hidden w-full max-w-4xl h-[90vh] max-h-[850px] relative"
          >
            {renderMessengerContent()}
          </motion.div>
        </div>
      )}

      {/* 2. Minimized Floating Corner Bubble */}
      {isMinimized && (
        <div className="fixed z-[99999] bottom-4 right-4 sm:bottom-6 sm:right-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={() => setIsMinimized(false)}
            className="cursor-pointer bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white p-3 sm:p-3.5 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform border border-white/20"
          >
            <div className="relative">
              <Avatar src={recipient.avatar} size="sm" isOnline={recipient.isAvailableNow} />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#C7F36B] rounded-full border-2 border-[#0F766E]" />
            </div>
            <div className="hidden sm:block pr-2">
              <p className="text-xs font-bold leading-tight truncate max-w-[140px]">{recipient.name}</p>
              <p className="text-[10px] text-teal-100 font-medium">Click to chat</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}

      {/* 3. Normal Compact Floating Corner Window */}
      {!isFullscreen && !isMinimized && (
        <div className="fixed z-[99999] bottom-4 right-4 sm:bottom-6 sm:right-6">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl border border-[#E3EAE7] flex flex-col overflow-hidden w-[92vw] sm:w-[410px] h-[540px] max-h-[85vh]"
          >
            {renderMessengerContent()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
};

export default FloatingMessenger;
