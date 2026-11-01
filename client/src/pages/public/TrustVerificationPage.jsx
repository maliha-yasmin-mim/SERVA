import React from 'react';
import { ShieldCheck, Lock, Star, AlertTriangle, EyeOff, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const TrustVerificationPage = () => {
  return (
    <div className="bg-[#F7F9F8] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Safety & Verification Transparency
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17211F] font-display">
            Trust & Verification on SERVA
          </h1>
          <p className="text-sm text-[#64716D] max-w-xl mx-auto leading-relaxed">
            We believe in honest, measurable security. Here is exactly how user verification, reliability indicators, and private document handling work on our platform.
          </p>
        </div>

        {/* What does "Verified" mean? */}
        <div className="bg-white rounded-3xl border border-[#E3EAE7] p-8 shadow-soft space-y-4">
          <div className="flex items-center gap-3 text-[#0F766E]">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-lg font-bold text-[#17211F] font-display">
              What does the "Verified" badge mean?
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed">
            When a user has a <strong>SERVA Verified</strong> badge, our administrative compliance team has manually reviewed their National ID (NID) card, verified their contact telephone number, and confirmed baseline profile details against national records.
          </p>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Important Transparency Notice:</strong> Verification establishes verified identity and accountable contact records. It does not replace personal common sense, reviewing past customer ratings, or utilizing the SERVA ProofBox™ workflow for on-site quality assurance.
          </div>
        </div>

        {/* Private Document Vault */}
        <div className="bg-white rounded-3xl border border-[#E3EAE7] p-8 shadow-soft space-y-4">
          <div className="flex items-center gap-3 text-[#0F766E]">
            <EyeOff className="w-6 h-6" />
            <h2 className="text-lg font-bold text-[#17211F] font-display">
              Sensitive Document Vault & Privacy Protection
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed">
            We adhere to strict data privacy principles in accordance with Bangladesh digital security standards:
          </p>

          <ul className="space-y-2.5 text-xs sm:text-sm text-[#64716D]">
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">✓</span>
              <span><strong>Never Public:</strong> Your National ID card images are never displayed on your public profile or shared with clients or applicants.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">✓</span>
              <span><strong>Restricted Review:</strong> Only authorized platform administrators with audit logging have access to submitted verification documents.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#0F766E] font-bold">✓</span>
              <span><strong>Encrypted Vault:</strong> Identity documents are segregated from general public listing media.</span>
            </li>
          </ul>
        </div>

        {/* Reliability Score */}
        <div className="bg-white rounded-3xl border border-[#E3EAE7] p-8 shadow-soft space-y-4">
          <div className="flex items-center gap-3 text-[#0F766E]">
            <Star className="w-6 h-6" />
            <h2 className="text-lg font-bold text-[#17211F] font-display">
              Measurable Reliability Indicators
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed">
            Rather than inventing arbitrary "trust scores", SERVA measures and displays observable, verifiable track records:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E3EAE7]">
              <h4 className="font-bold text-xs text-[#17211F]">Completed Jobs</h4>
              <p className="text-[11px] text-[#64716D] mt-1">Confirmed jobs with client signoff via ProofBox.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E3EAE7]">
              <h4 className="font-bold text-xs text-[#17211F]">Response Time</h4>
              <p className="text-[11px] text-[#64716D] mt-1">Average time taken to reply to applications and quotes.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#F7F9F8] border border-[#E3EAE7]">
              <h4 className="font-bold text-xs text-[#17211F]">Qualified Reviews</h4>
              <p className="text-[11px] text-[#64716D] mt-1">Ratings submitted exclusively after qualifying completed work.</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <Link to="/dashboard/verification">
            <Button variant="primary" size="md">
              Submit Your Verification
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrustVerificationPage;
