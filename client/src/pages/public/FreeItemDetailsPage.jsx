import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { freeItemService } from '../../services/freeItemService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import Modal from '../../components/common/Modal';
import FavouriteButton from '../../components/common/FavouriteButton';
import ShareModal from '../../components/common/ShareModal';
import ContactActions from '../../components/common/ContactActions';
import FloatingMessenger from '../../components/common/FloatingMessenger';
import { Spinner } from '../../components/common/Loader';
import { Gift, MapPin, AlertCircle, ArrowLeft, Send, CheckCircle2, Share2 } from 'lucide-react';

const FreeItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);

  // Request modal
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const data = await freeItemService.getFreeItemById(id);
        setItem(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load free item details');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await freeItemService.requestFreeItem(item._id, note);
      setSuccess(true);
      setTimeout(() => {
        setRequestModalOpen(false);
        setSuccess(false);
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to request item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#17211F]">Item Unavailable</h2>
        <p className="text-sm text-[#64716D] mt-1 mb-6">{error || 'Item not found'}</p>
        <Link to="/free-stuff">
          <Button variant="primary" size="md">Back to Free Stuff</Button>
        </Link>
      </div>
    );
  }

  const isGiver = user && item.giver?._id?.toString() === user._id?.toString();

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl 2xl:max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <Link
          to="/free-stuff"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Free Stuff Community
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Photos */}
          <div className="md:col-span-7 bg-white rounded-3xl border-2 border-emerald-100 p-6 shadow-soft space-y-4">
            <div className="rounded-2xl overflow-hidden bg-gray-100 max-h-[420px]">
              <img
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-20 object-cover rounded-xl border border-emerald-100"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border-2 border-emerald-100 p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-[#C7F36B] text-[#134E4A] px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5" />
                    100% Free
                  </span>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShareOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 transition-colors shadow-xs"
                    title="Share this Free Item"
                  >
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Share</span>
                  </button>
                  <FavouriteButton
                    postId={item._id}
                    postType="FreeItem"
                    size="md"
                    showText={false}
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211F] font-display">
                  {item.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-[#64716D] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-xs font-bold text-emerald-900 block">Pickup Instructions</span>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {item.pickupInstructions || 'Self pickup required by collector.'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {!isGiver ? (
                <Button
                  variant="lime"
                  size="md"
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate(`/login?redirect=/free-stuff/${item._id}`);
                    } else {
                      setRequestModalOpen(true);
                    }
                  }}
                  className="w-full font-bold"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Request This Free Item
                </Button>
              ) : (
                <div className="text-center py-2 text-xs text-emerald-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200 font-semibold">
                  You are the generous giver of this item
                </div>
              )}

              {/* Direct Contact Suite */}
              <div className="pt-4 border-t border-emerald-100 space-y-2">
                <span className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                  Direct Contact Giver
                </span>
                <ContactActions
                  person={item.giver}
                  itemTitle={item.title}
                  itemType="Free Item"
                  onOpenMessenger={() => setMessengerOpen(true)}
                  layout="stack"
                />
              </div>
            </div>

            {/* Giver Info */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-5 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                  Given Away By
                </h4>
                {item.giver?._id && (
                  <Link
                    to={`/users/${item.giver._id}`}
                    className="text-xs font-semibold text-emerald-700 hover:underline"
                  >
                    View All Posts →
                  </Link>
                )}
              </div>

              <Link
                to={item.giver?._id ? `/users/${item.giver._id}` : '#'}
                className="flex items-center gap-3 group cursor-pointer"
                title={`View ${item.giver?.name}'s full profile and listings`}
              >
                <div className="group-hover:scale-105 transition-transform">
                  <Avatar src={item.giver?.avatar} size="md" />
                </div>
                <div className="min-w-0 flex-1">
                  <h5 className="text-sm font-bold text-[#17211F] truncate group-hover:text-emerald-700 group-hover:underline transition-colors">
                    {item.giver?.name}
                  </h5>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <VerificationBadge status={item.giver?.verificationStatus} size="sm" />
                    <span className="text-[10px] text-gray-400">• View profile</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title="Request Item"
        subtitle={`Send a pickup request to ${item.giver?.name}`}
      >
        {success ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-[#17211F]">Request Sent!</h4>
            <p className="text-xs text-[#64716D]">
              The giver has received your note and will get in touch to arrange pickup.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#17211F] uppercase tracking-wider block mb-1">
                Message to the Giver *
              </label>
              <textarea
                required
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Say hello, explain why you need the item, and propose a pickup time..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#E3EAE7] focus:outline-none focus:border-[#0F766E]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" size="md" onClick={() => setRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" isLoading={submitting}>
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {item && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          postTitle={item.title}
          postType="Free Item"
          postUrl={`/free-stuff/${item._id}`}
        />
      )}

      {/* Floating Messenger Widget */}
      {item && (
        <FloatingMessenger
          isOpen={messengerOpen}
          onClose={() => setMessengerOpen(false)}
          recipient={item.giver}
          itemContext={{
            title: item.title,
            type: 'Free Community Item',
            budget: 0,
            id: item._id
          }}
        />
      )}
    </div>
  );
};

export default FreeItemDetailsPage;
