import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
  Search,
  Users,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  Camera,
  FileText,
  Star,
  ArrowRight
} from 'lucide-react';

const HowItWorksPage = () => {
  return (
    <div className="bg-[#F7F9F8] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
            Clear, Structured & Accountable
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17211F] font-display">
            How SERVA Works in Bangladesh
          </h1>
          <p className="text-sm sm:text-base text-[#64716D] leading-relaxed">
            From short-term repairs to skilled trade services and second-hand item exchanges, SERVA brings order, verification, and proof to every local engagement.
          </p>
        </div>

        {/* 4 Core Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E3EAE7] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] font-black text-sm flex items-center justify-center font-display">
              01
            </div>
            <h3 className="font-bold text-sm text-[#17211F]">Discover Opportunity</h3>
            <p className="text-xs text-[#64716D] leading-relaxed">
              Find micro-tasks needing immediate hands, book verified service providers, or browse community items.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E3EAE7] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] font-black text-sm flex items-center justify-center font-display">
              02
            </div>
            <h3 className="font-bold text-sm text-[#17211F]">Connect & Agree</h3>
            <p className="text-xs text-[#64716D] leading-relaxed">
              Review applicant ratings, past completed jobs, proposed rates, and agree on clear milestone requirements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E3EAE7] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] font-black text-sm flex items-center justify-center font-display">
              03
            </div>
            <h3 className="font-bold text-sm text-[#17211F]">Execute with ProofBox</h3>
            <p className="text-xs text-[#64716D] leading-relaxed">
              Capture before/after photos, complete the task checklist in real-time, and eliminate guesswork.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E3EAE7] shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] font-black text-sm flex items-center justify-center font-display">
              04
            </div>
            <h3 className="font-bold text-sm text-[#17211F]">Sign-off & Audit Trail</h3>
            <p className="text-xs text-[#64716D] leading-relaxed">
              Client approves completion, generates a downloadable PDF audit report, and exchanges authentic verified reviews.
            </p>
          </div>
        </div>

        {/* Deep Dive into ProofBox */}
        <div id="proofbox" className="bg-white rounded-3xl border border-[#E3EAE7] p-8 sm:p-12 shadow-premium space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider block mb-1">
              Detailed Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display">
              The SERVA ProofBox™ System Explained
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-2 leading-relaxed">
              Our signature feature provides complete transparency for residential and commercial micro-work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] space-y-2">
              <Camera className="w-6 h-6 text-[#0F766E]" />
              <h4 className="font-bold text-sm text-[#17211F]">1. Photographic Baselines</h4>
              <p className="text-xs text-[#64716D] leading-relaxed">
                Providers take photo evidence of the site before starting. If pre-existing damage exists, it is documented upfront.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] space-y-2">
              <CheckCircle2 className="w-6 h-6 text-[#0F766E]" />
              <h4 className="font-bold text-sm text-[#17211F]">2. Checklist Accountability</h4>
              <p className="text-xs text-[#64716D] leading-relaxed">
                Tasks like "vacuum ceiling fans", "leak pressure test", or "grout sanitation" are checked off with completion timestamps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] space-y-2">
              <FileText className="w-6 h-6 text-[#0F766E]" />
              <h4 className="font-bold text-sm text-[#17211F]">3. Completion PDF Export</h4>
              <p className="text-xs text-[#64716D] leading-relaxed">
                When the client reviews and approves, an official completion certificate PDF is generated for records and warranty claims.
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#E3EAE7] flex-wrap gap-4">
            <span className="text-xs font-semibold text-[#17211F]">
              Ready to experience verified local work?
            </span>
            <div className="flex items-center gap-3">
              <Link to="/jobs">
                <Button variant="primary" size="md">
                  Find Work Now
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="md">
                  Find Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
