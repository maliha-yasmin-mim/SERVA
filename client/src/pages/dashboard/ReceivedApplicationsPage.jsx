import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import RatingStars from '../../components/common/RatingStars';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loader';
import {
  Inbox,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  FileCheck2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ReceivedApplicationsPage = () => {
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('jobId') || '';

  const [postedJobs, setPostedJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Load user's posted jobs
  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const jobs = await jobService.getMyPostedJobs();
        setPostedJobs(jobs || []);
        if (!selectedJobId && jobs && jobs.length > 0) {
          setSelectedJobId(jobs[0]._id);
        }
      } catch (err) {
        console.error('Failed to load posted jobs:', err);
      }
    };
    fetchPostedJobs();
  }, []);

  // Fetch applications for selected job
  const fetchApplications = async (jobId) => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const apps = await jobService.getApplicationsForJob(jobId);
      setApplications(apps || []);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      fetchApplications(selectedJobId);
    }
  }, [selectedJobId]);

  const handleStatusUpdate = async (applicationId, newStatus) => {
    setUpdatingId(applicationId);
    try {
      await jobService.updateApplicationStatus(applicationId, newStatus);
      if (newStatus === 'Accepted') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      // Refresh list
      fetchApplications(selectedJobId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update application');
    } finally {
      setUpdatingId(null);
    }
  };

  const currentJob = postedJobs.find(j => j._id === selectedJobId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Applicant Management
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Review Received Applications
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Ranked using SERVA's explainable smart matching algorithm (Skills, Availability, Proximity, & History)
        </p>
      </div>

      {/* Job Selector Dropdown */}
      {postedJobs.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-[#E3EAE7] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-soft">
          <label className="text-xs font-bold text-[#17211F] whitespace-nowrap">
            Select Job Post:
          </label>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full sm:max-w-md text-xs sm:text-sm font-semibold p-2.5 rounded-xl border border-[#E3EAE7] bg-[#F7F9F8] focus:outline-none focus:border-[#0F766E]"
          >
            {postedJobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title} ({j.status}) — {j.applicationsCount || 0} Applicants
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No applications received yet"
          description="Your job is live in the marketplace. When local workers apply, they will appear here with explainable compatibility scores."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const applicant = app.applicant;
            const isAccepted = app.status === 'Accepted';
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app._id}
                className={`bg-white rounded-3xl border p-6 shadow-soft transition-all space-y-4 ${
                  isAccepted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isRejected
                    ? 'border-gray-200 opacity-60'
                    : 'border-[#E3EAE7] hover:border-[#0F766E]/40'
                }`}
              >
                {/* Header row: Applicant info & Match Score badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3EAE7]">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={applicant?.avatar}
                      size="md"
                      isOnline={applicant?.isAvailableNow}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-[#17211F]">
                          {applicant?.name}
                        </h3>
                        <VerificationBadge status={applicant?.verificationStatus} size="sm" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#64716D] mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#0F766E]" />
                          {applicant?.location || 'Dhaka'}
                        </span>
                        <span>•</span>
                        <RatingStars rating={applicant?.rating || 5.0} count={applicant?.reviewCount || 0} size="sm" />
                      </div>
                    </div>
                  </div>

                  {/* Explainable Smart Match Pill */}
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-xl bg-[#E6F4F2] border border-[#0F766E]/20 text-right">
                      <div className="flex items-center gap-1 text-xs font-black text-[#0F766E]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{app.matchScore || 75}% Match</span>
                      </div>
                      <span className="text-[10px] text-[#64716D]">Explainable Algorithm</span>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      isAccepted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isRejected
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Match Factors Chips */}
                {app.matchFactors && app.matchFactors.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {app.matchFactors.map((factor, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-medium bg-[#F7F9F8] text-[#134E4A] border border-[#E3EAE7] px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-[#0F766E]" />
                        {factor}
                      </span>
                    ))}
                  </div>
                )}

                {/* Introduction & Details */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#64716D] block">
                    Applicant Introduction
                  </span>
                  <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed bg-[#F7F9F8] p-3.5 rounded-xl border border-[#E3EAE7]">
                    "{app.introduction}"
                  </p>
                </div>

                {/* Rate & Experience */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-[#E3EAE7]">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Proposed Rate</span>
                    <span className="font-extrabold text-[#0F766E] text-sm">BDT {app.proposedPayment}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Availability</span>
                    <span className="font-semibold text-[#17211F]">{app.availability || 'Immediate'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Past Verified Jobs</span>
                    <span className="font-semibold text-[#17211F]">{applicant?.completedJobsCount || 0} Completed</span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    {isAccepted ? (
                      <Link to={`/dashboard/proofbox/${selectedJobId}`}>
                        <Button variant="lime" size="sm">
                          <FileCheck2 className="w-4 h-4 mr-1" />
                          View Active ProofBox Studio
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          isLoading={updatingId === app._id}
                          onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Accept & Assign Job
                        </Button>
                        {!isRejected && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <Link
                    to={`/dashboard/messages?recipientId=${applicant?._id}`}
                    className="text-xs font-semibold text-[#0F766E] hover:underline"
                  >
                    Send Direct Message →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReceivedApplicationsPage;
