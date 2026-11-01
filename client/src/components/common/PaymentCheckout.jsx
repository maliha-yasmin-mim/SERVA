import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import PaymentMethodSelector from './PaymentMethodSelector';
import { Lock, ShieldCheck, ArrowRight, CheckCircle, X, ArrowLeft } from 'lucide-react';

const stepVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const PaymentCheckout = ({
  isOpen,
  onClose,
  amount,
  currency = 'BDT',
  description,
  onPaymentComplete,
  serviceName,
}) => {
  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const resetState = () => {
    setStep(1);
    setSelectedMethod('');
    setPhoneNumber('');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setProcessing(false);
    setRefNumber('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleProceedToDetails = () => {
    if (!selectedMethod) return;
    setStep(2);
  };

  const handleConfirmPayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const ref = `SERVA-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    setRefNumber(ref);
    setProcessing(false);
    setStep(3);

    if (onPaymentComplete) {
      onPaymentComplete({
        method: selectedMethod,
        amount,
        currency,
        referenceNumber: ref,
      });
    }
  };

  const formatAmount = (amt) => {
    return new Intl.NumberFormat('en-BD').format(amt);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step !== 3 ? handleClose : undefined}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E3EAE7] overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E3EAE7] bg-[#F7F9F8]">
              <div className="flex items-center gap-3">
                {step === 2 && (
                  <button
                    onClick={() => setStep(1)}
                    className="p-1 rounded-lg text-[#64716D] hover:text-[#17211F] hover:bg-gray-200 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#17211F] font-display">
                    {step === 1 && 'Select Payment Method'}
                    {step === 2 && 'Enter Payment Details'}
                    {step === 3 && 'Payment Complete'}
                  </h3>
                  {serviceName && step !== 3 && (
                    <p className="text-xs text-[#64716D] mt-0.5">{serviceName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Step indicator */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-2 h-2 rounded-full transition-all ${
                        s === step
                          ? 'bg-[#0F766E] w-6'
                          : s < step
                          ? 'bg-[#0F766E]'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {step !== 3 && (
                  <button
                    onClick={handleClose}
                    className="p-1.5 rounded-lg text-[#64716D] hover:text-[#17211F] hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {/* Demo mode notice */}
              <div className="mb-4 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-700 font-medium">
                  Demo Mode — No real payment processed
                </span>
              </div>

              {/* Amount summary */}
              {step !== 3 && (
                <div className="mb-5 p-4 bg-[#F7F9F8] rounded-xl border border-[#E3EAE7]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64716D]">
                      {description || 'Total Amount'}
                    </span>
                    <span className="text-xl font-bold text-[#17211F] font-display">
                      ৳{formatAmount(amount)}
                    </span>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* Step 1: Select payment method */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                  >
                    <PaymentMethodSelector
                      selectedMethod={selectedMethod}
                      onSelect={setSelectedMethod}
                    />

                    <div className="mt-6">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleProceedToDetails}
                        disabled={!selectedMethod}
                        className="w-full"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Enter details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* bKash / Nagad */}
                    {(selectedMethod === 'bkash' || selectedMethod === 'nagad') && (
                      <div className="space-y-4">
                        <div>
                          <label className="input-label">
                            {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'} Phone Number
                          </label>
                          <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            maxLength={11}
                            className="input-field"
                          />
                          <p className="text-xs text-[#64716D] mt-1.5">
                            Enter your registered {selectedMethod === 'bkash' ? 'bKash' : 'Nagad'}{' '}
                            number
                          </p>
                        </div>
                        <div className="p-3 bg-[#F7F9F8] rounded-xl border border-[#E3EAE7]">
                          <p className="text-xs text-[#64716D]">
                            You will receive a payment confirmation on your phone. Please approve
                            the payment of{' '}
                            <span className="font-bold text-[#17211F]">
                              ৳{formatAmount(amount)}
                            </span>{' '}
                            from the notification.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* SSLCommerz */}
                    {selectedMethod === 'sslcommerz' && (
                      <div className="space-y-4">
                        <p className="text-xs text-blue-600 font-medium px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                          Demo card details — enter any values
                        </p>
                        <div>
                          <label className="input-label">Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            className="input-field"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="input-label">Expiry Date</label>
                            <input
                              type="text"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="input-label">CVV</label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="input-field"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Cash on Delivery */}
                    {selectedMethod === 'cod' && (
                      <div className="text-center py-4 space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
                          <CheckCircle className="w-7 h-7 text-gray-500" />
                        </div>
                        <p className="text-sm text-[#17211F] font-medium">
                          Pay{' '}
                          <span className="font-bold">৳{formatAmount(amount)}</span>{' '}
                          when the service is completed
                        </p>
                        <p className="text-xs text-[#64716D]">
                          The provider will confirm payment upon receiving cash
                        </p>
                      </div>
                    )}

                    <div className="mt-6 pt-4 border-t border-[#E3EAE7]">
                      <Button
                        variant="primary"
                        size="lg"
                        onClick={handleConfirmPayment}
                        isLoading={processing}
                        className="w-full"
                      >
                        {processing
                          ? 'Processing...'
                          : selectedMethod === 'cod'
                          ? 'Confirm Booking'
                          : `Pay ৳${formatAmount(amount)}`}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    className="text-center py-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                        delay: 0.1,
                      }}
                      className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5"
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xl font-bold text-[#17211F] font-display mb-1">
                        Payment Successful!
                      </h3>
                      <p className="text-sm text-[#64716D] mb-4">
                        Your payment has been processed
                      </p>

                      <div className="p-4 bg-[#F7F9F8] rounded-xl border border-[#E3EAE7] space-y-2 text-left max-w-xs mx-auto">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#64716D]">Amount</span>
                          <span className="font-bold text-[#17211F]">
                            ৳{formatAmount(amount)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#64716D]">Method</span>
                          <span className="font-medium text-[#17211F] capitalize">
                            {selectedMethod === 'cod' ? 'Cash on Delivery' : selectedMethod}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm pt-2 border-t border-[#E3EAE7]">
                          <span className="text-[#64716D]">Reference</span>
                          <span className="font-mono text-xs font-medium text-[#0F766E]">
                            {refNumber}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Button variant="primary" size="md" onClick={handleClose}>
                          Done
                        </Button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-[#E3EAE7] bg-[#F7F9F8] flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#64716D]" />
              <span className="text-xs text-[#64716D]">
                Secure payment powered by <span className="font-semibold text-[#0F766E]">SERVA</span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentCheckout;
