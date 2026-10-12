// Module Four: Unified AI Farmer Dashboard & Decision Support Center

import React from 'react';
import { 
  TrendingUp, 
  ReceiptIndianRupee, 
  Wheat, 
  Wrench, 
  Landmark, 
  Plus, 
  ArrowUpRight, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar,
  ExternalLink
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { formatINR, formatDate, formatPercent } from '../utils/formatters';
import { 
  calculateFinancialSummary, 
  calculateMonthlyTrends, 
  calculateCategoryExpenses, 
  generateExpenseInsights 
} from '../utils/financialCalculations';
import { calculateLoanMetrics } from '../utils/loanCalculations';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onOpenNewTransaction: () => void;
  onOpenNewCropListing: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenNewTransaction,
  onOpenNewCropListing,
}) => {
  const { 
    currentUser, 
    crops, 
    myCrops,
    cropOffers, 
    equipment, 
    bookings, 
    transactions, 
    budgets, 
    loanOffers 
  } = useApp();
  const { t } = useLanguage();

  if (!currentUser) return null;

  // Compute live calculations from actual data
  const finSummary = calculateFinancialSummary(transactions);
  const monthlyTrends = calculateMonthlyTrends(transactions);
  const categoryExpenses = calculateCategoryExpenses(transactions);
  const aiInsights = generateExpenseInsights(transactions, budgets);

  const farmerCrops = myCrops.filter(c => c.status !== 'Archived' && c.status !== 'Deactivated');
  const activeCropsCount = farmerCrops.filter(c => c.status === 'Available').length;
  const pendingOffersCount = cropOffers.filter(o => o.status === 'Offer received' || o.status === 'Inquiry submitted').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'Confirmed' || b.status === 'In transit').length;

  const PIE_COLORS = ['#15803D', '#D97706', '#2563EB', '#9333EA', '#DC2626', '#0D9488'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome & Role Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-farm-700 bg-farm-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {currentUser.role} Dashboard
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {currentUser.village}, {currentUser.district}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Vanakkam, {currentUser.name} 🌾
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time farm financials, market bids, machinery bookings, and loan audits.
          </p>
        </div>

        {/* Quick Primary Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewTransaction}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-farm-700 hover:bg-farm-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Transaction</span>
          </button>

          <button
            onClick={onOpenNewCropListing}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold shadow-2xs transition-all"
          >
            <Wheat className="w-4 h-4 text-farm-600" />
            <span>List Crop</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farm Income"
          value={formatINR(finSummary.totalIncome)}
          subtitle={`${transactions.filter(t => t.type === 'income').length} sales recorded`}
          icon={TrendingUp}
          variant="green"
          onClick={() => onNavigate('expense-tracker')}
        />

        <StatCard
          title="Total Farm Expenses"
          value={formatINR(finSummary.totalExpenses)}
          subtitle={`${transactions.filter(t => t.type === 'expense').length} inputs & bills`}
          icon={ReceiptIndianRupee}
          variant="amber"
          onClick={() => onNavigate('expense-tracker')}
        />

        <StatCard
          title="Net Operating Profit"
          value={formatINR(finSummary.netProfit)}
          subtitle={`Margin: ${formatPercent(finSummary.profitMarginPercent)}`}
          icon={finSummary.netProfit >= 0 ? CheckCircle2 : AlertTriangle}
          variant={finSummary.netProfit >= 0 ? 'green' : 'red'}
          trend={{
            value: `${finSummary.profitMarginPercent}% margin`,
            isPositive: finSummary.netProfit >= 0,
          }}
          onClick={() => onNavigate('expense-tracker')}
        />

        <StatCard
          title="Marketplace Activity"
          value={`${pendingOffersCount} Bids`}
          subtitle={`${activeCropsCount} crops • ${activeBookingsCount} bookings`}
          icon={Wheat}
          variant="blue"
          onClick={() => onNavigate('crop-marketplace')}
        />
      </div>

      {/* AI Decision Support Banner */}
      <div className="p-5 bg-gradient-to-r from-farm-900 via-farm-800 to-farm-950 text-white rounded-3xl shadow-md border border-farm-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  AI Decision Engine
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                  Grounded in Live Data
                </span>
              </div>
              <p className="text-sm text-slate-100 mt-1 font-medium leading-relaxed max-w-2xl">
                {aiInsights.topExpenseCategory ? (
                  <>
                    <strong>{aiInsights.topExpenseCategory.category}</strong> accounts for{' '}
                    <strong>{aiInsights.topExpenseCategory.percentage}%</strong> of your farm spending.{' '}
                    {aiInsights.savingsRecommendation}
                  </>
                ) : (
                  'Review your buyer bids and equipment rentals to optimize seasonal margins.'
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai-assistant')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-farm-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
          >
            <span>Ask AI Farm Assistant</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Charts Section: Income vs Expense Trend & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Monthly Financial Trends */}
        <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Monthly Cash Flow Trend</h3>
              <p className="text-xs text-slate-500">Income vs Expenses based on actual recorded transactions</p>
            </div>
            <button
              onClick={() => onNavigate('expense-tracker')}
              className="text-xs font-bold text-farm-700 hover:text-farm-900 flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <RechartsTooltip 
                  formatter={(val: any) => [formatINR(Number(val) || 0), '']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Income" fill="#15803D" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#D97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Col: Expense Breakdown */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Expense Distribution</h3>
              <button
                onClick={() => onNavigate('expense-tracker')}
                className="text-xs font-bold text-farm-700"
              >
                Budgets
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Category allocation across season</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenses.slice(0, 5)}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                  >
                    {categoryExpenses.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val: any) => formatINR(Number(val) || 0)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categoryExpenses.slice(0, 4).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} 
                  />
                  <span className="text-slate-700 font-medium truncate max-w-[120px]">{cat.category}</span>
                </div>
                <span className="font-bold text-slate-900">{formatINR(cat.amount)} ({cat.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Active Crop Bids & Loan Audit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Crop Marketplace Bids */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending Crop Buyer Bids</h3>
              <p className="text-xs text-slate-500">Live inquiries with transport and net proceed estimates</p>
            </div>
            <button
              onClick={() => onNavigate('crop-marketplace')}
              className="text-xs font-bold text-farm-700 hover:text-farm-900 flex items-center gap-1"
            >
              <span>Marketplace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {cropOffers.slice(0, 3).map((offer) => {
              const grossVal = offer.offeredPricePerUnit * offer.requestedQuantity;
              const netProceeds = grossVal - offer.estimatedTransportCost - offer.disclosedCharges;

              return (
                <div
                  key={offer.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-farm-300 transition-all bg-cream-50/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{offer.cropName}</h4>
                      <p className="text-xs text-slate-500">{offer.companyName}</p>
                    </div>
                    <Badge
                      label={offer.status}
                      variant={offer.status === 'Accepted' ? 'green' : 'amber'}
                      size="sm"
                    />
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Offered Price: </span>
                      <strong className="text-slate-900">₹{offer.offeredPricePerUnit}/qtl</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Net Proceeds: </span>
                      <strong className="text-farm-800">{formatINR(netProceeds)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loan Comparison Preview */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Loan Offers Under Comparison</h3>
              <p className="text-xs text-slate-500">Calculated with standard amortizing EMI formula</p>
            </div>
            <button
              onClick={() => onNavigate('loan-comparison')}
              className="text-xs font-bold text-farm-700 hover:text-farm-900 flex items-center gap-1"
            >
              <span>Compare All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {loanOffers.slice(0, 3).map((loan) => {
              const metrics = calculateLoanMetrics(loan);
              return (
                <div
                  key={loan.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-farm-300 transition-all bg-cream-50/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{loan.lenderName}</h4>
                      <p className="text-xs text-slate-500">{loan.loanProductName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900">
                        {formatINR(metrics.monthlyEmi)}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                      </div>
                      <div className="text-[10px] text-farm-700 font-bold">{loan.annualInterestRate}% {loan.interestType}</div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">Principal: </span>
                      <strong>{formatINR(loan.principalAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Net Disbursed: </span>
                      <strong className="text-farm-800">{formatINR(metrics.estimatedNetDisbursed)}</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
