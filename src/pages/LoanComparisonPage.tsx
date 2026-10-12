// Module Three: AI Loan Comparison Assistant, Transparent EMI Engine & Risk Audit Matrix

import React, { useState } from 'react';
import { 
  Landmark, 
  Plus, 
  HelpCircle, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Trash2, 
  Edit3, 
  ArrowUpDown, 
  Sparkles, 
  Info,
  DollarSign,
  Layers,
  Search,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { LoanOffer, LoanCalculatedMetrics } from '../types';
import { formatINR, formatPercent } from '../utils/formatters';
import { calculateLoanMetrics, calculateEMI } from '../utils/loanCalculations';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { FinancialGlossaryModal } from '../components/common/FinancialGlossaryModal';

interface LoanComparisonPageProps {
  onOpenNewLoanModal: () => void;
  onNavigate: (page: string) => void;
}

export const LoanComparisonPage: React.FC<LoanComparisonPageProps> = ({
  onOpenNewLoanModal,
  onNavigate,
}) => {
  const { loanOffers, deleteLoanOffer, duplicateLoanOffer, editLoanOffer } = useApp();
  const { t } = useLanguage();

  // State
  const [sortBy, setSortBy] = useState<'lowest_cost' | 'lowest_emi' | 'lowest_repayment' | 'lowest_fees'>('lowest_cost');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<LoanOffer | null>(null);
  const [deletingLoanId, setDeletingLoanId] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<LoanOffer | null>(null);

  // Calculate metrics for all offers
  const analyzedOffers = loanOffers.map(offer => ({
    offer,
    metrics: calculateLoanMetrics(offer),
  })).sort((a, b) => {
    if (sortBy === 'lowest_cost') return a.metrics.estimatedTotalBorrowingCost - b.metrics.estimatedTotalBorrowingCost;
    if (sortBy === 'lowest_emi') return a.metrics.monthlyEmi - b.metrics.monthlyEmi;
    if (sortBy === 'lowest_repayment') return a.metrics.totalScheduledRepayment - b.metrics.totalScheduledRepayment;
    if (sortBy === 'lowest_fees') return a.metrics.upfrontDeductions - b.metrics.upfrontDeductions;
    return 0;
  });

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoan) return;
    editLoanOffer(editingLoan);
    setEditingLoan(null);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Module 3: Transparent Credit Engine
            </span>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-md border border-amber-200">
              Zero Hidden Fees Audit
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Agricultural Loan Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Compare KCC crop loans and equipment credit using exact amortizing EMI formulas. Uncover upfront deductions and floating rate risks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <HelpCircle className="w-4 h-4 text-farm-600" />
            <span>9 Key Terms Explained</span>
          </button>

          <button
            onClick={onOpenNewLoanModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-farm-700 hover:bg-farm-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Loan Offer</span>
          </button>
        </div>
      </div>

      {/* Educational Banner: Lowest EMI != Cheapest Loan */}
      <div className="p-4 bg-cream-100/90 rounded-2xl border border-cream-200 flex items-start gap-3">
        <Info className="w-5 h-5 text-earth-700 shrink-0 mt-0.5" />
        <div className="text-xs text-earth-900 leading-relaxed">
          <strong>Crucial Farmer Advisory: </strong>
          A loan with the <em>lowest monthly EMI</em> is <strong>NOT</strong> always the cheapest! 
          Longer repayment tenures stretch out monthly installments while substantially inflating total interest outgo. 
          Always compare by <strong>Total Borrowing Cost</strong> and check the <strong>Net Disbursed Amount</strong>.
        </div>
      </div>

      {/* Sorting Controls & Stats Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-700">
          Comparing <span className="text-farm-700 font-extrabold">{analyzedOffers.length}</span> Active Loan Offers
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Sort Matrix:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-farm-500/20 w-full sm:w-auto"
          >
            <option value="lowest_cost">🏆 Lowest Total Borrowing Cost</option>
            <option value="lowest_emi">Lowest Monthly EMI</option>
            <option value="lowest_repayment">Lowest Total Repayment</option>
            <option value="lowest_fees">Lowest Upfront Deductions</option>
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {analyzedOffers.map(({ offer, metrics }, index) => {
          const isBestValue = index === 0 && sortBy === 'lowest_cost';

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-xs flex flex-col justify-between relative ${
                isBestValue
                  ? 'border-farm-600 shadow-md ring-2 ring-farm-600/10'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {isBestValue && (
                <div className="absolute -top-3.5 left-6 bg-farm-700 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Lowest Net Borrowing Cost</span>
                </div>
              )}

              <div>
                {/* Header: Lender & Product */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 leading-snug">
                      {offer.lenderName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {offer.loanProductName}
                    </p>
                  </div>

                  <Badge
                    label={offer.verificationStatus}
                    variant={offer.verificationStatus === 'Verified Bank Partner' ? 'green' : 'amber'}
                    size="sm"
                  />
                </div>

                {/* Primary Numbers Box */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-cream-50/70 rounded-2xl border border-cream-200 mb-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Principal Loan</span>
                    <div className="text-base font-extrabold text-slate-900">
                      {formatINR(offer.principalAmount)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Interest Rate</span>
                    <div className="text-base font-extrabold text-farm-800">
                      {offer.annualInterestRate}%{' '}
                      <span className="text-[10px] font-medium text-slate-500 uppercase">({offer.interestType})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Repayment Tenure</span>
                    <div className="text-base font-extrabold text-slate-900">
                      {offer.tenureMonths} <span className="text-xs font-semibold text-slate-500">months</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Math Breakdown */}
                <div className="space-y-2 text-xs text-slate-700 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">Calculated Monthly EMI:</span>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatINR(metrics.monthlyEmi)}
                      <span className="text-xs font-normal text-slate-500">/mo</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">Total Scheduled Repayment:</span>
                    <strong className="text-slate-900">{formatINR(metrics.totalScheduledRepayment)}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-600">Total Scheduled Interest:</span>
                    <strong className="text-slate-900">{formatINR(metrics.totalScheduledInterest)}</strong>
                  </div>

                  <div className="flex items-center justify-between text-amber-900">
                    <span className="font-medium">Upfront Fees & Insurance:</span>
                    <strong>-{formatINR(metrics.upfrontDeductions)}</strong>
                  </div>
                </div>

                {/* Disbursement & Total Cost Summary */}
                <div className="py-3 space-y-2 border-b border-slate-100">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-950 uppercase text-[10px] block">
                        Estimated Net Disbursed:
                      </span>
                      <span className="text-[10px] text-emerald-700">Money credited to bank account</span>
                    </div>
                    <span className="text-base font-extrabold text-emerald-900">
                      {formatINR(metrics.estimatedNetDisbursed)}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 uppercase text-[10px] block">
                        Total Borrowing Outgo:
                      </span>
                      <span className="text-[10px] text-slate-500">Interest + all fees</span>
                    </div>
                    <span className="text-base font-extrabold text-slate-900">
                      {formatINR(metrics.estimatedTotalBorrowingCost)}
                    </span>
                  </div>
                </div>

                {/* Risk and Transparency Audit Flags */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Audit Flags ({metrics.riskFlags.length})
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      Score: <strong className={metrics.transparencyScore >= 80 ? 'text-farm-700' : 'text-amber-700'}>{metrics.transparencyScore}/100</strong>
                    </span>
                  </div>

                  {metrics.riskFlags.map((flag) => (
                    <div
                      key={flag.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-start gap-2 ${
                        flag.severity === 'danger'
                          ? 'bg-red-50 text-red-900 border-red-200'
                          : flag.severity === 'warning'
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : 'bg-blue-50 text-blue-900 border-blue-200'
                      }`}
                    >
                      {flag.severity === 'danger' ? (
                        <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-[11px]">{flag.title}</div>
                        <p className="text-[10px] leading-tight mt-0.5 opacity-90">{flag.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {offer.collateralDetails && (
                  <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong>Collateral Terms: </strong>{offer.collateralDetails}
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => duplicateLoanOffer(offer.id)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Duplicate offer to simulate different rates or tenures"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingLoan(offer)}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Edit loan parameters"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeletingLoanId(offer.id)}
                    className="p-2 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete offer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => onNavigate('ai-assistant')}
                  className="px-4 py-2 bg-farm-50 hover:bg-farm-100 text-farm-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-farm-600" />
                  <span>Explain Tradeoffs</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Loan Offer Modal */}
      {editingLoan && (
        <Modal
          isOpen={!!editingLoan}
          onClose={() => setEditingLoan(null)}
          title="Edit Loan Parameters"
          subtitle="Recalculates amortization, EMI, and transparency scores immediately."
          maxWidth="2xl"
        >
          <form onSubmit={handleEditSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lender / Bank Name</label>
                <input
                  type="text"
                  required
                  value={editingLoan.lenderName}
                  onChange={(e) => setEditingLoan({ ...editingLoan, lenderName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Loan Product Name</label>
                <input
                  type="text"
                  required
                  value={editingLoan.loanProductName}
                  onChange={(e) => setEditingLoan({ ...editingLoan, loanProductName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Principal Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={editingLoan.principalAmount}
                  onChange={(e) => setEditingLoan({ ...editingLoan, principalAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={editingLoan.annualInterestRate}
                  onChange={(e) => setEditingLoan({ ...editingLoan, annualInterestRate: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tenure (Months)</label>
                <input
                  type="number"
                  required
                  value={editingLoan.tenureMonths}
                  onChange={(e) => setEditingLoan({ ...editingLoan, tenureMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Processing Fee (₹)</label>
                <input
                  type="number"
                  value={editingLoan.processingFee}
                  onChange={(e) => setEditingLoan({ ...editingLoan, processingFee: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingLoan(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingLoanId}
        title="Remove Loan Offer?"
        message="Are you sure you want to remove this loan offer from the comparison matrix?"
        confirmLabel="Remove Offer"
        isDestructive={true}
        onConfirm={() => {
          if (deletingLoanId) {
            deleteLoanOffer(deletingLoanId);
            setDeletingLoanId(null);
          }
        }}
        onCancel={() => setDeletingLoanId(null)}
      />

      {/* Financial Terms Glossary Modal */}
      <FinancialGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

    </div>
  );
};
