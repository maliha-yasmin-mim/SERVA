import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import VerificationBadge from '../common/VerificationBadge';
import {
  LayoutDashboard,
  User,
  FileText,
  Send,
  Inbox,
  FileCheck2,
  Clock,
  ShieldCheck,
  MessageSquare,
  Bell,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  CreditCard,
  Heart,
  Sliders
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/dashboard/profile', icon: User },
    { label: 'My Posts', path: '/dashboard/my-posts', icon: FileText },
    { label: 'My Favourites', path: '/dashboard/favourites', icon: Heart },
    { label: 'My Applications', path: '/dashboard/my-applications', icon: Send },
    { label: 'Received Applications', path: '/dashboard/received-applications', icon: Inbox },
    { label: 'SERVA ProofBox™', path: '/dashboard/proofbox', icon: FileCheck2 },
    { label: 'Payments & Escrow', path: '/dashboard/payments', icon: CreditCard },
    { label: 'Availability', path: '/dashboard/availability', icon: Clock },
    { label: 'Verification Center', path: '/dashboard/verification', icon: ShieldCheck },
    { label: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    { label: 'Notifications', path: '/dashboard/notifications', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-[#E3EAE7] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0F766E] flex items-center justify-center text-white">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#17211F] font-display">SERVA</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-[#64716D] hover:text-[#17211F]"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-[#E3EAE7] flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-[#E3EAE7] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] flex items-center justify-center text-white shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#17211F] font-display">SERVA</span>
              <p className="text-[10px] text-[#64716D] uppercase tracking-wider font-semibold">User Dashboard</p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile */}
        <div className="p-4 mx-3 my-3 bg-[#F7F9F8] rounded-2xl border border-[#E3EAE7]/70 flex items-center gap-3">
          <Avatar src={user?.avatar} size="md" isOnline={user?.isAvailableNow} />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-[#17211F] truncate">{user?.name}</h4>
            <div className="mt-0.5">
              <VerificationBadge status={user?.verificationStatus} size="sm" />
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === '/dashboard'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#0F766E] text-white shadow-sm'
                      : 'text-[#64716D] hover:bg-[#E6F4F2] hover:text-[#0F766E]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
              </NavLink>
            );
          })}

          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-[#E3EAE7] space-y-1">
              <NavLink
                to="/admin"
                end
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Admin Console</span>
              </NavLink>
              <NavLink
                to="/admin/customization"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                      : 'text-teal-700 bg-teal-50 hover:bg-teal-100'
                  }`
                }
              >
                <Sliders className="w-4 h-4 shrink-0" />
                <span>Website Customization</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#E3EAE7] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-[#64716D] hover:text-[#0F766E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#DC2626] hover:bg-red-50 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
