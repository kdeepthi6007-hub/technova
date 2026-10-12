// Unit Tests for Core Financial & Marketplace Calculations in Farm2Pay AI
import { describe, it, expect } from 'vitest';
import { calculateEMI, calculateLoanMetrics } from '../utils/loanCalculations';
import { calculateNetCropProceeds, calculateEquipmentRentalCost } from '../utils/marketplaceCalculations';
import { 
  calculateFinancialSummary, 
  calculateBudgetStatuses, 
  calculateMonthlyTrends 
} from '../utils/financialCalculations';
import { LoanOffer, FinancialTransaction, CategoryBudget } from '../types';

describe('Loan Calculations Engine', () => {
  it('calculates standard positive interest EMI accurately using amortizing formula', () => {
    // Principal: ₹1,00,000, Annual Rate: 12%, Tenure: 12 months
    // Monthly rate r = 0.01, (1+r)^12 = 1.12682503
    // EMI = 100000 * 0.01 * 1.12682503 / 0.12682503 = ~8884.88
    const emi = calculateEMI(100000, 12, 12);
    expect(emi).toBe(8884.88);
  });

  it('calculates 7% KCC loan EMI correctly for ₹2,00,000 over 24 months', () => {
    const emi = calculateEMI(200000, 7, 24);
    // Standard amortization for 200,000 at 7% for 24 months is ~8954.00
    expect(emi).toBeGreaterThan(8900);
    expect(emi).toBeLessThan(9000);
  });

  it('handles zero-interest loan properly without division by zero', () => {
    // Principal: ₹60,000, Rate: 0%, Tenure: 6 months => EMI = 10,000
    const emi = calculateEMI(60000, 0, 6);
    expect(emi).toBe(10000);
  });

  it('handles invalid or zero repayment tenure safely without NaN or infinite loop', () => {
    expect(calculateEMI(100000, 10, 0)).toBe(0);
    expect(calculateEMI(100000, 10, -5)).toBe(0);
    expect(calculateEMI(0, 10, 12)).toBe(0);
  });

  it('calculates complete loan metrics, net disbursed amount, and total borrowing cost', () => {
    const sampleOffer: LoanOffer = {
      id: 'loan-test-1',
      lenderName: 'Kisan Gramin Vikas Bank',
      loanProductName: 'Crop Production Credit',
      principalAmount: 100000,
      annualInterestRate: 10,
      interestType: 'Fixed',
      calculationMethod: 'Reducing Balance',
      tenureMonths: 12,
      repaymentFrequency: 'Monthly',
      processingFee: 1500,
      otherUpfrontFees: 500,
      insuranceCharges: 1000,
      latePenaltyPercent: 2.0,
      prepaymentChargesPercent: 1.0,
      gracePeriodMonths: 1,
      collateralRequired: false,
      sourceOfOffer: 'Bank Portal',
      verificationStatus: 'Verified Bank Partner',
      isSimulatedDemo: true
    };

    const metrics = calculateLoanMetrics(sampleOffer);

    // Upfront deductions = 1500 + 500 + 1000 = 3000
    expect(metrics.upfrontDeductions).toBe(3000);

    // Net disbursed = 100,000 - 3,000 = 97,000
    expect(metrics.estimatedNetDisbursed).toBe(97000);

    // Monthly EMI > 8000
    expect(metrics.monthlyEmi).toBeGreaterThan(8000);

    // Total scheduled repayment = monthlyEmi * 12
    expect(metrics.totalScheduledRepayment).toBe(Number((metrics.monthlyEmi * 12).toFixed(2)));

    // Total interest = totalScheduledRepayment - 100000
    expect(metrics.totalScheduledInterest).toBe(Number((metrics.totalScheduledRepayment - 100000).toFixed(2)));

    // Total borrowing cost = totalScheduledInterest + upfrontDeductions
    expect(metrics.estimatedTotalBorrowingCost).toBe(Number((metrics.totalScheduledInterest + 3000).toFixed(2)));
  });
});

describe('Crop Marketplace Net Proceeds Calculation', () => {
  it('calculates net proceeds: Accepted crop value - Transport costs - Disclosed charges', () => {
    // 50 quintals offered at ₹2,400/quintal
    // Transport cost: ₹3,500
    // Disclosed charges (mandi cess, loading): ₹1,500
    // Gross = 50 * 2400 = ₹1,20,000
    // Net proceeds = 1,20,000 - 3,500 - 1,500 = ₹1,15,000
    // Net proceeds per unit = 115000 / 50 = ₹2,300/quintal
    const result = calculateNetCropProceeds(2400, 50, 3500, 1500, 2200);

    expect(result.grossCropValue).toBe(120000);
    expect(result.transportCost).toBe(3500);
    expect(result.disclosedCharges).toBe(1500);
    expect(result.estimatedNetProceeds).toBe(115000);
    expect(result.netProceedsPerUnit).toBe(2300);
    expect(result.priceDeltaVsExpected).toBe(100); // 2300 - 2200 expected
  });
});

describe('Equipment Rental Calculation', () => {
  it('calculates rental cost: (Rental rate * duration) + Disclosed fees', () => {
    // Tractor rental: ₹800/hour for 8 hours + ₹500 operator fee
    // Base = 800 * 8 = 6400
    // Total expense = 6400 + 500 = 6900
    // Deposit: ₹2,000 refundable
    // Total cash outflow = 6900 + 2000 = 8900
    const result = calculateEquipmentRentalCost(800, 8, 500, 2000);

    expect(result.baseRentalCost).toBe(6400);
    expect(result.netRentalExpense).toBe(6900);
    expect(result.depositAmount).toBe(2000);
    expect(result.totalEstimatedOutflow).toBe(8900);
  });
});

describe('Farm Financials & Expense Management', () => {
  const mockTransactions: FinancialTransaction[] = [
    {
      id: 'tx-1',
      userId: 'farmer-1',
      type: 'income',
      amount: 150000,
      category: 'Crop Sales',
      date: '2026-09-15',
      description: 'Samba Paddy Sale',
      paymentMethod: 'Bank Transfer',
      createdAt: '2026-09-15T10:00:00Z'
    },
    {
      id: 'tx-2',
      userId: 'farmer-1',
      type: 'expense',
      amount: 25000,
      category: 'Seeds',
      date: '2026-09-18',
      description: 'Certified seeds',
      paymentMethod: 'Cash',
      createdAt: '2026-09-18T10:00:00Z'
    },
    {
      id: 'tx-3',
      userId: 'farmer-1',
      type: 'expense',
      amount: 35000,
      category: 'Fertilizers',
      date: '2026-10-02',
      description: 'Complex fertilizers',
      paymentMethod: 'UPI',
      createdAt: '2026-10-02T10:00:00Z'
    }
  ];

  it('calculates total income, expenses, net profit, and profit margin accurately', () => {
    const summary = calculateFinancialSummary(mockTransactions);

    // Total income: 1,50,000
    // Total expense: 25,000 + 35,000 = 60,000
    // Net profit: 90,000
    // Margin: 90000 / 150000 * 100 = 60.0%
    expect(summary.totalIncome).toBe(150000);
    expect(summary.totalExpenses).toBe(60000);
    expect(summary.netProfit).toBe(90000);
    expect(summary.profitMarginPercent).toBe(60.0);
  });

  it('aggregates monthly trends without double counting', () => {
    const trends = calculateMonthlyTrends(mockTransactions);
    expect(trends.length).toBe(2); // Sept 2026 & Oct 2026
    
    const sept = trends.find(t => t.monthKey === '2026-09');
    expect(sept?.income).toBe(150000);
    expect(sept?.expenses).toBe(25000);
    expect(sept?.netProfit).toBe(125000);

    const oct = trends.find(t => t.monthKey === '2026-10');
    expect(oct?.income).toBe(0);
    expect(oct?.expenses).toBe(35000);
    expect(oct?.netProfit).toBe(-35000);
  });

  it('evaluates budget thresholds and triggers warnings and over-budget flags', () => {
    const mockBudgets: CategoryBudget[] = [
      {
        id: 'b-1',
        userId: 'farmer-1',
        category: 'Seeds',
        budgetAmount: 30000,
        period: 'Kharif 2026',
        warningThresholdPercent: 80 // 25,000 / 30,000 = 83.3% => triggers warning
      },
      {
        id: 'b-2',
        userId: 'farmer-1',
        category: 'Fertilizers',
        budgetAmount: 30000,
        period: 'Kharif 2026',
        warningThresholdPercent: 80 // 35,000 / 30,000 = 116.7% => exceeded
      }
    ];

    const statuses = calculateBudgetStatuses(mockTransactions, mockBudgets);
    const seedsStatus = statuses.find(s => s.category === 'Seeds')!;
    const fertStatus = statuses.find(s => s.category === 'Fertilizers')!;

    expect(seedsStatus.spentAmount).toBe(25000);
    expect(seedsStatus.remainingAmount).toBe(5000);
    expect(seedsStatus.isWarning).toBe(true);
    expect(seedsStatus.isExceeded).toBe(false);

    expect(fertStatus.spentAmount).toBe(35000);
    expect(fertStatus.remainingAmount).toBe(-5000);
    expect(fertStatus.isExceeded).toBe(true);
  });
});
