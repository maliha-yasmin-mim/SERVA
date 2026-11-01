import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import AnimatedBackground from '../common/AnimatedBackground';
import { useThemeSettings } from '../../context/ThemeSettingsContext';
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  TrendingUp,
  Star,
  Users
} from 'lucide-react';

const HeroSection = ({ onOpenPostModal }) => {
  const navigate = useNavigate();
  const { settings } = useThemeSettings();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const heroTitle = settings?.content?.homepage?.heroTitle || 'Find Local Work. Build Trusted Connections.';
  const heroSubtitle = settings?.content?.homepage?.heroSubtitle || 'Verified Local Work & Escrow Payments in Bangladesh';
  const heroDescription =
    settings?.content?.homepage?.heroDescription ||
    'Discover verified micro-jobs, hire trusted service professionals, sell used goods, or give away items across Dhaka, Chattogram, and nationwide — secured by SERVA ProofBox™ & Online Escrow.';
  const heroCtaText = settings?.content?.homepage?.heroCtaText || 'Explore Opportunities';
  const secondaryCtaText = settings?.content?.homepage?.secondaryCtaText || 'Post Something';

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (keyword) query.append('keyword', keyword);
    if (location && location !== 'All Locations') query.append('location', location);
    if (category && category !== 'All Categories') query.append('category', category);

    navigate(`/jobs?${query.toString()}`);
  };

  const bangladeshCities = [
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Cumilla',
    'Gazipur',
    'Barishal'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0D3D38] via-[#134E4A] to-[#0F766E] text-white pt-16 pb-20 lg:pt-20 lg:pb-28">
      {/* Cool Interactive Animated Particle & Glow Canvas Background */}
      <AnimatedBackground variant="hero" particleCount={40} interactive={true} />

      {/* Decorative Dot Grid Pattern */}
      <div className="absolute inset-0 dot-grid-pattern opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-[#C7F36B] font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{heroSubtitle}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] font-display">
              {heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-teal-100 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {heroDescription}
            </p>

            {/* Search Component (Working & Connected) */}
            <form
              onSubmit={handleSearch}
              className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-white/30 text-[#17211F] flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto lg:mx-0 backdrop-blur-sm"
            >
              <div className="flex-1 flex items-center px-3 gap-2 border-b sm:border-b-0 sm:border-r border-[#E3EAE7] py-1.5 sm:py-0">
                <Search className="w-4 h-4 text-[#0F766E] shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="What service or work? (e.g. Electrician, AC Repair)"
                  className="w-full text-xs sm:text-sm bg-transparent focus:outline-none placeholder-gray-400 py-1 font-medium"
                />
              </div>

              <div className="flex items-center px-3 gap-2 border-b sm:border-b-0 sm:border-r border-[#E3EAE7] py-1.5 sm:py-0">
                <MapPin className="w-4 h-4 text-[#0F766E] shrink-0" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-xs sm:text-sm bg-transparent focus:outline-none text-[#17211F] cursor-pointer py-1 font-medium"
                >
                  <option value="">All Bangladesh</option>
                  {bangladeshCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                variant="lime"
                size="md"
                className="shrink-0 w-full sm:w-auto font-bold shadow-md hover:shadow-glow-lime"
              >
                Search
              </Button>
            </form>

            {/* CTAs & Payment Gateways Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              <Button
                variant="lime"
                size="md"
                onClick={() => navigate('/jobs')}
                className="font-bold shadow-md"
              >
                {heroCtaText} <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={onOpenPostModal}
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm font-semibold"
              >
                {secondaryCtaText}
              </Button>

              <div className="flex items-center gap-2 text-xs text-teal-200 ml-0 lg:ml-2">
                <CreditCard className="w-4 h-4 text-[#C7F36B]" />
                <span>Pay Online: bKash • Nagad • Cards</span>
              </div>
            </div>

            {/* Live Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/15 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-display">2,850+</p>
                <p className="text-[11px] text-teal-200">Verified Local Jobs</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#C7F36B] font-display">1,400+</p>
                <p className="text-[11px] text-teal-200">Skilled Providers</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white font-display">99.8%</p>
                <p className="text-[11px] text-teal-200">ProofBox Approved</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-[#C7F36B] font-display">৳4.5M+</p>
                <p className="text-[11px] text-teal-200">Protected in Escrow</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Floating Interactive Glass Cards */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div className="relative mx-auto max-w-md space-y-4">
              {/* Card 1: Verified Job Opportunity (VIP Badge) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-dark p-4 rounded-2xl shadow-premium border border-white/20 animate-subtle-float hover:border-[#C7F36B]/40 transition-all cursor-pointer"
                onClick={() => navigate('/jobs')}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" /> VIP Verified Job
                  </span>
                  <span className="text-sm font-extrabold text-[#C7F36B] font-mono">
                    ৳3,500 BDT
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">
                  Apartment Deep Cleaning & Sanitization
                </h4>
                <div className="flex items-center justify-between text-xs text-teal-200">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C7F36B]" />
                    <span>Dhanmondi, Dhaka</span>
                  </div>
                  <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-teal-100">
                    2 Workers Needed
                  </span>
                </div>
              </motion.div>

              {/* Card 2: SERVA ProofBox Signature Highlight */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white text-[#17211F] p-4 rounded-2xl shadow-2xl border border-white/40 transform sm:translate-x-6 hover:shadow-glow-teal transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black tracking-wide text-[#0F766E] uppercase">
                        SERVA ProofBox™ Active
                      </h5>
                      <p className="text-[10px] text-gray-500">Photographic Evidence & Signoff</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Escrow Locked
                  </span>
                </div>
                <div className="space-y-1.5 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Before & After work photos timestamped</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Checklist items verified (6/6 completed)</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Online Payment via bKash / Nagad */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="glass-dark p-3.5 rounded-2xl border border-white/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white flex items-center justify-center font-bold text-xs">
                    ৳
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#C7F36B] uppercase tracking-wider">
                      Instant Online Escrow
                    </span>
                    <p className="text-xs font-semibold text-white">bKash, Nagad & Cards Accepted</p>
                  </div>
                </div>
                <span className="text-xs text-teal-200 bg-white/10 px-2.5 py-1 rounded-xl font-medium">
                  0% Fee for Workers
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
