import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import RatingStars from '../../components/common/RatingStars';
import Modal from '../../components/common/Modal';
import PaymentCheckoutModal from '../../components/common/PaymentCheckoutModal';
import FavouriteButton from '../../components/common/FavouriteButton';
import ShareModal from '../../components/common/ShareModal';
import { Spinner } from '../../components/common/Loader';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ArrowLeft,
  CreditCard,
  Share2,
  Heart
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  // Application Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [intro, setIntro] = useState('');
  const [proposedPayment, setProposedPayment] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobById(id);
        setJob(data);
        if (data.budget) setProposedPayment(data.budget.toString());
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!intro.trim()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('introduction', intro);
      formData.append('proposedPayment', proposedPayment);
      formData.append('experience', experience);

      await jobService.applyForJob(job._id, formData);
      setApplySuccess(true);
      setTimeout(() => {
        setApplyModalOpen(false);
        setApplySuccess(false);
        // Refresh job
        jobService.getJobById(id).then(setJob);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#17211F]">Listing Unavailable</h2>
        <p className="text-sm text-[#64716D] mt-1 mb-6">{error || 'Job not found'}</p>
        <Link to="/jobs">
          <Button variant="primary" size="md">Back to All Jobs</Button>
        </Link>
      </div>
    );
  }

  const isPoster = user && job.poster?._id?.toString() === user._id?.toString();
  const isAssigned = user && job.assignedTo?._id?.toString() === user._id?.toString();

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Job Overview Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E3EAE7] p-6 sm:p-8 shadow-soft space-y-6">
            {/* Header row */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="teal" size="sm">
                    {job.category}
                  </Badge>
                  {job.urgency === 'Urgent' && (
                    <Badge variant="error" size="sm">
                      Urgent Requirement
                    </Badge>
                  )}
                  <Badge variant={job.status === 'Open' ? 'success' : 'neutral'} size="sm">
                    {job.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShareOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3EAE7] text-xs font-semibold text-[#17211F] hover:bg-gray-50 transition-colors shadow-xs"
                    title="Share this Job"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Share</span>
                  </button>
                  <FavouriteButton
                    postId={job._id}
                    postType="Job"
                    size="md"
                    showText={true}
                  />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#64716D] mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
                  {job.workDate || 'Flexible'}
                </span>
                <span>•</span>
                <span>{job.applicationsCount || 0} Applicant(s)</span>
              </div>
            </div>

            {/* Compensation & Parameters Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64716D] block">Budget</span>
                <span className="text-base sm:text-lg font-black text-[#0F766E] font-display">
                  BDT {job.budget?.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-500 block">({job.paymentType})</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64716D] block">Duration</span>
                <span className="text-xs sm:text-sm font-bold text-[#17211F] mt-1 block">
                  {job.expectedDuration || '1-2 Days'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64716D] block">Start Time</span>
                <span className="text-xs sm:text-sm font-bold text-[#17211F] mt-1 block">
                  {job.startTime || 'Morning'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#64716D] block">Crew Needed</span>
                <span className="text-xs sm:text-sm font-bold text-[#17211F] mt-1 block">
                  {job.workersNeeded || 1} Worker(s)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-[#17211F] font-display">
                Job Description
              </h3>
              <p className="text-sm text-[#17211F] leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements Checklist */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-[#E3EAE7]">
                <h3 className="text-base font-bold text-[#17211F] font-display">
                  Task Requirements & Expectations
                </h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#17211F]">
                      <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E3EAE7]">
                <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                  Required Skills & Trade Knowledge
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-[#E6F4F2] text-[#0F766E] px-3 py-1 rounded-xl font-semibold border border-[#0F766E]/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ProofBox Active Banner */}
            <div className="p-4 rounded-2xl bg-[#E6F4F2]/50 border border-[#0F766E]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                    SERVA ProofBox™ Enabled
                  </h4>
                  <p className="text-xs text-[#17211F]">
                    This job requires photographic before/after baseline and task checklist sign-off.
                  </p>
                </div>
              </div>
              {(isPoster || isAssigned) && (
                <Link to={`/dashboard/proofbox/${job._id}`}>
                  <Button variant="primary" size="sm">
                    Open ProofBox
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Right Action & Poster Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Apply Action Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#64716D] block">Offered Compensation</span>
                  <span className="text-2xl font-black text-[#0F766E] font-display">
                    BDT {job.budget?.toLocaleString()}
                  </span>
                </div>
                <Badge variant={job.status === 'Open' ? 'success' : 'neutral'} size="sm">
                  {job.status}
                </Badge>
              </div>

              {isPoster ? (
                <div className="space-y-2">
                  <Link to={`/dashboard/received-applications?jobId=${job._id}`}>
                    <Button variant="primary" size="md" className="w-full">
                      View Received Applications ({job.applicationsCount || 0})
                    </Button>
                  </Link>

                  <Button
                    variant="lime"
                    size="md"
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full font-bold shadow-xs"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Deposit Escrow Online
                  </Button>

                  <p className="text-[11px] text-[#64716D] text-center">
                    You are the poster of this job listing
                  </p>
                </div>
              ) : job.status !== 'Open' ? (
                <div className="text-center py-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  This job is currently {job.status} and not taking new applicants.
                </div>
              ) : (
                <Button
                  variant="lime"
                  size="lg"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/login?redirect=/jobs/${job._id}`);
                    } else {
                      setApplyModalOpen(true);
                    }
                  }}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Apply for This Job
                </Button>
              )}

              <p className="text-[11px] text-[#64716D] text-center leading-relaxed">
                Applying connects your verified SERVA profile and unlocks direct communication upon review.
              </p>
            </div>

            {/* Poster Profile Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                Posted By
              </h3>

              <div className="flex items-center gap-3">
                <Avatar
                  src={job.poster?.avatar}
                  size="md"
                  isOnline={job.poster?.isAvailableNow}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#17211F] truncate">
                    {job.poster?.name}
                  </h4>
                  <div className="mt-0.5">
                    <VerificationBadge status={job.poster?.verificationStatus} size="sm" />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E3EAE7] space-y-2 text-xs text-[#64716D]">
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="font-semibold text-[#17211F]">{job.poster?.location || 'Dhaka'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform Rating</span>
                  <RatingStars rating={job.poster?.rating || 5.0} count={job.poster?.reviewCount || 0} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Jobs Completed</span>
                  <span className="font-semibold text-[#17211F]">{job.poster?.completedJobsCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title="Apply for this Job"
        subtitle={job.title}
      >
        {applySuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#17211F]">Application Submitted!</h4>
            <p className="text-xs text-[#64716D]">
              The job poster has been notified. You can track this in your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Your Cover Message / Introduction *
              </label>
              <textarea
                required
                rows={4}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Introduce yourself and explain why you're suited for this job..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Proposed Compensation (BDT)
              </label>
              <input
                type="number"
                value={proposedPayment}
                onChange={(e) => setProposedPayment(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Relevant Past Experience / Equipment on Hand
              </label>
              <input
                type="text"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="e.g. 5 years residential electrician with full tool set"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" size="md" onClick={() => setApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={submitting}>
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Online Escrow Payment Modal */}
      <PaymentCheckoutModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Deposit Job Escrow"
        amount={job.budget || 0}
        purpose="Job Escrow"
        relatedJobId={job._id}
        itemName={job.title}
        onPaymentSuccess={(p) => {
          setPaymentModalOpen(false);
          alert(`Escrow deposit of ৳${p.amount} confirmed via ${p.paymentMethod}!`);
        }}
      />

      {job && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          postTitle={job.title}
          postType="Job"
          postUrl={`/jobs/${job._id}`}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
