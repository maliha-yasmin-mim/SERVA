import React from 'react';

const TermsPage = () => {
  return (
    <div className="bg-[#F7F9F8] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-[#64716D]">
          Last revised: October 2026 • SERVA Bangladesh Platform
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-[#17211F] leading-relaxed">
          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            1. Platform Nature & Relationship
          </h2>
          <p>
            SERVA operates as a verified communications, workflow tracking, and micro-work marketplace. SERVA provides tools including user verification, structured job posts, and the SERVA ProofBox™ system to facilitate transparent agreements between independent service providers, job posters, buyers, and sellers.
          </p>

          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            2. User Conduct & Verification Accuracy
          </h2>
          <p>
            All users must provide accurate identification details. Impersonation, providing false National ID information, or attempting to circumvent review procedures is strictly prohibited and results in immediate account deactivation and logging with compliance authorities.
          </p>

          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            3. SERVA ProofBox™ & Milestone Completion
          </h2>
          <p>
            Users engaging in micro-work tasks agree to utilize ProofBox milestone checklists and photographic baselines. Completed proof records serve as documented evidence of work performed and sign-off agreements between the parties.
          </p>

          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            4. Prohibited Content & Safety
          </h2>
          <p>
            Listings involving hazardous substances, illegal services, prohibited merchandise, or unsafe labor conditions are strictly disallowed. Users can report suspicious activity directly to platform administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
