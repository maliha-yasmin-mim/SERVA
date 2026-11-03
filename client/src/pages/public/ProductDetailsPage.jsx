import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Avatar from '../../components/common/Avatar';
import VerificationBadge from '../../components/common/VerificationBadge';
import PaymentCheckoutModal from '../../components/common/PaymentCheckoutModal';
import FavouriteButton from '../../components/common/FavouriteButton';
import ShareModal from '../../components/common/ShareModal';
import ContactActions from '../../components/common/ContactActions';
import FloatingMessenger from '../../components/common/FloatingMessenger';
import { Spinner } from '../../components/common/Loader';
import { MapPin, MessageCircle, AlertCircle, ArrowLeft, ShieldCheck, CreditCard, Share2 } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [messengerOpen, setMessengerOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-xl font-bold text-[#17211F]">Product Unavailable</h2>
        <p className="text-sm text-[#64716D] mt-1 mb-6">{error || 'Item not found'}</p>
        <Link to="/marketplace">
          <Button variant="primary" size="md">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const isSeller = user && product.seller?._id?.toString() === user._id?.toString();

  return (
    <div className="bg-[#F7F9F8] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl 2xl:max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#0F766E] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Photos Column */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-4">
            <div className="rounded-2xl overflow-hidden bg-gray-100 max-h-[420px]">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="w-full h-20 object-cover rounded-xl border border-[#E3EAE7]"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details & Seller Column */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="teal" size="sm">
                    {product.category}
                  </Badge>
                  <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                    {product.condition}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShareOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E3EAE7] text-xs font-semibold text-[#17211F] hover:bg-gray-50 transition-colors shadow-xs"
                    title="Share item"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#0F766E]" />
                    <span>Share</span>
                  </button>
                  <FavouriteButton
                    postId={product._id}
                    postType="Product"
                    size="md"
                    showText={false}
                  />
                </div>
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#17211F] font-display">
                  {product.title}
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-[#64716D] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{product.location}</span>
                </div>
              </div>

              <div className="py-3 px-4 rounded-2xl bg-[#F7F9F8] border border-[#E3EAE7] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64716D] block">Price</span>
                  <span className="text-2xl font-black text-[#0F766E] font-display">
                    BDT {product.price?.toLocaleString()}
                  </span>
                </div>
                <Badge variant={product.status === 'Available' ? 'success' : 'neutral'} size="sm">
                  {product.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                  Description
                </h3>
                <p className="text-xs sm:text-sm text-[#17211F] leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {!isSeller && (
                <div className="space-y-2">
                  <Button
                    variant="lime"
                    size="md"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate(`/login?redirect=/marketplace/${product._id}`);
                      } else {
                        setBuyModalOpen(true);
                      }
                    }}
                    className="w-full font-bold shadow-md hover:shadow-glow-lime"
                  >
                    <CreditCard className="w-4 h-4 mr-1.5" />
                    Buy Online with Escrow
                  </Button>

                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setMessengerOpen(true)}
                    className="w-full"
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Quick Inquire
                  </Button>
                </div>
              )}

              {/* Direct Contact Suite */}
              <div className="pt-4 border-t border-[#E3EAE7] space-y-2">
                <span className="text-xs font-bold text-[#17211F] uppercase tracking-wider block">
                  Direct Contact Seller
                </span>
                <ContactActions
                  person={product.seller}
                  itemTitle={product.title}
                  itemType="Product"
                  onOpenMessenger={() => setMessengerOpen(true)}
                  layout="stack"
                />
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-3xl border border-[#E3EAE7] p-5 shadow-soft space-y-3">
              <h4 className="text-xs font-bold text-[#64716D] uppercase tracking-wider">
                Seller Details
              </h4>
              <div className="flex items-center gap-3">
                <Avatar src={product.seller?.avatar} size="md" />
                <div>
                  <h5 className="text-sm font-bold text-[#17211F]">{product.seller?.name}</h5>
                  <div className="mt-0.5">
                    <VerificationBadge status={product.seller?.verificationStatus} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now Escrow Modal */}
      <PaymentCheckoutModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        title="Buy Product with SERVA Escrow"
        amount={product.price || 0}
        purpose="Marketplace Purchase"
        receiverId={product.seller?._id}
        relatedProductId={product._id}
        itemName={product.title}
        onPaymentSuccess={(p) => {
          setBuyModalOpen(false);
          alert(`Payment of ৳${p.amount} secured in escrow via ${p.paymentMethod}! The seller will prepare handover.`);
        }}
      />

      {product && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          postTitle={product.title}
          postType="Product"
          postUrl={`/marketplace/${product._id}`}
        />
      )}

      {/* Floating Messenger Widget */}
      {product && (
        <FloatingMessenger
          isOpen={messengerOpen}
          onClose={() => setMessengerOpen(false)}
          recipient={product.seller}
          itemContext={{
            title: product.title,
            type: 'Marketplace Product',
            budget: product.price,
            id: product._id
          }}
        />
      )}
    </div>
  );
};

export default ProductDetailsPage;
