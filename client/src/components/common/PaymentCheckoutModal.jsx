import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import Modal from './Modal';
import Button from './Button';
import PaymentMethodSelector from './PaymentMethodSelector';
import paymentService from '../../services/paymentService';
import {
  ShieldCheck,
  Lock,
  CheckCircle,
  AlertCircle,
  Copy,
  Receipt,
  ArrowRight,
  Sparkles,
  Smartphone,
  CreditCard
} from 'lucide-react';

const PaymentCheckoutModal = ({
  isOpen,
  onClose,
  title = 'Online Payment',
  amount = 0,
  purpose = 'Service Booking',
  receiverId = null,
  relatedJobId = null,
  relatedServiceId = null,
  relatedProductId = null,
  itemName = '',
  onPaymentSuccess
}) => {
  const [selectedMethod, setSelectedMethod] = useState('bKash');
  const [step, setStep] = useState(1); // 1: Select & Details, 2: Gateway Simulation, 3: Success
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pinNumber, setPinNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [completedPayment, setCompletedPayment] = useState(null);
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0F766E', '#C7F36B', '#134E4A', '#E2136E']
      });
    } catch {
      // safe fallback if canvas-confetti fails
    }
  };

  const handleNextStep = () => {
    setError('');
    if (['bKash', 'Nagad'].includes(selectedMethod) && !phoneNumber) {
      setError(`Please provide your ${selectedMethod} mobile number`);
      return;
    }
    setStep(2);
  };

  const handleProcessPayment = async () => {
    setError('');
    setIsProcessing(true);

    try {
      const payload = {
        amount: Number(amount),
        paymentMethod: selectedMethod,
        purpose,
        receiverId,
        relatedJobId,
        relatedServiceId,
        relatedProductId,
        payerPhone: phoneNumber || '01700000000',
        notes: notes || `Payment for ${itemName || purpose}`
      };

      const res = await paymentService.initiatePayment(payload);

      if (res.success) {
        setCompletedPayment(res.payment);
        setStep(3);
        triggerConfetti();
        if (onPaymentSuccess) {
          onPaymentSuccess(res.payment);
        }
      } else {
        setError(res.message || 'Payment processing failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Payment failed. Please verify credentials.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setError('');
    setCompletedPayment(null);
    onClose();
  };

  const copyTxn = () => {
    if (completedPayment?.transactionId) {
      navigator.clipboard.writeText(completedPayment.transactionId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isProcessing ? undefined : handleReset}
      title={step === 3 ? 'Payment Confirmed' : title}
      subtitle={
        step === 3
          ? 'Transaction recorded & secured via SERVA Escrow'
          : `Total amount: ৳${Number(amount).toLocaleString()} BDT`
      }
      size="lg"
    >
      <div className="pt-1">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Method & Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-5"
            >
              {/* Order / Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-[#E6F4F2]/50 border border-[#0F766E]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F766E]">
                    Order Summary
                  </span>
                  <h4 className="text-sm font-bold text-[#17211F] mt-0.5">
                    {itemName || purpose}
                  </h4>
                  <p className="text-xs text-[#64716D]">Secured escrow release upon work signoff</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#64716D] block">Payable:</span>
                  <span className="text-xl font-extrabold text-[#0F766E]">
                    ৳{Number(amount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelect={(m) => {
                  setSelectedMethod(m);
                  setError('');
                }}
              />

              {/* Input details depending on selected method */}
              {['bKash', 'Nagad'].includes(selectedMethod) && (
                <div className="space-y-2 pt-2 border-t border-[#E3EAE7]">
                  <label className="text-xs font-semibold text-[#17211F] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#0F766E]" />
                    Your {selectedMethod} Account Number (11 Digits)
                  </label>
                  <input
                    type="tel"
                    maxLength={11}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#E3EAE7] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                  <p className="text-[11px] text-[#64716D]">
                    A secured verification prompt will follow to authorize ৳{amount} BDT.
                  </p>
                </div>
              )}

              {/* Optional note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17211F]">
                  Special Instructions / Reference (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Please call before arriving / Dhanmondi flat 4B"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-[#E3EAE7] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E3EAE7]">
                <Button variant="ghost" size="md" onClick={handleReset}>
                  Cancel
                </Button>
                <Button variant="lime" size="md" onClick={handleNextStep}>
                  Proceed to Payment <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Gateway Simulation (PIN / Card confirmation) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-5"
            >
              {/* Simulated Gateway Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#134E4A] to-[#0F766E] text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#C7F36B]" />
                    <span className="text-xs font-bold tracking-wide uppercase text-teal-100">
                      {selectedMethod} Payment Gateway
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-white/20 px-2 py-0.5 rounded">
                    SSL 256-Bit
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-xs text-teal-200">Total Deductible:</span>
                  <span className="text-2xl font-black text-[#C7F36B]">
                    ৳{Number(amount).toLocaleString()} BDT
                  </span>
                </div>
              </div>

              {/* Form depending on method */}
              {['bKash', 'Nagad'].includes(selectedMethod) ? (
                <div className="space-y-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-600">
                    <span>Account:</span>
                    <strong className="text-gray-900 font-mono">{phoneNumber}</strong>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Enter {selectedMethod} 5-digit PIN (Demo Simulation):
                    </label>
                    <input
                      type="password"
                      maxLength={5}
                      value={pinNumber}
                      onChange={(e) => setPinNumber(e.target.value)}
                      placeholder="•••••"
                      className="w-full text-center tracking-widest text-lg font-mono px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                    />
                    <p className="text-[10px] text-gray-500 text-center mt-1">
                      (Development Mode: Any 5 digits will confirm the transaction securely)
                    </p>
                  </div>
                </div>
              ) : selectedMethod === 'SSLCommerz' ? (
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4123 •••• •••• 9821"
                      className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full font-mono text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full font-mono text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Cash on delivery notice */
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <h5 className="font-bold">Pay Upon Completion</h5>
                  <p>
                    Your booking will be reserved. Please pay ৳{amount} directly to the provider once
                    the job checklist is fulfilled and approved in SERVA ProofBox.
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E3EAE7]">
                <Button
                  variant="ghost"
                  size="md"
                  disabled={isProcessing}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isProcessing}
                  onClick={handleProcessPayment}
                  className="bg-[#0F766E] hover:bg-[#134E4A]"
                >
                  Confirm & Pay ৳{Number(amount).toLocaleString()} BDT
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Success & Digital Receipt */}
          {step === 3 && completedPayment && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 text-center py-2"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Payment Authorized
                </span>
                <h3 className="text-xl font-bold text-[#17211F] mt-2">
                  ৳{Number(completedPayment.amount).toLocaleString()} BDT
                </h3>
                <p className="text-xs text-[#64716D] mt-1">
                  Protected under SERVA ProofBox™ Escrow Guarantee
                </p>
              </div>

              {/* Digital Receipt Card */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-500">Transaction ID:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-gray-900">
                    <span>{completedPayment.transactionId}</span>
                    <button
                      onClick={copyTxn}
                      className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500"
                      title="Copy ID"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copied && <span className="text-[10px] text-teal-600 font-sans">Copied!</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Gateway:</span>
                  <span className="font-semibold text-gray-800">
                    {completedPayment.paymentMethod}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Purpose:</span>
                  <span className="font-semibold text-gray-800">{completedPayment.purpose}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {completedPayment.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400">
                  <span>Timestamp:</span>
                  <span>{new Date(completedPayment.createdAt).toLocaleString()}</span>
                </div>
              </div>

              {/* Close / Done */}
              <div className="pt-2">
                <Button variant="lime" size="md" className="w-full" onClick={handleReset}>
                  Done & Return
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};

export default PaymentCheckoutModal;

