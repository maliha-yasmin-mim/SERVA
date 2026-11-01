import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import jobService from '../../services/jobService';
import Button from '../common/Button';
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Users,
  CreditCard,
  ArrowRight
} from 'lucide-react';

// Fallback high-quality demo jobs if database has few
const fallbackJobs = [
  {
    _id: 'job-1',
    title: 'Apartment Deep Cleaning & Floor Scrubbing',
    category: 'Cleaning',
    budget: 3500,
    paymentType: 'Fixed',
    location: 'Dhanmondi, Dhaka',
    workersNeeded: 2,
    urgency: 'Urgent',
    isVip: true,
    applicantCount: 4,
    poster: { name: 'Rahim Chowdhury', verificationStatus: 'Verified' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-2',
    title: 'Split AC Servicing & Gas Refill (2 Units)',
    category: 'Repairs & AC',
    budget: 4200,
    paymentType: 'Fixed',
    location: 'Gulshan 2, Dhaka',
    workersNeeded: 1,
    urgency: 'Normal',
    isVip: true,
    applicantCount: 6,
    poster: { name: 'Sabrina Hossain', verificationStatus: 'Verified' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-3',
    title: 'Residential Electrical Rewiring & DB Box Check',
    category: 'Electrical Work',
    budget: 2800,
    paymentType: 'Fixed',
    location: 'Agrabad, Chattogram',
    workersNeeded: 1,
    urgency: 'Urgent',
    isVip: false,
    applicantCount: 3,
    poster: { name: 'Tanvir Ahmed', verificationStatus: 'Verified' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-4',
    title: 'Furniture Shifting & Loading (Bed & Sofa Set)',
    category: 'Moving & Shifting',
    budget: 5000,
    paymentType: 'Fixed',
    location: 'Uttara Sector 7, Dhaka',
    workersNeeded: 3,
    urgency: 'Normal',
    isVip: true,
    applicantCount: 8,
    poster: { name: 'Farhan Kabir', verificationStatus: 'Verified' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-5',
    title: 'Kitchen Pipe Leak Repair & Basin Installation',
    category: 'Plumbing',
    budget: 1800,
    paymentType: 'Fixed',
    location: 'Zindabazar, Sylhet',
    workersNeeded: 1,
    urgency: 'Urgent',
    isVip: false,
    applicantCount: 2,
    poster: { name: 'Anisul Haque', verificationStatus: 'Verified' },
    createdAt: new Date().toISOString()
  },
  {
    _id: 'job-6',
    title: 'Garden Lawn Mowing & Hedge Trimming',
    category: 'Gardening',
    budget: 2200,
    paymentType: 'Fixed',
    location: 'Banani DOHS, Dhaka',
    workersNeeded: 1,
    urgency: 'Normal',
    isVip: false,
    applicantCount: 5,
    poster: { name: 'Nasreen Begum', verificationStatus: 'Verified' },
    createdAt: new Date().toISOString()
  }
];

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const { data } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => jobService.getJobs({ limit: 8, status: 'Open' }),
    staleTime: 1000 * 60 * 3
  });

  const rawJobs = data?.jobs || [];
  const jobs = rawJobs.length >= 3 ? rawJobs : fallbackJobs;

  const toggleSave = (id, e) => {
    e.stopPropagation();
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-[#E3EAE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left/Right Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest">
                Local Micro-Work
              </span>
              <span className="text-[10px] bg-[#C7F36B] text-[#134E4A] font-bold px-2 py-0.5 rounded-full uppercase">
                Escrow Protected
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display tracking-tight">
              Latest Verified Local Jobs
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-1">
              Browse urgent tasks and apply directly with your verified SERVA profile.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Scroll buttons (Bazaraki carousel style) */}
            <button
              onClick={() => scroll('left')}
              className="w-9 h-9 rounded-xl border border-[#E3EAE7] hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors shadow-xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-9 h-9 rounded-xl border border-[#E3EAE7] hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors shadow-xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/jobs')}
              className="ml-2 font-bold text-xs"
            >
              View All Jobs <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {jobs.map((job) => {
            const isSaved = savedIds.has(job._id);
            return (
              <motion.div
                key={job._id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="w-72 sm:w-80 shrink-0 snap-start bg-white rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between overflow-hidden group shadow-card"
              >
                {/* Visual Thumbnail Area */}
                <div className="relative h-40 bg-gradient-to-br from-teal-800 to-[#134E4A] p-4 flex flex-col justify-between overflow-hidden">
                  {/* Subtle pattern */}
                  <div className="absolute inset-0 dot-grid-pattern opacity-30" />

                  {/* Top Badges */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-md">
                      {job.category}
                    </span>

                    <button
                      onClick={(e) => toggleSave(job._id, e)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isSaved
                          ? 'bg-red-500 text-white'
                          : 'bg-black/30 text-white hover:bg-black/50'
                      }`}
                      aria-label="Save job"
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom of Image: Price Banner */}
                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] text-teal-200 block font-medium">Budget:</span>
                      <div className="text-xl font-extrabold text-[#C7F36B] font-mono tracking-tight">
                        ৳{Number(job.budget).toLocaleString()}
                        <span className="text-xs text-white/80 font-normal ml-1">BDT</span>
                      </div>
                    </div>
                    {job.isVip && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" /> VIP
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Content Body */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-2 leading-snug">
                      {job.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-[#64716D] mt-2">
                      <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="pt-3 border-t border-[#E3EAE7] flex items-center justify-between text-[11px] text-[#64716D]">
                    <div className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{job.poster?.verificationStatus || 'Verified'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-gray-400" />
                      <span>{job.applicantCount || 3} applicants</span>
                    </div>
                  </div>
                </div>

                {/* Action CTA Strip */}
                <div className="px-4 py-2.5 bg-[#F7F9F8] border-t border-[#E3EAE7] flex items-center justify-between text-xs font-bold text-[#0F766E] group-hover:bg-[#E6F4F2] transition-colors">
                  <span>View Details & Apply</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
