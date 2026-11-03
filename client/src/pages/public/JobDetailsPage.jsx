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
import ContactActions from '../../components/common/ContactActions';
import FloatingMessenger from '../../components/common/FloatingMessenger';
import { Spinner } from '../../components/common/Loader';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  ShieldCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  ArrowLeft,
  CreditCard,
  Share2,
  Lock,
  Sparkles,
  AlertTriangle,
  Briefcase
} from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);

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
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-14 h-14 text-[#DC2626] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#17211F]">Listing Unavailable</h2>
        <p className="text-sm text-[#64716D] mt-2 mb-6">{error || 'Job not found'}</p>
        <Link to="/jobs">
          <Button variant="primary" size="md">Back to All Jobs</Button>
        </Link>
      </div>
    );
  }

  const isPoster = user && job.poster?._id?.toString() === user._id?.toString();
  const isAssigned = user && job.assignedTo?._id?.toString() === user._id?.toString();

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-6 sm:py-8">
      {/* Full Area Responsive Container (removes empty side margins) */}
      <div className="max-w-7xl 2xl:max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F766E] hover:text-[#134E4A] hover:underline transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Jobs Marketplace</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-[#64716D]">
            <span className="hidden sm:inline">Category:</span>
            <span className="font-bold text-[#17211F] bg-white border border-[#E3EAE7] px-2.5 py-1 rounded-lg">
              {job.category}
            </span>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Job Overview Column (Expansive Full Area) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Main Header Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 sm:p-8 lg:p-10 shadow-soft space-y-6">
              {/* Badges & Actions Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#E3EAE7]/60">
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
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    SERVA ProofBox™ Guarantee
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShareOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3EAE7] text-xs font-semibold text-[#17211F] hover:bg-gray-50 transition-colors shadow-xs"
                    title="Share this Job"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  <FavouriteButton
                    postId={job._id}
                    postType="Job"
                    size="md"
                    showText={true}
                  />
                </div>
              </div>

              {/* Title & Metadata */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17211F] font-display leading-tight tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-[#64716D] mt-3 pt-1">
                  <span className="flex items-center gap-1.5 text-[#17211F] font-medium">
                    <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                    {job.location}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#0F766E] shrink-0" />
                    {job.workDate || 'Flexible schedule'}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#0F766E] shrink-0" />
                    {job.applicationsCount || 0} Applicant(s)
                  </span>
                </div>
              </div>

              {/* Parameters 4-Box Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 sm:p-5 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#64716D] tracking-wider block">
                    Offered Budget
                  </span>
                  <span className="text-lg sm:text-xl font-black text-[#0F766E] font-display block">
                    BDT {Number(job.budget || 0).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    ({job.paymentType || 'Fixed Price'})
                  </span>
                </div>

                <div className="space-y-1 border-l border-[#E3EAE7]/70 pl-3.5">
                  <span className="text-[10px] uppercase font-bold text-[#64716D] tracking-wider block">
                    Estimated Duration
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#17211F] block mt-1">
                    {job.expectedDuration || '1-2 Days'}
                  </span>
                  <span className="text-[10px] text-gray-500">Flexible completion</span>
                </div>

                <div className="space-y-1 border-l border-[#E3EAE7]/70 pl-3.5">
                  <span className="text-[10px] uppercase font-bold text-[#64716D] tracking-wider block">
                    Preferred Start
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#17211F] block mt-1">
                    {job.startTime || 'Morning'}
                  </span>
                  <span className="text-[10px] text-gray-500">Daytime work</span>
                </div>

                <div className="space-y-1 border-l border-[#E3EAE7]/70 pl-3.5">
                  <span className="text-[10px] uppercase font-bold text-[#64716D] tracking-wider block">
                    Crew Needed
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#17211F] block mt-1">
                    {job.workersNeeded || 1} Worker(s)
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Immediate vacancy</span>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-3 pt-2">
                <h3 className="text-base sm:text-lg font-bold text-[#17211F] font-display">
                  Job Description & Scope
                </h3>
                <p className="text-sm sm:text-base text-[#17211F] leading-relaxed whitespace-pre-line bg-[#FAFCFB] p-5 rounded-2xl border border-[#E3EAE7]/70">
                  {job.description}
                </p>
              </div>

              {/* Requirements & Checklist */}
              {job.requirements && job.requirements.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#17211F] font-display">
                    Task Requirements & Specific Deliverables
                  </h3>
                  <div className="space-y-2.5">
                    {job.requirements.map((req, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#E3EAE7] hover:border-[#0F766E]/30 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#17211F] font-medium leading-relaxed">
                          {req}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Skills Chips */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                    Required Skills & Trade Knowledge
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="text-xs font-semibold bg-[#E6F4F2] text-[#0F766E] px-3 py-1.5 rounded-xl border border-teal-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ProofBox Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-emerald-50 to-[#E6F4F2] border border-teal-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileCheck2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0F766E] uppercase tracking-wider flex items-center gap-2">
                      SERVA ProofBox™ Enabled Job
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    </h4>
                    <p className="text-xs text-[#17211F] mt-0.5 max-w-xl">
                      Requires photographic before/after milestone evidence and digital checklist sign-off. Escrow payments are held securely until you confirm the work.
                    </p>
                  </div>
                </div>
                {(isPoster || isAssigned) && (
                  <Link to={`/dashboard/proofbox/${job._id}`} className="shrink-0">
                    <Button variant="primary" size="sm" className="whitespace-nowrap font-bold">
                      Open ProofBox
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Safety & Escrow Tips Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-3">
              <h4 className="text-sm font-bold text-[#17211F] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                SERVA Trust & Safety Guarantee
              </h4>
              <p className="text-xs text-[#64716D] leading-relaxed">
                Always communicate and arrange payments using SERVA online escrow (bKash, Nagad, Cards). Never pay cash in advance to unverified third parties. All verified members undergo National ID (NID) validation.
              </p>
            </div>
          </div>

          {/* Right Action & Direct Contact Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Compensation & Action Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 sm:p-7 shadow-soft space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E3EAE7]">
                <div>
                  <span className="text-xs text-[#64716D] block">Offered Compensation</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#0F766E] font-display">
                    BDT {Number(job.budget || 0).toLocaleString()}
                  </span>
                </div>
                <Badge variant={job.status === 'Open' ? 'success' : 'neutral'} size="md">
                  {job.status}
                </Badge>
              </div>

              {isPoster ? (
                <div className="space-y-2.5">
                  <Link to={`/dashboard/received-applications?jobId=${job._id}`}>
                    <Button variant="primary" size="md" className="w-full font-bold">
                      View Received Applications ({job.applicationsCount || 0})
                    </Button>
                  </Link>

                  <Button
                    variant="lime"
                    size="md"
                    onClick={() => setPaymentModalOpen(true)}
                    className="w-full font-bold shadow-xs"
                  >
                    <CreditCard className="w-4 h-4 mr-1.5" />
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
                <div className="space-y-2">
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
                    className="w-full font-extrabold text-sm sm:text-base shadow-md hover:shadow-glow-lime"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Apply for This Job
                  </Button>
                  <p className="text-[11px] text-[#64716D] text-center leading-relaxed">
                    Applying connects your verified profile and unlocks task assignment.
                  </p>
                </div>
              )}

              {/* Direct Contact Suite (WhatsApp, Call, Platform Messenger) */}
              <div className="pt-4 border-t border-[#E3EAE7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#17211F] uppercase tracking-wider">
                    Direct Contact Options
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Poster
                  </span>
                </div>

                <ContactActions
                  person={job.poster}
                  itemTitle={job.title}
                  itemType="Job"
                  onOpenMessenger={() => setMessengerOpen(true)}
                  layout="stack"
                />
              </div>
            </div>

            {/* Poster Profile Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                Posted By
              </h3>

              <div className="flex items-center gap-3.5">
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
                  <span className="font-semibold text-[#17211F]">{job.poster?.location || job.location || 'Dhaka'}</span>
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

      {/* Floating Messenger Widget (Facebook Messenger style with fullscreen toggle) */}
      <FloatingMessenger
        isOpen={messengerOpen}
        onClose={() => setMessengerOpen(false)}
        recipient={job.poster}
        itemContext={{
          title: job.title,
          type: 'Job Listing',
          budget: job.budget,
          id: job._id
        }}
      />

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
                placeholder="Explain why you are the best fit for this work..."
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

      {/* Share Modal */}
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
