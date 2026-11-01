import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { proofboxService } from '../../services/proofboxService';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../context/AuthContext';
import ChecklistManager from '../../components/proofbox/ChecklistManager';
import BeforeAfterGallery from '../../components/proofbox/BeforeAfterGallery';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import Modal from '../../components/common/Modal';
import { Spinner } from '../../components/common/Loader';
import {
  FileCheck2,
  Camera,
  CheckCircle2,
  Clock,
  Send,
  FileDown,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Upload,
  Calendar,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ProofBoxPage = () => {
  const { jobId: routeJobId } = useParams();
  const [searchParams] = useSearchParams();
  const queryJobId = searchParams.get('jobId');
  const targetJobId = routeJobId || queryJobId;

  const { user } = useAuth();

  const [proof, setProof] = useState(null);
  const [job, setJob] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(targetJobId || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState('before');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaNote, setMediaNote] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState('Approved');
  const [approvalReason, setApprovalReason] = useState('');
  const [processingApproval, setProcessingApproval] = useState(false);

  // Load available jobs for user if no specific jobId selected
  useEffect(() => {
    const fetchUserJobs = async () => {
      try {
        const [posted, assigned] = await Promise.all([
          jobService.getMyPostedJobs().catch(() => []),
          jobService.getMyAssignedJobs().catch(() => [])
        ]);
        const all = [...posted, ...assigned];
        setMyJobs(all);

        if (!selectedJobId && all.length > 0) {
          setSelectedJobId(all[0]._id);
        }
      } catch (err) {
        console.error('Failed to load user jobs:', err);
      }
    };
    fetchUserJobs();
  }, []);

  // Fetch proof record for the active job
  const loadProofRecord = async (jobId) => {
    if (!jobId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await proofboxService.getProofByJobId(jobId);
      setProof(data.proof);
      setJob(data.job);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not access ProofBox for this job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedJobId) {
      loadProofRecord(selectedJobId);
    }
  }, [selectedJobId]);

  // Checklist actions
  const handleToggleChecklist = async (itemId, isCompleted) => {
    try {
      const updated = await proofboxService.updateChecklistItem(proof._id, itemId, isCompleted);
      setProof(prev => ({ ...prev, checklist: updated }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update checklist');
    }
  };

  const handleAddChecklistItem = async (itemData) => {
    try {
      const updated = await proofboxService.addChecklistItem(proof._id, itemData);
      setProof(prev => ({ ...prev, checklist: updated }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add checklist item');
    }
  };

  // Upload Media
  const handleUploadMediaSubmit = async (e) => {
    e.preventDefault();
    if (!mediaFile) {
      alert('Please select an image file to upload');
      return;
    }

    setUploadingMedia(true);
    try {
      const formData = new FormData();
      formData.append('image', mediaFile);
      formData.append('type', mediaType);
      formData.append('note', mediaNote);

      const res = await proofboxService.uploadProofMedia(proof._id, formData);
      setProof(prev => ({
        ...prev,
        beforeImages: res.beforeImages,
        afterImages: res.afterImages
      }));
      setMediaModalOpen(false);
      setMediaFile(null);
      setMediaNote('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to upload photo evidence');
    } finally {
      setUploadingMedia(false);
    }
  };

  // Submit for Approval (Provider)
  const handleSubmitForApproval = async () => {
    if (!window.confirm('Submit work proof to the client for final sign-off and approval?')) return;
    try {
      const res = await proofboxService.submitForApproval(proof._id);
      setProof(prev => ({ ...prev, status: res.status }));
      alert('Proof submitted! The client has been notified to review and sign off.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit proof');
    }
  };

  // Client Approval Action (Approve or Corrections)
  const handleApprovalActionSubmit = async (e) => {
    e.preventDefault();
    setProcessingApproval(true);
    try {
      const res = await proofboxService.clientApprovalAction(proof._id, {
        action: approvalAction,
        reason: approvalReason,
        feedback: approvalReason
      });
      setProof(res.proof);
      setApprovalModalOpen(false);

      if (approvalAction === 'Approved') {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to process approval');
    } finally {
      setProcessingApproval(false);
    }
  };

  const isClient = user && (proof?.client?._id?.toString() === user._id?.toString() || job?.poster?._id?.toString() === user._id?.toString());
  const isProvider = user && (proof?.provider?._id?.toString() === user._id?.toString() || job?.assignedTo?._id?.toString() === user._id?.toString());

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* ProofBox Banner */}
      <div className="bg-[#134E4A] rounded-3xl p-6 sm:p-8 text-white shadow-premium flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C7F36B] text-[#134E4A] flex items-center justify-center font-bold shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold font-display">
                SERVA ProofBox™ Studio
              </h1>
              <span className="text-[10px] font-bold bg-white/20 text-[#C7F36B] px-2 py-0.5 rounded-full uppercase">
                Active Audit System
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-100 mt-1">
              Photographic evidence baseline, task checklist tracking, and client sign-off certificate
            </p>
          </div>
        </div>

        {/* Job Selector Dropdown */}
        {myJobs.length > 0 && (
          <div className="w-full md:w-72">
            <label className="text-[10px] uppercase font-bold text-[#C7F36B] block mb-1">
              Select Engaged Job:
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl bg-white/10 text-white border border-white/20 focus:outline-none focus:bg-white focus:text-[#17211F]"
            >
              {myJobs.map((j) => (
                <option key={j._id} value={j._id} className="text-[#17211F]">
                  {j.title} ({j.status})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : error || !proof ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#E3EAE7] max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-[#17211F]">No Active Proof Record</h3>
          <p className="text-xs text-[#64716D] leading-relaxed">
            ProofBox activates automatically when a job application is accepted or when a provider begins work.
          </p>
          <Link to="/dashboard/received-applications">
            <Button variant="primary" size="sm">
              Review Applications
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Status & Action Control Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64716D] block">
                  ProofBox Audit State
                </span>
                <span className="text-base font-extrabold text-[#0F766E] font-display flex items-center gap-2">
                  {proof.status}
                  {proof.status === 'Approved' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                ID: {proof.completionReportId || 'SRV-PB-2026'}
              </span>
            </div>

            {/* Dynamic Buttons based on Role & Status */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {/* Upload media button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMediaModalOpen(true)}
              >
                <Camera className="w-4 h-4 mr-1 text-[#0F766E]" />
                Upload Photo Evidence
              </Button>

              {/* Provider: Submit for Approval */}
              {isProvider && proof.status !== 'Approved' && proof.status !== 'Submitted for Approval' && (
                <Button
                  variant="lime"
                  size="sm"
                  onClick={handleSubmitForApproval}
                >
                  <Send className="w-4 h-4 mr-1" />
                  Submit Work to Client
                </Button>
              )}

              {/* Client: Review & Sign Off */}
              {isClient && proof.status !== 'Approved' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setApprovalAction('Approved');
                    setApprovalModalOpen(true);
                  }}
                >
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Client Sign-Off & Approval
                </Button>
              )}

              {/* Download PDF Completion Report */}
              <a
                href={proofboxService.getReportPdfUrl(proof._id)}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="secondary" size="sm">
                  <FileDown className="w-4 h-4 mr-1" />
                  Download PDF Certificate
                </Button>
              </a>
            </div>
          </div>

          {/* Job Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E3EAE7] shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0F766E] uppercase">Associated Job</span>
              <h3 className="text-base font-extrabold text-[#17211F] font-display">{job?.title}</h3>
              <p className="text-xs text-[#64716D]">{job?.location} • Agreed Budget: BDT {job?.budget}</p>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#64716D] border-t md:border-t-0 md:border-l border-[#E3EAE7] pt-3 md:pt-0 md:pl-6 w-full md:w-auto">
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Client</span>
                <span className="font-bold text-[#17211F]">{proof.client?.name}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Provider</span>
                <span className="font-bold text-[#17211F]">{proof.provider?.name}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Before and After Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#17211F] font-display flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#0F766E]" />
                Before & After Photographic Evidence
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setMediaModalOpen(true)}>
                + Add Photo
              </Button>
            </div>
            <BeforeAfterGallery
              beforeImages={proof.beforeImages}
              afterImages={proof.afterImages}
            />
          </div>

          {/* Section 2: Audited Task Checklist */}
          <div className="space-y-3">
            <ChecklistManager
              checklist={proof.checklist}
              onToggleItem={handleToggleChecklist}
              onAddItem={handleAddChecklistItem}
              canEdit={proof.status !== 'Approved'}
            />
          </div>

          {/* Section 3: Client Sign-Off Feedback / Correction History */}
          {proof.approvalHistory && proof.approvalHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
              <h4 className="text-sm font-bold text-[#17211F] font-display flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                Audit Trail & Approval History
              </h4>

              <div className="space-y-3">
                {proof.approvalHistory.map((history, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border text-xs ${
                      history.action === 'Approved'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold uppercase tracking-wider">{history.action}</span>
                      <span className="text-[10px] opacity-75">{new Date(history.timestamp).toLocaleString('en-GB')}</span>
                    </div>
                    <p>{history.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload Media Modal */}
      <Modal
        isOpen={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        title="Upload Photographic Evidence"
        subtitle="Document work baseline or completed task milestone"
      >
        <form onSubmit={handleUploadMediaSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
              Evidence Stage *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMediaType('before')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  mediaType === 'before'
                    ? 'bg-[#0F766E] text-white border-[#0F766E]'
                    : 'bg-gray-50 border-[#E3EAE7] text-[#64716D]'
                }`}
              >
                Pre-Work (Before)
              </button>
              <button
                type="button"
                onClick={() => setMediaType('after')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  mediaType === 'after'
                    ? 'bg-[#0F766E] text-white border-[#0F766E]'
                    : 'bg-gray-50 border-[#E3EAE7] text-[#64716D]'
                }`}
              >
                Completion (After)
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
              Select Image File *
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setMediaFile(e.target.files[0])}
              className="w-full text-xs p-2 rounded-xl border border-[#E3EAE7] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
              Photo Description / Note
            </label>
            <input
              type="text"
              value={mediaNote}
              onChange={(e) => setMediaNote(e.target.value)}
              placeholder="e.g. Master bath tiles scrubbed and descaled"
              className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setMediaModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={uploadingMedia}>
              Upload Evidence
            </Button>
          </div>
        </form>
      </Modal>

      {/* Client Approval / Correction Modal */}
      <Modal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        title="Client Quality Review & Approval"
        subtitle={`Job: ${job?.title}`}
      >
        <form onSubmit={handleApprovalActionSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
              Review Decision *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setApprovalAction('Approved')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  approvalAction === 'Approved'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-gray-50 border-[#E3EAE7] text-[#64716D]'
                }`}
              >
                Approve & Issue Certificate
              </button>
              <button
                type="button"
                onClick={() => setApprovalAction('Corrections Requested')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                  approvalAction === 'Corrections Requested'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-gray-50 border-[#E3EAE7] text-[#64716D]'
                }`}
              >
                Request Corrections
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
              Feedback / Reasons *
            </label>
            <textarea
              required
              rows={3}
              value={approvalReason}
              onChange={(e) => setApprovalReason(e.target.value)}
              placeholder={
                approvalAction === 'Approved'
                  ? 'Great job, everything thoroughly verified and completed cleanly!'
                  : 'Please wipe down the balcony grills again and upload updated after-photos.'
              }
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button variant="ghost" size="md" onClick={() => setApprovalModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={approvalAction === 'Approved' ? 'primary' : 'danger'}
              size="md"
              isLoading={processingApproval}
            >
              Confirm {approvalAction}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProofBoxPage;
