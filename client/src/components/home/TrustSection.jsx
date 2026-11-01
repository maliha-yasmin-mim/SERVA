import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import {
  ShieldCheck,
  FileCheck2,
  Lock,
  Star,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const trustPillars = [
  {
    icon: ShieldCheck,
    title: 'Verified Bangladeshi Identity',
    description:
      'We verify government-issued NID and mobile numbers for workers and clients to build accountability.',
    color: 'text-teal-600',
    bg: 'bg-teal-50'
  },
  {
    icon: FileCheck2,
    title: 'SERVA ProofBox™ Evidence',
    description:
      'Before and after photographic proof, job checklists, and digital signoffs eliminate disputes.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    icon: Lock,
    title: '100% Escrow Protection',
    description:
      'Online payments via bKash, Nagad, or Cards remain securely held in escrow until you verify work quality.',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: Star,
    title: 'Authentic Completed Reviews',
    description:
      'Only real clients and workers with completed transactions can leave ratings — no fake reviews allowed.',
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  }
];

const TrustSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E3EAE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest block mb-2">
            Safety & Reliability
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17211F] font-display tracking-tight">
            Built on Transparency & Community Trust
          </h2>
          <p className="text-xs sm:text-sm text-[#64716D] mt-2 leading-relaxed">
            Unlike informal Facebook groups or classifieds, SERVA protects both sides of every transaction with verified identities, escrow, and work evidence.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className="p-6 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] hover:border-[#0F766E]/40 hover:bg-white hover:shadow-card-hover transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xs`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[#17211F] mb-2 group-hover:text-[#0F766E] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#64716D] leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Honest Safety Standards:</strong> Identity verification
              confirms submitted documents and mobile ownership, significantly reducing fraud. However,
              it does not guarantee personal conduct. Always use SERVA ProofBox™ and online escrow for
              complete protection.
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/trust-verification')}
            className="shrink-0 text-xs font-bold border-amber-300 hover:bg-amber-100/60 text-amber-900"
          >
            Learn About Trust & Verification
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
