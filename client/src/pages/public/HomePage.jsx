import React, { useState } from 'react';
import HeroSection from '../../components/home/HeroSection';
import CategoryGrid from '../../components/home/CategoryGrid';
import FeaturedJobs from '../../components/home/FeaturedJobs';
import FeaturedServices from '../../components/home/FeaturedServices';
import ProofBoxTeaser from '../../components/home/ProofBoxTeaser';
import MarketplaceTeaser from '../../components/home/MarketplaceTeaser';
import FreeStuffTeaser from '../../components/home/FreeStuffTeaser';
import TrustSection from '../../components/home/TrustSection';
import Modal from '../../components/common/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Wrench, ShoppingBag, Gift, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import Button from '../../components/common/Button';

const HomePage = () => {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handlePostOption = (destination) => {
    setPostModalOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=' + destination);
    } else {
      navigate(destination);
    }
  };

  return (
    <div className="space-y-0">
      {/* 1. Hero Section with Animated Particle Background & Working Search */}
      <HeroSection onOpenPostModal={() => setPostModalOpen(true)} />

      {/* 2. Quick Category Navigation Grid */}
      <CategoryGrid />

      {/* 3. Find Local Work (Bazaraki Horizontal Scroll Carousel with Price Badges) */}
      <FeaturedJobs />

      {/* 4. Discover Trusted Services (with Online Booking & Escrow) */}
      <FeaturedServices />

      {/* 5 & 6. How SERVA Works & Signature ProofBox Teaser */}
      <ProofBoxTeaser />

      {/* 7. Marketplace (Buy & Sell Second-Hand Goods) */}
      <MarketplaceTeaser />

      {/* 8. Free Stuff Community Giving */}
      <FreeStuffTeaser />

      {/* 9. Trust & Verification Safeguards */}
      <TrustSection />

      {/* 10. Final Call to Action Section with Ambient Background */}
      <section className="py-20 sm:py-24 bg-gradient-to-r from-[#134E4A] via-[#0F766E] to-[#134E4A] text-white text-center relative overflow-hidden">
        {/* Glow lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C7F36B]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <span className="text-xs font-bold text-[#C7F36B] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 border border-white/15 inline-block">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight leading-tight">
            Your Next Opportunity Starts Here.
          </h2>
          <p className="text-sm sm:text-base text-teal-100 max-w-xl mx-auto leading-relaxed">
            Join thousands of verified workers, skilled service providers, and neighbors across
            Bangladesh. Find work, offer services, or trade goods safely.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="lime"
              size="lg"
              onClick={() => navigate('/jobs')}
              className="font-bold shadow-lg hover:shadow-glow-lime"
            >
              Find Local Work <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/services')}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold backdrop-blur-sm"
            >
              Hire a Service Provider
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setPostModalOpen(true)}
              className="font-bold shadow-sm"
            >
              Post Something
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-xs text-teal-200">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C7F36B]" /> SERVA ProofBox™ Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#C7F36B]" /> 100% Escrow Protected
            </span>
          </div>
        </div>
      </section>

      {/* Post Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="What would you like to post?"
        subtitle="Choose from the 4 options below to create your listing on SERVA"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <button
            onClick={() => handlePostOption('/dashboard/create-job')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Post a Job
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              Hire local workers for cleaning, repairs, moving, or technical assistance.
            </p>
          </button>

          <button
            onClick={() => handlePostOption('/dashboard/create-service')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Offer a Service
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              Advertise your verified trade or skill packages and receive direct bookings.
            </p>
          </button>

          <button
            onClick={() => handlePostOption('/dashboard/create-product')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Sell an Item
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              List second-hand electronics, tools, furniture, or bicycles for sale.
            </p>
          </button>

          <button
            onClick={() => handlePostOption('/dashboard/create-free-item')}
            className="flex flex-col items-start p-4 rounded-xl border border-[#E3EAE7] hover:border-[#0F766E] hover:bg-[#E6F4F2]/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E]">
              Give Away for Free
            </h4>
            <p className="text-xs text-[#64716D] mt-1 leading-relaxed">
              Pass on useful study textbooks, extra appliances, or furniture for free.
            </p>
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
