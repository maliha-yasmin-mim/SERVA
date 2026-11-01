import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import paymentService from '../../services/paymentService';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import {
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Clock,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Download,
  AlertCircle,
  Unlock,
  DollarSign
} from 'lucide-react';

const PaymentHistoryPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-payments', selectedStatus, page],
    queryFn: () => paymentService.getMyPayments({ status: selectedStatus, page, limit: 10 }),
    keepPreviousData: true
  });

  const releaseEscrowMutation = useMutation({
    mutationFn: (paymentId) => paymentService.releaseEscrow(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['my-payments']);
    }
  });

  const payments = data?.payments || [];
  const summary = data?.summary || { totalSpent: 0, totalEarned: 0, totalTransactions: 0 };
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'bKash':
      case 'Nagad':
      case 'Rocket':
        return <Smartphone className="w-4 h-4 text-pink-600" />;
      case 'SSLCommerz':
      case 'Card':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      default:
        return <Banknote className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case 'In Escrow':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> In Escrow
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-[#17211F]">
            My Payments & Transactions
          </h1>
          <p className="text-xs sm:text-sm text-[#64716D] mt-1">
            Track online payments, bKash/Nagad transactions, and SERVA ProofBox escrow funds.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Spent */}
        <div className="p-4 rounded-2xl bg-white border border-[#E3EAE7] shadow-soft">
          <div className="flex items-center justify-between text-xs text-[#64716D]">
            <span>Total Payments Made</span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#17211F] mt-2">
            ৳{summary.totalSpent.toLocaleString()}
          </h3>
          <p className="text-[11px] text-teal-700 mt-1 font-medium">Secured with ProofBox</p>
        </div>

        {/* Total Received */}
        <div className="p-4 rounded-2xl bg-white border border-[#E3EAE7] shadow-soft">
          <div className="flex items-center justify-between text-xs text-[#64716D]">
            <span>Total Payouts Received</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#17211F] mt-2">
            ৳{summary.totalEarned.toLocaleString()}
          </h3>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">From verified services</p>
        </div>

        {/* Protection Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#134E4A] to-[#0F766E] text-white shadow-soft">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C7F36B]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7F36B]">
              Escrow Protection
            </span>
          </div>
          <p className="text-xs text-teal-100 mt-2 leading-relaxed">
            Funds remain secured until you inspect and approve photographic evidence in SERVA ProofBox™.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E3EAE7] pb-3 overflow-x-auto">
        <div className="flex gap-2">
          {['All', 'Completed', 'In Escrow', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setSelectedStatus(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white border border-[#E3EAE7] text-[#64716D] hover:bg-gray-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table */}
      {isLoading ? (
        <div className="py-16">
          <Loader />
        </div>
      ) : payments.length === 0 ? (
        <EmptyState
          title="No transaction records"
          description="You haven't made or received any payments under this status yet."
          icon={CreditCard}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E3EAE7] overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F9F8] border-b border-[#E3EAE7] text-[#64716D] font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Transaction ID</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Purpose / Reference</th>
                  <th className="px-4 py-3.5">Amount (BDT)</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3EAE7]">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-[#F7F9F8]/60 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-[#17211F]">
                      {p.transactionId}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 font-semibold text-[#17211F]">
                        {getMethodIcon(p.paymentMethod)}
                        <span>{p.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="max-w-[200px]">
                        <p className="font-semibold text-[#17211F] truncate">
                          {p.relatedJob?.title ||
                            p.relatedService?.title ||
                            p.relatedProduct?.title ||
                            p.purpose}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{p.purpose}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-extrabold text-sm text-[#0F766E]">
                      ৳{Number(p.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">{getStatusBadge(p.status)}</td>
                    <td className="px-4 py-3.5 text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {p.status === 'In Escrow' ? (
                        <Button
                          variant="lime"
                          size="sm"
                          isLoading={releaseEscrowMutation.isLoading}
                          onClick={() => releaseEscrowMutation.mutate(p._id)}
                          className="text-[11px] py-1 px-2.5"
                        >
                          <Unlock className="w-3 h-3" /> Release
                        </Button>
                      ) : (
                        <span className="text-[11px] text-gray-400">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistoryPage;

