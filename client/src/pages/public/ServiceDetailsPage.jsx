import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { serviceService } from '../../services/serviceService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import RatingStars from '../../components/common/RatingStars';
import Modal from '../../components/common/Modal';
import PaymentCheckoutModal from '../../components/common/PaymentCheckoutModal';
import FavouriteButton from '../../components/common/FavouriteButton';
import ShareModal from '../../components/common/ShareModal';
import { Spinner } from '../../components/common/Loader';
import {
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Share2
} from 'lucide-react';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);

  // Payment checkout modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedPayAmount, setSelectedPayAmount] = useState(0);

  // Quote modal
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const data = await serviceService.getServiceById(id);
        setService(data);
        if (data.startingPrice) setBudget(data.startingPrice.toString());
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load service details');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!requirements.trim()) return;

    setSubmittingQuote(true);
    try {
      await serviceService.requestQuote({
        serviceId: service._id,
        requirements,
        budget: Number(budget),
        preferredDate
      });
      setQuoteSuccess(true);
      setTimeout(() => {
        setQuoteModalOpen(false);
        setQuoteSuccess(false);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quote request');
    } finally {
      setSubmittingQuote(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#17211F]">Service Unavailable</h2>
        <p className="text-sm text-[#64716D] mt-1 mb-6">{error || 'Service not found'}</p>
        <Link to="/services">
          <Button variant="primary" size="md">Back to All Services</Button>
        </Link>
      </div>
    );
  }

  const isOwner = user && service.provider?._id?.toString() === user._id?.toString();

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F766E] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Service Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Details Column */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E3EAE7] p-6 sm:p-8 shadow-soft space-y-8">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="teal" size="sm">
                    {service.category}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    {service.pricingModel || 'Hourly'}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShareOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E3EAE7] text-xs font-semibold text-[#17211F] hover:bg-gray-50 transition-colors shadow-xs"
                    title="Share this Service"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Share</span>
                  </button>
                  <FavouriteButton
                    postId={service._id}
                    postType="Service"
                    size="md"
                    showText={true}
                  />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17211F] font-display leading-tight">
                {service.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#64716D] mt-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  {service.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0F766E]" />
                  {service.availability || 'Regular Weekly Availability'}
                </span>
              </div>
            </div>

            {/* Portfolio Gallery if available */}
            {service.portfolioImages && service.portfolioImages.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#17211F] font-display">
                  Portfolio & Completed Work
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.portfolioImages.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`Portfolio ${i + 1}`}
                      className="w-full h-48 object-cover rounded-2xl border border-[#E3EAE7]"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#17211F] font-display">
                Service Overview
              </h3>
              <p className="text-sm text-[#17211F] leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Service Packages Tier Builder Display */}
            {service.packages && service.packages.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-[#E3EAE7]">
                <h3 className="text-base font-bold text-[#17211F] font-display">
                  Defined Service Packages
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.packages.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-[#E3EAE7] bg-[#F7F9F8] flex flex-col justify-between hover:border-[#0F766E] transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-sm text-[#17211F] font-display">{pkg.name}</h4>
                          <span className="text-sm font-black text-[#0F766E] font-display">
                            BDT {pkg.price?.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-[#64716D] mb-4">{pkg.description}</p>
                        <div className="space-y-2 mb-4">
                          {pkg.features?.map((f, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-[#17211F]">
                              <Check className="w-3.5 h-3.5 text-[#0F766E] shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#E3EAE7]/60 text-[11px] text-[#64716D] flex items-center justify-between">
                        <span>Turnaround: {pkg.deliveryTime || '1 Day'}</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            if (!isAuthenticated) {
                              navigate(`/login?redirect=/services/${service._id}`);
                            } else {
                              setBudget(pkg.price?.toString() || '');
                              setQuoteModalOpen(true);
                            }
                          }}
                        >
                          Select Package
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Provider Profile & Booking Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct Quote Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
              <div>
                <span className="text-xs text-[#64716D] block">Pricing Model</span>
                <span className="text-2xl font-black text-[#0F766E] font-display">
                  From BDT {service.startingPrice?.toLocaleString()}
                </span>
                <span className="text-xs text-[#64716D] block mt-0.5">({service.pricingModel})</span>
              </div>

              {!isOwner ? (
                <div className="space-y-2.5">
                  <Button
                    variant="lime"
                    size="lg"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirect=/services/${service._id}`);
                      } else {
                        setSelectedPayAmount(service.startingPrice || 1000);
                        setCheckoutModalOpen(true);
                      }
                    }}
                    className="w-full font-bold shadow-md hover:shadow-glow-lime"
                  >
                    <CreditCard className="w-4 h-4 mr-1.5" />
                    Book & Pay Online (Escrow)
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirect=/services/${service._id}`);
                      } else {
                        setQuoteModalOpen(true);
                      }
                    }}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Request Custom Quote
                  </Button>
                </div>
              ) : (
                <div className="text-center py-2 text-xs text-[#0F766E] bg-[#E6F4F2] p-3 rounded-xl border border-teal-200 font-semibold">
                  This is your advertised service profile
                </div>
              )}
            </div>

            {/* Provider Profile Card */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
              <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                Service Provider
              </h3>

              <div className="flex items-center gap-3">
                <Avatar
                  src={service.provider?.avatar}
                  size="md"
                  isOnline={service.provider?.isAvailableNow}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-[#17211F] truncate">
                    {service.provider?.name}
                  </h4>
                  <div className="mt-0.5">
                    <VerificationBadge status={service.provider?.verificationStatus} size="sm" />
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#64716D] leading-relaxed">
                {service.provider?.bio || 'Verified service professional on SERVA.'}
              </p>

              <div className="pt-2 border-t border-[#E3EAE7] space-y-2 text-xs text-[#64716D]">
                <div className="flex items-center justify-between">
                  <span>Rating & Reviews</span>
                  <RatingStars rating={service.provider?.rating || 5.0} count={service.provider?.reviewCount || 0} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed Jobs</span>
                  <span className="font-semibold text-[#17211F]">{service.provider?.completedJobsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service Area</span>
                  <span className="font-semibold text-[#17211F]">{service.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Request Modal */}
      <Modal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        title="Request a Quote"
        subtitle={`From ${service.provider?.name} for "${service.title}"`}
      >
        {quoteSuccess ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#17211F]">Quote Request Sent!</h4>
            <p className="text-xs text-[#64716D]">
              The provider will review your requirements and respond with a tailored proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleQuoteSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Describe Your Requirements *
              </label>
              <textarea
                required
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Explain the work you need done (measurements, problems, scope)..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Target Budget (BDT)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Preferred Date / Timing
              </label>
              <input
                type="text"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                placeholder="e.g. This Saturday Morning"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" size="md" onClick={() => setQuoteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={submittingQuote}>
                Send Quote Request
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Online Escrow Payment Modal */}
      <PaymentCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        title="Book Service & Deposit Escrow"
        amount={selectedPayAmount || service.startingPrice || 1000}
        purpose="Service Booking"
        receiverId={service.provider?._id}
        relatedServiceId={service._id}
        itemName={service.title}
        onPaymentSuccess={(p) => {
          setCheckoutModalOpen(false);
          alert(`Booking confirmed! ৳${p.amount} held in escrow via ${p.paymentMethod}.`);
        }}
      />

      {service && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          postTitle={service.title}
          postType="Service"
          postUrl={`/services/${service._id}`}
        />
      )}
    </div>
  );
};

export default ServiceDetailsPage;
