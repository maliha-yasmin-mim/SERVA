import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import { Spinner } from '../../components/common/Loader';
import {
  ShieldAlert,
  Users,
  Briefcase,
  Wrench,
  ShoppingBag,
  Gift,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';

const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [recentAudits, setRecentAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const data = await adminService.getOverview();
        setStats(data.stats);
        setRecentAudits(data.recentAudits || []);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Compliance & Operations
          </div>
          <h1 className="text-2xl font-extrabold text-[#17211F] font-display">
            SERVA Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D]">
            Manage platform verification reviews, user moderation, and audit trails
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/customization">
            <Button variant="primary" size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
              Website Customization
            </Button>
          </Link>
          <Link to="/admin/verifications">
            <Button variant="outline" size="sm">
              Verification Queue ({stats?.pendingVerifications || 0})
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              User Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <span className="text-xs font-bold text-[#64716D] uppercase">Total Users</span>
          <span className="text-2xl font-black text-[#17211F] font-display block mt-1">
            {stats?.totalUsers || 0}
          </span>
          <span className="text-[11px] text-emerald-700">
            {stats?.verifiedUsers || 0} Verified NID
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <span className="text-xs font-bold text-[#64716D] uppercase">Active Jobs</span>
          <span className="text-2xl font-black text-[#0F766E] font-display block mt-1">
            {stats?.activeJobs || 0}
          </span>
          <span className="text-[11px] text-[#64716D]">
            {stats?.completedJobs || 0} completed
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <span className="text-xs font-bold text-[#64716D] uppercase">Active Services</span>
          <span className="text-2xl font-black text-amber-600 font-display block mt-1">
            {stats?.activeServices || 0}
          </span>
          <span className="text-[11px] text-[#64716D]">
            Verified providers
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <span className="text-xs font-bold text-[#64716D] uppercase">Approved Proofs</span>
          <span className="text-2xl font-black text-emerald-600 font-display block mt-1">
            {stats?.approvedProofs || 0}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            ProofBox Certificates
          </span>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Verification Review Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[#17211F] font-display">
                National ID Verification Queue
              </h3>
              <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                {stats?.pendingVerifications || 0} Pending
              </span>
            </div>
            <p className="text-xs text-[#64716D] leading-relaxed">
              Review submitted identity documents, verify NID numbers, and approve or reject verification applications.
            </p>
          </div>
          <Link to="/admin/verifications">
            <Button variant="primary" size="sm" className="w-full">
              Open Verification Queue →
            </Button>
          </Link>
        </div>

        {/* User Directory Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base text-[#17211F] font-display">
                Platform User Management
              </h3>
              <span className="text-xs font-bold bg-teal-100 text-[#0F766E] px-2.5 py-0.5 rounded-full">
                {stats?.totalUsers || 0} Accounts
              </span>
            </div>
            <p className="text-xs text-[#64716D] leading-relaxed">
              Browse registered providers, job posters, and clients. Manage account roles and active status.
            </p>
          </div>
          <Link to="/admin/users">
            <Button variant="outline" size="sm" className="w-full">
              Open User Directory →
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Platform Audit Logs */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-4">
        <h3 className="font-bold text-base text-[#17211F] font-display flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#0F766E]" />
          Recent Platform Audit Trail
        </h3>

        <div className="space-y-2.5">
          {recentAudits.map((audit) => (
            <div
              key={audit._id}
              className="p-3.5 rounded-xl bg-[#F7F9F8] border border-[#E3EAE7] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#0F766E] bg-[#E6F4F2] px-2 py-0.5 rounded">
                  {audit.action}
                </span>
                <span className="font-semibold text-[#17211F]">
                  {audit.user?.name || 'System'}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{audit.entityType} ({audit.entityId?.slice(-6)})</span>
              </div>
              <span className="text-gray-400 text-[10px]">
                {new Date(audit.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
