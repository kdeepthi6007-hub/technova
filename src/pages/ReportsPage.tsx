// Module: Financial Reports, Seasonal Audits & Printable Export Center

import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  FileText,
  Wheat,
  Landmark,
  Wrench
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatINR, formatDate, formatPercent } from '../utils/formatters';
import { 
  calculateFinancialSummary, 
  calculateMonthlyTrends, 
  calculateCategoryExpenses, 
  calculateBudgetStatuses 
} from '../utils/financialCalculations';
import { calculateLoanMetrics } from '../utils/loanCalculations';

export const ReportsPage: React.FC = () => {
  const { transactions, budgets, loanOffers, crops, cropOffers, bookings, currentUser } = useApp();
  const { t } = useLanguage();

  const [seasonFilter, setSeasonFilter] = useState<'All' | 'Samba 2026' | 'Kuruvai 2026'>('All');

  const summary = calculateFinancialSummary(transactions);
  const monthly = calculateMonthlyTrends(transactions);
  const categories = calculateCategoryExpenses(transactions);
  const budgetsList = calculateBudgetStatuses(transactions, budgets);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Category', 'Type', 'Amount (INR)', 'Date', 'Description', 'Payment Method'];
    const rows = transactions.map(t => [
      `"${t.category}"`,
      t.type.toUpperCase(),
      t.amount,
      t.date,
      `"${t.description}"`,
      t.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Farm2Pay_Financial_Statement_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner (Hidden on Print) */}
      <div className="no-print bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Audit & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Farm Financial & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate formal statements for bank loans, Kisan Credit Card renewals, or cooperative audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Formal Printable Farm Statement Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Statement Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              FARM2PAY AI — FARM FINANCIAL AUDIT REPORT
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Verified Operational & Financial Balance Sheet
            </p>
          </div>

          <div className="text-right text-xs text-slate-600">
            <p><strong>Farmer Name:</strong> {currentUser?.name || 'Farmer Producer'}</p>
            <p><strong>Location:</strong> {currentUser?.village || 'Thiruvaiyaru'}, {currentUser?.district || 'Thanjavur'}, {currentUser?.state || 'Tamil Nadu'}</p>
            <p><strong>Statement Date:</strong> {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Section 1: Executive Financial Summary */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-3">
            1. Executive Financial Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Inflows</span>
              <div className="text-lg font-black text-emerald-800 mt-1">{formatINR(summary.totalIncome)}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Outflows</span>
              <div className="text-lg font-black text-amber-800 mt-1">{formatINR(summary.totalExpenses)}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Net Operating Profit</span>
              <div className="text-lg font-black text-slate-900 mt-1">{formatINR(summary.netProfit)}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Profit Margin</span>
              <div className="text-lg font-black text-farm-800 mt-1">{summary.profitMarginPercent}%</div>
            </div>
          </div>
        </div>

        {/* Section 2: Category Expense Breakdown Table */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-3">
            2. Seasonal Expenditure by Category & Budget Limits
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Expense Category</th>
                <th className="p-3 text-right">Actual Spent</th>
                <th className="p-3 text-right">Budget Allocation</th>
                <th className="p-3 text-right">% Consumed</th>
                <th className="p-3 text-right">Budget Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgetsList.map((b) => (
                <tr key={b.category} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800">{b.category}</td>
                  <td className="p-3 text-right font-bold text-slate-900">{formatINR(b.spentAmount)}</td>
                  <td className="p-3 text-right text-slate-600">{formatINR(b.budgetAmount)}</td>
                  <td className="p-3 text-right font-semibold">{b.percentageConsumed}%</td>
                  <td className={`p-3 text-right font-bold ${b.remainingAmount < 0 ? 'text-red-700' : 'text-farm-700'}`}>
                    {b.remainingAmount >= 0 ? `+${formatINR(b.remainingAmount)}` : `-${formatINR(Math.abs(b.remainingAmount))}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Monthly Inflows & Outflows */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-3">
            3. Monthly Cash Flow Progression
          </h3>
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3">Period / Month</th>
                <th className="p-3 text-right">Recorded Sales Inflow</th>
                <th className="p-3 text-right">Recorded Input Outflow</th>
                <th className="p-3 text-right">Net Monthly Surplus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthly.map((m) => (
                <tr key={m.monthKey} className="hover:bg-slate-50/50">
                  <td className="p-3 font-semibold text-slate-800">{m.monthLabel}</td>
                  <td className="p-3 text-right font-bold text-emerald-800">{formatINR(m.income)}</td>
                  <td className="p-3 text-right font-bold text-amber-800">{formatINR(m.expenses)}</td>
                  <td className="p-3 text-right font-extrabold text-slate-900">{formatINR(m.netProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Loan Comparison Snapshot */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-3">
            4. Credit Offer Audit Summary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {loanOffers.slice(0, 2).map((loan) => {
              const metrics = calculateLoanMetrics(loan);
              return (
                <div key={loan.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <div className="font-bold text-slate-900">{loan.lenderName}</div>
                  <p className="text-[11px] text-slate-500">{loan.loanProductName}</p>
                  <div className="pt-2 flex justify-between">
                    <span>Principal: <strong>{formatINR(loan.principalAmount)}</strong></span>
                    <span>Rate: <strong>{loan.annualInterestRate}%</strong></span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly EMI: <strong>{formatINR(metrics.monthlyEmi)}</strong></span>
                    <span>Net Disbursed: <strong>{formatINR(metrics.estimatedNetDisbursed)}</strong></span>
                  </div>
                  <div className="pt-1 text-[10px] text-farm-800 font-bold">
                    Transparency Score: {metrics.transparencyScore}/100
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Signatures & Certification */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
          <div>
            <p>Generated by Farm2Pay AI Decision Support System.</p>
            <p>All numbers calculated deterministically from active ledger records.</p>
          </div>
          <div className="text-right">
            <div className="border-b border-slate-400 w-44 mb-1"></div>
            <span>Farmer Signature / Seal</span>
          </div>
        </div>

      </div>

    </div>
  );
};
