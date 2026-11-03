import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { Spinner } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { ServaMessengerIcon } from '../../components/common/FloatingMessenger';
import {
  Send,
  MessageSquare,
  Search,
  Phone,
  MessageCircle,
  CheckCheck,
  ShieldCheck,
  User,
  Sparkles,
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Smile
} from 'lucide-react';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const directRecipientId = searchParams.get('recipientId');
  const directConvId = searchParams.get('convId');
  const navigate = useNavigate();

  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch all conversations
  const fetchConversations = async (autoSelectId = null) => {
    try {
      const res = await apiClient.get('/messages/conversations');
      const list = res.data.conversations || [];
      setConversations(list);

      if (autoSelectId) {
        const found = list.find(c => c._id === autoSelectId);
        if (found) setActiveConversation(found);
      } else if (directConvId) {
        const found = list.find(c => c._id === directConvId);
        if (found) setActiveConversation(found);
      } else if (directRecipientId) {
        const found = list.find(c =>
          c.participants?.some(p => (p._id || p).toString() === directRecipientId.toString())
        );
        if (found) setActiveConversation(found);
      } else if (list.length > 0 && !activeConversation && window.innerWidth >= 768) {
        // Auto-select first conversation only on wider desktop screens
        setActiveConversation(list[0]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [directConvId, directRecipientId]);

  // Fetch messages for active conversation
  const fetchActiveMessages = async () => {
    if (!activeConversation) return;
    try {
      const res = await apiClient.get(`/messages/${activeConversation._id}`);
      if (res.data?.messages) {
        setMessages(res.data.messages);

        // Broadcast to other tabs that messages were seen/read
        try {
          const ch = new BroadcastChannel('serva_chat_events');
          ch.postMessage({
            type: 'MESSAGES_READ',
            conversationId: activeConversation._id,
            readerId: user?._id
          });
          ch.close();
        } catch (err) {}
      }
      if (res.data?.isTyping !== undefined) {
        setIsOtherTyping(res.data.isTyping);
      }
      if (res.data?.isOtherOnline !== undefined) {
        setIsOtherOnline(res.data.isOtherOnline);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchActiveMessages();
  }, [activeConversation?._id]);

  // Real-time polling every 2 seconds for active conversation
  useEffect(() => {
    if (!activeConversation?._id) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await apiClient.get(`/messages/${activeConversation._id}`);
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
        // silent polling error
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [activeConversation?._id]);

  // Cross-tab broadcast channel sync
  useEffect(() => {
    let ch;
    try {
      ch = new BroadcastChannel('serva_chat_events');
      ch.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'NEW_MESSAGE') {
          if (data.conversationId === activeConversation?._id) {
            setMessages(prev => {
              if (prev.some(m => m._id === data.message?._id)) return prev;
              return [...prev, data.message];
            });
          }
          fetchConversations(activeConversation?._id);
        } else if (data.type === 'TYPING' && data.conversationId === activeConversation?._id) {
          if (data.senderId !== user?._id) {
            setIsOtherTyping(data.isTyping);
          }
        } else if (data.type === 'MESSAGES_READ' && data.conversationId === activeConversation?._id) {
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
  }, [activeConversation?._id, user?._id]);

  // Scroll to bottom on message changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOtherTyping]);

  const getOtherParticipant = (conv) => {
    if (!conv || !conv.participants) return null;
    return conv.participants.find(p => (p._id || p).toString() !== user?._id?.toString()) || conv.participants[0];
  };

  const otherParticipant = getOtherParticipant(activeConversation);
  const isOtherUserOnline = isOtherOnline || Boolean(otherParticipant?.isOnline) || Boolean(otherParticipant?.isAvailableNow);

  // Helper to check if a sent message was seen by other participant
  const isMessageReadByOther = (msg, otherUserId) => {
    if (!msg || !otherUserId) return false;
    if (!msg.readBy || !Array.isArray(msg.readBy)) return false;
    const targetId = otherUserId.toString();
    return msg.readBy.some(r => (r._id || r).toString() === targetId);
  };

  // Handle typing change in input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    if (!activeConversation?._id) return;

    // 1. Broadcast locally
    try {
      const ch = new BroadcastChannel('serva_chat_events');
      ch.postMessage({
        type: 'TYPING',
        conversationId: activeConversation._id,
        senderId: user?._id,
        isTyping: true
      });
      ch.close();
    } catch (err) {}

    // 2. Server typing update
    apiClient.post(`/messages/${activeConversation._id}/typing`, { isTyping: true }).catch(() => {});

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      try {
        const ch = new BroadcastChannel('serva_chat_events');
        ch.postMessage({
          type: 'TYPING',
          conversationId: activeConversation._id,
          senderId: user?._id,
          isTyping: false
        });
        ch.close();
      } catch (err) {}
      apiClient.post(`/messages/${activeConversation._id}/typing`, { isTyping: false }).catch(() => {});
    }, 2500);
  };

  // Send message
  const handleSendMessage = async (textToSend = null) => {
    const text = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!text) return;

    const tempId = 'temp_' + Date.now();
    const tempMsg = {
      _id: tempId,
      sender: { _id: user?._id, name: user?.name, avatar: user?.avatar },
      text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempMsg]);
    setInputText('');
    setSending(true);

    try {
      const payload = {
        text,
        conversationId: activeConversation?._id,
        recipientId: !activeConversation ? (directRecipientId || otherParticipant?._id) : undefined
      };

      const res = await apiClient.post('/messages', payload);
      const convId = res.data.conversationId || res.data.conversation?._id;

      if (res.data.message) {
        setMessages(prev => prev.map(m => (m._id === tempId ? res.data.message : m)));

        // Broadcast to other tabs immediately
        try {
          const ch = new BroadcastChannel('serva_chat_events');
          ch.postMessage({
            type: 'NEW_MESSAGE',
            conversationId: convId || activeConversation?._id,
            message: res.data.message
          });
          ch.close();
        } catch (err) {}
      }

      fetchConversations(convId || activeConversation?._id);
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Handle Call button click (Auto-dial on mobile, auto-copy on desktop without leaking number)
  const handleCall = () => {
    const phone = otherParticipant?.phone || '01715998877';
    const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `tel:${phone}`;
    } else {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 3000);
    }
  };

  // Handle WhatsApp button click
  const handleWhatsApp = () => {
    const phone = otherParticipant?.phone || '01715998877';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone.replace(/^0/, '')}`;
    const text = encodeURIComponent(`Hello ${otherParticipant?.name || ''}, I am connecting with you via SERVA.`);
    window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
  };

  const quickChips = [
    'Is this opportunity still open?',
    'What is your expected timeline?',
    'I can start work tomorrow morning.',
    'Can we negotiate the budget?'
  ];

  const filteredConversations = conversations.filter(conv => {
    const other = getOtherParticipant(conv);
    const nameMatch = other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const msgMatch = conv.lastMessage?.text?.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || msgMatch;
  });

  return (
    <div className="space-y-3 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Page Info */}
      <div className="flex items-center justify-between pb-1 border-b border-[#E3EAE7]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Direct Communications
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp Synced
          </span>
        </div>
      </div>

      {/* WhatsApp Web Style Split Container */}
      {/* On mobile / split narrow view: shows ONLY ONE panel at a time (never stacked 2 boxes) */}
      {/* On desktop (md:): shows side-by-side split view */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E3EAE7] shadow-xl overflow-hidden flex flex-col md:flex-row h-[750px] max-h-[85vh]">
        {/* ======================================================== */}
        {/* PANEL 1: Conversations List (Hidden on mobile if chat active) */}
        {/* ======================================================== */}
        <div
          className={`${
            activeConversation ? 'hidden md:flex' : 'flex'
          } w-full md:w-[320px] lg:w-[380px] shrink-0 flex-col bg-[#F8FAF9] md:border-r border-[#E3EAE7] h-full`}
        >
          {/* WhatsApp Style Sidebar Header */}
          <div className="p-3.5 border-b border-[#E3EAE7] bg-white space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ServaMessengerIcon className="w-5 h-5" />
                <h2 className="text-sm font-extrabold text-[#111B21]">Chats</h2>
                <span className="text-xs text-[#667781] font-semibold">({conversations.length})</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search or start new chat..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-[#E3EAE7] bg-[#F0F2F5] focus:bg-white focus:outline-none focus:border-[#0F766E] transition-colors"
              />
            </div>
          </div>

          {/* Conversation Rows */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E3EAE7]/40">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64716D] space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-semibold text-gray-600">No chats found</p>
                <p className="text-[11px] text-gray-400">
                  {searchQuery
                    ? 'No conversations match your search.'
                    : 'Contact any job poster or service provider to start chatting!'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isActive = activeConversation?._id === conv._id;
                const lastTime = conv.lastMessage?.createdAt
                  ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '';

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full px-3.5 py-3 flex items-center gap-3 text-left transition-all ${
                      isActive
                        ? 'bg-[#E9EDEF]/70 border-l-4 border-l-[#0F766E]'
                        : 'hover:bg-[#F0F2F5]'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar src={other?.avatar} size="sm" isOnline={other?.isAvailableNow} />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isActive ? 'text-[#0F766E]' : 'text-[#111B21]'
                          }`}
                        >
                          {other?.name || 'SERVA User'}
                        </h4>
                        {lastTime && (
                          <span className="text-[10px] text-[#667781] shrink-0 font-mono">
                            {lastTime}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#667781] truncate mt-0.5 leading-normal">
                        {conv.lastMessage?.text || 'Started a new conversation'}
                      </p>

                      <div className="text-[10px] text-gray-400 truncate mt-0.5">
                        {other?.location || 'Dhaka, Bangladesh'}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PANEL 2: Active Chat Area (Takes 100% when active on mobile) */}
        {/* ======================================================== */}
        <div
          className={`${
            !activeConversation ? 'hidden md:flex' : 'flex'
          } flex-1 flex-col bg-[#EFEAE2]/30 h-full overflow-hidden`}
        >
          {activeConversation ? (
            <>
              {/* WhatsApp Style Top Header with Back Arrow on Mobile */}
              <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 border-b border-[#E3EAE7] bg-white flex items-center justify-between shadow-xs shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* WhatsApp Back Button (Returns to chat list on narrow/mobile view) */}
                  <button
                    type="button"
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-full hover:bg-gray-100 text-[#111B21] transition-colors"
                    title="Back to chat list"
                  >
                    <ArrowLeft className="w-5 h-5 text-[#0F766E]" />
                  </button>

                  {/* Recipient Profile Info */}
                  <div
                    onClick={() => otherParticipant?._id && navigate(`/users/${otherParticipant._id}`)}
                    className="relative shrink-0 cursor-pointer hover:opacity-90"
                    title={`View ${otherParticipant?.name}'s profile`}
                  >
                    <Avatar
                      src={otherParticipant?.avatar}
                      size="sm"
                      isOnline={otherParticipant?.isAvailableNow}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => otherParticipant?._id && navigate(`/users/${otherParticipant._id}`)}
                        className="text-xs sm:text-sm font-extrabold text-[#111B21] hover:text-[#0F766E] truncate text-left"
                      >
                        {otherParticipant?.name || 'SERVA User'}
                      </button>
                      <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-bold text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded-full border border-teal-200">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified
                      </span>
                    </div>
                    <div className="text-[10px] text-[#667781] truncate">
                      {isOtherTyping ? (
                        <span className="text-[#0F766E] font-semibold animate-pulse">typing...</span>
                      ) : (
                        <span>{otherParticipant?.location || 'Dhaka'} • Online</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Action Suite */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* WhatsApp Quick Action */}
                  <button
                    onClick={handleWhatsApp}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold flex items-center gap-1 transition-colors border border-[#25D366]/30"
                    title="Open WhatsApp chat"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {/* Call Action (Number hidden, auto-dial on mobile, copy on desktop) */}
                  <button
                    onClick={handleCall}
                    className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#111B21] text-xs font-bold flex items-center gap-1 transition-colors border border-[#E3EAE7]"
                    title="Call user or copy phone number"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="hidden sm:inline">{copiedPhone ? 'Copied!' : 'Call'}</span>
                  </button>

                  {/* Profile Link */}
                  {otherParticipant?._id && (
                    <Link
                      to={`/users/${otherParticipant._id}`}
                      className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold flex items-center gap-1 transition-colors border border-teal-200"
                      title="View public profile & listings"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Profile</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Toast for Copied Phone */}
              {copiedPhone && (
                <div className="bg-[#25D366] text-white text-[11px] font-semibold text-center py-1 px-4 animate-in fade-in">
                  Phone number copied to clipboard!
                </div>
              )}

              {/* WhatsApp Message Stream */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-[#efeae2]/35">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-[#667781] max-w-sm mx-auto space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#E7F7F2] text-[#0F766E] flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-[#111B21] text-sm">No messages yet</p>
                    <p className="text-[11px]">
                      Send a message to discuss requirements or coordinate work. Conversations are protected by SERVA.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe =
                      m.sender?._id?.toString() === user?._id?.toString() ||
                      m.sender?.toString() === user?._id?.toString();

                    return (
                      <div
                        key={m._id}
                        className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div
                            onClick={() => otherParticipant?._id && navigate(`/users/${otherParticipant._id}`)}
                            className="cursor-pointer mb-0.5"
                            title={`View ${otherParticipant?.name}'s profile`}
                          >
                            <Avatar src={m.sender?.avatar || otherParticipant?.avatar} size="xs" />
                          </div>
                        )}

                        {/* WhatsApp-Style Message Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-xs border border-[#C5E8BF]'
                              : 'bg-white text-[#111B21] rounded-tl-xs border border-[#E3EAE7]'
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.text}</p>
                          <div className="flex items-center justify-end gap-1 text-[9px] text-[#667781] mt-0.5">
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {/* WhatsApp-Style Double Checkmarks:
                                - If other user is NOT online: no tick will be shown!
                                - If other user IS online:
                                    * Blue tick if seen by other user
                                    * White tick if delivered (online, not seen yet)
                            */}
                            {isMe && isOtherUserOnline && (
                              <CheckCheck
                                className={`w-3.5 h-3.5 ${
                                  isMessageReadByOther(m, otherParticipant?._id)
                                    ? 'text-[#53BDEB]' // Seen: Double Blue Tick
                                    : 'text-white drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.5)]' // Delivered: Double White Tick
                                }`}
                                title={
                                  isMessageReadByOther(m, otherParticipant?._id)
                                    ? 'Seen by ' + (otherParticipant?.name || 'recipient')
                                    : 'Delivered (recipient online, unread)'
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* WhatsApp-Style 3-Dot Floating Typing Indicator */}
                {isOtherTyping && (
                  <div className="flex items-end gap-1.5 justify-start animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <Avatar src={otherParticipant?.avatar} size="xs" />
                    <div className="bg-white px-3.5 py-2.5 rounded-2xl rounded-tl-xs border border-[#E3EAE7] shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '160ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '320ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Prompt Chips */}
              <div className="px-3 py-1.5 bg-white border-t border-[#E3EAE7]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="whitespace-nowrap px-2.5 py-1 text-[11px] rounded-full bg-[#F0F2F5] hover:bg-[#E7F7F2] hover:text-[#0F766E] text-[#667781] font-medium transition-colors shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* WhatsApp Style Chat Input */}
              <div className="p-2.5 sm:p-3 bg-[#F0F2F5] border-t border-[#E3EAE7] shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#0F766E] bg-white focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="w-10 h-10 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white flex items-center justify-center disabled:opacity-40 transition-opacity shrink-0 shadow-sm"
                    title="Send message"
                  >
                    {sending ? <Spinner size="xs" color="white" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>

                <div className="mt-1.5 text-center text-[10px] text-[#667781] flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
                  <span>End-to-end encrypted messaging under SERVA Protection</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F0F2F5] text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#E7F7F2] text-[#0F766E] flex items-center justify-center shadow-xs">
                <ServaMessengerIcon className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#111B21]">SERVA Web Messenger</h3>
              <p className="text-xs text-[#667781] max-w-sm">
                Select a conversation from the left to start chatting, coordinate job requirements, or arrange direct contact.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;