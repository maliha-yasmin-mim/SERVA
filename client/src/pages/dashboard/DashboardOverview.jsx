import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/jobService';
import { serviceService } from '../../services/serviceService';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import {
  Briefcase,
  Wrench,
  Send,
  FileCheck2,
  Clock,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  CreditCard
} from 'lucide-react';

const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [jobsData, appsData, servicesData] = await Promise.all([
          jobService.getMyPostedJobs().catch(() => []),
          jobService.getMyApplications().catch(() => []),
          serviceService.getMyServices().catch(() => [])
        ]);
        setPostedJobs(jobsData || []);
        setApplications(appsData || []);
        setServices(servicesData || []);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOverviewData();
  }, []);

  const activeJobsCount = postedJobs.filter(j => j.status !== 'Completed' && j.status !== 'Cancelled').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#134E4A] to-[#0F766E] rounded-3xl p-6 sm:p-8 text-white shadow-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} size="lg" isOnline={user?.isAvailableNow} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-display">
                Welcome back, {user?.name}
              </h1>
              <VerificationBadge status={user?.verificationStatus} size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              {user?.location || 'Dhaka'} • Member of SERVA verified local community
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant="lime"
            size="md"
            onClick={() => navigate('/dashboard/create-job')}
            className="w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 mr-1" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Verification Reminder if unverified */}
      {user?.verificationStatus !== 'Verified' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                Identity Verification Status: {user?.verificationStatus || 'Not Started'}
              </h4>
              <p className="text-[11px] text-amber-800">
                Submit your Smart NID to receive the verified badge and increase trust with clients and workers.
              </p>
            </div>
          </div>
          <Link to="/dashboard/verification">
            <Button variant="outline" size="sm" className="bg-white text-amber-900 border-amber-300 shrink-0">
              Complete Verification
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#64716D] uppercase tracking-wider">Posted Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#17211F] font-display block">
            {postedJobs.length}
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            {activeJobsCount} currently active
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#64716D] uppercase tracking-wider">Applications</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#17211F] font-display block">
            {applications.length}
          </span>
          <span className="text-[11px] text-[#64716D]">
            Tracked in real-time
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#64716D] uppercase tracking-wider">Services Listed</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#17211F] font-display block">
            {services.length}
          </span>
          <span className="text-[11px] text-[#64716D]">
            Active services offered
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#64716D] uppercase tracking-wider">ProofBox Status</span>
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#0F766E] font-display block">
            Active
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Evidence audits enabled
          </span>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Posted Jobs */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E3EAE7]">
            <h3 className="font-bold text-base text-[#17211F] font-display">
              My Recent Job Posts
            </h3>
            <Link to="/dashboard/my-posts" className="text-xs font-bold text-[#0F766E] hover:underline">
              View All Posts →
            </Link>
          </div>

          {postedJobs.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#64716D]">
              You haven't posted any jobs yet.{' '}
              <Link to="/dashboard/create-job" className="text-[#0F766E] font-bold hover:underline">
                Post your first job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {postedJobs.slice(0, 4).map((job) => (
                <div
                  key={job._id}
                  className="p-4 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#17211F] truncate">{job.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-[#64716D] mt-1">
                      <span>BDT {job.budget}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.applicationsCount || 0} Applicants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold bg-white text-[#0F766E] px-2.5 py-1 rounded-lg border border-[#E3EAE7]">
                      {job.status}
                    </span>
                    <Link to={`/dashboard/received-applications?jobId=${job._id}`}>
                      <Button variant="secondary" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick Action Shortcuts */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-4">
          <h3 className="font-bold text-sm text-[#17211F] font-display pb-2 border-b border-[#E3EAE7]">
            Quick Create Shortcuts
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/dashboard/create-job"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-xs font-bold text-[#17211F]"
            >
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0F766E]" />
                Post a Micro-Job
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <Link
              to="/dashboard/create-service"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-xs font-bold text-[#17211F]"
            >
              <span className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                Offer a Skilled Service
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <Link
              to="/dashboard/create-product"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-xs font-bold text-[#17211F]"
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                List Product for Sale
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <Link
              to="/dashboard/payments"
              className="flex items-center justify-between p-3 rounded-xl border border-[#0F766E]/30 bg-[#E6F4F2]/40 hover:bg-[#E6F4F2] transition-all text-xs font-bold text-[#0F766E]"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0F766E]" />
                Online Payments & Escrow
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0F766E]" />
            </Link>

            <Link
              to="/dashboard/create-free-item"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-xs font-bold text-[#17211F]"
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                Give Away Free Item
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
