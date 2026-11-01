import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import EmptyState from '../../components/common/EmptyState';
import { Spinner } from '../../components/common/Loader';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminVerificationsPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [documentLoadingId, setDocumentLoadingId] = useState(null);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const data = await adminService.getVerifications();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load pending verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleReview = async (userId, newStatus) => {
    setReviewingId(userId);
    try {
      await adminService.reviewVerification(userId, {
        status: newStatus,
        reviewerNotes: `Reviewed and marked as ${newStatus} by platform compliance administrator.`
      });
      fetchVerifications();
    } catch (err) {
      alert('Failed to process verification');
    } finally {
      setReviewingId(null);
    }
  };

  const handleDownloadDocument = async (userId) => {
    setDocumentLoadingId(userId);
    try {
      const documentBlob = await adminService.getVerificationDocument(userId);
      const downloadUrl = URL.createObjectURL(documentBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      const extension = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'application/pdf': 'pdf'
      }[documentBlob.type] || 'file';
      link.download = `serva-verification-${userId}.${extension}`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err) {
      alert('Unable to download the verification document.');
    } finally {
      setDocumentLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Console
      </Link>

      <div>
        <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">
          Compliance Desk
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          Identity Verification Review Queue
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Carefully inspect submitted National ID numbers and documents before granting verified badges
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Verification queue is empty"
          description="All submitted member verification requests have been processed."
        />
      ) : (
        <div className="space-y-4">
          {users.map((u) => (
            <div
              key={u._id}
              className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3EAE7]">
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatar} size="md" />
                  <div>
                    <h3 className="font-bold text-base text-[#17211F]">{u.name}</h3>
                    <p className="text-xs text-[#64716D]">{u.email} • {u.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <VerificationBadge status={u.verificationStatus} size="sm" />
                </div>
              </div>

              {/* Document and NID Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#F7F9F8] p-4 rounded-2xl border border-[#E3EAE7]">
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    Submitted National ID (NID)
                  </span>
                  <span className="font-mono font-bold text-sm text-[#0F766E]">
                    {u.verificationDetails?.nidNumber || 'Not specified'}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">
                    Submission Date
                  </span>
                  <span className="font-semibold text-[#17211F]">
                    {u.verificationDetails?.submittedAt ? new Date(u.verificationDetails.submittedAt).toLocaleString('en-GB') : 'Recent'}
                  </span>
                </div>
              </div>

              {u.verificationDetails?.hasDocument && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-[#17211F] block mb-2">
                    Submitted Document:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDownloadDocument(u._id)}
                    disabled={documentLoadingId === u._id}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0F766E] font-semibold bg-[#E6F4F2] px-3 py-1.5 rounded-lg disabled:opacity-60"
                  >
                    <FileText className="w-4 h-4" />
                    {documentLoadingId === u._id ? 'Downloading...' : 'Download private document'}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-[#E3EAE7] flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={reviewingId === u._id}
                  onClick={() => handleReview(u._id, 'Rejected')}
                  className="text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject Request
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  isLoading={reviewingId === u._id}
                  onClick={() => handleReview(u._id, 'Verified')}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Approve Verification
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerificationsPage;
