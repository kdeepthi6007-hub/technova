// Modal Form to Add New Agricultural Loan Offers for Transparent Comparison

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { InterestType, LoanVerification } from '../../types';
import { calculateEMI } from '../../utils/loanCalculations';
import { formatINR } from '../../utils/formatters';

interface NewLoanOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLoanOfferModal: React.FC<NewLoanOfferModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addLoanOffer } = useApp();

  const [lenderName, setLenderName] = useState('');
  const [loanProductName, setLoanProductName] = useState('');
  const [principalAmount, setPrincipalAmount] = useState<number>(100000);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(7.0);
  const [interestType, setInterestType] = useState<InterestType>('Fixed');
  const [calculationMethod, setCalculationMethod] = useState<'Reducing Balance' | 'Flat Rate'>('Reducing Balance');
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [repaymentFrequency, setRepaymentFrequency] = useState<'Monthly' | 'Quarterly' | 'Seasonal at Harvest'>('Monthly');
  const [processingFee, setProcessingFee] = useState<number>(1000);
  const [otherUpfrontFees, setOtherUpfrontFees] = useState<number>(500);
  const [insuranceCharges, setInsuranceCharges] = useState<number>(600);
  const [latePenaltyPercent, setLatePenaltyPercent] = useState<number>(1.5);
  const [prepaymentChargesPercent, setPrepaymentChargesPercent] = useState<number>(0.0);
  const [gracePeriodMonths, setGracePeriodMonths] = useState<number>(0);
  const [collateralRequired, setCollateralRequired] = useState(false);
  const [collateralDetails, setCollateralDetails] = useState('');
  const [sourceOfOffer, setSourceOfOffer] = useState('Bank Lead Portal');
  const [verificationStatus, setVerificationStatus] = useState<LoanVerification>('Verified Bank Partner');

  // Preview EMI calculation live
  const previewEmi = calculateEMI(principalAmount, annualInterestRate, tenureMonths);
  const upfrontDeductions = processingFee + otherUpfrontFees + insuranceCharges;
  const netDisbursed = Math.max(0, principalAmount - upfrontDeductions);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lenderName.trim() || !loanProductName.trim()) return;

    addLoanOffer({
      lenderName,
      loanProductName,
      principalAmount: Number(principalAmount),
      annualInterestRate: Number(annualInterestRate),
      interestType,
      calculationMethod,
      tenureMonths: Number(tenureMonths),
      repaymentFrequency,
      processingFee: Number(processingFee),
      otherUpfrontFees: Number(otherUpfrontFees),
      insuranceCharges: Number(insuranceCharges),
      latePenaltyPercent: Number(latePenaltyPercent),
      prepaymentChargesPercent: Number(prepaymentChargesPercent),
      gracePeriodMonths: Number(gracePeriodMonths),
      collateralRequired,
      collateralDetails: collateralRequired ? collateralDetails : undefined,
      sourceOfOffer,
      verificationStatus,
      isSimulatedDemo: true,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Loan Offer for Side-by-Side Audit"
      subtitle="The engine will audit upfront deductions, true amortizing EMI, and hidden penal charges."
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bank / Lender Name</label>
            <input
              type="text"
              required
              placeholder="e.g. State Bank of India / Kaveri Gramin Bank"
              value={lenderName}
              onChange={(e) => setLenderName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Loan Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. KCC Gold Agri Card / Tractor Term Loan"
              value={loanProductName}
              onChange={(e) => setLoanProductName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Principal Amount (₹)</label>
            <input
              type="number"
              required
              min="1000"
              value={principalAmount}
              onChange={(e) => setPrincipalAmount(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Annual Interest Rate (%)</label>
            <input
              type="number"
              step="0.01"
              required
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-extrabold text-farm-800"
            />
            <span className="text-[10px] text-slate-400">Enter 0 for government interest subvention schemes.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Interest Type</label>
            <select
              value={interestType}
              onChange={(e) => setInterestType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Fixed">Fixed Rate (Predetermined)</option>
              <option value="Floating">Floating Rate (Subject to RBI Repo Changes)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Repayment Tenure (Months)</label>
            <input
              type="number"
              required
              min="1"
              value={tenureMonths}
              onChange={(e) => setTenureMonths(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Processing Fee (₹)</label>
            <input
              type="number"
              value={processingFee}
              onChange={(e) => setProcessingFee(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Documentation & Other Fees (₹)</label>
            <input
              type="number"
              value={otherUpfrontFees}
              onChange={(e) => setOtherUpfrontFees(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop / Machinery Insurance (₹)</label>
            <input
              type="number"
              value={insuranceCharges}
              onChange={(e) => setInsuranceCharges(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Verification Status</label>
            <select
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
            >
              <option value="Verified Bank Partner">Verified Bank / Lead Partner</option>
              <option value="Sample / Demo Offer">Sample / Demo Offer</option>
              <option value="Unverified Private">Unverified Private Creditor (Flags Warnings)</option>
            </select>
          </div>
        </div>

        {/* Live Calculation Preview Banner */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs">
          <span className="text-[10px] font-bold text-earth-800 uppercase tracking-wider block mb-2">
            Real-Time Mathematical Audit Preview:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="text-slate-500">Monthly EMI:</span>
              <div className="text-base font-extrabold text-slate-900">{formatINR(previewEmi)}/mo</div>
            </div>
            <div>
              <span className="text-slate-500">Upfront Deductions:</span>
              <div className="text-base font-extrabold text-red-700">-{formatINR(upfrontDeductions)}</div>
            </div>
            <div>
              <span className="text-slate-500">Net Disbursed to Bank:</span>
              <div className="text-base font-extrabold text-farm-800">{formatINR(netDisbursed)}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-farm-700 hover:bg-farm-800 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            Add to Loan Comparison Matrix
          </button>
        </div>
      </form>
    </Modal>
  );
};
