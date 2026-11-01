import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import favouriteService from '../../services/favouriteService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ShareModal from '../../components/common/ShareModal';
import {
  Heart,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Briefcase,
  Wrench,
  ShoppingBag,
  Gift,
  MapPin,
  Calendar,
  Share2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const MyFavouritesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeType, setActiveType] = useState('All'); // 'All' | 'Job' | 'Service' | 'Product' | 'FreeItem'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest'); // 'newest' | 'oldest'

  // Share modal state
  const [shareData, setShareData] = useState({
    isOpen: false,
    title: '',
    postType: 'Listing',
    url: ''
  });

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-favourites', activeType, search, sort],
    queryFn: () =>
      favouriteService.getMyFavourites({
        type: activeType,
        search,
        sort
      }),
    keepPreviousData: true
  });

  const removeMutation = useMutation({
    mutationFn: (favId) => favouriteService.removeFavourite(favId),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-favourites']);
    }
  });

  const favourites = data?.favourites || [];

  const handleOpenShare = (e, fav) => {
    e.preventDefault();
    e.stopPropagation();

    let path = '';
    if (fav.postType === 'Job') path = `/jobs/${fav.post._id}`;
    else if (fav.postType === 'Service') path = `/services/${fav.post._id}`;
    else if (fav.postType === 'Product') path = `/marketplace/${fav.post._id}`;
    else if (fav.postType === 'FreeItem') path = `/free-stuff/${fav.post._id}`;

    setShareData({
      isOpen: true,
      title: fav.post.title,
      postType: fav.postType,
      url: path
    });
  };

  const getPostPath = (fav) => {
    if (!fav.post) return '#';
    switch (fav.postType) {
      case 'Job':
        return `/jobs/${fav.post._id}`;
      case 'Service':
        return `/services/${fav.post._id}`;
      case 'Product':
        return `/marketplace/${fav.post._id}`;
      case 'FreeItem':
        return `/free-stuff/${fav.post._id}`;
      default:
        return '#';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Job':
        return <Briefcase className="w-4 h-4 text-[#0F766E]" />;
      case 'Service':
        return <Wrench className="w-4 h-4 text-amber-600" />;
      case 'Product':
        return <ShoppingBag className="w-4 h-4 text-blue-600" />;
      case 'FreeItem':
        return <Gift className="w-4 h-4 text-emerald-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Job':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#0F766E] px-2.5 py-0.5 rounded-full border border-teal-200">
            Micro-Job
          </span>
        );
      case 'Service':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200">
            Service
          </span>
        );
      case 'Product':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">
            Marketplace
          </span>
        );
      case 'FreeItem':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Free Gift
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#17211F] font-display">
              My Favourites
            </h1>
            <span className="text-xs font-bold bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full border border-rose-200">
              {favourites.length} Saved
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Easily manage and monitor your saved micro-jobs, verified services, second-hand items, and community gifts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Refresh
          </Button>
          <Button variant="lime" size="sm" onClick={() => navigate('/jobs')}>
            Explore Opportunities
          </Button>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-3xl border border-[#E3EAE7] shadow-soft space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your saved posts by title, category, or location..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E3EAE7] text-xs sm:text-sm focus:outline-none focus:border-[#0F766E]"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-[#E3EAE7] rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#E3EAE7] overflow-x-auto pb-1">
          {[
            { id: 'All', label: 'All Items' },
            { id: 'Job', label: 'Micro-Jobs', icon: Briefcase },
            { id: 'Service', label: 'Services', icon: Wrench },
            { id: 'Product', label: 'Marketplace', icon: ShoppingBag },
            { id: 'FreeItem', label: 'Free Stuff', icon: Gift }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                activeType === tab.id
                  ? 'bg-[#0F766E] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-[#64716D]'
              }`}
            >
              {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="py-20">
          <Loader />
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-red-200 text-xs text-red-600">
          Failed to load your saved favourites. Please try again.
        </div>
      ) : favourites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourite items found"
          description={
            search
              ? 'No saved items matched your search query. Try clearing the search keyword.'
              : `You haven't saved any ${activeType === 'All' ? 'posts' : activeType + 's'} yet. Click the heart icon on any post to bookmark it here!`
          }
          actionText="Browse Marketplace"
          onAction={() => navigate('/jobs')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {favourites.map((fav) => {
              const item = fav.post;
              if (!item) return null;

              const path = getPostPath(fav);
              const isRemoving = removeMutation.isLoading && removeMutation.variables === fav._id;

              return (
                <motion.div
                  key={fav._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl border border-[#E3EAE7] p-5 hover:border-[#0F766E]/40 hover:shadow-card-hover transition-all flex flex-col justify-between group shadow-card"
                >
                  <div>
                    {/* Header: Type Badge & Actions */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeBadge(fav.postType)}
                        <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleOpenShare(e, fav)}
                          className="p-1.5 text-gray-400 hover:text-[#0F766E] hover:bg-[#E6F4F2] rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={isRemoving}
                          onClick={() => removeMutation.mutate(fav._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove from favourites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <Link to={path}>
                      <h3 className="font-extrabold text-sm sm:text-base text-[#17211F] group-hover:text-[#0F766E] transition-colors line-clamp-2 font-display mb-1.5 leading-snug">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Description snippet */}
                    <p className="text-xs text-[#64716D] line-clamp-2 leading-relaxed mb-3">
                      {item.description}
                    </p>

                    {/* Metadata Row */}
                    <div className="space-y-1 text-xs text-[#64716D] pt-2 border-t border-[#E3EAE7]/70">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                        <span className="truncate">{item.location || 'Bangladesh'}</span>
                      </div>
                      {item.workDate && (
                        <div className="flex items-center gap-1.5 truncate text-[11px]">
                          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>Schedule: {item.workDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer with Price/Budget & Direct Link */}
                  <div className="pt-3 mt-3 border-t border-[#E3EAE7] flex items-center justify-between">
                    <div>
                      {fav.postType === 'FreeItem' ? (
                        <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-display">
                          100% Free
                        </span>
                      ) : (
                        <div>
                          <span className="text-[10px] uppercase font-bold text-gray-400 block">
                            {fav.postType === 'Job' ? 'Budget' : 'Price'}
                          </span>
                          <span className="text-sm font-extrabold text-[#0F766E] font-mono">
                            ৳{Number(item.budget || item.price || item.startingPrice || 0).toLocaleString()} BDT
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      to={path}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0F766E] bg-[#E6F4F2] group-hover:bg-[#0F766E] group-hover:text-white transition-all shadow-xs"
                    >
                      Open
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ ...shareData, isOpen: false })}
        postTitle={shareData.title}
        postType={shareData.postType}
        postUrl={shareData.url}
      />
    </div>
  );
};

export default MyFavouritesPage;

