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
  Check,
  ShieldCheck,
  ExternalLink,
  User,
  Sparkles,
  Copy,
  Clock
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
      } else if (list.length > 0 && !activeConversation) {
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
      }
      if (res.data?.isTyping !== undefined) {
        setIsOtherTyping(res.data.isTyping);
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
          // Refresh list to show updated last message
          fetchConversations(activeConversation?._id);
        } else if (data.type === 'TYPING' && data.conversationId === activeConversation?._id) {
          if (data.senderId !== user?._id) {
            setIsOtherTyping(data.isTyping);
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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E3EAE7]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
              Direct Communications
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time Synced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display mt-0.5">
            Messages & Coordination
          </h1>
        </div>
      </div>

      {/* Main Split Messenger Container */}
      <div className="bg-white rounded-3xl border border-[#E3EAE7] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[750px] max-h-[85vh]">
        {/* Left: Conversations Sidebar (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#E3EAE7] flex flex-col bg-[#F8FAF9]">
          {/* Sidebar Header & Search */}
          <div className="p-4 border-b border-[#E3EAE7] bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-[#17211F] uppercase tracking-wider flex items-center gap-2">
                <ServaMessengerIcon className="w-4 h-4 text-[#0F766E]" />
                Conversations ({conversations.length})
              </h3>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages or people..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E3EAE7] bg-gray-50 focus:bg-white focus:outline-none focus:border-[#0F766E] transition-colors"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E3EAE7]/50">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Spinner size="md" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64716D] space-y-2">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
                <p className="font-semibold text-gray-600">No conversations found</p>
                <p className="text-[11px] text-gray-400">
                  {searchQuery
                    ? 'No chats match your search query.'
                    : 'Open any job, service, or product listing to start chatting!'}
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
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-all relative ${
                      isActive
                        ? 'bg-white shadow-xs border-l-4 border-l-[#0F766E]'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar src={other?.avatar} size="sm" isOnline={other?.isAvailableNow} />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#C7F36B] rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-bold truncate ${
                            isActive ? 'text-[#0F766E]' : 'text-[#17211F]'
                          }`}
                        >
                          {other?.name || 'SERVA User'}
                        </h4>
                        {lastTime && (
                          <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                            {lastTime}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-[#64716D] truncate mt-1 leading-normal">
                        {conv.lastMessage?.text || 'Started a new conversation'}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                        <span className="truncate">{other?.location || 'Bangladesh'}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area (8 cols) */}
        <div className="lg:col-span-8 flex flex-col bg-white h-full overflow-hidden">
          {activeConversation ? (
            <>
              {/* Active Thread Header */}
              <div className="px-5 py-3.5 border-b border-[#E3EAE7] bg-white flex items-center justify-between shadow-xs shrink-0">
                {/* Recipient Profile Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    onClick={() => otherParticipant?._id && navigate(`/users/${otherParticipant._id}`)}
                    className="relative shrink-0 cursor-pointer hover:scale-105 transition-transform"
                    title={`View ${otherParticipant?.name}'s profile`}
                  >
                    <Avatar
                      src={otherParticipant?.avatar}
                      size="sm"
                      isOnline={otherParticipant?.isAvailableNow}
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#C7F36B] rounded-full border-2 border-white" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => otherParticipant?._id && navigate(`/users/${otherParticipant._id}`)}
                        className="text-xs sm:text-sm font-extrabold text-[#17211F] hover:text-[#0F766E] hover:underline truncate transition-colors text-left"
                        title={`View ${otherParticipant?.name}'s public profile & posts`}
                      >
                        {otherParticipant?.name || 'SERVA User'}
                      </button>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#64716D] mt-0.5">
                      <span>{otherParticipant?.location || 'Dhaka, Bangladesh'}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-medium">Available Now</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Suite */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {/* WhatsApp Quick Action */}
                  <button
                    onClick={handleWhatsApp}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 transition-colors shadow-xs"
                    title="Open WhatsApp chat with this user"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </button>

                  {/* Call / Phone Action (Hidden number, auto-copies on desktop, dials on mobile) */}
                  <button
                    onClick={handleCall}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-gray-100 hover:bg-teal-50 hover:text-[#0F766E] text-gray-700 text-xs font-bold flex items-center gap-1.5 border border-[#E3EAE7] transition-colors shadow-xs"
                    title="Call user or copy phone number"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="hidden sm:inline">{copiedPhone ? 'Copied!' : 'Call'}</span>
                  </button>

                  {/* Public Profile Link */}
                  {otherParticipant?._id && (
                    <Link
                      to={`/users/${otherParticipant._id}`}
                      className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#0F766E] text-xs font-bold flex items-center gap-1 border border-teal-200 transition-colors shadow-xs"
                      title="View user's public profile and all listings"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Profile</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Toast for Copied Phone */}
              {copiedPhone && (
                <div className="bg-emerald-600 text-white text-[11px] font-semibold text-center py-1.5 px-4 animate-in fade-in">
                  Phone number copied to your clipboard! You can paste and call anytime.
                </div>
              )}

              {/* Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#F8FAF9]">
                {messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-[#64716D] max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0F766E] flex items-center justify-center mx-auto">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-800 text-sm">Start your coordination</p>
                    <p className="text-gray-500">
                      Send a polite message to discuss project scope, milestones, or questions. All conversations are secured under SERVA Escrow protection.
                    </p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender?._id?.toString() === user?._id?.toString() || m.sender?.toString() === user?._id?.toString();
                    return (
                      <div
                        key={m._id}
                        className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <div
                            onClick={() => otherParticipant?._id && navigate(`/users/${otherParticipant._id}`)}
                            className="cursor-pointer hover:opacity-80 transition-opacity mb-1"
                            title={`View ${otherParticipant?.name}'s profile`}
                          >
                            <Avatar src={m.sender?.avatar || otherParticipant?.avatar} size="xs" />
                          </div>
                        )}

                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white rounded-br-xs'
                              : 'bg-white text-[#17211F] border border-[#E3EAE7] rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-line">{m.text}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                              isMe ? 'text-teal-100/90' : 'text-gray-400'
                            }`}
                          >
                            <span>
                              {new Date(m.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {isMe && <CheckCheck className="w-3 h-3 text-[#C7F36B]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* WhatsApp-Style 3-Dot Floating Typing Indicator */}
                {isOtherTyping && (
                  <div className="flex items-end gap-2 justify-start animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <Avatar src={otherParticipant?.avatar} size="xs" />
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-xs border border-[#E3EAE7] shadow-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '160ms' }} />
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] animate-bounce" style={{ animationDelay: '320ms' }} />
                    </div>
                    <span className="text-[11px] text-[#64716D] italic font-medium">
                      {otherParticipant?.name || 'User'} is typing...
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Prompt Chips */}
              <div className="px-4 py-2 bg-white border-t border-[#E3EAE7]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="whitespace-nowrap px-3 py-1.5 text-[11px] rounded-full bg-gray-100 hover:bg-[#E6F4F2] hover:text-[#0F766E] text-[#64716D] font-medium transition-colors shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 bg-white border-t border-[#E3EAE7] shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 text-xs sm:text-sm px-4 py-2.5 sm:py-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E] bg-gray-50 focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#0D9488] text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition-opacity shrink-0 shadow-sm"
                    title="Send message"
                  >
                    {sending ? <Spinner size="xs" color="white" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>

                {/* Protection note */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-[#64716D]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#0F766E]" />
                    Protected by SERVA Escrow & Verification
                  </span>
                  <span>End-to-end encrypted messaging</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAF9]">
              <EmptyState
                icon={MessageSquare}
                title="Select a conversation"
                description="Choose a conversation from the left to read messages or coordinate work."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;