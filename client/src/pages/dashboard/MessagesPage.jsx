import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import { Spinner } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Send, MessageSquare } from 'lucide-react';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const directRecipientId = searchParams.get('recipientId');
  const directConvId = searchParams.get('convId');

  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await apiClient.get('/messages/conversations');
      const list = res.data.conversations || [];
      setConversations(list);

      if (directConvId) {
        const found = list.find(c => c._id === directConvId);
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
  }, [directConvId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation) return;
      try {
        const res = await apiClient.get(`/messages/${activeConversation._id}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };
    fetchMessages();
  }, [activeConversation]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const payload = {
        text: inputText.trim(),
        conversationId: activeConversation?._id,
        recipientId: directRecipientId
      };
      const res = await apiClient.post('/messages', payload);
      setMessages(prev => [...prev, res.data.message]);
      setInputText('');
      fetchConversations();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherParticipant = (conv) => {
    return conv.participants?.find(p => p._id !== user?._id) || conv.participants?.[0];
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Direct Communications
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Messages & Coordination
        </h1>
      </div>

      <div className="bg-white rounded-3xl border border-[#E3EAE7] shadow-soft overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px]">
        {/* Conversations Sidebar */}
        <div className="md:col-span-4 border-r border-[#E3EAE7] flex flex-col bg-[#F7F9F8]">
          <div className="p-4 border-b border-[#E3EAE7]">
            <h3 className="text-xs font-bold text-[#17211F] uppercase tracking-wider">
              Conversations ({conversations.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#64716D]">
                No conversation history yet. Contact any job poster or service provider to start chatting.
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isActive = activeConversation?._id === conv._id;
                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-4 flex items-center gap-3 border-b border-[#E3EAE7]/60 text-left transition-colors ${
                      isActive ? 'bg-white border-l-4 border-l-[#0F766E]' : 'hover:bg-white/60'
                    }`}
                  >
                    <Avatar src={other?.avatar} size="sm" isOnline={other?.isAvailableNow} />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#17211F] truncate">{other?.name}</h4>
                      <p className="text-[11px] text-[#64716D] truncate mt-0.5">
                        {conv.lastMessage?.text || 'New conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Message Thread Area */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-[#E3EAE7] flex items-center gap-3 bg-[#F7F9F8]">
                <Avatar src={getOtherParticipant(activeConversation)?.avatar} size="sm" />
                <div>
                  <h3 className="text-xs font-bold text-[#17211F]">
                    {getOtherParticipant(activeConversation)?.name}
                  </h3>
                  <span className="text-[10px] text-[#64716D]">
                    {getOtherParticipant(activeConversation)?.location || 'Dhaka'}
                  </span>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px]">
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">
                    No messages yet. Say hello and coordinate your requirements!
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender?._id === user?._id || m.sender === user?._id;
                    return (
                      <div
                        key={m._id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-[#0F766E] text-white rounded-br-none'
                              : 'bg-[#F7F9F8] text-[#17211F] border border-[#E3EAE7] rounded-bl-none'
                          }`}
                        >
                          <p>{m.text}</p>
                          <span
                            className={`text-[9px] mt-1 block text-right ${
                              isMe ? 'text-teal-200' : 'text-gray-400'
                            }`}
                          >
                            {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E3EAE7] flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
                />
                <Button type="submit" variant="primary" size="sm" isLoading={sending}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
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
