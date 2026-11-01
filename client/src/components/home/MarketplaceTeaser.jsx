import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import productService from '../../services/productService';
import Button from '../common/Button';
import {
  ShoppingBag,
  MapPin,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  ArrowRight
} from 'lucide-react';

const fallbackProducts = [
  {
    _id: 'prod-1',
    title: 'iPhone 13 128GB (Official BD, Battery 88%)',
    category: 'Electronics',
    price: 52000,
    condition: 'Like New',
    location: 'Bashundhara R/A, Dhaka',
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=400&q=80'],
    seller: { name: 'Sabbir Hossain', verificationStatus: 'Verified' }
  },
  {
    _id: 'prod-2',
    title: 'Otobi Solid Wood Executive Study & Computer Desk',
    category: 'Furniture',
    price: 8500,
    condition: 'Good',
    location: 'Dhanmondi 27, Dhaka',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80'],
    seller: { name: 'Tariqul Islam', verificationStatus: 'Verified' }
  },
  {
    _id: 'prod-3',
    title: 'Hero Sprint 26T 21-Speed Mountain Bicycle',
    category: 'Sports & Fitness',
    price: 7200,
    condition: 'Like New',
    location: 'Chawkbazar, Chattogram',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80'],
    seller: { name: 'Mehedi Hasan', verificationStatus: 'Verified' }
  },
  {
    _id: 'prod-4',
    title: 'Sony Alpha A6400 Camera + 16-50mm Lens Kit',
    category: 'Electronics',
    price: 68000,
    condition: 'Like New',
    location: 'Upashahar, Sylhet',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'],
    seller: { name: 'Nafis Rahman', verificationStatus: 'Verified' }
  },
  {
    _id: 'prod-5',
    title: 'Singer 10kg Top-Load Fully Automatic Washing Machine',
    category: 'Home Appliances',
    price: 19500,
    condition: 'Good',
    location: 'Mirpur DOHS, Dhaka',
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80'],
    seller: { name: 'Farzana Parvin', verificationStatus: 'Verified' }
  }
];

const MarketplaceTeaser = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [savedIds, setSavedIds] = useState(new Set());

  const { data } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productService.getProducts({ limit: 6, status: 'Available' }),
    staleTime: 1000 * 60 * 3
  });

  const rawProducts = data?.products || [];
  const products = rawProducts.length >= 2 ? rawProducts : fallbackProducts;

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
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-widest block mb-2">
              Buy & Sell
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display tracking-tight">
              Community Second-Hand Marketplace
            </h2>
            <p className="text-xs sm:text-sm text-[#64716D] mt-1">
              Find pre-loved electronics, furniture, vehicles, and tools from verified local neighbors.
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
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
              onClick={() => navigate('/marketplace')}
              className="ml-2 font-bold text-xs"
            >
              Explore Marketplace <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Horizontal Carousel (Bazaraki inspiration) */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((prod) => {
            const isSaved = savedIds.has(prod._id);
            const imageSrc =
              prod.images?.[0] ||
              'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80';

            return (
              <motion.div
                key={prod._id}
                whileHover={{ y: -4 }}
                onClick={() => navigate(`/marketplace/${prod._id}`)}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white rounded-2xl border border-[#E3EAE7] hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between overflow-hidden group shadow-card"
              >
                {/* Image Box */}
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  <img
                    src={imageSrc}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Condition Tag */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-md">
                      {prod.condition}
                    </span>
                  </div>

                  {/* Heart Button */}
                  <button
                    onClick={(e) => toggleSave(prod._id, e)}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isSaved
                        ? 'bg-red-500 text-white'
                        : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                    aria-label="Save item"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Price (Prominent like Bazaraki) */}
                    <div className="text-lg font-black text-[#17211F] font-mono">
                      ৳{Number(prod.price).toLocaleString()}
                      <span className="text-xs text-gray-500 font-normal ml-1">BDT</span>
                    </div>

                    <h3 className="font-bold text-xs sm:text-sm text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-2 leading-snug mt-1">
                      {prod.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-[#E3EAE7] flex items-center justify-between text-[11px] text-[#64716D]">
                    <div className="flex items-center gap-1 truncate max-w-[150px]">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate">{prod.location}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      Available
                    </span>
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

export default MarketplaceTeaser;
