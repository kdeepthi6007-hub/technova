// Transparent Agricultural Loan Calculation Engine & Risk Auditing

import { LoanOffer, LoanCalculatedMetrics } from '../types';

/**
 * Calculates standard monthly EMI for an amortizing loan.
 * Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * Special case: Zero-interest loan: EMI = P / n
 * Handles invalid tenure (<= 0) safely by returning 0.
 */
export function calculateEMI(principal: number, annualInterestRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0 || isNaN(principal) || isNaN(tenureMonths)) {
    return 0;
  }

  // Handle Zero-interest loan
  if (annualInterestRate <= 0 || isNaN(annualInterestRate)) {
    return Number((principal / tenureMonths).toFixed(2));
  }

  const monthlyRate = (annualInterestRate / 100) / 12;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  
  if (factor === 1 || isNaN(factor)) {
    return Number((principal / tenureMonths).toFixed(2));
  }

  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Number(emi.toFixed(2));
}

/**
 * Calculates all scheduled metrics, net disbursed amounts, borrowing cost, and risk flags
 */
export function calculateLoanMetrics(offer: LoanOffer): LoanCalculatedMetrics {
  const principal = Number(offer.principalAmount) || 0;
  const annualRate = Number(offer.annualInterestRate) || 0;
  const tenure = Number(offer.tenureMonths) || 1;
  const processingFee = Number(offer.processingFee) || 0;
  const otherFees = Number(offer.otherUpfrontFees) || 0;
  const insurance = Number(offer.insuranceCharges) || 0;

  const monthlyEmi = calculateEMI(principal, annualRate, tenure);
  const totalScheduledRepayment = Number((monthlyEmi * tenure).toFixed(2));
  
  // Total scheduled interest
  const totalScheduledInterest = Math.max(0, Number((totalScheduledRepayment - principal).toFixed(2)));

  // Upfront deductions from disbursement
  const upfrontDeductions = Number((processingFee + otherFees + insurance).toFixed(2));

  // Net amount the farmer actually receives in their bank account
  const estimatedNetDisbursed = Math.max(0, Number((principal - upfrontDeductions).toFixed(2)));

  // Total borrowing cost = All repayments + all upfront fees - original principal
  const estimatedTotalBorrowingCost = Number((totalScheduledInterest + upfrontDeductions).toFixed(2));

  // Perform Risk & Transparency Checks
  const riskFlags: LoanCalculatedMetrics['riskFlags'] = [];
  let transparencyScore = 100;

  if (annualRate <= 0) {
    riskFlags.push({
      id: 'zero_interest_verify',
      severity: 'info',
      title: 'Zero Interest / Subvention Scheme',
      description: 'Ensure this is backed by an official state/central interest subvention scheme (e.g., KCC subvention) before signing.'
    });
  }

  if (!offer.interestType || offer.interestType === 'Floating') {
    riskFlags.push({
      id: 'floating_rate_risk',
      severity: 'warning',
      title: 'Floating Interest Rate',
      description: 'Your monthly EMI or repayment tenure may increase if RBI benchmark repo rates increase in the future.'
    });
    transparencyScore -= 10;
  }

  // Check upfront fee ratio
  if (principal > 0) {
    const feeRatio = (upfrontDeductions / principal) * 100;
    if (feeRatio > 3.0) {
      riskFlags.push({
        id: 'high_upfront_fees',
        severity: 'danger',
        title: `High Upfront Deductions (${feeRatio.toFixed(1)}%)`,
        description: `₹${upfrontDeductions.toLocaleString('en-IN')} will be deducted before you get the money. You will only receive ₹${estimatedNetDisbursed.toLocaleString('en-IN')}.`
      });
      transparencyScore -= 20;
    }
  }

  // Prepayment penalty check
  if (offer.prepaymentChargesPercent > 2.0) {
    riskFlags.push({
      id: 'prepayment_penalty',
      severity: 'warning',
      title: `High Prepayment Penalty (${offer.prepaymentChargesPercent}%)`,
      description: 'If you harvest a bumper crop and want to clear the loan early, you will be charged an extra penalty.'
    });
    transparencyScore -= 10;
  }

  // Late penalty check
  if (offer.latePenaltyPercent > 3.0) {
    riskFlags.push({
      id: 'harsh_late_penalty',
      severity: 'danger',
      title: `Heavy Late Payment Penalty (${offer.latePenaltyPercent}%/mo)`,
      description: 'Crop delays due to unseasonal rain or mandi price drops could lead to severe cascading penalty interest.'
    });
    transparencyScore -= 15;
  }

  // Verification check
  if (offer.verificationStatus === 'Unverified Private') {
    riskFlags.push({
      id: 'unverified_lender',
      severity: 'danger',
      title: 'Unverified Private Lender',
      description: 'This offer is from an unverified private source. Verify NBFC/banking license before pledging land or signing blank cheques.'
    });
    transparencyScore -= 25;
  }

  if (offer.collateralRequired && !offer.collateralDetails) {
    riskFlags.push({
      id: 'vague_collateral',
      severity: 'warning',
      title: 'Unspecified Collateral Terms',
      description: 'Collateral is required, but explicit patta passbook or guarantor requirements are not detailed.'
    });
    transparencyScore -= 10;
  }

  return {
    monthlyEmi,
    totalScheduledRepayment,
    totalScheduledInterest,
    upfrontDeductions,
    estimatedNetDisbursed,
    estimatedTotalBorrowingCost,
    riskFlags,
    transparencyScore: Math.max(20, Math.min(100, transparencyScore))
  };
}

/**
 * Clear, plain-language explanations of agricultural fintech terms
 */
export const FINANCIAL_TERMS_EXPLANATIONS: Record<string, { term: string; simple: string; farmerTip: string }> = {
  principal: {
    term: 'Principal Amount (அசல்)',
    simple: 'The exact sum of money you borrow from the bank or lender.',
    farmerTip: 'Only borrow what is directly needed for crop inputs or equipment. Don’t borrow excess for speculation.'
  },
  interestRate: {
    term: 'Annual Interest Rate (வட்டி விகிதம்)',
    simple: 'The percentage charged every year on the money you borrowed.',
    farmerTip: 'A 7% KCC loan with 3% prompt repayment subvention effectively becomes 4% net interest!'
  },
  emi: {
    term: 'Equated Monthly Installment - EMI (மாதத் தவணை)',
    simple: 'The fixed monthly payment that includes a portion of principal and a portion of interest.',
    farmerTip: 'Make sure your monthly milk, poultry, or vegetable cash flow can comfortably cover the EMI without waiting for seasonal harvest.'
  },
  processingFee: {
    term: 'Processing Fee (செயலாக்கக் கட்டணம்)',
    simple: 'A one-time fee charged by the lender to verify documents and approve the loan.',
    farmerTip: 'Ask whether this is deducted upfront from your loan or paid by cash. Many PSB agricultural loans waive this fee.'
  },
  totalRepayment: {
    term: 'Total Scheduled Repayment (மொத்த திருப்பிச் செலுத்துதல்)',
    simple: 'The total money you give back over the entire loan life (Principal + Total Interest).',
    farmerTip: 'Always compare total repayment across loans, not just the monthly EMI.'
  },
  collateral: {
    term: 'Collateral / Security (ஈட்டு / பிணை)',
    simple: 'An asset (like agricultural land patta, gold, or tractor hypothecation) pledged to secure the loan.',
    farmerTip: 'Never pledge prime agricultural land for unsecured high-interest private credit.'
  },
  moratorium: {
    term: 'Moratorium / Grace Period (சலுகைக் காலம்)',
    simple: 'A holiday period where you do not need to make principal repayments (often until crop harvest).',
    farmerTip: 'Remember that interest often continues to accumulate during the moratorium unless subsidized.'
  },
  latePenalty: {
    term: 'Late-Payment Penalty (தாமத அபராதக் கட்டணம்)',
    simple: 'Extra percentage charged if an installment date is missed.',
    farmerTip: 'Inform your bank branch in writing before harvest delays to seek loan renewal instead of default.'
  },
  prepaymentCharge: {
    term: 'Prepayment / Foreclosure Charge (முன்கூட்டியே செலுத்தும் கட்டணம்)',
    simple: 'Fee charged if you clear off the entire loan balance earlier than the scheduled tenure.',
    farmerTip: 'RBI rules prohibit foreclosure charges on floating-rate individual agricultural and MSME term loans.'
  }
};
