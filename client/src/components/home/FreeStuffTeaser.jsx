import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import freeItemService from '../../services/freeItemService';
import Button from '../common/Button';
import { Gift, MapPin, Sparkles, Heart, ArrowRight } from 'lucide-react';

const fallbackFreeItems = [
  {
    _id: 'free-1',
    title: 'HSC Science Textbooks & Engineering Prep Guides',
    category: 'Books & Study',
    condition: 'Good',
    location: 'Farmgate, Dhaka',
    images: ['https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'],
    creator: { name: 'Tanvir Hossain' }
  },
  {
    _id: 'free-2',
    title: 'Wooden 3-Seater Living Room Sofa (Pickup needed)',
    category: 'Furniture',
    condition: 'Used',
    location: 'Khilgaon, Dhaka',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80'],
    creator: { name: 'Sumaiya Begum' }
  },
  {
    _id: 'free-3',
    title: 'Working CRT TV & Set-Top Box for Community Room',
    category: 'Electronics',
    condition: 'Good',
    location: 'Nasirabad, Chattogram',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80'],
    creator: { name: 'Arif Billah' }
  },
  {
    _id: 'free-4',
    title: 'Baby Stroller & Toddler Tricycle (Clean Condition)',
    category: 'Kids & Baby',
    condition: 'Good',
    location: 'Shahi Eidgah, Sylhet',
    images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80'],
    creator: { name: 'Rehana Sultana' }
  }
];

const FreeStuffTeaser = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['featured-free-items'],
    queryFn: () => freeItemService.getFreeItems({ limit: 4, status: 'Available' }),
    staleTime: 1000 * 60 * 3
  });

  const rawItems = data?.freeItems || [];
  const items = rawItems.length >= 2 ? rawItems : fallbackFreeItems;

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#E6F4F2]/50 to-[#F7F9F8] border-b border-[#E3EAE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                Community Giving
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                100% Free
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display tracking-tight">
              Free Stuff Near You
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-1 max-w-xl">
              Neighbors helping neighbors. Pass on usable furniture, books, appliances, and clothes at zero cost.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/free-stuff')}
            className="self-start sm:self-auto font-bold text-xs border-emerald-600/30 text-emerald-800 hover:bg-emerald-50"
          >
            See All Free Items <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const imageSrc =
              item.images?.[0] ||
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';

            return (
              <motion.div
                key={item._id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/free-stuff/${item._id}`)}
                className="bg-white rounded-2xl border border-emerald-200/60 hover:border-emerald-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between overflow-hidden shadow-card group"
              >
                {/* Image */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Free Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                      <Gift className="w-3 h-3" /> FREE
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>

                    <h3 className="font-bold text-xs sm:text-sm text-[#17211F] group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mt-2">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between text-[11px] text-[#64716D]">
                    <div className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <span className="text-emerald-700 font-bold">Claim Item</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FreeStuffTeaser;
