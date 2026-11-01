import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loader';
import { Bell, CheckCheck, Clock, FileCheck2, ArrowRight } from 'lucide-react';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifs();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Alerts & Activity
          </span>
          <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
            Notifications
          </h1>
        </div>

        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="w-4 h-4 mr-1 text-[#0F766E]" />
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="Activity alerts, job milestones, application acceptances, and ProofBox updates will appear here."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !n.isRead
                  ? 'bg-white border-[#0F766E]/30 shadow-soft'
                  : 'bg-[#F7F9F8] border-[#E3EAE7] opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  !n.isRead ? 'bg-[#E6F4F2] text-[#0F766E]' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-[#17211F]">
                    {n.title}
                  </h4>
                  <p className="text-xs text-[#64716D] mt-0.5 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleString('en-GB')}
                  </span>
                </div>
              </div>

              {n.link && (
                <Link to={n.link} className="shrink-0 self-center">
                  <Button variant="outline" size="sm">
                    View
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
