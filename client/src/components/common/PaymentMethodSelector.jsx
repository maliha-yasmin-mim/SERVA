import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CreditCard, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';

const paymentOptions = [
  {
    id: 'bKash',
    name: 'bKash',
    type: 'Mobile Financial Service',
    description: 'Instant mobile transfer with 0% gateway fee',
    bgLight: 'bg-[#E2136E]/10',
    borderActive: 'border-[#E2136E]',
    textColor: 'text-[#E2136E]',
    badgeBg: 'bg-[#E2136E]',
    icon: Smartphone,
    popular: true
  },
  {
    id: 'Nagad',
    name: 'Nagad',
    type: 'Postal MFS',
    description: 'Fast payout via Nagad personal / merchant',
    bgLight: 'bg-[#F7941D]/10',
    borderActive: 'border-[#F7941D]',
    textColor: 'text-[#F7941D]',
    badgeBg: 'bg-[#F7941D]',
    icon: Smartphone,
    popular: false
  },
  {
    id: 'SSLCommerz',
    name: 'Debit / Credit Card',
    type: 'Visa, Mastercard & Amex',
    description: 'Secure SSL-encrypted gateway by SSLCommerz',
    bgLight: 'bg-blue-50',
    borderActive: 'border-blue-600',
    textColor: 'text-blue-700',
    badgeBg: 'bg-blue-600',
    icon: CreditCard,
    popular: false
  },
  {
    id: 'Cash on Delivery',
    name: 'Pay Upon Completion (COD)',
    type: 'Cash or Direct Handover',
    description: 'Pay directly after service verification or product pickup',
    bgLight: 'bg-emerald-50',
    borderActive: 'border-emerald-600',
    textColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-600',
    icon: Banknote,
    popular: false
  }
];

const PaymentMethodSelector = ({ selectedMethod, onSelect, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#64716D]">
          Select Payment Gateway
        </label>
        <span className="text-[11px] text-teal-700 font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure & Escrow Protected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentOptions.map((opt) => {
          const isSelected = selectedMethod === opt.id;
          const Icon = opt.icon;

          return (
            <motion.div
              key={opt.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelect(opt.id)}
              className={`relative cursor-pointer p-3.5 rounded-2xl border transition-all ${
                isSelected
                  ? `${opt.borderActive} ${opt.bgLight} shadow-sm ring-1 ring-offset-0 ${opt.borderActive}`
                  : 'border-[#E3EAE7] bg-white hover:border-[#CBD5D1] hover:bg-[#F7F9F8]'
              }`}
            >
              {opt.popular && (
                <span className="absolute -top-2 right-3 text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E2136E] text-white tracking-wider shadow-xs">
                  Most Popular
                </span>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? opt.badgeBg + ' text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#17211F]">{opt.name}</h4>
                    {isSelected && (
                      <CheckCircle2 className={`w-4 h-4 ${opt.textColor} shrink-0 ml-1`} />
                    )}
                  </div>
                  <p className="text-[11px] font-medium text-gray-500 mt-0.5">{opt.type}</p>
                  <p className="text-[10px] text-[#64716D] mt-1 leading-snug line-clamp-2">
                    {opt.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
