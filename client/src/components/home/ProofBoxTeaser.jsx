import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import AnimatedBackground from '../common/AnimatedBackground';
import {
  ShieldCheck,
  Search,
  Handshake,
  CheckCircle2,
  FileCheck2,
  Camera,
  ListChecks,
  Lock,
  ArrowRight,
  FileDown,
  Sparkles,
  Clock
} from 'lucide-react';

const howItWorksSteps = [
  {
    step: '01',
    title: 'Discover or Post',
    description: 'Post a micro-job or discover verified tasks and skilled service providers in your local area.',
    icon: Search
  },
  {
    step: '02',
    title: 'Agree & Escrow',
    description: 'Lock payment safely via bKash, Nagad, or Cards. Funds remain secure until job satisfaction.',
    icon: Lock
  },
  {
    step: '03',
    title: 'Document with ProofBox',
    description: 'Worker captures before-and-after photos and checks off tasks as work progresses.',
    icon: Camera
  },
  {
    step: '04',
    title: 'Approve & Release',
    description: 'Client reviews photographic evidence, gives approval, and payment releases automatically.',
    icon: CheckCircle2
  }
];

const ProofBoxTeaser = () => {
  const navigate = useNavigate();
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="space-y-0">
      {/* PART 1: How SERVA Works */}
      <section className="py-16 sm:py-20 bg-white border-b border-[#E3EAE7] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest block mb-2">
              Simple & Reliable
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display tracking-tight">
              How SERVA Works in 4 Steps
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-2">
              From discovering opportunities to guaranteed payments, our structured workflow eliminates risks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {howItWorksSteps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-5 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] relative group hover:border-[#0F766E]/40 hover:bg-white hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-black text-gray-300 font-display">
                      {s.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-[#17211F] mb-1.5 group-hover:text-[#0F766E] transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[#64716D] leading-relaxed">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PART 2: SERVA ProofBox Signature Trust Showcase */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0D3D38] via-[#134E4A] to-[#0F766E] text-white relative overflow-hidden">
        {/* Animated Background */}
        <AnimatedBackground variant="dark" particleCount={30} interactive={false} />
        <div className="absolute inset-0 dot-grid-pattern opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#C7F36B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proprietary Signature Feature</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight leading-tight">
                SERVA ProofBox™ —{' '}
                <span className="text-[#C7F36B] block sm:inline">Evidence You Can Trust.</span>
              </h2>

              <p className="text-sm sm:text-base text-teal-100 leading-relaxed font-normal">
                Never argue over incomplete work again. ProofBox creates an auditable record of every
                service: timestamped before-and-after photos, interactive task checklists, and client sign-off.
              </p>

              {/* 3 Value Pillars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#C7F36B] text-[#134E4A] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Before & After Photo Comparison</h4>
                    <p className="text-xs text-teal-200">
                      High-resolution photographic evidence captured on site with immutable timestamps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#C7F36B] text-[#134E4A] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <ListChecks className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Live Task Checklist Verification</h4>
                    <p className="text-xs text-teal-200">
                      Step-by-step task signoffs prevent skipped corners and ensure contract completion.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#C7F36B] text-[#134E4A] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Downloadable Completion Certificate</h4>
                    <p className="text-xs text-teal-200">
                      Export tamper-proof PDF completion reports for insurance, records, and portfolio building.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="lime"
                  size="md"
                  onClick={() => navigate('/how-it-works#proofbox')}
                  className="font-bold shadow-md"
                >
                  Explore ProofBox Workflow <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Mockup Column: Live Interactive ProofBox Card */}
            <div className="lg:col-span-6">
              <div className="glass-dark p-5 sm:p-6 rounded-3xl border border-white/20 shadow-premium space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-[#C7F36B] flex items-center justify-center">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        ProofBox Report #PB-88421
                      </h4>
                      <p className="text-[10px] text-teal-200">Apartment Deep Cleaning • Dhaka</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#134E4A] bg-[#C7F36B] px-2.5 py-1 rounded-full uppercase">
                    Escrow Ready
                  </span>
                </div>

                {/* Simulated Before & After Visual Preview */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-teal-200">
                    <span>Work Photographic Evidence:</span>
                    <span className="text-[#C7F36B]">Drag to inspect</span>
                  </div>

                  <div className="relative h-44 rounded-2xl overflow-hidden border border-white/20 select-none">
                    {/* Simulated "After" background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-800 to-teal-700 flex items-center justify-center">
                      <div className="text-center p-4">
                        <CheckCircle2 className="w-8 h-8 text-[#C7F36B] mx-auto mb-1" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                          Work Completed (Sparkling Clean)
                        </span>
                        <p className="text-[10px] text-teal-200 mt-0.5">Timestamp: Today, 3:45 PM</p>
                      </div>
                    </div>

                    {/* Simulated "Before" clip */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-stone-800 to-zinc-700 border-r-2 border-[#C7F36B] flex items-center justify-center overflow-hidden"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <div className="text-center p-4 min-w-[280px]">
                        <Clock className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          Initial State (Before Work)
                        </span>
                        <p className="text-[10px] text-gray-300 mt-0.5">Timestamp: Today, 9:30 AM</p>
                      </div>
                    </div>

                    {/* Interactive Slider Input */}
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-20"
                    />
                  </div>
                </div>

                {/* Checklist Simulator */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-semibold text-teal-200">
                    <span>Task Checklist (4 of 4 Done):</span>
                    <span className="text-[#C7F36B] font-mono">100%</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {[
                      'Kitchen counter & grease extraction',
                      'Bathroom tile descaling & sanitization',
                      'Living room floor machine buffing',
                      'Balcony debris removal & glass wash'
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 text-teal-100"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B] shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Simulated Signoff Action */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
                  <div className="text-teal-200">
                    Client Approval: <strong className="text-white">Confirmed</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#C7F36B] font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>৳3,500 Released via bKash</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProofBoxTeaser;
