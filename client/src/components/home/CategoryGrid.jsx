import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TreePine,
  Truck,
  Wrench,
  Zap,
  Hammer,
  Car,
  GraduationCap,
  Camera,
  Grid,
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    name: 'Cleaning',
    icon: Sparkles,
    count: '340+ Jobs',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    borderColor: 'hover:border-teal-400'
  },
  {
    name: 'Gardening',
    icon: TreePine,
    count: '120+ Jobs',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    borderColor: 'hover:border-emerald-400'
  },
  {
    name: 'Moving & Shifting',
    icon: Truck,
    count: '210+ Jobs',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    borderColor: 'hover:border-blue-400'
  },
  {
    name: 'Plumbing',
    icon: Wrench,
    count: '180+ Jobs',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    borderColor: 'hover:border-cyan-400'
  },
  {
    name: 'Electrical Work',
    icon: Zap,
    count: '260+ Jobs',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    borderColor: 'hover:border-amber-400'
  },
  {
    name: 'Repairs & AC',
    icon: Hammer,
    count: '310+ Jobs',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    borderColor: 'hover:border-rose-400'
  },
  {
    name: 'Car Wash',
    icon: Car,
    count: '95+ Jobs',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    borderColor: 'hover:border-indigo-400'
  },
  {
    name: 'Tutoring',
    icon: GraduationCap,
    count: '420+ Jobs',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    borderColor: 'hover:border-purple-400'
  },
  {
    name: 'Photography',
    icon: Camera,
    count: '85+ Jobs',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    borderColor: 'hover:border-pink-400'
  },
  {
    name: 'All Categories',
    icon: Grid,
    count: '2,400+ Total',
    color: 'text-teal-800',
    bg: 'bg-[#C7F36B]/30',
    borderColor: 'hover:border-[#0F766E]'
  }
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    if (categoryName === 'All Categories') {
      navigate('/jobs');
    } else {
      navigate(`/jobs?category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-[#F7F9F8] border-b border-[#E3EAE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest block mb-2">
              Browse by Category
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display tracking-tight">
              Explore Popular Work & Services
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-1 max-w-xl">
              Connect instantly with verified local workers and service experts across popular trades.
            </p>
          </div>

          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:text-[#134E4A] hover:underline"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 10-Item Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(cat.name)}
                className={`cursor-pointer p-4 rounded-2xl bg-white border border-[#E3EAE7] ${cat.borderColor} shadow-card hover:shadow-card-hover transition-all text-center flex flex-col items-center justify-center group`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${cat.bg} ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-[#64716D] mt-1 font-medium">{cat.count}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
