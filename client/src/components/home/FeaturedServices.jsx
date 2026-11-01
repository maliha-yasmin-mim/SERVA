import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import serviceService from '../../services/serviceService';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import {
  Star,
  MapPin,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CreditCard,
  CheckCircle2
} from 'lucide-react';

const fallbackServices = [
  {
    _id: 'srv-1',
    title: 'Professional Home & Office Deep Cleaning',
    category: 'Cleaning',
    startingPrice: 1500,
    pricingModel: 'Fixed Package',
    serviceArea: 'Dhaka (All Zones)',
    rating: 4.9,
    reviewCount: 38,
    isAvailableNow: true,
    provider: {
      name: 'Farhana Akter',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      verificationStatus: 'Verified'
    }
  },
  {
    _id: 'srv-2',
    title: 'Expert Inverter AC Servicing & Installation',
    category: 'Repairs & AC',
    startingPrice: 1200,
    pricingModel: 'Per Unit',
    serviceArea: 'Gulshan, Banani, Uttara',
    rating: 4.8,
    reviewCount: 52,
    isAvailableNow: true,
    provider: {
      name: 'Kamrul Hassan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      verificationStatus: 'Verified'
    }
  },
  {
    _id: 'srv-3',
    title: 'Certified Residential Electrical Wiring & Fixes',
    category: 'Electrical Work',
    startingPrice: 800,
    pricingModel: 'Per Visit',
    serviceArea: 'Chattogram Metro',
    rating: 5.0,
    reviewCount: 29,
    isAvailableNow: false,
    provider: {
      name: 'Mohiuddin Sarker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      verificationStatus: 'Verified'
    }
  },
  {
    _id: 'srv-4',
    title: 'Emergency Plumbing, Sanitary & Water Motor Fixes',
    category: 'Plumbing',
    startingPrice: 900,
    pricingModel: 'Per Job',
    serviceArea: 'Sylhet Sadar',
    rating: 4.7,
    reviewCount: 44,
    isAvailableNow: true,
    provider: {
      name: 'Zahidul Islam',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
      verificationStatus: 'Verified'
    }
  }
];

const FeaturedServices = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['featured-services'],
    queryFn: () => serviceService.getServices({ limit: 4, status: 'Active' }),
    staleTime: 1000 * 60 * 3
  });

  const rawServices = data?.services || [];
  const services = rawServices.length >= 2 ? rawServices : fallbackServices;

  return (
    <section className="py-16 sm:py-20 bg-[#F7F9F8] border-b border-[#E3EAE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest block mb-2">
              Verified Professionals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display tracking-tight">
              Hire Trusted Service Providers
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-1">
              Top-rated experts ready to assist. Pay securely online via bKash or Cards.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/services')}
            className="self-start sm:self-auto font-bold text-xs"
          >
            Browse All Services <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((srv) => (
            <motion.div
              key={srv._id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/services/${srv._id}`)}
              className="bg-white rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-card group"
            >
              {/* Top Banner with Provider */}
              <div className="p-4 bg-gradient-to-br from-teal-50 to-[#E6F4F2] border-b border-[#E3EAE7]/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={srv.provider?.avatar}
                      size="md"
                      isOnline={srv.isAvailableNow}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#17211F] truncate max-w-[120px]">
                        {srv.provider?.name || 'Verified Provider'}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>

                  {srv.isAvailableNow && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Available
                    </span>
                  )}
                </div>
              </div>

              {/* Service Details Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {srv.category}
                  </span>

                  <h3 className="font-bold text-sm text-[#17211F] group-hover:text-[#0F766E] transition-colors mt-2 line-clamp-2 leading-snug">
                    {srv.title}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-[#64716D] mt-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{srv.serviceArea || 'Dhaka'}</span>
                  </div>
                </div>

                {/* Rating & Starting Price */}
                <div className="pt-3 border-t border-[#E3EAE7] flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-[#17211F]">
                      {srv.rating || '4.9'}
                    </span>
                    <span className="text-[10px] text-[#64716D]">
                      ({srv.reviewCount || 12})
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#64716D] block">Starts at</span>
                    <span className="text-base font-extrabold text-[#0F766E] font-mono">
                      ৳{Number(srv.startingPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-4 py-2.5 bg-[#F7F9F8] border-t border-[#E3EAE7] flex items-center justify-between text-xs font-bold text-[#0F766E] group-hover:bg-[#E6F4F2] transition-colors">
                <span className="flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5" /> Book & Pay Online
                </span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
