import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../services/apiClient';
import Avatar from './Avatar';
import { ServaMessengerIcon } from './FloatingMessenger';
import { X, MessageSquare, ArrowRight, BellRing } from 'lucide-react';

// Synthesize pleasant messenger audio chime using Web Audio API (zero external assets needed)
const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Two-tone messenger chime (F5 -> A5)
    osc.frequency.setValueAtTime(698.46, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch (e) {
    // Ignore audio permission/context errors gracefully
  }
};

const RealtimeMessageToast = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [toastMessage, setToastMessage] = useState(null);
  const lastProcessedIdRef = useRef(null);
  const dismissTimerRef = useRef(null);

  // Send periodic presence heartbeat (every 10s) while user is logged in
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    // Initial heartbeat
    apiClient.post('/messages/presence').catch(() => {});

    const intervalId = setInterval(() => {
      apiClient.post('/messages/presence').catch(() => {});
    }, 10000);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, user?._id]);

  // Show toast notification helper
  const triggerToast = (msgPayload) => {
    if (!msgPayload || !msgPayload.text) return;
    if (msgPayload.sender?._id?.toString() === user?._id?.toString()) return;
    if (lastProcessedIdRef.current === (msgPayload._id || msgPayload.text)) return;

    lastProcessedIdRef.current = msgPayload._id || msgPayload.text;

    // Check if user is currently on the messages dashboard viewing this chat
    const currentPath = location.pathname;
    const isAlreadyInMessagesPage = currentPath.includes('/dashboard/messages');

    setToastMessage({
      id: msgPayload._id || Date.now(),
      sender: msgPayload.sender || { name: 'SERVA Member' },
      text: msgPayload.text,
      conversationId: msgPayload.conversationId || msgPayload.conversation,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    playNotificationSound();

    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 8000);
  };

  // 1. Cross-tab immediate sync via BroadcastChannel
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    let ch;
    try {
      ch = new BroadcastChannel('serva_chat_events');
      ch.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'NEW_MESSAGE' && data.message) {
          triggerToast({
            ...data.message,
            conversationId: data.conversationId
          });
        }
      };
    } catch (err) {}

    return () => {
      if (ch) ch.close();
    };
  }, [isAuthenticated, user?._id, location.pathname]);

  // 2. Real-time background notification polling (every 3 seconds) for cross-device / multi-client
  useEffect(() => {
    if (!isAuthenticated || !user?._id) return;

    let initialLoadDone = false;
    let knownNotificationIds = new Set();

    const checkNotifications = async () => {
      try {
        const res = await apiClient.get('/notifications');
        const notifs = res.data?.notifications || [];

        if (!initialLoadDone) {
          notifs.forEach(n => knownNotificationIds.add(n._id));
          initialLoadDone = true;
          return;
        }

        // Find any brand new message notifications that arrived
        for (const notif of notifs) {
          if (!knownNotificationIds.has(notif._id)) {
            knownNotificationIds.add(notif._id);

            if (notif.type === 'message' && !notif.isRead) {
              // Extract conversationId from link (e.g. /dashboard/messages?convId=...)
              let convId = null;
              if (notif.link && notif.link.includes('convId=')) {
                convId = notif.link.split('convId=')[1];
              }

              triggerToast({
                _id: notif._id,
                sender: notif.sender,
                text: notif.message,
                conversationId: convId
              });
              break;
            }
          }
        }
      } catch (err) {
        // background poll silent catch
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user?._id, location.pathname]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[999999] max-w-sm w-[92vw] sm:w-[360px] animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E3EAE7] overflow-hidden">
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#25D366]" />

        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ServaMessengerIcon className="w-4 h-4" />
              <span className="text-[11px] font-black uppercase tracking-wider text-[#0F766E]">
                SERVA Messenger
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">{toastMessage.time}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Sender & Message Preview Body */}
          <div
            onClick={() => {
              setToastMessage(null);
              if (toastMessage.conversationId) {
                navigate(`/dashboard/messages?convId=${toastMessage.conversationId}`);
              } else {
                navigate('/dashboard/messages');
              }
            }}
            className="flex items-start gap-3 cursor-pointer group hover:opacity-90 transition-opacity"
          >
            <div className="relative shrink-0 mt-0.5">
              <Avatar src={toastMessage.sender?.avatar} size="sm" isOnline={true} />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#25D366] rounded-full border-2 border-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#111B21] group-hover:text-[#0F766E] truncate">
                {toastMessage.sender?.name || 'SERVA Member'}
              </h4>
              <p className="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-snug">
                {toastMessage.text}
              </p>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="pt-2 border-t border-[#E3EAE7]/70 flex items-center justify-between">
            <span className="text-[10px] text-[#64716D] flex items-center gap-1">
              <BellRing className="w-3 h-3 text-[#0F766E]" />
              New real-time message
            </span>

            <button
              onClick={() => {
                setToastMessage(null);
                if (toastMessage.conversationId) {
                  navigate(`/dashboard/messages?convId=${toastMessage.conversationId}`);
                } else {
                  navigate('/dashboard/messages');
                }
              }}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#0F766E] to-[#0D9488] hover:opacity-95 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95"
            >
              Reply <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMessageToast;