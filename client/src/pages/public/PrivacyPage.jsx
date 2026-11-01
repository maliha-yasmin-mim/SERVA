import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="bg-[#F7F9F8] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#64716D]">
          Last updated: October 2026 • SERVA Bangladesh
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-[#17211F] leading-relaxed">
          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            1. Information Collection & Vault Storage
          </h2>
          <p>
            When registering or requesting verification on SERVA, we collect relevant contact information, location, and identity verification credentials (such as your National ID card number and document photos).
          </p>

          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            2. Confidentiality of Sensitive Identity Documents
          </h2>
          <p>
            National ID documents and verification files are stored in our protected document vault and are strictly shielded from public search results, user profile viewers, and external search engines. Only authorized compliance moderators review them for verification purposes.
          </p>

          <h2 className="text-base font-bold text-[#0F766E] font-display pt-2">
            3. Photographic Proof & ProofBox Media
          </h2>
          <p>
            Photographs uploaded to SERVA ProofBox are associated with the corresponding job record to establish verifiable evidence between the job poster and the provider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
