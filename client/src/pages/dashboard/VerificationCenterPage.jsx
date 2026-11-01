import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import VerificationBadge from '../../components/common/VerificationBadge';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2, Upload, AlertCircle } from 'lucide-react';

const VerificationCenterPage = () => {
  const { user, updateUser } = useAuth();

  const [nidNumber, setNidNumber] = useState(user?.verificationDetails?.nidNumber || '');
  const [docFile, setDocFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nidNumber) {
      setError('Please provide your National ID (NID) number');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('nidNumber', nidNumber);
      if (docFile) formData.append('document', docFile);

      const res = await authService.submitVerification(formData);
      updateUser({
        ...user,
        verificationStatus: res.verificationStatus,
        verificationDetails: res.verificationDetails
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setSubmitting(false);
    }
  };

  const isVerified = user?.verificationStatus === 'Verified';
  const isPending = user?.verificationStatus === 'Submitted' || user?.verificationStatus === 'Under Review';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
          Trust & Identity
        </span>
        <h1 className="text-2xl font-extrabold text-[#17211F] font-display mt-1">
          SERVA Verification Center
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D]">
          Verify your identity with National ID to unlock higher credibility, client trust, and priority job matches
        </p>
      </div>

      {/* Current Status Box */}
      <div className={`p-6 rounded-3xl border shadow-soft flex items-center justify-between gap-4 ${
        isVerified
          ? 'bg-emerald-50/60 border-emerald-200'
          : isPending
          ? 'bg-amber-50/60 border-amber-200'
          : 'bg-white border-[#E3EAE7]'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
            isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
          }`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-[#17211F]">
                Verification Status: {user?.verificationStatus || 'Not Started'}
              </h3>
              <VerificationBadge status={user?.verificationStatus} size="sm" />
            </div>
            <p className="text-xs text-[#64716D] mt-0.5">
              {isVerified
                ? 'Your identity is fully verified on the SERVA platform.'
                : isPending
                ? 'Your documents have been submitted and are under active review by the compliance team.'
                : 'Submit your Smart NID to obtain the verified badge.'}
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Reviewer Notes if available */}
      {user?.verificationDetails?.reviewerNotes && (
        <div className="p-4 rounded-2xl bg-white border border-[#E3EAE7] text-xs space-y-1">
          <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px] block">
            Compliance Desk Review Notes:
          </span>
          <p className="text-[#17211F] font-medium">{user.verificationDetails.reviewerNotes}</p>
        </div>
      )}

      {/* Submission Form */}
      {!isVerified && (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-5">
          <h3 className="font-bold text-base text-[#17211F] font-display">
            Submit National Identity (NID) Verification
          </h3>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-[#DC2626] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Verification submitted for administrative review!</span>
            </div>
          )}

          <Input
            label="Bangladesh National ID (NID) Number *"
            required
            value={nidNumber}
            onChange={(e) => setNidNumber(e.target.value)}
            placeholder="e.g. 1991261548000192 or 10-digit Smart NID"
          />

          <div>
            <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1.5">
              Upload Front of Smart NID Card (Photo / PDF)
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setDocFile(e.target.files[0])}
              className="w-full text-xs p-2.5 rounded-xl border border-[#E3EAE7] bg-[#F7F9F8] focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#E6F4F2]/50 border border-[#0F766E]/20 text-xs text-[#134E4A] flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#0F766E] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Private Vault Guarantee:</strong> Your identification document is stored in SERVA's private security vault. It is NEVER shown on your public profile or shared with clients.
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={submitting} className="w-full">
            <Upload className="w-4 h-4 mr-1" />
            Submit for Verification Review
          </Button>
        </form>
      )}
    </div>
  );
};

export default VerificationCenterPage;
