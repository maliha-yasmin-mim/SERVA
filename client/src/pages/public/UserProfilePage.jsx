import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import RatingStars from '../../components/common/RatingStars';
import Button from '../../components/common/Button';
import { Spinner } from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import JobCard from '../../components/jobs/JobCard';
import ServiceCard from '../../components/services/ServiceCard';
import ProductCard from '../../components/marketplace/ProductCard';
import FreeItemCard from '../../components/free-items/FreeItemCard';
import ContactActions from '../../components/common/ContactActions';
import FloatingMessenger from '../../components/common/FloatingMessenger';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Briefcase,
  Wrench,
  ShoppingBag,
  Gift,
  Star,
  ArrowLeft,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
  Phone
} from 'lucide-react';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [messengerOpen, setMessengerOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await authService.getUserPublicProfile(id);
        setProfileData(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profileData || !profileData.user) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <AlertCircle className="w-14 h-14 text-[#DC2626] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#17211F]">Profile Unavailable</h2>
        <p className="text-sm text-[#64716D] mt-2 mb-6">{error || 'User not found'}</p>
        <Link to="/jobs">
          <Button variant="primary" size="md">Explore Marketplace</Button>
        </Link>
      </div>
    );
  }

  const { user, posts = {}, reviews = [] } = profileData;
  const { jobs = [], services = [], products = [], freeItems = [] } = posts;

  const totalPostsCount = jobs.length + services.length + products.length + freeItems.length;

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl 2xl:max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0F766E] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to previous page</span>
        </button>

        {/* User Profile Header Card */}
        <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 sm:p-8 lg:p-10 shadow-soft mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-[#E3EAE7]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar
                src={user.avatar}
                size="xl"
                isOnline={user.isAvailableNow}
                className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-teal-50"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#17211F] font-display">
                    {user.name}
                  </h1>
                  <VerificationBadge status={user.verificationStatus} size="md" />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#64716D]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                    {user.location || 'Dhaka, Bangladesh'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#0F766E]" />
                    Member since {new Date(user.createdAt || Date.now()).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {user.completedJobsCount || 0} Completed Tasks
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Contact Suite in Header */}
            <div className="w-full lg:w-auto min-w-[280px]">
              <ContactActions
                person={user}
                itemTitle={`Profile: ${user.name}`}
                itemType="Member Profile"
                onOpenMessenger={() => setMessengerOpen(true)}
                layout="stack"
              />
            </div>
          </div>

          {/* Stats & Bio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6">
            {/* Bio and Skills Column */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider mb-2">
                  About {user.name}
                </h3>
                <p className="text-sm text-[#17211F] leading-relaxed whitespace-pre-line bg-[#FAFCFB] p-4 rounded-2xl border border-[#E3EAE7]/70">
                  {user.bio || 'Verified SERVA community member offering services and local opportunities.'}
                </p>
              </div>

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#64716D] uppercase tracking-wider mb-2">
                    Verified Skills & Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold bg-[#E6F4F2] text-[#0F766E] px-3 py-1 rounded-xl border border-teal-200/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Services Offered */}
              {user.servicesOffered && user.servicesOffered.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#64716D] uppercase tracking-wider mb-2">
                    Services Provided
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.servicesOffered.map((srv, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold bg-gray-100 text-[#17211F] px-3 py-1 rounded-xl"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trust Metrics Column */}
            <div className="md:col-span-4 bg-[#F7F9F8] p-5 rounded-2xl border border-[#E3EAE7] space-y-4">
              <h4 className="text-xs font-bold text-[#17211F] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                Trust & Verification Score
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#E3EAE7]">
                  <span className="text-xs text-[#64716D]">Reliability Score</span>
                  <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                    {user.reliabilityScore || 98}% Reliable
                  </span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#E3EAE7]">
                  <span className="text-xs text-[#64716D]">Overall Rating</span>
                  <div className="flex items-center gap-1">
                    <RatingStars rating={user.rating || 5.0} count={user.reviewCount || 0} size="sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-[#E3EAE7]">
                  <span className="text-xs text-[#64716D]">Tasks Completed</span>
                  <span className="text-sm font-bold text-[#17211F]">
                    {user.completedJobsCount || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64716D]">Availability</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    user.isAvailableNow ? 'text-emerald-700 bg-emerald-100' : 'text-gray-600 bg-gray-100'
                  }`}>
                    {user.isAvailableNow ? 'Available for Work' : 'Currently Busy'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for All Public Posts by this user */}
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E3EAE7] pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#17211F] font-display">
                All Listings by {user.name}
              </h2>
              <p className="text-xs text-[#64716D]">
                Explore all verified opportunities, services, products, and community gifts posted by this user.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
                }`}
              >
                All ({totalPostsCount})
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'jobs'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
                }`}
              >
                Jobs ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'services'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
                }`}
              >
                Services ({services.length})
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'products'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
                }`}
              >
                Marketplace ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('free')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'free'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
                }`}
              >
                Free Items ({freeItems.length})
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-[#0F766E] text-white shadow-xs'
                    : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </div>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'jobs' && (
            jobs.length === 0 ? (
              <EmptyState title="No active job postings" description="This user hasn't posted any jobs recently." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {jobs.map(job => (
                  <JobCard key={job._id} job={{ ...job, poster: user }} />
                ))}
              </div>
            )
          )}

          {activeTab === 'services' && (
            services.length === 0 ? (
              <EmptyState title="No active services" description="This user has not listed any professional services." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map(service => (
                  <ServiceCard key={service._id} service={{ ...service, provider: user }} />
                ))}
              </div>
            )
          )}

          {activeTab === 'products' && (
            products.length === 0 ? (
              <EmptyState title="No marketplace listings" description="This user has no items currently for sale." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(product => (
                  <ProductCard key={product._id} product={{ ...product, seller: user }} />
                ))}
              </div>
            )
          )}

          {activeTab === 'free' && (
            freeItems.length === 0 ? (
              <EmptyState title="No free items" description="This user currently has no free giveaway items." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {freeItems.map(item => (
                  <FreeItemCard key={item._id} item={{ ...item, giver: user }} />
                ))}
              </div>
            )
          )}

          {activeTab === 'reviews' && (
            reviews.length === 0 ? (
              <EmptyState title="No reviews yet" description="This user hasn't received any member reviews yet." />
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r._id} className="bg-white p-5 rounded-2xl border border-[#E3EAE7] shadow-soft">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={r.reviewer?.avatar} size="sm" />
                        <div>
                          <h4 className="text-xs font-bold text-[#17211F]">{r.reviewer?.name}</h4>
                          <span className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <RatingStars rating={r.rating} size="sm" />
                    </div>
                    <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'all' && (
            totalPostsCount === 0 ? (
              <EmptyState title="No public listings found" description="This user has not published any public listings yet." />
            ) : (
              <div className="space-y-8">
                {jobs.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#17211F] font-display flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#0F766E]" />
                        Jobs Posted ({jobs.length})
                      </h3>
                      <button onClick={() => setActiveTab('jobs')} className="text-xs font-semibold text-[#0F766E] hover:underline">
                        View all jobs
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {jobs.slice(0, 3).map(job => (
                        <JobCard key={job._id} job={{ ...job, poster: user }} />
                      ))}
                    </div>
                  </div>
                )}

                {services.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#17211F] font-display flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-[#0F766E]" />
                        Services Offered ({services.length})
                      </h3>
                      <button onClick={() => setActiveTab('services')} className="text-xs font-semibold text-[#0F766E] hover:underline">
                        View all services
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {services.slice(0, 3).map(service => (
                        <ServiceCard key={service._id} service={{ ...service, provider: user }} />
                      ))}
                    </div>
                  </div>
                )}

                {products.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#17211F] font-display flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#0F766E]" />
                        Marketplace Items ({products.length})
                      </h3>
                      <button onClick={() => setActiveTab('products')} className="text-xs font-semibold text-[#0F766E] hover:underline">
                        View all items
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {products.slice(0, 3).map(product => (
                        <ProductCard key={product._id} product={{ ...product, seller: user }} />
                      ))}
                    </div>
                  </div>
                )}

                {freeItems.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#17211F] font-display flex items-center gap-2">
                        <Gift className="w-4 h-4 text-emerald-600" />
                        Free Community Items ({freeItems.length})
                      </h3>
                      <button onClick={() => setActiveTab('free')} className="text-xs font-semibold text-emerald-700 hover:underline">
                        View all free items
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {freeItems.slice(0, 3).map(item => (
                        <FreeItemCard key={item._id} item={{ ...item, giver: user }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>

      {/* Floating Messenger Widget */}
      <FloatingMessenger
        isOpen={messengerOpen}
        onClose={() => setMessengerOpen(false)}
        recipient={user}
        itemContext={{
          title: `Profile of ${user.name}`,
          type: 'Member Profile',
          id: user._id
        }}
      />
    </div>
  );
};

export default UserProfilePage;
